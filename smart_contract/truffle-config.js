require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    aurora: {
      provider: () => setupWallet('https://testnet.aurora.dev'),
      network_id: 0x4e454153,
      gas: 10000000,
      from: '0x6A33382de9f73B846878a57500d055B981229ac4' // CHANGE THIS ADDRESS
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Spécifiez ici la version de Solidity que vous souhaitez utiliser
    },
  },
};