# Ethereum Solidity Essentials
* To perform an Action on the Ethereum Blockchain is called a __Transaction__

## Alchemy
* A Blockchain has no Owner - it is a Bunch of Computers around the World run by Nodes that have a Copy of the Blockchain
* To deploy a Smart Contract on the Blockchain, the Smart Contract has to be broadcast on all Nodes therefore:
  1) The Transaction has to be put in a Block by a Miner or Validator
  2) These Bock has to be attached to the Blockchain
  3) This Blockchain has to be broadcast over all Nodes
* Alchemy is a Service that provides an RPC Node that provides a Transaction to Miner or Validator
* Once the Transaction is put in a Block, it is then broadcast to the Blockchain as a legit Transaction
* From there, every Node updates their Copy of the Blockchain

* In Short Alchemy do the following Steps:
  1) Broadcast a given Transaction
  2) Wait for it to be picked up from the Mempool by actual Miners or Validators
  3) Wait for it to be put in a Block
  4) Wait for it to be broadcast to the Blockchain so the other Nodes can update their Copies of the Blockchain

## Hardhat Commands
| Command              | Description                    |
|----------------------|--------------------------------|
| npx hardhat accounts | Shows local Accounts           |
| npx hardhat node     | Runs a local Node / Blockchain |
| npx hardhat compile  | Compiles all Smart Contracts   |
| npx hardhat test     | Runs all Tests                 |
| npx hardhat run scripts/deploy.js --network localhost | Runs a given Script            |