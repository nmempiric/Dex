// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract CustomToken is ERC20 {
    address public owner;

    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        owner = msg.sender;
        console.log("sender==========", msg.sender);
        _mint(msg.sender, initialSupply * (10 ** uint256(decimals())));
    }

}
