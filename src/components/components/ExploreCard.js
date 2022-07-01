import React, { Component } from "react";
import styled from "styled-components";
import Clock from "./Clock";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

const ExploreCard = ({ nft }) => {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //         nfts: this.dummyData.slice(0,8),
  //         height: 0
  //     };
  //     this.onImgLoad = this.onImgLoad.bind(this);
  //     }

  //     loadMore = () => {
  //         let nftState = this.state.nfts
  //         let start = nftState.length
  //         let end = nftState.length+4
  //         this.setState({
  //             nfts: [...nftState, ...(this.dummyData.slice(start, end))]
  //         });
  //     }

  //     onImgLoad({target:img}) {
  //         let currentHeight = this.state.height;
  //         if(currentHeight < img.offsetHeight) {
  //             this.setState({
  //                 height: img.offsetHeight
  //             })
  //         }

  return (
    <div className="nft__item m-0">
      {nft.deadline && (
        <div className="de_countdown">
          <Clock deadline={nft.deadline} />
        </div>
      )}
      <div className="author_list_pp">
        <span onClick={() => window.open(nft.authorLink, "_self")}>
          <img className="lazy" src="./img/author/author-10.jpg" alt="" />
          <i className="fa fa-check"></i>
        </span>
      </div>
      <div
        className="nft__item_wrap"
        // style={{ height: `${this.state.height}px` }}
      >
        <Outer>
          <span>
            <img src={nft.image} className="lazy nft__item_preview" alt="" />
          </span>
        </Outer>
      </div>
      <div className="nft__item_info">
        <span onClick={() => window.open(nft.nftLink, "_self")}>
          <h4>{nft.name ? nft.name : "Undefined"}</h4>
        </span>
        <div className="nft__item_price">
          {nft.price}
          <span>{nft.hbid}</span>
        </div>
        <div className="nft__item_action">
          <span onClick={() => window.open(nft.bidLink, "_self")}>
            Place a bid
          </span>
        </div>
      </div>
    </div>
  );
};
export default ExploreCard;
