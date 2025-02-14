const hre = require("hardhat");

async function main() {
  // Step 1: Deploy Verifier
  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  console.log("Verifier deployed to:", verifier.target);

  // Step 2: Deploy AadhaarRegistry (with Verifier address)
  const AadhaarRegistry = await hre.ethers.getContractFactory("AadhaarRegistry");
  const registry = await AadhaarRegistry.deploy(verifier.target);
  await registry.waitForDeployment();
  console.log("AadhaarRegistry deployed to:", registry.target);

  // Step 3: Deploy WalletFactory (with AadhaarRegistry address)
  const WalletFactory = await hre.ethers.getContractFactory("WalletFactory");
  const walletFactory = await WalletFactory.deploy(registry.target);
  await walletFactory.waitForDeployment();
  console.log("WalletFactory deployed to:", walletFactory.target);

  // Step 4: Link WalletFactory to AadhaarRegistry
  await registry.setWalletFactory(walletFactory.target);
  console.log("WalletFactory linked to AadhaarRegistry");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });