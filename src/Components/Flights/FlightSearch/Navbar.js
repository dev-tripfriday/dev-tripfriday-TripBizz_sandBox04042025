import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyContext from "../../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import "./FlightSearch.css";
import head from "../../Home/assets/trip bizz-04.png";

const Navbar = () => {
  var { actions, userAccountDetails } = useContext(MyContext);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  var navigate = useNavigate();
  var handleProfile = () => {
    setIsNavExpanded(false);
    navigate("/profile");
  };
  var handleChangePassword = () => {
    setIsNavExpanded(false);
    navigate("/changepassword");
  };
  var signOut = async () => {
    await actions.signOut();
  };
  const handleTripClick = async () => {
    actions.setRes();
    navigate("/trips");
    //await actions.getAllTrips(userId)
    await actions.getLastDoc();
  };

  const handleImage = () => {
    actions.setSelectedId(null);
    actions.setRes();
    navigate("/home/flights");
  };

  const handleRole = () => {
    actions.setRes();
    navigate("/roles");
  };

  return (
    <>
      <div className="flightSearch-navbar-mobile">
        <div className="flightSearch-navbar-logo" onClick={handleImage}>
          <img
            src={head}
            alt="Tripbizz logo"
            className="object-cover h-[60px] w-[240px]"
          />
        </div>
        <div className="flightSearch-navbar-buttons ml-auto">
          <button
            onClick={handleTripClick}
            className="text-[12px] md:text-[16px]"
          >
            My Trips
          </button>
          <button
            onClick={() => {
              navigate("/wallet");
            }}
            className="text-[12px] md:text-[16px]"
          >
            &nbsp;
            <FontAwesomeIcon icon={faWallet} />
            &nbsp; &nbsp;
            <FontAwesomeIcon icon={faIndianRupeeSign} />
            {Math.ceil(userAccountDetails?.balance).toLocaleString()}
          </button>
          <button
            onClick={() => {
              setIsNavExpanded(!isNavExpanded);
            }}
            className="text-[12px] md:text-[16px]"
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
        <div className="flightSearch-navbar-menu">
          <div
            className={
              !isNavExpanded
                ? "flightSearch-navbar-mobile-list"
                : "flightSearch-navbar-mobile-list show"
            }
          >
            <div
              className="flightSearch-navbar-list-item"
              onClick={handleProfile}
            >
              Profile
            </div>
            <div
              className="flightSearch-navbar-list-item"
              onClick={handleChangePassword}
            >
              Change Password
            </div>
            <div className="flightSearch-navbar-list-item" onClick={handleRole}>
              Roles and Approval
            </div>
            <div className="flightSearch-navbar-list-item" onClick={signOut}>
              Logout
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
