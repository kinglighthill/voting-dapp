//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract ZuriPollToken {
    constructor() {

    }

    function mint() public {


    // The following functions are overrides required by Solidity to.

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Snapshot)
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }


    function buyToken() public {
        
    }
}