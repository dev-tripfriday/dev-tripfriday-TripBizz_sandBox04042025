import React, { useContext, useEffect, useState } from "react";
import "./MyTrips.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import MyContext from "../../Context";
import LoadingProg from "../../Loading/LoadingProg";
import Navbar from "../../Flights/FlightSearch/Navbar";
import Popup from "../../Popup";

const MyTrips = () => {
  var { actions, userTripStatus, userId, noOfPages } = useContext(MyContext);
  const navigate = useNavigate();
  var [currentPage, setCurrentPage] = useState(1);
  var [trips, setTrips] = useState();
  const [newTripPopup, setNewTripPopup] = useState(false);
  const [tripname, settripname] = useState("");
  //var [loading, setLoading] = useState(true)
  const handleClick = async () => {
    setNewTripPopup(true);
    // var newtripId = await actions.createTrip(userTripStatus);
    // navigate(`${newtripId}`);
  };
  const handleSubmitTrip = async () => {
    if (tripname === "") return;
    var newtripId = await actions.createTrip(tripname);
    navigate(`${newtripId}`);
  };
  useEffect(() => {
    // var fetchData = async () => {
    //     await actions.getAllTrips(userId)
    //     console.log();
    // }
    // fetchData();
    // //setLoading(false)
    setTrips(userTripStatus);
    return () => {
      setTrips([]);
    };
  }, [userTripStatus]);
  var getTime = (seconds) => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    var dateString = `${month} ${dayOfWeek}`;
    return dateString;
  };

  if (userTripStatus.tripLoading) {
    return (
      <LoadingProg
        condition={userTripStatus.tripLoading}
        loadingText="Getting Trips..."
        progEnd={userTripStatus.tripLoading}
        progTime={20}
      />
      // <>Loading...</>
    );
  }

  const handlePageChange = async (pageNumber) => {
    await actions.setOffset(pageNumber * 10);
    setCurrentPage(pageNumber);
    await actions.getLastDoc();
  };

  var renderPagination = () => {
    const pagination = [];

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(noOfPages, startPage + 4);

    if (noOfPages > 5 && currentPage > 2) {
      if (currentPage + 2 > noOfPages) {
        startPage = noOfPages - 4;
      } else {
        startPage = currentPage - 2;
      }
      endPage = Math.min(noOfPages, startPage + 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(
        <button
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pagination;
  };

  return (
    <>
      <Popup condition={newTripPopup} close={() => setNewTripPopup(false)}>
        <h1 className="font-bold text-[20px]">Enter Trip name</h1>

        <textarea
          required={true}
          cols={40}
          rows={3}
          className="w-[90%] md:w-[50%] border border-solid border-black rounded-md py-1 px-1 placeholder:text-[17px]"
          placeholder="Enter trip name"
          value={tripname}
          onChange={(e) => settripname(e.target.value)}
        />
        <br />
        <button
          className="bg-black text-white rounded-lg  px-3 py-1 block m-auto"
          onClick={handleSubmitTrip}
        >
          Create
        </button>
      </Popup>
      <Navbar />
      <div className="tripsPage-block">
        <div className="tripsPage-header">My Trips</div>
        <div className="tripsPage-container">
          <div className="tripsPage-createTrip">
            <button onClick={handleClick}>
              Create New Trip&nbsp;&nbsp;
              <FontAwesomeIcon icon={faPlus} style={{ color: "#0d0d0d" }} />
            </button>
          </div>
        </div>
      </div>
      {trips
        ? trips?.userTrips
            ?.slice(0, 10)
            .sort((a, b) => {
              var aTime = new Date(a?.data?.date?.seconds * 1000);
              var bTime = new Date(b?.data?.date?.seconds * 1000);
              return bTime - aTime;
            })
            ?.map((trip) => {
              console.log(trip);
              var date = getTime(trip?.data?.date?.seconds);
              return (
                <div
                  className="tripsPage-trip-card"
                  onClick={() => {
                    navigate(`/trips/${trip.id}`, {
                      state: { userId: userId },
                    });
                  }}
                >
                  <div className="tripsPage-trip-card-header">
                    <span>{trip?.data?.name}</span>
                    <div className="tripsPage-trip-date">
                      <span>created on:</span>
                      <p>{date}</p>
                    </div>
                  </div>
                  <div className="tripsPage-trip-list">
                    {trip?.hotels?.length > 0 ? (
                      <div className="tripsPage-trip-hotel">
                        Hotels - {trip.hotels.length}
                      </div>
                    ) : null}
                    {trip?.flights?.length > 0 ? (
                      <div className="tripsPage-trip-hotel">
                        Flights - {trip?.flights?.length}
                      </div>
                    ) : null}
                    {trip?.data?.cabs?.length > 0 ? (
                      <div className="tripsPage-trip-hotel">
                        Cabs - {trip?.data?.cabs?.length}
                      </div>
                    ) : null}
                    {trip?.data?.bus?.length > 0 ? (
                      <div className="tripsPage-trip-hotel">
                        Buses - {trip?.data?.bus?.length}
                      </div>
                    ) : null}
                    {trip?.data?.otherBookings?.length > 0 ? (
                      <div className="tripsPage-trip-hotel">
                        Other - {trip?.data?.otherBookings?.length}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
        : null}
      <div className="tripsPage-pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>
            &laquo;
          </button>
        )}
        {renderPagination()}
        {currentPage < noOfPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>
            &raquo;
          </button>
        )}
      </div>
    </>
  );
};

export default MyTrips;
