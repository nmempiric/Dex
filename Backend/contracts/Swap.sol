// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract CustomToken is ERC20 {
    
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        
        _mint(msg.sender, initialSupply * (10 ** uint256(decimals())));
    }
}

contract Swap {
    address private owner;
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 tokenPrice;
    }

    TokenInfo[] public createdTokens;
    mapping(string => uint256) tokenIndicesByName;
    mapping(address => mapping(address => uint256)) userTokenBalances;

    event TokenSwapped(
        address indexed sender,
        address indexed tokenAddress,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createCustomToken(string memory name, string memory symbol, uint256 initialSupply,uint256 tokenPriceInWei) public onlyOwner {
        CustomToken newToken = new CustomToken(name, symbol, initialSupply);
        TokenInfo memory tokenInfo = TokenInfo(address(newToken), name, symbol, initialSupply,tokenPriceInWei);

         // Transfer the tokens to the owner
        CustomToken(address(newToken)).transfer(msg.sender, initialSupply * (10 ** 18));

        createdTokens.push(tokenInfo);
        tokenIndicesByName[name] = createdTokens.length - 1;

    }

    function getCreatedTokensCount() public view returns (uint256) {
        return createdTokens.length;
    }


    function getTokenDetailsByName(string memory tokenName) public view returns (address tokenAddress, string memory name, string memory symbol, uint256 totalSupply,uint256 tokenPrice) {
         uint256 index = tokenIndicesByName[tokenName];
         console.log("token index======",index);
         require(index < createdTokens.length, "Token not found");
         require(keccak256(abi.encodePacked(createdTokens[index].name)) == keccak256(abi.encodePacked(tokenName)), "Token not found");
    
        TokenInfo memory tokenInfo = createdTokens[index];
        return (
            tokenInfo.tokenAddress,
            tokenInfo.name,
            tokenInfo.symbol,
            tokenInfo.totalSupply,
            tokenInfo.tokenPrice
        );
    }

    function getCreatedTokenDetails() public view returns (TokenInfo[] memory) {
        TokenInfo[] memory tokenDetails = new TokenInfo[](createdTokens.length);
        for (uint256 i = 0; i < createdTokens.length; i++) {
            TokenInfo memory tokenInfo = createdTokens[i];
            tokenDetails[i] = TokenInfo(
                tokenInfo.tokenAddress,
                tokenInfo.name,
                tokenInfo.symbol,
                tokenInfo.totalSupply,
                tokenInfo.tokenPrice
            );
        }
        return tokenDetails;
    }


    function swapEthToToken(string memory tokenName) public payable {
        uint256 index = tokenIndicesByName[tokenName];
        require(index < createdTokens.length, "Token index out of range");
        require(keccak256(abi.encodePacked(createdTokens[index].name)) == keccak256(abi.encodePacked(tokenName)), "Token not found");

        TokenInfo storage tokenInfo = createdTokens[index];
        require(msg.value > 0, "Must send Ether to perform the swap");
       
        address tokenAddress = tokenInfo.tokenAddress;
        CustomToken token = CustomToken(tokenAddress);

        uint256 tokenprice = tokenInfo.tokenPrice;

        console.log("tokenPrice=====",tokenprice);
        console.log("Ether Amount----------",msg.value);

        uint256 tokenAmount = (msg.value / tokenprice);

        console.log("Token Amount----------",tokenAmount);

        require(token.balanceOf(address(this)) >= tokenAmount, "Swap contract has insufficient token balance");
        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");

        userTokenBalances[msg.sender][tokenAddress] += tokenAmount;
        
        console.log("user token Balance-----",userTokenBalances[msg.sender][tokenAddress]);

        emit TokenSwapped(msg.sender, tokenAddress, msg.value, tokenAmount, block.timestamp);
    }


    function swapTokenToEth(string memory tokenName,uint256 tokenamout) public payable {


        uint256 index = tokenIndicesByName[tokenName];
        require(index < createdTokens.length , "Token index out of range");
        require(keccak256(abi.encodePacked(createdTokens[index].name)) == keccak256(abi.encodePacked(tokenName)), "Token not Found");

        TokenInfo storage tokenInfo = createdTokens[index];
        require(tokenamout > 0 ,"Token amount must be grater then 0");

        address tokenAddress = tokenInfo.tokenAddress;
        CustomToken token = CustomToken(tokenAddress);

        console.log("Token Amount-------",tokenamout);

        uint256 tokenprice = tokenInfo.tokenPrice;

        uint256 ethAmount = tokenamout * tokenprice;

        console.log("ether amount=====",ethAmount);
       
        require(address(this).balance  >= ethAmount , "Swap contract has incufficient ether balance");
        require(token.transfer(msg.sender , tokenamout), "Token transfer failed");

        userTokenBalances[msg.sender][tokenAddress] -= tokenamout;
        
        payable(msg.sender).transfer(ethAmount);

        console.log("user token Balance-----",userTokenBalances[msg.sender][tokenAddress]);
        emit TokenSwapped(msg.sender, tokenAddress, tokenamout, ethAmount, block.timestamp);

    }


    function getEthBalance() public view returns (uint256) {
        return address(this).balance;
    }


    function getTokenBalance(string memory tokenName, address user_address) public view returns (uint256) {
        uint256 index = tokenIndicesByName[tokenName];
        require(index < createdTokens.length, "Token index out of range");
        require(keccak256(abi.encodePacked(createdTokens[index].name)) == keccak256(abi.encodePacked(tokenName)), "Token not found");
        TokenInfo memory tokenInfo = createdTokens[index];
       return userTokenBalances[user_address][tokenInfo.tokenAddress];
    }


}
