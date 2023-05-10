const fs = require('fs');
const path = require('path');

function readFirstItemInFolder(folderPath: string) {
  const folderContents = fs.readdirSync(folderPath);

  if (folderContents.length > 0) {
    const firstItemPath = path.join(folderPath, folderContents[0]);
    const firstItemContent = fs.readFileSync(firstItemPath, 'utf8');
    const contracts = JSON.parse(firstItemContent).output.sources;
    return Object.entries(contracts).map(([key, value]) => value);
  }

  return null;
}

// Example usage
const ignoredFunctions = [
  'approve',
  'increaseAllowance',
  'decreaseAllowance',
  '_spendAllowance',
];

const folderPath = 'artifacts/build-info';

const firstItemContent: any = readFirstItemInFolder(folderPath);

if (!firstItemContent) {
  console.log('No compiled smart contract found');
  process.exit();
}

for (let i = 0; i < firstItemContent.length; i++) {
  const { ast } = firstItemContent[i];
  if (!ast.absolutePath.startsWith('@openzeppelin')) {
    console.log(ast.absolutePath);
    for (let j = 0; j < ast.nodes.length; j++) {
      const nodesWithValue = ast.nodes[j].nodes;
      //&& nodesWithValue.hasOwnProperty('body')
      if (nodesWithValue) {
        for (let x = 0; x < nodesWithValue.length; x++) {
          const subNode = nodesWithValue[x];
          if (
            subNode.hasOwnProperty('body') &&
            !ignoredFunctions.includes(subNode.name)
          ) {
            const { statements } = subNode.body;
            if (statements) {
              for (let z = 0; z < statements.length; z++) {
                const statement = statements[z];

                if (
                  statement &&
                  statement.expression &&
                  statement.expression.arguments &&
                  (statement.expression.arguments[1] != 'msg' ||
                    statement.expression.arguments[1] != '_msgSender') &&
                  statement.expression.expression &&
                  statement.expression.expression.name == '_approve'
                ) {
                  console.log(
                    'WARNING: function ' +
                      subNode.name +
                      ' is using _approve without msg.sender as a first parameter, make sure it is an expected behavior'
                  );
                }
              }
            }
          }
        }

        console.log(
          '-----------------------------------------------------------------------------------'
        );
      }
    }
  }
}
firstItemContent.value;
