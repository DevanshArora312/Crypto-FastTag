import  {useEffect, useState} from 'react'
import { FaRegCopy } from "react-icons/fa";
import { TbCopyCheck } from "react-icons/tb";
import { Button, Input, List, message } from 'antd';
import { Tabs, Avatar } from "antd";
import {ethers} from 'ethers';
import { contractAddress, contractAbi } from '../constants';
const Wallet = ({
  wallet,
  seedPhrase,
  selectedChain
}) => {
  const createContract = async()=>{
    const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/GRIRfkS8p_KDIhtPgEcauWBfjucLFolH"); 
    const wallet = ethers.Wallet.fromPhrase(seedPhrase);
    const signer = wallet.connect(provider);  
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    return contract;
  }
  const logTransaction = async(to, amount)=>{
    const loadingmessage = message.loading("Logging transaction", 0);
    let miningmessage;
    try{
      
      const contract = await createContract();
      
      const amountInWei = ethers.parseEther(amount.toString());

      const tx = await contract.logTransaction(to, amountInWei);

      loadingmessage();

      miningmessage = message.loading("Mining...", 0);
      
      await tx.wait();
      
      if(miningmessage) miningmessage();
      message.success("Logged sucessfully");
    } catch(err){
      if(loadingmessage) loadingmessage();
      if(miningmessage) miningmessage();
      console.log(err);
      message.error("transaction couldn't be logged");
    }
  }

  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");


  useEffect(()=>{
    (async()=>{
      const response = await fetch(`http://localhost:5000/getFunds?userAddress=${wallet}&chain=${selectedChain}`);
      const data = await response.json();
      console.log(wallet, selectedChain, data);
      setBalance(data);
    })();
  }, []);

  const [hash, setHash] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wallet).then(() => {
        setCopied(true);
        message.success('Address copied to clipboard!');
    }).catch((err) => {
        message.error('Failed to copy seed phrase!');
        console.error('Copying failed', err);
    });
  };
  let chain;
  if(selectedChain === '0x1'){
    chain = 'Ethereum';
  }
  else if(selectedChain === '0x89'){
    chain = 'Polygon';
  }
  else if(selectedChain === '0xa86a'){
    chain = 'Avalanche';
  }
  else if(selectedChain === '0xAA36A7'){
    chain = 'Sepolia Eth';
  }

  const items = [
    {
      key: '1',
      label: 'Tokens',
      children: <>
        {
          <List
            bordered
            itemLayout='horizontal'
            dataSource={balance ? balance.tokens : []}
            className='w-[250px]'
            renderItem={(item)=>(
              <List.Item style={{ textAlign: "left" }}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.logo} />}
                      title={item.symbol}
                      description={item.name}
                    />
                    <div>
                      {(
                        Number(item.balance) /
                        10 ** Number(item.decimals)
                      ).toFixed(2)}{" "}
                      Tokens
                    </div>
              </List.Item>
            )}
          />
        }
      </>,
    },
    {
      key: '2',
      label: 'NFTs',
      children: 
        <>
        {
          balance && balance.nfts.length > 0? (<>{
            balance.nfts.map((e, i)=>{
                return (<>
                  <img src={e} key={i} alt={"nftImage"} className='h-[240px] w-[240px] object-cover rounded-[10px]'/>
                </>)
            })
          }</>) : (<>
            No Nfts Were Found
          </>)
        }
        </>
    },
    {
      key: '3',
      label: 'Transfer',
      children: <div className='flex flex-col item-center gap-4 w-[250px]'>
          <div>
            <Input addonBefore="To:" placeholder='0x1' type='text' onChange={(e)=>{
              setAddress(e.target.value);
            }}/>
          </div>
          <div>
            <Input addonBefore="Amount:" onChange={(e)=>{
                setAmount(e.target.value);
            }}/>
          </div>
          <div>
              <Button type='dashed' className='w-full' onClick={async()=>{
                  const loadingmessage = message.loading("loading...", 0);
                  let miningmessage;
                  try{
                    if(amount === 0 || address === "" || selectedChain !== "0xAA36A7"){ 
                      message.error("Transactions Failed");
                      return;
                    }
                    const chain = "https://eth-sepolia.g.alchemy.com/v2/GRIRfkS8p_KDIhtPgEcauWBfjucLFolH";
                    const provider = new ethers.JsonRpcProvider(chain);
                    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
                    const wallet = new ethers.Wallet(privateKey, provider);
                    console.log("transaction starts");
                    const transaction = await wallet.sendTransaction({
                      to: address,
                      value: ethers.parseEther(amount)
                    });
                    setHash(transaction.hash);
                    loadingmessage();
                    miningmessage = message.loading("Minning...", 0);
                    console.log("mining starts");
                    const receipt = await transaction.wait();
                    if(miningmessage) miningmessage();
                    message.success("transaction successful");
                  } catch(err){
                    if(loadingmessage) loadingmessage();
                    if(miningmessage) miningmessage();
                    console.log(err);
                    message.error("Transactions Failed");
                    return;
                  }
                  await logTransaction(address, amount);
              }}>
                Submit
              </Button>
          </div>
      </div>,
    },
  ];

  return (
    <div className='mt-10 w-full flex items-center flex-col justify-center'>
        <div className='flex flex-row items-center gap-2 text-stone-700 mt-4'>
              <div className='text-xs'>{wallet.substr(0,10)} ... {wallet.substr(32,10)}</div>
              <div className='cursor-pointer' onClick={copyToClipboard}>
                  {
                      copied ? <TbCopyCheck/> : <FaRegCopy/>  
                  }
              </div>
        </div>
        <div>
            <div className='text-xl' >
                {
                  balance?.balance
                } 
                {" "}
                {
                  chain
                }
            </div>
        </div> 
        <div className='mt-8 w-full flex flex-col items-center justify-center'>
          <Tabs defaultActiveKey='1' items={items} className='w-[250px] flex items-center justify-between'/>
        </div>      
    </div>
  )
}

export default Wallet