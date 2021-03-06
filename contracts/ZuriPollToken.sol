//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZuriPollToken is ERC20 {
    address public owner;
    uint256 public tokensPerEther = 1000;

    constructor(address _owner) ERC20("ZuriPollToken", "ZPT") { 
        owner = _owner;
        _mint(owner, convertToDecimals(1000000));
    }

    
    function convertToDecimals(uint256 value) private view returns(uint256) {
        return value * 10 ** decimals(); 
    }

    function buyToken() public payable {
        uint256 tokens = msg.value * tokensPerEther;
        _approve(owner, msg.sender, tokens);
        transferFrom(owner, msg.sender, tokens);
    }

    function changeTokensPerEther(uint256 rate) public {
        tokensPerEther = rate;
    }
}