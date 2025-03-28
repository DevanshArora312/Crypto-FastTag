require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-ethers');
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-mainnet.g.alchemy.com/v2/wikAoAzZTZw09Xo6GjxRl3ZOL2dmwKBu`,
      accounts: ["f1e0cef316fdf38c41c62bffea4971b8a0805861586bdfa87834c4d48598d119"]
    },
    localhost: {
      url: "http://127.0.0.1:8545/"
    } 
  },
  settings: {
    viaIR: true,
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
