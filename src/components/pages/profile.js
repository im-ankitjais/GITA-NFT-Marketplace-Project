import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import GetService from "../../lib/services/getService";
import NftCard from "../components/NftCard";
import { useLocation, navigate } from "@reach/router";
import { parse } from "query-string";

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
const Profile = () => {
  const location = useLocation();
  const [tab, setTab] = useState(0);
  const [ownedNfts, setOwnedNfts] = useState([]);
  const [onSellNfts, setOnSellNfts] = useState([]);
  const [profileAddress, setProfileAddress] = useState(null);
  useEffect(() => {
    const searchParams = parse(location.search);
    console.log(searchParams);
    if (searchParams.address === undefined || searchParams.address === "") {
      navigate("/explore");
      return;
    }
    setProfileAddress(searchParams.address);
  }, []);
  useEffect(() => {
    if (
      profileAddress == undefined ||
      profileAddress === null ||
      profileAddress === ""
    ) {
      return;
    } else {
      getProfileNfts();
    }
  }, [profileAddress]);
  const getProfileNfts = async () => {
    try {
      let respOwned = await _getService.getNftsOwned(profileAddress);
      let respSell = await _getService.getNftsSelling(profileAddress);
      setOwnedNfts(respOwned);
      setOnSellNfts(respSell);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <GlobalStyles />

      <section
        id="profile_banner"
        className="jumbotron breadcumb no-bg"
        style={{
          backgroundImage: `url(${"./img/author_single/author_banner.jpg"})`,
        }}
      >
        <div className="mainbreadcumb"></div>
      </section>

      <section className="container no-bottom">
        <div className="row">
          <div className="col-md-12">
            <div className="d_profile de-flex">
              <div className="de-flex-col">
                <div className="profile_avatar">
                  <img src="./img/author_single/author_thumbnail.jpg" alt="" />
                  <i className="fa fa-check"></i>
                  <div className="profile_name">
                    <h4>
                      Monica Lucas
                      <span className="profile_username">@monicaaa</span>
                      <span id="wallet" className="profile_wallet">
                        {profileAddress}
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
        </div>
      </section>

      <section className="container no-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="items_filter">
              <ul className="de_nav text-left">
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
                  <NftCard nft={nft} />
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
                <NftCard nft={nft} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
export default Profile;
