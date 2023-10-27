import React from "react";
import { Link } from "react-router-dom";
import logo from "../logo.png";
import etherlogo from "../ether.png";
import { Web3Button } from '@web3modal/react'

function Header() {
  return (
    <header className="bg-primary z-10 h-1/5 flex items-center justify-between pl-72 pr-56 pt-5" >
      <div className="flex items-center space-x-10">
        <img src={logo} alt="logo" className="w-16 h-16 pt-2"/>
        <Link to="/" className="text-white text-base font-bold ">
          Swap
        </Link>
        <Link to="/token" className="text-white text-base font-bold">
          Tokens
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center text-white gap-2">
          <img src={etherlogo} alt="eth" className="w-8 h-8" />
          Ethereum
        </div>
        <Web3Button />
      </div>
    </header>
  );
}

export default Header;
