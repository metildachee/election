const _deploy_contracts = require("../migrations/2_deploy_contracts");

var Election = artifacts.require("./Election.sol");

contract("Election", account => {
    var electionInstance; // to have scope within the contract, so we have access within the entire Promise chain

    it("intializes with two candidates", () => {
        return Election.deployed().then(i => {
            return i.candidatesCount();
        }).then(c => { assert.equal(c, 2); });
    });

    it("it initializes the candidates with the correct values", () => {
        return Election.deployed().then(i => {
            electionInstance = i; 
            return electionInstance.candidates(1);
        }).then(candidate => {
            assert.equal(candidate.id, 1, "contains the correct id");
            assert.equal(candidate.name, "candidate 1", "contains the correct name");
            assert.equal(candidate.voteCount, 0, "contains the correct vote count");
            return electionInstance.candidates(2);
        }).then(candidate => {
            assert.equal(candidate.id, 2, "contains the correct id");
            assert.equal(candidate.name, "candidate 2", "contains the correct name");
            assert.equal(candidate.voteCount, 0, "contains the correct vote count");
        });
    });
});

