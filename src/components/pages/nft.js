import React, { useState, useEffect } from "react";
import Clock from "../components/Clock";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import GetServices from "../../lib/services/getService";
import PostServices from "../../lib/services/postService";
import { useLocation, navigate } from "@reach/router";
import { parse } from "query-string";
import OffersTable from "../components/Table/OffersTable";
import { timeRemaining } from "../../lib/services/timerService";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

const _getService = new GetServices();
const _postService = new PostServices();
const Colection = () => {
  const location = useLocation();
  const [nft, setNft] = useState(null);
  const [offers, setOffers] = useState([]);
  const [newBid, setNewBid] = useState({
    show: false,
    value: 0,
  });
  const [newOffer, setNewOffer] = useState({
    show: false,
    value: 0,
  });
  const [timer, setTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const searchParams = parse(location.search);
    if (searchParams.tokenid === undefined || searchParams.tokenid === "") {
      navigate("/explore");
      return;
    }
    getNftDetail(searchParams.tokenid);
  }, []);
  useEffect(() => {
    let itv;
    if (nft !== null && nft.toMarket === false) {
      getOffersOnNft(nft.tokenId);
    } else if (nft !== null && nft.on_auction === true) {
      itv = setInterval(() => {
        let resp = timeRemaining(nft?.endDate, 0);
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
  }, [nft]);
  const getOffersOnNft = async (tokenId) => {
    try {
      let offersResp = await _getService.getOffersOnNft(tokenId);
      setOffers(offersResp);
    } catch (error) {
      console.log(error);
    }
  };
  const getNftDetail = async (tokenId) => {
    try {
      console.log(tokenId);
      let resp = await _getService.getNftsByTokenId(tokenId);
      console.log(resp);
      setNft(resp);
    } catch (error) {
      console.log(error);
    }
  };
  const getMinBid = () => {
    const lastHighestBid = nft.hBid;
    const minBid = nft.mBid;
    if (lastHighestBid === "0.0") {
      return parseFloat(minBid).toFixed(4);
    } else {
      return parseFloat(parseFloat(lastHighestBid)).toFixed(4);
    }
  };
  const buyNft = async (e) => {
    try {
      e.preventDefault();
      await _postService.buyNft(nft.itemId, nft.price);
    } catch (error) {
      console.log(error);
    }
  };
  const confirmBid = async (e) => {
    try {
      e.preventDefault();
      const minPossibleBid = getMinBid();

      if (!newBid.value) throw "Please Enter Your Bid Amount.";
      if (isNaN(parseFloat(newBid.value))) throw "Invalid Bid!";
      if (parseFloat(newBid.value) <= parseFloat(minPossibleBid))
        throw `You can only bid greater than ${minPossibleBid} MATIC`;

      await _postService.bidNft(nft.itemId, newBid.value);
    } catch (error) {
      console.log(error);
    }
  };
  const confirmOffer = async (e) => {
    try {
      e.preventDefault();
      await _postService.offerNft(nft.tokenId, newOffer.value);
    } catch (error) {
      console.log(error);
    }
  };
  const openTokenInfo = () => {
    window.open(
      process.env.REACT_APP_CHAIN_ID === "0x13881"
        ? `https://mumbai.polygonscan.com/token/${process.env.REACT_APP_NFT_ADDRESS}?a=${nft.tokenId}`
        : `https://polygonscan.com/token/${process.env.REACT_APP_NFT_ADDRESS}?a=${nft.tokenId}`
    );
  };
  return (
    <div>
      <GlobalStyles />

      <section className="container">
        <div className="row mt-md-5 pt-md-4">
          <div className="col-md-6 text-center">
            {/* <img
              src="./img/items/big-1.jpg"
              className="img-fluid img-rounded mb-sm-30"
              alt=""
            /> */}
            <img
              style={{
                borderRadius: "12px",
              }}
              src={nft && nft.image}
              className="img-fluid img-rounded mb-sm-30"
              alt="nft"
            />
          </div>
          <div className="col-md-6">
            <div className="item_info">
              <h2>{nft && nft.name ? nft.name : "Undefined"}</h2>
              <div className="item_info_counts">
                <div className="item_info_type fs-6">
                  <i className="fa fa-connectdevelop"></i>ERC-721
                </div>
                <div className="item_info_type fs-6">
                  <i className="fa fa-image"></i>
                  {nft && nft.on_sell === true
                    ? "Sell"
                    : nft && nft.on_auction === true
                    ? "Auction"
                    : "NFT"}
                </div>
                <div
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Open Contract"
                  className="item_info_type fw-bold fs-6"
                  style={{ cursor: "pointer" }}
                  onClick={() => openTokenInfo()}
                >
                  <i className="fa fa-connectdevelop"></i>Token ID:{" "}
                  <span> {nft && nft.tokenId} </span>
                </div>
                <div
                  className="item_info_type fs-6"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <i className="fa fa-share"></i>Copy Share Link
                </div>
              </div>
              <p>{nft && nft.description}</p>
              <div className="d-flex">
                <div>
                  <h6>Creator</h6>
                  <div className="item_author">
                    <div className="author_list_pp">
                      <span>
                        <img
                          className="lazy"
                          src="./img/author/author-1.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </span>
                    </div>
                    <div className="author_list_info">
                      <span>{`${nft && nft.listedBy.slice(0, 12)}...`}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h6>Owner</h6>
                  <div className="item_author">
                    <div className="author_list_pp">
                      <span>
                        <img
                          className="lazy"
                          src="./img/author/author-1.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </span>
                    </div>
                    <div className="author_list_info">
                      <span>{`${
                        nft && nft.currentOwner.slice(0, 12)
                      }...`}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="spacer-40"></div>
              {nft && (nft.toMarket === false || nft.on_sell === true) && (
                <>
                  <div
                    style={{
                      fontSize: "19px",
                      fontWeight: "900",
                      paddingLeft: "7px",
                    }}
                  >
                    Price: <b>{`${nft.price} MATIC`}</b>
                  </div>
                  <div className="spacer-30"></div>
                </>
              )}
              {nft && nft.on_auction === true && (
                <>
                  <div
                    style={{
                      fontSize: "19px",
                      fontWeight: "900",
                      paddingLeft: "7px",
                    }}
                  >
                    Minimum Bid: <b>{`${nft.mBid} MATIC`}</b>
                  </div>
                  {nft.hBid !== "0.0" && (
                    <div
                      style={{
                        fontSize: "19px",
                        fontWeight: "900",
                        paddingLeft: "7px",
                      }}
                    >
                      Last Highest Bid: <b>{`${nft.hBid} MATIC`}</b>
                    </div>
                  )}
                </>
              )}
              <div className="spacer-30"></div>
              {nft && nft.on_auction === true && (
                <div className="d-flex justify-center items-center">
                  <p style={{ margin: "4px 10px 0 0", padding: "0px" }}>
                    Auctions ends in
                  </p>
                  <div className={`de_countdown timer_container m-0 p-0`}>
                    <div>
                      <div className="Clock-days">{`${timer.days}d`}</div>
                      <div className="Clock-hours">{`${timer.hours}h`}</div>
                      <div className="Clock-minutes">{`${timer.minutes}m`}</div>
                      <div className="Clock-seconds">{`${timer.seconds}s`}</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="spacer-30"></div>

              <div className="mainside">
                {nft && localStorage.getItem("wallet") !== nft.currentOwner ? (
                  nft.toMarket === false ? (
                    <div
                      className="btn-main"
                      onClick={() => setNewOffer({ show: true, value: 0 })}
                    >
                      Make Offer
                    </div>
                  ) : nft && nft.on_sell === true ? (
                    <div className="btn-main" onClick={(e) => buyNft(e)}>
                      Buy Now
                    </div>
                  ) : (
                    nft &&
                    nft.on_auction === true &&
                    !newBid.show && (
                      <div
                        className="btn-main"
                        onClick={() => setNewBid({ show: true, value: 0 })}
                      >
                        Place Bid
                      </div>
                    )
                  )
                ) : (
                  <div></div>
                )}
              </div>
              <div className="spacer-30"></div>
              {nft &&
                nft.on_auction === true &&
                newBid.show === true &&
                localStorage.getItem("wallet") !== nft.currentOwner && (
                  <>
                    <div className="input-group">
                      <input
                        type="number"
                        name="item_price"
                        className="form-control"
                        placeholder="Enter price for this item (in MATIC)"
                        value={newBid.value}
                        onChange={(e) =>
                          setNewBid({ ...newBid, value: e.target.value })
                        }
                      />
                    </div>
                    <div
                      style={{
                        margin: "-16px auto 0px",
                        paddingLeft: "8px",
                        fontSize: "14px",
                      }}
                    >
                      You can only bid greator than{" "}
                      <span style={{ color: "#f6cf45", fontWeight: "bold" }}>
                        {getMinBid()}
                      </span>{" "}
                      MATIC
                    </div>
                    <div className="spacer-10"></div>
                    <div className="btn-main" onClick={(e) => confirmBid(e)}>
                      {"Confirm Bid"}
                    </div>
                    <div className="spacer-10"></div>
                    <div
                      style={{
                        marginTop: "16px",
                        marginBottom: "16px",
                        borderRadius: "12px",
                        backgroundColor: "#efe9e9",
                        padding: "12px",
                      }}
                    >
                      <h5 style={{ paddingLeft: "8px" }}>Note: </h5>
                      <ol style={{ marginBottom: 0 }}>
                        <li>
                          You cannot cancel this bid once you confirm it. If you
                          get outbid by someone else, you will get refunded
                          automatically.
                        </li>
                        <li>
                          If your bid stays the highest at the end of timer, you
                          will be able to claim the NFT from your profile.
                        </li>
                      </ol>
                    </div>
                  </>
                )}
              {nft &&
                nft.toMarket === false &&
                newOffer.show === true &&
                localStorage.getItem("wallet") !== nft.currentOwner && (
                  <>
                    <div className="input-group">
                      <input
                        type="number"
                        name="item_price"
                        className="form-control"
                        placeholder="Enter offer price for this item (in MATIC)"
                        value={newOffer.value}
                        onChange={(e) =>
                          setNewOffer({ ...newOffer, value: e.target.value })
                        }
                      />
                    </div>
                    <div className="spacer-10"></div>
                    <div className="btn-main" onClick={(e) => confirmOffer(e)}>
                      {"Confirm Offer"}
                    </div>
                    <div className="spacer-10"></div>
                    <div
                      style={{
                        marginTop: "16px",
                        marginBottom: "16px",
                        borderRadius: "12px",
                        backgroundColor: "#efe9e9",
                        padding: "12px",
                      }}
                    >
                      <h5 style={{ paddingLeft: "8px" }}>Note: </h5>
                      <ol style={{ marginBottom: 0 }}>
                        <li>You can cancel the offer anytime</li>
                        <li>
                          If the owner accepts your offer, you will receive the
                          NFT automatically in your profile.
                        </li>
                      </ol>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </section>
      {nft !== null && nft.toMarket === false && offers.length > 0 && (
        <OffersTable
          offers={offers}
          loggedUser={localStorage.getItem("wallet")}
          currentOwner={nft.currentOwner}
          itemId={nft.itemId}
        />
      )}
      <div className="spacer-40"></div>

      <Footer />
    </div>
  );
};
export default Colection;
