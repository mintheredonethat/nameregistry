// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import namereg_artifacts from '../../build/contracts/NameRegistry.json'

// NameRegistry is our usable abstraction, which we'll use through the code below.
var NameRegistry = contract(namereg_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    NameRegistry.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      // self.refreshRegistry();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  // Have to figure out how to iterate over a mapping
  //
  // refreshRegistry: function() {
  //   var self = this;
  //
  //   NameRegistry.deployed().then(function(instance) {
  //     return instance.addresses().length;
  //   }).then(function(response) {
  //     var length = document.getElementById("registry-length");
  //     length.innerHTML = response;
  //   }).catch(function(e) {
  //     console.log(e);
  //     self.setStatus("Error: see log");
  //   })
  // },

  register: function() {
    var self = this;
    var name = document.getElementById("name").value;
    var address = document.getElementById("address").value;

    this.setStatus("Registering Name/Address Pair...");

    NameRegistry.deployed().then(function(instance) {
      return instance.register(name, address, {from: account});
    }).then(function() {
      self.setStatus("Registration Complete");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error: Check Log");
    })

    // Robhitchen's Approach
    // NameRegistry.deployed().then(function(instance) {
    //   return instance.addUser(address, name, {from: account});
    // }).then(function() {
    //   self.setStatus('Registration Complete');
    //   return instance.getUser(address);
    // }).then(function() {
    //   console.log(instance.getUser(address));
    // }).catch(function(e) {
    //   console.log(e);
    //   self.setStatus('Error logged');
    // })
  },

  // getAll: function() {
  //   var self = this;
  //   var count = 0;
  //
  //   NameRegistry.deployed().then(function(instance) {
  //     count = instance.getUserCount({ from: account });
  //   }).then(function() {
  //     console.log(count);
  //
  //     for (var i = 0; i < count; i++) {
  //       var userAddr;
  //       instance.getUserAtIndex(i, {from: account}).then(function(r) {
  //         var userAddr = r;
  //         console.log(userAddr);
  //       })
  //     }
  //   })
  //   //
  //   //
  //   //   console.log(count);
  //   //   for (var i = 0; i < count; i++) {
  //   //     var userAddr = instance.getUserAtIndex(i, {from: account} );
  //   //     console.log(userAddr);
  //   //     var userDetails = instance.getUser( {from: account} );
  //   //     console.log(userDetails);
  //   //   }
  //   //   self.setStatus('Fetched; check log');
  //   // }).catch(function(e) {
  //   //   console.log(e);
  //   //   self.setStatus("error logged")
  //   // })
  // },

  getAddress: function() {
    var self = this;
    var registeredName = document.getElementById("registeredName").value;

    this.setStatus("Fetching Address...");

    NameRegistry.deployed().then(function(instance) {
      return instance.addressOf(registeredName);
    }).then(function(r) {
      self.setStatus(r);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error: Check Log");
    })
  },

  getName: function() {
    var self = this;
    var registeredAddress = document.getElementById("registeredAddress").value;

    this.setStatus("Fetching Name...");

    NameRegistry.deployed().then(function(instance) {
      return instance.nameOf(registeredAddress);
    }).then(function(r) {
      self.setStatus(web3.toAscii(r));
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error: Check Log");
    })
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
