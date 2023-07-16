require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const numberOfAddresses = 1
const MNEMONIC=process.env.MNEMONIC;

const setupWallet = (url) => {
  return new HDWalletProvider({
    mnemonic: MNEMONIC,
    providerOrUrl: url,
    numberOfAddresses
  });
}

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
      network_id: '1313161555',
      gas: 10000000,
      deploymentPollingInterval: 8000,
      timeoutBlocks: 500,
      confirmations: 10,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Spécifiez ici la version de Solidity que vous souhaitez utiliser
    },
  },
};