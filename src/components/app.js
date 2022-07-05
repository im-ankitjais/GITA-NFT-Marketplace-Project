import React, { useEffect, useContext } from "react";
import { Router, Location, Redirect } from "@reach/router";
import ScrollToTopBtn from "./menu/ScrollToTop";
import Header from "./menu/header";
import Home from "./pages/home";

import Explore from "./pages/explore";
import Helpcenter from "./pages/helpcenter";
import MyProfile from "./pages/myProfile";
import NFT from "./pages/nft";
import Profile from "./pages/profile";
import Works from "./pages/works";
import News from "./pages/news";
import Create from "./pages/create";
import Contact from "./pages/contact";
import { WalletProvider } from "../lib/contexts/walletContext";
import { LoaderProvider } from "../lib/contexts/loaderContext";
import { createGlobalStyle } from "styled-components";
import "../index.css";
const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location]);
  return children;
};

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id="routerhang">
        <div key={location.key}>
          <Router location={location}>{children}</Router>
        </div>
      </div>
    )}
  </Location>
);

const App = () => {
  return (
    <div className="wraper">
      <GlobalStyles />
      <WalletProvider>
        <LoaderProvider>
          <Header />
          <PosedRouter>
            <ScrollTop path="/">
              <Home exact path="/">
                <Redirect to="/home" />
              </Home>
              <Explore path="/explore" />
              <Helpcenter path="/helpcenter" />
              <MyProfile path="/my-profile" />
              <NFT path="/nft" />
              <Profile path="/profile" />
              <Works path="/works" />
              <News path="/news" />
              <Create path="/create" />
              <Contact path="/contact" />
            </ScrollTop>
          </PosedRouter>
          <ScrollToTopBtn />
        </LoaderProvider>
      </WalletProvider>
    </div>
  );
};
export default App;
