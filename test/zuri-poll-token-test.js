const { expect } = require("chai");
const { ethers } = require("hardhat");
const { string } = require("hardhat/internal/core/params/argumentTypes");


require("@nomiclabs/hardhat-waffle"); 

   describe("ZuriPollToken", function () {
      
         
   beforeEach(async function () {
    const ZuriPollToken = await hre.ethers.getContractFactory("ZuriPollToken");
   
    const zuriPollToken = await ZuriPollToken.deploy("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await zuriPollToken.deployed();
    

    [owner, addr1, addr2] = await ethers.getSigners();
    
    });

    it("It should deploy successfully", async function (){
      console.log("success");
    });


    
    
  });



  






