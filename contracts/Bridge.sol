// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Interfaces/IToken.sol";

contract Bridge {
    address public admin;
    IToken public token;
    uint256 public nonce;
    mapping(uint256 => bool) processedNonces;

    enum Step {
        Mint,
        Burn
    }
    event Transfer(
        address from,
        address to,
        uint256 amount,
        uint256 date,
        uint256 nonce,
        Step indexed step
    );

    constructor(address _token) {
        admin = msg.sender;
        token = IToken(_token);
    }

    function burn(address to, uint256 amount) external {
        token.burn(msg.sender, amount);
        emit Transfer(
            msg.sender,
            to,
            amount,
            block.timestamp,
            nonce,
            Step.Burn
        );
    }

    function mint(
        address to,
        uint256 amount,
        uint256 destinationChainNonce
    ) external {
        require(msg.sender == admin, "Only admin can call this function");
        require(
            processedNonces[destinationChainNonce] == false,
            "Transfer already processed"
        );
        processedNonces[destinationChainNonce] = true;
        token.mint(to, amount);
        emit Transfer(
            msg.sender,
            to,
            amount,
            block.timestamp,
            destinationChainNonce,
            Step.Mint
        );
    }
}
