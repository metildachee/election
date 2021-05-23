App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () { // Connects our client to local blockchain
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () { // Loads up our contract into the FE code
    $.getJSON("Election.json", function (election) { // This works because we are using the browserSync pkg that comes with Truffle package
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) { // this is how we watch the events
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();

    /* Load account data
    getCoinbase provides us the account that we are connected to the blockchain with */
    // web3.eth.getCoinbase(function (err, account) {
    //   if (err === null) {
    //     App.account = account;
    //     $("#accountAddress").html("Your Account: " + account);
    //     console.log("account id");
    //     console.log(account);
    //   }
    // });
    if (window.ethereum) {
      ethereum.enable().then(function (acc) {
        App.account = acc[0];
        $("#accountAddress").html("Your Account: " + App.account);
      });
    }

    // Load contract data
    App.contracts.Election.deployed().then(function (instance) {
      electionInstance = instance;
      console.log(electionInstance)
      return electionInstance.candidatesCount();
    }).then(function (candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      console.log("candidate count", candidatesCount)
      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function (candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      // return electionInstance.candidates(App.account);
      return electionInstance.voters(App.account);
    }).then(function (hasVoted) {
      // Do not allow a user to vote
      if (hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    });
  },

  castVote: function () {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function (result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
