import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { create as ipfsHttpClient } from "ipfs-http-client";
import NFT from "../abi/NFT.json";
import Market from "../abi/Market.json";
import axios from "axios";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default class NFTService {
  async getGasPrice() {
    try {
      let gas_price_URL =
        process.env.REACT_APP_CHAIN_ID == "0x89"
          ? "https://gasstation-mainnet.matic.network/v2"
          : "https://gasstation-mumbai.matic.today/v2";
      let gas_res = await axios.get(gas_price_URL);
      const gasInBigNum = ethers.utils.parseUnits(
        parseFloat(gas_res.data.fast.maxPriorityFee).toFixed(2).toString(),
        "gwei"
      );
      let gas_price = ethers.utils.formatUnits(gasInBigNum, "wei");
      // DUE TO: https://community.infura.io/t/polygon-mumbai-testnet-error-transaction-underpriced/4781
      gas_price = gas_price < 30000000000 ? 30000000000 : gas_price;
      return gas_price;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async uploadImage(file) {
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      console.log("path", added.path);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log("image url", url);
      return url;
    } catch (error) {
      console.log("Error uploading image: ", error);
      return Promise.reject(error);
    }
  }
  async uploadMeta(nftName, description, fileUrl) {
    try {
      if (!nftName || !description || !fileUrl) throw "Error.";
      /* first, upload to IPFS */
      const data = JSON.stringify({
        name: nftName,
        description,
        image: fileUrl,
      });
      const added = await client.add(data);
      console.log("meta path", added.path);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      console.log("meta url", url);
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
      return Promise.reject(error);
    }
  }
  async createToken(url) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      let nftContract = new ethers.Contract(
        process.env.REACT_APP_NFT_ADDRESS,
        NFT.abi,
        signer
      );
      let gas_price = await this.getGasPrice();
      console.log(gas_price);
      let estimate_gas = await nftContract.estimateGas.createToken(url);
      console.log(estimate_gas);

      let transaction = await nftContract.createToken(url, {
        gasLimit: estimate_gas,
        gasPrice: gas_price,
      });
      let tx1 = await transaction.wait();
      let event = tx1.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();
      return { txHash: tx1.transactionHash, tokenId };
    } catch (error) {}
  }
  async sellNft(tokenId, nftPrice, oldItem = false) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const price = ethers.utils.parseUnits(nftPrice, "ether");
      let marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        signer
      );
      if (oldItem === true) {
        await this.approveContract();
      }
      let gas_price = await this.getGasPrice();
      let estimate_gas = await marketContract.estimateGas.createMarketItem(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        price
      );
      console.log(estimate_gas.toNumber());
      let transaction = await marketContract.createMarketItem(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        price,
        {
          gasLimit: estimate_gas,
          gasPrice: gas_price,
        }
      );
      let tx = await transaction.wait();
      console.log("TX", tx);
      let itemIdValue = tx.events[2].args["itemId"];
      let itemId = itemIdValue.toNumber();
      return { txHash: tx.transactionHash, itemId };
    } catch (error) {
      return Promise.reject(error.data.message);
    }
  }
  async cancelSell(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
  async buyNft(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
  async auctionNft(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
  async bidNft(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
  async settleAuction(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
  async offerNft(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
  async deleteOffer(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
  async deleteAllOffers(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
  async acceptOffer(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
  async giveawayNFT(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }

  async approveContract() {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let nftContract = new ethers.Contract(
        process.env.REACT_APP_NFT_ADDRESS,
        NFT.abi,
        signer
      );
      let gas_price = await this.getGasPrice();
      let estimate_gas = await nftContract.estimateGas.approve_contract();
      let aptx = await nftContract.approve_contract({
        gasLimit: estimate_gas,
        gasPrice: gas_price,
      });
      await aptx.wait();
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
