// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.4;

// Interface used in Bridge
interface IToken {
    function mint(
        // address tokenAddress,
        address to,
        uint256 amount
    ) external;

    function burn(
        // address tokenAddress,
        address owner,
        uint256 amount
    ) external;

    function lock(
        // address tokenAddress,
        address owner,
        address recipdent,
        uint256 amount
    ) external;

    function release(address recipient, uint256 amount) external;
}
