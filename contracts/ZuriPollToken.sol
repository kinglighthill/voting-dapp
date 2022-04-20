//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZuriPollToken is ERC20 {
    address owner;
    uint256 tokensPerEther = 1000;

    constructor(address _owner) ERC20("ZuriPollToken", "ZPT") { 
        owner = _owner;
        _mint(owner, convertToDecimals(1000000));
    }

    
    function convertToDecimals(uint256 value) private view returns(uint256) {
        return value * 10 ** decimals(); 
    }

    function buyToken() public payable {
        uint256 tokens = msg.value * tokensPerEther;
        transferFrom(owner, msg.sender, tokens);
    }
}