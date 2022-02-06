import { useEffect, useState } from 'react';

// assets and styling
import owl from './OmniscientOwls-40.png';
import './App.css';

// configs
import config from './config.json';

// web3
import Web3 from "web3";
import Web3Modal from "web3modal";

// components
import {Button} from '@mui/material';

const contractAddress = config.CONTRACT_ADDRESS;

function App() {
  const [walletIsConnected, setWalletConnected] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const checkWalletIsConnected = () => {};
  const connectWalletHandler = async() => {
    setLoading(true);
    const providerOptions = {
      /* See Provider Options Section */
    };

    const web3Modal = new Web3Modal({
      network: "rinkeby", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    const provider = await web3Modal.connect();
    provider.on("accountsChanged", (accounts) => {
      console.log(accounts);
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      console.log(chainId);
    });

    // Subscribe to provider connection
    provider.on("connect", (info) => {
      console.log(info);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error) => {
      console.log(error);
    });
    setWalletConnected(true);
    setLoading(false);
    const web3 = new Web3(provider);
    console.log(web3);
  };

  const mintNFTHandler = () => {};
  const renderConnectWalletButton = () => {
    return (
      <Button loading={isLoading} variant="contained" onClick={connectWalletHandler}>
        Connect Wallet
      </Button>
    )
  }

  const renderMintNFTButton = () => {
    return (
      <Button variant="contained" onClick={mintNFTHandler}>Mint an Owl!</Button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={owl} className="App-logo" alt="logo" />
        <p>
          {walletIsConnected ? "Click button below to mint your first owl!" : "Please connect your metamask wallet first!"}
        </p>
        {walletIsConnected ? renderMintNFTButton() : renderConnectWalletButton()}
      </header>
    </div>
  );
}

export default App;
