import React, { useEffect, useState } from 'react';
import { ethers } from "ethers"

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEtherumContract = async () => {
    // create provider
    const provider = new ethers.BrowserProvider(ethereum)

    // get connected account
    const signer = await provider.getSigner();

    // create a new transaction contract
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('')
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));

    const handleChange = (e, name) => {
        setformData((prevState) => ({
            ...prevState, [name]: e.target.value
        }))
    }

    const checkIfWalletIsConnected = async () => {

        try {
            if (!ethereum) {
                return alert("Please install Metamask")
            }
            const accounts = await ethereum.request({ method: "eth_accounts" });
            // if connected, set current account
            if (accounts.length) {
                setCurrentAccount(accounts[0])
            } else {
                console.log("No account found");
            }
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }

    }

    const connectWallet = async () => {
        try {
            if (!ethereum) {
                return alert("Please install Metamask")
            }
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) {
                return alert("Please install Metamask")
            }
            // get data from the form 
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = await getEtherumContract();
            const parsedAmount = ethers.parseEther(amount);
            console.log(parsedAmount);

            await ethereum.request({ 
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    value: ethers.toBeHex(parsedAmount)
                }]
            })
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, keyword, message);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log("success", transactionHash);

            const transactionCount = await transactionContract.getTransactionCount();
            console.log(parseInt(transactionCount));
            setTransactionCount(parseInt(transactionCount));

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}