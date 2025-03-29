import { useAnonAadhaar } from '@anon-aadhaar/react';
import { useEffect, useState } from 'react';
import { LogInWithAnonAadhaar } from '@anon-aadhaar/react';
import { useNavigate } from 'react-router-dom';
import { Steps, Input, Button, Flex, Spin, message } from "antd";
import CryptoJS from "crypto-js";
import contractAbi from "../assets/Registery.json"
import { ethers } from "ethers";
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const Login = () => {
    const navigate = useNavigate();
    const [AnonAdhaar] = useAnonAadhaar();
    const [step, setStep] = useState(1)
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    
    // const [messageApi, contextHolder] = message.useMessage();
    (async()=>{
        // getUser("U2FsdGVkX18F9Q")
    })();
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
        console.log(tx);

        if (tx[0] === "") {
          message.error('User doesn\'t exist or Wrong password');
          localStorage.clear()
          setStep(1)
          console.log("User not found");
        } else {
          message.success("Task Successful")
          console.log("successful!");
          localStorage.setItem('proofHash', proofHash);
          navigate('/home')
        }
      } catch (error) {
        localStorage.clear()
        message.error('Something Went Wrong');
        console.error("Error adding user:", error.message);
        setStep(1)
      }
    }
    // useEffect(()=>{
    //   (async()=>{
    //     setStep(3)
    //     const proof = {"message": "ok"}
    //     let proofHash = CryptoJS.AES.encrypt(JSON.stringify(proof), "satijanew").toString()
    //     proofHash = proofHash.slice(0, 15)
    //     console.log(proofHash)
    //     getUser(proofHash)
    //   })()
    // }, [])
    useEffect(()=>{
        if(AnonAdhaar.status === 'logged-in'){
          (async()=>{
            setStep(3)
            const proof = JSON.parse(AnonAdhaar.anonAadhaarProofs[0].pcd)
            let proofHash = CryptoJS.AES.encrypt(JSON.stringify(proof), password).toString()
            proofHash = proofHash.slice(0, 10)
            getUser(proofHash)
          })()
        } 
    }, [AnonAdhaar]);
    return (
        <div className="py-16 bg-[#f1fffe] h-screen">
          <div className="flex flex-col gap-8 bg-white my-auto rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl py-16 px-8">
            <div className='px-8'>
              <Steps
                size="small"
                current={step-1}
                items={[
                {
                    title: step == 1 ? 'In Progress' : 'Finished',
                },
                {
                    title: step == 2 ? 'In Progress' : (step == 1 ? 'Waiting' : 'Finished'),
                },
                {
                    title: step == 3 ? 'In Progress' : (step == 1 ? 'Waiting' : 'Finished'),
                },
                ]}
              />
            </div>
            {
              step === 1 &&
              <div className="flex gap-8 bg-white overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                <div
                  className="hidden lg:block lg:w-1/2 bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
                  }}
                ></div>
                <div className="w-full p-8 lg:w-1/2">
                  <h2 className="text-2xl font-semibold text-gray-700 text-center">
                    Crypto-FastTag
                  </h2>
                  <p className="text-xl text-gray-600 text-center">Welcome back!</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="border-b w-1/5 lg:w-1/4"></span>
                    <a href="#" className="text-xs text-center text-gray-500 uppercase">
                        login with AnonAdhaar
                    </a>
                    <span className="border-b w-1/5 lg:w-1/4"></span>
                  </div>
                  <div className='text-slate-800 text-center my-4'>
                    Enter Password
                  </div>
                  <div className='text-center text-slate-400 text-sm my-4'>
                    We securely encrypt your signing proof using your password and store it on the blockchain, ensuring privacy, integrity, and user control. Only you can decrypt and verify it—no third parties involved.
                  </div>
                  <div className="mt-8 flex flex-col gap-2 items-center justify-center">
                    <Input placeholder="Enter Password" type={"password"} onChange={(password)=>{
                      setPassword(password.target.value);
                    }}/>
                    <Button type="primary" className='w-full' onClick={()=>{
                      setStep(prev => prev + 1)
                    }}>Next</Button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="border-b w-1/5 md:w-1/4"></span>
                    <span className="border-b w-1/5 md:w-1/4"></span>
                  </div>
                </div>
              </div>
            }
            {
              step === 2 &&
              <div className="flex gap-8 bg-white overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                <div
                  className="hidden lg:block lg:w-1/2 bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
                  }}
                ></div>
                <div className="w-full p-8 lg:w-1/2">
                  <h2 className="text-2xl font-semibold text-gray-700 text-center">
                    Crypto-FastTag
                  </h2>
                  <p className="text-xl text-gray-600 text-center">Welcome back!</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="border-b w-1/5 lg:w-1/4"></span>
                    <a href="#" className="text-xs text-center text-gray-500 uppercase">
                        login with AnonAdhaar
                    </a>
                    <span className="border-b w-1/5 lg:w-1/4"></span>
                  </div>
                  <div className='text-slate-800 text-center my-4'>
                    UPLOAD YOUR AADHAAR SECURE QR CODE
                  </div>
                  <div className='text-center text-slate-400 text-sm my-4'>
                    Anon Aadhaar allows you to create a proof of your Aadhaar ID without revealing any personal data. This process is local to your browser for privacy, and QR images are not uploaded to any server.
                  </div>
                  <div className="mt-8 flex items-center justify-center">
                        <LogInWithAnonAadhaar
                          nullifierSeed={1234}  
                          fieldsToReveal={[
                            'revealAgeAbove18',
                            'revealState',
                            'revealPinCode',
                            'revealGender'
                          ]}
                        />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="border-b w-1/5 md:w-1/4"></span>
                    <span className="border-b w-1/5 md:w-1/4"></span>
                  </div>
                </div>
              </div>
            }
            {
              step === 3 &&
              <div className="flex gap-8 bg-white overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                {
                  loading &&
                  <div className='p-8'>
                    <Flex align="center" gap="middle">
                      <Spin size="large" />
                    </Flex>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      )
}

export default Login