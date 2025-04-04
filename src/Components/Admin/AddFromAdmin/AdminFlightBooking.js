import React, { useContext, useEffect, useState } from "react";
import MyContext from "../../Context";
import "../../Flights/FlightBooking/FlightBooking.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChild,
  faIndianRupeeSign,
  faLeftLong,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Popup from "../../Popup";
import LoadingProg from "../../Loading/LoadingProg";
import { useNavigate, useParams } from "react-router-dom";
import AdminFlightItems from "./AdminFlightItems";
import { Controller, useForm } from "react-hook-form";
import { Button } from "react-bootstrap";
const seatsSelect = (seatsSeg, pax, seatCode) => {
  if (!seatsSeg) {
    seatsSeg = [];
  }
  var rmSeat = null;
  if (seatsSeg.length >= pax) {
    rmSeat = seatsSeg.shift();
  }
  seatsSeg.push(seatCode);

  return { seatsSeg, rmSeat };
};
const AdminFlightBooking = () => {
  const { control, handleSubmit, setValue, reset } = useForm();
  const [bookIndex, setBookIndex] = useState(0);
  const [segIndex, setSegIndex] = useState(0);
  const [seatSegIdx, setSeatSegIdx] = useState(0);

  const [selectSeats, setSelectSeats] = useState(false);
  const [seatData, setSeatData] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([[], []]);
  const [wingPosArr, setWingPosArr] = useState([]);

  const [fareIsOpen, setFareIsOpen] = useState(false);

  const [submitIsOpen, setSubmitIsOpen] = useState(false);
  const [seatOpen, setSeatOpen] = useState(true);
  const [adminSubmitIsOpen, setAdminSubmitIsOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("tab1");

  const [loading, setLoading] = useState(false);
  const [selectedBag, setSelectedaBag] = useState([]);
  const [selectedBag2, setSelectedaBag2] = useState([]);
  const [openFareRules, setOpenFareRules] = useState(false);
  const [addtoTripPopup, setAddtoTripPopup] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [newtravellerDetails, setNewTravellerDetails] = useState();
  const {
    actions,
    flightBookDataLoading,
    bookingFlight,
    selectedTripId,
    selectedTrip,
    userTripStatus,
    domesticFlight,
    internationalFlight,
    isInternationalRound,
    // userId,
    adminUserId,
    adminUserTrips,
    minimumServiceCharge,
    userAccountDetails,
  } = useContext(MyContext);
  const { userId, tripId } = useParams();
  // console.log(params)
  const changeBookIndex = (value) => {
    setBookIndex(value);
    setSegIndex(0);
    setSeatSegIdx(0);
    setSelectedSeats([[], []]);
  };
  const toggleUp = (e, id) => {
    actions.toggleUp(e, id, fareIsOpen);
    setFareIsOpen((prev) => !prev);
  };

  var myDate =
    bookingFlight[0].flight.Segments[0][
      bookingFlight[0].flight.Segments[0].length - 1
    ].Destination.ArrTime;
  var myStr =
    bookingFlight[0].flight.Segments[0][
      bookingFlight[0].flight.Segments[0].length - 1
    ]?.Destination?.Airport?.CityName + "_trip";
  const date = new Date(myDate);
  const formattedDate = `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getDate()}`;
  const combinedString = `${myStr}_${formattedDate}`;
  var [defaultInput, setDefaultInput] = useState(combinedString);
  var { totalSeatCharges, totalBaggagePrice, totalMealPrice, finalPrice } =
    actions.getTotalFares(bookingFlight);
  var navigate = useNavigate();
  var getTime = (seconds) => {
    const timestampInSeconds = seconds;
    const timestampInMilliseconds = timestampInSeconds * 1000;
    const date = new Date(timestampInMilliseconds);
    return date;
  };

  var addtoTrip = async (id, userId) => {
    await actions.editTripById(id, [...bookingFlight], "flights", userId);
  };

  var adminAddToTrip = async (id) => {
    await actions.editTripByIdAdmin(
      id,
      [...bookingFlight],
      "flights",
      adminUserId
    );
  };

  var handleInputChange = (e) => {
    setDefaultInput(e.target.value);
  };
  var handleAddToTrip = async () => {
    setLoading(true);
    await actions.editTripById(tripId, bookingFlight, "flights", userId);
    // await actions.getTripDocById(tripId, userId);
    navigate(`/users/${userId}/trips/${tripId}`);
    setLoading(false);
  };
  var handleAdminAddToTrip = async () => {
    setLoading(true);
    var newtripid = await actions.createAdminNewtrip(
      defaultInput,
      "flights",
      bookingFlight,
      adminUserId
    );
    navigate(`/users/${adminUserId}/trips/${newtripid}`, {
      state: { userId: userId },
    });
    setLoading(false);
  };
  const classifyAllFlights = (flights) => {
    const hasInternational = flights.some(
      (flight) => flight.originCountryCode !== flight.destCountryCode
    );

    return hasInternational ? true : false;
  };

  const isInternational = bookingFlight
    ? classifyAllFlights(bookingFlight?.[0]?.flightNew?.segments)
    : null;
  useEffect(() => {
    if (newtravellerDetails) {
      setIsFormDisabled(true);
      if (newtravellerDetails.children) {
        newtravellerDetails.children.forEach((child, index) => {
          setValue(`children[${index}].gender`, child.gender);
          setValue(`children[${index}].firstName`, child.firstName);
          setValue(`children[${index}].lastName`, child.lastName);
          // Set other values similarly
          if (isInternational) {
            setValue(`children[${index}].passportNumber`, child.passportNumber);
            setValue(
              `children[${index}].passportIssueCountry`,
              child.passportIssueCountry
            );
            setValue(
              `children[${index}].passportIssueDate`,
              child.passportIssueDate
            );
            setValue(
              `children[${index}].passportExpiryDate`,
              child.passportExpiryDate
            );
            // setValue(`children[${index}].birthDate`, child.birthDate);
          }
        });
      }
      if (newtravellerDetails.adults) {
        newtravellerDetails.adults.forEach((adults, index) => {
          setValue(`adults[${index}].gender`, adults.gender);
          setValue(`adults[${index}].firstName`, adults.firstName);
          setValue(`adults[${index}].lastName`, adults.lastName);
          // setValue(`adults[${index}].birthDate`, adults.birthDate);
          if (index === 0) {
            setValue(`adults[${index}].email`, adults.email);
            setValue(`adults[${index}].mobileNumber`, adults.mobileNumber);
          }
          // Set other values similarly
          if (isInternational) {
            setValue(`adults[${index}].passportNumber`, adults.passportNumber);
            setValue(
              `adults[${index}].passportIssueCountry`,
              adults.passportIssueCountry
            );
            setValue(
              `adults[${index}].passportIssueDate`,
              adults.passportIssueDate
            );
            setValue(
              `adults[${index}].passportExpiryDate`,
              adults.passportExpiryDate
            );
          }
        });
      }
      // if (newtravellerDetails.infants) {
      //   newtravellerDetails.infants.forEach((infants, index) => {
      //     setValue(`infants[${index}].gender`, infants.gender);
      //     setValue(`infants[${index}].firstName`, infants.firstName);
      //     setValue(`infants[${index}].lastName`, infants.lastName);
      //     // Set other values similarly
      //     if (isInternational) {
      //       setValue(
      //         `infants[${index}].passportNumber`,
      //         infants.passportNumber
      //       );
      //       setValue(
      //         `infants[${index}].passportIssueCountry`,
      //         infants.passportIssueCountry
      //       );
      //       setValue(
      //         `infants[${index}].passportIssueDate`,
      //         infants.passportIssueDate
      //       );
      //       setValue(
      //         `infants[${index}].passportExpiryDate`,
      //         infants.passportExpiryDate
      //       );
      //       // setValue(`infants[${index}].birthDate`, infants.birthDate);
      //     }
      //   });
      // }
    }
  }, [newtravellerDetails, setValue]);
  const onSubmit = (data) => {
    // console.log(flight.id);
    // const newData = { [flight.id]: data };
    // console.log(newData);
    // actions.updateTravDetails(newData, tripId);
    // setAddTravellers(false);
  };
  if (flightBookDataLoading) {
    return (
      <LoadingProg
        condition={flightBookDataLoading}
        loadingText={"Getting booking details"}
        progEnd={flightBookDataLoading}
        progTime={25}
      />
    );
  }
  return (
    <>
      <Popup
        condition={selectSeats}
        close={() => {
          setSelectSeats(false);
        }}
      >
        <div className="flightBook-selectSeats">
          {seatData.length > 1 ? (
            <div className="flightBook-selectSeats-segNav">
              {seatData.map((seatSeg, s) => {
                return (
                  <div
                    className={
                      seatSegIdx === s
                        ? "flightBook-selectSeats-segNav-item flightBook-selectSeats-segNav-item-selected"
                        : "flightBook-selectSeats-segNav-item"
                    }
                    onClick={() => setSeatSegIdx(s)}
                  >
                    {`${bookingFlight[bookIndex].flightNew.segments[segIndex].segRoutes[s]?.originCode} -> ${bookingFlight[bookIndex].flightNew.segments[segIndex].segRoutes[s]?.destCode}`}
                  </div>
                );
              })}
            </div>
          ) : null}
          {bookingFlight[bookIndex].seats &&
          bookingFlight[bookIndex].seats[segIndex] &&
          bookingFlight[bookIndex].seats[segIndex][seatSegIdx] &&
          Object.keys(bookingFlight[bookIndex].seats[segIndex][seatSegIdx])
            .length > 0 ? (
            <div className="flightBook-selectSeats-segSeatMap-selectedSeats">
              <div className="flightBook-selectSeats-segSeatMap-selectedSeats-title">
                Selected seats
              </div>
              <div className="flightBook-seatMap-seats-route-seatCodes">
                {Object.keys(
                  bookingFlight[bookIndex].seats[segIndex][seatSegIdx]
                ).map((seatCode, c) => {
                  var type =
                    c + 1 <= bookingFlight[bookIndex].adults
                      ? "Adult"
                      : c + 1 <=
                        bookingFlight[bookIndex].child +
                          bookingFlight[bookIndex].child
                      ? "Child"
                      : "Infant";

                  if (
                    c ===
                    Object.keys(
                      bookingFlight[bookIndex].seats[segIndex][seatSegIdx]
                    ).length -
                      1
                  ) {
                    return (
                      <div>
                        <span>
                          {type === "Adult" ? (
                            <FontAwesomeIcon icon={faUser} />
                          ) : (
                            <FontAwesomeIcon icon={faChild} />
                          )}
                          &nbsp;{c + 1}
                        </span>
                        &nbsp;{seatCode}
                      </div>
                    );
                  }
                  return (
                    <div>
                      <span>
                        {type === "Adult" ? (
                          <FontAwesomeIcon icon={faUser} />
                        ) : (
                          <FontAwesomeIcon icon={faChild} />
                        )}
                        &nbsp;{c + 1}
                      </span>
                      &nbsp;{seatCode},{" "}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          <div className="flightBook-selectSeats-segSeatMap">
            {seatData[seatSegIdx] &&
              seatData[seatSegIdx].RowSeats.map((row, r) => {
                return (
                  <>
                    {actions.isExitRow(row) ? (
                      <div className="flightBook-selectSeats-segSeatMap-exitRow">
                        {wingPosArr &&
                        wingPosArr.length > 0 &&
                        row.Seats &&
                        row.Seats[0] &&
                        wingPosArr[seatSegIdx].includes(row.Seats[0].RowNo) ? (
                          <div
                            className={
                              wingPosArr[seatSegIdx].indexOf(
                                row.Seats[0].RowNo
                              ) === 0
                                ? "flightBook-selectSeats-segSeatMap-row-wingLeft flightBook-selectSeats-segSeatMap-row-wingLeft-first"
                                : wingPosArr[seatSegIdx].indexOf(
                                    row.Seats[0].RowNo
                                  ) ===
                                  wingPosArr[seatSegIdx].length - 1
                                ? "flightBook-selectSeats-segSeatMap-row-wingLeft flightBook-selectSeats-segSeatMap-row-wingLeft-last"
                                : "flightBook-selectSeats-segSeatMap-row-wingLeft"
                            }
                            style={{
                              height: `${40}px`,
                            }}
                          ></div>
                        ) : null}
                        <div className="flightBook-selectSeats-segSeatMap-exitRow-section">
                          <span className="flightBook-selectSeats-segSeatMap-exitRow-chevronLeft">
                            <FontAwesomeIcon icon={faChevronLeft} />
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </span>
                          Emergency exit
                          <span className="flightBook-selectSeats-segSeatMap-exitRow-chevronRight">
                            <FontAwesomeIcon icon={faChevronRight} />
                            <FontAwesomeIcon icon={faChevronRight} />
                          </span>
                        </div>
                        {wingPosArr &&
                        wingPosArr.length > 0 &&
                        row.Seats &&
                        row.Seats[0] &&
                        wingPosArr[seatSegIdx].includes(row.Seats[0].RowNo) ? (
                          <div
                            className={
                              wingPosArr[seatSegIdx].indexOf(
                                row.Seats[0].RowNo
                              ) === 0
                                ? "flightBook-selectSeats-segSeatMap-row-wingRight flightBook-selectSeats-segSeatMap-row-wingRight-first"
                                : wingPosArr[seatSegIdx].indexOf(
                                    row.Seats[0].RowNo
                                  ) ===
                                  wingPosArr[seatSegIdx].length - 1
                                ? "flightBook-selectSeats-segSeatMap-row-wingRight flightBook-selectSeats-segSeatMap-row-wingRight-last"
                                : "flightBook-selectSeats-segSeatMap-row-wingRight"
                            }
                            style={{
                              height: `${40}px`,
                            }}
                          ></div>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="flightBook-selectSeats-segSeatMap-row">
                      {wingPosArr &&
                      wingPosArr.length > 0 &&
                      row.Seats &&
                      row.Seats[0] &&
                      wingPosArr[seatSegIdx].includes(row.Seats[0].RowNo) ? (
                        <div
                          className={
                            !actions.isExitRow(row)
                              ? wingPosArr[seatSegIdx].indexOf(
                                  row.Seats[0].RowNo
                                ) === 0
                                ? "flightBook-selectSeats-segSeatMap-row-wingLeft flightBook-selectSeats-segSeatMap-row-wingLeft-first"
                                : wingPosArr[seatSegIdx].indexOf(
                                    row.Seats[0].RowNo
                                  ) ===
                                  wingPosArr[seatSegIdx].length - 1
                                ? "flightBook-selectSeats-segSeatMap-row-wingLeft flightBook-selectSeats-segSeatMap-row-wingLeft-last"
                                : "flightBook-selectSeats-segSeatMap-row-wingLeft"
                              : "flightBook-selectSeats-segSeatMap-row-wingLeft"
                          }
                          style={{
                            height: `${60}px`,
                          }}
                        ></div>
                      ) : null}
                      <span className="flightBook-selectSeats-segSeatMap-row-leftCol">
                        {Array.isArray(row?.Seats) ? (
                          <>
                            {row?.Seats?.map((seat, s) => {
                              if (s >= 0 && s <= 2) {
                                if (seat.noSeat) {
                                  return (
                                    <div className="flightBook-selectSeats-segSeatMap-row-seat-section">
                                      <div className="flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-noSeat"></div>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="flightBook-selectSeats-segSeatMap-row-seat-section">
                                    <div
                                      className={`${
                                        seat.AvailablityType === 3
                                          ? "flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-reserved"
                                          : seat.AvailablityType === 1
                                          ? "flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-open"
                                          : "flightBook-selectSeats-segSeatMap-row-seat"
                                      } ${
                                        bookingFlight[bookIndex].seats &&
                                        bookingFlight[bookIndex].seats[
                                          segIndex
                                        ] &&
                                        bookingFlight[bookIndex].seats[
                                          segIndex
                                        ][seatSegIdx] &&
                                        bookingFlight[bookIndex].seats[
                                          segIndex
                                        ][seatSegIdx][seat.Code]
                                          ? "flightBook-selectSeats-segSeatMap-row-seat-selected"
                                          : ""
                                      }`}
                                      onClick={
                                        !seat.noSeat &&
                                        seat.AvailablityType === 1
                                          ? () => {
                                              var seats = [...selectedSeats];

                                              if (
                                                seats[segIndex] &&
                                                seats[segIndex][seatSegIdx] &&
                                                seats[segIndex][
                                                  seatSegIdx
                                                ].includes(seat.Code)
                                              ) {
                                                seats[segIndex][seatSegIdx] =
                                                  seats[segIndex][
                                                    seatSegIdx
                                                  ].filter((seatCode, c) => {
                                                    return (
                                                      seatCode !== seat.Code
                                                    );
                                                  });
                                                actions.handleChangeFlightBook(
                                                  null,
                                                  "seats",
                                                  bookIndex,
                                                  segIndex,
                                                  null,
                                                  seatSegIdx,
                                                  seat.Code
                                                );
                                              } else {
                                                // var { seatsSeg, rmSeat } =
                                                //   seatsSelect(
                                                //     seats[segIndex][seatSegIdx],
                                                //     Number(
                                                //       bookingFlight[bookIndex]
                                                //         .adults
                                                //     ) +
                                                //       Number(
                                                //         bookingFlight[bookIndex]
                                                //           .child
                                                //       ),
                                                //     seat.Code
                                                //   );
                                                // seats[segIndex][seatSegIdx] = [
                                                //   ...seatsSeg,
                                                // ];
                                                // actions.handleChangeFlightBook(
                                                //   null,
                                                //   "seats",
                                                //   bookIndex,
                                                //   segIndex,
                                                //   seat,
                                                //   seatSegIdx,
                                                //   rmSeat
                                                // );
                                              }

                                              setSelectedSeats(seats);
                                            }
                                          : null
                                      }
                                    >
                                      {seat.Code}
                                    </div>
                                    {seat.Price ? (
                                      <div className="flightBook-selectSeats-segSeatMap-row-seat-price">
                                        {`${seat.Price.toLocaleString(
                                          "en-IN"
                                        )} `}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              }
                              return "";
                            })}
                          </>
                        ) : null}
                      </span>
                      <span className="flightBook-selectSeats-segSeatMap-row-rightCol">
                        {Array.isArray(row?.Seats) ? (
                          <>
                            {row.Seats.map((seat, s) => {
                              if (s >= 3 && s <= 5) {
                                if (seat.noSeat) {
                                  return (
                                    <div className="flightBook-selectSeats-segSeatMap-row-seat-section">
                                      <div className="flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-noSeat"></div>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="flightBook-selectSeats-segSeatMap-row-seat-section">
                                    <div
                                      className={`${
                                        seat.AvailablityType === 3
                                          ? "flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-reserved"
                                          : seat.AvailablityType === 1
                                          ? "flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-open"
                                          : "flightBook-selectSeats-segSeatMap-row-seat"
                                      } ${
                                        bookingFlight[bookIndex].seats &&
                                        bookingFlight[bookIndex].seats[
                                          segIndex
                                        ] &&
                                        bookingFlight[bookIndex].seats[
                                          segIndex
                                        ][seatSegIdx] &&
                                        bookingFlight[bookIndex].seats[
                                          segIndex
                                        ][seatSegIdx][seat.Code]
                                          ? "flightBook-selectSeats-segSeatMap-row-seat-selected"
                                          : ""
                                      }`}
                                      onClick={
                                        !seat.noSeat &&
                                        seat.AvailablityType === 1
                                          ? () => {
                                              var seats = [...selectedSeats];

                                              if (
                                                seats[segIndex] &&
                                                seats[segIndex][seatSegIdx] &&
                                                seats[segIndex][
                                                  seatSegIdx
                                                ].includes(seat.Code)
                                              ) {
                                                seats[segIndex][seatSegIdx] =
                                                  seats[segIndex][
                                                    seatSegIdx
                                                  ].filter((seatCode, c) => {
                                                    return (
                                                      seatCode !== seat.Code
                                                    );
                                                  });
                                                actions.handleChangeFlightBook(
                                                  null,
                                                  "seats",
                                                  bookIndex,
                                                  segIndex,
                                                  null,
                                                  seatSegIdx,
                                                  seat.Code
                                                );
                                              } else {
                                                // var { seatsSeg, rmSeat } =
                                                //   seatsSelect(
                                                //     seats[segIndex][seatSegIdx],
                                                //     Number(
                                                //       bookingFlight[bookIndex]
                                                //         .adults
                                                //     ) +
                                                //       Number(
                                                //         bookingFlight[bookIndex]
                                                //           .child
                                                //       ),
                                                //     seat.Code
                                                //   );
                                                // seats[segIndex][seatSegIdx] = [
                                                //   ...seatsSeg,
                                                // ];
                                                // actions.handleChangeFlightBook(
                                                //   null,
                                                //   "seats",
                                                //   bookIndex,
                                                //   segIndex,
                                                //   seat,
                                                //   seatSegIdx,
                                                //   rmSeat
                                                // );
                                              }
                                              setSelectedSeats(seats);
                                            }
                                          : null
                                      }
                                    >
                                      {seat.Code}
                                    </div>
                                    {seat.Price ? (
                                      <div className="flightBook-selectSeats-segSeatMap-row-seat-price">
                                        {`${seat.Price.toLocaleString(
                                          "en-IN"
                                        )} `}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              }
                              return "";
                            })}
                          </>
                        ) : null}
                      </span>
                      {wingPosArr &&
                      wingPosArr.length > 0 &&
                      row.Seats &&
                      row.Seats[0] &&
                      wingPosArr[seatSegIdx].includes(row.Seats[0].RowNo) ? (
                        <div
                          className={
                            !actions.isExitRow(row)
                              ? wingPosArr[seatSegIdx].indexOf(
                                  row.Seats[0].RowNo
                                ) === 0
                                ? "flightBook-selectSeats-segSeatMap-row-wingRight flightBook-selectSeats-segSeatMap-row-wingRight-first"
                                : wingPosArr[seatSegIdx].indexOf(
                                    row.Seats[0].RowNo
                                  ) ===
                                  wingPosArr[seatSegIdx].length - 1
                                ? "flightBook-selectSeats-segSeatMap-row-wingRight flightBook-selectSeats-segSeatMap-row-wingRight-last"
                                : "flightBook-selectSeats-segSeatMap-row-wingRight"
                              : "flightBook-selectSeats-segSeatMap-row-wingRight"
                          }
                          style={{
                            height: `${60}px`,
                          }}
                        ></div>
                      ) : null}
                    </div>
                  </>
                );
              })}
          </div>
          <div></div>
        </div>
      </Popup>
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

                  {loading ? (
                    <button className="spin">
                      <div className="spinner"></div>
                    </button>
                  ) : (
                    <button onClick={handleAddToTrip}>Add to trip</button>
                  )}
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

                  {loading ? (
                    <button className="spin">
                      <div className="spinner"></div>
                    </button>
                  ) : (
                    <button onClick={handleAdminAddToTrip}>Add to trip</button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Popup>
      <Popup condition={openFareRules} close={() => setOpenFareRules(false)}>
        <div className="flghtBook-fareRules">
          <div className="flightBook-fareRules-header">Fare Rules</div>
          <div className="flightBook-fareRules-section">
            <div
              dangerouslySetInnerHTML={{
                __html: bookingFlight[bookIndex].fareRules,
              }}
            />
          </div>
        </div>
      </Popup>
      <Popup condition={addtoTripPopup} close={() => setAddtoTripPopup(false)}>
        <div className="overflow-scroll h-[80vh]">
          <div style={{ width: "100%" }}>
            {bookingFlight.map((book, bookIndex) => {
              return (
                <AdminFlightItems
                  flightGrp={[{ ...bookingFlight[bookIndex].flight }]}
                  index={bookIndex}
                  bookingPage={true}
                  segIndex={segIndex}
                  key={book + 1}
                />
              );
            })}
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            // className="overflow-scroll h-[80vh]"
          >
            {Array.from(
              { length: parseInt(bookingFlight?.[0]?.adults) },
              (_, i) => {
                return (
                  <div key={`adult-${i}`} className="gap-[10px] mt-[20px]">
                    <h1 className="font-bold text-center py-1">
                      Adult-{i + 1}
                    </h1>
                    <div className="gap-2 flex-wrap justify-center">
                      <div className="flex gap-[10px] items-center justify-center flex-wrap">
                        <label className="flex flex-col text-[12px]">
                          Title
                          <Controller
                            name={`adults[${i}].gender`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAccountDetails.gender : "Mr"
                            }
                            rules={{ required: "Gender is required" }}
                            render={({ field }) => (
                              <select
                                {...field}
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                required
                                disabled={isFormDisabled}
                              >
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                              </select>
                            )}
                          />
                        </label>
                        <label className="flex flex-col text-[12px]">
                          First Name
                          <Controller
                            name={`adults[${i}].firstName`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAccountDetails.firstName : ""
                            }
                            render={({ field }) => (
                              <input
                                {...field}
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                placeholder="FirstName"
                                required
                                disabled={isFormDisabled}
                              />
                            )}
                          />
                        </label>
                        <label className="flex flex-col text-[12px]">
                          Last Name
                          <Controller
                            name={`adults[${i}].lastName`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAccountDetails.lastName : ""
                            }
                            render={({ field }) => (
                              <input
                                {...field}
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                placeholder="LastName"
                                required
                                disabled={isFormDisabled}
                              />
                            )}
                          />
                        </label>
                        <label className="flex flex-col text-[12px]">
                          Date of birth
                          <Controller
                            name={`adults[${i}].birthDate`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="date"
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                required
                                disabled={isFormDisabled}
                              />
                            )}
                          />
                        </label>

                        {i === 0 && (
                          <>
                            <label className="flex flex-col text-[12px]">
                              Email
                              <Controller
                                name={`adults[${i}].email`}
                                control={control}
                                defaultValue={
                                  i === 0 ? userAccountDetails.email : ""
                                }
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className={`${
                                      !isFormDisabled
                                        ? "border-[1.5px]"
                                        : "border-[0px]"
                                    } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                    placeholder="Email"
                                    required
                                    disabled={isFormDisabled}
                                  />
                                )}
                              />
                            </label>
                            <label className="flex flex-col text-[12px]">
                              Mobile Number
                              <Controller
                                name={`adults[${i}].mobileNumber`}
                                control={control}
                                defaultValue={
                                  i === 0 ? userAccountDetails.mobileNumber : ""
                                }
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className={`${
                                      !isFormDisabled
                                        ? "border-[1.5px]"
                                        : "border-[0px]"
                                    } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                    placeholder="Mobile Number"
                                    required
                                    disabled={isFormDisabled}
                                  />
                                )}
                              />
                            </label>
                          </>
                        )}
                      </div>
                      {isInternational && (
                        <>
                          <div className="flex items-center gap-[10px] my-2 flex-wrap justify-center">
                            <Controller
                              name={`adults[${i}].gender`}
                              control={control}
                              defaultValue={
                                i === 0 ? userAccountDetails.gender : "Mr"
                              }
                              rules={{ required: "Gender is required" }}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className={`${
                                    !isFormDisabled
                                      ? "border-[1.5px]"
                                      : "border-[0px]"
                                  } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal invisible`}
                                  required
                                  disabled={isFormDisabled}
                                >
                                  <option value="Mr">Mr</option>
                                  <option value="Ms">Ms</option>
                                  <option value="Mrs">Mrs</option>
                                </select>
                              )}
                            />
                            <label className="flex flex-col text-[12px]">
                              Passport Number
                              <Controller
                                name={`adults[${i}].passportNumber`}
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className={`${
                                      !isFormDisabled
                                        ? "border-[1.5px]"
                                        : "border-[0px]"
                                    } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                    placeholder="Passport Number"
                                    required
                                    disabled={isFormDisabled}
                                  />
                                )}
                              />
                            </label>
                            <label className="flex flex-col text-[12px]">
                              Passport Issue Country
                              <Controller
                                name={`adults[${i}].passportIssueCountry`}
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className={`${
                                      !isFormDisabled
                                        ? "border-[1.5px]"
                                        : "border-[0px]"
                                    } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                    placeholder="Passport Issue Country"
                                    required
                                    disabled={isFormDisabled}
                                  />
                                )}
                              />
                            </label>
                            <label className="flex flex-col text-[12px]">
                              Passport Issue Date
                              <Controller
                                name={`adults[${i}].passportIssueDate`}
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="date"
                                    className={`${
                                      !isFormDisabled
                                        ? "border-[1.5px]"
                                        : "border-[0px]"
                                    } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                    required
                                    disabled={isFormDisabled}
                                  />
                                )}
                              />
                            </label>
                            <label className="flex flex-col text-[12px]">
                              Passport Expiry Date
                              <Controller
                                name={`adults[${i}].passportExpiryDate`}
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="date"
                                    className={`${
                                      !isFormDisabled
                                        ? "border-[1.5px]"
                                        : "border-[0px]"
                                    } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                    required
                                    disabled={isFormDisabled}
                                  />
                                )}
                              />
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              }
            )}
            {/* {Array.from({ length: parseInt(flight?.data?.child) }, (_, i) => {
            return (
              <div key={`child-${i}`} className="gap-[10px] mt-[20px]">
                <h1 className="font-bold text-center py-1">Child-{i + 1}</h1>
                <div className="flex gap-2 flex-wrap justify-center">
                  <label className="flex flex-col text-[12px]">
                    Title
                    <Controller
                      name={`children[${i}].gender`}
                      control={control}
                      defaultValue="Mr"
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`${
                            !isFormDisabled ? "border-[1.5px]" : "border-[0px]"
                          } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                          required
                          disabled={isFormDisabled}
                        >
                          <option value="Mr">Mr</option>
                          <option value="Ms">Ms</option>
                          <option value="Mrs">Mrs</option>
                        </select>
                      )}
                    />
                  </label>
                  <label className="flex flex-col text-[12px]">
                    First Name
                    <Controller
                      name={`children[${i}].firstName`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`${
                            !isFormDisabled ? "border-[1.5px]" : "border-[0px]"
                          } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                          placeholder="FirstName"
                          required
                          disabled={isFormDisabled}
                        />
                      )}
                    />
                  </label>
                  <label className="flex flex-col text-[12px]">
                    Last Name
                    <Controller
                      name={`children[${i}].lastName`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`${
                            !isFormDisabled ? "border-[1.5px]" : "border-[0px]"
                          } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                          placeholder="LastName"
                          required
                          disabled={isFormDisabled}
                        />
                      )}
                    />
                  </label>
                  {isInternational && (
                    <>
                      <label className="flex flex-col text-[12px] flex-wrap justify-center">
                        Passport Number
                        <Controller
                          name={`children[${i}].passportNumber`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              className={`${
                                !isFormDisabled
                                  ? "border-[1.5px]"
                                  : "border-[0px]"
                              } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                              placeholder="Passport Number"
                              required
                              disabled={isFormDisabled}
                            />
                          )}
                        />
                      </label>
                      <label className="flex flex-col text-[12px]">
                        Passport Issue Country
                        <Controller
                          name={`children[${i}].passportIssueCountry`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              className={`${
                                !isFormDisabled
                                  ? "border-[1.5px]"
                                  : "border-[0px]"
                              } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                              placeholder="Passport Issue Country"
                              required
                              disabled={isFormDisabled}
                            />
                          )}
                        />
                      </label>
                      <label className="flex flex-col text-[12px]">
                        Passport Issue Date
                        <Controller
                          name={`children[${i}].passportIssueDate`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="date"
                              className={`${
                                !isFormDisabled
                                  ? "border-[1.5px]"
                                  : "border-[0px]"
                              } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                              required
                              disabled={isFormDisabled}
                            />
                          )}
                        />
                      </label>
                      <label className="flex flex-col text-[12px]">
                        Passport Expiry Date
                        <Controller
                          name={`children[${i}].passportExpiryDate`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="date"
                              className={`${
                                !isFormDisabled
                                  ? "border-[1.5px]"
                                  : "border-[0px]"
                              } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                              required
                              disabled={isFormDisabled}
                            />
                          )}
                        />
                      </label>
                      <label className="flex flex-col text-[12px]">
                        Date of birth
                        <Controller
                          name={`children[${i}].birthDate`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="date"
                              className={`${
                                !isFormDisabled
                                  ? "border-[1.5px]"
                                  : "border-[0px]"
                              } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                              required
                              disabled={isFormDisabled}
                            />
                          )}
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {Array.from({ length: parseInt(flight?.data?.infant) }, (_, i) => (
            <div key={`infant-${i}`} className="gap-[10px] mt-[20px]">
              <h1 className="font-bold text-center py-1">Infant-{i + 1}</h1>
              <div className="flex gap-2 flex-wrap justify-center">
                <label className="flex flex-col text-[12px]">
                  Title
                  <Controller
                    name={`infants[${i}].gender`}
                    control={control}
                    defaultValue={"Mr"}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`${
                          !isFormDisabled ? "border-[1.5px]" : "border-[0px]"
                        } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                        required
                        disabled={isFormDisabled}
                      >
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                      </select>
                    )}
                  />
                </label>
                <label className="flex flex-col text-[12px]">
                  First Name
                  <Controller
                    name={`infants[${i}].firstName`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`${
                          !isFormDisabled ? "border-[1.5px]" : "border-[0px]"
                        } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                        placeholder="FirstName"
                        required
                        disabled={isFormDisabled}
                      />
                    )}
                  />
                </label>
                <label className="flex flex-col text-[12px]">
                  Last Name
                  <Controller
                    name={`infants[${i}].lastName`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`${
                          !isFormDisabled ? "border-[1.5px]" : "border-[0px]"
                        } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                        placeholder="LastName"
                        required
                        disabled={isFormDisabled}
                      />
                    )}
                  />
                </label>

                {isInternational && (
                  <>
                    <label className="flex flex-col flex-wrap justify-center text-[12px]">
                      Passport Number
                      <Controller
                        name={`infants[${i}].passportNumber`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            className={`${
                              !isFormDisabled
                                ? "border-[1.5px]"
                                : "border-[0px]"
                            } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                            placeholder="Passport Number"
                            required
                            disabled={isFormDisabled}
                          />
                        )}
                      />
                    </label>
                    <label className="flex flex-col text-[12px]">
                      Passport Issue Country
                      <Controller
                        name={`infants[${i}].passportIssueCountry`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            className={`${
                              !isFormDisabled
                                ? "border-[1.5px]"
                                : "border-[0px]"
                            } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                            placeholder="Passport Issue Country"
                            required
                            disabled={isFormDisabled}
                          />
                        )}
                      />
                    </label>
                    <label className="flex flex-col text-[12px]">
                      Passport Issue Date
                      <Controller
                        name={`infants[${i}].passportIssueDate`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="date"
                            className={`${
                              !isFormDisabled
                                ? "border-[1.5px]"
                                : "border-[0px]"
                            } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                            required
                            disabled={isFormDisabled}
                          />
                        )}
                      />
                    </label>
                    <label className="flex flex-col text-[12px]">
                      Passport Issue Country
                      <Controller
                        name={`infants[${i}].passportExpiryDate`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="date"
                            className={`${
                              !isFormDisabled
                                ? "border-[1.5px]"
                                : "border-[0px]"
                            } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                            required
                            disabled={isFormDisabled}
                          />
                        )}
                      />
                    </label>
                    <label className="flex flex-col text-[12px]">
                      Date of birth
                      <Controller
                        name={`infants[${i}].birthDate`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="date"
                            className={`${
                              !isFormDisabled
                                ? "border-[1.5px]"
                                : "border-[0px]"
                            } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                            required
                            disabled={isFormDisabled}
                          />
                        )}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          ))} */}
            <div className="flex gap-2 justify-center items-center mt-3">
              {/* <>
                {tripData?.data?.travellerDetails &&
                tripData?.data?.travellerDetails[flight?.id] ? (
                  !isFormDisabled ? (
                    <Button
                      type="submit"
                      variant="contained"
                      className="bg-black"
                      size="small"
                      // onClick={handleSubmit(onSubmit)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        setIsFormDisabled(false);
                      }}
                      variant="contained"
                      className="!bg-gray-300 text-black"
                    >
                      Edit
                    </Button>
                  )
                ) : (
                  <Button
                    // onClick={handleSubmit(onSubmit)}
                    type="submit"
                    variant="contained"
                    className="bg-black"
                    size="small"
                  >
                    Save
                  </Button>
                )}
              </> */}
              <Button
                onClick={handleSubmit(onSubmit)}
                type="submit"
                variant="contained"
                className="bg-black"
                size="small"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </Popup>
      <div className="flightBook-block">
        <div>
          <div className="flightBook-header">
            <div className="flightBook-header-back">
              <FontAwesomeIcon
                className="flightBook-header-back-icon"
                icon={faArrowLeft}
                onClick={() => {
                  actions.setFlightBookPage(false);
                  actions.setBookingFlight([]);
                  actions.setFlightResJType(0);
                }}
              />
            </div>
          </div>
          <div className="flightResults-flightCards">
            {bookingFlight.map((book, bookIndex) => {
              return (
                <AdminFlightItems
                  flightGrp={[{ ...bookingFlight[bookIndex].flight }]}
                  index={bookIndex}
                  bookingPage={true}
                  segIndex={segIndex}
                  key={book + 1}
                />
              );
            })}
          </div>

          <div className="flightResults-block">
            {bookingFlight.length > 1 ? (
              <div className="flightResults-nav">
                <div
                  className={
                    bookIndex === 0
                      ? "flightResults-nav-item flightResults-nav-item-selected"
                      : "flightResults-nav-item"
                  }
                  onClick={() => changeBookIndex(0)}
                >
                  {/* {"Depart"} */}
                  {`${bookingFlight[0]?.flightNew?.segments[0]?.originAirportCode}`}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="flightResults-nav-item-icon"
                  />
                  {`${bookingFlight[0]?.flightNew?.segments[0]?.destAirportCode}`}
                </div>
                <div
                  className={
                    bookIndex === 1
                      ? "flightResults-nav-item flightResults-nav-item-selected"
                      : "flightResults-nav-item"
                  }
                  onClick={() => changeBookIndex(1)}
                >
                  {/* {"Return"} */}
                  {`${bookingFlight[1]?.flightNew?.segments[0]?.originAirportCode}`}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="flightResults-nav-item-icon"
                  />
                  {`${bookingFlight[1]?.flightNew?.segments[0]?.destAirportCode}`}
                </div>
              </div>
            ) : bookingFlight.length === 1 &&
              bookingFlight[0].flightNew.segments.length > 1 ? (
              <div className="flightResults-nav">
                {bookingFlight[0].flightNew.segments.map((segment, index) => (
                  <div
                    key={index}
                    className={
                      segIndex === index
                        ? "flightResults-nav-item flightResults-nav-item-selected"
                        : "flightResults-nav-item"
                    }
                    onClick={() => setSegIndex(index)}
                  >
                    {`${segment.originAirportCode}`}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="flightResults-nav-item-icon"
                    />
                    {`${segment.destAirportCode}`}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          {bookingFlight[bookIndex].seatData &&
          bookingFlight[bookIndex].seatData[segIndex] &&
          actions.validSeatMap(bookingFlight[bookIndex].seatData[segIndex]) ? (
            <div className="flightBook-seatMap">
              {bookingFlight[bookIndex].seats &&
              bookingFlight[bookIndex].seats[segIndex] &&
              bookingFlight[bookIndex].seats[segIndex].length > 0 ? (
                <div className="flightBook-seatMap-seats">
                  Selected seats:
                  <div className="flightBook-seatMap-seats-routes">
                    {bookingFlight[bookIndex].flightNew.segments[
                      segIndex
                    ].segRoutes.map((route, r) => {
                      return (
                        <div className="flightBook-seatMap-seats-route">
                          <div className="flightBook-seatMap-seats-route-title">
                            {`${route.originCode}`}
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="flightBook-seatMap-seats-route-title-icon"
                            />
                            {`${route.destCode}`}
                          </div>
                          <div className="flightBook-seatMap-seats-route-seatCodes">
                            {bookingFlight[bookIndex].seats &&
                              bookingFlight[bookIndex].seats[segIndex] &&
                              bookingFlight[bookIndex].seats[segIndex][r] &&
                              Object.keys(
                                bookingFlight[bookIndex].seats[segIndex][r]
                              ).map((seatCode, c) => {
                                var type =
                                  c + 1 <= bookingFlight[bookIndex].adults
                                    ? "Adult"
                                    : c + 1 <=
                                      bookingFlight[bookIndex].child +
                                        bookingFlight[bookIndex].child
                                    ? "Child"
                                    : "Infant";
                                if (
                                  c ===
                                  Object.keys(
                                    bookingFlight[bookIndex].seats[segIndex][r]
                                  ).length -
                                    1
                                ) {
                                  return (
                                    <div>
                                      <span>
                                        {type === "Adult" ? (
                                          <FontAwesomeIcon icon={faUser} />
                                        ) : (
                                          <FontAwesomeIcon icon={faChild} />
                                        )}
                                        &nbsp;{c + 1}
                                      </span>
                                      &nbsp;{seatCode}
                                    </div>
                                  );
                                }
                                return (
                                  <div>
                                    <span>
                                      {type === "Adult" ? (
                                        <FontAwesomeIcon icon={faUser} />
                                      ) : (
                                        <FontAwesomeIcon icon={faChild} />
                                      )}
                                      &nbsp;{c + 1}
                                    </span>
                                    &nbsp;{seatCode},
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <button
                onClick={() => {
                  setSelectSeats(true);
                  setSeatData(
                    actions.fillUpSegmentSeats(
                      bookingFlight[bookIndex].seatData[segIndex].SegmentSeat
                    )
                  );
                  setSeatOpen(false);
                  setWingPosArr(
                    actions.getWingPosArr(
                      bookingFlight[bookIndex].seatData[segIndex].SegmentSeat
                    )
                  );
                  var selectedSeats = bookingFlight[bookIndex].seats.map(
                    (seg, sg) => {
                      var seatSegs = seg.map((seatSeg, se) => {
                        return Object.keys(seatSeg);
                      });
                      return seatSegs;
                    }
                  );
                  setSelectedSeats(selectedSeats);
                }}
              >
                Select seats
              </button>
            </div>
          ) : null}
          <div className="flightBook-seatMap">
            <button onClick={() => setOpenFareRules(true)}>Fare Rules</button>
          </div>
          <div className="flightBook-baggageMeals">
            <div className="flightBook-baggageMeals-title">
              Baggage and Meals
            </div>
            <div className="flightBook-baggageMeals-section">
              <div className="flightBook-baggageMeals-bag-block">
                <div className="flightBook-baggageMeals-bag-section">
                  <div className="flightBook-baggageMeals-bag-title">
                    Baggage details
                  </div>
                  <div className="flightBook-baggageMeals-bag-details-section">
                    {/* <div className="flightBook-baggageMeals-bag-route">
                  HYD - BLR
                </div> */}
                    <div className="flightBook-baggageMeals-bag-details">
                      {bookingFlight[bookIndex].baggageDtls?.cabinBaggage ? (
                        <div className="flightBook-baggageMeals-bag-detail">
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="flightBook-baggageMeals-bag-detail-icon"
                          />
                          Cabin baggage:
                          <span>
                            {bookingFlight[bookIndex].baggageDtls?.cabinBaggage}
                          </span>
                        </div>
                      ) : null}
                      {bookingFlight[bookIndex].baggageDtls?.baggage ? (
                        <div className="flightBook-baggageMeals-bag-detail">
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="flightBook-baggageMeals-bag-detail-icon"
                          />
                          Check-in baggage:
                          <span>
                            {bookingFlight[bookIndex].baggageDtls?.baggage}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-[10px]">
                <>
                  {bookIndex === 0 ? (
                    <>
                      {bookingFlight[bookIndex].baggageData &&
                      bookingFlight[bookIndex].baggageData.length > 0 ? (
                        <div className="flightBook-baggageMeals-bag-section">
                          <div className="flightBook-baggageMeals-bag-title">
                            Select extra baggage
                          </div>
                          {[...Array(bookingFlight[bookIndex].travellers)].map(
                            (trav, index) => {
                              return (
                                <>
                                  <span>
                                    {index + 1 <=
                                    Number(bookingFlight[bookIndex].adults)
                                      ? "Adult"
                                      : index + 1 <=
                                        Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(bookingFlight[bookIndex].child)
                                      ? "Child"
                                      : "Infant"}
                                    -
                                    {index + 1 <=
                                    Number(bookingFlight[bookIndex].adults)
                                      ? index + 1
                                      : index + 1 <=
                                        Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(bookingFlight[bookIndex].child)
                                      ? index +
                                        1 -
                                        Number(bookingFlight[bookIndex].adults)
                                      : index +
                                        1 -
                                        (Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(
                                            bookingFlight[bookIndex].child
                                          ))}
                                  </span>
                                  <br />
                                  <select
                                    onChange={(e) => {
                                      const selectedBagIndex =
                                        e.target.selectedIndex;
                                      setSelectedaBag((prev) => {
                                        const updatedUserDetails = [...prev];
                                        var traveler =
                                          updatedUserDetails[index] || {};
                                        traveler = e.target.value;
                                        updatedUserDetails[index] = traveler;
                                        return updatedUserDetails;
                                      });
                                      actions.handleMeal(
                                        e,
                                        "baggage",
                                        bookIndex,
                                        segIndex,
                                        index,
                                        selectedBagIndex
                                      );
                                    }}
                                    value={
                                      selectedBag[index]
                                        ? selectedBag[index]
                                        : "No Excess Baggage"
                                    }
                                  >
                                    {bookingFlight[bookIndex].baggageData[
                                      segIndex
                                    ].map((bag, i) => {
                                      if (bag.Weight === 0) {
                                        return (
                                          <option key={i}>
                                            No excess baggage
                                          </option>
                                        );
                                      } else {
                                        return (
                                          <option key={i}>
                                            {`${bag.Weight}KG at Rs ${
                                              bag.Price
                                            } ${bag.Text ? bag.Text : ""}`}{" "}
                                          </option>
                                        );
                                      }
                                    })}
                                  </select>
                                  <br />
                                </>
                              );
                            }
                          )}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {bookingFlight[bookIndex].baggageData &&
                      bookingFlight[bookIndex].baggageData.length > 0 ? (
                        <div className="flightBook-baggageMeals-bag-section">
                          <div className="flightBook-baggageMeals-bag-title">
                            Select extra baggage
                          </div>
                          {[...Array(bookingFlight[bookIndex].travellers)].map(
                            (trav, index) => {
                              return (
                                <>
                                  <span>
                                    {index + 1 <=
                                    Number(bookingFlight[bookIndex].adults)
                                      ? "Adult"
                                      : index + 1 <=
                                        Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(bookingFlight[bookIndex].child)
                                      ? "Child"
                                      : "Infant"}
                                    -
                                    {index + 1 <=
                                    Number(bookingFlight[bookIndex].adults)
                                      ? index + 1
                                      : index + 1 <=
                                        Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(bookingFlight[bookIndex].child)
                                      ? index +
                                        1 -
                                        Number(bookingFlight[bookIndex].adults)
                                      : index +
                                        1 -
                                        (Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(
                                            bookingFlight[bookIndex].child
                                          ))}
                                  </span>
                                  <br />
                                  <select
                                    onChange={(e) => {
                                      const selectedBagIndex =
                                        e.target.selectedIndex;
                                      actions.handleMeal(
                                        e,
                                        "baggage",
                                        bookIndex,
                                        segIndex,
                                        index,
                                        selectedBagIndex
                                      );
                                      setSelectedaBag2((prev) => {
                                        const updatedUserDetails = [...prev];
                                        var traveler =
                                          updatedUserDetails[index] || {};
                                        traveler = e.target.value;
                                        updatedUserDetails[index] = traveler;
                                        return updatedUserDetails;
                                      });
                                    }}
                                    value={
                                      selectedBag2[index]
                                        ? selectedBag2[index]
                                        : "No Excess Baggage"
                                    }
                                  >
                                    {bookingFlight[bookIndex].baggageData[
                                      segIndex
                                    ].map((bag, i) => {
                                      if (bag.Weight === 0) {
                                        return (
                                          <option key={i}>
                                            No excess baggage
                                          </option>
                                        );
                                      } else {
                                        return (
                                          <option key={i}>{`${
                                            bag.Weight
                                          }KG at Rs ${bag.Price} ${
                                            bag.Text ? bag.Text : ""
                                          }`}</option>
                                        );
                                      }
                                    })}
                                  </select>
                                  <br />
                                </>
                              );
                            }
                          )}
                        </div>
                      ) : null}
                    </>
                  )}
                </>
                <>
                  {bookIndex === 0 ? (
                    <>
                      {bookingFlight[bookIndex].mealData &&
                      bookingFlight[bookIndex].mealData.length > 0 ? (
                        <div className="flightBook-baggageMeals-meal-block">
                          <div className="flightBook-baggageMeals-bag-section flightBook-baggageMeals-bag-section-last">
                            <div className="flightBook-baggageMeals-bag-title">
                              Select add-on meal
                            </div>
                            {[
                              ...Array(bookingFlight[bookIndex].travellers),
                            ].map((trav, index) => {
                              return (
                                <div className="flightBook-baggageMeals-bag-section-select">
                                  <span>
                                    {index + 1 <=
                                    Number(bookingFlight[bookIndex].adults)
                                      ? "Adult"
                                      : index + 1 <=
                                        Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(bookingFlight[bookIndex].child)
                                      ? "Child"
                                      : "Infant"}
                                    -
                                    {index + 1 <=
                                    Number(bookingFlight[bookIndex].adults)
                                      ? index + 1
                                      : index + 1 <=
                                        Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(bookingFlight[bookIndex].child)
                                      ? index +
                                        1 -
                                        Number(bookingFlight[bookIndex].adults)
                                      : index +
                                        1 -
                                        (Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(
                                            bookingFlight[bookIndex].child
                                          ))}
                                  </span>
                                  <select
                                    onChange={(e) => {
                                      const selectedMealIndex =
                                        e.target.selectedIndex;
                                      actions.handleMeal(
                                        e,
                                        "meal",
                                        bookIndex,
                                        segIndex,
                                        index,
                                        selectedMealIndex
                                      );
                                    }}
                                    value={`${bookingFlight[bookIndex].selectedMeals[segIndex][index].mealDesc} -> Rs ${bookingFlight[bookIndex].selectedMeals[segIndex][index].price}`}
                                  >
                                    {bookingFlight[bookIndex].mealData[
                                      segIndex
                                    ].map((meal, i) => {
                                      if (meal.Quantity === 0) {
                                        return (
                                          <option key={i}>
                                            No add-on meal
                                          </option>
                                        );
                                      } else {
                                        return (
                                          <option
                                            key={i}
                                          >{`${meal.AirlineDescription} -> Rs ${meal.Price}`}</option>
                                        );
                                      }
                                    })}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {bookingFlight[bookIndex].mealData &&
                      bookingFlight[bookIndex].mealData.length > 0 ? (
                        <div className="flightBook-baggageMeals-meal-block">
                          <div className="flightBook-baggageMeals-bag-section flightBook-baggageMeals-bag-section-last">
                            <div className="flightBook-baggageMeals-bag-title">
                              Select add-on meal
                            </div>
                            {[
                              ...Array(bookingFlight[bookIndex].travellers),
                            ].map((trav, index) => {
                              return (
                                <div className="flightBook-baggageMeals-bag-section-select">
                                  <span>
                                    {index + 1 <=
                                    Number(bookingFlight[bookIndex].adults)
                                      ? "Adult"
                                      : index + 1 <=
                                        Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(bookingFlight[bookIndex].child)
                                      ? "Child"
                                      : "Infant"}
                                    -
                                    {index + 1 <=
                                    Number(bookingFlight[bookIndex].adults)
                                      ? index + 1
                                      : index + 1 <=
                                        Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(bookingFlight[bookIndex].child)
                                      ? index +
                                        1 -
                                        Number(bookingFlight[bookIndex].adults)
                                      : index +
                                        1 -
                                        (Number(
                                          bookingFlight[bookIndex].adults
                                        ) +
                                          Number(
                                            bookingFlight[bookIndex].child
                                          ))}
                                  </span>
                                  <select
                                    onChange={(e) => {
                                      const selectedMealIndex =
                                        e.target.selectedIndex;
                                      actions.handleMeal(
                                        e,
                                        "meal",
                                        bookIndex,
                                        segIndex,
                                        index,
                                        selectedMealIndex
                                      );
                                    }}
                                    value={`${bookingFlight[bookIndex].selectedMeals[segIndex][index].mealDesc} -> Rs ${bookingFlight[bookIndex].selectedMeals[segIndex][index].price}`}
                                  >
                                    {bookingFlight[bookIndex].mealData[
                                      segIndex
                                    ].map((meal, i) => {
                                      if (meal.Quantity === 0) {
                                        return (
                                          <option key={i}>
                                            No add-on meal
                                          </option>
                                        );
                                      } else {
                                        return (
                                          <option
                                            key={i}
                                          >{`${meal.AirlineDescription} -> Rs ${meal.Price}`}</option>
                                        );
                                      }
                                    })}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </>
              </div>
            </div>
          </div>

          {bookingFlight[bookIndex].flight.MiniFareRules &&
          bookingFlight[bookIndex].flight.MiniFareRules[segIndex] ? (
            <div className="flightBook-cancel">
              <div className="flightBook-cancel-title">
                Cancellation and date change
              </div>
              <div className="flightBook-cancel-section">
                <div className="flightBook-cancel-details">
                  <div className="flightBook-cancel-details-title">
                    Cancellation
                  </div>
                  {bookingFlight[bookIndex]?.flight?.MiniFareRules[segIndex] &&
                    bookingFlight[bookIndex]?.flight?.MiniFareRules[segIndex]
                      .map((rule, r) => {
                        if (rule.Type === "Cancellation") {
                          return (
                            <div className="flightBook-cancel-details-text">
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="flightBook-cancel-details-text-icon"
                              />
                              {rule.To === null ||
                              rule.From === null ||
                              rule.Unit === null
                                ? ""
                                : rule.To === ""
                                ? `> ${rule.From} ${rule.Unit} of departure date`
                                : rule.From === "0"
                                ? `0- ${rule.To}  ${rule.Unit} of departure date`
                                : `Between ${rule.To} & ${rule.From} ${rule.Unit} of departure date`}
                              <span
                                className={
                                  rule.To === null ||
                                  rule.From === null ||
                                  rule.Unit === null
                                    ? "flightBook-cancel-details-text-details"
                                    : ""
                                }
                              >
                                {rule.Details}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })
                      .filter((rule, r) => rule !== null)}
                </div>
                <div className="flightBook-cancel-details flightBook-cancel-details-last">
                  <div className="flightBook-cancel-details-title">
                    Date change
                  </div>
                  {bookingFlight[bookIndex].flight.MiniFareRules[segIndex] &&
                    bookingFlight[bookIndex].flight.MiniFareRules[segIndex]
                      .map((rule, r) => {
                        if (rule.Type === "Reissue") {
                          return (
                            <div className="flightBook-cancel-details-text">
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="flightBook-cancel-details-text-icon"
                              />
                              {rule.To === null ||
                              rule.From === null ||
                              rule.Unit === null
                                ? ""
                                : rule.To === ""
                                ? `> ${rule.From} ${rule.Unit} of departure date`
                                : rule.From === "0"
                                ? `0- ${rule.To} ${rule.Unit} of departure date`
                                : `Between ${rule.To} & ${rule.From} ${rule.Unit} of departure date`}
                              <span
                                className={
                                  rule.To === null ||
                                  rule.From === null ||
                                  rule.Unit === null
                                    ? "flightBook-cancel-details-text-details"
                                    : ""
                                }
                              >
                                {rule.Details}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })
                      .filter((rule, r) => rule !== null)}
                </div>
              </div>
            </div>
          ) : null}
          <div className="flghtBook-fareRules">
            <div className="flightBook-fareRules-imp">
              <span>*Important</span>The airline fee is indicative. We do not
              guarantee the accuracy of this information. All fees mentioned are
              per passenger. Date change charges are applicable only on
              selecting the same airline on a new date. The difference in fares
              between the old and the new booking will also be payable by the
              user. If you require further information, please refer the Airline
              website for detailed fare rales for different fare types.
            </div>
          </div>
        </div>
        <div className="flightBook-fare">
          <div
            className={
              fareIsOpen
                ? "flightBook-fare-openDtls flightBook-fare-openDtls-open"
                : "flightBook-fare-openDtls"
            }
          >
            <FontAwesomeIcon
              icon={faChevronUp}
              className="flightBook-fare-openDtls-icon"
              onClick={(e) => toggleUp(e, "#flightBook-fare-section")}
            />
          </div>
          <div
            className="flightBook-fare-section"
            id="flightBook-fare-section"
            style={{ display: "none", cursor: "default" }}
          >
            <div className="flightBook-fare-fareItem flightBook-fare-fareItem-flightFare">
              {bookingFlight.length === 1 &&
              bookingFlight[0].flightNew.segments.length > 1 ? (
                <>
                  <div className="flex justify-between">
                    <div className="flightBook-fare-fareItem-title">
                      Flight fare
                    </div>
                    <div className="flightBook-fare-fareItem-value">
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="flightBook-fare-fareItem-value-icon"
                      />
                      {` ${
                        bookingFlight[bookIndex].flight.Fare.OfferedFare
                          ? Math.ceil(
                              bookingFlight[bookIndex].flight.Fare.OfferedFare
                            ).toLocaleString("en-IN")
                          : Math.ceil(
                              bookingFlight[bookIndex].flight.Fare.PublishedFare
                            ).toLocaleString("en-IN")
                      }`}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flightBook-fare-fareItem-title">
                      Service fee
                    </div>
                    <div className="flightBook-fare-fareItem-value">
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="flightBook-fare-fareItem-value-icon"
                      />
                      {` ${bookingFlight[
                        bookIndex
                      ]?.finalFlightServiceCharge.toLocaleString("en-IN")}`}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flightBook-fare-fareItem-title">GST</div>
                    <div className="flightBook-fare-fareItem-value">
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="flightBook-fare-fareItem-value-icon"
                      />
                      {` ${bookingFlight[
                        bookIndex
                      ]?.gstInFinalserviceCharge.toLocaleString("en-IN")}`}
                    </div>
                  </div>
                </>
              ) : (
                bookingFlight.map((book, b) => {
                  const serviceFee = book?.finalFlightServiceCharge;
                  const GST = book?.gstInFinalserviceCharge;
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flightBook-fare-fareItem-title">
                          <span>{`${book.flightNew.segments[0].originAirportCode}`}</span>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="flightBook-fare-fareItem-title-icon"
                          />
                          <span>{`${book.flightNew.segments[0].destAirportCode}`}</span>
                        </div>
                        <div className="flightBook-fare-fareItem-value">
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className="flightBook-fare-fareItem-value-icon"
                          />
                          {` ${
                            book.flight.Fare.OfferedFare
                              ? Math.ceil(
                                  book.flight.Fare.OfferedFare
                                ).toLocaleString("en-IN")
                              : Math.ceil(
                                  book.flight.Fare.PublishedFare
                                ).toLocaleString("en-IN")
                          }`}
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-[100%]">
                        <p className="text-[16px] py-1 font-semibold">
                          Service Charges
                        </p>
                        <p className="text-[16px] text-[#94D2BD] font-semibold">
                          {" "}
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className="flightBook-fare-fareItem-value-icon"
                          />
                          {Math.ceil(serviceFee)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center w-[100%]">
                        <p className="text-[14px] py-1 font-semibold">GST</p>
                        <p className="text-[14px] text-[#94D2BD] font-semibold">
                          {" "}
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className="flightBook-fare-fareItem-value-icon"
                          />
                          {Math.ceil(GST)}
                        </p>
                      </div>
                    </>
                  );
                })
              )}
            </div>
            {totalBaggagePrice ? (
              <div className="flightBook-fare-fareItem">
                <div className="flightBook-fare-fareItem-title">
                  Excess baggage
                </div>
                <div className="flightBook-fare-fareItem-value">
                  {"+ "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightBook-fare-fareItem-value-icon"
                  />
                  {` ${totalBaggagePrice.toLocaleString("en-IN")}`}
                </div>
              </div>
            ) : null}
            {totalMealPrice ? (
              <div className="flightBook-fare-fareItem">
                <div className="flightBook-fare-fareItem-title">
                  Add-on meal
                </div>
                <div className="flightBook-fare-fareItem-value">
                  {"+ "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightBook-fare-fareItem-value-icon"
                  />
                  {` ${totalMealPrice.toLocaleString("en-IN")}`}
                </div>
              </div>
            ) : null}
            {totalSeatCharges ? (
              <div className="flightBook-fare-fareItem">
                <div className="flightBook-fare-fareItem-title">
                  Seat Charges
                </div>
                <div className="flightBook-fare-fareItem-value">
                  {"+ "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightBook-fare-fareItem-value-icon"
                  />
                  {` ${totalSeatCharges?.toLocaleString("en-IN")}`}
                </div>
              </div>
            ) : null}
          </div>
          <div className="flightBook-fare-box">
            <div className="flightBook-fare-totalFare">
              <div className="flightBook-fare-totalFare-title">Total fare</div>
              <div className="flightBook-fare-totalFare-value">
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="flightBook-fare-totalFare-value-icon"
                />
                {` ${Math.ceil(finalPrice)?.toLocaleString("en-IN")}`}
              </div>
            </div>
            {/* <div className="flightBook-fare-submit">
            {adminUserId ? (
              <button>Add to trip</button>
            ) : (
              <>
                {selectedTripId ? (
                  <div className="flightBook-fare-existing">
                    Do you want to add to{" "}
                    {selectedTrip?.data?.name
                      ? selectedTrip?.data?.name
                      : selectedTripId}{" "}
                    trip
                    <div>
                      <button
                        onClick={() => {
                          navigate(`/trips/${selectedTripId}`, {
                            state: { userId: userId },
                          });
                          actions.editTripById(
                            selectedTripId,
                            bookingFlight,
                            "flights"
                          );
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
                      setSubmitIsOpen(true);
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
        <div className="flightBook-fare-desktop">
          <div
            className="flightBook-fare-section-desktop"
            id="flightBook-fare-section"
          >
            <div className="flightBook-fare-fareItem flightBook-fare-fareItem-flightFare">
              {bookingFlight.length === 1 &&
              bookingFlight[0].flightNew.segments.length > 1 ? (
                <>
                  <div className="flex items-center flex-row justify-between">
                    <div className="flightBook-fare-fareItem-title">
                      Flight fare
                    </div>
                    <div className="flightBook-fare-fareItem-value">
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="flightBook-fare-fareItem-value-icon"
                      />
                      {` ${
                        bookingFlight[bookIndex].flight.Fare.OfferedFare
                          ? Math.ceil(
                              bookingFlight[bookIndex].flight.Fare.OfferedFare
                            ).toLocaleString("en-IN")
                          : Math.ceil(
                              bookingFlight[bookIndex].flight.Fare.PublishedFare
                            ).toLocaleString("en-IN")
                      }`}
                    </div>
                  </div>
                  <div className="flex justify-between flex-row items-center w-[100%]">
                    <p className="text-[14px] py-1">Service Charges</p>
                    <p className="text-[14px] text-[#94D2BD] font-semibold">
                      {" "}
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="flightBook-fare-fareItem-value-icon"
                      />
                      {Math.ceil(
                        bookingFlight[bookIndex]?.finalFlightServiceCharge
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between flex-row items-center w-[100%]">
                    <p className="text-[14px] py-1">GST</p>
                    <p className="text-[14px] text-[#94D2BD] font-semibold">
                      {" "}
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="flightBook-fare-fareItem-value-icon"
                      />
                      {Math.ceil(
                        bookingFlight[bookIndex]?.gstInFinalserviceCharge
                      )}
                    </p>
                  </div>
                </>
              ) : (
                bookingFlight.map((book, b) => {
                  console.log(book);
                  const serviceFee = book?.finalFlightServiceCharge;
                  const GST = book?.gstInFinalserviceCharge;
                  const seatCharges = totalSeatCharges ? totalSeatCharges : 0;
                  const baggage = totalBaggagePrice ? totalBaggagePrice : 0;
                  const meals = totalMealPrice ? totalMealPrice : 0;
                  const total = seatCharges + meals + baggage;
                  return (
                    <>
                      <div className="flightBook-fare-fareItem-title !border-b-[1px] !border-dashed border-[#c8c8c8] mt-2">
                        <div className="flex items-center flex-row justify-between">
                          <div>
                            <span>
                              {`${book.flightNew.segments[0].originAirportCode}`}
                            </span>
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="flightBook-fare-fareItem-title-icon"
                            />
                            <span>{`${book.flightNew.segments[0].destAirportCode}`}</span>
                          </div>
                          <div>
                            {" "}
                            <FontAwesomeIcon
                              icon={faIndianRupeeSign}
                              className="flightBook-fare-fareItem-value-icon"
                            />
                            {Math.ceil(book?.flight?.Fare?.OfferedFare)}
                          </div>
                        </div>
                        <div className="flex justify-between flex-row items-center w-[100%]">
                          <p className="text-[14px] py-1">Service Charges</p>
                          <p className="text-[14px]">
                            {" "}
                            <FontAwesomeIcon
                              icon={faIndianRupeeSign}
                              className="flightBook-fare-fareItem-value-icon"
                            />
                            {Math.ceil(serviceFee)}
                          </p>
                        </div>
                        <div className="flex justify-between flex-row items-center w-[100%]">
                          <p className="text-[14px] py-1">GST</p>
                          <p className="text-[14px]">
                            {" "}
                            <FontAwesomeIcon
                              icon={faIndianRupeeSign}
                              className="flightBook-fare-fareItem-value-icon"
                            />
                            {Math.ceil(GST)}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })
              )}
            </div>
            {totalBaggagePrice ? (
              <div className="flightBook-fare-fareItem">
                <div className="flightBook-fare-fareItem-title inline-block !text-[13px]">
                  Excess baggage
                </div>
                <div className="flightBook-fare-fareItem-value float-right !text-[13px]">
                  {"+ "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightBook-fare-fareItem-value-icon"
                  />
                  {` ${totalBaggagePrice.toLocaleString("en-IN")}`}
                </div>
              </div>
            ) : null}
            {totalMealPrice ? (
              <div className="flightBook-fare-fareItem">
                <div className="flightBook-fare-fareItem-title inline-block !text-[13px]">
                  Add-on meal
                </div>
                <div className="flightBook-fare-fareItem-value float-right !text-[13px]">
                  {"+ "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightBook-fare-fareItem-value-icon"
                  />
                  {` ${totalMealPrice.toLocaleString("en-IN")}`}
                </div>
              </div>
            ) : null}
            {totalSeatCharges ? (
              <div className="flightBook-fare-fareItem">
                <div className="flightBook-fare-fareItem-title inline-block !text-[13px]">
                  Seat Charges
                </div>
                <div className="flightBook-fare-fareItem-value float-right !text-[13px]">
                  {"+ "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightBook-fare-fareItem-value-icon"
                  />
                  {` ${totalSeatCharges?.toLocaleString("en-IN")}`}
                </div>
              </div>
            ) : null}
          </div>
          <div className="flightBook-fare-totalFare">
            <div className="flightBook-fare-totalFare-title">Total fare</div>
            <div className="flightBook-fare-totalFare-value">
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="flightBook-fare-totalFare-value-icon"
              />
              <p>{finalPrice}</p>
            </div>
          </div>
          <div className="flightBook-fare-submit">
            {/* {adminUserId ? (
            <button
              onClick={() => {
                setAdminSubmitIsOpen(true);
              }}
            >
              Add to Trip
            </button>
          ) : (
            <>
              {selectedTripId ? (
                <div className="flightBook-fare-existing">
                  Do you want to add to{" "}
                  {selectedTrip?.data?.name
                    ? selectedTrip?.data?.name
                    : selectedTripId}{" "}
                  trip
                  <div>
                    <button
                      onClick={() => {
                        navigate(`/trips/${selectedTripId}`, {
                          state: { userId: userId },
                        });
                        actions.editTripById(
                          selectedTripId,
                          bookingFlight,
                          "flights"
                        );
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
                    setSubmitIsOpen(true);
                  }}
                >
                  Add to trip
                </button>
              )}
            </>
          )} */}
            <button
              onClick={() => {
                addtoTrip(tripId, userId);
                navigate(`/users/${userId}/trips/${tripId}`);
              }}
            >
              Add to Trip
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFlightBooking;
