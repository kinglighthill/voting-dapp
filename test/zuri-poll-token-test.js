const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { string } = require("hardhat/internal/core/params/argumentTypes");


require("@nomiclabs/hardhat-waffle"); 
   describe("ZuriPollToken", function () {
    let ZuriPollToken;
    // let owner;
    // let address;
    // let addr1;
    // let addr2;
  
         
   beforeEach(async function () {
    const ZuriPollToken = await hre.ethers.getContractFactory("ZuriPollToken");
   
    const zuriPollToken = await ZuriPollToken.deploy("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await zuriPollToken.deployed();
    

    [owner, addr1, addr2] = await ethers.getSigners();
    
    });

    it("It should deploy successfully", async function (){
      console.log("success");
    });

    
    it("should deploy total supply for owner of contract", async function () {
      const ownerBalance = await ZuriPollToken.balanceOf("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
      console.log();
      // expect(await zuriPollToken.totalSupply()).to.equal(ownerBalance);
    })

  });



  




//  describe("Deploying the Token", function () {
//   it("it should deploy", async function ()  {
//     const ZuriPollToken = await hre.ethers.getContractFavtory("ZuriPollToken");
//     const zuriPollToken = await ZuriPollToken.deploy(),
//     await zuriPollToken.deployed();
//   });
//  });


