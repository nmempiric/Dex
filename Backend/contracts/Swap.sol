// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract CustomToken is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
}

contract Swap {
    uint256 private ethToTokenConversionRate = 1000000000000000000; // (1 ETH) in wei  
    address private owner;

    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint256 totalSupply;
    }

    TokenInfo[] public createdTokens;
    mapping(string => uint256) tokenIndicesByName;

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

    function createCustomToken(string memory name, string memory symbol, uint256 initialSupply) public onlyOwner {
        CustomToken newToken = new CustomToken(name, symbol, initialSupply);
        TokenInfo memory tokenInfo = TokenInfo(address(newToken), name, symbol, initialSupply);
        createdTokens.push(tokenInfo);
        tokenIndicesByName[name] = createdTokens.length - 1;

    }

    function getCreatedTokensCount() public view returns (uint256) {
        return createdTokens.length;
    }


    function getTokenDetailsByName(string memory tokenName) public view returns (address tokenAddress, string memory name, string memory symbol, uint256 totalSupply) {
         uint256 index = tokenIndicesByName[tokenName];
         console.log("token index======",index);
         require(index < createdTokens.length, "Token not found");
         require(keccak256(abi.encodePacked(createdTokens[index].name)) == keccak256(abi.encodePacked(tokenName)), "Token not found");
    
        TokenInfo memory tokenInfo = createdTokens[index];
        return (
            tokenInfo.tokenAddress,
            tokenInfo.name,
            tokenInfo.symbol,
            tokenInfo.totalSupply
        );
    }


    function swapEthToToken(string memory tokenName) public payable {
        uint256 index = tokenIndicesByName[tokenName];
        require(index < createdTokens.length, "Token index out of range");
        require(keccak256(abi.encodePacked(createdTokens[index].name)) == keccak256(abi.encodePacked(tokenName)), "Token not found");

        TokenInfo storage tokenInfo = createdTokens[index];
        require(msg.value > 0, "Must send Ether to perform the swap");
        // require(ethAmount > 0, "Eth amount must be greater than 0");

        address tokenAddress = tokenInfo.tokenAddress;
        CustomToken token = CustomToken(tokenAddress);

        console.log("ethToTokenConversionRate=====",ethToTokenConversionRate);
        console.log("Ether Amount----------",msg.value);
        uint256 tokenAmount = (msg.value / ethToTokenConversionRate);

        console.log("Token Amount----------",tokenAmount);

        require(token.balanceOf(address(this)) >= tokenAmount, "Swap contract has insufficient token balance");
        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");

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

        // uint256 exactAmount = tokenamout / 10 ** 18;  // converting value into wei.
        uint256 ethAmount = tokenamout * ethToTokenConversionRate;

        console.log("Token Amount-------",tokenamout);

        // uint256 ethAmount = tokenamout * ethToTokenConversionRate ;

        console.log("ether amount=====",ethAmount);
        console.log("token Balanceeeee--------",address(this).balance);


        require(address(this).balance  >= ethAmount , "Swap contract has incufficient ether balance");
        require(token.transfer(msg.sender , tokenamout), "Token transfer failed");
        
        payable(msg.sender).transfer(ethAmount);
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
        CustomToken token = CustomToken(tokenInfo.tokenAddress);
        return token.balanceOf(user_address);
    }

}
