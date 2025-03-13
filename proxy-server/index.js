const express = require("express");
const cors = require("cors");
const Moralis = require("moralis").default;
require("dotenv").config();
const app = express();
app.use(cors());
const port = process.env.PORT;

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

Moralis.start({
    apiKey : process.env.MORALIS_API
}).then(()=>{
    app.listen(port, ()=>{
        console.log(`listening at -> ${port}`)
    })
})