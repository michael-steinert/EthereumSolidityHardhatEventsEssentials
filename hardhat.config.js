require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
task("accounts", "Prints the list of Accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
    solidity: "0.8.10",
    networks: {
        rinkeby: {
            chainId: 4,
            url: process.env.ALCHEMY_API_URL,
            accounts: [process.env.PRIVATE_KEY],
        }
    }
};