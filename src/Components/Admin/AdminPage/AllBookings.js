import React, { useContext, useEffect, useState } from "react";
import "../AdminPage/AdminPage.css";
import MyContext from "../../Context";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const AllBookings = () => {
  var { actions, submittedTrips } = useContext(MyContext);
  const [mounted, setMounted] = useState(true);
  console.log(submittedTrips);
  var navigate = useNavigate();
  var handleClick = (id) => {
    actions.getAdminTripById(id);
    navigate(`/admin/${id}`);
  };
  const getTripData = async () => {
    await actions.getAllSubmittedTrips();
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
    <div>
      
      <div className="container m-auto">
        <div className="flex gap-[20px] justify-evenly">
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
              .sort((a, b) => {
                return b.data.submittedDate - a.data.submittedDate;
              })
              .map((trip) => {
                var submittedDate = new Date(
                  trip.data?.submittedDate
                ).toLocaleDateString();
                return (
                  <div
                    className="mt-2 w-[100%] flex justify-evenly gap-5  p-4 rounded-lg shadow-[0.04rem_0.06rem_0.4rem_rgba(0,0,0,0.17)] overflow-hidden mb-2 border border-[rgba(80,80,80,0.534)] cursor-pointer"
                    onClick={() => {
                      handleClick(trip.id);
                    }}
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
  );
};

export default AllBookings;
