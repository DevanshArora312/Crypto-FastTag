const express = require("express");
const cors = require("cors");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
require("dotenv").config();
const app = express();
app.use(cors());
const port = process.env.PORT;
const {ethers} = require("ethers");
const registeryABI = require("./Registery.json");

app.use(express.json());
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

app.post("/makePayment", async(req, res)=>{
    console.log("boody:",req.body)
    // console.log(req)
    const {fastag, amount, toll} = req.body;
    
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const relayerWallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);
    const registeryAddress = process.env.CONTRACT_ADDRESS;

    const registeryContract = new ethers.Contract(registeryAddress, registeryABI.abi, relayerWallet);
    const tx = await registeryContract.makePayment(fastag, ethers.parseUnits(amount.toString(), "ether"), toll);

    const receipt = await tx.wait();
    console.log("Transaction confirmed, hash:", tx.hash);
    // console.log("Transaction data:", receipt);

    const iface = new ethers.Interface(registeryABI.abi);

    const transactionEvent = receipt.logs.map(log => {
            try {
                return iface.parseLog(log);
            } catch (error) {
                return null;
            }
        }).find(event => event && event.name === "TransactionLogged");
    var rest = {
        fromUser : "Log Not Found",
        timestamp: "Log Not Found",
        carNo:"Log Not Found",
    };
    if (transactionEvent) {
        console.log("TransactionLogged event found:", transactionEvent.args);
        rest = {
            fromUser : transactionEvent.args[0],
            timestamp: transactionEvent.args[2].toString(),
            carNo:transactionEvent.args[4],
        };
        // rest = transactionEvent.args;
    } else {
        console.log("TransactionLogged event NOT found!");
    }
    // const TransactionEvent = event.find(e => e.eventName === "TransactionLogged");
    
    return res.status(200).json({
        success:true,
        user:rest?.fromUser,
        timestamp:rest?.timestamp,
        carNo:rest?.carNo
    })
});

Moralis.start({
    apiKey : process.env.MORALIS_API
}).then(()=>{
    app.listen(port, ()=>{
        console.log(`listening at -> ${port}`)
    })
})