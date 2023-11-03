import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'
import { ethers } from "ethers";

const chains = [arbitrum, mainnet, polygon]
const projectId = 'bf7c084c4fc535f2e46e1b5f5c11b4b9'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

const root = ReactDOM.createRoot(document.getElementById("root"));

function AppWithEthereumClient() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const etherBalance = await provider.getBalance(accounts[0]);
            const eBalance = ethers.utils.formatEther(etherBalance);
            const formattedBalance = parseFloat(eBalance).toFixed(3);
            // console.log("Ether balance:   ",formattedBalance);
            setBalance(formattedBalance);
          } else {
            setAccount("");
            setBalance(0);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", fetchAccount);  
    }
    fetchAccount(); 

    // Cleanup the listener when the component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", fetchAccount);
      }
    };

  
  }, []);

  console.log("ether balance***********",balance);
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <BrowserRouter>
          <App Account={account} Balance={balance} />
          <ToastContainer />
        </BrowserRouter>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />

    </>
  );
}

root.render(<AppWithEthereumClient />);

reportWebVitals();
