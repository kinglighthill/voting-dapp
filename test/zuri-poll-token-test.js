const { expect } = require("chai");
const { ethers } = require("hardhat");
const { string } = require("hardhat/internal/core/params/argumentTypes");


require("@nomiclabs/hardhat-waffle"); 

   describe("ZuriPollToken", function () {
     let contract;
     let zuriPollToken;
      
         
   beforeEach(async function () {
    const ZuriPollToken = await hre.ethers.getContractFactory("ZuriPollToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    zuriPollToken = await ZuriPollToken.deploy(owner.address);
    await zuriPollToken.deployed();
          
    });

    it("It should deploy successfully", async function (){
      console.log("success");
    });


    it("it should deploy with total token", async function () {
      const balance = await zuriPollToken.balanceOf(owner.address);
      // expect(balance).to.equal(1000000);
      expect(ethers.utils.formatEther(balance)).to.equal("1000000.0");
      // console.log(ethers.utils.formatEther(balance));

    });

       

    // it("Should set chairman", async function () {
    //         buy = await zuriPollToken.connect(owner).buyToken();
    //         // Expect the function to go through
    //         const txResult = await buy.wait();
    //         expect(txResult.status).to.equal(1);
    //     });

      // it("Should set chairman", async function () {
      //       votingChairman = await votingContract.connect(admin).setChairman(chairman.address);
      //       // Expect the function to go through
      //       const txResult = await votingChairman.wait();
      //       expect(txResult.status).to.equal(1);
      //   });
    
  });



  






