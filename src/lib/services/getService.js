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
  async getNftsByTokenId(tokenId) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_POLYGON_RPC_URL
      );
      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        provider
      );
      const data = await marketContract.fetchItemByTokenId(tokenId);
      const nft = await this.parseNftData(data[0]);
      return nft;
    } catch (error) {
      return this.returnError(error);
    }
  }
  async getNftsByItemId() {}
  async getOffersOnNft(tokenId) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_POLYGON_RPC_URL
      );
      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        provider
      );

      const offersData = await marketContract.getOffers(tokenId);
      const offers = await Promise.all(
        offersData?.map(async (i, index) => {
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let offer = {
            offerId: index,
            from: i.from,
            tokenId: i.tokenid.toNumber(),
            price: price,
          };
          return offer;
        })
      );
      let filteredOffers = offers.filter((offer) => {
        return offer.tokenId !== 0;
      });
      return filteredOffers;
    } catch (error) {
      return this.returnError(error);
    }
  }
  async getLatestNfts(num) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_POLYGON_RPC_URL
      );
      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        provider
      );
      const data = await marketContract.fetchLatestNfts(num);
      console.log(data);
      const nfts = await Promise.all(
        data?.map(async (i) => {
          return this.parseNftData(i);
        })
      );
      console.log(nfts);
      return nfts;
    } catch (error) {
      return this.returnError(error);
    }
  }
  async getNftsOwned(wallet_address) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_POLYGON_RPC_URL
      );
      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        provider
      );
      const data = await marketContract.fetchItemsOwnByAddress(
        process.env.REACT_APP_NFT_ADDRESS,
        wallet_address
      );
      const nfts = await Promise.all(
        data?.map(async (i) => {
          return this.parseNftData(i);
        })
      );
      return nfts;
    } catch (error) {
      return this.returnError(error);
    }
  }
  async getNftsSelling(wallet_address) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_POLYGON_RPC_URL
      );
      const marketContract = new ethers.Contract(
        process.env.REACT_APP_MARKET_ADDRESS,
        Market.abi,
        provider
      );
      const data = await marketContract.fetchItemsOnSaleByAddress(
        wallet_address
      );
      const nfts = await Promise.all(
        data?.map(async (i) => {
          return this.parseNftData(i);
        })
      );
      return nfts;
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getContractFee() {}
  async getTokenCreator() {}
  async getRoyaltyFee() {}
  async getContractFeeRecipient() {}

  async parseNftData(item) {
    console.log(item);
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
    console.log(NFTData);
    return NFTData;
  }

  returnError(error) {
    return Promise.reject(error);
  }
}
