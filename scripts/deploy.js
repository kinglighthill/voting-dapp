const { ethers } = require("hardhat");
const fs = require('fs')

const contractName = "ZuriPoll"
const tokenContractName = "ZuriPollToken"

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  
  let contractFactory = await ethers.getContractFactory(contractName)

  let contract = await contractFactory.deploy()

  let addressJSON = JSON.stringify({
    "contractAddress": contract.address,
  })

  console.log("Contract address is : ", contract.address)
  await contract.deployed()

  writeAddressAndAbiToFile(contractName, addressJSON)

  contractFactory = await ethers.getContractFactory(tokenContractName)

  contract = await contractFactory.deploy(contract.address)

  addressJSON = JSON.stringify({
    "contractAddress": contract.address,
  })

  console.log("Token contract address is : ", contract.address)
  await contract.deployed()

  writeAddressAndAbiToFile(tokenContractName, addressJSON)
}

const writeAddressAndAbiToFile = (name, address) => {
  const abi = fs.readFileSync(`src/artifacts/contracts/${name}.sol/${name}.json`);

  fs.writeFileSync(`./src/contracts/${name}_abi.json`, abi);
  fs.writeFileSync(`./src/contracts/${name}_contract_address.json`, address)
}

const runMain = async () => {
    try {
      await main()
      process.exit(0)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
}
  
runMain()