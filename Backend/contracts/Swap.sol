// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./ICustomERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";


contract Swap {
    // uint256 public tokenPrice = 1000000000000000000;  // token price 1 Ether
    mapping(address => uint256) public tokenPrices;
    mapping(address => IERC20) public supportedTokens;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }


    // add token
    function addSupportedToken(address tokenAddress, uint256 priceinwei) public onlyOwner {
        supportedTokens[tokenAddress] = IERC20(tokenAddress);
        tokenPrices[tokenAddress] = priceinwei;
    }

    //update token price 
    function updateTokenPrice(address tokenAddress, uint256 newPriceinwei) public onlyOwner {
        require(address(supportedTokens[tokenAddress]) != address(0), "Token not supported");
        tokenPrices[tokenAddress] = newPriceinwei;
    }

    // get Token Balance    
    function getTokenBalance(address tokenAddress, address account) public view returns (uint256) {
        IERC20 token = supportedTokens[tokenAddress];
        return token.balanceOf(account);
    }

    // swap ether to token
    function swapEtherForToken(address tokenAddress, address tokenOwner) public payable {
        require(msg.value > 0, "You must send some Ether to perform the swap.");
        IERC20 token = supportedTokens[tokenAddress];
        require(address(token) != address(0), "Token not supported");

        uint256 tokenPrice = tokenPrices[tokenAddress];

         uint256 tokenAmount = (msg.value * 10**18) / tokenPrice; 
        console.log("Token Amount---",tokenAmount);

        require(token.allowance(tokenOwner, address(this)) >= tokenAmount, "Not enough allowance.");

        token.transferFrom(tokenOwner, msg.sender, tokenAmount);

        payable(tokenOwner).transfer(msg.value);

    }

    // swap token to token
    function swapTokenToToken(address fromTokenAddress, address toTokenAddress, uint256 tokenamount,address toowner) public {
        IERC20 fromToken = supportedTokens[fromTokenAddress];
        IERC20 toToken = supportedTokens[toTokenAddress];
        
        require(address(fromToken) != address(0) && address(toToken) != address(0), "Tokens not supported");

        require(fromToken.allowance(msg.sender, address(this)) >= tokenamount, "Not enough allowance.");

        uint256 tokenPrice = tokenPrices[toTokenAddress];
        uint256 receivedTokenAmount = (tokenamount * tokenPrice) / 1e18;
        require(toToken.balanceOf(toowner) >= receivedTokenAmount, "Not enough tokens in the contract.");

        fromToken.transferFrom(msg.sender, toowner, tokenamount);
        toToken.transferFrom(toowner, msg.sender, receivedTokenAmount);
    }

   
}

// 2000000000000000000000 token 

// token1 : 0xd9145CCE52D386f254917e481eB44e9943F39138
// token1 owner : 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

// token2 : 0xa131AD247055FD2e2aA8b156A11bdEc81b9eAD95
// token2 owner : 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2

// token3 : 0xE2DFC07f329041a05f5257f27CE01e4329FC64Ef
// token3 owner : 0x17F6AD8Ef982297579C203069C1DbfFE4348c372

// swap contract :  0x11bcD925D9c852a3eb40852A1C75E194e502D2b9
// swap contract owner : 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db


// user to buy token A :  0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB

// user to buy token B : 0x617F2E2fD72FD9D5503197092aC168c91465E7f2