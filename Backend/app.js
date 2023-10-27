const ethers = require("ethers");
var express = require("express");
var app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();

const CustomToken = require("../Backend/ABI/CustomToken.json");
const Swap = require("../Backend/ABI/Swap.json");

const { API_URL, PRIVATE_KEY, PRIVATE_KEY2, SWAP_CONTRACT_ADDRESS } =
  process.env;
const SwapAbi = Swap.abi;

console.log("API KEY----------", API_URL);
console.log("PRIVATE KEY ACCOUNT 3---------", PRIVATE_KEY);
console.log("PRIVATE KEY ACCOUNT 2-------", PRIVATE_KEY2);
console.log("SWAP CONTRACT ADDRESS-----", SWAP_CONTRACT_ADDRESS);
// console.log("SWAP ABI----------", SwapAbi);

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const Contract = new ethers.Contract(SWAP_CONTRACT_ADDRESS, SwapAbi, provider);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const Signercontract = new ethers.Contract(
  SWAP_CONTRACT_ADDRESS,
  SwapAbi,
  signer
);

const user = new ethers.Wallet(PRIVATE_KEY2, provider);
const usercontract = new ethers.Contract(SWAP_CONTRACT_ADDRESS, SwapAbi, user);

app.get("/hello", async function (req, res) {
  res.send("Hello........");
});

// create token
app.post("/createtoken", async function (req, res) {
  try {
    const { name, symbol, totalsupply, tokenpriceinwei } = req.body;

    const createToken = await Signercontract.createCustomToken(
      name,
      symbol,
      totalsupply,
      tokenpriceinwei
    );
    await createToken.wait();

    res.status(200).json({ message: "Token Created Successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error in Token Create....", e });
  }
});

// get token detail by token name
app.get("/gettokendetail/:tokenName", async function (req, res) {
    try {
      const tokenName = req.params.tokenName; 
      const tokenDetail = await Contract.getTokenDetailsByName(tokenName);
  
      if (Array.isArray(tokenDetail) && tokenDetail.length > 0) {
        const address = tokenDetail[0];
        const name = tokenDetail[1];
        const symbol = tokenDetail[2];
        const initialSupply = tokenDetail[3].toNumber();
        const tokenPrice = tokenDetail[4].toNumber();
  
        const formattedResponse = {
          address,
          name,
          symbol,
          initialSupply,
          tokenPrice,
        };
        res.status(200).json({ tokenDetail: formattedResponse });
      } else {
        res.status(404).json({ message: "Token not found" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Token not Exists", error: e });
    }
});
  

//get all token detail
app.get("/getalltokendetail", async function (req, res) {
  try {
    const tokenDetails = await Contract.getCreatedTokenDetails();
    if (Array.isArray(tokenDetails) && tokenDetails.length > 0) {
      const formattedResponse = tokenDetails.map((tokenInfo) => ({
        address: tokenInfo.tokenAddress,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        initialSupply: tokenInfo.totalSupply.toNumber(),
        tokenPrice: tokenInfo.tokenPrice.toNumber(),
      }));
      res.status(200).json({ tokenDetails: formattedResponse });
    } else {
      res.status(404).json({ message: "No tokens found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error", error: e });
  }
});

// swap Ether To Token
app.post("/swapethtotoken", async function (req, res) {
  try {
    const { tokenName, ethAmount } = req.body;
    const swapEthToToken = await usercontract.swapEthToToken(tokenName, {
      value: ethers.utils.parseEther(ethAmount),
    });
    await swapEthToToken.wait();
    res
      .status(200)
      .json({
        message: "SwapEthToToken successfully",
        transactionhash: swapEthToToken.hash,
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error", error: e });
  }
});

// swap Token To Ether 
app.post("/swaptokentoeth", async function (req, res) {
    try {
      const { tokenName, tokenAmount } = req.body;
      const swapTokenToEth = await usercontract.swapTokenToEth(tokenName,tokenAmount);
      await swapTokenToEth.wait();
      res
        .status(200)
        .json({
          message: "SwapTokenToEther successfully",
          transactionhash: swapTokenToEth.hash,
        });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error", error: e });
    }
  });

// get token balance
app.post("/gettokenbalance", async function (req, res) {
  try {
    const { tokenName, userAddress } = req.body;
    const tokenBalance = await Contract.getTokenBalance(tokenName,userAddress);
    if(tokenBalance)
    {
        res.status(200).json({tokenBalance : tokenBalance.toNumber()})
    }
    else{
        res.status(400).json({message : "Token not found"});
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({message : "Interanal server error",e})
  }
});

app.listen(3000);
