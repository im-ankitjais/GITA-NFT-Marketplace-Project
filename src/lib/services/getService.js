import { ethers } from "ethers";
import Web3Modal from "web3modal";
import NFT from "../abi/NFT.json";
import Market from "../abi/Market.json";
import axios from "axios";

export default class GetService {
  async getAllNfts() {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_POLYGON_RPC_URL
      );
      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        provider
      );
      const data = await marketContract.fetchAllItems();
      const nfts = await Promise.all(
        data?.map(async (i) => {
          return this.parseNftData(i);
        })
      );
      console.log("Market Items", nfts);
      return nfts;
    } catch (error) {
      return this.returnError(error);
    }
  }
  async getNftsOnSale() {}
  async getNftsOnAuction() {}
  async getNftsOnOffer() {}
  async getNftsByTokenId() {}
  async getNftsByItemId() {}

  async getNftsOwned() {}
  async getNftsSelling() {}

  async getContractFee() {}
  async getTokenCreator() {}
  async getRoyaltyFee() {}
  async getContractFeeRecipient() {}

  async parseNftData(item) {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.REACT_APP_POLYGON_RPC_URL
    );
    const nftContract = new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS,
      NFT.abi,
      provider
    );
    const tokenUri = await nftContract.tokenURI(item.tokenId);
    const meta = await axios.get(tokenUri);
    let price = ethers.utils.formatUnits(item.price.toString(), "ether");
    let mBid = ethers.utils.formatUnits(item.minBid.toString(), "ether");
    let hBid = ethers.utils.formatUnits(
      item.highestBidAmount.toString(),
      "ether"
    );
    let NFTData = {
      itemId: item.itemId.toNumber(),
      tokenId: item.tokenId.toNumber(),
      listedBy: item.listedBy,
      previousOwner: item.previousOwner,
      currentOwner: item.currentOwner,
      numberOfTransfers: item.numberOfTransfers.toNumber(),
      on_sell: item.on_sell,
      on_auction: item.on_auction,
      endDate: item.endDate.toNumber(),
      highestBidAddress: item.highestBidAddress,
      toMarket: item.toMarket,
      mBid: mBid,
      hBid: hBid,
      price,
      tokenUri,
      name: meta.data.name,
      description: meta.data.description,
      image: meta.data.image,
    };
    return NFTData;
  }

  returnError(error) {
    return Promise.reject(error);
  }
}
