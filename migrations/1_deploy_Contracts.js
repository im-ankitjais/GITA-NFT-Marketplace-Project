const NFT = artifacts.require("NFT");
const Market = artifacts.require("Market");

module.exports = async function (deployer, network, accounts) {
  const _feeRcvr = "0x2BB06f26d1F0b20950AA93E69e15cE61d8F085AF";

  await deployer.deploy(Market);
  const market = await Market.deployed();
  console.log("nftMarket-address", market.address);

  await deployer.deploy(NFT, market.address, _feeRcvr, 2, 1);
  const nft = await NFT.deployed();
  console.log("nftMarket-address", market.address);
  console.log("nft-address", nft.address);
};
