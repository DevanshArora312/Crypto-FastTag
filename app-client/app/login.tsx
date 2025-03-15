import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { ethers, Wallet } from 'ethers';
import registryAbi from "../contracts/AadhaarRegistry.json"
import factoryAbi from "../contracts/WalletFactory.json"
import { useRouter } from 'expo-router';

const registryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const factoryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const registryABI = registryAbi.abi;
const factoryABI = factoryAbi.abi;

const VerifyAndRegister = () => {
  const [walletAdd,setWallet] = useState<string>("");  
  const verifyAndRegister = async () => {
    try {
      // Connect to Local Hardhat Node
      const provider = new ethers.JsonRpcProvider("http://10.0.2.2:8545");
      console.log("prov: ",await provider.getBlockNumber());
      // Use the first account provided by Hardhat
      const signer = await provider.getSigner(0); // Account 0 from Hardhat
      console.log("Signer : ",signer)
      // Get Contract Instance
      const registryContract = new ethers.Contract(
        registryAddress,
        registryABI,
        signer
      );

      const [verified,registered,proof] = await registryContract.verifyAndCheck();
      console.log(verified,registered,proof);
      if(!verified){
        throw new Error("Verification Error!!")
      } 
      const factoryContract = new ethers.Contract(
        factoryAddress,
        factoryABI,
        signer
      );
        
      if(!registered){
        const tx = await factoryContract.createWallet(proof);
        console.log("WALLET CREATED!!",tx);
        const receipt = await tx.wait();
        console.log("reciept",receipt);
        const event = receipt.logs.find((log:any) => {
          try {
            const parsedLog = factoryContract.interface.parseLog(log);
            return parsedLog?.name === "WalletCreated";
          } catch (e) {
            return false;
          }
        });

        if (event) {
          const parsedEvent = factoryContract.interface.parseLog(event);
          const walletAddress = parsedEvent?.args.wallet;
          setWallet(walletAddress);
          console.log("WALLET CREATED!!", walletAddress);
        } else {
          console.log("No WalletCreated event found.");
        }

      } else{
        const addResp = await registryContract.getWallet(proof);
        setWallet(addResp);
        console.log("WALLET FETCHED!!",addResp);
      }
      Alert.alert("Success", "Proof Verified and Wallet Registered!");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Verification or Registration failed");
    }
  };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify and Register Wallet</Text>
        <Button title="Verify & Register" onPress={verifyAndRegister} />
        <Text style={styles.title}>Wallet Address is: {walletAdd}</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      color:"white"
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
    },
  });
  
  export default VerifyAndRegister;