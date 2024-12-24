import React from 'react'
import { useAnonAadhaar } from '@anon-aadhaar/react';
import { useEffect } from 'react';
import { LogInWithAnonAadhaar } from '@anon-aadhaar/react';

const Login = () => {
    const [AnonAdhaar] = useAnonAadhaar();
    useEffect(()=>{
        console.log(AnonAdhaar);
    }, [AnonAdhaar]);

    return (
        <div className="py-32">
          <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
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
                    <LogInWithAnonAadhaar/>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 md:w-1/4"></span>
                <span className="border-b w-1/5 md:w-1/4"></span>
              </div>
            </div>
          </div>
        </div>
      )
}

export default Login