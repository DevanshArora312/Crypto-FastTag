import React from "react";
import { Button, Card } from "antd";
import { PieChartOutlined, WalletOutlined, TransactionOutlined, IdcardOutlined, FileProtectOutlined } from "@ant-design/icons";

export const Hero = () => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r text-black p-6">
      <h1 className="text-5xl font-bold mb-4 text-center">
        Welcome to Fastag dApp
      </h1>
      
      <p className="text-lg text-center max-w-2xl mb-6">
        Manage your Fastag transactions securely on the blockchain. Add, track, and transfer balances with ease.
      </p>
      
      <div className="flex gap-4">
        <Button type="primary" size="large" icon={<WalletOutlined />} className="bg-white text-blue-600 hover:bg-gray-100">
          Add Fastag
        </Button>
        <Button type="default" size="large" icon={<TransactionOutlined />} className="bg-indigo-800 text-white hover:bg-indigo-700">
          View Transactions
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center bg-white text-black p-6 shadow-lg">
          <PieChartOutlined className="text-4xl text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold">Real-Time Analytics</h2>
          <p>Track your Fastag balance and transactions in real time.</p>
        </Card>

        <Card className="text-center bg-white text-black p-6 shadow-lg">
          <WalletOutlined className="text-4xl text-green-500 mb-4" />
          <h2 className="text-xl font-semibold">Secure Payments</h2>
          <p>Blockchain-powered transactions ensure security and transparency.</p>
        </Card>

        <Card className="text-center bg-white text-black p-6 shadow-lg">
          <TransactionOutlined className="text-4xl text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <p>View all past transactions with detailed insights.</p>
        </Card>

        <Card className="text-center bg-white text-black p-6 shadow-lg">
          <IdcardOutlined className="text-4xl text-red-500 mb-4" />
          <h2 className="text-xl font-semibold">Anon Aadhaar Login</h2>
          <p>Secure and private authentication using zero-knowledge proofs.</p>
        </Card>

        <Card className="text-center bg-white text-black p-6 shadow-lg">
          <FileProtectOutlined className="text-4xl text-orange-500 mb-4" />
          <h2 className="text-xl font-semibold">Anon DigiLocker</h2>
          <p>Store and manage your Fastag documents securely.</p>
        </Card>

        <Card className="text-center bg-white text-black p-6 shadow-lg">
          <FileProtectOutlined className="text-4xl text-teal-500 mb-4" />
          <h2 className="text-xl font-semibold">RC Verification with Groth16</h2>
          <p>Utilizing SNARKs (Groth16) for tamper-proof RC document verification.</p>
        </Card>
      </div>
    </div>
  );
};
