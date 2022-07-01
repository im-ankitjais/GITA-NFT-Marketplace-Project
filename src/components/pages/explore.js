import React, { useState, useEffect } from "react";
import Select from "react-select";
import NftCard from "../components/NftCard";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import GetService from "../../lib/services/getService";
const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);;
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

const customStyles = {
  option: (base, state) => ({
    ...base,
    background: "#fff",
    color: "#333",
    borderRadius: state.isFocused ? "0" : 0,
    "&:hover": {
      background: "#eee",
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    marginTop: 0,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  control: (base, state) => ({
    ...base,
    padding: 2,
  }),
};

// const nfts = [
//   {
//     deadline: "December, 30, 2021",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-1.jpg",
//     previewImg: "./img/items/static-1.jpg",
//     title: "Pinky Ocean",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-10.jpg",
//     previewImg: "./img/items/static-2.jpg",
//     title: "Deep Sea Phantasy",
//     price: "0.06 ETH",
//     bid: "1/22",
//     likes: 80,
//   },
//   {
//     deadline: "",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-11.jpg",
//     previewImg: "./img/items/static-3.jpg",
//     title: "Rainbow Style",
//     price: "0.05 ETH",
//     bid: "1/11",
//     likes: 97,
//   },
//   {
//     deadline: "January, 1, 2022",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-12.jpg",
//     previewImg: "./img/items/static-4.jpg",
//     title: "Two Tigers",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-9.jpg",
//     previewImg: "./img/items/anim-4.webp",
//     title: "The Truth",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "January, 15, 2022",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-2.jpg",
//     previewImg: "./img/items/anim-2.webp",
//     title: "Running Puppets",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-3.jpg",
//     previewImg: "./img/items/anim-1.webp",
//     title: "USA Wordmation",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-4.jpg",
//     previewImg: "./img/items/anim-5.webp",
//     title: "Loop Donut",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "January, 3, 2022",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-5.jpg",
//     previewImg: "./img/items/anim-3.webp",
//     title: "Lady Copter",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-7.jpg",
//     previewImg: "./img/items/static-5.jpg",
//     title: "Purple Planet",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-6.jpg",
//     previewImg: "./img/items/anim-6.webp",
//     title: "Oh Yeah!",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "January, 10, 2022",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-8.jpg",
//     previewImg: "./img/items/anim-7.webp",
//     title: "This is Our Story",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-9.jpg",
//     previewImg: "./img/items/static-6.jpg",
//     title: "Pixel World",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
//   {
//     deadline: "January, 10, 2022",
//     authorLink: "#",
//     nftLink: "#",
//     bidLink: "#",
//     authorImg: "./img/author/author-12.jpg",
//     previewImg: "./img/items/anim-8.webp",
//     title: "I Believe I Can Fly",
//     price: "0.08 ETH",
//     bid: "1/20",
//     likes: 50,
//   },
// ];
const options = [
  { value: "All categories", label: "All categories" },
  { value: "Art", label: "Art" },
  { value: "Music", label: "Music" },
  { value: "Domain Names", label: "Domain Names" },
];
const options1 = [
  { value: "Buy Now", label: "Buy Now" },
  { value: "On Auction", label: "On Auction" },
  { value: "Has Offers", label: "Has Offers" },
];
const options2 = [
  { value: "All Items", label: "All Items" },
  { value: "Single Items", label: "Single Items" },
  { value: "Bundles", label: "Bundles" },
];
const _getService = new GetService();
const Explore = () => {
  const [NftsData, setNftsData] = useState([]);
  useEffect(() => {
    const getAllNfts = async () => {
      let nftsResp = await _getService.getAllNfts();
      console.log(nftsResp);
      setNftsData(nftsResp);
    };
    getAllNfts();
  }, []);
  return (
    <div>
      <GlobalStyles />

      <section
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${"./img/background/subheader.jpg"})` }}
      >
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Explore</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="items_filter">
              <form
                className="row form-dark"
                id="form_quick_search"
                name="form_quick_search"
              >
                <div className="col">
                  <input
                    className="form-control"
                    id="name_1"
                    name="name_1"
                    placeholder="search item here..."
                    type="text"
                  />{" "}
                  <button id="btn-submit">
                    <i className="fa fa-search bg-color-secondary"></i>
                  </button>
                  <div className="clearfix"></div>
                </div>
              </form>
              <div className="dropdownSelect one">
                <Select
                  styles={customStyles}
                  menuContainerStyle={{ zIndex: 999 }}
                  defaultValue={options[0]}
                  options={options}
                />
              </div>
              <div className="dropdownSelect two">
                <Select
                  styles={customStyles}
                  defaultValue={options1[0]}
                  options={options1}
                />
              </div>
              <div className="dropdownSelect three">
                <Select
                  styles={customStyles}
                  defaultValue={options2[0]}
                  options={options2}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {NftsData?.map((nft, index) => (
            <div
              key={index}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4"
            >
              <NftCard nft={nft} />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Explore;
