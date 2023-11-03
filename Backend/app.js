const ethers = require("ethers");
var express = require("express");
var app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();

const CustomToken = require("../Backend/ABI/CustomToken.json");
const Swap = require("../Backend/ABI/Swap.json");

const {
  API_URL,
  PRIVATE_KEY1,
  PRIVATE_KEY2,
  PRIVATE_KEY3,
  PRIVATE_KEY4,
  TOKENA_ADDRESS,
  TOKENB_ADDRESS,
  TOKENC_ADDRESS,
  SWAP_CONTRACT_ADDRESS,
} = process.env;

const CustomTokenAbi = CustomToken.abi;
const SwapAbi = Swap.abi;

console.log("API KEY----------", API_URL);
console.log("PRIVATE KEY 1---------", PRIVATE_KEY1);
console.log("PRIVATE KEY 2-------", PRIVATE_KEY2);
console.log("PRIVATE KEY 3-------", PRIVATE_KEY3);
console.log("PRIVATE KEY 4-------", PRIVATE_KEY4);
console.log("Token A---------", TOKENA_ADDRESS);
console.log("Token B---------", TOKENB_ADDRESS);
console.log("Token C---------", TOKENC_ADDRESS);
// console.log("CUSTOM TOKEN ABI----------", CustomTokenAbi);
console.log("SWAP CONTRACT ADDRESS-----", SWAP_CONTRACT_ADDRESS);
// console.log("SWAP ABI----------", SwapAbi);

app.get("/hello", async function (req, res) {
  res.send("Hello........");
});

//  ************************ Custom Token API ****************************

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const ContractA = new ethers.Contract(TOKENA_ADDRESS, CustomTokenAbi, provider);
const ContractB = new ethers.Contract(TOKENB_ADDRESS, CustomTokenAbi, provider);
const ContractC = new ethers.Contract(TOKENC_ADDRESS, CustomTokenAbi, provider);

const signerA = new ethers.Wallet(PRIVATE_KEY1, provider);
const SignercontractA = new ethers.Contract(
  TOKENA_ADDRESS,
  CustomTokenAbi,
  signerA
);

const signerB = new ethers.Wallet(PRIVATE_KEY2, provider);
const SignercontractB = new ethers.Contract(
  TOKENB_ADDRESS,
  CustomTokenAbi,
  signerB
);

const signerC = new ethers.Wallet(PRIVATE_KEY3, provider);
const SignercontractC = new ethers.Contract(
  TOKENC_ADDRESS,
  CustomTokenAbi,
  signerC
);

// check the total balance of tokena
app.post("/checkBalancetokenA", async function (req, res) {
  try {
    const { Address } = req.body;
    const checkBalanceA = await ContractA.balanceOf(Address);
    res.status(200).json({ balanceOf: checkBalanceA.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// check the total balance of tokenb
app.post("/checkBalancetokenB", async function (req, res) {
  try {
    const { Address } = req.body;
    const checkBalanceB = await ContractB.balanceOf(Address);
    res.status(200).json({ balanceOf: checkBalanceB.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// check the total balance of tokenc
app.post("/checkBalancetokenC", async function (req, res) {
  try {
    const { Address } = req.body;
    const checkBalanceC = await ContractC.balanceOf(Address);
    res.status(200).json({ balanceOf: checkBalanceC.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// approve TokenA
app.post("/approvaltokenA", async function (req, res) {
  try {
    const { approveaddress, amountToApproveinwei } = req.body;
    const approveacc = await SignercontractA.approve(
      approveaddress,
      amountToApproveinwei
    );
    await approveacc.wait();
    res
      .status(200)
      .json({ message: "Approve Amount to account successfully." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// approve TokenB
app.post("/approvaltokenB", async function (req, res) {
  try {
    const { approveaddress, amountToApproveinwei } = req.body;
    const approveacc = await SignercontractB.approve(
      approveaddress,
      amountToApproveinwei
    );
    await approveacc.wait();
    res
      .status(200)
      .json({ message: "Approve Amount to account successfully." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// approve TokenC
app.post("/approvaltokenC", async function (req, res) {
  try {
    const { approveaddress, amountToApproveinwei } = req.body;
    const approveacc = await SignercontractC.approve(
      approveaddress,
      amountToApproveinwei
    );
    await approveacc.wait();
    res
      .status(200)
      .json({ message: "Approve Amount to account successfully." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// check TokenA Allowance
app.post("/checkAllowanceA", async function (req, res) {
  try {
    const { owner, spender } = req.body;
    const allowanceA = await ContractA.allowance(owner, spender);
    res.status(200).json({ Allowance_amount: allowanceA.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// check TokenB Allowance
app.post("/checkAllowanceB", async function (req, res) {
  try {
    const { owner, spender } = req.body;
    const allowanceB = await ContractB.allowance(owner, spender);
    res.status(200).json({ Allowance_amount: allowanceB.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// check TokenC Allowance
app.post("/checkAllowanceC", async function (req, res) {
  try {
    const { owner, spender } = req.body;
    const allowanceC = await ContractC.allowance(owner, spender);
    res.status(200).json({ Allowance_amount: allowanceC.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

//  ************************ SWAP API ****************************

const ContractSwap = new ethers.Contract(
  SWAP_CONTRACT_ADDRESS,
  SwapAbi,
  provider
);

const signerSwap = new ethers.Wallet(PRIVATE_KEY4, provider);
const SignercontractSwap = new ethers.Contract(
  SWAP_CONTRACT_ADDRESS,
  SwapAbi,
  signerSwap
);

// Add  token
app.post("/addtoken", async function (req, res) {
  try {
    const { tokenAddress, tokenpriceinwei } = req.body;

    const addToken = await SignercontractSwap.addSupportedToken(
      tokenAddress,
      tokenpriceinwei
    );
    await addToken.wait();

    res.status(200).json({ message: "Add Token Successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// update token price
app.post("/updatetokenprice", async function (req, res) {
  try {
    const { tokenAddress, Newtokenpriceinwei } = req.body;

    const updateprice = await SignercontractSwap.updateTokenPrice(
      tokenAddress,
      Newtokenpriceinwei
    );
    await updateprice.wait();

    res.status(200).json({ message: "Update Token Price Successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// check token price
app.post("/checktokenprice", async function (req, res) {
  try {
    const { tokenAddress } = req.body;
    const tokenprice = await ContractSwap.tokenPrices(tokenAddress);
    res.status(200).json({ tokenprice: tokenprice.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

// // swap Ether To Token
// app.post("/swapethtotoken", async function (req, res) {
//   try {
//     const { tokenName, ethAmount } = req.body;
//     const swapEthToToken = await usercontract.swapEthToToken(tokenName, {
//       value: ethers.utils.parseEther(ethAmount),
//     });
//     await swapEthToToken.wait();
//     res
//       .status(200)
//       .json({
//         message: "SwapEthToToken successfully",
//         transactionhash: swapEthToToken.hash,
//       });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Internal server error", error: e });
//   }
// });

// // swap Token To Ether
// app.post("/swaptokentoeth", async function (req, res) {
//     try {
//       const { tokenName, tokenAmount } = req.body;
//       const swapTokenToEth = await usercontract.swapTokenToEth(tokenName,tokenAmount);
//       await swapTokenToEth.wait();
//       res
//         .status(200)
//         .json({
//           message: "SwapTokenToEther successfully",
//           transactionhash: swapTokenToEth.hash,
//         });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Internal server error", error: e });
//     }
//   });


app.listen(3000);
