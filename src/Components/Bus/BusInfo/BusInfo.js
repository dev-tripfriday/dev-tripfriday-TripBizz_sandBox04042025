import React, { useContext, useEffect, useState } from "react";
import "./BusInfo.css";
import Navbar from "../../Flights/FlightSearch/Navbar";
import MyContext from "../../Context";
import LoadingProg from "../../Loading/LoadingProg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faChevronUp,
  faIndianRupeeSign,
  faLeftLong,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { format } from "date-fns";
import Popup from "../../Popup";
import { useNavigate, useParams } from "react-router-dom";
import seatImage from "../../Home/assets/busSeatingI (1).png";
import sleeperBed from "../../Home/assets/sleeperbed.png";
import { PiDeviceMobileSpeaker } from "react-icons/pi";
import sitterSelected from "../../Home/assets/sitterSelected.png";
import seatImageSelected from "../../Home/assets/selectedSeat.png";
import sleeperBedBooked from "../../Home/assets/sleeperselected.png";
import sleeperBedSelected from "../../Home/assets/sleeperBedSelected.png";
import { InputLabel, OutlinedInput } from "@mui/material";
import BusSeatLayout from "./BusSeatLayout";
const BusInfo = ({ userAdmin }) => {
  const {
    bookingBus,
    fetchingBusSeat,
    actions,
    adminUserId,
    selectedTripId,
    selectedTrip,
    userTripStatus,
    userId,
    adminUserTrips,
    busDate,
    destDetails,
    NoofBusPassengers,
    BusOperatorName,
    busService,
    selectedSeats,
  } = useContext(MyContext);
  const { userFromAdmin, tripFromAdmin } = useParams();
  const [boardingPoint, setBoardingPoint] = useState("");
  const [droppingPoint, setDroppingPoint] = useState("");
  const [selectedSeat, setSelectedSeat] = useState([]);
  var [submitIsOpen, setSubmitIsOpen] = useState(false);
  var [activeTab, setActiveTab] = useState("tab1");
  var [adminSubmitIsOpen, setAdminSubmitIsOpen] = useState(false);
  var [fareIsOpen, setFareIsOpen] = useState(false);
  const [cancellation, setCancellation] = useState(false);
  const [busDropError, setBusDropError] = useState("");
  const [busBoardError, setBusBoardError] = useState("");
  const [passengerError, setPassengerError] = useState("");
  const [dropError, setDropError] = useState({
    boardingPoint: "",
    droppingPoint: "",
  });
  const navigate = useNavigate();
  console.log(bookingBus);
  const date = new Date(busDate);

  var myStr = destDetails?.cityName;
  const formattedDate = `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getDate()}`;
  const combinedString = `${myStr}_${formattedDate}`;
  var [defaultInput, setDefaultInput] = useState(combinedString);
  const seatData =
    bookingBus?.busSeatLayout?.busResult?.GetBusSeatLayOutResult
      ?.SeatLayoutDetails?.SeatLayout?.SeatDetails.length > 0
      ? bookingBus?.busSeatLayout?.busResult?.GetBusSeatLayOutResult
          ?.SeatLayoutDetails?.SeatLayout?.SeatDetails
      : [];

  const lowerDeckData = seatData?.filter(
    (row) => !row.some((seat) => seat.IsUpper)
  );
  const upperDeckData = seatData?.filter((row) =>
    row.some((seat) => seat.IsUpper)
  );
  const lowerDeck = lowerDeckData.flat(lowerDeckData.length);
  const upperDeck = upperDeckData.flat(upperDeckData.length);
  var handleInputChange = (e) => {
    setDefaultInput(e.target.value);
  };
  var [loading, setLoading] = useState(false);
  var getTime = (seconds) => {
    const timestampInSeconds = seconds;
    const timestampInMilliseconds = timestampInSeconds * 1000;
    const date = new Date(timestampInMilliseconds);
    return date;
  };

  const toggleUp = (e, id) => {
    actions.toggleUp(e, id, fareIsOpen);
    setFareIsOpen((prev) => !prev);
  };

  var handleAddToTrip = async () => {
    setLoading(true);
    if (boardingPoint === "") {
      setBusBoardError("Select boarding point");
    } else if (droppingPoint === "") {
      setBusDropError("Select dropping point");
    } else {
      var newtripid = await actions.createNewTrip(
        defaultInput,
        "bus",
        bookingBus
      );
      navigate(`/trips/${newtripid}`, { state: { userId: userId } });
      setLoading(false);
      await actions.getLastDoc();
    }
  };
  var addtoTrip = async (id) => {
    //actions.setFlightSession(true);

    await actions.editTripById(id, bookingBus, "bus");
    //await actions.getAllTrips(userId)
    await actions.getLastDoc();
  };
  var addBusFromUserByAdmin = async () => {
    await actions.editTripById(tripFromAdmin, bookingBus, "bus", userFromAdmin);
  };
  var handleAdminAddToTrip = async () => {
    setLoading(true);
    var newtripid = await actions.createAdminNewtrip(
      defaultInput,
      "bus",
      bookingBus,
      adminUserId
    );
    navigate(`/users/${adminUserId}/trips/${newtripid}`, {
      state: { userId: userId },
    });
    setLoading(false);
  };

  var adminAddToTrip = async (id) => {
    await actions.editTripByIdAdmin(id, bookingBus, "bus", adminUserId);
  };

  const handleBoardingChange = (e) => {
    const selectedIndex = e.target.value;
    const selectedPickup =
      bookingBus?.busBoardingDetails?.busResult?.GetBusRouteDetailResult
        ?.BoardingPointsDetails[selectedIndex];
    console.log(selectedPickup);
    setBoardingPoint(selectedPickup);
    actions.setBusBookDetails(selectedPickup, "boardingPoint");
    setBusBoardError("");
  };
  const handleDroppingChange = (e) => {
    const selectedIndex = e.target.value;
    const selectedPickup =
      bookingBus?.busBoardingDetails?.busResult?.GetBusRouteDetailResult
        ?.DroppingPointsDetails[selectedIndex];
    console.log(selectedPickup);
    setDroppingPoint(selectedPickup);
    actions.setBusBookDetails(selectedPickup, "droppingPoint");
    setBusDropError("");
  };

  if (fetchingBusSeat) {
    return (
      <LoadingProg
        condition={fetchingBusSeat}
        loadingText={"Searching buses"}
        progEnd={fetchingBusSeat}
        progTime={25}
      />
      //<>Loading...</>
    );
  }

  return (
    <>
      <Popup condition={submitIsOpen} close={() => setSubmitIsOpen(false)}>
        <div className="hotelBook-createNew">
          <div className="hotelBook-submit">
            {activeTab === "tab1" ? (
              <div className="hotelBook-submitTrip">
                <div className="tripsPage-createTrip">
                  <button onClick={() => setActiveTab("tab2")}>
                    Create New Trip&nbsp;&nbsp;
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ color: "#0d0d0d" }}
                    />
                  </button>
                </div>
                <div className="tripsPage-createTrip-add">
                  <div className="tripsPage-change">Or</div>
                  <span className="tripsPage-createTrip-header">
                    Select an existing trip
                  </span>
                  {userTripStatus
                    ? userTripStatus?.userTrips
                        .sort((a, b) => {
                          var aTime = new Date(a?.data?.date?.seconds * 1000);
                          var bTime = new Date(b?.data?.date?.seconds * 1000);
                          return bTime - aTime;
                        })
                        ?.map((trip) => {
                          var date = getTime(trip?.data?.date?.seconds);
                          var dateStr = date.toString().slice(4, 10);
                          return (
                            <div
                              className="hotelBook-trip-card"
                              onClick={async () => {
                                addtoTrip(trip.id);
                                navigate(`/trips/${trip.id}`, {
                                  state: { userId: userId },
                                });
                                // window.location.reload();
                              }}
                            >
                              <span>{trip.data.name}</span>
                              <p>{dateStr}</p>
                            </div>
                          );
                        })
                    : null}
                </div>
              </div>
            ) : null}
            {activeTab === "tab2" ? (
              <div className="hotelBook-addBtn">
                <button onClick={() => setActiveTab("tab1")}>
                  <FontAwesomeIcon icon={faLeftLong} />
                </button>
                <div className="hotelBook-add">
                  <span>Enter new trip Name</span>
                  <textarea
                    id="multiline-input"
                    name="multiline-input"
                    value={defaultInput}
                    onChange={handleInputChange}
                    placeholder="Enter the name of your trip"
                  />

                  {/* {loading ? (
                    <button className="spin">
                      <div className="spinner"></div>
                    </button>
                  ) : (
                    <button onClick={handleAddToTrip}>Add to trip</button>
                  )} */}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Popup>
      <Popup
        condition={adminSubmitIsOpen}
        close={() => setAdminSubmitIsOpen(false)}
      >
        <div className="hotelBook-createNew">
          <div className="hotelBook-submit">
            {activeTab === "tab1" ? (
              <div className="hotelBook-submitTrip">
                <div className="tripsPage-createTrip">
                  <button onClick={() => setActiveTab("tab2")}>
                    Create New Trip&nbsp;&nbsp;
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ color: "#0d0d0d" }}
                    />
                  </button>
                </div>
                <div className="tripsPage-createTrip-add">
                  <div className="tripsPage-change">Or</div>
                  <span className="tripsPage-createTrip-header">
                    Select an existing trip
                  </span>
                  {adminUserTrips
                    ? adminUserTrips
                        ?.sort((a, b) => {
                          var aTime = new Date(a?.data?.date?.seconds * 1000);
                          var bTime = new Date(b?.data?.date?.seconds * 1000);
                          return bTime - aTime;
                        })
                        ?.map((trip) => {
                          var date = getTime(trip?.data?.date?.seconds);
                          var dateStr = date.toString().slice(4, 10);
                          return (
                            <div
                              className="hotelBook-trip-card"
                              onClick={async () => {
                                await adminAddToTrip(trip.id);
                                navigate(
                                  `/users/${adminUserId}/trips/${trip.id}`,
                                  { state: { userId: userId } }
                                );
                              }}
                            >
                              <span>{trip.data.name}</span>
                              <p>{dateStr}</p>
                            </div>
                          );
                        })
                    : null}
                </div>
              </div>
            ) : null}
            {activeTab === "tab2" ? (
              <div className="hotelBook-addBtn">
                <button onClick={() => setActiveTab("tab1")}>
                  <FontAwesomeIcon icon={faLeftLong} />
                </button>
                <div className="hotelBook-add">
                  <span>Enter new trip Name</span>
                  <textarea
                    id="multiline-input"
                    name="multiline-input"
                    value={defaultInput}
                    onChange={handleInputChange}
                    placeholder="Enter the name of your trip"
                  />

                  {/* {loading ? (
                    <button className="spin">
                      <div className="spinner"></div>
                    </button>
                  ) : (
                    <button onClick={handleAdminAddToTrip}>Add to trip</button>
                  )} */}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Popup>
      <Popup
        condition={cancellation}
        close={() => {
          setCancellation(false);
        }}
      >
        <div className="bus-popup-header">Cancellation Details</div>
        <div className="busCancel-popup-block">
          <div className="busCancel-popup-tabs">
            <div className="busCancel-popup-tab">Cancellation Time</div>
            <div className="busCancel-popup-tab">Cancellation Charge</div>
          </div>
          <div className="busCancel-popup-dtls">
            {bookingBus?.bus?.CancellationPolicies?.length > 0 &&
              bookingBus?.bus.CancellationPolicies.map((rule, ru) => {
                var fromDate = new Date(rule.FromDate);
                const fromformattedDate = fromDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                });
                var toDate = new Date(rule.ToDate);
                const toformattedDate = toDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                });
                return (
                  <div className="busCancel-popup-rulesSection">
                    <div className="busCancel-popup-rules">
                      <div className="busCancel-popup-rule">
                        From {fromDate.toLocaleTimeString()},{fromformattedDate}{" "}
                        to {toDate.toLocaleTimeString()},{toformattedDate}
                      </div>
                      <div className="busCancel-popup-rule">
                        {rule.CancellationCharge}%
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Popup>
      <Navbar />
      <div className="busBook-block">
        <div>
          <div className="busInfo-header">
            <div className="busInfo-header-back">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="busInfo-header-back-icon"
                onClick={() => actions.backToBusResPage()}
              />
            </div>
            <div className="flex gap-2 items-center mt-2 flex-wrap md:text-[16px] text-[13px]">
              <p>{bookingBus?.bus?.TravelName},</p>
              <p className="flex items-center gap-1">
                {bookingBus.origin.cityName}
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="busInfo-header-back-icon"
                />
                {bookingBus.destination.cityName}
              </p>
              <p>
                {bookingBus?.bus?.BusType} ,
                {format(bookingBus?.bus?.DepartureTime, "MMM dd, yyyy")},
              </p>
              <p
                className="underline text-red-400 cursor-pointer"
                onClick={() => setCancellation(true)}
              >
                Cancellation
              </p>
            </div>
          </div>
          <div className="busBook-boardingPoints">
            <div className="busBook-boardingPoints-header">
              Select Pickup and Drop Points
            </div>
            <p className="text-red-400 text-[14px]">{passengerError}</p>
            <div className="busBook-boardingPoints-block">
              <div className="busBook-boardingPoint-type">
                <div className="busBook-boardingPoint-type-header">
                  Select Boarding Point
                </div>
                <div className="busBook-boardingPoint-type-block">
                  <p className="text-red-500">{busBoardError}</p>
                  <Select
                    labelId="demo-multiple-chip-label"
                    displayEmpty
                    onChange={(e) => {
                      handleBoardingChange(e);
                    }}
                    size="small"
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      backgroundColor: "#ddd",
                      borderRadius: "0.8rem",
                      fontSize: "12pt",
                      width: "400px",
                      color: "#000",
                    }}
                    input={<OutlinedInput />}
                  >
                    <MenuItem value="" disabled sx={{ color: "#000" }}>
                      Select Boarding Point
                    </MenuItem>
                    {bookingBus?.busBoardingDetails?.busResult
                      ?.GetBusRouteDetailResult?.BoardingPointsDetails?.length >
                      0 &&
                      bookingBus?.busBoardingDetails?.busResult?.GetBusRouteDetailResult?.BoardingPointsDetails?.map(
                        (pickup, index) => {
                          return (
                            <MenuItem
                              key={index}
                              value={index}
                              sx={{ borderBottom: "1px solid gray" }}
                            >
                              {pickup.CityPointLocation}, Time:{" "}
                              {format(pickup.CityPointTime, "hh:mm a")}
                              <br />
                              {pickup.CityPointLandmark}
                            </MenuItem>
                          );
                        }
                      )}
                  </Select>
                </div>
              </div>
              <div className="busBook-boardingPoint-type">
                <div className="busBook-boardingPoint-type-header">
                  Select Dropping Point
                </div>
                <div className="busBook-boardingPoint-type-block">
                  <p className="text-red-500">{busDropError}</p>
                  <Select
                    onChange={(e) => {
                      handleDroppingChange(e);
                    }}
                    size="small"
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      backgroundColor: "#ddd",
                      borderRadius: "0.8rem",
                      fontSize: "12pt",
                      width: "400px",
                    }}
                    input={<OutlinedInput />}
                  >
                    <MenuItem defaultValue={""} disabled>
                      Select Dropping Point
                    </MenuItem>
                    {bookingBus?.busBoardingDetails?.busResult
                      ?.GetBusRouteDetailResult?.DroppingPointsDetails?.length >
                      0 &&
                      bookingBus?.busBoardingDetails?.busResult?.GetBusRouteDetailResult?.DroppingPointsDetails?.map(
                        (pickup, index) => {
                          return (
                            <MenuItem key={index} value={index}>
                              {pickup.CityPointLocation}, Time:{" "}
                              {format(pickup.CityPointTime, "hh:mm a")}
                              <br />
                              {pickup.CityPointLandmark}
                            </MenuItem>
                          );
                        }
                      )}
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div className="busBook-seatLayout">
            <div className="busBook-seatLayout-header">
              Number of Adults: {NoofBusPassengers}
            </div>
            <div className="busBook-seatLayout-header">
              Select Seats{" "}
              <span>
                {selectedSeat.length < NoofBusPassengers && (
                  <span className="text-red-500 text-[13px]">
                    (Please select {NoofBusPassengers} Seats)
                  </span>
                )}
              </span>
            </div>
            <div className="busBook-seatLayout-block flex" id="seatImage-block">
              {/* <div dangerouslySetInnerHTML={{ __html: bookingBus.busSeatLayout.busResult.GetBusSeatLayOutResult.SeatLayoutDetails.HTMLLayout }} /> */}
              {upperDeck.length > 0 ? (
                <div className="upper-block">
                  <div className="upper-block-header">
                    <p>UPPER</p>
                  </div>
                  <div className="upper-block-content relative">
                    <BusSeatLayout deck={upperDeck} />
                  </div>
                </div>
              ) : null}
              {lowerDeck.length > 0 ? (
                <div className="upper-block">
                  <div className="upper-block-header">
                    <p>LOWER</p>
                  </div>
                  <div className="upper-block-content relative">
                    <BusSeatLayout deck={lowerDeck} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* <div className='gg'>
                    <button onClick={() => actions.blockHotelRoom(bookingBus)}>
                        Block ticket
                    </button>
                    <button onClick={async () => {
                        var x = await actions.bookRoom(bookingBus)
                        setBusRes(x)
                        console.log(x);
                    }}>
                        Book Ticket
                    </button>
                    <button onClick={() => { actions.getBookDetails(busRes) }}>
                        Get Book Details
                    </button>
                </div> */}
        <div className="busBook-fare-Mobile">
          <div
            className={
              fareIsOpen
                ? "bus-fare-openDtls bus-fare-openDtls-open"
                : "bus-fare-openDtls"
            }
          >
            <FontAwesomeIcon
              icon={faChevronUp}
              className="bus-fare-openDtls-icon"
              onClick={(e) => toggleUp(e, "#bus-fare-section")}
            />
          </div>
          <div
            className="bus-fare-section"
            id="bus-fare-section"
            style={{ display: "none", cursor: "default" }}
          >
            <div className="bus-fare-fareItem bus-fare-fareItem-flightFare">
              <div className="bus-fare-fareItem-title">Bus fare</div>
              <div className="bus-fare-fareItem-value">
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="bus-fare-fareItem-value-icon"
                />
                &nbsp;
                {/* {selectedSeat ? selectedSeat.Price.OfferedPriceRoundedOff : 0} */}
                {selectedSeats.length > 0
                  ? selectedSeats.reduce(
                      (total, seat) =>
                        total + seat.Price.OfferedPriceRoundedOff,
                      0
                    )
                  : 0}
              </div>
            </div>
            <div className="bus-fare-fareItem">
              <div className="bus-fare-fareItem-title">Service Charges</div>
              <div className="bus-fare-fareItem-value">
                {"+ "}
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="bus-fare-fareItem-value-icon"
                />
                {/* {selectedSeat
                  ? Math.ceil(
                      (selectedSeat.Price.OfferedPriceRoundedOff * 3) / 100
                    )
                  : 0} */}
                {bookingBus?.serviceCharge ? bookingBus?.serviceCharge : ""}
              </div>
            </div>
            <div className="bus-fare-fareItem">
              <div className="bus-fare-fareItem-title">GST</div>
              <div className="bus-fare-fareItem-value">
                {"+ "}
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="bus-fare-fareItem-value-icon"
                />
                {/* {selectedSeat
                  ? Math.ceil(
                      (selectedSeat.Price.OfferedPriceRoundedOff * 3) / 100
                    )
                  : 0} */}
                {bookingBus?.GST ? Math.round(bookingBus?.GST) : ""}
              </div>
            </div>
          </div>
          <div className="bus-fare-box">
            <div className="bus-fare-totalFare">
              <div className="bus-fare-totalFare-title">Total fare: </div>
              <div className="bus-fare-totalFare-value">
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="bus-fare-totalFare-value-icon"
                />
                &nbsp;
                {bookingBus.busTotalPrice ? bookingBus.busTotalPrice : 0}
              </div>
            </div>
            {/* <div className="bus-fare-submit">
              {adminUserId ? (
                <button>Add to trip</button>
              ) : (
                <>
                  {selectedTripId ? (
                    <div className="bus-fare-existing">
                      Do you want to add to{" "}
                      {selectedTrip?.data?.name
                        ? selectedTrip?.data?.name
                        : selectedTripId}{" "}
                      trip
                      <div>
                        <button
                          onClick={() => {
                            if (boardingPoint === "") {
                              setBusBoardError("Select boarding point");
                            } else if (droppingPoint === "") {
                              setBusBoardError("");
                              setBusDropError("Select dropping point");
                            } else if (
                              parseInt(NoofBusPassengers) !==
                              selectedSeats.length

                              // selectedSeat.length !== NoofBusPassengers
                            ) {
                              setPassengerError(
                                "Select the correct number of seats"
                              );
                              setBusDropError("");
                            } else {
                              setPassengerError("");
                              // All conditions are met, proceed with the desired actions
                              actions.editTripById(
                                selectedTripId,
                                bookingBus,
                                "bus"
                              );
                              navigate(`/trips/${selectedTripId}`, {
                                state: { userId: userId },
                              });
                            }
                          }}
                          className="hotelBook-addData"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => {
                            actions.setFlightBookPage(false);
                            actions.setBookingFlight([]);
                          }}
                          className="hotelBook-back"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (boardingPoint === "") {
                          setBusBoardError("Select boarding point");
                        } else if (droppingPoint === "") {
                          setBusBoardError("");
                          setBusDropError("Select dropping point");
                        } else if (
                          parseInt(NoofBusPassengers) !== selectedSeats.length
                        ) {
                          setBusDropError("");
                          setPassengerError(
                            "Select the correct number of seats"
                          );
                        } else {
                          setPassengerError("");
                          setSubmitIsOpen(true);
                        }
                      }}
                    >
                      Add to trip
                    </button>
                  )}
                </>
              )}
            </div> */}
          </div>
        </div>
        <div className="busBook-fare-desktop">
          <div className="bus-fare-section-desktop" id="bus-fare-section">
            <div className="bus-fare-fareItem bus-fare-fareItem-flightFare">
              <div className="bus-fare-fareItem-title">
                Bus: {BusOperatorName}
              </div>

              <br />
              <br />
              <div className="bus-fare-fareItem-title">Bus fare</div>
              <div className="bus-fare-fareItem-value">
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="bus-fare-fareItem-value-icon"
                />
                &nbsp;
                {selectedSeats.length > 0
                  ? selectedSeats.reduce(
                      (total, seat) =>
                        total + seat.Price.OfferedPriceRoundedOff,
                      0
                    )
                  : 0}
              </div>
            </div>
            <div className="flex gap-1 items-center mt-2 mb-2 h-[30px]">
              {selectedSeats.length > 0 && (
                <p className="font-bold text-[#505050]">Seats:</p>
              )}
              {selectedSeats.length > 0 &&
                selectedSeats.map((e, i) => (
                  <p className="text-[13px]">{e.SeatName},</p>
                ))}
            </div>
            <div className="bus-fare-fareItem">
              <div className="bus-fare-fareItem-title">Service Charges</div>
              <div className="bus-fare-fareItem-value">
                {"+ "}
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="bus-fare-fareItem-value-icon"
                />
                {/* {selectedSeat.length > 0
                  ? selectedSeat.reduce(
                      (total, seat) =>
                        total +
                        Math.ceil(
                          (seat.Price.OfferedPriceRoundedOff * busService) / 100
                        ),
                      0
                    ) > 150
                    ? selectedSeat.reduce(
                        (total, seat) =>
                          total +
                          Math.ceil(
                            (seat.Price.OfferedPriceRoundedOff * busService) /
                              100
                          ),
                        0
                      )
                    : 150
                  : 0} */}
                {bookingBus?.serviceCharge ? bookingBus?.serviceCharge : ""}
              </div>
            </div>
            <div className="bus-fare-fareItem">
              <div className="bus-fare-fareItem-title">GST(18%)</div>
              <div className="bus-fare-fareItem-value">
                {"+ "}
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="bus-fare-fareItem-value-icon"
                />
                {/* {selectedSeat.length > 0
                  ? selectedSeat.reduce(
                      (total, seat) =>
                        total +
                        Math.ceil(
                          (seat.Price.OfferedPriceRoundedOff * busService) / 100
                        ),
                      0
                    ) > 150
                    ? selectedSeat.reduce(
                        (total, seat) =>
                          total +
                          Math.ceil(
                            (seat.Price.OfferedPriceRoundedOff * busService) /
                              100
                          ),
                        0
                      )
                    : 150
                  : 0} */}
                {bookingBus?.GST ? Math.round(bookingBus?.GST) : ""}
              </div>
            </div>
          </div>
          <div className="bus-fare-totalFare">
            <div className="bus-fare-totalFare-title">Total fare</div>
            <div className="bus-fare-totalFare-value">
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="bus-fare-totalFare-value-icon"
              />
              {bookingBus.busTotalPrice
                ? Math.round(bookingBus.busTotalPrice)
                : 0}
            </div>
          </div>
          {/* <div className="bus-fare-submit">
            {userAdmin ? (
              <button
                onClick={() => {
                  if (boardingPoint === "") {
                    setBusBoardError("Select boarding point");
                  } else if (droppingPoint === "") {
                    setBusBoardError("");
                    setBusDropError("Select dropping point");
                  } else if (
                    parseInt(NoofBusPassengers) !== selectedSeats.length

                    // selectedSeat.length !== NoofBusPassengers
                  ) {
                    setPassengerError("Select the correct number of seats");
                    setBusDropError("");
                  } else {
                    setPassengerError("");
                    // All conditions are met, proceed with the desired actions
                    // actions.editTripById(
                    //   selectedTripId,
                    //   bookingBus,
                    //   "bus"
                    // );
                    // navigate(`/trips/${selectedTripId}`, {
                    //   state: { userId: userId },
                    // });
                    addBusFromUserByAdmin();
                    navigate(`/users/${userFromAdmin}/trips/${tripFromAdmin}`);
                  }
                }}
              >
                Add to trip
              </button>
            ) : (
              <>
                {adminUserId ? (
                  <button
                    onClick={() => {
                      //setAdminSubmitIsOpen(true);
                    }}
                  >
                    Add to Trip
                  </button>
                ) : (
                  <>
                    {selectedTripId ? (
                      <div className="bus-fare-existing">
                        Do you want to add to{" "}
                        {selectedTrip?.data?.name
                          ? selectedTrip?.data?.name
                          : selectedTripId}{" "}
                        trip
                        <div>
                          <button
                            onClick={() => {
                              if (boardingPoint === "") {
                                setBusBoardError("Select boarding point");
                              } else if (droppingPoint === "") {
                                setBusBoardError("");
                                setBusDropError("Select dropping point");
                              } else if (
                                parseInt(NoofBusPassengers) !==
                                selectedSeats.length

                                // selectedSeat.length !== NoofBusPassengers
                              ) {
                                setPassengerError(
                                  "Select the correct number of seats"
                                );
                                setBusDropError("");
                              } else {
                                setPassengerError("");
                                // All conditions are met, proceed with the desired actions
                                actions.editTripById(
                                  selectedTripId,
                                  bookingBus,
                                  "bus"
                                );
                                navigate(`/trips/${selectedTripId}`, {
                                  state: { userId: userId },
                                });
                              }
                            }}
                            className="hotelBook-addData"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => {
                              actions.setFlightBookPage(false);
                              actions.setBookingFlight([]);
                            }}
                            className="hotelBook-back"
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (boardingPoint === "") {
                            setBusBoardError("Select boarding point");
                          } else if (droppingPoint === "") {
                            setBusBoardError("");
                            setBusDropError("Select dropping point");
                          } else if (
                            parseInt(NoofBusPassengers) !== selectedSeats.length
                          ) {
                            setBusDropError("");
                            setPassengerError(
                              "Select the correct number of seats"
                            );
                          } else {
                            setPassengerError("");
                            setSubmitIsOpen(true);
                          }
                        }}
                      >
                        Add to trip
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default BusInfo;
