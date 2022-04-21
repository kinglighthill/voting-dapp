const { expect } = require("chai");
const { ethers } = require("hardhat");


require("@nomiclabs/hardhat-waffle"); 
 describe("ZuriPollToken", function () {

  let ZuriPollToken;
  let zuriPollToken;
  let owner;

  describe("Zuri poll Token", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
      const [owner] = await ethers.getSigners();
  
      const ZuriPollToken = await ethers.getContractFactory("Token");
  
      const zuriPollToken = await ZuriPollToken.deploy();
  
      const tokensPerEther = await hardhatToken.balanceOf(owner.address);
      expect(await zuriPollToken.totalSupply()).to.equal(tokensPerEther, 1000);
    });

    
    //function to convert to decimals
  it("it should covert token in decimals", async function () {
    console.log("\n    ✅ confirming...\n");
    const value = await zuriPollToken.convertToDecimals;
  await sleep(5000); // wait 5 seconds for transaction to confirm!!
  expect (convertToDecimals).to.equal(value, 1000);

});

// buy token function
it("it should buy token", async function () {
  console.log("\n    ✅ confirming...\n");
  const token = await zuriPollToken.connect(msg.sender).transferFrom(owner) ;
await sleep(5000); // wait 5 seconds for transaction to confirm!!
expect (transferFrom).to.equal(token, 1);


  });
  
  

});

 });


