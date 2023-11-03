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
  
// Factory deployed to: 0x5f22bcC1a831D4dF3E31280b4eA7547d9D374ee2