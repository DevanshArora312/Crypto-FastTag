const express = require("express");
const cors = require("cors");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
require("dotenv").config();
const app = express();
app.use(cors());
const port = process.env.PORT;

const ABI = [];


app.get("/getFunds", async(req, res)=>{
    const { userAddress, chain } = req.query;
    
    const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
        chain: chain,
        address: userAddress
    });

    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
        chain: chain,
        address: userAddress
    });
    
    const myNfts = nfts.raw.result.map((e, i) => {
        if (e?.media?.media_collection?.high?.url && !e.possible_spam && (e?.media?.category !== "video") ) {
          return e["media"]["media_collection"]["high"]["url"];
        }
    })
    
    const balance = await Moralis.EvmApi.balance.getNativeBalance({
        chain: chain,
        address: userAddress
    });
    
    console.log(balance.raw);

    return res.status(200).json({
        tokens: tokens.raw,
        nfts: myNfts,
        balance: (balance.raw.balance) / (10 ** 18)
    })
});

app.get("/makePayment", async(req, res)=>{
    try{
        const {fastag, amount, toll} = req.query;
        
        const txResponse = await Moralis.EvmApi.transaction.runContractFunction({
            chain: EvmChain.LOCALHOST,  // Use predefined chain (or hex ID 0x7a69 for Hardhat)
            functionName: "makePayment",
            address: process.env.CONTRACT_ADDRESS || "0xadasda1232sasd",
            abi: ABI,
            params: { fastag:fastag, amount:amount, toll:toll },
            privateKey: process.env.PRIVATE_KEY || "WTF IS THIS",  
        });

        const receipt = await Moralis.EvmApi.transaction.getTransactionReceipt({
            chain: EvmChain.LOCALHOST,
            transactionHash: txResponse.result.hash
        });

        const logs = receipt.result.logs;
        const event = Moralis.EvmApi.utils.decodeLogs({
            abi: ABI,
            logs: logs
        });

        const TransactionEvent = event.find(e => e.eventName === "TransactionLogged");
        
        return res.status(200).json({
            success:true,
            txHash: txResponse.result.hash,
            user:TransactionEvent.fromUser,
            timestamp:TransactionEvent.timestamp,
            carNo:TransactionEvent.carNo
        });

    } catch(error){
        res.status(500).json({ 
            error: error.message,
            details: error.response?.data?.message || "No additional details" 
        });
    }
});

Moralis.start({
    apiKey : process.env.MORALIS_API
}).then(()=>{
    app.listen(port, ()=>{
        console.log(`listening at -> ${port}`)
    })
})