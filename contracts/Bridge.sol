// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Interfaces/IToken.sol";
import "hardhat/console.sol";

contract Bridge {
    address public admin;
    IToken public token;
    uint256 public nonce;
    mapping(uint256 => bool) processedNonces;

    enum Step {
        Mint,
        Burn,
        Release,
        Lock
    }
    event Transfer(
        address from,
        address to,
        uint256 amount,
        uint256 date,
        uint256 nonce,
        Step indexed step
    );

    // Set admin to increase security (later update)
    constructor(address _token) {
        admin = msg.sender;
        token = IToken(_token);
    }

    // Burn token when it transfer to new chain
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
        nonce++;
    }

    // Lock token on the source chain
    function lock(address owner, uint256 amount) external payable {
        token.lock(owner, address(this), amount);
        emit Transfer(
            msg.sender,
            address(this),
            amount,
            block.timestamp,
            nonce,
            Step.Lock
        );
        nonce++;
    }

    // Mint token when another chain send to
    function mint(
        address to,
        uint256 amount,
        uint256 destinationChainNonce
    ) external {
        if (processedNonces[destinationChainNonce] == false) {
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
        } else {
            console.log(
                "Transfer of this nonce already processed: ",
                destinationChainNonce
            );
        }
    }

    function release(
        address recipient,
        uint256 amount,
        uint256 destinationChainNonce
    ) external {
        if (processedNonces[destinationChainNonce] == false) {
            processedNonces[destinationChainNonce] = true;
            token.release(recipient, amount);
            emit Transfer(
                msg.sender,
                recipient,
                amount,
                block.timestamp,
                destinationChainNonce,
                Step.Release
            );
        } else {
            console.log(
                "Transfer of this nonce already processed: ",
                destinationChainNonce
            );
        }
    }
}
