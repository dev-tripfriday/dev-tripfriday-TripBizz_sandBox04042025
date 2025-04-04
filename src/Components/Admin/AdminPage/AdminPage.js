import React, { useContext, useEffect, useState } from "react";
import "./AdminPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import MyContext from "../../Context";
import { useNavigate } from "react-router-dom";
import SideNav from "../SideNav/SideNav";

const AdminPage = () => {
  var { actions, submittedTrips } = useContext(MyContext);
  const [mounted, setMounted] = useState(true);
  var navigate = useNavigate();
  var [currentTab, setCurrentTab] = useState("New Request");
  var logOut = () => {
    actions.signOut();
    navigate("/login");
  };

  var handleClick = (id) => {
    actions.getAdminTripById(id);
    navigate(`/admin/${id}`);
  };
  const getTripData = async () => {
    await actions.getSubmittedTrips(20);
  };
  useEffect(() => {
    if (mounted) {
      var fetchData = async () => {
        await getTripData();
      };
      fetchData();
    }
    return () => {
      setMounted(false);
    };
  }, [submittedTrips]);

  return (
    <div className="adminPage-block">
      <SideNav />
      <div className="adminPage-main-block">
        <div className="adminPage-main-header">
          <div className="adminPage-main-topHeader">
            <div className="adminPage-main-search">
              <div className="adminPage-main-input">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="adminPage-main-input-icon"
                />
                <input type="text" placeholder="Search for trips" />
              </div>
              <div className="adminPage-main-button">
                <button>Filter</button>
              </div>
            </div>
            <div className="adminPage-main-notifications">
              <FontAwesomeIcon
                icon={faBell}
                className="adminPage-main-notifications-icon"
              />
            </div>
            <div className="adminPage-main-logout">
              {/* <button onClick={logOut}>Logout</button> */}
            </div>
          </div>
          <div className="flex items-center">
            <div className="adminPage-main-tabs">
              <div
                className={
                  currentTab === "New Request"
                    ? "adminPage-main-tabs-list adminPage-main-tabs-list-active"
                    : "adminPage-main-tabs-list"
                }
                onClick={() => {
                  setCurrentTab("New Request");
                }}
              >
                New Request
              </div>
              {/* <div
              className={
                currentTab === "Booking In Progress"
                  ? "adminPage-main-tabs-list adminPage-main-tabs-list-active"
                  : "adminPage-main-tabs-list"
              }
              onClick={() => {
                setCurrentTab("Booking In Progress");
              }}
            >
              Booking In Progress
            </div> */}
              <div
                className={
                  currentTab === "Booked"
                    ? "adminPage-main-tabs-list adminPage-main-tabs-list-active"
                    : "adminPage-main-tabs-list"
                }
                onClick={() => {
                  setCurrentTab("Booked");
                }}
              >
                Booked
              </div>
            </div>
            <div
              className="cursor-pointer underline"
              onClick={() => {
                navigate("/allbookings");
              }}
            >
              <p>See all Bookings</p>
            </div>
          </div>
        </div>
        <div className="adminPage-main-content">
          <div className="adminPage-main-content-header">
            <div className="adminPage-main-header-names-name">Client Name</div>
            <div className="adminPage-main-header-names-name">Trip Name</div>
            <div className="adminPage-main-header-names-sdate">
              Submitted Date
            </div>
            <div className="adminPage-main-header-names-num">
              Flights/Hotels/Cabs/Bus/Other
            </div>
            <div className="adminPage-main-header-names-email">Email</div>
          </div>
          {submittedTrips
            ? submittedTrips
                .filter((item) => item.status === currentTab)
                .sort((a, b) => {
                  return b.data.submittedDate - a.data.submittedDate;
                })
                .map((trip, r) => {
                  var submittedDate = new Date(
                    trip.data?.submittedDate
                  ).toLocaleDateString();
                  return (
                    <div
                      className="adminPage-main-content-items"
                      onClick={() => {
                        handleClick(trip.id);
                      }}
                      key={`r_${r + 1}`}
                    >
                      <div className="adminPage-main-content-item-name">
                        <FontAwesomeIcon icon={faUser} />
                        &nbsp;&nbsp;
                        {trip?.data?.userDetails?.firstName}
                      </div>
                      <div className="adminPage-main-content-item-sdate">
                        {trip?.data?.tripName}
                      </div>
                      <div className="adminPage-main-content-item-sdate">
                        {submittedDate}
                      </div>
                      <div className="adminPage-main-content-item-num">
                        {trip.data.flights ? trip.data.flights.length : 0}/
                        {trip.data.hotels ? trip.data.hotels.length : 0}/
                        {trip.data.cabs ? trip.data.cabs.length : 0}/
                        {trip.data.bus ? trip.data.bus.length : 0}/
                        {trip.data.otherBookings
                          ? trip.data.otherBookings.length
                          : 0}
                      </div>
                      <div className="adminPage-main-content-item-email">
                        {trip?.data?.userDetails?.email}
                      </div>
                    </div>
                  );
                })
            : null}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
