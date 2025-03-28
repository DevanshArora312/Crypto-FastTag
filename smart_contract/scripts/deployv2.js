const hre = require("hardhat");

async function main() {
  const Registery = await hre.ethers.getContractFactory("Registery");
  const registery = await Registery.deploy();

  await registery.deployed();
  console.log(`Registery deployed to: ${registery.address}`);

  const Wallet = await hre.ethers.getContractFactory("MinimalWallet");
  const wallet = await Wallet.deploy();

  await wallet.deployed();
  console.log(`Wallet deployed to: ${wallet.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
