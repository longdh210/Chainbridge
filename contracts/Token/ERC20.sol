// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

contract TokenERC20 is ERC20 {
    // address public admin;

    // // Set admin to increase security (later update)
    // constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    //     admin = msg.sender;
    // }
    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {
        _mint(msg.sender, 1000000);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address owner, uint256 amount) external {
        _burn(owner, amount);
    }

    // Lock amount of token mint to new chain
    function lock(
        address owner,
        address recipdent,
        uint256 amount
    ) external {
        _transfer(owner, recipdent, amount);
    }

    // Release token when it is return
    function release(address recipdent, uint256 amount) external {
        transfer(recipdent, amount);
    }
}
