import React, { useState, useEffect, useContext } from "react";
import ColumnZero from "../components/ColumnZero";
import ColumnZeroTwo from "../components/ColumnZeroTwo";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { WalletContext } from "../../lib/contexts/walletContext";
import { navigate } from "@reach/router";
import GetService from "../../lib/services/getService";
import OwnedCard from "../components/Cards/OwnedCard";
import { LoaderContext } from "../../lib/contexts/loaderContext";
import Loader from "../components/Loader";
const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
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
const _getService = new GetService();
const MyProfile = () => {
  const [loaderContext, setLoaderContext] = useContext(LoaderContext);
  const [tab, setTab] = useState(0);
  const [ownedNfts, setOwnedNfts] = useState(null);
  const [onSellNfts, setOnSellNfts] = useState(null);
  // const [walletContext, setWalletContext] = useContext(WalletContext);
  useEffect(() => {
    // if (walletContext.loggedIn === false) {
    //   navigate("/explore");
    // } else {
    getProfileNfts();
    // }
  }, []);
  const getProfileNfts = async () => {
    try {
      setLoaderContext({ ...loaderContext, loading: true });
      let loggedWallet = localStorage.getItem("wallet");
      if (loggedWallet === undefined || loggedWallet === null) {
        navigate("/explore");
        return;
      }
      let respOwned = await _getService.getNftsOwned(loggedWallet);
      let respSell = await _getService.getNftsSelling(loggedWallet);
      setOwnedNfts(respOwned);
      setOnSellNfts(respSell);
      setLoaderContext({ ...loaderContext, loading: false });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <GlobalStyles />
      {loaderContext.loading && <Loader />}
      <section
        id="profile_banner"
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${"./img/background/4.jpg"})` }}
      >
        <div className="mainbreadcumb"></div>
      </section>

      <section className="container d_coll no-top no-bottom">
        <div className="row">
          <div className="col-md-12">
            <div className="d_profile">
              <div className="profile_avatar">
                <div className="d_profile_img">
                  <img src="./img/author/author-1.jpg" alt="" />
                  <i className="fa fa-check"></i>
                </div>

                <div className="profile_name">
                  <h4>
                    <div className="clearfix"></div>
                    <span id="wallet" className="profile_wallet">
                      {localStorage.getItem("wallet")}
                    </span>
                    <button id="btn_copy" title="Copy Text">
                      Copy
                    </button>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container no-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="items_filter">
              <ul className="de_nav">
                <li id="Mainbtn" className={tab === 0 ? "active" : ""}>
                  <span onClick={() => setTab(0)}>On Sale</span>
                </li>
                <li id="Mainbtn1" className={tab === 1 ? "active" : ""}>
                  <span onClick={() => setTab(1)}>Owned</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {tab === 0 && (
          <div id="zero1" className="onStep fadeIn">
            <div className="row">
              {onSellNfts?.map((nft, index) => (
                <div
                  key={index}
                  className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                >
                  <OwnedCard nft={nft} />
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 1 && (
          <div id="zero2" className="onStep fadeIn">
            {ownedNfts?.map((nft, index) => (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              >
                <OwnedCard nft={nft} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
export default MyProfile;
