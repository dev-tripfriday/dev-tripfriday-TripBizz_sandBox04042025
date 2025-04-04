import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faFileInvoice,
  faHouseChimney,
  faSearch,
  faUsers,
  faUser,
  faStarHalf,
  faStar,
  faIndianRupeeSign,
  faArrowUpRightFromSquare,
  faPlus,
  faPencil,
  faUpload,
  faUtensils,
  faCheckCircle,
  faBan,
  faGear,
  faLandmark,
  faBars,
  faRightFromBracket,
  faArrowUpFromBracket,
  faSatelliteDish,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./SideNav.css";
import MyContext from "../../Context";

const SideNav = () => {
  var { actions } = useContext(MyContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const name = pathname.split("/")[1];
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  var logOut = () => {
    actions.signOut();
    navigate("/login");
  };
  return (
    <div
      className={`adminPage-sideNav-block ${isCollapsed ? "!w-[70px]" : ""}`}
    >
      <div className="adminPage-sideNav-header">
        <div
          className={`adminPage-sideNav-logo ${isCollapsed ? "!text-sm" : ""}`}
        >
          {isCollapsed ? "TB" : "Tripbizz"}
        </div>
        <button onClick={toggleSidebar} className="adminPage-sideNav-toggle ">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className="adminPage-sideNav-content">
        <div className="adminPage-sideNav-links">
          <span
            onClick={() => navigate("/bookings")}
            style={{
              color: name === "bookings" ? "#000" : "#94D2BD",
              backgroundColor: name === "bookings" ? "#94D2BD" : undefined,
            }}
          >
            <FontAwesomeIcon
              icon={faHouseChimney}
              className="adminPage-sideNav-icon"
            />
            {!isCollapsed && "Bookings"}
          </span>
          <span
            onClick={() => navigate("/admin")}
            style={{
              color: name === "admin" ? "#000" : "#94D2BD",
              backgroundColor: name === "admin" ? "#94D2BD" : undefined,
            }}
          >
            <FontAwesomeIcon
              icon={faSatelliteDish}
              className="adminPage-sideNav-icon"
            />
            {!isCollapsed && "Offline Requests"}
          </span>
          <span
            onClick={() => navigate("/users")}
            style={{
              color: name === "users" ? "#000" : "#94D2BD",
              backgroundColor: name === "users" ? "#94D2BD" : undefined,
            }}
          >
            <FontAwesomeIcon
              icon={faUsers}
              className="adminPage-sideNav-icon"
            />
            {!isCollapsed && "Users"}
          </span>
          <span
            onClick={() => navigate("/flightsetting")}
            style={{
              color: name === "flightsetting" ? "#000" : "#94D2BD",
              backgroundColor: name === "flightsetting" ? "#94D2BD" : undefined,
            }}
          >
            <FontAwesomeIcon
              icon={faArrowUpFromBracket}
              className="adminPage-sideNav-icon"
            />
            {!isCollapsed && "Uploads"}
          </span>
          <span
            onClick={() => navigate("/commissionsetting")}
            style={{
              color: name === "commissionsetting" ? "#000" : "#94D2BD",
              backgroundColor:
                name === "commissionsetting" ? "#94D2BD" : undefined,
            }}
          >
            <FontAwesomeIcon icon={faGear} className="adminPage-sideNav-icon" />
            {!isCollapsed && "Commission Setting"}
          </span>
          {/* <span
            onClick={() => navigate("/report")}
            style={{
              color: name === "report" ? "#000" : "#94D2BD",
              backgroundColor: name === "report" ? "#94D2BD" : undefined,
            }}
          >
            <FontAwesomeIcon
              icon={faFileInvoice}
              className="adminPage-sideNav-icon"
            />
            {!isCollapsed && "Report"}
          </span> */}
          <span
            onClick={() => navigate("/billing")}
            style={{
              color: name === "billing" ? "#000" : "#94D2BD",
              backgroundColor: name === "billing" ? "#94D2BD" : undefined,
            }}
          >
            <FontAwesomeIcon
              icon={faLandmark}
              className="adminPage-sideNav-icon"
            />
            {!isCollapsed && "Billing Accounts"}
          </span>
          <span
            onClick={logOut}
            style={{
              color: name === "login" ? "#000" : "#94D2BD",
              backgroundColor: name === "login" ? "#94D2BD" : undefined,
            }}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="adminPage-sideNav-icon"
            />
            {!isCollapsed && "Logout"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
