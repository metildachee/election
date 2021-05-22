var Election = artifacts.require("./Election.sol");
// gives us an artifact and truffle exposes this for FE, testing on the blockchain
module.exports = function(deployer) {
  deployer.deploy(Election);
};
