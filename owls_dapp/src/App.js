import { useEffect, useState } from 'react';

// assets and styling
import owl from './OmniscientOwls-40.png';
import './App.css';

// configs
import config from './config.json';
import abi from './abi.json';

// web3
import Web3 from "web3";
import Web3Modal from "web3modal";

// components
import {Button} from '@mui/material';

// helpers
import * as NFTUtils from './helpers';


function App() {
  const [walletIsConnected, setWalletConnected] = useState(false);
  const [blockchainConn, setBlockchainConn] = useState(null);
  const [message, setMessage] = useState("");
  const [currentAccount, setAccount] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(null);
  const [error, setError] = useState(null);
  const [maxSupply, setMaxSupply] = useState(null);

  useEffect(() => {
    checkWalletIsConnected();
    async function getSupplyData() {
      const max = await NFTUtils.getMaxSupply();
      const currentSupply = await NFTUtils.getTotalSupply();
      setCurrentSupply(currentSupply);
      setMaxSupply(max);
    }
    getSupplyData();

    NFTUtils.getTotalSupply().then(
      data => console.log(data)
    ).catch(err => console.log(err))
  }, [])

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
      console.log(accounts)
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
    setBlockchainConn(web3);
  };

  const mintNFTHandler = async() => {
    setLoading(true);
    await NFTUtils.mintNFT()
        .then((receipt) => {
          console.log(receipt)
          setMessage(
            `HOLY shit, you just minted a ${config.NFT_NAME}! Go visit Opensea.io to view it!!`
          )
        })
        .catch((err) => setError(err))
        setLoading(false);
    // Web3EthContract.setProvider(Web3.givenProvider);
    // const contract = new Web3EthContract(abi, config.CONTRACT_ADDRESS)
    // contract.methods
    //     .mint(1)
    //     .send({
    //       gasLimit: String(config.TOTAL_GAS_LIMIT),
    //       to: config.CONTRACT_ADDRESS,
    //       from: currentAccount,
    //       value: config.WEI_COST,
    //     })
    //     .once("error", (err) => {
    //       console.log(err);
    //       setError("Sorry, something went wrong! Contact Naz and ask for your monies back")
    //     })
    //     .then((receipt) => {
    //       console.log(receipt)
    //       setMessage(
    //         `HOLY shit, you just minted a ${config.NFT_NAME}! Go visit Opensea.io to view it!!`
    //       )
    //     })
    //     setLoading(false);
    // }
  }

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
  console.log(blockchainConn);
  console.log(currentAccount);
  return (
    <div className="App">
      <header className="App-header">
        <img src={owl} className="App-logo" alt="logo" />
        <p>
          {message}
        </p>
        <p>
          {walletIsConnected ? "Click button below to mint your first owl!" : "Please connect your metamask wallet first!"}
        </p>
        <p>{`Already minted: ${currentSupply}/ ${maxSupply}`}</p>
        {walletIsConnected ? renderMintNFTButton() : renderConnectWalletButton()}
      </header>
    </div>
  );
}

export default App;
