import { useEffect, useState } from 'react';
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import logo from './logo.svg';
import path from 'path';
import fs from 'fs';
import './App.css';


//*env vars
const MNEMONIC = process.env.MNEMONIC
const API_KEY = process.env.NODE_KEY


//* Remember to write the nft address in manually after deploying the contract
const NFT_CONTRACT_ADDRESS = ""
const OWNER_ADDRESS = "0x4976EC7c03A42391E1a6b0fb416361B91A257874";
const MATIC_TEST = `https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`
const MATIC = `https://rpc-mainnet.maticvigil.com/v1/${API_KEY}`
const NUM_ITEMS = 5;

let rawdata = fs.readFileSync(path.resolve(__dirname, "../build/contracts/GameItem.json"));
let contractAbi = JSON.parse(rawdata);
const NFT_ABI = contractAbi.abi

const callMintEndpoint = async() => {
  const provider = new HDWalletProvider(MNEMONIC, MATIC_TEST);
  // const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const web3 = new Web3(provider);
  const nftContract = web3.eth.Contract(
    NFT_ABI,
    NFT_CONTRACT_ADDRESS
  )

  await nftContract.methods
    .minItem(OWNER_ADDRESS, 'your token json uri')
    .send({ from: OWNER_ADDRESS })
    .then(console.log('minted'))
    .catch(error => console.log(error))
}

function App() {
  const [account, setAccount] = useState(); // state variable to set account.
  
  useEffect(() => {
    async function load() {
      const provider = new HDWalletProvider(MNEMONIC, MATIC_TEST);
      // const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const web3 = new Web3(provider);
      const accounts = await web3.eth.requestAccounts();
      
      setAccount(accounts[0]);
    }
    
    load();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Omniscient Owls
        </a>
      </header>
    </div>
  );
}

export default App;
