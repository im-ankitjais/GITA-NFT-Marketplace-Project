import React, { useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import "./Giveaway.css";
import Bg from "../../assets/giveBg.jpg";
import CancelIcon from "../../assets/cancel.png";
const GiveawayModal = ({ giveawayModal, setGiveawayModal, giveawaySubmit }) => {
  const handleClose = () => {
    setGiveawayModal({
      ...giveawayModal,
      loading: false,
      show: false,
      to: "",
      nft: null,
    });
  };
  // const submitGiveaway = async (e) => {
  //   e.preventDefault();
  //   if (giveawayContext.loading) return;
  //   try {
  //     setGiveawayContext({
  //       ...giveawayContext,
  //       loading: true,
  //     });
  //     if (!username) throw "Username required.";
  //     if (
  //       !giveawayContext.nft &&
  //       !giveawayContext.nft.mid &&
  //       !giveawayContext.nft.itemid
  //     )
  //       throw "Please Select NFT again.";
  //     const uname = username;
  //     const authFor = giveawayContext.for;
  //     const response = await _apiService.authGiveaway(
  //       giveawayContext.nft.mid,
  //       uname
  //     );
  //     if (response.status_code !== 200 && !response.rcvr_wallet_id)
  //       throw "Error in getting user wallet address.";
  //     if (!localStorage.getItem("wallet_id") || !response.rcvr_wallet_id)
  //       throw "Wallet Data Missing";
  //     let sender_wallet_id = localStorage.getItem("wallet_id");
  //     let rcvr_wallet_id = response.rcvr_wallet_id;
  //     let txHash = null;
  //     if (authFor == "owned") {
  //       txHash = await _nftService.giveawayOwnedNft(
  //         sender_wallet_id,
  //         rcvr_wallet_id,
  //         giveawayContext.nft.tokenid,
  //         setLoadingShow,
  //         setTexts,
  //         giveawayContext.nft.mid
  //       );
  //     } else if (authFor == "onSale") {
  //       txHash = await _nftService.giveawayOnSellNft(
  //         giveawayContext.nft.itemid,
  //         rcvr_wallet_id,
  //         setLoadingShow,
  //         setTexts,
  //         giveawayContext.nft.mid
  //       );
  //     }
  //     // await _apiService.updateGiveawayDetail(
  //     //   giveawayContext.nft.mid,
  //     //   uname,
  //     //   txHash,
  //     //   0
  //     // );
  //     setGiveawayContext({
  //       ...giveawayContext,
  //       show: false,
  //       nft: null,
  //       for: "",
  //       loading: false,
  //     });
  //     toast("NFT Giveaway Successful!", { type: "success" });
  //     window.location.reload();
  //   } catch (error) {
  //     setGiveawayContext({
  //       ...giveawayContext,
  //       loading: false,
  //     });
  //     toast(error || "Something went wrong!", { type: "error" });
  //   }
  // };
  return (
    <Modal
      show={giveawayModal.show}
      onHide={() => {
        handleClose();
      }}
      style={{ backgroundColor: "none" }}
    >
      <Modal.Body>
        <section className="jumbotron breadcumb no-bg">
          <div>
            <div className="container" style={{ position: "relative" }}>
              <img
                onClick={handleClose}
                className="cancel"
                src={CancelIcon}
                alt="Cancel"
              />
              <div className="row align-items-center px-0">
                <div className="col-12 m-auto px-0">
                  <div className="box-login">
                    <h3 className="mb10">Giveaway NFT</h3>
                    <form
                      name="contactForm"
                      id="contact_form"
                      className="form-border"
                    >
                      <div className="field-set">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          Enter the wallet address of the receiver:
                        </label>
                        <input
                          value={giveawayModal.to}
                          onChange={(e) =>
                            setGiveawayModal({
                              ...giveawayModal,
                              to: e.target.value,
                            })
                          }
                          type="text"
                          name="walletAddress"
                          id="walletAddress"
                          className="form-control"
                          placeholder="0x...."
                        />
                      </div>
                      <p>
                        Note: You will lose the ownership of this NFT once you
                        do a giveaway!
                      </p>
                      <div className="field-set">
                        <div
                          className="submit_btn"
                          onClick={(e) => giveawaySubmit(e)}
                        >
                          {"Confirm Giveaway"}
                        </div>
                      </div>
                      <div className="clearfix"></div>
                      <div className="spacer-half"></div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
};

export default GiveawayModal;
