const { Contract } = require("ethers");

require("@nomiclabs/hardhat-waffle"); 

describe("ZuriPoll", function () {
    let contract;
    let owner;
   
      
beforeEach(async function () {
 const ZuriPoll = await hre.ethers.getContractFactory("ZuriPollToken");

 const zuriPoll = await ZuriPoll.deploy("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
 await zuriPoll.deployed();
 

 [owner, addr1, addr2] = await ethers.getSigners();
 
 });

 it("It should deploy successfully", async function (){
   console.log("success");
 });

 




 
 
});