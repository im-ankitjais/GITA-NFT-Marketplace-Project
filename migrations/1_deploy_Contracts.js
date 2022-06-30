const NFT = artifacts.require("NFT");
const Market = artifacts.require("Market");

module.exports = async function (deployer, network, accounts) {
  const _feeRcvr = "0x2d73C76cC478Eb5b8453E987635D2473589e17ce";

  await deployer.deploy(Market);
  const market = await Market.deployed();
  console.log("nftMarket-address", market.address);

  await deployer.deploy(NFT, market.address, _feeRcvr, 2, 1);
  const nft = await NFT.deployed();
  console.log("nftMarket-address", market.address);
  console.log("nft-address", nft.address);
};
