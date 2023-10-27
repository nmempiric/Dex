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
  

// Factory deployed to: 0x1068A1Ac2A44f98c2413Db15a8f7179381A02714