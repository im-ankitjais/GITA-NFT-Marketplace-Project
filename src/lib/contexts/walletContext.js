import { createContext, useEffect, useState } from "react";
import WalletService from "../services/WalletService";
let initialState = {
  loggedIn: false,
};

export const WalletContext = createContext([initialState, () => {}]);
const _walletService = new WalletService();
export const WalletProvider = (props) => {
  const [walletContext, setWalletContext] = useState(initialState);
  useEffect(() => {
    const checkConnection = async () => {
      try {
        let walletAddress = localStorage.getItem("wallet");
        console.log(walletAddress);
        if (walletAddress !== null && walletAddress !== undefined) {
          await _walletService.connectWallet();
          setWalletContext({
            loggedIn: true,
          });
        }
      } catch (error) {
        localStorage.clear();
        setWalletContext({
          loggedIn: false,
        });
      }
    };
    checkConnection();
  }, []);
  return (
    <WalletContext.Provider value={[walletContext, setWalletContext]}>
      {props.children}
    </WalletContext.Provider>
  );
};
