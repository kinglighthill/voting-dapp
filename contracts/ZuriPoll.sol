//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./ZuriPollToken.sol";

contract ZuriPoll {
    enum Role { CHAIRMAN, ADMIN, TEACHER, STUDENT }

    event StakeHolderAdded(address addedBy, uint256 timeAdded, bool added);

    event StakeHolderRemoved(address removedBy, uint256 timeRemoved, bool removed);

    event ChairmanChanged(bool isStakeholder, bool chairmanExists, uint256 timeChanged);

    struct Stakeholder {
        address id;
        Role role;
        string name;
    }

    struct Candidate {
        address id;
        string manifesto;
        bool disqualified;
        // address[] voters;
    }

    struct Poll {
        uint256 id;
        string position;
        string description;
        Role roleLimit;
        // Candidate[] contestants;
        uint256 totalVotes;
        address winner;
    }

    struct Election {
        uint256 id;
        address creator;
        // Poll[] polls;
        bool enabled;
        bool show;
        uint256 timeCreated;
    }

    address public owner;

    Stakeholder[] internal stakeholders;

    Election[] internal elections;

    uint256 internal electionId = 0;
    uint256 internal pollId = 0;

    mapping(uint256 => Poll[]) internal polls;
    mapping(uint256 => Candidate[]) internal contestants;
    mapping(address => address[]) internal electorates;
    

    constructor() { 
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;    
    }

    modifier onlyChairman() {
        bool _isChairman = isChairman(msg.sender);

        require(_isChairman, "Only chairman can call this function");
        _;    
    }

    modifier onlyOwnerAndChairman() {
        bool _isChairman = isChairman(msg.sender);

        require(msg.sender == owner || _isChairman, "Only owner and chairman can call this function");
        _;    
    }

    modifier onlyOwnerChairmanAndAdmins() {
        bool _isChairman = isChairman(msg.sender);
        bool _isAdmin = isAdmin(msg.sender);

        require(msg.sender == owner || _isChairman || _isAdmin, "Only owner, chairman and admins can call this function");
        _;    
    }

    modifier onlyChairmanAdminsAndTeachers() {
        bool _isChairman = isChairman(msg.sender);
        bool _isAdmin = isAdmin(msg.sender);
        bool _isTeacher = isTeacher(msg.sender);

        require(_isChairman || _isAdmin || _isTeacher, "Only chairman, admins and teachers can call this function");
        _;    
    }

    modifier validAddress(address _address) {
        require(_address != address(0), "Invalid Address");
        _;
    }

    function addChairman(address _chairman, string memory _name) public onlyOwner validAddress(_chairman) {
        // only owner can add chairman

        bool added = addStakeHolder(_chairman, 0, _name);
        if (added) emit StakeHolderAdded(msg.sender, block.timestamp, added);
    }

    function transferChairmanship(address _chairman) public onlyOwnerAndChairman validAddress(_chairman) { 
        // only owner and chairman can transfer chairman to another person
        (bool _isStakeholder, uint256 stakeholderPosition) = isStakeHolder(_chairman);
        (bool _isChairman, uint256 chairmanPosition) = getChairman();

        if (_isStakeholder && _isChairman && stakeholders[chairmanPosition].role != Role.TEACHER 
            && stakeholders[chairmanPosition].role != Role.STUDENT) {
                Stakeholder storage newChairman = stakeholders[stakeholderPosition];
                newChairman.role = Role.CHAIRMAN;
                Stakeholder storage oldChairman = stakeholders[chairmanPosition];
                oldChairman.role =  Role.ADMIN;

                stakeholders[stakeholderPosition] = newChairman;
                stakeholders[chairmanPosition] = oldChairman;

                emit ChairmanChanged(_isStakeholder, _isChairman, block.timestamp);
        }
    }

    function getChairman() public view returns(bool, uint256) { 
        for (uint256 i = 0; i < stakeholders.length; i++) {
            if (stakeholders[i].role == Role.CHAIRMAN) return (true, i);
        }

        return (false, 0);
    }

    function isChairman(address _stakeholder) public validAddress(_stakeholder) view returns(bool) { 
        (bool _isChairman, uint256 position) = getChairman();

        return _isChairman && _stakeholder == stakeholders[position].id;
    }

    function isStakeHolder(address _stakeholder) public validAddress(_stakeholder) view returns(bool, uint256) { 
        for (uint256 i = 0; i < stakeholders.length; i++) {
            if (_stakeholder == stakeholders[i].id) return (true, i);
        }

        return (false, 0);
    }

    function isAdmin(address _stakeholder) public validAddress(_stakeholder) view returns(bool) { 
        (bool _isStakeholder, uint256 position) = isStakeHolder(_stakeholder);

        return _isStakeholder && stakeholders[position].role == Role.ADMIN;
    }

    function isTeacher(address _stakeholder) public validAddress(_stakeholder) view returns(bool) { 
        (bool _isStakeholder, uint256 position) = isStakeHolder(_stakeholder);

        return _isStakeholder && stakeholders[position].role == Role.TEACHER;
    }

    function totalStakeHolders() public view returns(uint256) {
        return stakeholders.length;
    }

    function addStakeholder(address _stakeholder, uint256 _role, string memory _name) public onlyOwnerChairmanAndAdmins validAddress(_stakeholder) {
        // add a single stakeholder and their role
        // only owner, chairman and teachers can add stakeholder

        bool added = addStakeHolder(_stakeholder, _role, _name);
        if (added) emit StakeHolderAdded(msg.sender, block.timestamp, added);
    }

    function removeStakeholder(address _stakeholder) public onlyOwnerChairmanAndAdmins {
        // batch remove of stakeholder and their role
        // only owner, chairman and teachers can remove stakeholder

        bool removed = removeStakeHolder(_stakeholder);
        if (removed) emit StakeHolderRemoved(msg.sender, block.timestamp, removed);
    }

    function getStakeholders() public view returns(Stakeholder[] memory) { 
        return stakeholders;
    }    

    function createsElection(string[] calldata _positions, string[] calldata _descriptions, 
        uint256[] calldata _roleLimits) 
        public onlyChairmanAdminsAndTeachers {
        // only admin/chairman can create the election
        // adds the different positions available and roles that can vie and cost of each post
        // sets election date

        require(_positions.length == _descriptions.length, "Invalid input parameters");
        require(_positions.length == _roleLimits.length, "Invalid input parameters");

        require(_positions.length <= 20, "exceeds number of allowed inputs");

        Poll[] storage _polls = polls[electionId];

        for(uint256 i = 0; i < _positions.length; i++) {
            Role roleLimit;

            if (_roleLimits[i] == 1) {
                roleLimit = Role.ADMIN;
            } else if (_roleLimits[i] == 2) {
                roleLimit = Role.TEACHER;
            } else {
                roleLimit = Role.STUDENT;
            }

            Poll memory poll = Poll(pollId, _positions[i], _descriptions[i], roleLimit, 0, address(0));
            _polls.push(poll);

            pollId += 1;
        }

        (bool _electionExists, ) = electionExists(electionId);

        if (!_electionExists) {
            elections.push(Election(electionId, msg.sender, false, false, block.timestamp));
            polls[electionId] = _polls;

            electionId += 1;
        }
    }

    function declareInterest(uint256 _electionId, uint256 _pollId, string calldata _manifesto) public {
        // allows stakeholders to declare interest 
        // only eligible stakeholders can declare interest

        (bool _electionExists, ) = electionExists(_electionId);

        if (_electionExists) {
            Poll[] storage pollsArray = polls[_electionId];

            (bool _pollExists, uint256 _pollPosition) = pollExists(_pollId, pollsArray);

            if (_pollExists) {
                Poll storage _poll = pollsArray[_pollPosition];
                
                // if (canVie(msg.sender, _poll.roleLimit)) {    
                    (bool _candidateExists, ) = candidateExists(msg.sender, contestants[_poll.id]);

                    if (!_candidateExists) {
                        // checks if position is free or paid check balance and transfer fee to contract
                        Candidate memory _candidate = Candidate(msg.sender, _manifesto, false);
                        Candidate[] storage _contestants = contestants[_poll.id];
                        _contestants.push(_candidate);
                        contestants[_poll.id] = _contestants;
                    }
                // }
            }
        }
    }

    function vote(uint256 _electionId, uint256 _pollId, address _candidate) public {
        // for voting
        // anyone can vote

        (bool _electionExists, ) = electionExists(_electionId);

        if (_electionExists) {
            (bool _pollExists, uint256 _pollPosition) = pollExists(_pollId, polls[_electionId]);

            if (_pollExists) {
                Poll storage _poll = polls[_electionId][_pollPosition];  
                    
                (bool _candidateExists, uint256 _candidatePosition) = candidateExists(_candidate, contestants[_poll.id]);

                if (_candidateExists) {
                    Candidate storage candidate = contestants[_poll.id][_candidatePosition];
                    (bool _voterExists, ) = voterExists(msg.sender, electorates[candidate.id]);

                    if (!_voterExists) {
                        // check balance and transfer token to contract
                        address[] storage voters = electorates[candidate.id];
                        voters.push(msg.sender);

                        electorates[candidate.id] = voters;
                    }
                }
            }
        }
    }

    function enableVoting(uint256 _id) public onlyChairman {
        // enables voting
        // only chairman can enable voting

        (bool _electionExists, uint256 position) = electionExists(_id);

        if (_electionExists) {
            elections[position].enabled = true;
        }
    }

    function disableVoting(uint256 _id) public onlyChairman {
        // disables voting
        // only chairman can disable voting

        (bool _electionExists, uint256 position) = electionExists(_id);

        if (_electionExists) {
            elections[position].enabled = false;
        }
    }

    function showResult(uint256 _id) public onlyOwnerChairmanAndAdmins {
        // compiles the election result
        // only chairman and teachers can compile result 

        (bool _electionExists, uint256 position) = electionExists(_id);
        if (_electionExists) {
            Election memory _polls = elections[position];

            require(!_polls.enabled, "Voting has not ended");

            Poll[] memory _innerPolls = polls[_id];

            for(uint256 i = 0; i < _innerPolls.length; i++) {
                Poll memory _poll = _innerPolls[i];
                Candidate[] memory _candidates = contestants[_poll.id];
                
                uint256 maxVote = 0;
                
                for(uint256 j = 0; j < _candidates.length; j++) { 
                    if (electorates[_candidates[j].id].length > maxVote) {
                        maxVote = electorates[_candidates[j].id].length;
                        _poll.winner = _candidates[j].id;
                    } else if (electorates[_candidates[j].id].length == maxVote) {
                        _poll.winner = address(0);
                    }
                }

                _innerPolls[i] = _poll;
            }
            elections[position].show = true;
        }
    }

    function addStakeHolder(address _stakeholder, uint256 _role, string memory _name) internal returns(bool) {
        (bool _isStakeholder, ) = isStakeHolder(_stakeholder);

        if (!_isStakeholder) {
            Role role;

            if (_role == 0) {
                role = Role.CHAIRMAN;
            } else if (_role == 1) {
                role = Role.ADMIN;
            } else if (_role == 2) {
                role = Role.TEACHER;
            } else {
                role = Role.STUDENT;
            }

            stakeholders.push(Stakeholder( _stakeholder, role, _name));

            return true;
        }

        return false;
    }

    function removeStakeHolder(address _stakeholder) public returns(bool) {
        (bool _isStakeholder, uint256 position) = isStakeHolder(_stakeholder);

        if (_isStakeholder) {
            stakeholders[position] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();

            return true;
        }

        return false;
    }

    function getElections() public view returns(Election[] memory) {
        return elections;
    }

    function getPolls(uint256 _id) public view returns(Poll[] memory) {
        return polls[_id];
    }

    function getCandidates(uint256 _id) public view returns(Candidate[] memory) {
        return contestants[_id];
    }

    function getVoters(address _id) public view returns(address[] memory) {
        return electorates[_id];
    }

    function electionExists(uint256 _id) internal view returns(bool, uint256) { 
        for (uint256 i = 0; i < elections.length; i++) {
            if (_id == elections[i].id) return (true, i);
        }

        return (false, 0);
    }

    function pollExists(uint256 _id, Poll[] memory _polls) internal pure returns(bool, uint256) { 
        for (uint256 i = 0; i < _polls.length; i++) {
            if (_id == _polls[i].id) return (true, i);
        }

        return (false, 0);
    }

    function candidateExists(address _id, Candidate[] memory _candidates) internal pure returns(bool, uint256) { 
        for (uint256 i = 0; i < _candidates.length; i++) {
            if (_id == _candidates[i].id && !_candidates[i].disqualified) return (true, i);
        }

        return (false, 0);
    }

    function voterExists(address _id, address[] memory _voters) internal pure returns(bool, uint256) { 
        for (uint256 i = 0; i < _voters.length; i++) {
            if (_id == _voters[i]) return (true, i);
        }

        return (false, 0);
    }
}