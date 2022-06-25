// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.4;

import "./TokenERC20.sol";

contract DestinationChainToken is TokenERC20 {
    constructor() TokenERC20("DestinationChainToken", "DCT") {}
}
