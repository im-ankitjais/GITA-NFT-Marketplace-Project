import React, { useContext } from "react";
import styled, { css } from "styled-components";
import PostService from "../../../lib/services/postService";
import MaticIcon from "../../../assets/matic.png";
const _postService = new PostService();
const UnstyledOffersTableRow = (props) => {
  const { offerId, tokenId, itemId, price, from, loggedUser, currentOwner } =
    props;
  const action =
    currentOwner === loggedUser
      ? "Reject"
      : loggedUser === from
      ? "Cancel Offer"
      : "";
  const action2 = currentOwner === loggedUser ? "Accept" : "";
  const dOffer = async (e) => {
    try {
      e.preventDefault();
      await _postService.deleteOffer(tokenId, offerId);
    } catch (error) {
      if (typeof error === "string") {
      } else {
      }
      console.log(error);
    }
  };
  const acceptOffer = async (e) => {
    try {
      e.preventDefault();
      await _postService.acceptOffer(tokenId, offerId);
    } catch (error) {
      if (typeof error === "string") {
      } else {
      }
      console.log(error);
    }
  };
  return (
    <tr className={props.className}>
      <td className="offer-cprice">
        <img src={MaticIcon} alt="Matic icon" />
        <span>{price}</span> MATIC
      </td>
      <td className="from-user">
        @<span>{`${from.slice(0, 8)}...`}</span>
      </td>
      <td className="offer-action">
        {action2 && (
          <span className="accept-btn" onClick={(e) => acceptOffer(e)}>
            {action2}
          </span>
        )}
        {action && (
          <span className="reject-btn" onClick={(e) => dOffer(e)}>
            {action}
          </span>
        )}
      </td>
    </tr>
  );
};

const OffersTableRow = styled(UnstyledOffersTableRow)`
  & {
    .from-user {
      color: #f3d84e;
    }
  }
  .accept-btn {
    color: green;
    &:hover {
      background-color: green;
      color: white;
    }
  }
  .reject-btn {
    color: red;
    &:hover {
      background-color: red;
      color: white;
    }
  }
  .offer-cprice {
    display: flex;
    align-items: center;
    img {
      width: 15px;
      margin-right: 12px;
    }
    span {
      margin-right: 4px;
    }
  }
  .offer-cprice,
  .offer-price,
  .from-user {
    font-size: 15px;
    & > span {
      font-weight: bold;
    }
  }
  .from-user > span,
  .offer-action > span {
    cursor: pointer;
  }
  .from-user:hover {
    text-decoration: underline;
  }
  .offer-action > span {
    border-radius: 8px;
    font-size: 15px;
    padding: 4px 8px;
  }
`;

export default OffersTableRow;
