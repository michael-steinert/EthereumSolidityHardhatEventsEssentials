/* Hardhat Runtime Environment (HRE) is an Object containing all the Functionality that Hardhat exposes when running a Task, Test or Script */
/* Every Time a Terminal Command is run that starts with `npx hardhat` the HRE Object will be built by using the Specification `hardhat.config.js` */
const hre = require("hardhat");

const main = async () => {
    /* Grab the Wallet Address of Smart Contract Owner and also a random Wallet Address */
    /* In Order to deploy a Smart Contract to the Blockchain a Wallet Address necessary */
    const [owner, randomPerson] = await hre.ethers.getSigners();
    /* Compile the Smart Contract and generate the necessary Files to interact with the Smart Contract in Directory `artifacts` */
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    /* Hardhat will create a local Ethereum Network for this Smart Contract */
    /* After the Script completes it will destroy that local Ethereum Network */
    /* Deploy Smart Contract and funded it with 0.1 ETH */
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.001")
    });
    /* Wait until the Smart Contract is deployed to the local Blockchain */
    /* The Constructor of the Smart Contract runs once when the Smart Contract is deployed */
    await waveContract.deployed();
    /* The Address allows to find the Smart Contract on the Blockchain */
    console.log("Smart Contract deployed to:", waveContract.address);
    /* The Address of the Person who deployed the Smart Contract */
    console.log("Contract deployed by:", owner.address);

    /* Get Contract Balance of Smart Contract */
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract Balance:", hre.ethers.utils.formatEther(contractBalance));

    /* Call Functions of Smart Contract */
    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log("Wave Count:", waveCount.toNumber());

    let waveTransaction = await waveContract.wave("A new Wave Message");
    /* Wait for the Transaction to be included in a Block - one Block Confirmation */
    await waveTransaction.wait();

    waveCount = await waveContract.getTotalWaves();
    console.log("Wave Count:", waveCount.toNumber());

    /* Transaction comes from a random People instead of Owner of Smart Contract */
    waveTransaction = await waveContract.connect(randomPerson).wave("A new Message from a random Person");
    /* Wait for the Transaction to be included in a Block - one Block Confirmation */
    await waveTransaction.wait();

    waveCount = await waveContract.getTotalWaves();
    console.log("Wave Count:", waveCount.toNumber());

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract Balance:", hre.ethers.utils.formatEther(contractBalance));

    const allWaves = await waveContract.getAllWaves();
    console.log("All Waves:", allWaves);
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