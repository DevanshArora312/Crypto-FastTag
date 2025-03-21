import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { Steps, Button, Input, Card, message } from 'antd';
import CryptoJS from 'crypto-js';
import "../App.css";
const Signin = ({setWallet, setSeedPhrase}) => {
    const [password, setPassword] = useState('');

    const unlockWallet = () => {
        const encryptedWallet = localStorage.getItem('encryptedWallet');
        if (!encryptedWallet) {
            message.error('No wallet found!');
            return;
        }
  
        try {
            const decryptedSeedPhrase = CryptoJS.AES.decrypt(encryptedWallet, password).toString(CryptoJS.enc.Utf8);
            const wallet = ethers.Wallet.fromPhrase(decryptedSeedPhrase);
            setWallet(wallet.address);
            setSeedPhrase(decryptedSeedPhrase);
            message.success('Wallet unlocked successfully!');
            
        } catch (error) {
            console.log(error);
            message.error('Incorrect password or failed to decrypt!');
        }
    };

    return (
    <div>
      <h2 className='mb-8'>Manage Wallet</h2>
      <Input.Password
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <div className='flex flex-col mt-2 gap-6'>
        <Button onClick={unlockWallet} type="primary"  disabled={!password}>
            Unlock Wallet
        </Button>
        <Button onClick={()=>{
            message.error('This feature is under development')
        }} type="default">
            Recover Wallet
        </Button>
      </div>
    </div>
  )
}

const CreatePassword = ({ seedPhrase, setStep }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (password === '' || confirmPassword === '') {
      message.error('Please fill in both fields.');
      return;
    }

    if (password !== confirmPassword) {
      message.error('Passwords do not match.');
      return;
    }

    const encryptedSeedPhrase = CryptoJS.AES.encrypt(seedPhrase, password).toString();
    localStorage.setItem('encryptedWallet', encryptedSeedPhrase);

    setStep(3);
  };

  return (
    <div className="flex flex-col mt-8 gap-4">
      <h2>Create Password</h2>
      <div className="input-field">
        <Input.Password
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '12px' }}
        />
      </div>
      <div className="input-field">
        <Input.Password
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ marginBottom: '12px' }}
        />
      </div>
      <Button type="primary" onClick={handleSubmit}>
        Submit Password
      </Button>
    </div>
  );
};

const Password = ({ setSeedPhrase, setWallet, setStep }) => {
    const [newSeedPhrase, setNewSeedPhrase] = useState(null);
    // const navigate = useNavigate();

    const generateWallet = async () => {
        const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
        setNewSeedPhrase(mnemonic);
    };

    const finalizeWallet = () => {
        const wallet = ethers.Wallet.fromPhrase(newSeedPhrase);
        setSeedPhrase(newSeedPhrase);
        setStep(2);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(newSeedPhrase).then(() => {
            message.success('Seed phrase copied to clipboard!');
        }).catch((err) => {
            message.error('Failed to copy seed phrase!');
            console.error('Copying failed', err);
        });
    };

    return (
        <div className='mt-8'>
            <div className='text-[#faad14] mt-4 bg-[#fffbe6] border-1 border-[#ffe58f] p-[8px] display-flex flex-start items-center text-sm text-center'>
                Once you generate the seed phrase, save it securely in order to recover your wallet in the future.
            </div>
            <div className='w-full flex flex-col items-start mt-16 pl-2'>
                {newSeedPhrase && (
                    <div onClick={copyToClipboard} className='py-2'>
                        <Button type='default'>Copy to Clipboard</Button>
                    </div>
                )}
            </div>
            {
                newSeedPhrase && 
                <div className='h-[200px] mb-2 px-2'>
                    <Card className='p-[5px]'>
                        {
                            newSeedPhrase && <div className='flex flex-col items-center justify-center gap-4 fade-in'>
                                <div className='flex flex-row items-center gap-12 justify-center'>
                                    {
                                        newSeedPhrase.split(" ").slice(0, 4).map((phrase, ind) => {
                                            return <span key={ind} className='bg-blue-400/40 px-2 text-blue-700 rounded-full'>{phrase}</span>
                                        })
                                    }
                                </div>
                                <div className='flex flex-row items-center gap-12 justify-center'>
                                    {
                                        newSeedPhrase.split(" ").slice(4, 8).map((phrase, ind) => {
                                            return <span key={ind} className='bg-blue-400/40 px-2 text-blue-700 rounded-full'>{phrase}</span>
                                        })
                                    }
                                </div>
                                <div className='flex flex-row items-center gap-12 justify-center'>
                                    {
                                        newSeedPhrase.split(" ").slice(8, 12).map((phrase, ind) => {
                                            return <span key={ind} className='bg-blue-400/40 px-2 text-blue-700 rounded-full'>{phrase}</span>
                                        })
                                    }
                                </div>
                            </div>
                        }
                    </Card>
                </div>
            }
            <div className='flex flex-col items-center gap-2'>
                <div onClick={finalizeWallet}>
                    <Button type='primary' disabled={newSeedPhrase === null}>Create Wallet</Button>
                </div>
                <div onClick={generateWallet}>
                    <Button type='default'>Generate Seed Phrase</Button>
                </div>
            </div>
        </div>
    );
};
const CreateWallet = ({setWallet, seedPhrase, setSeedPhrase}) => {
    const existingWallet = localStorage.getItem('encryptedWallet');
    const [step, setStep] = useState(existingWallet ? 3 : 1);
  return (
    <div className='mt-20'>
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
                title: step == 3 ? 'In Progress' : 'Waiting',
            },
            ]}
        />
        {
            step === 1 &&
            <Password setSeedPhrase={setSeedPhrase} setStep={setStep}/>
        }
        {
            step === 2 && 
            <CreatePassword seedPhrase={seedPhrase} setStep={setStep}/>
        }
        {
            step === 3 && 
            <Signin setSeedPhrase={setSeedPhrase} setWallet={setWallet} />
        }
    </div>
  )
}

export default CreateWallet