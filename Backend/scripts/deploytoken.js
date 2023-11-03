const hre = require('hardhat');

async function main() {

    const CustomToken = await hre.ethers.getContractFactory("CustomToken")
    const customToken = await CustomToken.deploy('TokenC', 'TKC', 10000);

    await customToken.deployed();

    console.log("Factory deployed to:", customToken.address);
}   

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
 
// tokenA contract address= 0xA0BAfe3Fbb65D440f33248d243Ed21628655406C
// tokenB contract address= 0x0F0bABD59367Ba664CE16a4691FC9a3d55087919
// tokenC contract address= 0x387B5381a20A979d06149af57a2A19D11596521c

