/* Hardhat Runtime Environment (HRE) is an Object containing all the Functionality that Hardhat exposes when running a Task, Test or Script */
/* Every Time a Terminal Command is run that starts with `npx hardhat` the HRE Object will be built by using the Specification `hardhat.config.js` */
const hre = require("hardhat");

const main = async () => {
    /* Grab the Wallet Address of Smart Contract Deployer */
    /* In Order to deploy a Smart Contract to the Blockchain a Wallet Address necessary */
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deploying Smart Contracts with Account: ", deployer.address);
    console.log("Account Balance: ", accountBalance.toString());

    const Token = await hre.ethers.getContractFactory("WavePortal");
    /* Deploy Smart Contract and funded it with 0.1 ETH */
    const portal = await Token.deploy({
            value: hre.ethers.utils.parseEther("0.001")
    });
    await portal.deployed();

    console.log("Wave Portal Address: ", portal.address);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain().catch(console.error);