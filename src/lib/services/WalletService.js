import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Web3 from "web3/dist/web3.min.js";
export default class WalletService {
  async connectWallet() {
    try {
      console.log("clicked");
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
      } else if (window.web3) {
        await window.ethereum.enable();
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        throw `Metamask Wallet Not Detected! Please Add Metamask Wallet from here "https://metamask.io/"`;
      }
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: process.env.REACT_APP_CHAIN_ID,
            chainName: process.env.REACT_APP_CHAIN_NAME,
            nativeCurrency: {
              name: process.env.REACT_APP_CHAIN_NAME,
              symbol: "MATIC",
              decimals: 18,
            },
            rpcUrls: [process.env.REACT_APP_POLYGON_RPC_URL],
            blockExplorerUrls: [`${process.env.REACT_APP_POLYGON_SCAN_LINK}/`],
          },
        ],
      });
      let providerOptions = {};
      const web3Modal = new Web3Modal({
        network: "testnet",
        cacheProvider: true,
        providerOptions,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log(address);
      localStorage.setItem("wallet", address);
      return true;
    } catch (error) {
      console.log(error);
      let msg =
        "Please open metamask and close all pending request. Or refresh the app and try again.";
      if (error && typeof error === "string") {
        msg = error;
      }
      return Promise.reject(msg || "Something went wrong!");
    }
  }
}
