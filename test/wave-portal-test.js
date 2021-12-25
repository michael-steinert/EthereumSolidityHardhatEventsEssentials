const { ethers } = require("hardhat");

describe("WavePortal Test", function () {
  it("Should return Smart Contract Output", async function () {
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy();
    await wavePortal.deployed();
  });
});
