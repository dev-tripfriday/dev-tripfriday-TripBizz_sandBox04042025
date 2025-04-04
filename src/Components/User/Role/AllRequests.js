import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../Flights/FlightSearch/Navbar";
import MyContext from "../../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import {
  faBan,
  faCheckCircle,
  faChevronUp,
  faIndianRupeeSign,
  faPlaneDeparture,
  faPlus,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { ClipLoader, ScaleLoader } from "react-spinners";
import firebase from "firebase/compat/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./Role.css";
import Popup from "../../Popup";
const AllRequests = () => {
  const navigate = useNavigate();
  var {
    actions,
    notifications,
    teamMembers,
    userAccountDetails,
    approveAllLoading,
    managerRequestLoading,
    tripData,
  } = useContext(MyContext);
  const [allRequesData, setAllRequesData] = useState([]);
  const [openTrip, setOpenTrip] = useState(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  var [airlinelogos, setAirlinelogos] = useState([]);
  var getAllTripData = async () => {
    // var data = await actions.getTripsForApproval(
    //   userAccountDetails?.approvalRequests
    // );
    const newTrips = await actions.getAllTripsForApproval(
      userAccountDetails?.approvalRequests
    );
    console.log(newTrips);
    setAllRequesData(newTrips);
  };
  const getData = async () => {
    const db = firebase.firestore();
    const AccountsCollectionRef = collection(db, "airlinelogos");
    const docSnap = await getDocs(AccountsCollectionRef);
    var updatedAirlinelogos = [];
    docSnap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      updatedAirlinelogos.push({ id: doc.id, url: doc.data().url });
      setAirlinelogos({ ...setAirlinelogos, [doc.id]: doc.data().url });
    });
    setAirlinelogos(updatedAirlinelogos);
  };
  var handleApprove = async (trip, req) => {
    console.log(req);
    setLoading(true);
    await actions.approveTripRequest(req, userAccountDetails?.userid);
    await actions.updateAdminTripAccepted(trip, req);
    setOpenTrip(false);
    setLoading(false);

    await getAllTripData();
  };
  useEffect(() => {
    getAllTripData();
    getData();
  }, []);
  var getDate = (seconds) => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const dayofyear = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });
    var dateString = `${month.slice(0, 3)} ${dayOfWeek} ${dayofyear}`;
    return dateString;
  };
  return (
    <div>
      <Popup condition={openTrip} close={() => setOpenTrip(false)}>
        <div className="role-trip-section">
          <div className="role-review">
            <div className="role-review-hotels">
              <div className="role-review-hotels-header">
                {trip?.tripDetails?.hotels.length > 0 ? <>Hotels</> : null}
              </div>
              {trip?.tripDetails?.hotels?.map((hotel) => {
                const monthNames = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                const startdate = new Date(
                  hotel?.data?.hotelSearchQuery?.checkInDate.seconds * 1000
                );
                const formattedDate1 = `${
                  monthNames[startdate.getMonth()]
                } ${startdate.getDate()}`;
                var endDate = getDate(
                  hotel?.data?.hotelSearchQuery?.checkOutDate.seconds
                );
                // var adults = hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
                //   (acc, obj) => {
                //     acc.adults += parseInt(obj.adults, 10);
                //     acc.child += parseInt(obj.child, 10);
                //     return acc;
                //   },
                //   { adults: 0, child: 0 }
                // );
                const adults =
                  trip?.tripDetails?.data?.travellerDetails[hotel.id]?.adults;
                const child =
                  trip?.tripDetails?.data?.travellerDetails[hotel.id]?.children;
                return (
                  <>
                    <div className="role-hotel-card">
                      <div className="role-hotel-details">
                        <div className="role-hotel-name">
                          {
                            hotel?.data?.hotelInfo?.HotelInfoResult
                              ?.HotelDetails?.HotelName
                          }
                        </div>
                        <div className="role-hotel-people">
                          Adults-{adults?.adults} Child-{adults?.child}
                        </div>
                        <div className="role-hotel-date">
                          <span>
                            {formattedDate1}-{endDate}
                          </span>{" "}
                          ({hotel?.data?.hotelSearchQuery?.hotelNights} Nights)
                        </div>
                      </div>
                      {hotel?.data?.selectedRoomType &&
                        hotel?.data?.selectedRoomType.map((room, f) => {
                          return (
                            <div className="role-roomDtls-room">
                              <div className="role-roomDtls-room-titleSection">
                                <div className="role-roomDtls-room-type">
                                  {room.RoomTypeName}
                                </div>
                                <div className="role-roomDtls-room-price">
                                  <FontAwesomeIcon
                                    icon={faIndianRupeeSign}
                                    className="role-roomDtls-room-price-icon"
                                  />
                                  {`${
                                    room.Price.OfferedPriceRoundedOff
                                      ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                                          "en-IN"
                                        )
                                      : room.Price.PublishedPriceRoundedOff.toLocaleString(
                                          "en-IN"
                                        )
                                  }`}
                                </div>
                              </div>
                              <div className="role-roomDtls-room-otherSection">
                                <div className="role-roomDtls-room-meals">
                                  <FontAwesomeIcon
                                    icon={faUtensils}
                                    className="role-roomDtls-room-meals-icon"
                                  />
                                  {room.Inclusion && room.Inclusion.length > 0
                                    ? actions.checkForTboMeals(room.Inclusion)
                                    : "No meals"}
                                </div>
                                <div className="role-roomDtls-room-cancel">
                                  {room.LastCancellationDate &&
                                  actions.validCancelDate(
                                    room.LastCancellationDate
                                  ) ? (
                                    <>
                                      <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="role-roomDtls-room-cancel-icon"
                                      />
                                      {`Free cancellation upto ${new Date(
                                        room.LastCancellationDate
                                      )
                                        .toString()
                                        .slice(4, 10)}`}
                                    </>
                                  ) : (
                                    <>
                                      <FontAwesomeIcon
                                        icon={faBan}
                                        className="role-roomDtls-room-cancel-icon"
                                      />
                                      {"Non-refundable"}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="role-travellers-hotel">
                      <div className="role-trip-city">Traveller Details</div>
                      <div className="role-traveller-container">
                        {adults?.map((trav, i) => {
                          return (
                            <>
                              <div className="role-traveller-block">
                                <div className="role-traveller-header">
                                  Traveller-{i + 1}
                                </div>
                                <div className="role-traveller-box">
                                  <div>
                                    Gender:<span>{trav.gender}</span>{" "}
                                  </div>
                                  <div>
                                    First Name:<span>{trav.firstName}</span>{" "}
                                  </div>
                                  <div>
                                    Last Name:<span>{trav.lastName}</span>{" "}
                                  </div>
                                  {i === 0 && (
                                    <>
                                      <div>
                                        Email:<span>{trav.email}</span>{" "}
                                      </div>
                                      <div>
                                        Mobile Number:
                                        <span>{trav.mobileNumber}</span>{" "}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })}
                        <h1>{child && "Children"}</h1>
                        {child &&
                          child?.map((trav, i) => {
                            console.log(trav);
                            return (
                              <>
                                <div className="role-traveller-block">
                                  <div className="role-traveller-header">
                                    Traveller-{i + 1}
                                  </div>
                                  <div className="role-traveller-box">
                                    <div>
                                      Gender:<span>{trav.gender}</span>{" "}
                                    </div>
                                    <div>
                                      First Name:<span>{trav.firstName}</span>{" "}
                                    </div>
                                    <div>
                                      Last Name:<span>{trav.lastName}</span>{" "}
                                    </div>
                                    {i === 0 && (
                                      <>
                                        <div>
                                          Email:<span>{trav.email}</span>{" "}
                                        </div>
                                        <div>
                                          Mobile Number:
                                          <span>{trav.mobileNumber}</span>{" "}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            <div className="role-review-flights">
              <div className="role-review-flights-header">
                {trip?.tripDetails?.flights.length > 0 ? <>Flights</> : null}
              </div>
              {trip?.tripDetails?.flights?.map((flight) => {
                var airlinename =
                  flight?.data[0]?.flightNew?.segments[0]?.airlineName;
                var airline = airlinelogos?.filter((a) => {
                  return airlinename?.toLowerCase() === a?.id;
                });
                var flightArr = [flight?.data[0]?.flight].map((flight, f) => {
                  return { ...actions.modifyFlightObject(flight) };
                });
                if (flight?.data[0]?.flightNew?.segments.length > 1) {
                  return (
                    <>
                      <div className="role-flight-card">
                        <div className="role-flight-segment-block">
                          {flightArr[0].segments.map((segment, sg) => {
                            var flightCode = "";
                            segment.flightCodes.forEach((code, c) => {
                              if (c === segment.flightCodes.length - 1) {
                                flightCode += code;
                              } else {
                                flightCode += `${code}, `;
                              }
                            });

                            return (
                              <>
                                <div className="role-flight-airline-block">
                                  <div className="role-flight-airline">
                                    {airline[0] ? (
                                      <div className="role-flight-logo">
                                        <span
                                          style={{
                                            backgroundImage: `url(${airline[0]?.url})`,
                                          }}
                                        ></span>
                                      </div>
                                    ) : (
                                      <div className="role-flight-logo">
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faPlaneDeparture}
                                            className="role-flight-logo-icon"
                                          />
                                        </span>
                                      </div>
                                    )}
                                    {`${segment.airlineName}`}
                                    <span>&nbsp;&nbsp;({flightCode})</span>
                                  </div>
                                  <div className="role-flight-depDate-block">
                                    <div className="role-flight-depDate">
                                      {segment.depTimeDate
                                        .toString()
                                        .slice(4, 10)}
                                    </div>
                                  </div>
                                </div>
                                <div className="role-flight-segment-section">
                                  <div className="role-flight-arrDep">
                                    <div className="role-flight-dep">
                                      <div className="role-flight-depTime">
                                        {segment.depTime}
                                      </div>
                                      <div className="role-flight-depCity">
                                        {segment.originAirportCode}
                                      </div>
                                    </div>
                                    <div className="role-flight-duration">
                                      <div className="role-flight-duration-stopPts">
                                        <div className="role-flight-duration-stopType">
                                          {segment.stopOverPts.length === 0
                                            ? "Direct"
                                            : `${
                                                segment.stopOverPts.length > 1
                                                  ? `${segment.stopOverPts.length} stops`
                                                  : "1 stop"
                                              }`}
                                          {segment.stopOverPts.length !== 0 ? (
                                            <FontAwesomeIcon
                                              icon={faChevronUp}
                                              className="role-flight-duration-stopType-icon"
                                            />
                                          ) : null}
                                        </div>
                                      </div>
                                      <div className="role-flight-duration-time">
                                        {segment.finalTime === "NaNm"
                                          ? segment.duration
                                          : segment.finalTime}
                                      </div>
                                    </div>
                                    <div className="role-flight-arr-section">
                                      <div className="role-flight-dep role-flight-arr">
                                        <div className="role-flight-depTime">
                                          {segment.arrTime}
                                        </div>
                                        <div className="role-flight-depCity">
                                          {segment.destAirportCode}
                                        </div>
                                      </div>
                                      {segment.arrAfterDays > 0 ? (
                                        <div className="role-flight-depTime-afterDays">
                                          <div className="role-flight-depTime-afterDays-num">{`+ ${segment.arrAfterDays}`}</div>
                                          <div>{`${
                                            segment.arrAfterDays > 1
                                              ? "Days"
                                              : "Day"
                                          }`}</div>
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                        <div className="role-flight-segment-price">
                          &nbsp;
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className="role-flight-segment-price-icon"
                          />
                          {`${flightArr[0].fare.toLocaleString("en-IN")}`}
                        </div>
                      </div>
                      <div className="role-travellers-flight">
                        <div className="role-trip-city">Traveller Details</div>
                        <div className="role-traveller-container">
                          {trip?.tripDetails?.data?.travellerDetail ? (
                            <>
                              {trip?.tripDetails?.data?.travellerDetail[
                                flight.id
                              ]?.map((trav, i) => {
                                return (
                                  <>
                                    <div className="role-traveller-block">
                                      <div className="role-traveller-header">
                                        Traveller-{i + 1}
                                      </div>
                                      <div className="role-traveller-box">
                                        <div>
                                          First Name:
                                          <span>{trav.firstName}</span>{" "}
                                        </div>
                                        <div>
                                          Last Name:<span>{trav.lastName}</span>{" "}
                                        </div>
                                        <div>
                                          Email:<span>{trav.email}</span>{" "}
                                        </div>
                                        <div>
                                          Mobile Number:
                                          <span>{trav.mobileNumber}</span>{" "}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            <>
                              {trip?.tripDetails?.data?.travellerDetails[
                                flight.id
                              ]?.map((trav, i) => {
                                return (
                                  <>
                                    <div className="role-traveller-block">
                                      <div className="role-traveller-header">
                                        Traveller-{i + 1}
                                      </div>
                                      <div className="role-traveller-box">
                                        <div>
                                          First Name:
                                          <span>{trav.firstName}</span>{" "}
                                        </div>
                                        <div>
                                          Last Name:<span>{trav.lastName}</span>{" "}
                                        </div>
                                        <div>
                                          Email:<span>{trav.email}</span>{" "}
                                        </div>
                                        <div>
                                          Mobile Number:
                                          <span>{trav.mobileNumber}</span>{" "}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  );
                }
                const adults =
                  trip?.tripDetails?.data?.travellerDetails[flight.id]?.adults;
                const child =
                  trip?.tripDetails?.data?.travellerDetails[flight.id]
                    ?.children;
                const infants =
                  trip?.tripDetails?.data?.travellerDetails[flight.id]?.infants;
                console.log(
                  trip?.tripDetails?.data?.travellerDetails[flight.id]
                );
                return (
                  <>
                    <div className="role-flight-card">
                      <div className="role-flight-segment-block">
                        {flightArr[0].segments.map((segment, sg) => {
                          var flightCode = "";
                          segment.flightCodes.forEach((code, c) => {
                            if (c === segment.flightCodes.length - 1) {
                              flightCode += code;
                            } else {
                              flightCode += `${code}, `;
                            }
                          });

                          return (
                            <>
                              <div className="role-flight-airline-block">
                                <div className="role-flight-airline">
                                  {airline[0] ? (
                                    <div className="role-flight-logo">
                                      <span
                                        style={{
                                          backgroundImage: `url(${airline[0]?.url})`,
                                        }}
                                      ></span>
                                    </div>
                                  ) : (
                                    <div className="role-flight-logo">
                                      <span>
                                        <FontAwesomeIcon
                                          icon={faPlaneDeparture}
                                          className="role-flight-logo-icon"
                                        />
                                      </span>
                                    </div>
                                  )}
                                  {`${segment.airlineName}`}
                                  <span>&nbsp;&nbsp;({flightCode})</span>
                                </div>
                                <div className="role-flight-depDate-block">
                                  <div className="role-flight-depDate">
                                    {segment.depTimeDate
                                      .toString()
                                      .slice(4, 10)}
                                  </div>
                                </div>
                              </div>
                              <div className="role-flight-segment-section">
                                <div className="role-flight-arrDep">
                                  <div className="role-flight-dep">
                                    <div className="role-flight-depTime">
                                      {segment.depTime}
                                    </div>
                                    <div className="role-flight-depCity">
                                      {segment.originAirportCode}
                                    </div>
                                  </div>
                                  <div className="role-flight-duration">
                                    <div className="role-flight-duration-stopPts">
                                      <div className="role-flight-duration-stopType">
                                        {segment.stopOverPts.length === 0
                                          ? "Direct"
                                          : `${
                                              segment.stopOverPts.length > 1
                                                ? `${segment.stopOverPts.length} stops`
                                                : "1 stop"
                                            }`}
                                        {segment.stopOverPts.length !== 0 ? (
                                          <FontAwesomeIcon
                                            icon={faChevronUp}
                                            className="role-flight-duration-stopType-icon"
                                          />
                                        ) : null}
                                      </div>
                                    </div>
                                    <div className="role-flight-duration-time">
                                      {segment.finalTime === "NaNm"
                                        ? segment.duration
                                        : segment.finalTime}
                                    </div>
                                  </div>
                                  <div className="role-flight-arr-section">
                                    <div className="role-flight-dep role-flight-arr">
                                      <div className="role-flight-depTime">
                                        {segment.arrTime}
                                      </div>
                                      <div className="role-flight-depCity">
                                        {segment.destAirportCode}
                                      </div>
                                    </div>
                                    {segment.arrAfterDays > 0 ? (
                                      <div className="role-flight-depTime-afterDays">
                                        <div className="role-flight-depTime-afterDays-num">{`+ ${segment.arrAfterDays}`}</div>
                                        <div>{`${
                                          segment.arrAfterDays > 1
                                            ? "Days"
                                            : "Day"
                                        }`}</div>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div className="role-flight-segment-price">
                                &nbsp;
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="role-flight-segment-price-icon"
                                />
                                {`${flightArr[0].fare.toLocaleString("en-IN")}`}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                    <div className="role-travellers-hotel">
                      <div className="role-trip-city">Traveller Details</div>
                      <div className="role-traveller-container">
                        {adults?.map((trav, i) => {
                          console.log(trav);
                          return (
                            <>
                              <div className="role-traveller-block">
                                <div className="role-traveller-header">
                                  Traveller-{i + 1}
                                </div>
                                <div className="role-traveller-box">
                                  <div>
                                    Gender:<span>{trav.gender}</span>{" "}
                                  </div>
                                  <div>
                                    First Name:<span>{trav.firstName}</span>{" "}
                                  </div>
                                  <div>
                                    Last Name:<span>{trav.lastName}</span>{" "}
                                  </div>
                                  {i === 0 && (
                                    <>
                                      <div>
                                        Email:<span>{trav.email}</span>{" "}
                                      </div>
                                      <div>
                                        Mobile Number:
                                        <span>{trav.mobileNumber}</span>{" "}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })}
                        <h1>{child && "Children"}</h1>
                        {child &&
                          child?.map((trav, i) => {
                            console.log(trav);
                            return (
                              <>
                                <div className="role-traveller-block">
                                  <div className="role-traveller-header">
                                    Traveller-{i + 1}
                                  </div>
                                  <div className="role-traveller-box">
                                    <div>
                                      Gender:<span>{trav.gender}</span>{" "}
                                    </div>
                                    <div>
                                      First Name:<span>{trav.firstName}</span>{" "}
                                    </div>
                                    <div>
                                      Last Name:<span>{trav.lastName}</span>{" "}
                                    </div>
                                    {i === 0 && (
                                      <>
                                        <div>
                                          Email:<span>{trav.email}</span>{" "}
                                        </div>
                                        <div>
                                          Mobile Number:
                                          <span>{trav.mobileNumber}</span>{" "}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        <h1>{infants && "Infants"}</h1>
                        {infants &&
                          infants?.map((trav, i) => {
                            return (
                              <>
                                <div className="role-traveller-block">
                                  <div className="role-traveller-header">
                                    Traveller-{i + 1}
                                  </div>
                                  <div className="role-traveller-box">
                                    <div>
                                      Gender:<span>{trav.gender}</span>{" "}
                                    </div>
                                    <div>
                                      First Name:<span>{trav.firstName}</span>{" "}
                                    </div>
                                    <div>
                                      Last Name:<span>{trav.lastName}</span>{" "}
                                    </div>
                                    {i === 0 && (
                                      <>
                                        <div>
                                          Email:<span>{trav.email}</span>{" "}
                                        </div>
                                        <div>
                                          Mobile Number:
                                          <span>{trav.mobileNumber}</span>{" "}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            <div className="role-review-hotels">
              <div className="role-review-hotels-header">
                {trip?.tripDetails?.bus.length > 0 ? <>Buses</> : null}
              </div>
              {trip?.tripDetails?.bus?.map((buses) => {
                console.log(trip?.tripDetails);

                const adults =
                  trip?.tripDetails?.data?.travellerDetails[buses.id]?.adults;
                console.log(adults);
                const monthNames = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                // console.log(buses.data.selectedSeat);
                // const startdate = new Date(
                //   buses?.data?.hotelSearchQuery?.checkInDate.seconds * 1000
                // );
                // const formattedDate1 = `${
                //   monthNames[startdate.getMonth()]
                // } ${startdate.getDate()}`;
                // var endDate = getDate(
                //   hotel?.data?.hotelSearchQuery?.checkOutDate.seconds
                // );
                // var adults = hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
                //   (acc, obj) => {
                //     acc.adults += parseInt(obj.adults, 10);
                //     acc.child += parseInt(obj.child, 10);
                //     return acc;
                //   },
                //   { adults: 0, child: 0 }
                // );
                return (
                  <>
                    {/* <div className="role-hotel-card">
                      <div className="role-hotel-details">
                        <div className="role-hotel-name"> */}
                    {/* {
                            hotel?.data?.hotelInfo?.HotelInfoResult
                              ?.HotelDetails?.HotelName
                          } */}
                    {/* </div> */}
                    {/* <div className="role-hotel-people"> */}
                    {/* Adults-{adults?.adults} Child-{adults?.child} */}
                    {/* </div> */}
                    {/* <div className="role-hotel-date">
                          <span>
                            {formattedDate1}-{endDate}
                          </span>{" "}
                          ({hotel?.data?.hotelSearchQuery?.hotelNights} Nights)
                        </div> */}
                    {/* </div> */}
                    {/* {hotel?.data?.selectedRoomType &&
                        hotel?.data?.selectedRoomType.map((room, f) => {
                          return (
                            <div className="role-roomDtls-room">
                              <div className="role-roomDtls-room-titleSection">
                                <div className="role-roomDtls-room-type">
                                  {room.RoomTypeName}
                                </div>
                                <div className="role-roomDtls-room-price">
                                  <FontAwesomeIcon
                                    icon={faIndianRupeeSign}
                                    className="role-roomDtls-room-price-icon"
                                  />
                                  {`${
                                    room.Price.OfferedPriceRoundedOff
                                      ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                                          "en-IN"
                                        )
                                      : room.Price.PublishedPriceRoundedOff.toLocaleString(
                                          "en-IN"
                                        )
                                  }`}
                                </div>
                              </div>
                              <div className="role-roomDtls-room-otherSection">
                                <div className="role-roomDtls-room-meals">
                                  <FontAwesomeIcon
                                    icon={faUtensils}
                                    className="role-roomDtls-room-meals-icon"
                                  />
                                  {room.Inclusion && room.Inclusion.length > 0
                                    ? actions.checkForTboMeals(room.Inclusion)
                                    : "No meals"}
                                </div>
                                <div className="role-roomDtls-room-cancel">
                                  {room.LastCancellationDate &&
                                  actions.validCancelDate(
                                    room.LastCancellationDate
                                  ) ? (
                                    <>
                                      <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="role-roomDtls-room-cancel-icon"
                                      />
                                      {`Free cancellation upto ${new Date(
                                        room.LastCancellationDate
                                      )
                                        .toString()
                                        .slice(4, 10)}`}
                                    </>
                                  ) : (
                                    <>
                                      <FontAwesomeIcon
                                        icon={faBan}
                                        className="role-roomDtls-room-cancel-icon"
                                      />
                                      {"Non-refundable"}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })} */}
                    {/* </div> */}
                    <div className="bg-[#f5f5f5] pt-4 rounded-md ">
                      <p className="font-bold">
                        {buses.data.bus.TravelName}
                        <span className="text-[12px]">
                          ({buses.data.bus.BusType})
                        </span>
                      </p>
                      <div className="flex justify-between py-[20px] px-[10px]">
                        <div>
                          <p className="font-bold">
                            {buses.data.origin.cityName}
                          </p>
                          <p>
                            {format(
                              buses.data.bus.DepartureTime,
                              "MMMM d, h:mm a"
                            )}
                          </p>
                        </div>
                        {/* <div>
                          {buses.data.selectedSeat !== undefined &&
                            buses.data.selectedSeat.map((e, i) => (
                              <p>{e.SeatName}</p>
                            ))}
                        </div> */}
                        <div>
                          <p className="font-bold">
                            {buses.data.destination.cityName}
                          </p>
                          <p>
                            {format(
                              buses.data.bus.ArrivalTime,
                              "MMMM d, h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-[#BB3E03] text-right font-bold text-[19px]">
                        {" "}
                        <FontAwesomeIcon
                          icon={faIndianRupeeSign}
                          className="role-flight-segment-price-icon"
                        />
                        {buses.data.busTotalPrice}
                      </div>
                    </div>

                    <div className="role-travellers-hotel">
                      <div className="role-trip-city">Traveller Details</div>
                      <div className="role-traveller-container">
                        {adults?.map((trav, i) => {
                          console.log(trav);
                          return (
                            <>
                              <div className="role-traveller-block">
                                <div className="role-traveller-header">
                                  Traveller-{i + 1}
                                </div>
                                <div className="role-traveller-box">
                                  <div>
                                    Gender:<span>{trav.gender}</span>{" "}
                                  </div>
                                  <div>
                                    First Name:<span>{trav.firstName}</span>{" "}
                                  </div>
                                  <div>
                                    Last Name:<span>{trav.lastName}</span>{" "}
                                  </div>
                                  {i === 0 && (
                                    <>
                                      <div>
                                        Email:<span>{trav.email}</span>{" "}
                                      </div>
                                      <div>
                                        Mobile Number:
                                        <span>{trav.mobileNumber}</span>{" "}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            <div className="role-review-hotels">
              <div className="role-review-hotels-header">
                {trip?.tripDetails?.cabs?.length > 0 ? <>Cabs</> : null}
              </div>
              {trip?.tripDetails?.cabs &&
                trip?.tripDetails?.cabs?.map((cab) => {
                  console.log(cab);
                  var cabSDate = cab.data.cabStartDate
                    ? new Date(cab.data.cabStartDate.seconds * 1000)
                        ?.toString()
                        ?.slice(4, 10)
                    : "";
                  var cabEDate = cab.data.cabEndDate
                    ? new Date(cab.data.cabEndDate.seconds * 1000)
                        ?.toString()
                        ?.slice(4, 10)
                    : "";
                  const adults =
                    trip?.tripDetails?.data?.travellerDetails[cab.id]?.adults;
                  return (
                    <>
                      {/* <Cab
                        cab={cab.data.cab}
                        tripsPage={false}
                        approvePage={true}
                        startDate={cab.data.cabStartDate}
                        endDate={cab.data.cabEndDate}
                      /> */}
                      <div className="shadow-md w-[100%] m-auto flex items-center gap-[5px] pl-[10px] py-[10px]">
                        <img
                          className="w-[60px] h-[60px]"
                          src="https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png"
                          alt="cab"
                        />
                        <div className="w-[100%]">
                          <div className="flex justify-between my-2">
                            <p className="font-bold">
                              {cab.data.cab.carType}
                              <span className="font-normal text-[14px]">
                                ({cab.data.cab.passenger}
                                -Seater)
                              </span>
                            </p>
                            <p className="text-[10pt] flex justify-start items-center bg-[#94d2bd] rounded-l-[0.8rem] px-[6px] py-[4px]">
                              {cabSDate}
                              {cabEDate && "-"}
                              {cabEDate}
                            </p>
                          </div>
                          <div className="flex justify-between my-2">
                            <p>No of Cabs-{cab.data.cabCount}</p>
                            <p className="text-[#BB3E03] font-bold">
                              Total Price: {cab.data.cabTotalPrice}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="role-travellers-hotel">
                        <div className="role-trip-city">Traveller Details</div>
                        <div className="role-traveller-container">
                          {adults?.map((trav, i) => {
                            console.log(trav);
                            return (
                              <>
                                <div className="role-traveller-block">
                                  <div className="role-traveller-header">
                                    Traveller-{i + 1}
                                  </div>
                                  <div className="role-traveller-box">
                                    <div>
                                      Gender:<span>{trav.gender}</span>{" "}
                                    </div>
                                    <div>
                                      First Name:<span>{trav.firstName}</span>{" "}
                                    </div>
                                    <div>
                                      Last Name:<span>{trav.lastName}</span>{" "}
                                    </div>
                                    {i === 0 && (
                                      <>
                                        <div>
                                          Email:<span>{trav.email}</span>{" "}
                                        </div>
                                        <div>
                                          Mobile Number:
                                          <span>{trav.mobileNumber}</span>{" "}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
          {trip?.approvalRequest?.status === "Pending" ? (
            <div className="role-approve">
              <span>Approve this trip:&nbsp;</span>
              {loading ? (
                <button className="spin">
                  <div className="spinner"></div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleApprove(trip, trip?.approvalRequest);
                  }}
                >
                  Approve
                </button>
              )}
            </div>
          ) : null}
        </div>
      </Popup>{" "}
      <Navbar />
      <FaArrowLeftLong
        size={30}
        className="ml-[20px] mt-[20px] cursor-pointer"
        onClick={() => navigate("/roles")}
      />
      <div>
        <div className="max-w-[1080px] m-auto">
          {approveAllLoading ? (
            <div className="flex items-center justify-center">
              <ScaleLoader
                // css={override}
                sizeUnit={"px"}
                size={17}
                color={"#94D2BD"}
                loading={approveAllLoading}
              />
              &nbsp;&nbsp;Loading Approve Request...
            </div>
          ) : (
            <>
              {allRequesData
                ?.sort((a, b) => {
                  var aDate = new Date(
                    a?.requestDetails?.createdAt.seconds * 1000
                  );
                  var bDate = new Date(
                    b?.requestDetails?.createdAt.seconds * 1000
                  );
                  return bDate - aDate;
                })
                ?.map((trip, s) => {
                  var date = new Date(
                    trip?.tripDetails?.data?.date?.seconds * 1000
                  ).toLocaleString();
                  var updatedDate = trip?.requestDetails?.updatedAt
                    ? new Date(
                        trip?.requestDetails?.updatedAt?.seconds * 1000
                      ).toLocaleString()
                    : "";

                  return (
                    <div className="role-card shadow-md rounded-[0.8rem] mb-[13px] w-[90%] m-auto">
                      <div className="role-trip-card flex flex-col my-2.5 py-2.5 px-2.5 rounded-lg">
                        <div className="role-trip-card-header flex flex-col md:flex-row items-center justify-between text-center text-lg font-bold">
                          <span className="text-[12px] md:text-[16px]">
                            {trip?.userDetails?.firstName} (
                            {trip?.userDetails?.email})
                          </span>
                          <span>{trip?.tripDetails?.data?.name}</span>
                          <div className="flex items-center">
                            <span>Requested on:</span>
                            <p className="text-[#94d2bd] text-[10pt]">{date}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-between items-center">
                          <div className="flex gap-[10px]">
                            {trip?.tripDetails?.hotels?.length > 0 ? (
                              <div className="bg-[#f5f5f5] py-[5px] px-[10px] flex items-center justify-center rounded-md">
                                Hotels - {trip?.tripDetails?.hotels.length}
                              </div>
                            ) : null}
                            {trip?.tripDetails?.flights?.length > 0 ? (
                              <div className="bg-[#f5f5f5] py-[5px] px-[10px] flex items-center justify-center rounded-md">
                                Flights - {trip?.tripDetails?.flights?.length}
                              </div>
                            ) : null}
                            {trip?.tripDetails?.cabs?.length > 0 ? (
                              <div className="bg-[#f5f5f5] py-[5px] px-[10px] flex items-center justify-center rounded-md">
                                Cabs - {trip?.tripDetails?.cabs?.length}
                              </div>
                            ) : null}
                            {trip?.tripDetails?.bus?.length > 0 ? (
                              <div className="bg-[#f5f5f5] py-[5px] px-[10px] flex items-center justify-center rounded-md">
                                Buses - {trip?.tripDetails?.bus?.length}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex items-center">
                            <div className="tripDetails-totalPrice-title-Desktop">
                              Total price:
                            </div>
                            <div className="text-[#bb3e03] font-semibold">
                              &nbsp;
                              <FontAwesomeIcon
                                icon={faIndianRupeeSign}
                                className="tripDetails-totalPrice-price-icon"
                              />
                              &nbsp;
                              {`${
                                trip?.approvalRequest?.totalPrice
                                  ? Math.ceil(trip?.approvalRequest?.totalPrice)
                                  : ""
                              } `}
                            </div>
                          </div>
                          <div className="role-trip-status">
                            Status:&nbsp;
                            <span
                              className={
                                trip?.requestDetails?.status === "Pending"
                                  ? "bg-[#ffa500] text-white px-[10px] py-[5px] rounded-md font-semibold text-[14px]"
                                  : "bg-[#008000] px-[10px] py-[5px] rounded-md text-white font-semibold text-[14px]"
                              }
                            >
                              {trip?.requestDetails?.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {updatedDate && (
                        <div>
                          <span className="font-bold pl-2">Approved Date:</span>
                          {updatedDate}
                        </div>
                      )}
                      <div className="flex items-center justify-center pb-4">
                        <button
                          onClick={() => {
                            setTrip(trip);
                            setOpenTrip(true);
                          }}
                          className="bg-black text-white rounded-md focus:outline-none py-[4px] px-[8px]"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllRequests;
