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
    mapping(address => bool) public voters;

    // store candidates count => not possible to loop through the above mapping, since the above mappings will return empty structs
    uint256 public candidatesCount;

    event votedEvent(uint256 indexed _candidateId);

    constructor() public {
        addCandidate("candidate 1");
        addCandidate("candidate 2");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint256 _candidateId) public {
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        voters[msg.sender] = true; // solidity will give us a special way to access the sender
        candidates[_candidateId].voteCount++;
        emit votedEvent(_candidateId);
    }
}
