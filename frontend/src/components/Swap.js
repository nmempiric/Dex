import React, { useEffect, useState } from "react";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import { FcSettings } from "react-icons/fc";
import { IoIosArrowDown } from "react-icons/io";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import Modal from "./Model";
import axios from "axios";
import {ethers} from "ethers";
import Swap from "../ABI/Swap.json";
// const { ethers } = require("ethers");



// import TokenBalance from "../components/TokenBalance";

export default function Home() {
  
  const {REACT_APP_SWAP_CONTRACT_ADDRESS} = process.env;

  const SwapAbi = Swap.abi; 
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contractSwap = new ethers.Contract(
    REACT_APP_SWAP_CONTRACT_ADDRESS,
    SwapAbi,
    provider
  );

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const { address } = useAccount();
  const [srcToken, setSrcToken] = useState("Eth");
  const [destToken, setDestToken] = useState("Select a token");
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [swapBtnText, setSwapBtnText] = useState("ENTER_AMOUNT");
  const [reverse, setReverse] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [srctokenPrice, setSrcTokenPrice] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
  const [selectedSrcTokenAddress, setSelectedSrcTokenAddress] = useState("");

  const handleModal = () => {
    setModal(true);
  };
  const handleModal1 = () => {
    setModal1(true);
  };

  //  ether to wei
  function etherToWei(ether) {
    return ethers.utils.parseEther(ether.toString());
  }

  //  ether to wei
  //   function WeiToEther(Wei) {
  //       return ethers.utils.formatEther(Wei);
  //   }

  
  // Handling the text of the submit button
  useEffect(() => {
   
    if (!address) setSwapBtnText("CONNECT WALLET");
    else if (!inputValue) setSwapBtnText("ENTER AMOUNT");
    else setSwapBtnText("SWAP");
  }, [inputValue, outputValue, address]);

  // Function to perform Ether to Token swap
  const swapEtherToToken = async () => {
    try{
      var inputvalueinwei = etherToWei(inputValue);
      console.log("input value--",inputvalueinwei);
      console.log("selected token---",selectedTokenAddress);
      const signer = provider.getSigner();
      const contractWithSigner = contractSwap.connect(signer);
      const owner = "0x7049577ABAea053257Bf235bFDCa57036Aed6AdD";

      const tx = await contractWithSigner.swapEtherForToken(selectedTokenAddress , owner ,{ value: inputvalueinwei });
      await tx.wait();

      toast.success("SwapEthToToken successfully");
      setInputValue("");
      setOutputValue("");

    }
    catch(e){
      toast.error(e);
      console.error(e);
    }
  };

  // Function to perform Token to Token swap
  const swapTokenforToken = async () => {
    try{
      var inputvalueinwei = etherToWei(inputValue).toString();
      console.log("input value--",inputvalueinwei);
      console.log("Src Token----",selectedSrcTokenAddress);
      console.log("destination token---",selectedTokenAddress);
     
      const signer = provider.getSigner();
      const contractWithSigner = contractSwap.connect(signer);
      const toOwner = "0xf8b02EE855D5136ed1D782fC0a53a0CDdA65c946";

      const tx = await contractWithSigner.swapTokenToToken(selectedSrcTokenAddress,selectedTokenAddress , inputvalueinwei , toOwner );
      await tx.wait();

      toast.success("Swap Token successfully");
      setInputValue("");
      setOutputValue("");

    }
    catch(e){
      toast.error(e);
      console.error(e);
    }
  };

  // Handle the swap based on the selected tokens
  const handleSwap = async () => {
    // setIsSwapping(true);
    if (!address) {
      toast.warning("Please Connect Wallet.");
      return;
    }

    if (srcToken === "Eth" && destToken !== "Select a token") {
      await swapEtherToToken();
    } 
    // else if (srcToken !== "Eth" && destToken === "Eth") {
    //   await swapTokenToEther();
    // }
    else if(srcToken !== "Eth" && destToken !== "Eth"  && srcToken !== "Select a token" && destToken !== "Select a token"){
      await swapTokenforToken();
    }
    else {
      toast.error("please select token to perform swap");
    }

    // setIsSwapping(false);
  };

  // //   get the Token Price
  useEffect(() => {
    //   console.log("sorce Token-----", srcToken);
    // console.log("destination Token--------", destToken);
    // console.log("token address--------",selectedTokenAddress);
    if (destToken !== "Select a token" && srcToken === "Eth") {
      // console.log("Token address--------",selectedTokenAddress);
      const checkTokenPriceUrl = "http://localhost:3000/checktokenprice";
      const requestData = { tokenAddress: selectedTokenAddress };
  
      axios
        .post(checkTokenPriceUrl, requestData)
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            console.log("price Data========",data.tokenprice);
            setTokenPrice(data.tokenprice);
          } else {
            console.error(
              "Failed to fetch token price:",
              response.status,
              response.data
            );
          }
        })
        .catch((error) => {
          console.error("Axios error:", error);
        });
    } else if (destToken === "Eth" && srcToken !== "Eth") {
      const checkTokenPriceUrl = "http://localhost:3000/checktokenprice";
      const requestData = { tokenAddress: selectedTokenAddress };
  
      axios
        .post(checkTokenPriceUrl, requestData)
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            console.log("destination price Data========",data.tokenprice);
            setTokenPrice(data.tokenprice);
          } else {
            console.error(
              "Failed to fetch token price:",
              response.status,
              response.data
            );
          }
        })
        .catch((error) => {
          console.error("Axios error:", error);
        });
    } 
    else if (srcToken !== "Eth" && destToken !== "Eth"  && srcToken !== "Select a token" && destToken !== "Select a token") {
      const checkTokenPriceUrl = "http://localhost:3000/checktokenprice";
      // console.log("Src token----------",selectedSrcTokenAddress);
      // console.log("Dest token---------",selectedTokenAddress);
        const sourceTokenRequestData = { tokenAddress: selectedSrcTokenAddress };
        const destTokenRequestData = { tokenAddress: selectedTokenAddress };

        // Fetch the price of the source token
        axios.post(checkTokenPriceUrl, sourceTokenRequestData)
            .then((sourceResponse) => {
                if (sourceResponse.status === 200) {
                    const sourceData = sourceResponse.data;
                    const sourceTokenPrice = sourceData.tokenprice;
                    console.log("Source Token Price:", sourceTokenPrice);
                    setSrcTokenPrice(sourceTokenPrice);
          
                    // Fetch the price of the destination token
                    axios.post(checkTokenPriceUrl, destTokenRequestData)
                        .then((destResponse) => {
                            if (destResponse.status === 200) {
                                const destData = destResponse.data;
                                const destTokenPrice = destData.tokenprice;
                                console.log("Destination Token Price:", destTokenPrice);
                                setTokenPrice(destTokenPrice);
                            } else {
                                console.error("Failed to fetch destination token price:", destResponse.status, destResponse.data);
                            }
                        })
                        .catch((destError) => {
                            console.error("Axios error while fetching destination token price:", destError);
                        });

                } else {
                    console.error("Failed to fetch source token price:", sourceResponse.status, sourceResponse.data);
                }
            })
            .catch((sourceError) => {
                console.error("Axios error while fetching source token price:", sourceError);
            });

    }
    else {
      console.error("Failed to fetch token price");
    }
  }, [selectedTokenAddress,selectedSrcTokenAddress,destToken, srcToken]);
  

  // calculate the conversion rate
  const calculateConversionRate = () => {
    // console.log("token price------", tokenPrice);
    var inputvalueinwei = etherToWei(inputValue);
    // console.log("input value in wei---------",inputvalueinwei);
    // console.log("Output value-------", outputValue);
    // const inputInEther = (inputvalueinwei.toString() * tokenPrice) / 1e18 / 1e18;
    // console.log("Value in Ether:", inputInEther);

    if (srcToken === "Eth" && destToken !== "Select a token") {
      return `${inputValue} Eth = ${
        inputvalueinwei.toString() / tokenPrice
      } ${destToken}`;
    } else if (destToken === "Eth" && srcToken !== "Eth") {
      return `${inputValue} ${srcToken} = ${
        (inputvalueinwei.toString() * tokenPrice) / 1e18 / 1e18
      } Eth`;
    } 
    else if(srcToken !== "Eth" && destToken !== "Eth"  && srcToken !== "Select a token" && destToken !== "Select a token"){
      // console.log("src price in calculate-----",srctokenPrice);
      // console.log("dest price in calculaete-----",tokenPrice);
      return `${inputValue} ${srcToken} = ${
            ((inputvalueinwei.toString() * srctokenPrice) / tokenPrice) / 1e18 
          } ${destToken}`;
    }
    else {
      return `1 ${srcToken} = ${tokenPrice} ${destToken}`;
    }
  };

  const handleChangeSwap = () => {
    setReverse(!reverse);
    setInputValue(outputValue);
    setOutputValue(inputValue);
    setSrcToken(destToken);
    setDestToken(srcToken);
  };

  //   change the output field
  useEffect(() => {
    if (srcToken === "Eth" && destToken !== "Select a token") {
      const inputAsNumber = parseFloat(inputValue);
      if (!isNaN(inputAsNumber) && inputAsNumber >= 0) {
        const inputvalueinwei = etherToWei(inputValue);
        const convertedValue = inputvalueinwei / tokenPrice;
        setOutputValue(convertedValue.toString());
      }
    } else if (destToken === "Eth" && srcToken !== "Eth") {
      const inputAsNumber = parseFloat(inputValue);
      if (!isNaN(inputAsNumber) && inputAsNumber >= 0) {
        const inputvalueinwei = etherToWei(inputValue);
        const convertedValue = (inputvalueinwei * tokenPrice) / 1e18 / 1e18;
        setOutputValue(convertedValue.toString());
      }
    } 
    else if (srcToken !== "Eth" && destToken !== "Eth"  && srcToken !== "Select a token" && destToken !== "Select a token") {
      const inputAsNumber = parseFloat(inputValue);
      if (!isNaN(inputAsNumber) && inputAsNumber >= 0) {
        const inputvalueinwei = etherToWei(inputValue);
        const convertedValue = ((inputvalueinwei * srctokenPrice) / tokenPrice) / 1e18 ;
        // console.log("value========",convertedValue);
        setOutputValue(convertedValue.toString());

      }
    }
    else {
      const inputAsNumber = parseFloat(inputValue);
      if (!isNaN(inputAsNumber) && inputAsNumber >= 0) {
        setOutputValue(inputValue);
      }
    }
  }, [srcToken, destToken, inputValue, tokenPrice,srctokenPrice]);

  return (
    <>
      <div className="bg-primary dark:bg-gray-700">
        <div className="flex justify-center items-center bg-primary dark:bg-gray-700 pb-[390px]">
          <div
            className="bg-[#418ACA] dark:bg-gray-800 relative flex flex-col gap-2 justify-center w-[25%] mt-32 px-4 pt-16 pb-10 rounded-3xl"
            style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
          >
            <div className="absolute w-11/12 flex justify-between items-center top-3 px-2">
              <p className="text-2xl text-[#243056]">Swap</p>
              <FcSettings className="text-3xl text-[#243056]" />
            </div>

            <div className="relative w-full">
              <input
                value={inputValue}
                placeholder={"0.0"}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                type="text"
                className="w-full border-none text-white bg-primary dark:bg-gray-700 text-3xl border-2 border-grey-500 py-8 px-4 rounded-2xl focus:outline-none"
              />
              <p className="absolute top-2 left-3 text-white text-sm">
                You pay
              </p>

              {reverse ? (
                <BsFillArrowUpSquareFill
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                  onClick={handleChangeSwap}
                  className="absolute z-10 dark:text-gray-400 rounded-lg cursor-pointer top-[88%] left-[45%] text-4xl"
                />
              ) : (
                <BsFillArrowDownSquareFill
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                  onClick={handleChangeSwap}
                  className="absolute z-10 dark:text-gray-400 rounded-lg cursor-pointer top-[88%] left-[45%] text-4xl"
                />
              )}

              <button
                onClick={handleModal1}
                className="flex justify-center items-center gap-1 absolute text-white top-[30%] right-6  bg-[#455A64] dark:bg-gray-800 font-medium rounded-3xl hover:bg-[#757575] text-lg px-2 py-1 text-center mr-3 md:mr-0"
              >
                {srcToken === destToken ? "Eth" : srcToken} <IoIosArrowDown />
              </button>
            </div>

            <div className="relative">
              <input
                value={outputValue}
                placeholder="0.0"
                type="text"
                className="w-full border-none text-white bg-primary dark:bg-gray-700 text-3xl border-2 border-grey-500 py-8 px-4 rounded-2xl focus:outline-none"
              />
              <p className="absolute top-2 left-3 text-white text-sm">
                You receive
              </p>
              <button
                onClick={handleModal}
                className="flex justify-center items-center gap-1 absolute text-white top-[25%] right-4  bg-[#455A64] dark:bg-gray-800 font-medium rounded-3xl hover:bg-[#757575] text-lg px-4 py-2 text-center mr-3 md:mr-0"
              >
                {destToken === srcToken ? "Select a token" : destToken}{" "}
                <IoIosArrowDown />
              </button>
            </div>

            {destToken !== "Select a token" && inputValue > 0 && (
              <div className="flex items-center w-full border-none text-white bg-primary dark:bg-gray-700 text-3xl border-2 border-grey-500 py-2 px-4 rounded-2xl focus:outline-none">
                <p className="text-sm">{calculateConversionRate()}</p>
                <IoIosArrowDown className="ml-auto text-sm" />
              </div>
            )}
            <button
              type="button"
              style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
              disabled={!address}
              onClick={() => {
                if (swapBtnText === "SWAP") {
                  setIsSwapping(true); 
                  handleSwap()
                    .then(() => {
                      
                    })
                    .catch((error) => {
                      
                    })
                    .finally(() => {
                      setIsSwapping(false); 
                    });
                }
              }}
              className="text-white bg-[#243056] !important hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xl px-4 py-3 text-center mr-3 md:mr-0 dark:hover-bg-blue-700 dark:focus:ring-blue-800"
            >
              {isSwapping ? (
                <div className="animate-spin h-8 w-8 border-t-2 border-white m-auto rounded-full "></div>
              ) : (
                swapBtnText
              )}
            </button>
          </div>
        </div>

        {modal && (
          <Modal
            setModal={setModal}
            setDestToken={setDestToken}
            setSrcToken={setSrcToken}
            modal={modal}
            onSelectToken={setSelectedTokenAddress}
            
          />
        )}
        {modal1 && (
          <Modal
            setModal={setModal1}
            setSrcToken={setSrcToken}
            setDestToken={setDestToken}
            modal={modal}
            onSelectToken={setSelectedSrcTokenAddress}
          />
        )}
      </div>
    </>
  );
}
