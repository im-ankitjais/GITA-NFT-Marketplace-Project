import React from "react";
import styled from "styled-components";
import OffersTableRow from "./OffersTableRow";
import { Table } from "react-bootstrap";
import PostService from "../../../lib/services/postService";

const _postService = new PostService();
const OffersTableUnstyled = (props) => {
  const handleRejectAllOffers = async (e) => {
    e.preventDefault();
    try {
      await _postService.deleteAllOffers(props.offers[0].tokenId);
    } catch (error) {
      // toast("Error. Try after sometime", {type: "error"})
      console.log(error);
    }
  };
  return (
    <div className={props.className}>
      <div className="top-header">
        <h4>Current Offers on this NFT</h4>
        {props.currentOwner === props.loggedUser && (
          <button onClick={(e) => handleRejectAllOffers(e)}>Reject All</button>
        )}
      </div>
      <Table responsive="xl" variant="dark" className="table" hover bordered>
        <thead className="thead">
          <tr>
            <th>Price</th>
            <th>From</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {props.offers.map((offer, index) => {
            return (
              <OffersTableRow
                key={index}
                offerId={offer.offerId}
                tokenId={offer.tokenId}
                price={offer.price}
                from={offer.from}
                loggedUser={props.loggedUser}
                currentOwner={props.currentOwner}
                itemid={props.itemId}
              />
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
const OffersTable = styled(OffersTableUnstyled)`
  & {
    border-top: solid 1px rgb(60, 60, 60);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.3);
    padding: 24px;
    max-width: 1024px;
    margin: auto;
    border-radius: 12px;
  }
  & > .top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    & > button {
      border: none;
      border-radius: 8px;
      padding: 4px 16px;
      color: white;
      font-weight: 500;
      background-color: rgb(230, 0, 0);
      &:hover {
        background-color: rgb(150, 0, 0);
        box-shadow: 0px 1px 1px 1px black;
      }
    }
  }
  & .table {
    border-radius: 16px;
  }
  & .thead {
    color: white;
  }
`;

export default OffersTable;
