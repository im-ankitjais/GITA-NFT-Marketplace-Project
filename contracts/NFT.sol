// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract Market {
    function updateOwner(address nftContract, uint256 tokenId) public {}
}
contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    address contractOwner;
    address feeRecipient;
    uint contractfee;
    uint cretorRoyalty;

    mapping(uint256 => address) private _tokenCreator;

    constructor(
        address marketplaceAddress,
        address _feeRecipient,
        uint fee,
        uint royalty
    ) ERC721("GitaMarketPlace", "GMP")
    {
        contractAddress = marketplaceAddress;
        contractOwner = msg.sender;
        feeRecipient = _feeRecipient;
        contractfee = fee;
        cretorRoyalty = royalty;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        _tokenCreator[newItemId] = msg.sender;
        return newItemId;
    }
    struct TokenData {
        uint tokenid;
        address owner;
        string tokenUrl;
    }
    function getNftByUrl(string memory url) public view returns(TokenData memory) {
        for(uint i=1; i<=_tokenIds.current(); i++){
            string memory URI = tokenURI(i);
            if(keccak256(bytes(URI)) == keccak256(bytes(url))){
                address creator = _tokenCreator[i];
                TokenData memory data = TokenData(
                    i,
                    creator,
                    URI
                );
                return data;
            }
        }
        return TokenData(0, address(0), "");
    }
    function getOwnedNftsByAddress(address walletid) public view returns(uint[] memory) {
        uint totalTokenCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        for(uint i=1; i<=totalTokenCount; i++){
            if(ERC721.ownerOf(i) == walletid){
                itemCount += 1;
            }
        }
        uint[] memory items = new uint[](itemCount);
        for(uint i=1; i<=totalTokenCount; i++){
            if(ERC721.ownerOf(i) == walletid){
                items[currentIndex] = i;
                currentIndex += 1;
            }
        }
        return items;
    }
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _transfer(from, to, tokenId);
        Market(contractAddress).updateOwner(address(this), tokenId);
    }
    function approve_contract() public {
        setApprovalForAll(contractAddress, true);
    }
    function getContractFee() public view virtual returns (uint256) {
        return contractfee;
    }
    function getContractFeeRecipient() public view virtual returns (address) {
        return feeRecipient;
    }
    function getRoyaltyFee() public view virtual returns (uint256) {
        return cretorRoyalty;
    }
    function getTokenCreator(uint tokenID) public view virtual returns (address) {
        return _tokenCreator[tokenID];
    }
    function setRoyaltyFee(uint256 fee)
        public
        virtual
       returns (bool)
    {
        require(
            msg.sender == contractOwner || msg.sender == feeRecipient,
            "Only Contract-Owner or Fee-Recipient can be change fee."
        );
        cretorRoyalty = fee;
        return true;
    }
    function setContractFee(uint256 fee)
        public
        virtual
       returns (bool)
    {
        require(
            msg.sender == contractOwner || msg.sender == feeRecipient,
            "Only Contract-Owner or Fee-Recipient can be change fee."
        );
        contractfee = fee;
        return true;
    }
    function setContractFeeRecipient(address recipient)
        public
        virtual
        returns (bool)
    {
        require(
            msg.sender == contractOwner || msg.sender == feeRecipient,
            "Only Contract-Owner or Fee-Recipient can be change fee."
        );
        feeRecipient = recipient;
        return true;
    }
}