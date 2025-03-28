import { ethers } from "ethers";
import { useState } from "react";
import contractAbi from "../assets/Registery.json"
// import { RelayProvider } from '@opengsn/provider';

const TestPage = () => {
    
    const [balance,setBal] = useState(-10);
    const [fast,setFast] = useState(0);
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const proof = "ABC";
    const paymast = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        try{
            await signer.sendTransaction({
                to: "0x7e412B376a16F8a48aFea402e1Fad7aD6Ff8B8a5",
                value: ethers.parseEther("1") // ~10-20 transactions
              });
        } catch{
            console.log("Transaction Failed!!!!!")
        }
    }

    const topup = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
        const user = (await contract.getUser(proof));
        console.log("USER here: ", user)
        const walletAddr = user[3];
        console.log("Wallet Addr: ",walletAddr)
        try {
            const tx = await signer.sendTransaction({
                to: walletAddr,
                value: ethers.parseEther("1"),
            });
        
            await tx.wait();
            alert(`✅ Sent ${1} ETH! Transaction Hash: ${tx.hash}`);
            console.log("Transaction Data:", tx);
        } catch (error) {
            console.error("Transaction failed:", error);
        }

    }
    const getBal = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        // const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

            const tx = await contract.getWalletBalance(proof); // Replace with actual function name
            const balanceEth = ethers.formatEther(tx);

            console.log(`Wallet Balance: ${balanceEth} ETH`);
            alert(`Wallet Balance: ${balanceEth} ETH`);
            setBal(balanceEth);
            console.log("Transaction confirmed!");

            alert("Transaction Successful!");
        } catch (error) {
            console.error("Error executing contract function:", error);
            alert("Transaction Failed!");
        }
    }
    // const payGovt = async () => {
    //     const gsnConfig = {
    //         paymasterAddress: "0x7e412B376a16F8a48aFea402e1Fad7aD6Ff8B8a5", // Sepolia Paymaster
    //         relayHubAddress: "0xE0F0A8D0f6b8B6A5E0d1F0B5A5d9f6B6A5E0d1F0", // Sepolia RelayHub
    //       };
    //       const gsnProvider = await RelayProvider.newProvider({
    //         provider: window.ethereum, // Your Sepolia-forked node
    //         config: gsnConfig,
    //       }).init();
        
    //       const provider = new ethers.BrowserProvider(gsnProvider);
    //       const signer = await provider.getSigner();
    //     try {
    //         const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
    //         const amountInWei = ethers.parseEther("1");
    //         console.log(`Transaction Hash:`,tx.hash);
    //         const tx = await contract.makePayment("XYZ123ABC",amountInWei,"TOLL123"); // Replace with actual function name
    //         console.log(`Transaction Data:`,tx);
            
    //         await tx.wait();
    //         alert("Transaction Successful!");
    //     } catch (error) {
    //         console.error("Error executing contract function:", error);
    //         alert("Transaction Failed!");
    //     }
    // }
    const makeUser = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        // const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        try {
            // Connect to the smart contract
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

            // Execute the contract function
            const tx = await contract.addUser(proof,"Male"); // Replace with actual function name
            console.log("Transaction sent:", tx.hash);
            console.log("Transaction Data:", tx);

            // Wait for transaction confirmation
            await tx.wait();
            console.log("Transaction confirmed!");

            alert("Transaction Successful!");
        } catch (error) {
            console.error("Error executing contract function:", error);
            alert("Transaction Failed!");
        }
    }
    const makeFastag = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
            const walletAdd = "0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81";
            const tx = await contract.addFastag(proof,"rcNumber123","XYZ123ABC","Buggati","DL 3C AB 1234",walletAdd);
            console.log("Transaction sent:", tx.hash);
            console.log("Transaction Data:", tx);

            // Wait for transaction confirmation
            await tx.wait();
            console.log("Transaction confirmed!");

            alert("Transaction Successful!");
        } catch (error) {
            console.error("Error executing contract function:", error);
            alert("Transaction Failed!");
        }
    }
    const getFastagNum = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

            const tx = await contract.getUserFastags(proof); 
            console.log("Transaction Data:", tx);

            setFast(tx.length)
            alert("Transaction Successful!");
        } catch (error) {
            console.error("Error executing contract function:", error);
            alert("Transaction Failed!");
        }
    }
    return (
    <div className="w-full h-screen bg-black flex flex-col justify-center items-center gap-10">
        <div className="flex justify-center items-center gap-10">
            <button className="p-3 text-white bg-gray-800 hover:border-purple-800 duration-150" onClick={topup}>
                Top-up
            </button>
            <button className="p-3 text-white bg-gray-800 hover:border-purple-800 duration-150" onClick={getBal}>
                Fetch Balance : {balance}
            </button>
            <button className="p-3 text-white bg-gray-800 hover:border-purple-800 duration-150" onClick={makeUser}>
                Add User
            </button>
        </div>
        <div className="flex justify-center items-center gap-10">
            <button className="p-3 text-white bg-gray-800 hover:border-purple-800 duration-150" onClick={makeFastag}>
                Pay Govt
            </button>
            <button className="p-3 text-white bg-gray-800 hover:border-purple-800 duration-150" onClick={makeFastag}>
                Add Fastag
            </button>
            <button className="p-3 text-white bg-gray-800 hover:border-purple-800 duration-150" onClick={getFastagNum}>
                No. of fastags : {fast}
            </button>
            <button className="p-3 text-white bg-gray-800 hover:border-purple-800 duration-150" onClick={paymast}>
                Pay Paymaster
            </button>
        </div>
    </div>
  )
}

export default TestPage