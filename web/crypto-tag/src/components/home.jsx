import { useEffect, useState } from 'react';
import { LogInWithAnonAadhaar, useAnonAadhaar } from '@anon-aadhaar/react'
import CreateWallet from './createWallet';
import Wallet from './Wallet';
import { useNavigate } from 'react-router-dom';
import RCVerification from './add';
const Home = () => {
    const [AnonAdhaar] = useAnonAadhaar();
    const navigate = useNavigate();
    useEffect(()=>{
        console.log(AnonAdhaar.status)
        if(AnonAdhaar.status == 'logged-out'){
            // fallback to login route
            navigate('/login')
        }
        setProof(JSON.parse(AnonAdhaar.anonAadhaarProofs[0].pcd))
    }, [AnonAdhaar]);
    const [showVerify, setShowVerify] = useState(false);
    const [proof, setProof] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [seedPhrase, setSeedPhrase] = useState(null);
    return (
        <div className="p-8 w-[1024px] mx-auto">
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
              <button disabled={wallet === null} className="text-white px-4 py-2 rounded-lg shadow-md shadow-gray-800 bg-gray-700 flex flex-col items-center justify-center cursor-pointer" onClick={()=>{
                  setShowVerify(prev => !prev);
              }}>
                Create FastTag
              </button>
              <div>
                <LogInWithAnonAadhaar/>
              </div>
            </div>
          </div>
          <div>
          {
            showVerify &&
            <RCVerification/>
          }
          {
            !wallet &&
            <CreateWallet setWallet={setWallet} seedPhrase={seedPhrase} setSeedPhrase={setSeedPhrase}/>
          }
          {
            wallet &&
            <Wallet seedPhrase={seedPhrase} wallet={wallet} selectedChain={'0xAA36A7'}/>
          }
          </div>
        </div>
      </div>
    )
}

export default Home