import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { create as ipfsHttpClient } from "ipfs-http-client";
import NFT from "../abi/NFT.json";
import Market from "../abi/Market.json";
import axios from "axios";
import Web3 from "web3/dist/web3.min.js";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default class PostService {
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
      return 30000000000;
      // return Promise.reject(error);
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
  async buyNft(itemId, priceValue) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        signer
      );
      let price = ethers.utils.parseUnits(priceValue.toString(), "ether");
      let gas_price = await this.getGasPrice();
      let estimate_gas = await marketContract.estimateGas.createMarketSale(
        process.env.REACT_APP_NFT_ADDRESS,
        itemId,
        { value: price }
      );
      const transaction = await marketContract.createMarketSale(
        process.env.REACT_APP_NFT_ADDRESS,
        itemId,
        {
          value: price,
          gasLimit: estimate_gas,
          gasPrice: gas_price,
        }
      );
      let tx = await transaction.wait();
      return { success: true, txhash: tx.transactionHash };
    } catch (error) {
      return Promise.reject(error.data.message);
    }
  }
  async auctionNft(tokenId, minBid, expDays, oldItem = false) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        signer
      );
      const _minBid = ethers.utils.parseUnits(minBid, "ether");
      if (oldItem === true) {
        await this.approveContract();
      }
      let gas_price = await this.getGasPrice();
      let estimate_gas = await marketContract.estimateGas.createAuction(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        _minBid,
        expDays
      );
      console.log(estimate_gas.toNumber());
      let transaction = await marketContract.createAuction(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        _minBid,
        expDays,
        {
          gasLimit: estimate_gas,
          gasPrice: gas_price,
        }
      );
      let tx = await transaction.wait();
      // let itemIdValue = tx.events[2].args["itemId"];
      // let expValue = tx.events[2].args["endDate"];
      // let itemId = itemIdValue.toNumber();
      // let endDate = expValue.toNumber();
      return { txHash: tx.transactionHash };
    } catch (error) {
      console.log(error);
      return Promise.reject(error.data.message);
    }
  }
  async bidNft(itemId, bidValue) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        signer
      );
      const _bidValue = ethers.utils.parseUnits(bidValue, "ether");
      let gas_price = await this.getGasPrice();
      let estimate_gas = await contract.estimateGas.createBid(itemId, {
        value: _bidValue,
      });
      let transaction = await contract.createBid(itemId, {
        value: _bidValue,
        gasLimit: estimate_gas,
        gasPrice: gas_price,
      });
      let tx = await transaction.wait();
      return { txHash: tx.transactionHash };
    } catch (error) {
      return Promise.reject(error.data.message);
    }
  }
  async settleAuction(tokenId, minBid, expDays) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
  async offerNft(tokenId, priceValue) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        signer
      );
      let price = ethers.utils.parseUnits(priceValue.toString(), "ether");
      let gas_price = await this.getGasPrice();
      let estimate_gas = await marketContract.estimateGas.createoffer(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        { value: price }
      );
      const transaction = await marketContract.createoffer(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        {
          value: price,
          gasLimit: estimate_gas,
          gasPrice: gas_price,
        }
      );

      let tx = await transaction.wait();
      return tx.transactionHash;
    } catch (error) {
      return Promise.reject(error.data.message);
    }
  }
  async deleteOffer(tokenId, index) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        signer
      );
      let gas_price = await this.getGasPrice();
      let estimate_gas = await marketContract.estimateGas.declineOffer(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        index
      );
      console.log(estimate_gas.toNumber());
      let transaction = await marketContract.declineOffer(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        index,
        {
          gasLimit: estimate_gas,
          gasPrice: gas_price,
        }
      );
      let tx = await transaction.wait();
      return { txHash: tx.transactionHash };
    } catch (error) {}
  }
  async deleteAllOffers(tokenId) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        signer
      );
      let gas_price = await this.getGasPrice();
      let estimate_gas = await marketContract.estimateGas.declineAllOffers(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId
      );
      let transaction = await marketContract.declineAllOffers(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        {
          gasLimit: estimate_gas,
          gasPrice: gas_price,
        }
      );
      let tx = await transaction.wait();
      return { txHash: tx.transactionHash };
    } catch (error) {
      return Promise.reject(error.data.message);
    }
  }
  async acceptOffer(tokenId, index) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        signer
      );
      await this.approveContract();
      let gas_price = await this.getGasPrice();
      let estimate_gas = await marketContract.estimateGas.acceptOffer(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        index
      );
      console.log(estimate_gas.toNumber());
      let transaction = await marketContract.acceptOffer(
        process.env.REACT_APP_NFT_ADDRESS,
        tokenId,
        index,
        {
          gasLimit: estimate_gas,
          gasPrice: gas_price,
        }
      );
      let tx = await transaction.wait();
      return { txHash: tx.transactionHash };
    } catch (error) {}
  }
  async giveawayNFT(from, to, tokenId) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      var web3 = new Web3(provider);
      const nftContract = new ethers.Contract(
        process.env.REACT_APP_NFT_ADDRESS,
        NFT.abi,
        signer
      );
      if (!web3.utils.isAddress(from)) throw "Not valid address.";
      if (!web3.utils.isAddress(to)) throw "Not valid address.";
      let gas_price = await this.getGasPrice();
      let estimate_gas = await nftContract.estimateGas.transferFrom(
        from,
        to,
        tokenId
      );
      console.log(estimate_gas.toNumber());
      let transaction = await nftContract.transferFrom(from, to, tokenId, {
        gasLimit: estimate_gas,
        gasPrice: gas_price,
      });
      let tx = await transaction.wait();
      return tx.transactionHash;
    } catch (error) {
      return Promise.reject(error);
    }
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
