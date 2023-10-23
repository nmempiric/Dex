const hre = require('hardhat');

async function main() {

    const Swap = await hre.ethers.getContractFactory("Swap")
    const swap = await Swap.deploy();

    await swap.deployed();

    console.log("Factory deployed to:", swap.address);
}   

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
  

// Factory deployed to: 0x69185821Bfd2256A9c5364733ae247366EEb9F15