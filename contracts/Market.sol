// SPDX-License-Identifier: MIT OR Apache-2.0
  pragma solidity ^0.8.3;

  import "@openzeppelin/contracts/utils/Counters.sol";
  import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
  import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
  contract MCNFT {
      function getContractFee() public view virtual returns (uint256) {}
      function getContractFeeRecipient() public view virtual returns (address) {}
      function getRoyaltyFee() public view virtual returns (uint256) {}
      function getTokenCreator(uint tokenID) public view virtual returns (address) {}
      function approve_contract() public {}
      function isApprovedForAll(address owner, address operator) public view virtual returns (bool) {}
  }

  contract Market is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        uint256 tokenId;
        address nftContract;
        address payable listedBy;
        address payable previousOwner;
        address payable currentOwner;
        uint256 numberOfTransfers;
        bool on_sell;
        uint256 price;
        bool on_auction;
        uint minBid;
        uint endDate;
        address highestBidAddress;
        uint highestBidAmount;
        bool toMarket;
    }
    struct Items{
      uint256 itemId;
      uint256 tokenId;
      address payable currentOwner;
      uint256 numberOfTransfers;
      bool toMarket;
      bool on_sell;
      bool on_auction;
    }
    struct Offer {
      address from;
      uint256 tokenid;
      uint256 price;
    }
    struct TokenIdExist {
        uint itemId;
        bool exist;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => TokenIdExist) private tokenIdToItemId;
    mapping(uint256 => Offer[]) private offers;

    event OfferCreated (
        address from,
        uint256 tokenid,
        uint256 price
    );
    event MarketCreated (
        uint indexed itemId,
        uint256 indexed tokenId,
        address indexed nftContract,
        address listedBy,
        address previousOwner,
        address currentOwner,
        uint256 numberOfTransfers,
        bool on_sell,
        uint256 price,
        bool on_auction,
        uint minBid,
        uint endDate,
        address highestBidAddress,
        uint highestBidAmount,
        bool toMarket
    );
    function updateOwner(address nftContract, uint256 tokenId) public {
    if(tokenIdToItemId[tokenId].exist == true){
      uint itemid = tokenIdToItemId[tokenId].itemId;
      if(idToMarketItem[itemid].toMarket == false){
        if(idToMarketItem[itemid].currentOwner != IERC721(nftContract).ownerOf(tokenId)){
          for(uint i=0; i<offers[tokenId].length; i++){
            if(offers[tokenId][i].from != address(0)){
              payable(offers[tokenId][i].from).transfer(offers[tokenId][i].price);
            }
          }
          delete offers[tokenId];
          idToMarketItem[itemid].currentOwner = payable(IERC721(nftContract).ownerOf(tokenId));
        }
      }
    }
  }
    function returnOffers(uint256 tokenId) private{
        for(uint i=0; i<offers[tokenId].length; i++){
            if(offers[tokenId][i].from != address(0)){
                payable(offers[tokenId][i].from).transfer(offers[tokenId][i].price);
            }
        }
        delete offers[tokenId];
    }
  function createoffer(address nftaddress, uint tokenid) public payable {
    require(IERC721(nftaddress).ownerOf(tokenid) != address(0), "Not Found");
    if(tokenIdToItemId[tokenid].exist == true){
      uint itemid = tokenIdToItemId[tokenid].itemId;
      require(idToMarketItem[itemid].toMarket == false, "Already on sale");
    }
    require(msg.value > 0 , "Offer Too Low");
    offers[tokenid].push(Offer(
      payable(msg.sender), 
      tokenid,
      msg.value
    ));
    emit OfferCreated(
      msg.sender, 
      tokenid,
      msg.value
    );
  }

  function getOffers(uint tokenid) public view returns(Offer[] memory){
    return  offers[tokenid];
  }

  function declineOffer(address nftaddress, uint tokenid, uint index) public {
    Offer memory offer = offers[tokenid][index];
    require(IERC721(nftaddress).ownerOf(tokenid) == msg.sender || offer.from == msg.sender , "Not Authorized");
    payable(offer.from).transfer(offer.price);
    delete offers[tokenid][index];
  }

  function declineAllOffers(address nftaddress, uint tokenid) public payable {
    require(IERC721(nftaddress).ownerOf(tokenid) == msg.sender, "Not Authorized");
    returnOffers(tokenid);
  }

  function acceptOffer(address nftaddress, uint tokenid, uint index) public payable {
    Offer memory offer = offers[tokenid][index];
    require(IERC721(nftaddress).ownerOf(tokenid) == msg.sender, "Not Authorized");
    require(MCNFT(nftaddress).isApprovedForAll(msg.sender, address(this)) == true, "Contract not Approved");
    require(offer.from != address(0) && offer.price > 0, "Offer Not valid");
    address offerSender = offer.from;
    uint256 price = offer.price;
    address _contractFeeRecipient = MCNFT(nftaddress).getContractFeeRecipient();
    uint _contractFee = MCNFT(nftaddress).getContractFee();
    address _tokenCreator = MCNFT(nftaddress).getTokenCreator(tokenid);
    address cOwner = IERC721(nftaddress).ownerOf(tokenid);
    uint _royaltyFee = MCNFT(nftaddress).getRoyaltyFee();
    uint fee = (_contractFee * price) / 100 ;
    if (cOwner == _tokenCreator) {
      uint sellerValue = price - fee;
      payable(cOwner).transfer(sellerValue);
      payable(_contractFeeRecipient).transfer(fee);
    } else {
      uint creatorRoyaltyFee = (_royaltyFee * price) / 100;
      uint sellerValue = price - ( fee + creatorRoyaltyFee );
      payable(cOwner).transfer(sellerValue);
      payable(_tokenCreator).transfer(creatorRoyaltyFee);
      payable(_contractFeeRecipient).transfer(fee);
    }
    if(tokenIdToItemId[tokenid].exist == true){
      uint itemId = tokenIdToItemId[tokenid].itemId;
      idToMarketItem[itemId].previousOwner = idToMarketItem[itemId].currentOwner;
      idToMarketItem[itemId].currentOwner = payable(offerSender);
      idToMarketItem[itemId].price = price;
      idToMarketItem[itemId].toMarket = false;
      idToMarketItem[itemId].numberOfTransfers += 1;
    }
    delete offers[tokenid][index];
    IERC721(nftaddress).transferFrom(cOwner, offerSender, tokenid);
    returnOffers(tokenid);
  }

  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(msg.sender != address(0));
    require(price > 0, "Price Too low");
    require(msg.sender == IERC721(nftContract).ownerOf(tokenId), " Not Authorized.");
    require(MCNFT(nftContract).isApprovedForAll(msg.sender, address(this)) == true, "Contract not Approved");
    uint256 itemId = 0;
    if(tokenIdToItemId[tokenId].exist){
      itemId = tokenIdToItemId[tokenId].itemId;
      require(idToMarketItem[itemId].toMarket == false && idToMarketItem[itemId].on_auction == false, "On sale/auction");
      idToMarketItem[itemId].price = price;
      idToMarketItem[itemId].currentOwner = payable(msg.sender);
      idToMarketItem[itemId].toMarket = true;
      idToMarketItem[itemId].on_sell = true;
      returnOffers(tokenId);
      IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    }else{
      _itemIds.increment();
      itemId = _itemIds.current();
      idToMarketItem[itemId] =  MarketItem(
        itemId,
        tokenId,
        nftContract,
        payable(msg.sender),
        payable(address(0)),
        payable(msg.sender),
        0,
        true,
        price,
        false,
        0,
        0,
        address(0),
        0,
        true
      ); 
      tokenIdToItemId[tokenId] = TokenIdExist(
        itemId,
        true
      );
      IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    }
    emit MarketCreated(
      itemId,
      tokenId,
      nftContract,
      msg.sender,
      address(0),
      msg.sender,
      0,
      true,
      price,
      false,
      0,
      0,
      payable(address(0)),
      0,
      true
    );
  }

  function editMarketSale(
    uint256 itemId,
    uint256 price
    ) public payable nonReentrant {
    require(msg.sender != address(0));
    require(idToMarketItem[itemId].currentOwner == msg.sender, "Not Authorized.");
    require(idToMarketItem[itemId].on_sell == true, "Not on-Sale.");
    require(price > 0, "Price must be at least 1 wei");
    idToMarketItem[itemId].price = price;
  }

  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(msg.sender != address(0));
    require(idToMarketItem[itemId].toMarket == true && idToMarketItem[itemId].on_sell == true, "Item is not on Sale.");
    require(msg.value >= price, "Please submit the asking price in order to complete the purchase");
    address _contractFeeRecipient = MCNFT(nftContract).getContractFeeRecipient();
    uint _contractFee = MCNFT(nftContract).getContractFee();
    address _tokenCreator = MCNFT(nftContract).getTokenCreator(tokenId);
    uint _royaltyFee = MCNFT(nftContract).getRoyaltyFee();
    uint fee = (_contractFee * msg.value) / 100 ;
    if (idToMarketItem[itemId].currentOwner == _tokenCreator) {
      uint sellerValue = msg.value - fee;
      idToMarketItem[itemId].currentOwner.transfer(sellerValue);
      payable(_contractFeeRecipient).transfer(fee);
    } else {
      uint creatorRoyaltyFee = (_royaltyFee * msg.value) / 100;
      uint sellerValue = msg.value - ( fee + creatorRoyaltyFee );
      idToMarketItem[itemId].currentOwner.transfer(sellerValue);
      payable(_tokenCreator).transfer(creatorRoyaltyFee);
      payable(_contractFeeRecipient).transfer(fee);
    }
    idToMarketItem[itemId].previousOwner = idToMarketItem[itemId].currentOwner;
    idToMarketItem[itemId].currentOwner = payable(msg.sender);
    idToMarketItem[itemId].toMarket = false;
    idToMarketItem[itemId].on_sell = false;
    idToMarketItem[itemId].numberOfTransfers += 1;
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
  }
  function giveawayNft(
    address nftContract,
    address giveawayAddress,
    uint256 itemId
    ) public payable nonReentrant returns(bool){
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(idToMarketItem[itemId].on_auction == false, "Giveaway not Possible during auction.");
    require(idToMarketItem[itemId].currentOwner == msg.sender, "Not Authorized");
    require(MCNFT(nftContract).isApprovedForAll(msg.sender, address(this)) == true, "Contract not Approved");
    idToMarketItem[itemId].previousOwner = idToMarketItem[itemId].currentOwner;
    idToMarketItem[itemId].currentOwner = payable(giveawayAddress);
    idToMarketItem[itemId].toMarket = false;
    idToMarketItem[itemId].on_sell = false;
    idToMarketItem[itemId].numberOfTransfers += 1;
    returnOffers(tokenId);
    IERC721(nftContract).transferFrom(address(this), address(giveawayAddress), tokenId);
    return true;
  }
  function createAuction(
    address _nftContract, 
    uint tokenId,
    uint _minBid,
    uint256 _days
  ) 
  external 
  {
    require(msg.sender != address(0));
    require(msg.sender == IERC721(_nftContract).ownerOf(tokenId), "Not Authorized.");
    require(MCNFT(_nftContract).isApprovedForAll(msg.sender, address(this)) == true, "Contract not Approved");
    require(_minBid > 0, "Min Bid must be at least 1 wei");
    require(_days > 0, "Day must be greater than 0");
    uint256 itemId = 0;
    if(tokenIdToItemId[tokenId].exist){
        itemId = tokenIdToItemId[tokenId].itemId;
        require(idToMarketItem[itemId].toMarket == false, "Token already Exist on Sell/Auction.");
        MarketItem storage Item = idToMarketItem[itemId];
        Item.on_auction = true;
        Item.minBid = _minBid;
        Item.endDate = block.timestamp + _days * 86400;
        Item.highestBidAddress = payable(address(0));
        Item.highestBidAmount = 0;
        Item.toMarket = true;
        Item.currentOwner = payable(msg.sender);
        returnOffers(tokenId);
    }else{
        _itemIds.increment();
        itemId = _itemIds.current();
        idToMarketItem[itemId] =  MarketItem(
            itemId,
            tokenId,
            _nftContract,
            payable(msg.sender),
            payable(address(0)),
            payable(msg.sender),
            0,
            false,
            0,
            true,
            _minBid,
            block.timestamp + _days * 86400,
            address(0),
            0,
            true
        ); 
        tokenIdToItemId[tokenId] = TokenIdExist(
        itemId,
        true
    );
    }
    IERC721(_nftContract).transferFrom(msg.sender, address(this), tokenId);
    emit MarketCreated(
        itemId,
        tokenId,
        _nftContract,
        msg.sender,
        address(0),
        msg.sender,
        0,
        false,
        0,
        true,
        _minBid,
        block.timestamp + _days * 86400,
        payable(address(0)),
        0,
        true
    );
  }

  function createBid(uint itemId) external payable {
    MarketItem storage Item = idToMarketItem[itemId];
    require(Item.toMarket == true && Item.on_auction == true, 'auction does not exist');
    require(Item.endDate >= block.timestamp, 'auction is finished');
    require(
      Item.highestBidAmount < msg.value && Item.minBid < msg.value, 
      'Low Bid Amount'
    );
    payable(Item.highestBidAddress).transfer(Item.highestBidAmount);
    Item.highestBidAddress = msg.sender;
    Item.highestBidAmount = msg.value;
  }

  function closeBid(address nftContract, uint itemId) external {
    uint tokenId = idToMarketItem[itemId].tokenId;
    MarketItem storage Item = idToMarketItem[itemId];
    require(Item.on_auction == true, 'auction does not exist');
    require(Item.endDate < block.timestamp, 'auction is not finished');
    require(msg.sender == owner || msg.sender == Item.currentOwner || msg.sender == Item.highestBidAddress, "Not Authorized");
    if(Item.highestBidAmount == 0) {
        Item.toMarket = false;
        Item.on_auction = false;
        IERC721(nftContract).transferFrom(address(this), Item.currentOwner, tokenId);
    } else {
        address _contractFeeRecipient = MCNFT(nftContract).getContractFeeRecipient();
        uint _contractFee = MCNFT(nftContract).getContractFee();
        address _tokenCreator = MCNFT(nftContract).getTokenCreator(tokenId);
        uint _royaltyFee = MCNFT(nftContract).getRoyaltyFee();
        uint fee = (_contractFee * Item.highestBidAmount) / 100 ;
        if (Item.currentOwner == _tokenCreator) {
            uint sellerValue = Item.highestBidAmount - fee;
            Item.currentOwner.transfer(sellerValue);
            payable(_contractFeeRecipient).transfer(fee);
            Item.price = Item.highestBidAmount;
        } else {
            uint creatorRoyaltyFee = (_royaltyFee * Item.highestBidAmount) / 100;
            uint sellerValue = Item.highestBidAmount - ( fee + creatorRoyaltyFee );
            Item.currentOwner.transfer(sellerValue);
            payable(_tokenCreator).transfer(creatorRoyaltyFee);
            payable(_contractFeeRecipient).transfer(fee);
            Item.price = Item.highestBidAmount;
        }
        Item.previousOwner = Item.currentOwner;
        Item.currentOwner = payable(Item.highestBidAddress);
        Item.toMarket = false;
        Item.on_auction = false;
        Item.numberOfTransfers += 1;
        IERC721(nftContract).transferFrom(address(this), Item.highestBidAddress, tokenId);
    }
  }

  function fetchItemByTokenId(uint tokenId) public view returns (MarketItem[] memory) {
    require(tokenIdToItemId[tokenId].exist == true, "Not Exist");
    uint itemId = tokenIdToItemId[tokenId].itemId;
    MarketItem[] memory items = new MarketItem[](1);
    MarketItem storage currentItem = idToMarketItem[itemId];
    items[0] = currentItem;
    return items;
  }

  function fetchItemByItemId(uint itemId) public view returns (MarketItem[] memory) {
    MarketItem[] memory items = new MarketItem[](1);
    MarketItem storage currentItem = idToMarketItem[itemId];
    items[0] = currentItem;
    return items;
  }

 function fetchItemsOnSale() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].toMarket == true && idToMarketItem[i + 1].on_sell == true) {
        itemCount += 1;
      }
    }
    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].toMarket == true && idToMarketItem[i + 1].on_sell == true) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
 function fetchItemsOnAuction() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].toMarket == true && idToMarketItem[i + 1].on_auction == true) {
        itemCount += 1;
      }
    }
    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].toMarket == true && idToMarketItem[i + 1].on_auction == true) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchItemsOnOffer() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].toMarket == false) {
        itemCount += 1;
      }
    }
    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].toMarket == false) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchAllItems() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint currentIndex = 0;
    MarketItem[] memory items = new MarketItem[](totalItemCount);
    for (uint i = 0; i < totalItemCount; i++) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
    }
    return items;
  }
  function fetchItemsOwnByAddress(address nftaddress, address wallet) public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;
    for (uint i = 0; i < totalItemCount; i++) {
      if (IERC721(nftaddress).ownerOf(idToMarketItem[i + 1].tokenId) == wallet) {
        itemCount += 1;
      }
    }
    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (IERC721(nftaddress).ownerOf(idToMarketItem[i + 1].tokenId) == wallet) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
  function fetchItemsOnSaleByAddress(address wallet) public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].currentOwner == wallet && idToMarketItem[i + 1].toMarket == true) {
        itemCount += 1;
      }
    }
    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].currentOwner == wallet && idToMarketItem[i + 1].toMarket == true) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
  function fetchLatestNfts(uint num) public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint currentIndex = 0;
    MarketItem[] memory items = new MarketItem[](num);
    for (uint i = totalItemCount; i > 0; i--) {
        uint currentId = i;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
    }
    return items;
  }
}