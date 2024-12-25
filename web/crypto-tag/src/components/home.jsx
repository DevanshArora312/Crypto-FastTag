import React from 'react'
import { useEffect, useState } from 'react';
import { LogInWithAnonAadhaar, useAnonAadhaar } from '@anon-aadhaar/react'
const Home = () => {
    const [AnonAdhaar] = useAnonAadhaar();
    useEffect(()=>{
        if(AnonAdhaar.status == 'logged-out'){
            // fallback to login route
        }
        setProof(JSON.parse(AnonAdhaar.anonAadhaarProofs[0].pcd))
    }, []);
    const [proof, setProof] = useState(null);
    const walletaddress = "0x9b51FB6fE636f979059bd90B375Fc3e153B9F537"
    const walletamount = '0.5eth'
    return (
        <div className="p-8">
        <div className="p-8 bg-white shadow mt-24">
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
              <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
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
              <div className="text-white px-4 py-2 rounded-lg shadow-md shadow-gray-800 bg-gray-700 flex flex-col items-center justify-center">
                Create RFID
              </div>
              <div>
                <LogInWithAnonAadhaar/>
              </div>
            </div>
          </div>
  
          <div className="mt-20 text-center pb-12">
            <span className="text-md font-medium text-blue-700 bg-blue-700/10 px-2 rounded-full cursor-pointer">
                {walletaddress}
            </span>
            <p className="text-gray-600 font-bold mt-3">{walletamount}</p>
            <p className="mt-8 text-gray-500">Crypto-FastTag</p>
            <p className="mt-2 text-gray-500">Crypto-FastTag uses blockchain's immutable ledger and smart contracts to prevent transaction tampering and ensure payment authenticity</p>
          </div>
        </div>
      </div>
    )
}

export default Home