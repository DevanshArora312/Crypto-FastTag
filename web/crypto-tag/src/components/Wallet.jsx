import  {useEffect, useState} from 'react'
import { FaRegCopy } from "react-icons/fa";
import { TbCopyCheck } from "react-icons/tb";
import { Button, Input, List, message, QRCode } from 'antd';
import { Tabs, Avatar, Watermark  } from "antd";
import {ethers} from 'ethers';
import { contractAddress, contractAbi } from '../constants';
import RegistryAbi from "../assets/Registery.json"
const registryAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

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

  const getFastag = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      try {
          const contract = new ethers.Contract(registryAddress, RegistryAbi.abi, signer);
          const proofHash = localStorage.getItem("proofHash");
          const tx = await contract.getUserFastags(proofHash); 
          setFastags(tx)
          message.success("Transaction Successful!");
      } catch (error) {
          console.error("Error executing contract function:", error);
          message.error("Transaction Failed!");
      }
  }
  
  useEffect(()=>{
    getFastag()
  }, [])

  const getBal = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
        let proofHash =  localStorage.getItem('proofHash') || "U2FsdGVkX18F9Q";
        
        const contract = new ethers.Contract(registryAddress, RegistryAbi.abi, signer);
        const tx = await contract.getWalletBalance(proofHash); 
        const balanceEth = ethers.formatEther(tx);

        console.log(`Wallet Balance: ${balanceEth} ETH`);
        setWalletBalance(balanceEth);
    } catch (error) {
        console.error("Error executing contract function:", error);
        alert("Transaction Failed!");
    }
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
  const [walletBalance, setWalletBalance] = useState(0);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");
  const [fastags, setFastags] = useState([]);
  const [fastagbalance, setFastagbalance] = useState([]);
  useEffect(()=>{
    (async()=>{
      const response = await fetch(`http://localhost:5000/getFunds?userAddress=${wallet}&chain=${selectedChain}`);
      const data = await response.json();
      setBalance(data);
      await getBal();
    })();
  }, []);
  useEffect(()=>{
    (async()=>{
      let _balance = []
      for(let tag of _fastags){
        console.log("wallet", tag);
        const response = await fetch(`http://localhost:5000/getFunds?userAddress=${tag.wallet.address}&chain=${selectedChain}`);
        const data = await response.json();
        _balance.push(data);
      }
      setFastagbalance(_balance);
    })();
  }, [])
  console.log("fastag : ", fastagbalance);
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
            dataSource={[]}
            className='w-[250px] md:w-[450px] h-[160px] flex flex-col items-center'
            renderItem={(item)=>(
              <List.Item style={{ textAlign: "left" }}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.logo} style={{ margin: "auto" }}/>}
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
          [].length > 0? (<>{
            balance.nfts.map((e, i)=>{
                return (<>
                  <img src={e} key={i} alt={"nftImage"} className='h-[300px] w-[250px] md:w-[450px] object-cover rounded-[10px]'/>
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
      children: <div className='flex flex-col item-center gap-8 w-[250px] md:w-[450px]'>
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
                  message.error("feature under development")
                  return;

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
                    console.log("transaction starts");
                    const wallet = new ethers.Wallet(privateKey, provider);
                    // console.log("transaction starts");
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
    {
      key: '4',
      label: 'FastTags',
      children: <div className='flex flex-col item-center mx-auto gap-8 w-[250px] md:w-[450px]'>
          {
            fastags.map((item, index)=>{
              return <Watermark content="TollChain" className='flex flex-row items-center px-2 border rounded-md cursor-pointer py-2 gap-2'>
                <div key={index} className='flex flex-col justify-center items-start'>
                  <div>Model: {item[3]}</div>
                  <div>Chasis Number: {item[2]}</div>
                  <div>Engine Number: {item[4]}</div>
                  <div>Registration Number: {item[1]}</div>
                  <div>{
                    fastagbalance.length > index && <div>
                      Balance: {fastagbalance[index].balance}
                    </div> 
                  }</div>
                </div>
                <div>
                  <QRCode value={"https://en.wikipedia.org/wiki/Underdevelopment"} />
                </div>
              </Watermark> 
            })
          }
      </div>
    }
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
                  walletBalance
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