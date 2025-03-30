import { useEffect, useState } from 'react';
import { useAnonAadhaar } from '@anon-aadhaar/react'
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Button } from 'antd';
import RCVerification from './add';
import contractAbi from "../assets/Registery.json"
import { ethers } from "ethers";
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const Fastag = () => {
    const [AnonAdhaar] = useAnonAadhaar();
    const navigate = useNavigate();
    const [proof, setProof] = useState(null);
    const [wallet, setWallet] = useState(null);
    const makeFastag = async (rcNumber, chasisNumber, model, carNumber) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        try {
            const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
            let proofHash =  localStorage.getItem('proofHash') || "U2FsdGVkX18F9Q";
            const tx = await contract.addFastag(proofHash, rcNumber, chasisNumber, model, carNumber, wallet);
            console.log("Transaction sent:", tx.hash);
            console.log("Transaction Data:", tx);

            // Wait for transaction confirmation
            await tx.wait();
            console.log("Transaction confirmed!");

            message.success("Transaction Successful!");
        } catch (error) {
            console.error("Error executing contract function:", error);
            message.error("Transaction Failed!");
        }
    }
    async function getUser(proofHash) {
      if (!window.ethereum) {
          message.error('Metamask Not Installed');
          return;
        }
  
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
          const tx = await contract.getUser(proofHash);
          setWallet(tx[3]);
  
        } catch (error) {
          localStorage.clear()
          console.log(error);
        }
    }

    useEffect(()=>{
      (async()=>{
        console.log(AnonAdhaar.status)
        if(AnonAdhaar.status == 'logged-out'){
            // fallback to login route
            // navigate('/login')
        }
        else{
          let proofHash =  localStorage.getItem('proofHash') || "U2FsdGVkX18F9Q";
          await getUser(proofHash)
          setProof(JSON.parse(AnonAdhaar.anonAadhaarProofs[0].pcd))
        }
      })()
    }, [AnonAdhaar]);
    return (
      <div className='bg-[#f1fffe] min-h-screen w-screen'>
        <div className="p-8 w-[1200px] mx-auto">
          <div className="p-8 bg-white shadow-lg mt-16 min-h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
                <div>
                  <p className="font-bold text-gray-700 text-xl">{proof?.claim?.state}</p>
                  <p className="text-gray-400">State</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xl">{proof?.claim?.pincode}</p>
                  <p className="text-gray-400">Pincode</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xl">{proof?.claim?.gender}</p>
                  <p className="text-gray-400">Gender</p>
                </div>
              </div>
    
              <div className="relative">
                <div className="w-40 h-40 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-28 flex items-center justify-center text-indigo-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
    
              <div className="space-x-8 flex items-center justify-between mt-32 md:mt-0 md:justify-center">
                <Button color="blue" variant="filled" disabled={wallet === null} className="px-8 py-5 font-bold text-md rounded-lg shadow-md shadow-gray-400 flex flex-col items-center justify-center cursor-pointer" onClick={()=>{
                    navigate('/home')
                }}>
                  Back
                </Button>
              </div>
            </div>
            <div>
            <RCVerification wallet={wallet} makeFastag={makeFastag}/>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Fastag