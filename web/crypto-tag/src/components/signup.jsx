import { useAnonAadhaar } from '@anon-aadhaar/react';
import { useEffect, useState } from 'react';
import { LogInWithAnonAadhaar } from '@anon-aadhaar/react';
import { useNavigate } from 'react-router-dom';
import { Steps, Input, Button, Flex, Spin} from "antd";

const Signup = () => {
    const navigate = useNavigate();
    const [AnonAdhaar] = useAnonAadhaar();
    const [step, setStep] = useState(1)
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    console.log(password);
    useEffect(()=>{
        console.log(AnonAdhaar.status);
        if(AnonAdhaar.status === 'logged-in'){
          setStep(3)
          // create user
          navigate('/login')
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
              <div className="flex flex-row-reverse gap-8 bg-white overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
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
                  <div className="mt-4 flex items-center justify-between">
                    <span className="border-b w-1/5 lg:w-1/4"></span>
                    <a href="#" className="text-xs text-center text-gray-500 uppercase">
                        Signup with AnonAdhaar
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
              <div className="flex flex-row-reverse gap-8 bg-white overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
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
                  <div className="mt-4 flex items-center justify-between">
                    <span className="border-b w-1/5 lg:w-1/4"></span>
                    <a href="#" className="text-xs text-center text-gray-500 uppercase">
                        Signup with AnonAdhaar
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

export default Signup