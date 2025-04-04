import React, { useContext, useEffect, useId, useState } from "react";
import MyContext from "../../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronDown,
  faChevronUp,
  faIndianRupeeSign,
  faSuitcaseRolling,
  faPlaneDeparture,
  faDownload,
  faCutlery,
  faCalendarXmark,
  faChair,
  faTrash,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Controller, useForm, useWatch } from "react-hook-form";
import { LuAlarmClock } from "react-icons/lu";
import { PDFDownloadLink } from "@react-pdf/renderer";
import "../../Flights/Flight/Flight.css";
import InvoicePdf1 from "../../InvoicePdf1";
import { Button } from "react-bootstrap";
import Popup from "../../Popup";
import { ScaleLoader } from "react-spinners";
import { format } from "date-fns";
import FlightPriceCard from "../../Trips/TripDetails/FlightPriceCard";
import { db } from "../../MyProvider";
import { FaSpinner } from "react-icons/fa";
import TravDetails from "../../Trips/TripDetails/TravellerDetails";
const ruleType = {
  Cancellation: "Cancellation",
  Reissue: "Date change",
};
function AdminFlightItems(props) {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const approvalStatus = useWatch({
    control,
    name: "approvalStatus",
  });
  const [baggage, setBaggage] = useState(false);
  const [baggageDtls, setBaggageDtls] = useState({});
  const [tripsBaggage, setTripsBaggage] = useState(false);
  const [tripsCancellation, setTripsCancellation] = useState(false);
  const [tripsMeals, setTripsMeals] = useState(false);
  const [tripsSeat, setTripsSeat] = useState(false);
  const [cancellation, setCancellation] = useState(false);
  const [cancelDtls, setCancelDtls] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [stopDtls, setStopDtls] = useState([]);
  const [showStopDtls, setShowStopDtls] = useState(false);
  const [airlinelogos, setAirlinelogos] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTravellers, setOpenTravellers] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [deleteType, setDeleteType] = useState(false);
  const [openFlightPrice, setOpenFlightPrice] = useState(false);
  const [openFareRules, setOpenFareRules] = useState(false);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [newFlightId, setNewFlightid] = useState();
  const [alltimeStamp, setAllTimeStamp] = useState(false);
  const [timeStampDate, setTimeStampData] = useState();
  const [invoiceData, setInvoiceData] = useState([]);
  const [addTravellers, setAddTravellers] = useState(false);
  const [newtravellerDetails, setNewTravellerDetails] = useState();
  const [openBookUp, setOpenBookUp] = useState(false);
  const [userAccountDetails, setUserAccountDetails] = useState({});
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [profileDetails, setProfileDetails] = useState({});
  const [bookingComments, setBookingComments] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);
  var statuses = [
    { status: "Submitted", color: "#ffa500" },
    { status: "Booked", color: "#4CAF50" },
    { status: "Cancelled", color: "#FF0000" },
    { status: "Not Submitted", color: "#808080" },
  ];
  var reqStatuses = [
    { status: "Approved", color: "#008000" },
    { status: "Pending", color: "#ffa500" },
    { status: "Not Requested", color: "#808080" },
    { status: "Skipped", color: "#808080" },
  ];

  const { actions, bookingFlight, flightResJType, flightResList, tripData } =
    useContext(MyContext);
  var {
    adminTripdata,
    userPage,
    flightGrp,
    index,
    bookingPage,
    tripsPage,
    adminPage,
    flightBooking,
    flightStatus,
    flightData,
    downloadUrl,
    adminBooking,
    removeFilters,
    travellerDetails,
    timeStamp,
    flightId,
    flightReq,
    adminTripid,
    tripId,
    updatedAt,
    flight,
    isInternational,
    id,
    totalFlight,
    charge,
    gst,
    user,
    userId,
  } = props;
  const getFlightStatusStyle = (status) => {
    switch (status) {
      case "Booked":
        return { background: "honeydew" };
      case "Cancelled":
        return { background: "#ffe4e4" };

      default:
        return null;
    }
  };
  var reqColor = reqStatuses.filter((status) => {
    return status?.status === flightStatus?.requestStatus;
  });
  var color = statuses.filter((status) => {
    return status?.status === flightStatus?.status;
  });
  var fareData = tripsPage ? actions.getTotalFares([flightBooking]) : "";
  const toggle = (e) => {
    setIsOpen((prev) => !prev);
    actions.toggle(e, `#flightIndex${index}`);
  };
  var flightArr = flightGrp.map((flight, f) => {
    return { ...actions.modifyFlightObject(flight) };
  });
  var setBaggageOpen = (e) => {
    e.stopPropagation();
    setTripsBaggage(true);
  };
  var setCancellationOpen = (e) => {
    e.stopPropagation();
    setTripsCancellation(true);
  };
  var setMealsOpen = (e) => {
    e.stopPropagation();
    setTripsMeals(true);
  };
  var setSeatsOpen = (e) => {
    e.stopPropagation();
    setTripsSeat(true);
  };
  var setFareRules = (e) => {
    e.stopPropagation();
    setOpenFareRules(true);
  };
  var downloadDoc = async () => {
    var downloadName = downloadUrl.slice(164, downloadUrl.indexOf("?"));
    const response = await fetch(downloadUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  useEffect(() => {
    const fetch = async () => {
      const data = await actions.getInvoiceDetails(userId, tripId);
      if (data?.length > 0) {
        setInvoiceData(data);
      }
    };
    fetch();
  }, []);
  var isThere = null;
  if (invoiceData.length > 0) {
    console.log(totalFlight);
    isThere = invoiceData.find((item) => item.cardId === totalFlight?.[0]?.id);
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const userCollectionRef=db.collection("Accounts").doc(userId)
        // const doc =await userCollectionRef.get()
        const userData = await actions.getUserDetails(userId);
        console.log(userData, "userData");
        if (userData) {
          // const userData=doc.data()
          setValue(`adults[0].gender`, userData.user.gender);
          setValue(`adults[0].firstName`, userData.user.firstName);
          setValue(`adults[0].lastName`, userData.user.lastName);
          // setValue(`adults[${index}].birthDate`, adults.birthDate);
          setValue(`adults[0].email`, userData.user.email);
          setValue(`adults[0].mobileNumber`, userData.user.mobileNumber);
          // Set other values similarly
          if (isInternational) {
            setValue(`adults[0].passportNumber`, userData.user.passportNumber);
            setValue(
              `adults[0].passportIssueCountry`,
              userData.user.passportIssueCountry
            );
            setValue(
              `adults[0].passportIssueDate`,
              userData.user.passportIssueDate
            );
            setValue(
              `adults[0].passportExpiryDate`,
              userData.user.passportExpiryDate
            );
          }
          setUserAccountDetails(userData);
        }
      } catch (error) {
        console.log("No such document!");
      }
      const data = await actions.getAdminTripDoc(tripId, userId);
      setProfileDetails(data);
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    if (newtravellerDetails) {
      setIsFormDisabled(true);
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
    }
  }, [newtravellerDetails, setValue]);
  var handleDelete = async () => {
    await actions.deleteTripItem(tripId, deleteId, deleteType, userId);
    setOpenDelete(false);
  };
  const onSubmit = async (data) => {
    setSubmitLoader(true);
    const newData = { [flightId]: data };
    const selectedItems = [flightId];
    var flightArray = tripData?.data?.flights.filter(
      (flight) => flight.requestStatus === "Not Requested"
    );
    const templateDataForApproval = {
      flights: tripData?.flights?.filter((flight) =>
        flightArray.some((id) => id.id === flight.id)
      ),
      flight: [flight],
      travellerDetails: newData,
    };
    if (data.approvalStatus === "Pending") {
      if (
        data.approvalStatus === "Pending" &&
        userAccountDetails?.manager?.email
      ) {
        await actions.sendBookingApprovalEmail({
          id: userId,
          userName:
            userAccountDetails.user.firstName +
            userAccountDetails.user.lastName,
          userEmail: userAccountDetails.user.email,
          managerEmail: userAccountDetails.manager.email,
          managerName: userAccountDetails.manager.firstName,
          tripName: tripData.data.name,
          templateData: templateDataForApproval,
        });
      } else {
        setSubmitLoader(false);
        alert(
          "A manager has not been assigned. Please assign a manager or skip the approval."
        );
        return false;
      }
    }
    await actions.updateTravDetails(newData, tripId, userId);
    const templateData = {
      flights: [flight],
      travellerDetails: newData,
    };
    const price = `${Math.ceil(
      flightBooking?.totalFare +
        flightBooking?.finalFlightServiceCharge +
        flightBooking?.gstInFinalserviceCharge
    )?.toLocaleString("en-IN")}`;
    var req = await actions.sendApproval(
      userId,
      userAccountDetails?.manager?.userid,
      tripId,
      newData,
      price,
      data.bookingComments ? data.bookingComments : null,
      data.approvalStatus
    );
    await actions.AdminTrips_addingFromAdminUser(
      tripId,
      tripData,
      newData,
      [],
      selectedItems,
      [],
      [],
      tripData.data?.name,
      [],
      undefined,
      "",
      templateData,
      userId,
      "flights"
    );
    setSubmitLoader(false);
    setOpenBookUp(false);
    // await actions.getTripDocById(tripId,userId)
  };
  const adminFlightTrav =
    adminBooking?.data?.travellerDetails?.[newFlightId]?.adults;
  return (
    <>
      <Popup condition={openTravellers} close={() => setOpenTravellers(false)}>
        <div className="traveller-details-container">
          <div className="traveller-details-header">Traveller Details</div>
          {adminBooking?.data?.travellerDetails ? (
            <>
              {adminFlightTrav &&
                adminFlightTrav?.map((trav, i) => {
                  return (
                    <TravDetails type="Adults" index={i + 1} trav={trav} />
                  );
                })}
            </>
          ) : null}
        </div>
      </Popup>
      <Popup
        condition={openDelete}
        close={() => {
          setOpenDelete(false);
        }}
      >
        <div className="delete-item">
          <span>Are you sure you want to delete the trip item</span>
          <div>
            <button onClick={handleDelete}>Delete</button>
            <button
              className="back"
              onClick={() => {
                setOpenDelete(false);
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </Popup>
      <Popup condition={alltimeStamp} close={() => setAllTimeStamp(false)}>
        {tripsPage && (
          <div>
            <p>
              Added Date :
              {totalFlight &&
                totalFlight?.[0]?.date &&
                format(
                  new Date(totalFlight?.[0]?.date?.seconds * 1000),
                  "MMMM d, h:mm a"
                )}
            </p>
            <p>
              Sent to Approval :{" "}
              {totalFlight && totalFlight?.[0]?.manager_request_time
                ? format(
                    new Date(
                      totalFlight?.[0]?.manager_request_time?.seconds * 1000
                    ),
                    "MMMM d, h:mm a"
                  )
                : "Not Requested for Approval"}{" "}
            </p>
            <p>
              Approved Date :{" "}
              {totalFlight && totalFlight?.[0]?.managerApprovedTime
                ? format(
                    new Date(
                      totalFlight?.[0]?.managerApprovedTime?.seconds * 1000
                    ),
                    "MMMM d, h:mm a"
                  )
                : "Not Approved"}
            </p>
            <p>
              Submitted Date :{" "}
              {totalFlight && totalFlight?.[0]?.submitted_date
                ? format(
                    new Date(totalFlight?.[0]?.submitted_date?.seconds * 1000),
                    "MMMM d, h:mm a"
                  )
                : "Not Submitted"}
            </p>
            <p>
              Booked Date :{" "}
              {totalFlight && totalFlight?.[0]?.booked_date
                ? format(
                    new Date(totalFlight?.[0]?.booked_date?.seconds * 1000),
                    "MMMM d, h:mm a"
                  )
                : "Not Booked"}
            </p>
          </div>
        )}
      </Popup>
      <Popup
        condition={showStopDtls}
        close={() => {
          setStopDtls([]);
          setShowStopDtls(false);
        }}
      >
        <div className="flightStopDtls-popup-block">
          {stopDtls &&
            stopDtls.map((stop, s) => {
              return (
                <div className="flightStopDtls-popup-card">
                  {stop.layoverDur ? (
                    <div className="flightStopDtls-popup-card-layover">
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="flightStopDtls-popup-card-layover-icon"
                      />
                      {`Layover for ${stop.layoverDur} in ${stop.arrCity}`}
                    </div>
                  ) : null}
                  <div className="flightStopDtls-popup-card-route">
                    <div className="flightResults-list-flightCard-arrDep">
                      <div className="flightResults-list-flightCard-dep">
                        <div className="flightResults-list-flightCard-depTime">
                          {stop.depTime}
                        </div>
                        <div className="flightResults-list-flightCard-depCity">
                          {stop.originCode}
                        </div>
                      </div>
                      <div className="flightResults-list-flightCard-duration">
                        <div className="flightResult-list-flightCard-duration-stopPts"></div>
                        <div className="flightResults-list-flightCard-duration-time">
                          {stop.flightDur}
                        </div>
                      </div>
                      <div className="flightResults-list-flightCard-arr-section">
                        <div className="flightResults-list-flightCard-dep flightResults-list-flightCard-arr">
                          <div className="flightResults-list-flightCard-depTime">
                            {stop.arrTime}
                          </div>
                          <div className="flightResults-list-flightCard-depCity">
                            {stop.destCode}
                          </div>
                        </div>
                        {/* {segment.arrAfterDays > 0 ? (
                          <div className="flightResults-list-flightCard-depTime-afterDays">
                            <div className="flightResults-list-flightCard-depTime-afterDays-num">{`+ ${segment.arrAfterDays}`}</div>
                            <div>{`${
                              segment.arrAfterDays > 1 ? "Days" : "Day"
                            }`}</div>
                          </div>
                        ) : null} */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Popup>
      <Popup condition={tripsBaggage} close={() => setTripsBaggage(false)}>
        {tripsPage ? (
          <>
            <div className="flightBook-baggageMeals-bag-section">
              <div className="flightBook-baggageMeals-bag-title">
                Baggage details
              </div>
              <div className="flightBook-baggageMeals-bag-details-section">
                {/* <div className="flightBook-baggageMeals-bag-route">
                    HYD - BLR
                  </div> */}
                <div className="flightBook-baggageMeals-bag-details">
                  {flightBooking?.baggageDtls?.cabinBaggage ? (
                    <div className="flightBook-baggageMeals-bag-detail">
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="flightBook-baggageMeals-bag-detail-icon"
                      />
                      Cabin baggage:
                      <span>{flightBooking?.baggageDtls?.cabinBaggage}</span>
                    </div>
                  ) : null}
                  {flightBooking?.baggageDtls?.baggage ? (
                    <div className="flightBook-baggageMeals-bag-detail">
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="flightBook-baggageMeals-bag-detail-icon"
                      />
                      Check-in baggage:
                      <span>{flightBooking?.baggageDtls?.baggage}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {Array.isArray(flightBooking?.selectedBaggage) ? (
              <>
                {flightBooking?.selectedBaggage.map((meal) => {
                  return (
                    <>
                      <div>Extra Baggage:</div>
                      <div className="flightBook-meals">
                        {meal.map((meals, s) => {
                          var type =
                            s + 1 <= flightBooking.adults
                              ? "Adult"
                              : s + 1 <=
                                flightBooking.adults + flightBooking.child
                              ? "Child"
                              : "Infant";
                          var indexe =
                            s + 1 <= flightBooking.adults
                              ? s
                              : s + 1 <=
                                flightBooking.adults + flightBooking.child
                              ? s - flightBooking.adults
                              : "Infant";
                          return (
                            <span>
                              {meals.price > 0 ? (
                                <>
                                  {type}-{indexe + 1}: {meals.baggage}KG
                                  -&gt;&nbsp;
                                  <span>
                                    <FontAwesomeIcon
                                      icon={faIndianRupeeSign}
                                      className="icon"
                                    />
                                    {meals.price}
                                  </span>{" "}
                                  {meals.text ? meals.text : ""}
                                </>
                              ) : null}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  );
                })}
              </>
            ) : null}
          </>
        ) : null}
      </Popup>
      <Popup
        condition={tripsCancellation}
        close={() => setTripsCancellation(false)}
      >
        {Array.isArray(flightBooking?.flight?.MiniFareRules) ? (
          <>
            {flightBooking?.flight?.MiniFareRules &&
            flightBooking?.flight?.MiniFareRules ? (
              <div className="flightBook-cancel">
                <div className="flightBook-cancel-title">
                  Cancellation and date change
                </div>
                <div className="flightBook-cancel-section">
                  <div className="flightBook-cancel-details">
                    <div className="flightBook-cancel-details-title">
                      Cancellation
                    </div>
                    {flightBooking?.flight?.MiniFareRules &&
                      flightBooking?.flight?.MiniFareRules?.[0]
                        ?.map((rule, r) => {
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
                  <div className="flightBook-cancel-details flightBook-cancel-details-last">
                    <div className="flightBook-cancel-details-title">
                      Date change
                    </div>
                    {flightBooking?.flight?.MiniFareRules &&
                      flightBooking?.flight?.MiniFareRules[0]
                        ?.map((rule, r) => {
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
          </>
        ) : null}
      </Popup>
      <Popup condition={tripsMeals} close={() => setTripsMeals(false)}>
        {Array.isArray(flightBooking?.selectedMeals) ? (
          <>
            {flightBooking.selectedMeals.map((meal) => {
              return (
                <>
                  <div className="flightBook-meals">
                    <span className="header">Selected Meals</span>
                    {meal.map((meal, s) => {
                      var type =
                        s + 1 <= flightBooking.adults
                          ? "Adult"
                          : s + 1 <= flightBooking.adults + flightBooking.child
                          ? "Child"
                          : "Infant";
                      var indexe =
                        s + 1 <= flightBooking.adults
                          ? s
                          : s + 1 <= flightBooking.adults + flightBooking.child
                          ? s - flightBooking.adults
                          : "Infant";
                      return (
                        <span>
                          {type}-{indexe + 1}:{meal.mealDesc} -&gt;
                          <span>
                            <FontAwesomeIcon
                              icon={faIndianRupeeSign}
                              className="icon"
                            />
                            {meal.price}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </>
              );
            })}
          </>
        ) : null}
      </Popup>
      {/* <Popup condition={tripsSeat} close={() => setTripsSeat(false)}>
        {flight.length > 0 ? (
          <div className="tripsPage-flight-seat">
            Selected Seats:
            {flight?.map((ids, index) => {
              return (
                <>
                  Passenger-{index + 1}:&nbsp;
                  {flightBooking
                    ? flightBooking?.seats?.[0]?.length > 0
                      ? flightBooking?.seats?.[0]?.[0]?.[ids]?.Code
                      : ""
                    : ""}
                  &nbsp;
                  {index !== flight.length - 1 ? "," : ""}
                </>
              );
            })}
          </div>
        ) : null}
      </Popup> */}
      <Popup
        condition={openFareRules}
        close={() => {
          setOpenFareRules(false);
        }}
      >
        <div className="flightBook-fareRules-section">
          <div dangerouslySetInnerHTML={{ __html: flightBooking?.fareRules }} />
        </div>
      </Popup>
      <Popup
        condition={openFlightPrice}
        close={() => {
          setOpenFlightPrice(false);
        }}
      >
        {tripsPage && (
          <FlightPriceCard
            flightBooking={flightBooking}
            fareData={fareData}
            tripsPage={tripsPage}
          />
        )}
      </Popup>
      <Popup
        condition={openBookUp}
        close={() => {
          setOpenBookUp(false);
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-scroll h-[80vh]"
        >
          {userAccountDetails.user
            ? Array.from({ length: parseInt(flight?.data?.adults) }, (_, i) => {
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
                              i === 0 ? userAccountDetails.user.gender : "Mr"
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
                              i === 0 ? userAccountDetails.user.firstName : ""
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
                              i === 0 ? userAccountDetails.user.lastName : ""
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
                        {i === 0 && (
                          <>
                            <label className="flex flex-col text-[12px]">
                              Email
                              <Controller
                                name={`adults[${i}].email`}
                                control={control}
                                defaultValue={
                                  i === 0 ? userAccountDetails.user.email : ""
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
                                  i === 0
                                    ? userAccountDetails.user.mobileNumber
                                    : ""
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
                                i === 0 ? userAccountDetails.user.gender : "Mr"
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
              })
            : null}
          <div className="flex items-center justify-center  gap-2 mt-3 flex-wrap">
            <Controller
              name={`approvalStatus`}
              control={control}
              rules={{ required: "Approval status is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="border border-black rounded-md placeholder:text-[14px] pl-1 py-1"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Skipped">Skipped</option>
                  <option value="Approved">Approved</option>
                </select>
              )}
            />
            {approvalStatus === "Approved" && (
              <Controller
                name="approvalType"
                control={control}
                defaultValue={null}
                rules={{
                  required: "Approval Type is required",
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    required
                    placeholder="Approval Type"
                    className="border border-black rounded-md placeholder:text-[14px] pl-1 py-1"
                  ></textarea>
                )}
              />
            )}

            <Controller
              name="bookingComments"
              control={control}
              defaultValue={"NA"}
              // rules={{
              //   required:
              //     approvalStatus === "Approved" ||
              //     approvalStatus === "Skipped"
              //       ? false
              //       : "Approval comments are required",
              // }}
              render={({ field }) => (
                <textarea
                  {...field}
                  required
                  placeholder="Sent to Approver"
                  className="border border-black rounded-md placeholder:text-[14px] pl-1 py-1"
                  onChange={(e) => {
                    setBookingComments(e.target.value);
                    field.onChange(e);
                  }}
                ></textarea>
              )}
            />
          </div>
          <button
            type="submit"
            className="bg-black rounded-lg py-1 px-2 text-white text-[14px] block m-auto mt-2"
            disabled={submitLoader}
          >
            {submitLoader ? (
              <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </Popup>
      <div
        className={
          bookingFlight &&
          bookingFlight[flightResJType]?.flight.flightCodeStr ===
            flightGrp?.[0]?.flightCodeStr &&
          !bookingPage
            ? "flightResults-list-flightCard flightResults-list-flightCard-selected"
            : "flightResults-list-flightCard"
        }
        style={flightStatus ? getFlightStatusStyle(flightStatus.status) : null}
      >
        <div
          className={
            flightArr?.[0]?.segments.length > 1
              ? "flightResults-list-flightCard-segment-block flightResults-list-flightCard-segment-seperate"
              : "flightResults-list-flightCard-segment-block"
          }
        >
          {flightArr?.[0]?.segments.map((segment, sg) => {
            var flightCode = "";
            segment.flightCodes.forEach((code, c) => {
              if (c === segment.flightCodes.length - 1) {
                flightCode += code;
              } else {
                flightCode += `${code}, `;
              }
            });
            var airlinename = segment.airlineName;

            var airline = airlinelogos?.filter((a) => {
              return airlinename.toLowerCase() === a.id;
            });

            return (
              <>
                <div className="flightResults-list-flightCard-airline-block">
                  <div className="flightResults-list-flightCard-airline">
                    {airline?.[0] ? (
                      <div className="flightResults-list-flightCard-logo">
                        <span
                          style={{
                            backgroundImage: `url(${airline?.[0]?.url})`,
                          }}
                        ></span>
                      </div>
                    ) : (
                      <div className="flightResults-list-flightCard-logo">
                        <span>
                          <FontAwesomeIcon
                            icon={faPlaneDeparture}
                            className="flightResults-list-flightCard-logo-icon"
                          />
                        </span>
                      </div>
                    )}
                    {`${segment.airlineName}`}
                    <span>&nbsp;&nbsp;({flightCode})</span>
                  </div>
                  {bookingPage || tripsPage ? (
                    <div className="flightResults-list-flightCard-depDate-block">
                      <div className="flightResults-list-flightCard-depDate">
                        {segment.depTimeDate.toString().slice(4, 10)}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div
                  className={
                    false
                      ? "flightResults-list-flightCard-segment-section flightResults-list-flightCard-segment-section-selected"
                      : "flightResults-list-flightCard-segment-section"
                  }
                >
                  <div className="flightResults-list-flightCard-arrDep">
                    <div className="flightResults-list-flightCard-dep">
                      <div className="flightResults-list-flightCard-depTime">
                        {segment.depTime}
                      </div>
                      <div className="flightResults-list-flightCard-depCity">
                        {segment.originAirportCode}
                      </div>
                    </div>
                    <div className="flightResults-list-flightCard-duration">
                      <div
                        className="flightResult-list-flightCard-duration-stopPts"
                        onClick={() => {
                          setStopDtls(segment.segRoutes);
                          setShowStopDtls(true);
                        }}
                      >
                        <div className="flightResult-list-flightCard-duration-stopType">
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
                              className="flightResult-list-flightCard-duration-stopType-icon"
                            />
                          ) : null}
                        </div>
                      </div>
                      <div className="flightResults-list-flightCard-duration-time">
                        {segment.finalTime === "NaNm"
                          ? segment.duration
                          : segment.finalTime}
                      </div>
                    </div>
                    <div className="flightResults-list-flightCard-arr-section">
                      <div className="flightResults-list-flightCard-dep flightResults-list-flightCard-arr">
                        <div className="flightResults-list-flightCard-depTime">
                          {segment.arrTime}
                        </div>
                        <div className="flightResults-list-flightCard-depCity">
                          {segment.destAirportCode}
                        </div>
                      </div>
                      {segment.arrAfterDays > 0 ? (
                        <div className="flightResults-list-flightCard-depTime-afterDays">
                          <div className="flightResults-list-flightCard-depTime-afterDays-num">{`+ ${segment.arrAfterDays}`}</div>
                          <div>{`${
                            segment.arrAfterDays > 1 ? "Days" : "Day"
                          }`}</div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {bookingPage ? (
                    <div className="flightResults-list-flightCard-airportNames">
                      <div className="flightResults-list-flightCard-airportName">
                        <div className="flightResults-list-flightCard-cityName">
                          {segment.originCityName}
                        </div>
                        {segment.originAirportName}
                      </div>
                      <div className="flightResults-list-flightCard-airportName flightResults-list-flightCard-airportName-dest">
                        <div className="flightResults-list-flightCard-cityName">
                          {segment.destCityName}
                        </div>
                        {segment.destAirportName}
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            );
          })}
        </div>

        <div className="flightResults-list-flightCard-header">
          {!bookingPage ? (
            <>
              <div className="flightResults-list-flightCard-baggageCancel-block">
                <div
                  className="flightResults-list-flightCard-baggageCancel"
                  onClick={() => {
                    setBaggage(true);
                    setBaggageDtls({
                      baggage: flightArr?.[0]?.segments?.[0]?.baggage,
                      cabinBaggage: flightArr?.[0]?.segments?.[0]?.cabinBaggage,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faSuitcaseRolling} />
                </div>
                <div
                  className="flightResults-list-flightCard-baggageCancel"
                  onClick={async () => {
                    setCancellation(true);
                    if (flightArr?.[0]?.fareRules.length === 0) {
                      var details = await actions.fetchFareRule(
                        flightArr?.[0]?.resultIndex,
                        flightArr?.[0]?.segments?.[0]?.airlineName,
                        600
                      );
                      setCancelDtls(details);
                    } else {
                      setCancelDtls(flightArr?.[0]?.fareRules);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faCalendarXmark} />
                </div>
              </div>

              <div className="flightResults-list-flightCard-fare">
                <div className="flightResults-list-flightCard-price">
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightResults-list-flightCard-price-icon"
                  />
                  {`${flightArr?.[0]?.fare.toLocaleString("en-IN")}`}
                </div>
                <div className="flightResults-list-flightCard-book">
                  <button
                    onClick={() => {
                      if (flightResJType === 1 && !bookingFlight.length > 0) {
                        setOpen(true);
                        return;
                      } else {
                        actions.fetchFlightBookData(
                          flightArr?.[0]?.resultIndex,
                          flightGrp?.[0],
                          {
                            baggage:
                              flightArr?.[0]?.segments[segmentIndex].baggage,
                            cabinBaggage:
                              flightArr?.[0]?.segments[segmentIndex]
                                .cabinBaggage,
                          },
                          index
                        );
                      }
                      removeFilters();
                    }}
                  >
                    {flightResList.length > 1 ? "Select" : "Book"}
                  </button>
                </div>
              </div>
            </>
          ) : !tripsPage && !adminPage ? (
            <>
              <div className="flightResults-list-flightCard-fTypeBadge">
                {bookingFlight[index].flightNew.fareType}
              </div>
              <div className="flightResults-list-flightCard-travellers">
                {`${bookingFlight[index].adults} ${
                  bookingFlight[index].adults > 1 ? "Adults" : "Adults"
                } ${
                  bookingFlight[index].child > 0
                    ? `, ${bookingFlight[index].child} ${
                        bookingFlight[index].child > 1 ? "children" : "child"
                      }`
                    : ""
                }   ${
                  bookingFlight[index].infant > 0
                    ? `, ${bookingFlight[index].infant} ${
                        bookingFlight[index].infant > 1 ? "infants" : "infant"
                      }`
                    : ""
                }`}
              </div>
              <div className="flightResults-list-flightCard-cabinClass">
                {flightArr?.[0]?.segments?.[0]?.cabinClass}
              </div>
            </>
          ) : (
            <>
              <div className="flightResults-list-flightCard-fTypeBadge">
                {flightBooking.flightNew.fareType}
              </div>
              <div className="flightResults-list-flightCard-travellers">{`${Number(
                flightBooking.adults
              )} ${Number(flightBooking.adults) > 1 ? "Adults" : "Adults"} ${
                Number(flightBooking.child) > 0
                  ? `, ${Number(flightBooking.child)} ${
                      Number(flightBooking.child) > 1 ? "children" : "child"
                    }`
                  : ""
              }   ${
                Number(flightBooking.infant) > 0
                  ? `, ${Number(flightBooking.infant)} ${
                      Number(flightBooking.infant) > 1 ? "infants" : "infant"
                    }`
                  : ""
              }`}</div>
              <div className="flightResults-list-flightCard-cabinClass">
                {flightArr?.[0]?.segments?.[0]?.cabinClass}
              </div>
            </>
          )}
        </div>
        {bookingPage && tripsPage ? (
          <>
            <div className="flightRes-tripsPage-details">
              <FontAwesomeIcon
                icon={faSuitcaseRolling}
                onClick={(e) => setBaggageOpen(e)}
                className="flightRes-tripsPage-details-icon"
              />
              <FontAwesomeIcon
                icon={faCalendarXmark}
                onClick={(e) => setCancellationOpen(e)}
                className="flightRes-tripsPage-details-icon"
              />
              <FontAwesomeIcon
                icon={faCutlery}
                onClick={(e) => setMealsOpen(e)}
                className="flightRes-tripsPage-details-icon"
              />
              <FontAwesomeIcon
                icon={faCircleInfo}
                onClick={(e) => setFareRules(e)}
                className="flightRes-tripsPage-details-icon"
              />
              <FontAwesomeIcon
                icon={faChair}
                onClick={(e) => setSeatsOpen(e)}
                className="flightRes-tripsPage-details-icon"
              />
            </div>
            {/* {userPage ? null : (
              <>
                {isTimeReCheck ? (
                  <div className="recheck-rates">
                    <div className="recheck-bg"></div>
                    <div className="recheck-content">
                      <button
                        onClick={async () => {
                          setOpenDelete(true);
                          setDeleteType("flights");
                          setDeleteId(flightId);
                          //await actions.updateFlightBookingDetails(7907, flightId, tripId)
                        }}
                      >
                        <MdDelete color="red" />
                      </button>
                      <button
                        onClick={async () => {
                          setReCheckLoading(true);
                          setOpenPriceReCheck(true);
                          var data = await actions.getFlightUpdatedDetails(
                            flightBooking.flightRequest,
                            flightBooking.flight
                          );
                          const selectedSeats = {
                            "1A": {
                              Destination: "COK",
                              Deck: 1,
                              SeatNo: "E",
                              Description: 2,
                              FlightNumber: "635",
                              AvailablityTyp: "1",
                            },
                            "1B": {
                              RowNo: "8",
                              Destination: "COK",
                              CraftType: "A320-186",
                              SeatWayType: 2,
                              Code: "8F",
                              AvailablityTyp: "3",
                            },
                          };
                          // console.log(
                          //   areSeatsAvailable(
                          //     data.ssrData.SeatDynamic[0].SegmentSeat[0].RowSeats,
                          //     selectedSeats
                          //   )
                          // );
                          getUpdatedFares(data?.ssrData);
                          setReCheckData(data);
                          areSeatsAvailable(
                            data?.ssrData?.SeatDynamic !== undefined
                              ? data?.ssrData?.SeatDynamic?.[0]
                                  ?.SegmentSeat?.[0]?.RowSeats
                              : null,
                            flightBooking?.seats !== undefined
                              ? flightBooking?.seats?.[0]?.[0]
                              : null
                            // selectedSeats
                          );
                          setReCheckLoading(false);
                          setDeleteType("flights");
                          setDeleteId(flightId);
                        }}
                      >
                        ReCheck
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            )} */}
            <div className="seperate"></div>
            <div className="timestamp">
              <div>
                {flightStatus?.requestStatus === "Pending" ||
                flightStatus?.status === "Submitted" ||
                flightStatus?.status === "Booked" ||
                flightStatus?.requestStatus === "Approved" ? null : (
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="delete-icon"
                    onClick={() => {
                      setOpenDelete(true);
                      setDeleteType("flights");
                      setDeleteId(flightId);
                    }}
                  />
                )}
              </div>
              <div
                onClick={() => {
                  console.log(tripData);
                  setTimeStampData();
                  setAllTimeStamp(true);
                }}
              >
                <LuAlarmClock size={15} className="cursor-pointer" />
              </div>
              <div>
                {/* Added:&nbsp;
                <span>{timeStamp.toString().slice(4, 25)}</span> */}
              </div>
              {/* {updatedAt !== undefined ? (
                <div>
                  Updated:&nbsp;
                  <span>
                    {new Date(updatedAt * 1000).toString().slice(4, 25)}
                  </span>
                </div>
              ) : null} */}
              <div className="flightResults-list-flightCard-price-trips">
                Total Price:
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="flightResults-list-flightCard-price-icon"
                />
                {`${Math.ceil(
                  flightBooking?.totalFare +
                    flightBooking?.finalFlightServiceCharge +
                    flightBooking?.gstInFinalserviceCharge
                )?.toLocaleString("en-IN")}`}
                &nbsp;
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className="info-icon"
                  onClick={() => {
                    setOpenFlightPrice((prev) => !prev);
                  }}
                />
              </div>
            </div>
            <div className="seperate"></div>
            <div className="flightResults-tripsPage">
              <div className="request-status">
                Approval Status:
                <span
                  style={{
                    background: reqColor?.[0]
                      ? reqColor?.[0]?.color
                      : "#808080",
                  }}
                >
                  {flightStatus?.requestStatus}
                </span>
              </div>
              {flightStatus ? (
                <div className="flight-main-status">
                  {flightStatus?.status ? (
                    <>
                      <div className="flightStatus">
                        Booking Status:
                        <span style={{ background: color?.[0]?.color }}>
                          {flightStatus?.status}
                        </span>
                      </div>
                      {downloadUrl ? (
                        <div
                          className="flightResults-list-flightCard-download"
                          onClick={downloadDoc}
                        >
                          Voucher&nbsp;
                          <FontAwesomeIcon icon={faDownload} />
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
              ) : (
                <div className="flightStatus" style={{ background: "#808080" }}>
                  Booking Status
                  <span style={{ background: "#808080" }}>Not Submitted</span>
                </div>
              )}
              {tripsPage ? (
                <div>
                  {userPage ? null : (
                    <>
                      {tripData?.data?.travellerDetails &&
                      tripData?.data?.travellerDetails[flight.id] ? (
                        <Button
                          sx={{ position: "static", fontSize: "11px" }}
                          className="!bg-[#94d2bd] !text-black"
                          size="small"
                          onClick={() => {
                            console.log(flight.id);

                            setNewTravellerDetails(
                              () => tripData?.data?.travellerDetails[flight.id]
                            );
                            setAddTravellers(true);
                          }}
                        >
                          View Travellers
                        </Button>
                      ) : (
                        <Button
                          sx={{ position: "static", fontSize: "11px" }}
                          className="!bg-[#0a9396] !text-white"
                          size="small"
                          onClick={() => {
                            console.log(flight.id);

                            setAddTravellers(true);
                          }}
                        >
                          Add Travellers
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
        {flightArr.length > 1 ? (
          <div className="flightResults-list-flightCard-viewPrices">
            <div
              className="flightResults-list-flightCard-viewPrices-section"
              onClick={(e) => {
                toggle(e);
              }}
            >
              View Prices{" "}
              <FontAwesomeIcon
                icon={faChevronDown}
                className={
                  isOpen
                    ? "flightResults-list-flightCard-viewPrices-icon flightResults-list-flightCard-viewPrices-icon-open"
                    : "flightResults-list-flightCard-viewPrices-icon"
                }
              />
            </div>
          </div>
        ) : null}
        <div
          className="flightResults-list-flightCard-fareList"
          id={`flightIndex${index}`}
          style={{
            display: "none",
            cursor: "default",
          }}
        >
          {flightArr.map((flight, f) => {
            if (f > 0) {
              return (
                <div
                  className={
                    f === flightArr.length - 1
                      ? "flightResults-list-flightCard-segment-fareList flightResults-list-flightCard-segment-fareList-last"
                      : "flightResults-list-flightCard-segment-fareList"
                  }
                >
                  <div className="flightResults-list-flightCard-fareType">
                    {`${flight.fareType}`}
                  </div>
                  <div className="flightResults-list-flightCard-header">
                    <div className="flightResults-list-flightCard-baggageCancel-block">
                      <div
                        className="flightResults-list-flightCard-baggageCancel"
                        onClick={() => {
                          setBaggage(true);
                          setBaggageDtls({
                            baggage: flight.segments?.[0]?.baggage,
                            cabinBaggage: flight.segments?.[0]?.cabinBaggage,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faSuitcaseRolling} />
                      </div>
                      <div
                        className="flightResults-list-flightCard-baggageCancel"
                        onClick={async () => {
                          setCancellation(true);
                          if (flight.fareRules.length === 0) {
                            var details = await actions.fetchFareRule(
                              flight.resultIndex,
                              flightArr[f].segments?.[0]?.airlineName,
                              600
                            );
                            setCancelDtls(details);
                          } else {
                            setCancelDtls(flightArr[f].fareRules);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faCalendarXmark} />
                      </div>
                    </div>
                    <div className="flightResults-list-flightCard-fare">
                      <div className="flightResults-list-flightCard-price">
                        <FontAwesomeIcon
                          icon={faIndianRupeeSign}
                          className="flightResults-list-flightCard-price-icon"
                        />
                        {`${flight.fare.toLocaleString("en-IN")}`}
                      </div>
                      <div className="flightResults-list-flightCard-book">
                        <button
                          onClick={() => {
                            console.log(flightArr[f].resultIndex);
                            if (flightResJType === 1 && !bookingFlight) {
                              setOpen(true);
                              return;
                            } else {
                              actions.fetchFlightBookData(
                                flightArr[f].resultIndex,
                                flightGrp[f],
                                {
                                  baggage: flightArr[f].segments?.[0]?.baggage,
                                  cabinBaggage:
                                    flightArr[f].segments?.[0]?.cabinBaggage,
                                },
                                index
                              );
                            }
                            removeFilters();
                          }}
                        >
                          {flightResList.length > 1 ? "Select" : "Book"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className=" flex ml-4  items-center ">
          {userPage ? (
            <>
              {isThere && (
                <button onClick={() => {}}>
                  <PDFDownloadLink
                    document={
                      <InvoicePdf1
                        type="Flight"
                        flight={flight}
                        userAccountDetails={user}
                        invoiceId={isThere.invoiceId}
                        tripData={userPage ? adminTripdata : tripData}
                        totalFlight={totalFlight?.[0]}
                        adminTripdata={adminTripdata}
                      />
                    }
                    fileName={`${
                      userPage ? adminTripdata?.data?.name : tripData.data?.name
                    }_Invoice.pdf`}
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? (
                        <div className="font-semibold flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt]">
                          <p>Invoice PDF</p>
                          <FontAwesomeIcon icon={faDownload} />
                        </div>
                      ) : (
                        <div className="font-semibold flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt]">
                          <p>Invoice PDF</p>
                          <FontAwesomeIcon icon={faDownload} />
                        </div>
                      )
                    }
                  </PDFDownloadLink>
                </button>
              )}
            </>
          ) : (
            <>
              {isThere && (
                <button onClick={() => {}}>
                  <PDFDownloadLink
                    document={
                      <InvoicePdf1
                        type="Flight"
                        flight={flight}
                        userAccountDetails={userAccountDetails.user}
                        invoiceId={isThere.invoiceId}
                        tripData={tripData}
                        totalFlight={totalFlight?.[0]}
                      />
                    }
                    fileName={`${tripData.data?.name}_Invoice.pdf`}
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? (
                        <div className="font-semibold flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt]">
                          <p>Invoice PDF</p>
                          <FontAwesomeIcon icon={faDownload} />
                        </div>
                      ) : (
                        <div className="font-semibold flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt]">
                          <p>Invoice PDF</p>
                          <FontAwesomeIcon icon={faDownload} />
                        </div>
                      )
                    }
                  </PDFDownloadLink>
                </button>
              )}
            </>
          )}
          {flightStatus?.note && (
            <p className="ml-[10pt] text-[12pt] font-bold">Note:<span className="text-gray-500 text-[10pt]">{flightStatus?.note}</span></p>
          )}
        </div>

        {userPage && flightStatus?.status === "Not Submitted" && (
          <>
            <div className="hotel-travellers">
              <button
                onClick={() => {
                  setOpenBookUp(true);
                  if (profileDetails) {
                    setNewTravellerDetails(
                      () => profileDetails?.data?.travellerDetails?.[flightId]
                    );
                  }
                }}
              >
                Submit
              </button>
            </div>
          </>
        )}
        {flightStatus?.status === "Submitted" && (
          <button
            onClick={() => {
              setOpenTravellers(true);
              setNewFlightid(flightData?.id);
            }}
            className="border-[1px] border-black rounded-md p-[4px] ml-4"
          >
            Traveller Details
          </button>
        )}
      </div>
    </>
  );
}

export default AdminFlightItems;
