import React, { useContext, useEffect, useState } from "react";
import SideNav from "../SideNav/SideNav";
import { useNavigate, useParams } from "react-router-dom";
import "./UserTrips.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBan,
  faCheckCircle,
  faCircleInfo,
  faDownload,
  faIndianRupeeSign,
  faStar,
  faStarHalf,
  faTrash,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import MyContext from "../../Context";
import { ScaleLoader } from "react-spinners";
import Flight from "../../Flights/Flight/Flight";
import Popup from "../../Popup";
import { RiGlobalFill } from "react-icons/ri";
import Bus from "../../Bus/Bus/Bus";
import Cab from "../../Cabs/Cab/Cab";
import { FaSpinner } from "react-icons/fa";
import HotelTravelInput from "../../Trips/TripDetails/HotelTravelInput";
import InvoicePdf1 from "../../InvoicePdf1";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LuAlarmClock } from "react-icons/lu";
import { format } from "date-fns";
import AdminSearchFlight from "../AddFromAdmin/AdminSearchFlight";
import AdminFlightItems from "../AddFromAdmin/AdminFlightItems";
import HotelTravSubmit from "./HotelTravSubmit";
import HotelPriceCard from "../../Trips/TripDetails/HotelPriceCard";
import TravDetails from "../../Trips/TripDetails/TravellerDetails";
const UserTrips = () => {
  const [mounted, setMounted] = useState(true);
  const {
    actions,
    tripData,
    domesticFlight,
    minimumServiceCharge,
    adminTripDetails,
    adminsLoader,
    tripDataLoading,
  } = useContext(MyContext);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openHotelPrice, setOpenHotelPrice] = useState(false);
  const [hotelTotalPrice, setHotelTotalPrice] = useState(0);
  const [hotelFinalPrice, setHotelFinalPrice] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [deleteType, setDeleteType] = useState(false);
  const [otherBookingPopup, setOtherBookingPopup] = useState(false);
  const [bookingType, setBookingType] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingAdults, setBookingAdults] = useState("");
  const [bookingDetails, setBookingDetails] = useState("");
  const [bookingCancellation, setBookingCancellation] = useState("");
  const [bookingStatus, setBookingStatus] = useState("Pending");
  const [bookingComments, setBookingComments] = useState("");
  const [bookingCost, setBookingCost] = useState("");
  const [bookingService, setBookingService] = useState("");
  const [bookingTravellers, setBookingTravellers] = useState("");
  const [openTravellers, setOpenTravellers] = useState(false);
  const [newhotelId, setNewHotelid] = useState();
  const [hotelData, setHotelData] = useState(null);
  const [travellerDetails, setTravellerDetails] = useState([
    { title: "", firstName: "", lastName: "", email: "", mobileNumber: "" },
  ]);
  const [otherBookingLoader, setOtherBookingLoader] = useState(false);
  const [user, setUser] = useState();
  const [manager, setManager] = useState();
  const [invoiceData, setInvoiceData] = useState([]);
  const [alltimeStamp, setAllTimeStamp] = useState(false);
  const [timeStampDate, setTimeStampData] = useState();
  const [otherBookingError, setOtherBookingError] = useState("");
  const [allotherTime, setAllOtherTime] = useState(false);
  const [allotherTimeData, setAllOtherTimeData] = useState();
  const [otherPriceInfo, setOtherPriceInfo] = useState(false);
  const [otherPrice, setOtherPrice] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const { userId, tripId } = params;
  var statuses = [
    { status: "Submitted", color: "#ffa500" },
    { status: "Need clarification", color: "#FFC107" },
    { status: "Price Revision", color: "#2196F3" },
    { status: "Booked", color: "#4CAF50" },
    { status: "Cancelled", color: "#FF0000" },
    { status: "Submitted,Payment Pending", color: "#ffa500" },
    { status: "Booked,Payment Pending", color: "#4CAF50" },
    { status: "Not Submitted", color: "#808080" },
  ];
  var reqStatuses = [
    { status: "Approved", color: "#008000" },
    { status: "Pending", color: "#ffa500" },
    { status: "Not Requested", color: "#808080" },
  ];

  var handleDelete = async () => {
    await actions.deleteTripItem(tripId, deleteId, deleteType);
    setOpenDelete(false);
    //await getTripData()
  };

  const getData = async () => {
    setLoading(true);
    var data = await actions.getAdminTripDoc(tripId, userId);
    console.log(data);
    setUser(data.user.user);
    setManager(data.user.manager);
    setTravellerDetails([
      {
        title: data.user.user.gender,
        firstName: data.user.user.firstName,
        lastName: data.user.user.lastName,
        mobileNumber: data.user.user.mobileNumber,
        email: data.user.user.email,
      },
    ]);
    setLoading(false);
    // setTripData(data);
  };
  var totalPrice =
    tripData?.flights?.reduce(
      (sum, obj) =>
        sum +
        (obj?.data?.totalFare +
          obj?.data?.finalFlightServiceCharge +
          obj?.data?.gstInFinalserviceCharge),
      0
    ) +
    tripData?.hotels?.reduce(
      (sum, obj) => sum + obj?.data?.hotelTotalPrice,
      0
    ) +
    tripData?.cabs?.reduce((sum, obj) => sum + obj?.data?.cabTotalPrice, 0) +
    tripData?.bus?.reduce((sum, obj) => sum + obj?.data?.busTotalPrice, 0) +
    tripData?.otherBookings?.reduce(
      (sum, obj) => sum + obj?.data?.overallBookingPrice,
      0
    );

  var downloadDoc = async (hotelStatus) => {
    var downloadName = hotelStatus[0].downloadURL.slice(
      164,
      hotelStatus[0].downloadURL.indexOf("?")
    );
    const response = await fetch(hotelStatus[0].downloadURL);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const addNewTravellers = () => {
    setTravellerDetails([
      ...travellerDetails,
      { title: "Mr", firstName: "", lastName: "", email: "", mobileNumber: "" },
    ]);
  };
  const removeDetail = (index) => {
    const updatedDetails = travellerDetails.filter((_, i) => i !== index);
    setTravellerDetails(updatedDetails);
  };
  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDetails = travellerDetails.map((detail, i) =>
      i === index ? { ...detail, [name]: value } : detail
    );
    setTravellerDetails(updatedDetails);
  };
  const handleBookingSubmmit = async (status) => {
    if (bookingType === "") {
      setOtherBookingError("Please enter booking Type");
      return false;
    }
    if (bookingDate === "") {
      setOtherBookingError("Enter travel Date");
      return false;
    }
    if (bookingStatus === "") {
      setOtherBookingError("Select status");
      return false;
    }
    if (bookingCost === "") {
      setOtherBookingError("Enter booking cost");
      return false;
    }
    if (bookingService === "") {
      setOtherBookingError("Enter booking service charge");
      return false;
    }
    setOtherBookingLoader(true);
    setOtherBookingError("");
    const data = {
      bookingType: bookingType,
      bookingDate: bookingDate,
      bookingDetails: bookingDetails,
      bookingCancellation: bookingCancellation,
      bookingStatus: bookingStatus,
      bookingCost: bookingCost,
      bookingService: bookingService,
      bookingGst: calculateTax(bookingService),
      overallBookingPrice:
        bookingCost + bookingService + calculateTax(bookingService),
      bookingComments: bookingComments,
      bookingAdults: bookingAdults,
      bookingTravellers: travellerDetails,
      bookingBookedStatus: "Submitted",
    };
    const otherBookingObject = await actions.addOtherBoookings(
      userId,
      tripId,
      data
    );
    var req = await actions.sendAdminApproval(
      userId,
      user?.manager?.userId,
      tripId,
      bookingCost,
      bookingComments,
      bookingStatus,
      data
    );
    if (user?.manager?.userId) {
      var templateData = {
        otherBookings: [data],
      };
      if (bookingStatus !== "Skipped") {
        await actions.sendBookingApprovalEmail({
          id: userId,
          userName: user.firstName + user.lastName,
          userEmail: user.email,
          managerEmail: manager.email,
          managerName: manager.firstName,
          tripName: tripData.data.name,
          templateData: templateData,
        });
      }
    }
    await actions.editOtherAdminTrip(
      tripId,
      travellerDetails,
      otherBookingObject,
      user,
      userId,
      templateData
    );
    setOtherBookingLoader(false);
    setOtherBookingPopup(false);
    setBookingType("");
    setBookingDate("");
    setBookingAdults("");
    setBookingDetails("");
    setBookingComments("");
    setBookingCost("");
    setBookingService("");
    await getData();
  };
  const calculateTax = (fee) => {
    return fee * 0.18;
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await actions.getInvoiceDetails(userId, tripId);
      console.log(data);
      if (data.length > 0) {
        setInvoiceData(data);
      }
    };
    fetch();
  }, []);
  // var handleManagerClick = async (status) => {
  //   let book = [
  //     {
  //       flights: flightArray,
  //       hotels: hotelArray,
  //       cabs: cabArray,
  //       bus: busArray,
  //       comment: managerComment,
  //       bookingPrice: tripbookingPrice,
  //       bookingStatus: "pending",
  //       submissionStatus: "Not Submitted",
  //       adminComment: "",
  //     },
  //   ];

  //   var req = await actions.sendApproval(
  //     userId,
  //     userAccountDetails?.manager?.userId,
  //     id,
  //     travellerDetails,
  //     price,
  //     managerComment,
  //     status
  //   );
  //   if (status !== "Skipped") {
  //     await actions.sendBookingApprovalEmail({
  //       id: userid,
  //       userName: userAccountDetails.firstName + userAccountDetails.lastName,
  //       userEmail: userAccountDetails.email,
  //       managerEmail: userAccountDetails.manager.email,
  //       managerName: userAccountDetails.manager.name,
  //       tripName: tripData.data.name,
  //     });
  //   }

  //   await getTripData();
  // };
  // useEffect(() => {
  //   if (mounted) {
  //     getData();
  //   }
  //   return () => {
  //     setMounted(false);
  //   };
  // }, []);
  useEffect(() => {
    const getTripsdata = async () => {
      await actions.getTripDocById(tripId, userId);
    };
    getTripsdata();
    getData();
  }, []);
  // if(tripDataLoading)
  // {
  //   return(
  //     <div className="scale-loader">
  //     <ScaleLoader
  //       // css={override}
  //       sizeUnit={"px"}
  //       size={17}
  //       color={"#94D2BD"}
  //       loading={tripDataLoading}
  //     />
  //     &nbsp;Loading Trip Data
  //   </div>
  //   )
  // }
  const adminHotelTrav = tripData?.data?.travellerDetails?.[newhotelId]?.adults;
  console.log(newhotelId, "adminHotelTrav");
  return (
    <>
      <Popup
        condition={openHotelPrice}
        close={() => {
          setOpenHotelPrice(false);
          setHotelFinalPrice(0);
          setHotelTotalPrice(0);
          setSelectedRoom([]);
        }}
      >
        <HotelPriceCard
          selectedRoom={selectedRoom}
          hotelFinalPrice={hotelFinalPrice}
          hotelTotalPrice={hotelTotalPrice}
          hotelData={hotelData}
        />
      </Popup>
      <Popup condition={openTravellers} close={() => setOpenTravellers(false)}>
        <div className="traveller-details-container">
          <div className="traveller-details-header">Traveller Details</div>
          {tripData?.data?.travellerDetails ? (
            <>
              {adminHotelTrav &&
                adminHotelTrav?.map((trav, i) => {
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
              onClick={() => {
                setOpenDelete(false);
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </Popup>
      <Popup
        condition={otherBookingPopup}
        close={() => setOtherBookingPopup(false)}
      >
        <div className="p-6 bg-white rounded-lg shadow-lg w-[90%] max-w-[600px] !overflow-scroll h-[70vh]">
          {otherBookingError && (
            <p className="text-red-500 text-center font-medium mb-2">
              {otherBookingError}
            </p>
          )}
          {/* Input Fields */}
          <div className="grid gap-4">
            <div className="flex flex-col gap-3">
              <input
                className="border border-gray-300 rounded-md placeholder:text-gray-500 px-3 py-2 focus:ring focus:ring-[#0a9396] transition"
                placeholder="Booking Type"
                onChange={(e) => setBookingType(e.target.value)}
              />
              <input
                placeholder="Travel Date"
                // type="date"
                className="border border-gray-300 rounded-md placeholder:text-gray-500 px-3 py-2 focus:ring focus:ring-[#0a9396] transition"
                onChange={(e) => setBookingDate(e.target.value)}
              />
              <input
                placeholder="No of Adults"
                type="number"
                className="border border-gray-300 rounded-md placeholder:text-gray-500 px-3 py-2 focus:ring focus:ring-[#0a9396] transition"
                onChange={(e) => setBookingAdults(e.target.value)}
              />
            </div>
            {/* Textarea Fields */}
            <div className="grid gap-3">
              <textarea
                placeholder="Details"
                className="border border-gray-300 rounded-md placeholder:text-gray-500 px-3 py-2 focus:ring focus:ring-[#0a9396] transition resize-none"
                onChange={(e) => setBookingDetails(e.target.value)}
                rows="3"
              ></textarea>
              <textarea
                placeholder="Cancellation Details"
                className="border border-gray-300 rounded-md placeholder:text-gray-500 px-3 py-2 focus:ring focus:ring-[#0a9396] transition resize-none"
                onChange={(e) => setBookingCancellation(e.target.value)}
                rows="3"
              ></textarea>
              <textarea
                placeholder="Approved By"
                className="border border-gray-300 rounded-md placeholder:text-gray-500 px-3 py-2 focus:ring focus:ring-[#0a9396] transition resize-none"
                onChange={(e) => setBookingComments(e.target.value)}
                rows="3"
              ></textarea>
            </div>
            {/* Cost & Service Fee */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Cost"
                className="border border-gray-300 rounded-md placeholder:text-gray-500 px-3 py-2 focus:ring focus:ring-[#0a9396] transition"
                onChange={(e) => setBookingCost(parseInt(e.target.value))}
              />
              <input
                type="number"
                placeholder="Service Fee"
                className="border border-gray-300 rounded-md placeholder:text-gray-500 px-3 py-2 focus:ring focus:ring-[#0a9396] transition"
                onChange={(e) => setBookingService(parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Traveller Details */}
          {travellerDetails.map((detail, index) => (
            <div
              key={index}
              className="border border-gray-200 p-4 rounded-md mt-4 bg-gray-50"
            >
              {/* Title, First Name, Last Name */}
              <div className="grid grid-cols-3 gap-3">
                <select
                  name="title"
                  value={detail.title}
                  onChange={(event) => handleChange(index, event)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-[#0a9396] transition w-full"
                >
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                </select>
                <input
                  type="text"
                  name="firstName"
                  value={detail.firstName}
                  onChange={(event) => handleChange(index, event)}
                  placeholder="First Name"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-[#0a9396] transition w-full"
                />
                <input
                  type="text"
                  name="lastName"
                  value={detail.lastName}
                  onChange={(event) => handleChange(index, event)}
                  placeholder="Last Name"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-[#0a9396] transition w-full"
                />
              </div>

              {/* Email & Mobile Number (Only for first traveler) */}
              {index === 0 && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <input
                    type="email"
                    name="email"
                    value={detail.email}
                    onChange={(event) => handleChange(index, event)}
                    placeholder="Email"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-[#0a9396] transition w-full"
                  />
                  <input
                    type="text"
                    name="mobileNumber"
                    value={detail.mobileNumber}
                    onChange={(event) => handleChange(index, event)}
                    placeholder="Mobile Number"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-[#0a9396] transition w-full"
                  />
                </div>
              )}

              {/* Remove Button for Additional Travelers */}
              {index !== 0 && (
                <button
                  onClick={() => removeDetail(index)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm py-1 px-3 mt-3 transition block w-full"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={addNewTravellers}
              className="bg-[#0a9396] hover:bg-[#0d6e73] text-white font-medium rounded-lg py-2 px-4 transition"
            >
              Add New Traveller
            </button>
            <button
              disabled={otherBookingLoader}
              onClick={handleBookingSubmmit}
              className={`${
                otherBookingLoader
                  ? "bg-gray-400"
                  : "bg-black hover:bg-gray-800"
              } text-white font-medium rounded-lg py-2 px-4 transition flex items-center`}
            >
              {otherBookingLoader ? (
                <FaSpinner className="animate-spin mr-2" size={18} />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </Popup>
      <Popup condition={allotherTime} close={() => setAllOtherTime(false)}>
        <div>
          <div>
            <p>
              Added Date :
              {allotherTimeData?.date &&
                format(
                  new Date(allotherTimeData?.date?.seconds * 1000),
                  "MMMM d, h:mm a"
                )}
            </p>
            <p>
              Sent to Approval :{" "}
              {allotherTimeData?.date
                ? format(
                    new Date(allotherTimeData?.date?.seconds * 1000),
                    "MMMM d, h:mm a"
                  )
                : "Not Requested for Approval"}{" "}
            </p>
            <p>
              Approved Date :{" "}
              {allotherTimeData?.managerApprovedTime
                ? format(
                    new Date(
                      allotherTimeData?.managerApprovedTime?.seconds * 1000
                    ),
                    "MMMM d, h:mm a"
                  )
                : "Not Approved"}
            </p>
            <p>
              Submitted Date :{" "}
              {allotherTimeData?.date
                ? format(
                    new Date(allotherTimeData?.date?.seconds * 1000),
                    "MMMM d, h:mm a"
                  )
                : "Not Submitted"}
            </p>
            <p>
              Booked Date :{" "}
              {allotherTimeData?.booked_date
                ? format(
                    new Date(allotherTimeData?.booked_date?.seconds * 1000),
                    "MMMM d, h:mm a"
                  )
                : "Not Booked"}
            </p>
          </div>
        </div>
      </Popup>
      <Popup condition={alltimeStamp} close={() => setAllTimeStamp(false)}>
        <div>
          <div>
            <p>
              Added Date :
              {timeStampDate?.date &&
                format(
                  new Date(timeStampDate?.date?.seconds * 1000),
                  "MMMM d, h:mm a"
                )}
            </p>
            <p>
              Sent to Approval :{" "}
              {timeStampDate?.manager_request_time
                ? format(
                    new Date(
                      timeStampDate?.manager_request_time?.seconds * 1000
                    ),
                    "MMMM d, h:mm a"
                  )
                : "Not Requested for Approval"}{" "}
            </p>
            <p>
              Approved Date :{" "}
              {timeStampDate?.managerApprovedTime
                ? format(
                    new Date(
                      timeStampDate?.managerApprovedTime?.seconds * 1000
                    ),
                    "MMMM d, h:mm a"
                  )
                : "Not Approved"}
            </p>
            <p>
              Submitted Date :{" "}
              {timeStampDate?.submitted_date
                ? format(
                    new Date(timeStampDate?.submitted_date?.seconds * 1000),
                    "MMMM d, h:mm a"
                  )
                : "Not Submitted"}
            </p>
            <p>
              Booked Date :{" "}
              {timeStampDate?.booked_date
                ? format(
                    new Date(timeStampDate?.booked_date?.seconds * 1000),
                    "MMMM d, h:mm a"
                  )
                : "Not Booked"}
            </p>
          </div>
        </div>
      </Popup>
      <Popup
        condition={otherPriceInfo}
        close={() => {
          setOtherPriceInfo(false);
        }}
      >
        <div className="tripsPage-fare-desktop">
          <div
            className="tripsPage-fare-section-desktop"
            id="tripsPage-fare-section"
          >
            <div className="tripsPage-fare-fareItem tripsPage-fare-fareItem-flightFare">
              {true ? (
                <>
                  <div className="tripsPage-fare-fareItem-title">
                    <span>Price</span>
                  </div>
                  <div className="tripsPage-fare-fareItem-value">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="tripsPage-fare-fareItem-value-icon"
                    />
                    {` ${otherPrice?.price}`}
                  </div>
                </>
              ) : null}
            </div>
            <div className="tripsPage-fare-fareItem">
              <div className="tripsPage-fare-fareItem-title">
                Service Charges
              </div>
              <div className="tripsPage-fare-fareItem-value">
                {"+ "}
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="tripsPage-fare-fareItem-value-icon"
                />
                {otherPrice?.service}
              </div>
            </div>
            <div className="tripsPage-fare-fareItem !text-[13px]">
              <div className="tripsPage-fare-fareItem-title !text-[13px]">
                GST
              </div>
              <div className="tripsPage-fare-fareItem-value !text-[13px]">
                {"+ "}
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="tripsPage-fare-fareItem-value-icon"
                />
                {otherPrice?.gst}
              </div>
            </div>
          </div>
          <div className="tripsPage-fare-totalFare">
            <div className="tripsPage-fare-totalFare-title">Total fare</div>
            <div className="tripsPage-fare-totalFare-value">
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="tripsPage-fare-totalFare-value-icon"
              />
              {` ${Math.ceil(otherPrice?.total).toLocaleString("en-IN")}`}
            </div>
          </div>
        </div>
      </Popup>
      <div className="flex">
        <SideNav />
        {tripDataLoading ? (
          <div className="scale-loader">
            <ScaleLoader
              // css={override}
              sizeUnit={"px"}
              size={17}
              color={"#94D2BD"}
              loading={tripDataLoading}
            />
            &nbsp;Loading Trip Data
          </div>
        ) : (
          <>
            <div className="admin-header-back">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="admin-header-back-icon"
                onClick={async () => {
                  navigate(`/users/${userId}`);
                }}
              />
            </div>
            <div className="admin-trips-container">
              <div className="admin-trips-header">
                <div className="header-details">
                  <div className="trip-name">{tripData?.data?.name}</div>
                  <span>
                    created on :
                    <span>
                      {new Date(tripData?.data?.date?.seconds * 1000)
                        .toString()
                        .slice(4, 15)}
                    </span>
                  </span>
                </div>
                <div className="header-price">
                  <div className="header-price-section">
                    <div className="header-price-title">Total price:</div>
                    <div className="header-price-main">
                      &nbsp;
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="header-price-main-icon"
                      />
                      {`${Math.ceil(totalPrice)?.toLocaleString("en-IN")}`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="tripsDetails-main-block">
                {tripData ? (
                  <div className="tripDetails-box">
                    {/* <div>
                      {tripData?.hotels ? (
                        <>
                          <div className="flex items-center gap-1">
                            <div className="tripDetails-hotel-header">
                              Hotels
                            </div>
                            <button
                              onClick={() =>
                                navigate(
                                  `/adminSearchHotel/${userId}/trips/${tripId}`
                                )
                              }
                              className="bg-[#94d2bd2a] rounded-[8px] text-[16px] font-bold p-[4px] border-[0.1px] border-[#000000] border-solid text-[#001219]"
                            >
                              Add Hotel
                            </button>
                          </div>
                          {tripData?.hotels
                            ?.sort((a, b) => {
                              console.log(tripData);
                              var atime =
                                a?.data?.hotelSearchQuery?.checkInDate;
                              var btime =
                                b?.data?.hotelSearchQuery?.checkInDate;
                              return atime - btime;
                            })
                            ?.map((hotel) => {
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

                              var hotelData = tripData?.data?.hotels.filter(
                                (hotels) => hotels.id === hotel.id
                              );

                              var hotelTimeStamp = new Date(
                                hotelData?.[0]?.date?.seconds * 1000
                              );
                              var hotelPrice = 0;
                              var hotelStatus = tripData?.data?.hotels?.filter(
                                (f) => f.id === hotel.id
                              );
                              var color = statuses.filter((status) => {
                                return (
                                  status?.status === hotelStatus[0]?.status
                                );
                              });
                              const startdate = new Date(
                                hotel?.data?.hotelSearchQuery?.checkInDate
                                  .seconds * 1000
                              );
                              const formattedDate1 = `${
                                monthNames[startdate.getMonth()]
                              } ${startdate.getDate()}`;
                              var endDate = new Date(
                                hotel?.data?.hotelSearchQuery?.checkOutDate
                                  .seconds * 1000
                              )
                                .toString()
                                .slice(4, 15);
                              var img =
                                hotel.data.hotelInfo.HotelInfoResult
                                  .HotelDetails.Images[0];
                              var rating = [];

                              var starRating =
                                hotel.data.hotelInfo.HotelInfoResult
                                  .HotelDetails.StarRating;
                              var starRatingFull = Math.floor(starRating);
                              var adults =
                                hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
                                  (acc, obj) => {
                                    acc.adults += parseInt(obj.adults, 10);
                                    acc.child += parseInt(obj.child, 10);
                                    return acc;
                                  },
                                  { adults: 0, child: 0 }
                                );
                              var hotelReq = tripData.data.hotels.filter(
                                (hotelMain) => {
                                  return hotelMain.id === hotel.id;
                                }
                              );
                              var reqColor = reqStatuses.filter((status) => {
                                return (
                                  status?.status === hotelReq[0]?.requestStatus
                                );
                              });
                              for (var i = 1; i <= Math.ceil(starRating); i++) {
                                if (i > starRatingFull) {
                                  rating.push(
                                    <FontAwesomeIcon
                                      icon={faStarHalf}
                                      className="hotel-card-rating-icon"
                                    />
                                  );
                                } else {
                                  rating.push(
                                    <FontAwesomeIcon
                                      icon={faStar}
                                      className="hotel-card-rating-icon"
                                    />
                                  );
                                }
                              }
                              const isThere = invoiceData.find(
                                (item) => item.cardId === hotel.id
                              );
                              return (
                                <>
                                  <div
                                    className="hotel-card-total"
                                    style={
                                      hotelStatus[0]
                                        ? hotelStatus[0].status === "Booked"
                                          ? { background: "honeydew" }
                                          : null
                                        : null
                                    }
                                  >
                                    <Popup
                                      condition={submitOpen}
                                      close={() => {
                                        setSubmitOpen(false);
                                      }}
                                    >
                                      <HotelTravSubmit
                                        hotelData={hotelStatus?.[0]}
                                      />
                                    </Popup>
                                    <div className="hotel-card">
                                      <div className="hotel-card-img">
                                        <img src={img} alt="hotel" />
                                      </div>
                                      <div className="hotel-card-details">
                                        <div className="hotel-card-header">
                                          <div className="hotel-card-name">
                                            {
                                              hotel.data.hotelInfo
                                                .HotelInfoResult.HotelDetails
                                                .HotelName
                                            }
                                          </div>
                                          <div className="hotelInfo-details-date">
                                            <span>
                                              {formattedDate1}-{endDate}
                                            </span>
                                            &nbsp;(
                                            {
                                              hotel.data.hotelSearchQuery
                                                .hotelNights
                                            }{" "}
                                            Nights)
                                          </div>
                                        </div>
                                        <div className="hotel-card-details-row">
                                          <div className="hotel-card-rating">
                                            {rating.map((star) => {
                                              return star;
                                            })}
                                          </div>
                                        </div>
                                        <div className="hotel-card-people">
                                          Adults-{adults?.adults} Children-
                                          {adults?.child}
                                        </div>
                                      </div>
                                    </div>
                                    {hotel?.data?.selectedRoomType &&
                                      hotel?.data?.selectedRoomType.map(
                                        (room, f) => {
                                          hotelPrice =
                                            hotelPrice +
                                            room.Price.OfferedPriceRoundedOff;
                                          return (
                                            <div className="hotelInfo-roomDtls-room">
                                              <div className="hotelInfo-roomDtls-room-titleSection">
                                                <div className="hotelInfo-roomDtls-room-type">
                                                  {room.RoomTypeName}
                                                </div>
                                                <div className="hotelInfo-roomDtls-room-price">
                                                  <FontAwesomeIcon
                                                    icon={faIndianRupeeSign}
                                                    className="hotelInfo-roomDtls-room-price-icon"
                                                  />
                                                  {`${
                                                    room.Price
                                                      .OfferedPriceRoundedOff
                                                      ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                                                          "en-IN"
                                                        )
                                                      : room.Price.PublishedPriceRoundedOff.toLocaleString(
                                                          "en-IN"
                                                        )
                                                  }`}
                                                </div>
                                              </div>
                                              <div className="hotelInfo-roomDtls-room-otherSection">
                                                <div className="hotelInfo-roomDtls-room-meals">
                                                  <FontAwesomeIcon
                                                    icon={faUtensils}
                                                    className="hotelInfo-roomDtls-room-meals-icon"
                                                  />
                                                  {room.Inclusion &&
                                                  room.Inclusion.length > 0
                                                    ? actions.checkForTboMeals(
                                                        room.Inclusion
                                                      )
                                                    : "No meals"}
                                                </div>
                                                <div className="hotelInfo-roomDtls-room-cancel">
                                                  {room.LastCancellationDate &&
                                                  actions.validCancelDate(
                                                    room.LastCancellationDate
                                                  ) ? (
                                                    <>
                                                      <FontAwesomeIcon
                                                        icon={faCheckCircle}
                                                        className="hotelInfo-roomDtls-room-cancel-icon"
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
                                                        className="hotelInfo-roomDtls-room-cancel-icon"
                                                      />
                                                      {"Non-refundable"}
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                              <div className="hotelInfo-roomDtls-room-inclusions">
                                                {room.Inclusion.length > 0
                                                  ? room.Inclusion.map(
                                                      (inclusion) => {
                                                        return (
                                                          <span>
                                                            {inclusion}
                                                          </span>
                                                        );
                                                      }
                                                    )
                                                  : null}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    <div className="seperate"></div>
                                    <div className="timestamp">
                                      <div>
                                       
                                      </div>
                                      <div
                                        onClick={() => {
                                          setTimeStampData(hotelStatus[0]);
                                          setAllTimeStamp(true);
                                        }}
                                      >
                                        <LuAlarmClock
                                          size={15}
                                          className="cursor-pointer"
                                        />
                                      </div>
                                      <div>
                                        Added Date:&nbsp;
                                        <span>
                                          {hotelTimeStamp.toLocaleString(
                                            "en-IN"
                                          )}
                                        </span>
                                      </div>

                                      <div className="flightResults-list-flightCard-price-trips">
                                        Total Price:{" "}
                                        <FontAwesomeIcon
                                          icon={faIndianRupeeSign}
                                          className="flightResults-list-flightCard-price-icon"
                                        />
                                        {`${Math.ceil(
                                          hotel.data.hotelTotalPrice
                                        ).toLocaleString("en-IN")}`}
                                        &nbsp;
                                        <FontAwesomeIcon
                                          icon={faCircleInfo}
                                          className="info-icon"
                                          onClick={() => {
                                            setOpenHotelPrice((prev) => !prev);
                                            setHotelFinalPrice(
                                              hotel.data.hotelFinalPrice
                                            );
                                            setHotelTotalPrice(
                                              hotel.data.hotelTotalPrice
                                            );
                                            setSelectedRoom(
                                              hotel.data.selectedRoomType
                                            );
                                            setHotelData(hotel);
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="seperate"></div>
                                    <div className="hotel-card-status">
                                      <div className="hotelType">
                                        {hotelStatus[0]?.status ? (
                                          <div className="hotelStatus">
                                            Booking Status:
                                            <span
                                              style={{
                                                background: color[0]
                                                  ? color[0].color
                                                  : "#808080",
                                              }}
                                            >
                                              {hotelStatus[0]?.status}
                                            </span>
                                          </div>
                                        ) : null}
                                      </div>
                                      <div className="request-status">
                                        Approval Status:
                                        <span
                                          style={{
                                            background: reqColor[0]
                                              ? reqColor[0].color
                                              : "#808080",
                                          }}
                                        >
                                          {hotelReq[0]?.requestStatus}
                                        </span>
                                      </div>
                                      {hotelStatus[0]?.downloadURL ? (
                                        <div
                                          className="hotel-card-download"
                                          onClick={() =>
                                            downloadDoc(hotelStatus)
                                          }
                                        >
                                          Voucher&nbsp;
                                          <FontAwesomeIcon icon={faDownload} />
                                        </div>
                                      ) : null}
                                    </div>
                                    <div className="flex gap-5">
                                      <HotelTravSubmit
                                        adults={adults?.adults}
                                        child={adults?.child}
                                        userAccountDetails={user}
                                        userPage={true}
                                        tripData={tripData}
                                        hotelData={hotelData?.[0]}
                                        hotel={hotel}
                                        userId={userId}
                                        tripId={tripId}
                                      />
                                    </div>
                                    <div className=" flex ml-4  items-center pb-2">
                                      {isThere && (
                                        <button onClick={() => {}}>
                                          {loading ? (
                                            "Loading"
                                          ) : (
                                            <PDFDownloadLink
                                              className="font-semibold"
                                              document={
                                                <InvoicePdf1
                                                  type="Hotel"
                                                  hotel={hotel}
                                                  userAccountDetails={user}
                                                  invoiceId={isThere.invoiceId}
                                                  endDate={endDate}
                                                  tripData={tripData}
                                                  hotelData={hotelData}
                                                />
                                              }
                                              fileName={`${tripData.data?.name}_Invoice.pdf`}
                                            >
                                              {({
                                                blob,
                                                url,
                                                loading,
                                                error,
                                              }) =>
                                                loading ? (
                                                  <div className="flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt] font-semibold">
                                                    <p>Invoice PDF</p>
                                                    <FontAwesomeIcon
                                                      icon={faDownload}
                                                    />
                                                  </div>
                                                ) : (
                                                  <div className="flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt] font-semibold">
                                                    <p>Invoice PDF</p>
                                                    <FontAwesomeIcon
                                                      icon={faDownload}
                                                    />
                                                  </div>
                                                )
                                              }
                                            </PDFDownloadLink>
                                          )}
                                        </button>
                                      )}
                                      {hotelStatus[0]?.note && (
                                        <p className="ml-[10pt] text-[12pt] font-bold">
                                          Note:
                                          <span className="text-gray-500 text-[10pt]">
                                            {hotelStatus[0]?.note}
                                          </span>
                                        </p>
                                      )}
                                      {hotelStatus[0]?.status ===
                                        "Submitted" && (
                                        <button
                                          className="border-[1px] border-black rounded-md p-[4px] ml-1"
                                          onClick={() => {
                                            setOpenTravellers(true);
                                            setNewHotelid(hotel?.id);
                                          }}
                                        >
                                          Traveller Details
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                        </>
                      ) : null}
                    </div> */}
                    {/* <div className="tripDetails-flight">
                      {tripData?.flights ? (
                        <>
                          <div className="flex gap-[10px] items-center mb-[10pt]">
                            <p className="text-[18pt] font-bold">Flights</p>
                            <button
                              onClick={() =>
                                navigate(
                                  `/adminSearchFlight/${userId}/trips/${tripId}`
                                )
                              }
                              className="bg-[#94d2bd2a] rounded-[8px] text-[16px] font-bold p-[4px] border-[0.1px] border-[#000000] border-solid text-[#001219]"
                            >
                              Add Flights
                            </button>
                          </div>

                          {tripData?.flights
                            ?.sort((a, b) => {
                              var aflightArr = [a.data.flight].map(
                                (flight, f) => {
                                  return {
                                    ...actions.modifyFlightObject(flight),
                                  };
                                }
                              );
                              var bflightArr = [b.data.flight].map(
                                (flight, f) => {
                                  return {
                                    ...actions.modifyFlightObject(flight),
                                  };
                                }
                              );
                              return (
                                aflightArr[0]?.segments[0]?.depTimeDate -
                                bflightArr[0]?.segments[0]?.depTimeDate
                              );
                            })
                            .map((flight, f) => {
                              var flightStatus =
                                tripData?.data?.flights?.filter(
                                  (f) => f.id === flight.id
                                );

                              var hotelData = tripData?.data?.flights?.filter(
                                (hotels) => hotels.id === flight.id
                              );
                              var hotelTimeStamp = new Date(
                                hotelData?.[0]?.date?.seconds * 1000
                              );
                              var flightReq = tripData?.data?.flights?.filter(
                                (hotelMain) => {
                                  return hotelMain.id === flight.id;
                                }
                              );

                              var reqColor = reqStatuses.filter((status) => {
                                return (
                                  status?.status ===
                                  flightReq?.[0]?.requestStatus
                                );
                              });
                              const charge =
                                flight?.data?.totalFare === 0
                                  ? 0
                                  : Math.ceil(
                                      (flight?.data?.totalFare *
                                        domesticFlight) /
                                        100
                                    ) > minimumServiceCharge
                                  ? Math.ceil(
                                      (flight?.data?.totalFare *
                                        domesticFlight) /
                                        100
                                    )
                                  : minimumServiceCharge;
                              const gst =
                                flight?.data?.totalFare === 0
                                  ? 0
                                  : Math.ceil(charge * 0.18);
                              var isInternational =
                                (flight.data.flightNew.segments &&
                                  flight.data.flightNew.segments?.[0]
                                    ?.destCountryCode) !== "IN" ||
                                (
                                  flight.data.flightNew.segments &&
                                  flight.data.flightNew.segments?.[0]
                                ).originCountryCode !== "IN";
                              return (
                                <>
                                  <AdminFlightItems
                                    adminTripdata={tripData}
                                    userPage={true}
                                    flightGrp={[flight.data.flight]}
                                    index={f}
                                    tripsPage={true}
                                    isInternational={isInternational}
                                    bookingPage={true}
                                    flightBooking={flight.data}
                                    downloadUrl={
                                      flightStatus?.[0]?.downloadURL
                                        ? flightStatus?.[0].downloadURL
                                        : undefined
                                    }
                                    flightStatus={flightStatus?.[0]}
                                    timeStamp={hotelTimeStamp}
                                    flightId={flight.id}
                                    tripId={tripId}
                                    flightReq={flightReq}
                                    flight={flight}
                                    flightData={flight}
                                    reqColor={reqColor}
                                    charge={charge}
                                    gst={gst}
                                    user={user}
                                    userId={userId}
                                    totalFlight={hotelData}
                                    adminBooking={tripData}
                                  />
                                </>
                              );
                            })}
                        </>
                      ) : null}
                    </div> */}
                    {/* <div className="tripDetails-flight">
                      <div className="flex items-center gap-1">
                        <div className="tripDetails-hotel-header">Bus</div>
                        <button
                          onClick={() =>
                            navigate(
                              `/adminSearchbus/${userId}/trips/${tripId}`
                            )
                          }
                          className="bg-[#94d2bd2a] rounded-[8px] text-[16px] font-bold p-[4px] border-[0.1px] border-[#000000] border-solid text-[#001219]"
                        >
                          Add Bus
                        </button>
                      </div>
                      {tripData?.bus?.map((busData) => {
                        console.log(busData);
                        var bus = busData?.data?.bus;
                        var OverallBus = busData?.data;
                        var busDataa = tripData?.data?.bus?.filter(
                          (hotelMain) => {
                            return hotelMain.id === busData.id;
                          }
                        );
                        const selectedSeatsPrice =
                          busData?.data?.selectedSeat?.length > 0
                            ? busData?.data?.selectedSeat?.reduce(
                                (total, seat) =>
                                  total + seat.Price.OfferedPriceRoundedOff,
                                0
                              )
                            : 0;
                        console.log(busDataa);
                        return (
                          <Bus
                            adminTripdata={tripData}
                            bus={bus}
                            tripsPage={false}
                            userPage={true}
                            userId={userId}
                            adminBooking={tripData}
                            adminPage={true}
                            bookingBus={busData.data}
                            busData={busDataa && busDataa[0]}
                            tripId={tripId}
                            selectedSeatsPrice={selectedSeatsPrice}
                            totalBus={busData}
                            user={user}
                            OverallBus={OverallBus}
                            addedFromAdmin={true}
                          />
                        );
                      })}
                    </div> */}
                    {/* <div className="tripDetails-flight">
                      <div className="tripDetails-hotel-header">Cabs</div>
                      {tripData?.cabs?.map((cab, f) => {
                        var cabReq = tripData?.data?.cabs?.filter(
                          (hotelMain) => {
                            return hotelMain.id === cab.id;
                          }
                        );
                        const travellerDetails =
                          tripData?.data?.travellerDetails[cab?.id];
                        return (
                          <>
                            <Cab
                              adminTripdata={tripData}
                              cab={cab.data.cab}
                              tripsPage={false}
                              adminPage={true}
                              startDate={cab.data.cabStartDate}
                              endDate={cab.data.cabEndDate}
                              cabData={cabReq[0]}
                              tripsCabType={cab.data.cabType}
                              cabTotal={cab.data}
                              tripId={tripId}
                              userId={userId}
                              countCab={cab?.data?.cabCount}
                              newCab={cabReq[0]}
                              totalCab={cab}
                              adminBooking={tripData}
                              userPage={true}
                              user={user}
                              travellerDetails={travellerDetails}
                            />
                          </>
                        );
                      })}
                    </div> */}
                    <div className="tripDetails-flight">
                      {tripData?.otherBookings ? (
                        <>
                          <div className="flex gap-[10px] items-center">
                            <p className="text-[18pt] font-bold">
                              Other Bookings
                            </p>
                            <button
                              onClick={() => setOtherBookingPopup(true)}
                              className="bg-[#94d2bd2a] rounded-[8px] text-[16px] font-bold p-[4px] border-[0.1px] border-[#000000] border-solid text-[#001219]"
                            >
                              Add Other Booking
                            </button>
                          </div>
                        </>
                      ) : null}
                      {tripData?.otherBookings &&
                        tripData?.otherBookings?.map((other) => {
                          const otherM = tripData?.data?.otherBookings?.filter(
                            (otherMain) => {
                              return otherMain.id === other.id;
                            }
                          );

                          var color = statuses?.filter((status) => {
                            return status?.status === otherM[0]?.status;
                          });
                          var reqColor = reqStatuses.filter((status) => {
                            return status?.status === otherM[0]?.requestStatus;
                          });
                          const isThere = invoiceData.find(
                            (item) => item.cardId === other.id
                          );
                          return (
                            <div
                              style={{
                                boxShadow:
                                  "0.04rem 0.06rem 0.4rem rgba(0, 0, 0, 0.171)",
                              }}
                              className="w-[90%] rounded-[0.8rem] mt-[10pt] pt-[10pt] pl-[10pt] pb-[3pt]"
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
                                        <FontAwesomeIcon
                                          icon={faIndianRupeeSign}
                                          className="tripsPage-totalPrice-price-icon"
                                        />
                                        {other?.data?.bookingCost}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="border-[1px] border-dotted border-[#001219] mt-1"></div>
                                <div className="flex justify-around items-center">
                                  <div
                                    onClick={() => {
                                      setAllOtherTimeData(otherM[0]);
                                      setAllOtherTime(true);
                                    }}
                                  >
                                    <LuAlarmClock
                                      size={15}
                                      className="cursor-pointer"
                                    />
                                  </div>
                                  <p className="text-[#BB3E03] font-bold">
                                    Total Price:
                                    <FontAwesomeIcon
                                      icon={faIndianRupeeSign}
                                      className="tripsPage-totalPrice-price-icon"
                                    />{" "}
                                    {other?.data?.overallBookingPrice}
                                    <FontAwesomeIcon
                                      icon={faCircleInfo}
                                      onClick={() => {
                                        setOtherPriceInfo(true);
                                        setOtherPrice({
                                          total:
                                            other?.data?.overallBookingPrice,
                                          price: other?.data?.bookingCost,
                                          service: other?.data?.bookingService,
                                          gst: other?.data?.bookingGst,
                                        });
                                      }}
                                      className="info-icon"
                                    />
                                  </p>
                                </div>
                                <div className="border-[1px] border-dotted border-[#001219] mb-1"></div>
                                <div className="flex items-center justify-between">
                                  <p className="text-[10pt]">
                                    Approval Status:
                                    <span
                                      style={{
                                        background: reqColor[0]
                                          ? reqColor[0].color
                                          : "#808080",
                                      }}
                                      className="py-[3pt] px-[5pt] rounded-[0.8rem] text-white text-[8pt]"
                                    >
                                      {otherM[0].requestStatus}
                                    </span>
                                  </p>
                                  <p className="text-[10pt]">
                                    Booking Status:
                                    <span
                                      style={{
                                        background: color[0]
                                          ? color[0]?.color
                                          : "#808080",
                                      }}
                                      className="py-[3pt] px-[5pt] rounded-[0.8rem] text-white text-[8pt]"
                                    >
                                      {otherM[0].status}
                                    </span>
                                  </p>
                                </div>
                                {isThere && (
                                  <button onClick={() => {}}>
                                    <PDFDownloadLink
                                      document={
                                        <InvoicePdf1
                                          type="Other"
                                          other={other}
                                          userAccountDetails={user}
                                          invoiceId={isThere.invoiceId}
                                          tripData={tripData}
                                        />
                                      }
                                      fileName={`${tripData.data?.name}_Invoice.pdf`}
                                    >
                                      {({ blob, url, loading, error }) =>
                                        loading ? (
                                          <div className="font-semibold flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt]">
                                            <p>Invoice PDF</p>
                                            <FontAwesomeIcon
                                              icon={faDownload}
                                            />
                                          </div>
                                        ) : (
                                          <div className="font-semibold flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt]">
                                            <p>Invoice PDF</p>
                                            <FontAwesomeIcon
                                              icon={faDownload}
                                            />
                                          </div>
                                        )
                                      }
                                    </PDFDownloadLink>
                                  </button>
                                )}
                              </div>
                              {otherM?.[0]?.downloadURL ? (
                                <div
                                  className="hotel-card-download !cursor-pointer"
                                  onClick={() => downloadDoc(otherM)}
                                >
                                  Voucher&nbsp;
                                  <FontAwesomeIcon icon={faDownload} />
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* <AdminSearchFlight/> */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserTrips;
