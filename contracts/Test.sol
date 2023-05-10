// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Test {
    bool value = true;
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor(bool _value) {
        value = _value;
    }

    function burnFrom(address account, uint256 amount) public virtual {
        _approve(account, msg.sender, amount);
    }

    function _approve(address owner, address spender, uint amount) private {}
}
