// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.4;

import "./ERC20.sol";

contract SourceChainToken is TokenERC20 {
    constructor() TokenERC20("SourceChainToken", "SCT") {}
}
