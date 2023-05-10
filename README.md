# DEI Token Exploit

This project demonstrates an exploit related to the DEI Token.

To simplify the process without impacting the exploit, certain changes have been made. The smart contract used in this project is a basic implementation of `ERC20` and is not upgradeable. Two functions responsible for the exploit, namely `burn` and `burnFrom`, are created within the `ERC20` smart contract to gain access to the private variable `_allowances`.

The mistake leading to the exploit lies in the interchange of arguments within `_allowances[_msgSender()][account]`.

note: the exploit works with amount 0 since `burn` doens't check the amount to be burnt.

To execute the exploit, we first acquire some DEI tokens. This can be achieved by either purchasing them or obtaining them through a flash loan. In the latter case, we need to create an attacker smart contract to perform all the required actions within the same transaction while holding the DEI tokens obtained through the flash loan.

Next, we need to identify an address that possesses a DEI token balance. We grant this address an allowance equivalent to our own balance. This allows us to steal nearly the entirety of our DEI token balance.

Once the allowance is set, we invoke the `burnFrom` function, providing the address we granted the allowance to and specifying an amount of 1. The function's code allows us to approve, on behalf of the chosen address, an amount that is 1 less than the approved balance (the amount to be burned).

Finally, we transfer the approved amount to ourselves, resulting in a balance of 0 for the attacked address. To ensure that the allowance cannot be retrieved, we call `approve` with the attacked address and an amount of 0.

## To execute this repo

Make sure you have the necessary dependencies installed

```shell
npx hardhat test
```

To run the exploit:

```shell
npx hardhat test
```
