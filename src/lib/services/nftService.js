import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Web3 from "web3.min.js";
import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default class NFTService {
  async uploadImage(file) {
    try {
      await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
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
        nftName,
        description,
        image: fileUrl,
      });
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
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

      // let contract = new ethers.Contract(
      //   marketplaceAddress,
      //   NFTMarketplace.abi,
      //   signer
      // );
      // let transaction = await contract.createToken(url, price);
      // await transaction.wait();
    } catch (error) {}
  }
  async sellNft(tokenId, nftPrice) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
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

  async approveContract(setLoadingShow, setTexts, setCloseAble) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
    } catch (error) {}
  }
}
