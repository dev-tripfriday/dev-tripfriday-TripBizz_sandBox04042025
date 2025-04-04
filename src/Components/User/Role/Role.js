import React, { useContext, useEffect, useState } from "react";
import "./Role.css";
import Navbar from "../../Flights/FlightSearch/Navbar";
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
import MyContext from "../../Context";
import firebase from "firebase/compat/app";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
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
import { ClipLoader, ScaleLoader } from "react-spinners";
import Cab from "../../Cabs/Cab/Cab";
import Popup from "../../Popup";
import { Button } from "@mui/material";
import { List, Pagination, Box, CircularProgress } from "@mui/material";
import { getAuth } from "firebase/auth";
import { db } from "../../MyProvider";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { RiGlobalFill } from "react-icons/ri";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const PAGE_SIZE = 10;
const Role = () => {
  const navigate = useNavigate();
  const uid = getAuth().currentUser.uid;
  var {
    actions,
    notifications,
    teamMembers,
    userAccountDetails,
    approveLoading,
    managerRequestLoading,
    tripData,
  } = useContext(MyContext);
  console.log(userAccountDetails);
  var [openManager, setOpenManager] = useState(false);
  var [managerData, setManagerData] = useState({
    name: "",
    email: "",
  });
  var [tripsData, setTripsData] = useState([]);
  var [mounted, setMounted] = useState(true);
  const [openTrip, setOpenTrip] = useState(null);
  const [trip, setTrip] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [loading, setLoading] = useState(false);
  // const [managerRequestLoading, setmanagerRequestLoading] = useState(false);
  const [fareIsOpen, setFareIsOpen] = useState(false);
  var [airlinelogos, setAirlinelogos] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = React.useState(false);
  // const [tripsPerPage, setTripsPerPage] = useState(10);
  const [lastFetchedDoc, setLastFetchedDoc] = useState(null);
  const [managerStatus, setManagerStatus] = useState();
  const [managerOpen, setManagerOpen] = useState(false);
  const [approvePopup, setApprovePopup] = useState(false);
  const [managerComment, setManagerComment] = useState();
  const tripPerPage = 10;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // var tripsPerPage = 10;
  var handleManager = async () => {
    if (managerData.email === "") {
      setError("Email Required");
      return false;
    }
    const db = firebase.firestore();
    const AccountsCollectionRef = collection(db, "Accounts");
    const q = query(
      AccountsCollectionRef,
      where("email", "==", managerData.email)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setError("Email does not exist!");
    } else {
      await actions.editManager(managerData);
      setManagerOpen(true);
      // toast.success("Request Sent successfull", {
      //   position: "top-right",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      //   transition: Bounce,
      // });
      setError("");
    }
    // setmanagerRequestLoading(true);
    // actions.editManager(managerData);
    // setmanagerRequestLoading(false);
  };
  var approveRequest = (notification, userid) => {
    actions.editTeamMembers(notification, userid);
  };
  const fetchTripsForApproval = async (page) => {
    setLoading(true);
    const data = await actions.getTripsForApproval(
      userAccountDetails?.approvalRequests,
      page,
      tripPerPage
    );
    console.log(data);
    setTripsData(data);
    setLoading(false);
  };
  var getTripData = async () => {
    // var data = await actions.getTripsForApproval(
    //   userAccountDetails?.approvalRequests
    // );

    const newTrips = await actions.getTripsForApproval(
      userAccountDetails?.approvalRequests
    );
    setTripsData(newTrips);
  };
  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const getManagerStatus = async () => {
    const userDetails = doc(db, "Accounts", uid);
    const userDoc = await getDoc(userDetails);
    setManagerStatus(userDoc.data().manager.status);
  };
  useEffect(() => {
    setMounted(true);
    if (mounted) {
      getTripData();
      // fetchTripsForApproval(currentPage);
      getData();
      getManagerStatus();
    }
    return () => {
      setMounted(false);
    };
  }, [mounted]);

  const toggleUp = (e, id) => {
    actions.toggleUp(e, id, fareIsOpen);
    setFareIsOpen((prev) => !prev);
  };

  var getTime = (seconds) => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    return date.toString().slice(4, 15);
  };

  var getDate = (seconds) => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const dayofyear = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });
    var dateString = `${month.slice(0, 3)} ${dayOfWeek} ${dayofyear}`;
    return dateString;
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
    console.log(tripData);
    console.log(trip);
    console.log(req);
    const templateCabs = trip?.tripDetails?.cabs?.filter((id, i) => {
      return req?.cabs?.some((selectedCab) => selectedCab === id?.id);
    });
    const templateFlights = trip?.tripDetails?.flights?.filter((id, i) => {
      return req?.flights?.some((selectedCab) => selectedCab === id?.id);
    });

    const templateHotels = trip?.tripDetails?.hotels?.filter((id, i) => {
      return req?.hotels?.some((selectedCab) => selectedCab === id?.id);
    });
    const templateBus = trip?.tripDetails?.bus?.filter((id, i) => {
      return req?.bus?.some((selectedCab) => selectedCab === id?.id);
    });
    const templateOther = trip?.tripDetails?.otherBookings?.filter((id, i) => {
      return req?.otherBookings?.some((selectedCab) => selectedCab === id?.id);
    });
    const templateData = {
      flights: templateFlights,
      hotels: templateHotels,
      cabs: templateCabs,
      bus: templateBus,
      otherBookings: templateOther,
      travellerDetails: trip?.tripDetails?.data?.travellerDetails,
    };
    console.log(templateData);
    debugger;
    setLoading(true);
    await actions.approveTripRequest(
      req,
      userAccountDetails?.userid,
      templateData
    );
    await actions.updateAdminTripAccepted(trip, req);
    setOpenTrip(false);
    setLoading(false);
    setApprovePopup(true);
    setTripsData();
    await getTripData();
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // useEffect(async () => {
  //   const userDetails = doc(db, "Accounts", uid);
  //   const userDoc = await getDoc(userDetails);
  //   setManagerStatus(userDoc.data().manager.status);
  // }, []);
  const handleManagerOpen = () => setOpen(true);
  const handleManagerClose = () => setOpen(false);
  return (
    <>
      <Modal
        open={managerOpen}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            Request Sent
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            className="text-center"
          >
            Your Request sent to the Approver.
          </Typography>
          <div className="flex items-center justify-center mt-2">
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                window.location.reload();
              }}
            >
              Ok
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={approvePopup}
        onClose={() => setApprovePopup(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col items-center">
            <h1 className="text-center font-bold">You Approved the trip</h1>
            <IoCheckmarkDoneCircle className="my-2" size={60} color="green" />
            <div className="self-end">
              <Button
                variant="text"
                className="block"
                onClick={() => setApprovePopup(false)}
              >
                OK
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      <Popup condition={openTrip} close={() => setOpenTrip(false)}>
        <h1>
          <span className="font-bold">Comments: </span>
          {managerComment}
        </h1>
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
                          Adults-{adults?.length}
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
                      <div className="font-bold text-right text-[#BB3E03] mt-2">
                        Total: &nbsp;
                        <FontAwesomeIcon
                          icon={faIndianRupeeSign}
                          className="role-flight-segment-price-icon"
                        />
                        {`${Math.ceil(
                          hotel?.data?.hotelTotalPrice
                        ).toLocaleString("en-IN")}`}
                      </div>
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
                console.log(flight.id);
                var airlinename =
                  flight?.data[0]?.flightNew?.segments[0]?.airlineName;
                var airline = airlinelogos?.filter((a) => {
                  return airlinename?.toLowerCase() === a?.id;
                });
                var flightArr = [flight?.data[0]?.flight].map((flight, f) => {
                  return { ...actions.modifyFlightObject(flight) };
                });
                console.log(flight);
                console.log(flightArr);
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
                          {`${
                            flight?.data[0]?.totalFare +
                            flight?.data[0]?.finalFlightServiceCharge +
                            flight?.data[0]?.gstInFinalserviceCharge
                          }`}
                        </div>
                      </div>
                      <div className="role-travellers-flight">
                        <div className="role-trip-city">Traveller Details</div>
                        <div className="role-traveller-container">
                          {trip?.tripDetails?.data?.travellerDetails[
                            flight.id
                          ]?.adults?.map((trav, i) => {
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
                          <h1>
                            {trip?.tripDetails?.data?.travellerDetails[
                              flight.id
                            ]?.children && "Children"}
                          </h1>
                          {trip?.tripDetails?.data?.travellerDetails[flight.id]
                            ?.children &&
                            trip?.tripDetails?.data?.travellerDetails[
                              flight.id
                            ]?.children?.map((trav, i) => {
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
                                            <span>
                                              {trav.mobileNumber}
                                            </span>{" "}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          <h1>
                            {trip?.tripDetails?.data?.travellerDetails[
                              flight.id
                            ]?.infants && "Infants"}
                          </h1>
                          {trip?.tripDetails?.data?.travellerDetails[flight.id]
                            ?.infants &&
                            trip?.tripDetails?.data?.travellerDetails[
                              flight.id
                            ]?.infants?.map((trav, i) => {
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
                                            <span>
                                              {trav.mobileNumber}
                                            </span>{" "}
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
                                {`${Math.ceil(
                                  flight?.data[0].totalFare +
                                    flight?.data[0].finalFlightServiceCharge +
                                    flight?.data[0].gstInFinalserviceCharge
                                ).toLocaleString("en-IN")}`}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                    <div className="role-travellers-hotel">
                      <div className="role-trip-city">Travelle Details</div>
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
                        {Math.round(buses.data.busTotalPrice)}
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
            <div className="role-review-hotels">
              <div className="role-review-hotels-header">
                {trip?.tripDetails?.otherBookings?.length > 0 ? (
                  <>Other</>
                ) : null}
              </div>
              {trip?.tripDetails?.otherBookings &&
                trip?.tripDetails?.otherBookings?.map((other) => {
                  return (
                    <>
                      {/* <Cab
                        cab={cab.data.cab}
                        tripsPage={false}
                        approvePage={true}
                        startDate={cab.data.cabStartDate}
                        endDate={cab.data.cabEndDate}
                      /> */}

                      <div
                        style={{
                          boxShadow:
                            "0.04rem 0.06rem 0.4rem rgba(0, 0, 0, 0.171)",
                        }}
                        className="w-[100%] rounded-[0.8rem] mt-[10pt] pt-[10pt] pl-[10pt] pb-[3pt]"
                      >
                        <div>
                          <div className="flex items-center">
                            <RiGlobalFill size={50} />
                            <div className="w-[100%]">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-[12pt] mr-[5px]">
                                  {other?.data?.bookingType}
                                </p>
                                <p className="text-[10pt] bg-[#94d2bd] p-[5pt] rounded-tl-[0.8rem] rounded-bl-[0.8rem]">
                                  {other?.data?.bookingDate}
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-1">
                                <p>{other?.data?.bookingDetails}</p>
                                <p className="text-[#BB3E03] font-bold">
                                  Price: {other?.data?.bookingCost}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="border-[1px] border-dotted border-[#001219] mt-1"></div>
                          <div className="flex justify-around items-center">
                            <div></div>
                            <p className="text-[#BB3E03] font-bold">
                              Total Price: {other?.data?.overallBookingPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="role-travellers-hotel">
                        <div className="role-trip-city">Traveller Details</div>
                        <div className="role-traveller-container">
                          {other?.data?.bookingTravellers?.map((trav, i) => {
                            console.log(trav);
                            return (
                              <>
                                <div className="role-traveller-block">
                                  <div className="role-traveller-header">
                                    Traveller-{i + 1}
                                  </div>
                                  <div className="role-traveller-box">
                                    <div>
                                      Gender:<span>{trav.title}</span>{" "}
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
      </Popup>
      <Navbar />
      <ToastContainer></ToastContainer>
      <div className="role-container">
        <div className="role-header">Roles and Approval</div>
        <div className="role-block">
          <div className="role-type">
            <div className="role-type-header">Approver</div>
            <div className="role-type-approval">
              {Object.keys(userAccountDetails?.manager).length > 0 ? (
                <div className="role-approval">
                  <span>
                    {userAccountDetails?.manager?.name}(
                    {userAccountDetails?.manager?.email})
                  </span>
                  <span>
                    {managerStatus === "pending" ? "Pending" : "Active"}
                  </span>
                </div>
              ) : null}
            </div>
            <div className="role-type-block">
              <div className="role-type-add">
                {Object.keys(userAccountDetails?.manager).length > 0 ? (
                  <button onClick={() => setOpenManager(!openManager)}>
                    Change Approver
                  </button>
                ) : (
                  <button onClick={() => setOpenManager(!openManager)}>
                    <FontAwesomeIcon icon={faPlus} /> &nbsp;Add Approver
                  </button>
                )}
              </div>
              {openManager ? (
                <div className="role-type-feilds">
                  {/* <div className="role-feilds">
                    <span>Enter the name of the manager</span>
                    <input
                      type="text"
                      placeholder="Enter the name"
                      name="name"
                      value={managerData.name}
                      onChange={(e) => {
                        setManagerData({
                          ...managerData,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </div> */}
                  <div className="role-feilds">
                    <span>Enter the email ID of the Approver</span>
                    <input
                      type="text"
                      placeholder="Enter the email"
                      name="email"
                      value={managerData.email}
                      onChange={(e) => {
                        setManagerData({
                          ...managerData,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 text-[12px] pl-[10pt]">
                      {error}
                    </p>
                  )}
                  <div className="role-submit">
                    <Button
                      disabled={managerRequestLoading}
                      sx={{ textTransform: "none" }}
                      className="!bg-[#001219] !ml-[5px]]"
                      onClick={handleManager}
                    >
                      {/* <p>
                        {managerRequestLoading ? "Sending..." : "Send Request"}
                      </p> */}
                      {managerRequestLoading ? (
                        <ClipLoader size={20} color="White" />
                      ) : (
                        "Send Request"
                      )}
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          {teamMembers?.length > 0 || notifications?.length > 0 ? (
            <div className="role-type !my-2">
              <div className="role-type-header">
                Team Members{" "}
                <span
                  className="font-normal text-[15px] cursor-pointer text-blue-500 underline"
                  onClick={handleClickOpen}
                >
                  ({teamMembers?.length} Team Members)
                  {/* l<span className="text-blue-500">See...</span> */}
                </span>
              </div>
              <div className="role-type-block">
                {notifications?.length > 0 ? (
                  <div className="role-type-approval">
                    {notifications.map((notification) => {
                      return (
                        <div className="role-approval">
                          <span>
                            Please approve Approver request of{" "}
                            {notification.name}({notification.email}). Once you
                            approve this,{notification.name}(
                            {notification.email}) can send their travel approval
                            requests to you
                          </span>
                          <button
                            onClick={() =>
                              approveRequest(notification, notification.userId)
                            }
                          >
                            Approve
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle
                    id="alert-dialog-title"
                    className="text-center font-bold"
                  >
                    {"Team Members"}
                  </DialogTitle>
                  <DialogContent>
                    {/* <DialogContentText
                      id="alert-dialog-description"
                      className="invisible"
                    >
                      Let Google help apps determine location. This means
                      sending anonymous location data to Google, even when no
                      apps are running.
                    </DialogContentText> */}
                    {teamMembers?.length > 0 ? (
                      <div className="role-type-approval">
                        {teamMembers.map((teamMember) => {
                          return (
                            <div className="flex flex-col gap-[10px]">
                              <span className="text-center py-2">
                                {teamMember.name}({teamMember.email})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </DialogContent>
                  <DialogActions>
                    {/* <Button onClick={handleClose}>Disagree</Button> */}
                    <Button onClick={handleClose} autoFocus>
                      Ok
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          ) : null}
          <div className="role-trip-approval">
            <div className="role-trip-approval-header">
              Approval Requests{" "}
              <span
                className="font-normal text-[15px] cursor-pointer text-blue-500 underline"
                onClick={() => navigate("/allrequests")}
              >
                View all requests
                {/* l<span className="text-blue-500">See...</span> */}
              </span>
            </div>
            <div className="role-trip-approval-tabs">
              <div
                className={
                  selectedTab === "Pending"
                    ? "approval-tab approval-tab-selected"
                    : "approval-tab"
                }
                onClick={() => {
                  setSelectedTab("Pending");
                }}
              >
                Pending
              </div>
              <div
                className={
                  selectedTab === "Approved"
                    ? "approval-tab approval-tab-selected"
                    : "approval-tab"
                }
                onClick={() => {
                  setSelectedTab("Approved");
                }}
              >
                Approved
              </div>
            </div>
            <div className="role-trip-approval-block">
              {approveLoading ? (
                <div className="loading-approvals">
                  <ScaleLoader
                    // css={override}
                    sizeUnit={"px"}
                    size={17}
                    color={"#94D2BD"}
                    loading={approveLoading}
                  />
                  &nbsp;&nbsp;Loading Approve Request...
                </div>
              ) : (
                <>
                  {tripsData
                    ?.filter((a) => {
                      return a?.requestDetails?.status === selectedTab;
                    })
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
                      console.log(trip);
                      var date = new Date(
                        trip?.tripDetails?.data?.date?.seconds * 1000
                      ).toLocaleString();
                      var updatedDate = trip?.requestDetails?.updatedAt
                        ? new Date(
                            trip?.requestDetails?.updatedAt?.seconds * 1000
                          ).toLocaleString()
                        : "";

                      return (
                        <div className="role-card">
                          <div className="role-trip-card">
                            <div className="role-trip-card-header">
                              <span>
                                {trip?.userDetails?.firstName} (
                                {trip?.userDetails?.email})
                              </span>
                              <span>{trip?.tripDetails?.data?.name}</span>
                              <div className="role-trip-date">
                                <span>Requested on:</span>
                                <p>{date}</p>
                              </div>
                            </div>
                            <div className="role-trip-list">
                              <div className="role-trip-type">
                                {trip?.tripDetails?.hotels?.length > 0 ? (
                                  <div className="role-trip-hotel">
                                    Hotels - {trip?.tripDetails?.hotels.length}
                                  </div>
                                ) : null}
                                {trip?.tripDetails?.flights?.length > 0 ? (
                                  <div className="role-trip-hotel">
                                    Flights -{" "}
                                    {trip?.tripDetails?.flights?.length}
                                  </div>
                                ) : null}
                                {trip?.tripDetails?.cabs?.length > 0 ? (
                                  <div className="role-trip-hotel">
                                    Cabs - {trip?.tripDetails?.cabs?.length}
                                  </div>
                                ) : null}
                                {trip?.tripDetails?.bus?.length > 0 ? (
                                  <div className="role-trip-hotel">
                                    Buses - {trip?.tripDetails?.bus?.length}
                                  </div>
                                ) : null}
                                {trip?.tripDetails?.otherBookings?.length >
                                0 ? (
                                  <div className="role-trip-hotel">
                                    Other -{" "}
                                    {trip?.tripDetails?.otherBookings?.length}
                                  </div>
                                ) : null}
                              </div>
                              <div className="tripDetails-totalPrice-section-Desktop">
                                <div className="tripDetails-totalPrice-title-Desktop">
                                  Total price:
                                </div>
                                <div className="tripDetails-totalPrice-price-Desktop">
                                  &nbsp;
                                  <FontAwesomeIcon
                                    icon={faIndianRupeeSign}
                                    className="tripDetails-totalPrice-price-icon"
                                  />
                                  &nbsp;
                                  {/* {`${
                                    trip?.approvalRequest?.totalPrice
                                      ? Math.ceil(
                                          trip?.approvalRequest?.totalPrice
                                        )
                                      : ""
                                  } `} */}
                                  {Math.ceil(
                                    trip?.tripDetails?.flights &&
                                      trip?.tripDetails?.flights.reduce(
                                        (sum, obj) =>
                                          sum +
                                          (obj?.data[0]?.totalFare +
                                            obj?.data[0]
                                              ?.finalFlightServiceCharge +
                                            obj?.data[0]
                                              ?.gstInFinalserviceCharge),
                                        0
                                      ) +
                                        trip?.tripDetails?.hotels.reduce(
                                          (sum, obj) =>
                                            sum + obj?.data?.hotelTotalPrice,
                                          0
                                        ) +
                                        trip?.tripDetails?.cabs.reduce(
                                          (sum, obj) =>
                                            sum + obj?.data?.cabTotalPrice,
                                          0
                                        ) +
                                        trip?.tripDetails?.bus.reduce(
                                          (sum, obj) =>
                                            sum + obj?.data?.busTotalPrice,
                                          0
                                        ) +
                                        trip?.tripDetails?.otherBookings.reduce(
                                          (sum, obj) =>
                                            sum +
                                            obj?.data?.overallBookingPrice,
                                          0
                                        )
                                  )}
                                </div>
                              </div>
                              <div className="role-trip-status">
                                Status:&nbsp;
                                <span
                                  className={
                                    trip?.requestDetails?.status === "Pending"
                                      ? "orange"
                                      : "green"
                                  }
                                >
                                  {trip?.requestDetails?.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          {updatedDate && (
                            <div>Approved Date:{updatedDate}</div>
                          )}
                          <div className="role-trip-openDtls">
                            <button
                              onClick={() => {
                                console.log(trip);
                                setTrip(trip);
                                setManagerComment(
                                  trip.requestDetails.managerComment
                                );
                                setOpenTrip(true);
                              }}
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
            {/* <div className="flex items-center justify-center w-[100%]">
              <Button onClick={handleLoadMore}>Load more</Button>
            </div> */}
            {/* <div className="w-[100%] flex justify-center">
              <Pagination
                count={Math.ceil(
                  userAccountDetails?.approvalRequests?.length / tripsPerPage
                )}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Role;
