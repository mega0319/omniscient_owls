import Web3 from 'web3';

import abi from './abi.json';
import config from './config.json';

const rpcURL= Web3.givenProvider || "ws://localhost:3000";
const web3 = new Web3(rpcURL);
const contractAddress = config.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(abi, contractAddress);

export const getBalance = async (address) => {
    let balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
}

export const getTotalSupply = async () => {
    return await contract.methods.totalSupply().call();
}

export const getMaxSupply = async () => {
    return await contract.methods.maxSupply().call();
}

export const mintNFT = async () => {
    const { ethereum } = window;
    const transactionParams = {
        to: contractAddress,
        from: ethereum.selectedAddress,
        value: web3.utils.toHex(web3.utils.toWei('0.05', 'ether')),
        gasLimit: web3.utils.toHex(300000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('350', 'gwei')),
        data: contract.methods.mint(1).encodeABI()
    };
    return await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParams]
    })
}

export const getToken = async (address) => {
    return await contract.methods.walletOfOwner(address).call();
}

export const getTokenUri = async (tokenId) => {
    return await contract.methods.tokenURI(tokenId).call();
}