// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.4;

// Interface used in Bridge
interface IToken {
    function mint(address to, uint256 amount) external;

    function burn(address owner, uint256 amount) external;
}
