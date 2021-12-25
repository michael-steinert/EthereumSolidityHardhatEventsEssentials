// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

/* Console Statements will only work on local Hardhat Environment */
import "hardhat/console.sol";

contract WavePortal {
    /* Variable is automatically initialized to 0 */
    /* State Variables are permanently stored in the Smart Contract Storage */
    uint256 totalWaves;
    /* A Seed to generate Pseudo-Randomness */
    /* On Blockchains there is no Source of Randomness because everything the Smart Contract knows to generate a Number, the Public also knows */
    uint256 private seed;

    /* An Event is emitted, it stores the Arguments passed in Transaction Logs */
    /* These Logs are stored on Blockchain and are accessible using Address of the Smart Contract */
    /* Events are Messages from a Smart Contract that can be captured from a Client in Real-Time */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /* Struct Types are used to represent a Record */
    struct Wave {
        /* The Address of the User who waved */
        address waver;
        /* The Message the User sent */
        string message;
        /* The Timestamp when the User waved */
        uint256 timestamp;
    }

    /* Store an Array of Structs */
    Wave[] waves;

    /* An Address => Uint Mapping that associate an Address with a Number */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Smart Contract Output");
        /* Set the initial Seed */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    /* `public` Functions become available to be called on the Blockchain */
    function wave(string memory _message) public {
        /* Check that the current Timestamp is at least 5-Minutes bigger than the last Timestamp from the User */
        require(lastWavedAt[msg.sender] + 42 seconds < block.timestamp, "Wait 42 Seconds");
        /* Update the current Timestamp for the User */
        lastWavedAt[msg.sender] = block.timestamp;
        /* Increase total Waves */
        totalWaves += 1;
        console.log("%s has waved", msg.sender);
        /* `msg.sender` is the Wallet Address of the person who called these Function */
        console.log("%s has waved with Message %s", msg.sender, _message);
        /* Store the Wave Data in the Array */
        waves.push(Wave(msg.sender, _message, block.timestamp));
        /* Generate a new Seed for the next User that sends a Wave by using Global Variables */
        /* The Seed will change every Time a User sends a new Wave */
        /* `block.difficulty` tells Miners how hard the Block will be to mine based on the Transactions in the Block */
        /* `block.timestamp` is the Unix Timestamp that the Block is being processed */
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random Number generated: %d", seed);
        /* A 50% Chance that the User wins ETH */
        if (seed <= 50) {
            /* Amount that is sent to Persons who wave to the Smart Contract */
            uint256 prizeAmount = 0.0001 ether;
            /* When this Smart Contract is deployed, ETH should also be sent to it */
            require(prizeAmount <= address(this).balance, "Trying to withdraw more ETH than the Smart Contract has");
            /* An internal Transaction from the Smart Contract to send `prizeAmount` ETH to Waver */
            /* Using `call()` instead of `send()` to prevent Smart Contract from not working if Ethereum change the Gas Cost of certain Operations */
            (bool success,) = (msg.sender).call{value : prizeAmount}("");
            require(success, "Failed to withdraw ETH from Smart Contract");
            console.log("%s won %d WEI", msg.sender, prizeAmount);
        }
        /* Emit Event */
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("There are %d total Waves", totalWaves);
        return totalWaves;
    }
}