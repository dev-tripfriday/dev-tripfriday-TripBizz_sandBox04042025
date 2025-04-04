import {
  faCreditCard,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import "./Wallet.css";
import MyContext from "../Context";

const Left = ({ selectedTab, setSelectedTab }) => {
  const { actions, userAccountDetails } = useContext(MyContext);
  return (
    <div className="left-block !w-[100%] lg:!w-[25%]">
      <div className="left-logo">
        <span>
          <FontAwesomeIcon icon={faUser} />
        </span>
        <div className="left-logo-details">
          <span>{userAccountDetails.firstName}</span>
          <span>{userAccountDetails.email}</span>
        </div>
      </div>
      <div className="left-content">
        <div className="left-links flex gap-2 md:flex-col p-[10px]">
          <div
            onClick={() => {
              setSelectedTab("wallet");
            }}
            className={`${
              selectedTab === "wallet" ? "active" : ""
            } p-[7px] px-3 flex items-center gap-2 cursor-pointer`}
          >
            <FontAwesomeIcon icon={faWallet} className="left-icon" />
            &nbsp;&nbsp;Load Wallet
          </div>
          <div
            onClick={() => {
              setSelectedTab("transactions");
            }}
            className={`${
              selectedTab === "transactions" ? "active" : ""
            } p-[7px] px-3 flex items-center gap-2 cursor-pointer`}
          >
            <FontAwesomeIcon
              icon={faCreditCard}
              style={{ "--fa-secondary-opacity": "1" }}
              className="left-icon"
            />
            &nbsp;&nbsp;Transactions
          </div>
        </div>
      </div>
    </div>
  );
};

export default Left;
