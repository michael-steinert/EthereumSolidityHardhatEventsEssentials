import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import "./App.css";
import wavePortalABI from "./utils/WavePortal.json";

const App = () => {
    const contractAddress = "0x28C9E0fD25CB9042925AEB478574f18651D3C84E";
    const [currentAccount, setCurrentAccount] = useState("");
    const [message, setMessage] = useState("");
    const [allWaves, setAllWaves] = useState([]);
    const contractABI = wavePortalABI.abi;

    useEffect(() => {
        checkIfWalletIsConnected().catch(console.error);
    }, []);

    /* Listen on emitted Wave Events to update the Data in Real-Rime */
    useEffect(() => {
        let wavePortalContract;
        const onNewWave = (from, timestamp, message) => {
            console.log("NewWave", from, timestamp, message);
            /* Set User's Message from Wave Event */
            setAllWaves(prevState => [
                ...prevState, {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message: message,
                }
            ]);
        };
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
            wavePortalContract.on("NewWave", onNewWave);
        }
        return () => {
            if (wavePortalContract) {
                wavePortalContract.off("NewWave", onNewWave);
            }
        };
    }, []);

    const checkIfWalletIsConnected = async () => {
        try {
            const {ethereum} = window;
            if (!ethereum) {
                console.log("A Wallet like Metamask has to eb installed");
                return;
            } else {
                console.log("The Ethereum Object exists", ethereum);
            }
            /* Checking if Application is authorized to access the User's Wallet */
            const accounts = await ethereum.request({method: 'eth_accounts'});
            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized Account:", account);
                setCurrentAccount(account);
                /* Initialize all Waves */
                getAllWaves().catch(console.error);
            } else {
                console.log("No authorized Account found");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const connectWallet = async () => {
        try {
            const {ethereum} = window;
            if (!ethereum) {
                alert("A Wallet like MetaMask is required");
                return;
            }
            /* Asking Wallet to give Access to the User's Wallet */
            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
        }
    }

    const wave = async () => {
        try {
            const {ethereum} = window;
            if (ethereum) {
                /* A Provider (like Metamask) allows interacting with Ethereum Nodes */
                /* The Metamask Provide is using its Nodes to send and receive Data from deployed Smart Contracts */
                const provider = new ethers.providers.Web3Provider(ethereum);
                /* A Signer is an Abstraction of an Ethereum Account, which can be used to sign Messages and Transactions */
                /* These signed Transactions are sent to the Ethereum Network to execute State changing Operations */
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
                let count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total Wave Count", count.toNumber());
                /* Execute the Function `wave` from the Smart Contract */
                const waveTransaction = await wavePortalContract.wave(message, {
                    /* Makes the User pay a set Amount of Gas of 420.000 to ensure that the Transaction has enough Gas to pass */
                    /* If the Transaction does not use all the Gas in the Transaction it will automatically be refunded */
                    gasLimit: 420000
                });
                console.log("Adding Transaction to Block", waveTransaction.hash);
                await waveTransaction.wait();
                console.log("Transaction has been added to Block", waveTransaction.hash);
                count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total Wave Count", count.toNumber());
            } else {
                console.log("Ethereum Object does not exist");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getAllWaves = async () => {
        try {
            const {ethereum} = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
                /* Call Function `getAllWaves` from the Smart Contract */
                const waves = await wavePortalContract.getAllWaves();
                /* Grab only Address, Timestamp and Message from the Waves Struct */
                let wavesCleaned = [];
                waves.forEach((wave) => {
                    wavesCleaned.push({
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message
                    });
                });
                setAllWaves(wavesCleaned);
            } else {
                console.log("Ethereum Object does not exist");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={"mainContainer"}>
            <div className={"dataContainer"}>
                <div className={"header"}>
                    Hey there
                </div>
                <div className={"bio"}>
                    Biography
                </div>
                {
                    /* If there is a current Account render this Button */
                    currentAccount && (
                        <React.Fragment>
                            <input value={message} onChange={(event => setMessage(event.target.value))}/>
                            {console.log("Message", message)}
                            <button className={"waveButton"} onClick={wave}>
                                Wave at Me
                            </button>
                        </React.Fragment>
                    )
                }
                {
                    /* If there is no current Account render this Button */
                    !currentAccount && (
                        <button className={"waveButton"} onClick={connectWallet}>
                            Connect Wallet
                        </button>
                    )
                }
                {
                    allWaves.map((wave, index) => {
                        return (
                            <div key={index} style={{backgroundColor: "#fdf5e6", marginTop: "16px", padding: "8px"}}>
                                <div>Address: {wave.address}</div>
                                <div>Time: {wave.timestamp.toString()}</div>
                                <div>Message: {wave.message}</div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}
export default App;