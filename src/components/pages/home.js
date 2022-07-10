import React, { useState, useEffect, useContext } from "react";
import SliderMain from "../components/SliderMain";
import FeatureBox from "../components/FeatureBox";
import Catgor from "../components/Catgor";
import Footer from "../components/footer";
import GetService from "../../lib/services/getService";
import { navigate } from "@reach/router";
import StyledNftCard from "../components/NftCard";
import { LoaderContext } from "../../lib/contexts/loaderContext";
import Loader from "../components/Loader";
const _getService = new GetService();
const Home = () => {
  const [loaderContext, setLoaderContext] = useContext(LoaderContext);
  const [latestNfts, setLatestNfts] = useState([]);
  useEffect(() => {
    getLatestNfts();
  }, []);
  const getLatestNfts = async () => {
    try {
      setLoaderContext({ ...loaderContext, loading: true });
      let resp = await _getService.getAllNfts();
      setLatestNfts(resp);
      setLoaderContext({ ...loaderContext, loading: false });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {loaderContext.loading && <Loader />}
      <section
        className="jumbotron breadcumb no-bg h-vh"
        style={{ backgroundImage: `url(${"./img/bg-shape-1.jpg"})` }}
      >
        <SliderMain />
      </section>

      <section className="container no-top no-bottom">
        <FeatureBox />
      </section>

      <section className="container no-bottom">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Latest NFTs</h2>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row">
              {latestNfts
                ?.slice(-5, -1)
                .reverse()
                .map((nft, index) => (
                  <div
                    key={index}
                    className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4"
                  >
                    <StyledNftCard nft={nft} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* <section className='container no-bottom'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='text-center'>
              <h2>Top Sellers</h2>
              <div className="small-border"></div>
            </div>
          </div>
          <div className='col-lg-12'>
            <AuthorList/>
          </div>
        </div>
      </section> */}

      <section className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Browse by category</h2>
              <div className="small-border"></div>
            </div>
          </div>
        </div>
        <Catgor />
      </section>

      <Footer />
    </div>
  );
};
export default Home;
