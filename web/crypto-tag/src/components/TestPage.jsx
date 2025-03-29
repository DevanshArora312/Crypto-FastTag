import { ethers } from "ethers";
import { useState } from "react";
import contractAbi from "../assets/Registery.json"

// Registery deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
// Wallet deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

const TestPage = () => {
    
    const [balance,setBal] = useState(0);
    const [fast,setFast] = useState(0);
    const [WALLET,setWall] = useState(0);
    const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    const proof = "ABC";

    const topup = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
        const user = (await contract.getUser(proof));
        console.log("USER here: ", user)
        const walletAddr = user[3];
        setWall(walletAddr);
        console.log("Wallet Addr: ",walletAddr)
        try {
            const tx = await signer.sendTransaction({
                to: walletAddr,
                value: ethers.parseEther("2"),
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
            const tx = await contract.addFastag(proof,"rcNumber123","XYZ123ABC","Buggati","DL 3C AB 1234",WALLET);
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
     async function getUser(proofHash) {
          if (!window.ethereum) {
            message.error('Metamask Not Installed');
            return;
          }
          
          console.log(contractAddress);
          console.log(contractAbi.abi);
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
            console.log(proofHash)
            const tx = await contract.getUser(proofHash);
            console.log(tx);
            // console.log(retrievedProofHash, gender, fastags, wallet, transactions);
    
            if (tx[0] === "") {
              message.error('User doesn\'t exist or Wrong password');
              console.error("Error adding user:", error);
              localStorage.clear()
              setStep(1)
              console.log("User not found");
            } else {
              console.log("successful!");
              navigate('/home')
            }
          } catch (error) {
            console.log("here");
            localStorage.clear()
            message.error('Something Went Wrong');
            console.error("Error adding user:", error.message);
            setStep(1)
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
    const payGovt = async() =>{
        const dets = {
            fastag:"XYZ123ABC", 
            amount:1, 
            toll:"TOLL123"
          }
        try{
            fetch("http://localhost:3000/makePayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // Add this header
                body: JSON.stringify(dets)
            })
            .then(res => res.json())
            .then(data => {
                console.log("Paid Govt succes!")
                console.log("Transaction Data: ",data)
            })
        } catch(err){
            alert("FETCH ME ERROR! : ", err);
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
            <button className="p-3 text-white bg-gray-800 hover:border-purple-800 duration-150" onClick={payGovt}>
                Pay Govt
            </button>
            <button className="p-3 text-white bg-gray-800 hover:border-purple-800 duration-150" onClick={makeFastag}>
                Add Fastag
            </button>
            <button className="p-3 text-white bg-gray-800 hover:border-purple-800 duration-150" onClick={getFastagNum}>
                No. of fastags : {fast}
            </button>
    
        </div>
    </div>
  )
}

export default TestPage