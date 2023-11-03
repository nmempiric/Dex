/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY1,PRIVATE_KEY2,PRIVATE_KEY3,PRIVATE_KEY4 } = process.env;
console.log("API URL :---------",API_URL);
// console.log("private key 1 :---------",PRIVATE_KEY1);
// console.log("private key 2:---------",PRIVATE_KEY2);
// console.log("private key 3:---------",PRIVATE_KEY3);
console.log("private key 4:---------",PRIVATE_KEY4);

module.exports = {
   solidity: "0.8.20",
   defaultNetwork: "sepolia",
   networks: {
      hardhat: {},
      sepolia: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY4}`]
      }
   },
}