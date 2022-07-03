import React from "react";
import { Router, Location, Redirect } from "@reach/router";
import ScrollToTopBtn from "./menu/ScrollToTop";
import Header from "./menu/header";
import Home from "./pages/home";

import Explore from "./pages/explore";
import Helpcenter from "./pages/helpcenter";
import MyProfile from "./pages/myProfile";
import NFT from "./pages/nft";
import Author from "./pages/Author";
import Works from "./pages/works";
import News from "./pages/news";
import Create from "./pages/create";
import Contact from "./pages/contact";
import ElegantIcons from "./pages/elegantIcons";
import EtlineIcons from "./pages/etlineIcons";
import FontAwesomeIcons from "./pages/fontAwesomeIcons";
import Accordion from "./pages/accordion";
import Alerts from "./pages/alerts";
import Progressbar from "./pages/progressbar";
import Tabs from "./pages/tabs";
import { WalletProvider } from "../lib/contexts/walletContext";
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

const app = () => (
  <div className="wraper">
    <GlobalStyles />
    <WalletProvider>
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
          <Author path="/Author" />
          <Works path="/works" />
          <News path="/news" />
          <Create path="/create" />
          <Contact path="/contact" />

          <ElegantIcons path="/elegantIcons" />
          <EtlineIcons path="/etlineIcons" />
          <FontAwesomeIcons path="/fontAwesomeIcons" />
          <Accordion path="/accordion" />
          <Alerts path="/alerts" />
          <Progressbar path="/progressbar" />
          <Tabs path="/tabs" />
        </ScrollTop>
      </PosedRouter>
      <ScrollToTopBtn />
    </WalletProvider>
  </div>
);
export default app;
