import React, { useState } from "react";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import NFTService from "../../lib/services/nftService";
import { navigate } from "@reach/router";
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
    color: rgba(255, 255, 255, .5);
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
const _nftService = new NFTService();
const Createpage = () => {
  const [file, setFile] = useState({
    name: "",
    url: "",
  });
  const [formData, setFormData] = useState({
    method: 0,
    name: "",
    description: "",
    price: 0,
    minBid: 0,
    duration: 1,
  });
  const fileChange = async (e) => {
    try {
      var selectedFile = e.target.files[0];
      console.log(selectedFile);
      let url = await _nftService.uploadImage(selectedFile);
      setFile({
        name: selectedFile.name,
        url: url,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const createNFT = async (e) => {
    e.preventDefault();
    try {
      let metaURL = await _nftService.uploadMeta(
        formData.name,
        formData.description,
        file.url
      );
      let tokenResp = await _nftService.createToken(metaURL);
      let sellResp = await _nftService.sellNft(
        tokenResp.tokenId,
        formData.price
      );
      console.log("sellResp", sellResp);
      navigate("/explore");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <GlobalStyles />

      <section
        className="jumbotron breadcumb no-bg"
        style={{
          backgroundImage: `url(${"./img/background/subheader.jpg"})`,
        }}
      >
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Create Your Own NFT</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form
              id="form-create-item"
              className="form-border"
              onSubmit={(e) => createNFT(e)}
            >
              <div className="field-set">
                <h5>Upload NFT Image</h5>

                <div className="d-create-file">
                  <p id="file_name">PNG, JPG, JPEG | Max 2mb.</p>
                  {file.name !== "" && (
                    <p style={{ fontWeight: "bold" }}>{file.name}</p>
                  )}
                  <div className="browse">
                    <input
                      type="button"
                      id="get_file"
                      className="btn-main"
                      value="Browse"
                    />

                    <input
                      id="upload_file"
                      type="file"
                      onChange={(e) => fileChange(e)}
                    />
                  </div>
                </div>

                <div className="spacer-single"></div>

                <h5>Select method</h5>
                <div className="de_tab tab_methods">
                  <ul className="de_nav">
                    <li
                      id="btn1"
                      className={formData.method === 0 && "active"}
                      onClick={() => setFormData({ ...formData, method: 0 })}
                    >
                      <span>
                        <i className="fa fa-tag"></i>Fixed Price
                      </span>
                    </li>
                    <li
                      id="btn2"
                      className={formData.method === 1 && "active"}
                      onClick={() => setFormData({ ...formData, method: 1 })}
                    >
                      <span>
                        <i className="fa fa-hourglass-1"></i>Timed Auction
                      </span>
                    </li>
                  </ul>
                  {/* <div className="de_tab_content pt-3">
                    
                  </div> */}
                </div>

                <div className="spacer-20"></div>

                <h5>Name</h5>
                <input
                  type="text"
                  name="nft_name"
                  id="nft_name"
                  className="form-control"
                  placeholder="e.g. 'Crypto Punk"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <div className="spacer-10"></div>

                <h5>Description</h5>
                <textarea
                  data-autoresize
                  name="item_desc"
                  id="item_desc"
                  className="form-control"
                  placeholder="e.g. 'This is very limited item'"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>

                <div className="spacer-10"></div>

                {formData.method === 0 && (
                  <>
                    <h5>Price</h5>
                    <input
                      type="text"
                      name="item_price"
                      id="item_price"
                      className="form-control"
                      placeholder="enter price for one item (MATIC)"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </>
                )}

                <div className="spacer-10"></div>
                <div
                  id="tab_opt_2"
                  className={formData.method === 1 ? "show" : "hide"}
                >
                  <h5>Minimum bid</h5>
                  <input
                    type="text"
                    name="item_price_bid"
                    id="item_price_bid"
                    className="form-control"
                    placeholder="enter minimum bid"
                    value={formData.minBid}
                    onChange={(e) =>
                      setFormData({ ...formData, minBid: e.target.value })
                    }
                  />

                  <div className="spacer-20"></div>
                  <h5>Auction Duration</h5>
                  <input
                    type="number"
                    name="item_bid_days"
                    id="item_bid_days"
                    className="form-control"
                    placeholder="No. of Days"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  />
                </div>
                <div className="spacer-10"></div>

                <button type="submit" id="submit" className="btn-main">
                  Create NFT
                </button>
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5>Preview item</h5>
            <div className="nft__item m-0">
              <div className="nft__item_wrap">
                <span>
                  {file.url ? (
                    <img
                      src={file.url}
                      id="get_file_2"
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  ) : (
                    <h4>Select an image to see preview</h4>
                  )}
                </span>
              </div>
              <div className="nft__item_info">
                <span>
                  <h4>{formData.name ? formData.name : "Crypto Punk"}</h4>
                </span>
                <div className="nft__item_price">{`${formData.price} MATIC`}</div>
                <div className="spacer-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Createpage;
