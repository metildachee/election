pragma solidity >=0.4.20;

contract Election {
    // model a candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // store candidates
    // fetch candidates
    mapping(uint256 => Candidate) public candidates; // solidity will give us getters and setters

    // store candidates count => not possible to loop through the above mapping, since the above mappings will return empty structs
    uint256 public candidatesCount;

    constructor() public {
        addCandidate("candidate 1");
        addCandidate("candidate 2");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
}
