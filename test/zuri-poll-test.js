const { Contract } = require("ethers");

require("@nomiclabs/hardhat-waffle"); 

describe("ZuriPoll", function () {
    let contract;
    let owner;
    let zuriPoll;
    let stakeholders;
   
      
beforeEach(async function () {
 const ZuriPoll = await hre.ethers.getContractFactory("ZuriPollToken");
 [owner, addr1, addr2] = await ethers.getSigners();
zuriPoll = await ZuriPoll.deploy(owner.address);
 await zuriPoll.deployed();
 
 });

 it("It should deploy successfully", async function (){
   console.log("success");
 });



 
 
});