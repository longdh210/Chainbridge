// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.4;

import "./Bridge.sol";

contract SourceChainBridge is Bridge {
    constructor(address token) Bridge(token) {}
}
