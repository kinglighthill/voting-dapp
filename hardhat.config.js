/* eslint-disable no-undef */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");

require('dotenv').config()

const { API_URL_ALCHEMY, METAMASK_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const defaultNetwork = "rinkeby"

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: `${defaultNetwork}`,
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: API_URL_ALCHEMY,
      accounts: [METAMASK_PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: `${ETHERSCAN_API_KEY}`
  },
  paths: {
    artifacts: './src/artifacts',
  }
};