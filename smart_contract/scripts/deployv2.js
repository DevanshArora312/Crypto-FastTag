const hre = require("hardhat");

async function main() {
  const Registery = await hre.ethers.getContractFactory("Registery");
  const registery = await Registery.deploy();

  await registery.waitForDeployment();
  console.log(`Registery deployed to: ${registery.target}`);

  const Wallet = await hre.ethers.getContractFactory("MinimalWallet");
  const wallet = await Wallet.deploy();

  await wallet.waitForDeployment();
  console.log(`Wallet deployed to: ${wallet.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
