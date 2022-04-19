//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract ZuriPoll {
    enum Role { CHAIRMAN, TEACHERS, STUDENTS }

    enum PositionType { PAID, FREE }

    event SetUpElection();

    event StartElection();
    
    event EndElection();

    event Voted();

    event StakeHolderAdded();

    event ShowResult();

    struct Stakeholder {
        address id;
        Role role;
    }

    struct Candidate {
        string manifesto;
        uint256 votes;
    }

    struct Poll {
        uint256 id;
        string position;
        string description;
        PositionType positionType;
        mapping(address => Candidate) contestants;
        uint256 fee; 
        address[] voters;
    }

    struct Polls {
        uint256 id;
        address creator;
        Polls[] polls;
        bool enabled;
    }

    address public owner;

    Stakeholder[] public stakeholders;
    

    constructor() {

    }

    function createsElection() public {
        // only admin/chairman can create the election
        // adds the different positions available and roles that can vie and cost of each post
        // sets election date
    }

    function addChairman() public {

    }

    function transferChairmanship() public { 
        // only owner and chairman can transfer chairman to another person
    }

    function addStakeholder() public {
        // add a single stakeholder and their role
        // only owner, chairman and teachers can add stakeholder
    }

    function addStakeholders() public {
        // batch add of stakeholders and their roles
        // only owner, chairman and teachers can add stakeholder
    }

    function declareInterest() public {
        // allows stakeholders to declare interest 
        // only eligible stakeholders can declare interest
    }

    function vote() public {
        // for voting
        // anyone can vote
    }

    function enableVoting() public {
        // enables voting
        // only chairman can enable voting
    }

    function disableVoting() public {
        // disables voting
        // only chairman can disable voting
    }

    function compileResult() public {
        // compiles the election result
        // only chairman and teachers can compile result 
    }

    function showResult() public {
        // make result public
        // only chairman and teachers can make election result public
    }
}