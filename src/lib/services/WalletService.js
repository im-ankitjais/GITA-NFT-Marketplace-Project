import { ethers } from 'ethers'
import Web3Modal from "web3modal";
import Web3 from "web3";
import { API_URL, POLYGON_RPC_URL, POLYGON_SCAN_LINK, CHAIN_ID, CHAIN_NAME } from '../../config';
import BaseService from "../services/BaseService";
import axios from 'axios';
export default class WalletService extends BaseService {
    async connectWallet() {
        try {
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum)
            } else if (window.web3) {
                await window.ethereum.enable()
                window.web3 = new Web3(window.web3.currentProvider)
            } else {
                setTimeout(() => {
                    window.open("https://metamask.app.link/dapp/thememe.club/");
                }, 1000);
                throw `Metamask Wallet Not Detected! Please Add Metamask Wallet from here "https://metamask.io/"`
            }
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: CHAIN_ID,
                    chainName: CHAIN_NAME,
                    nativeCurrency: {
                        name: CHAIN_NAME,
                        symbol: 'MATIC',
                        decimals: 18
                    },
                    rpcUrls: [POLYGON_RPC_URL],
                    blockExplorerUrls: [`${POLYGON_SCAN_LINK}/`]
                }]
            })
            let nonceResponse;
            let commonNonceResponse;
            let signed;
            let loginResponse;
            let providerOptions = {};
            const web3Modal = new Web3Modal({
                network: "mainnet",
                cacheProvider: true,
                providerOptions
            });
            const connection = await web3Modal.connect();
            // //
            // connection.on("connect", (info) => {
            //     console.log(info);
            // });
            // connection.on("disconnect", (error) => {
            //     console.log(error);
            // });
            // // 
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            nonceResponse = await this.getNonce(address);
            if (nonceResponse.nonce) {
                signed = await this.handleSignMessage(address, nonceResponse.nonce);
                loginResponse = await this.handleAuthenticate(signed.walletAddress, signed.signature);
                return {
                    wallet_id: signed.walletAddress,
                    signature: signed.signature,
                    access_token: loginResponse.access_token
                }
            } else {
                commonNonceResponse = await this.getCommonNonce();
                signed = await this.handleSignMessage(address, commonNonceResponse.nonce);
                return {
                    wallet_id: address,
                    signature: signed.signature
                }
            }
        } catch (error) {
            console.log(error)
            let msg = "Please open metamask and close all pending request. Or refresh the app and try again.";
            if (error && typeof error === "string") {
                msg = error;
            }
            return Promise.reject(msg || "Something went wrong!");
        }
    }
    async getNonce(walletId) {
        try {
            const response = await axios.get(`${API_URL}/nonce/?wallet_id=${walletId}`)
            return response.data;
        } catch (error) {
            return error;
        }
    }
    async getCommonNonce() {
        try {
            const response = await this.API({
                url: `/common-nonce/`,
                method: "get"
            }, false);
            return response;
        } catch (error) {
            return Promise.reject(error || "Common Nonce error.");
        }
    }
    async handleSignMessage(
        walletAddress,
        nonce
    ) {
        try {
            let web3;
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
            } else if (window.web3) {
                web3 = new Web3(window.web3.currentProvider);
            };
            const signature = await web3.eth.personal.sign(
                web3.utils.fromUtf8(nonce),
                walletAddress,
                '' // MetaMask will ignore the password argument here
            );
            return { walletAddress, signature };
        } catch (err) {
            throw new Error(
                'You need to sign the message to be able to log in.'
            );
        }
    };
    async handleAuthenticate(
        wallet_id,
        signature,
    ) {
        try {
            let body = { wallet_id, signature };
            const response = await this.API({
                url: `/wallet-login/`,
                method: "post",
                data: JSON.stringify(body),
            },
                false
            );
            return response;
        } catch (error) {
            // return Promise.reject(error || "Auth Error.");
            console.log("handleAuthenticate: ", error);
            return Promise.reject("Token expired, Please refresh the page and login via metamask again!");
        }
    }
    async checkWalletConnected() {
        try {
            let web3;
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
            } else if (window.web3) {
                web3 = new Web3(window.web3.currentProvider);
            } else {
                throw `No Wallet Detected! Please Add Metamask Wallet from here "https://metamask.io/"`
            }
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: CHAIN_ID,
                    chainName: CHAIN_NAME,
                    nativeCurrency: {
                        name: CHAIN_NAME,
                        symbol: 'MATIC',
                        decimals: 18
                    },
                    rpcUrls: [POLYGON_RPC_URL],
                    blockExplorerUrls: [`${POLYGON_SCAN_LINK}/`]
                }]
            })
            const addr = await web3.eth.getAccounts();
            if (addr.length < 1) throw "not connected";
            let wid = localStorage.getItem("wallet_id");
            let sig = localStorage.getItem("signature");
            let token = localStorage.getItem("access_token");
            if (!token || !wid || !sig) throw "value missing";
            if (addr[0] !== wid) throw "wallet id mis-match";
            return { wallet_id: addr[0], signature: sig };
        } catch (error) {
            localStorage.clear();
            return Promise.reject(error || "Something went wrong! Login Again.");
        }
    }
}

// await window.ethereum.request({
//     method: 'wallet_switchEthereumChain',
//     params: [{ chainId: '0x89' }], // chainId must be in hexadecimal numbers
//   });