import React, { useEffect, useState } from "react";
import { timeRemaining } from "../../lib/services/timerService";
import styled from "styled-components";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { navigate } from "@reach/router";

const NftCard = ({ nft, className }) => {
  const [timer, setTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    let itv;
    if (nft.on_auction === true && timeRemaining(nft?.endDate) !== 0) {
      itv = setInterval(() => {
        let resp = timeRemaining(nft?.endDate);
        setTimer({
          days: resp.days,
          hours: resp.hours,
          minutes: resp.minutes,
          seconds: resp.seconds,
        });
      }, 1000);
    }
    return () => {
      if (itv !== undefined) {
        clearInterval(itv);
      }
    };
  }, []);
  const calcPriceString = (price, type) => {
    if (type === 1) return `Price: ${price}`;
    if (type === 2) return `Min Bid: ${price}`;
    if (type === 3) return `Last Bid: ${price}`;
    return price;
  };

  return (
    <div className={className}>
      {nft.on_auction === true && (
        <div className="nc-top">
          <div className="nc-counter">
            <div>
              <div className="Clock-days">{`${timer.days}d`}</div>
              <div className="Clock-hours">{`${timer.hours}h`}</div>
              <div className="Clock-minutes">{`${timer.minutes}m`}</div>
              <div className="Clock-seconds">{`${timer.seconds}s`}</div>
            </div>
          </div>
        </div>
      )}
      <div
        className="nc-img"
        onClick={() => {
          navigate(`/nft?tokenid=${nft.tokenId}`);
        }}
      >
        <img
          alt="nft image"
          src={nft?.image}
          style={{ objectFit: "contain", width: "100%", padding: "10px" }}
        />
      </div>
      <div
        className="nc-content"
        onClick={() => {
          navigate(`/nft?tokenid=${nft.tokenId}`);
        }}
      >
        <h4>{nft.name ? nft.name : "Undefined"}</h4>
        <div className="nc-desc">{nft?.description}</div>
        <div className="nc-price">
          {(nft?.on_sell === true || nft?.toMarket === false) &&
            calcPriceString(nft?.price, 1)}
          {nft.on_auction === true && calcPriceString(nft.mBid, 2)}
        </div>

        {nft?.on_auction === true && nft?.hBid !== 0 && (
          <div className="nc-price">{`${calcPriceString(nft?.hBid, 3)}`}</div>
        )}
        <div className="nc-action">
          {nft?.toMarket === false && (
            <>
              <span className="action-button">Make Offer</span>
              <div
                className="nc-q-icon"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      <div style={{ textAlign: "left", fontSize: "15px" }}>
                        1. You can cancel the offer anytime.
                      </div>
                      <br />
                      <div style={{ textAlign: "left", fontSize: "15px" }}>
                        2. If the owner accepts your offer, you will receive the
                        NFT automatically in your profile.
                      </div>
                    </Tooltip>
                  }
                >
                  <i className="fa fa-question-circle"></i>
                </OverlayTrigger>
              </div>
            </>
          )}
          {nft?.on_sell === true && (
            <>
              <span className="action-button">Buy NFT</span>
              <div
                className="nc-q-icon"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      <div style={{ fontSize: "15px" }}>
                        This is a direct sale, upon transaction confirmation NFT
                        will be received in your profile.
                      </div>
                    </Tooltip>
                  }
                >
                  <i className="fa fa-question-circle"></i>
                </OverlayTrigger>
              </div>
            </>
          )}
          {nft?.on_auction === true && (
            <>
              <span className="action-button">Place a Bid</span>
              <div
                className="nc-q-icon"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      <div style={{ textAlign: "left", fontSize: "15px" }}>
                        1. You cannot cancel this bid once you confirm it. If
                        you get outbid by someone else, you will get refunded
                        automatically.
                      </div>
                      <br />
                      <div style={{ textAlign: "left", fontSize: "15px" }}>
                        2. If your bid stays the highest at the end of timer,
                        you will be able to claim the NFT from your profile.
                      </div>
                    </Tooltip>
                  }
                >
                  <i className="fa fa-question-circle"></i>
                </OverlayTrigger>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StyledNftCard = styled(NftCard)`
  & {
    border-radius: 16px;
    border-top: solid 1px rgba(255, 255, 255, 0.1);
    padding: 16px;
    background: rgba(255, 255, 255, 0.025);
    transition: 0.7s;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.3);
    &:hover {
      box-shadow: 2px 2px 30px 0px rgba(10, 10, 10, 0.1);
      transition: 0.7s;
    }
  }
  .nc-tags {
    margin: 12px auto 4px;
    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-wrap: wrap;
    min-height: 60px;
  }
  .nc-nftstatus {
    margin-left: 6px;
  }
  .nc-viewcount {
    margin-left: 6px;
    & > span {
      background-color: #474c54;
      margin-left: 0;
      display: inline-flex;
      padding: 2px 8px;
      border-radius: 4px;
      & > i {
        font-size: 22px;
      }
      & > span {
        font-size: 14px;
      }
    }
  }
  .nc-action {
    font-size: 15px;
    font-weight: 500;
    /* color: #f6cf45; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    margin-bottom: 8px;
    text-align: center;

    & > .nc-q-icon {
      /* margin-left: 12px; */
      /* border: solid 1px red; */
      font-size: 24px;
    }
    & > .action-button {
      background: linear-gradient(
        to bottom,
        #fac036 0%,
        #f3d84e 50%,
        #ede965 100%
      );
      color: black;
      border-radius: 20px;
      padding: 6px 16px;
      &:hover {
        background-color: #202020;
        box-shadow: 0px 0px 10px 0px #f6cf45;
        transition: all 0.3s ease;
      }
    }
    & > .auction-over {
      background: linear-gradient(
        to bottom,
        rgb(194 149 41) 0%,
        rgb(183 162 58) 50%,
        rgb(156 153 66) 100%
      );
      color: black;
      border-radius: 20px;
      margin-top: 8px;
      padding: 6px 16px;
    }
  }
  .nc-content {
    padding-top: 12px;
    cursor: pointer;
    height: 180px;
    display: flex;
    flex-direction: column;

    h4,
    .nc-desc,
    .nc-price {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .nc-price {
      margin-top: 4px;
      /* color: #f6cf45; */
      color: black;
      font-size: 14px;
      font-weight: 800;
    }
  }

  .nc-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 95%;
    margin: auto;
    margin-bottom: -30px;
  }

  .nc-img {
    height: 340px;
    overflow: hidden;
    border-radius: 12px;
    background-color: #f3eaea;
    /* background-image: url("/assets/images/card-bg.jpg"); */
    /* background-size: cover; */
    /* background-repeat: no-repeat; */
    cursor: pointer;
    position: relative;
    display: flex;
    justify-center: center;
    align-items: center;
  }

  .nc-counter {
    font-size: 0.8rem;
    right: 20px;
    background: #212428;
    padding: 6px 10px;
    border-radius: 30px;
    -moz-border-radius: 30px;
    -webkit-border-radius: 30px;
    border: solid 2px #f6cf45;
    z-index: 1;
    color: white;
    .Clock-days {
      font-weight: bold;
      display: inline-block;
      margin-right: 5px;
    }
    .Clock-hours {
      font-weight: bold;
      display: inline-block;
      margin-right: 5px;
    }
    .Clock-minutes {
      font-weight: bold;
      display: inline-block;
      margin-right: 5px;
    }
    .Clock-seconds {
      font-weight: bold;
      display: inline-block;
      margin-right: 5px;
    }
  }
`;

export default StyledNftCard;
