import React, { useContext, useEffect, useState } from "react";
import "./TripDetails.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import MyContext from "../../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PiFilePdfDuotone } from "react-icons/pi";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { FiDownload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import { RiGlobalFill } from "react-icons/ri";
import { format } from "date-fns";
import {
  faArrowLeft,
  faArrowRight,
  faBan,
  faBus,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faCircleInfo,
  faDownload,
  faHotel,
  faIndianRupeeSign,
  faL,
  faPlaneDeparture,
  faPlus,
  faStar,
  faStarHalf,
  faTaxi,
  faTrash,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import LoadingProg from "../../Loading/LoadingProg";
import Popup from "../../Popup";
import Flight from "../../Flights/Flight/Flight";
import Navbar from "../../Flights/FlightSearch/Navbar";
import firebase from "firebase/compat/app";
import { collection, getDocs } from "firebase/firestore";
import HotelCard from "./HotelCard";
import FlightCard from "./FlightCard";
import InputBox from "./InputFeild";
import TravDetails from "./TravellerDetails";
import Cab from "../../Cabs/Cab/Cab";
import ReactDatePicker from "react-datepicker";
import HotelPriceCard from "./HotelPriceCard";
import TripDetailsPdf from "../../pdfString";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import InvoicePdf from "../../InvoicePdf";
import Bus from "../../Bus/Bus/Bus";
import { Button, Menu, MenuItem } from "@mui/material";
import { WindmillSpinner } from "react-spinner-overlay";
import { FaBusAlt } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import HotelTravelInput from "./HotelTravelInput";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { LuAlarmClock } from "react-icons/lu";
import { TbTrashFilled } from "react-icons/tb";
import InvoicePdf1 from "../../InvoicePdf1";

const TripDetails = () => {
  var { state } = useLocation();
  var {
    actions,
    tripData,
    userId,
    tripDataLoading,
    userAccountDetails,
    domesticHotel,
    mergePdfLoading,
    minimumServiceCharge,
    domesticFlight,
    recheckError,
  } = useContext(MyContext);
  const navigate = useNavigate();
  const { control, handleSubmit, setValue, reset } = useForm();
  const [tripId, setTripId] = useState();
  const [travellerCount, setTravellerCount] = useState();
  const [traveller, setTraveller] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [userDetails, setUserDetails] = useState([]);
  const [travellerDetails, setTravellerDetails] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [selectedTab, setSelectedTab] = useState("travellers");
  const [airlinelogos, setAirlinelogos] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [deleteType, setDeleteType] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [requestId, setRequestId] = useState();
  const [requestData, setRequestData] = useState();
  const [requestIds, setRequestIds] = useState([]);
  const [bookingPrice, setBookingPrice] = useState(0);
  const [checked, setChecked] = useState(true);
  const [openHotelPrice, setOpenHotelPrice] = useState(false);
  const [hotelTotalPrice, setHotelTotalPrice] = useState(0);
  const [hotelFinalPrice, setHotelFinalPrice] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [expenseType, setExpenseType] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [cost, setCost] = useState(0);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState();
  const [showError, setShowError] = useState(false);
  const [openPriceReCheck, setOpenPriceReCheck] = useState(false);
  const [reCheckHotelName, setReCheckHotelName] = useState(false);
  const [reCheckLoading, setReCheckLoading] = useState(false);
  const [oldSelectedRoom, setOldSelectedRoom] = useState([]);
  const [newSelectedRoom, setNewSelectedRoom] = useState([]);
  const [reCheck, setReCheck] = useState(false);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [formatDate, setFormatDate] = useState(null);
  const [hotelEndDate, setHotelEndDate] = useState(null);
  const [hotelAdults, setHotelAdults] = useState(null);
  const [flightTravError, setFlightTravError] = useState(false);
  const [hotelTravError, setHotelTravError] = useState(false);
  const [cabTravError, setCabTravError] = useState(false);
  const [approvalLoading, setApporvalLoading] = useState(false);
  const [summaryDropdowm, setSummaryDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [approvalError, setApprovalError] = useState(false);
  const [saveDetailsError, setSaveDetailsError] = useState();
  const [allTravellerCounts, setAllTravellerCounts] = useState();
  const [addTravellers, setAddTravellers] = useState(false);
  const [newtravellerDetails, setNewTravellerDetails] = useState();
  const [isAddedAlltravellers, setIsAddedAlltravellers] = useState(false);
  const [alltimeStamp, setAllTimeStamp] = useState(false);
  const [timeStampDate, setTimeStampData] = useState();
  const [comment, setComment] = useState({});
  const [managerComment, setManagerComment] = useState("");
  const [hotelData, setHotelData] = useState(null);
  const [selectedItems, setSelectedItems] = useState({
    flights: [],
    hotels: [],
    cabs: [],
    buses: [],
  });
  const [bookingIndex, setBookingIndex] = useState([]);
  const [mandatoryError, setMandatoryError] = useState("");
  const [bookingNumber, setBookingNumber] = useState(0);
  const [otherBookingsTravellers, setOtherBookingTravellers] = useState(false);
  const [otherBookingTravDetails, setOtherBookingTravDetails] = useState([]);
  const [isAnySelected, setIsAnySelected] = useState(true);
  const [otherPriceInfo, setOtherPriceInfo] = useState(false);
  const [otherPrice, setOtherPrice] = useState({});
  const [allotherTime, setAllOtherTime] = useState(false);
  const [allotherTimeData, setAllOtherTimeData] = useState();
  const [invoiceData, setInvoiceData] = useState([]);
  const errorMessage =
    userAccountDetails.accountType === "Mandatory"
      ? "Approval is Mandatory"
      : "Please select any above options";
  const handleCheckboxChange = (booking, isChecked, index) => {
    setSelectedItems((prevState) => {
      const newState = { ...prevState };
      ["flights", "hotels", "cabs", "bus"].forEach((type) => {
        booking[type].forEach((item) => {
          if (isChecked) {
            if (!newState[type === "bus" ? "buses" : type].includes(item.id)) {
              newState[type === "bus" ? "buses" : type].push(item.id);
            }
          } else {
            newState[type === "bus" ? "buses" : type] = newState[
              type === "bus" ? "buses" : type
            ].filter((id) => id !== item.id);
          }
        });
      });
      // const anySelected = Object.values(newState).some(
      //   (items) => items.length > 0
      // );
      // setIsAnySelected(anySelected);
      return newState;
    });
    setBookingIndex((prevState) => {
      const newIndices = isChecked
        ? [...prevState, index]
        : prevState.filter((i) => i !== index);
      return newIndices;
    });
  };
  const handleCommentChange = (index, comment) => {
    setComment((prevComments) => ({
      ...prevComments,
      [`Booking${index + 1}`]: comment || "",
    }));
  };
  const bookingMessage =
    bookingIndex
      .map((ele, index) => {
        return `Booking#${ele + 1}${
          index < bookingIndex.length - 1 ? "," : ""
        }`;
      })
      .join(" ") + " Submitted";
  const showToast = () => {
    toast.success(bookingMessage, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };
  const isBookingSelected = (booking) => {
    return ["flights", "hotels", "cabs", "bus"].every((type) =>
      booking[type].every((item) =>
        selectedItems[type === "bus" ? "buses" : type].includes(item.id)
      )
    );
  };

  useEffect(() => {
    if (newtravellerDetails) {
      if (newtravellerDetails.children) {
        newtravellerDetails.children.forEach((child, index) => {
          setValue(`children[${index}].gender`, child.gender);
          setValue(`children[${index}].firstName`, child.firstName);
          setValue(`children[${index}].lastName`, child.lastName);
          // Set other values similarly
        });
      }
      if (newtravellerDetails.adults) {
        newtravellerDetails.adults.forEach((adults, index) => {
          setValue(`adults[${index}].gender`, adults.gender);
          setValue(`adults[${index}].firstName`, adults.firstName);
          setValue(`adults[${index}].lastName`, adults.lastName);
          // Set other values similarly
        });
      }
    }
  }, [newtravellerDetails, setValue]);

  const params = useParams();
  const { id } = params;
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
    { status: "Skipped", color: "#808080" },
  ];

  var price = 0;
  var userid = state?.userId;
  const getTripData = async () => {
    var user = userid ? userid : userId;
    actions.getTripDocById(id, user);
  };
  const validateUser = () => {
    const errors = userDetails.map((field) => ({
      firstName: !field.firstName ? "firstName is required" : "",
      lastName: !field.lastName ? "lastName is required" : "",
    }));
    console.log(errors);
    setSaveDetailsError(errors);
    return errors.every((error) => !error.firstName && !error.lastName);
  };
  var setFinalDetails = async (id1, travCount, type) => {
    // console.log(userDetails);
    // console.log(validateUser());
    // console.log(travCount, type);
    const data = [];
    userDetails.forEach((userDetail, index) => {
      console.log(userDetail);
      const mergedDetails = {
        firstName: "",
        lastName: "",
        gender: userAccountDetails?.gender,
        mobileNumber: userAccountDetails?.mobileNumber,
        email: userAccountDetails?.email,
        passportIssueDate: "",
        passportExpiryDate: "",
        ...userDetail,
      };
      data.push(mergedDetails);
    });
    setTravellerDetails({
      ...travellerDetails,
      [id1]: data,
    });
    await actions.updateTravDetails(
      {
        ...travellerDetails,
        [id1]: data,
      },
      id
    );
  };

  const handleFlights = async () => {
    actions.setSelectedTripId(id);
    await actions.setRes();
    navigate("/home/flights");
  };

  const handleHotels = async () => {
    actions.setSelectedTripId(id);
    await actions.setRes();
    navigate("/home/hotels");
  };

  const handleCabs = async () => {
    actions.setSelectedTripId(id);
    await actions.setRes();
    navigate("/home/cabs");
  };
  const handleBuses = async () => {
    actions.setSelectedTripId(id);
    await actions.setRes();
    navigate("/home/bus");
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

  useEffect(() => {
    if (mounted) {
      if (!tripDataLoading) {
        var fetchData = async () => {
          await getTripData();
          await getData();
        };
        fetchData();
      }
    }
    return () => {
      setMounted(false);
    };
  }, []);
  useEffect(() => {
    const fetch = async () => {
      const data = await actions.getInvoiceDetails(userId, id);
      if (data.length > 0) {
        setInvoiceData(data);
      }
    };
    fetch();
  }, []);

  //console.log(tripData?.flights?.filter((hotel) => tripData?.requestData?.flights.includes(hotel.id)));
  //console.log(tripData?.hotels?.filter((hotel) => tripData?.requestData?.hotels?.includes(hotel.id)));
  var getTime = (seconds) => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);

    const dayOfWeek = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // Convert to 12-hour format
    const adjustedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed

    const timeString = `${adjustedHours}:${adjustedMinutes} ${ampm}`;
    const dateString = `${month} ${dayOfWeek}, ${timeString}`;

    return dateString;
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

  var handleExpenseSubmit = async (e) => {
    e.preventDefault();
    await actions.addExpenseToTrip(
      id,
      expenseType,
      receipt,
      cost,
      expenseDescription,
      expenseDate
    );
    await getTripData();
    setOpenExpense(false);
  };

  var handleExpenseFile = (e) => {
    if (e.target.files[0].size > 1024 * 1024) {
      setReceipt(null);
      alert("The file size should be less than 1 MB");
    } else {
      setReceipt(e.target.files[0]);
    }
  };

  var newdate = getTime(tripData?.data?.date?.seconds);

  var [fareIsOpen, setFareIsOpen] = useState(false);
  var handleClick = async (data) => {
    const templateCabs = tripData?.cabs?.filter((id, i) => {
      return selectedItems.cabs?.some((selectedCab) => selectedCab === id?.id);
    });
    const templateFlights = tripData?.flights?.filter((id, i) => {
      return selectedItems.flights?.some(
        (selectedCab) => selectedCab === id?.id
      );
    });

    const templateHotels = tripData?.hotels?.filter((id, i) => {
      return selectedItems.hotels?.some(
        (selectedCab) => selectedCab === id?.id
      );
    });
    const templateBus = tripData?.bus?.filter((id, i) => {
      return selectedItems.buses?.some((selectedCab) => selectedCab === id?.id);
    });
    const anySelected = Object.values(selectedItems).some(
      (items) => items.length > 0
    );
    setIsAnySelected(anySelected);
    if (!anySelected) {
      return false;
    }
    // console.log(comment);
    // debugger;
    setPaymentLoading(true);
    var notflights = checked
      ? tripData?.flights
          ?.filter((hotel) => flightNotSubmittedIds.includes(hotel.id))
          .map((data) => data.id)
      : [];
    var nothotels = checked
      ? tripData?.hotels
          ?.filter((hotel) => hotelNotSubmittedIds.includes(hotel.id))
          .map((data) => data.id)
      : [];
    var notcabs = checked
      ? tripData?.cabs
          ?.filter((hotel) => cabNotSubmittedIds.includes(hotel.id))
          .map((data) => data.id)
      : [];
    var notbus = checked
      ? tripData?.bus
          ?.filter((hotel) => busNotSubmittedIds.includes(hotel.id))
          .map((data) => data.id)
      : [];
    var submittedFlights = notflights;
    var submittedHotels = nothotels;
    var submittedCabs = notcabs;
    var submittedBus = notbus;
    var finalTravDetails = {
      ...travellerDetails,
      ...tripData.data.travellerDetails,
    };
    if (userAccountDetails.accountType !== "PostPaid") {
      await actions.makeTripPayment(tripData.data?.name, bookingPrice);
    }
    const tripbookingPrice =
      tripData.flights
        .filter((flight) => submittedFlights.includes(flight.id))
        .reduce((sum, obj) => sum + obj?.data?.finalPrice, 0) +
      tripData.hotels
        .filter((flight) => submittedHotels.includes(flight.id))
        .reduce((sum, obj) => sum + obj?.data?.hotelTotalPrice, 0) +
      tripData.cabs
        .filter((flight) => submittedCabs.includes(flight.id))
        .reduce((sum, obj) => sum + obj?.data?.cabTotalPrice, 0) +
      tripData.bus
        .filter((flight) => submittedBus.includes(flight.id))
        .reduce((sum, obj) => sum + obj?.data?.busTotalPrice, 0);
    let book = [
      {
        flights: tripData?.data?.flights?.filter((id, i) =>
          submittedFlights?.includes(id?.id)
        ),
        hotels: tripData?.data?.hotels?.filter((id, i) =>
          submittedHotels?.includes(id?.id)
        ),
        cabs: tripData?.data?.cabs?.filter((id, i) =>
          submittedCabs?.includes(id?.id)
        ),
        bus: tripData?.data?.bus?.filter((id, i) =>
          submittedBus?.includes(id?.id)
        ),
        comment: comment,
        bookingPrice: tripbookingPrice,
        submissionStatus: "Submitted",
        adminComment: "",
      },
    ];
    await actions.updateBookingStatus(id, bookingIndex, comment);
    const selectedFlights =
      userAccountDetails.accountType === "Non Mandatory"
        ? selectedItems.flights
        : submittedFlights;
    const selectedHotels =
      userAccountDetails.accountType === "Non Mandatory"
        ? selectedItems.hotels
        : submittedHotels;
    const selectedCabs =
      userAccountDetails.accountType === "Non Mandatory"
        ? selectedItems.cabs
        : submittedCabs;
    const selectedBus =
      userAccountDetails.accountType === "Non Mandatory"
        ? selectedItems.buses
        : submittedBus;

    const templateData = {
      flights: templateFlights,
      hotels: templateHotels,
      cabs: templateCabs,
      bus: templateBus,
      travellerDetails: tripData.data.travellerDetails,
    };
    await actions.editAdminTrips(
      id,
      tripData,
      finalTravDetails,
      selectedItems.hotels,
      // submittedHotels,
      // submittedFlights,
      selectedItems.flights,
      requestIds,
      selectedItems.cabs,
      // submittedCabs,
      tripData.data?.name,
      selectedItems.buses,
      // submittedBus,
      notbus,
      comment,
      templateData
    );

    setPaymentLoading(false);
    showToast();
    setSelectedItems({
      flights: [],
      hotels: [],
      cabs: [],
      buses: [],
    });
  };
  const handleNonManagerBookings = async () => {
    var flightArray = tripData?.data?.flights.filter(
      (flight) => flight.requestStatus === "Not Requested"
    );
    var hotelArray = tripData?.data?.hotels.filter(
      (hotel) => hotel.requestStatus === "Not Requested"
    );
    var cabArray = tripData?.data?.cabs?.filter(
      (cab) => cab.requestStatus === "Not Requested"
    );
    var busArray =
      tripData?.data?.bus?.filter(
        (bus) => bus.requestStatus === "Not Requested"
      ) ?? [];

    const tripbookingPrice =
      tripData?.flights
        ?.filter((flight) => flightArray.some((id) => id.id === flight.id))
        .reduce((sum, obj) => sum + obj?.data?.finalPrice, 0) +
      tripData?.hotels
        ?.filter((flight) => hotelArray.some((id) => id.id === flight.id))
        .reduce((sum, obj) => sum + obj?.data?.hotelTotalPrice, 0) +
      tripData?.cabs
        ?.filter((flight) => cabArray.some((id) => id.id === flight.id))
        .reduce((sum, obj) => sum + obj?.data?.cabTotalPrice, 0) +
      tripData?.bus
        ?.filter((flight) => busArray.some((id) => id.id === flight.id))
        .reduce((sum, obj) => sum + obj?.data?.busTotalPrice, 0);
    let book = [
      {
        flights: flightArray,
        hotels: hotelArray,
        cabs: cabArray,
        bus: busArray,
        comment: managerComment,
        bookingPrice: tripbookingPrice,
        bookingStatus: "pending",
        submissionStatus: "Not Submitted",
        adminComment: "",
        submissionDate: null,
      },
    ];

    await actions.addBookings(id, book);

    setApporvalLoading(false);
    setTraveller(true);
    await getTripData();
  };
  var handleManagerClick = async (status) => {
    setApporvalLoading(true);
    var flightArray = tripData?.data?.flights.filter(
      (flight) => flight.requestStatus === "Not Requested"
    );
    var hotelArray = tripData?.data?.hotels.filter(
      (hotel) => hotel.requestStatus === "Not Requested"
    );
    var cabArray = tripData?.data?.cabs?.filter(
      (cab) => cab.requestStatus === "Not Requested"
    );
    var busArray =
      tripData?.data?.bus?.filter(
        (bus) => bus.requestStatus === "Not Requested"
      ) ?? [];

    const tripbookingPrice =
      tripData?.flights
        ?.filter((flight) => flightArray.some((id) => id.id === flight.id))
        .reduce(
          (sum, obj) =>
            sum +
            (obj?.data?.totalFare +
              obj?.data?.finalFlightServiceCharge +
              obj?.data?.gstInFinalserviceCharge),
          0
        ) +
      tripData?.hotels
        ?.filter((flight) => hotelArray.some((id) => id.id === flight.id))
        .reduce((sum, obj) => sum + obj?.data?.hotelTotalPrice, 0) +
      tripData?.cabs
        ?.filter((flight) => cabArray.some((id) => id.id === flight.id))
        .reduce((sum, obj) => sum + obj?.data?.cabTotalPrice, 0) +
      tripData?.bus
        ?.filter((flight) => busArray.some((id) => id.id === flight.id))
        .reduce((sum, obj) => sum + obj?.data?.busTotalPrice, 0);
    let book = [
      {
        flights: flightArray,
        hotels: hotelArray,
        cabs: cabArray,
        bus: busArray,
        comment: managerComment,
        bookingPrice: tripbookingPrice,
        bookingStatus: "pending",
        submissionStatus: "Not Submitted",
        adminComment: "",
      },
    ];
    const templateData = {
      flights: tripData?.flights?.filter((flight) =>
        flightArray.some((id) => id.id === flight.id)
      ),
      hotels: tripData?.hotels?.filter((flight) =>
        hotelArray.some((id) => id.id === flight.id)
      ),
      cabs: tripData?.cabs?.filter((flight) =>
        cabArray.some((id) => id.id === flight.id)
      ),
      bus: tripData?.bus?.filter((flight) =>
        busArray.some((id) => id.id === flight.id)
      ),
      travellerDetails: tripData.data.travellerDetails,
    };

    await actions.addBookings(id, book);

    var req = await actions.sendApproval(
      userId,
      userAccountDetails?.manager?.userId,
      id,
      travellerDetails,
      price,
      managerComment,
      status
    );
    if (status !== "Skipped") {
      await actions.sendBookingApprovalEmail({
        id: userid,
        userName: userAccountDetails.firstName + userAccountDetails.lastName,
        userEmail: userAccountDetails.email,
        managerEmail: userAccountDetails.manager.email,
        managerName: userAccountDetails.manager.name,
        tripName: tripData.data.name,
        templateData: templateData,
      });
    }

    setApporvalLoading(false);
    setTraveller(true);
    await getTripData();
    setRequestData(req.reqData);
    setRequestId(req.reqId);
  };
  const NotFilledData = () => {
    const notFlightsData = tripData?.data?.flights
      ?.filter(
        (item) =>
          !(
            tripData?.data?.travellerDetails &&
            item.id in tripData.data.travellerDetails
          )
      )
      ?.map((flight) => flight.id);
    const notHotelsData = tripData?.data?.hotels
      ?.filter(
        (item) =>
          !(
            tripData?.data?.travellerDetails &&
            item.id in tripData.data.travellerDetails
          )
      )
      ?.map((hotel) => hotel.id);
    const notCabsData = tripData?.data?.cabs
      ?.filter(
        (item) =>
          !(
            tripData?.data?.travellerDetails &&
            item.id in tripData?.data?.travellerDetails
          )
      )
      ?.map((cab) => cab.id);
    const notBusData = tripData?.data?.bus
      ?.filter(
        (item) =>
          !(
            tripData?.data?.travellerDetails &&
            item.id in tripData?.data?.travellerDetails
          )
      )
      ?.map((bus) => bus.id);

    const filterdFlights = tripData?.flights?.filter((flight) =>
      notFlightsData?.includes(flight.id)
    );
    const filterdHotels = tripData?.hotels?.filter((hotel) =>
      notHotelsData?.includes(hotel.id)
    );
    const filterdCabs = tripData?.cabs?.filter((cab) =>
      notCabsData?.includes(cab.id)
    );
    const filterdBuses = tripData?.bus?.filter((bus) =>
      notBusData?.includes(bus.id)
    );
    return (
      <ul className="my-4 list-disc list-inside">
        {filterdFlights?.map((flight, i) => {
          const flightName =
            flight?.data?.flightNew?.segments?.[0]?.airlineName;
          const ArrDate =
            flight?.data?.flight?.Segments?.[0]?.[0]?.Origin?.DepTime;
          const depDate =
            flight?.data?.flightRequest?.segments?.[0]?.PreferredDepartureTime;
          console.log(flight);
          return (
            <li>
              <span className="font-bold">{flightName}</span> Flight,{" "}
              {format(ArrDate, "MMMM d, h:mm a")}, {flight?.data?.adults}{" "}
              Adults, {flight?.data?.child} Child, {flight?.data?.infant} Infant
            </li>
          );
        })}
        {filterdHotels?.map((hotel, i) => {
          const hotelName =
            hotel?.data?.hotelInfo?.HotelInfoResult?.HotelDetails?.HotelName;
          const hotelDate = hotel?.data?.hotelSearchQuery?.checkInDate;

          return (
            <li>
              <span className="font-bold">{hotelName}</span> Hotel,{" "}
              {format(new Date(hotelDate.seconds * 1000), "MMMM d, h:mm a")},
              {hotel?.data?.hotelSearchQuery?.hotelRoomArr?.[0]?.adults} Adults,{" "}
              {hotel?.data?.hotelSearchQuery?.hotelRoomArr?.[0]?.child} Child
            </li>
          );
        })}
        {filterdCabs?.map((cab, i) => {
          const cabName = cab?.data?.cabCity;
          const cabDate = cab?.data?.cabStartDate?.seconds * 1000;

          return (
            <li>
              <span className="font-bold">{cabName}</span> Cab,{" "}
              {format(cabDate, "MMMM d")}, {cab?.data?.selectedTime}
            </li>
          );
        })}
        {filterdBuses?.map((bus, i) => {
          const TravelName = bus?.data?.bus?.TravelName;
          const busDate = bus?.data?.bus?.ArrivalTime;
          const passengers = bus?.data?.passengers;
          return (
            <li>
              <span className="font-bold">{TravelName}</span> Bus ,
              {format(busDate, "MMMM d, h:mm a")}, {passengers} Passengers
            </li>
          );
        })}
      </ul>
    );
  };
  var onBtnClick = async () => {
    const busTravellers = tripData?.data?.bus.every(
      (bus) =>
        tripData?.data?.travellerDetails &&
        bus.id in tripData?.data?.travellerDetails
    );
    const cabTravellers = tripData?.data?.cabs.every(
      (cab) =>
        tripData?.data?.travellerDetails &&
        cab.id in tripData?.data?.travellerDetails
    );
    const flightTravellers = tripData?.data?.flights.every(
      (flight) =>
        tripData?.data?.travellerDetails &&
        flight.id in tripData?.data?.travellerDetails
    );
    const hotelTravellers = tripData?.data?.hotels.every(
      (hotel) =>
        tripData?.data?.travellerDetails &&
        hotel.id in tripData?.data?.travellerDetails
    );

    if (busTravellers && cabTravellers && flightTravellers && hotelTravellers) {
      setTraveller(true);
      setTripId(
        tripData?.flights.length > 0
          ? tripData?.flights?.[0]?.id
          : tripData?.hotels.length > 0
          ? tripData.hotels?.[0].id
          : tripData?.cabs.length > 0
          ? tripData?.cabs?.[0].id
          : tripData?.bus.length > 0
          ? tripData?.bus?.[0].id
          : 0
      );
      var adults =
        tripData?.hotels?.[0]?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
          (acc, obj) => {
            acc.adults += parseInt(obj.adults, 10);
            acc.child += parseInt(obj.child, 10);
            return acc;
          },
          { adults: 0, child: 0 }
        );

      setTravellerCount(
        tripData?.flights.length > 0
          ? {
              adults: Number(tripData?.flights?.[0]?.data?.adults),
              child: Number(tripData?.flights?.[0]?.data?.child),
              infant: Number(tripData?.flights?.[0]?.data?.infant),
            }
          : tripData?.hotels.length > 0
          ? adults
          : tripData?.bus?.length > 0
          ? {
              adults: Number(tripData?.bus?.[0]?.data.passengers),
            }
          : {}
      );
      setUserDetails([
        {
          firstName: userAccountDetails?.firstName,
          lastName: userAccountDetails?.lastName,
          gender: userAccountDetails?.gender,
          mobileNumber: userAccountDetails?.mobileNumber,
          email: userAccountDetails?.email,
          passportIssueDate: "",
          passportExpiryDate: "",
        },
      ]);
      var mainprice =
        tripData.flights
          .filter((flight) => flightNotSubmittedIds.includes(flight.id))
          .reduce((sum, obj) => sum + obj?.data?.finalPrice, 0) +
        tripData.hotels
          .filter((flight) => hotelNotSubmittedIds.includes(flight.id))
          .reduce((sum, obj) => sum + obj?.data?.hotelTotalPrice, 0) +
        tripData.cabs
          .filter((flight) => cabNotSubmittedIds.includes(flight.id))
          .reduce((sum, obj) => sum + obj?.data?.cabTotalPrice, 0) +
        tripData.bus
          .filter((flight) => busNotSubmittedIds.includes(flight.id))
          .reduce((sum, obj) => sum + obj?.data?.busTotalPrice, 0);
      var reqIds =
        tripData.requestData.length > 0
          ? tripData?.requestData?.map((req) => req.id)
          : [];
      setBookingPrice(price);
      setRequestIds(reqIds);
      actions.setAdminrequestIds(reqIds);
      setFinalPrice(() => mainprice);
      setRequestId(tripData?.requestData?.[0]?.id);
      setRequestData(tripData?.requestData?.[0]?.data);
    } else {
      setIsAddedAlltravellers(true);
    }
  };

  var downloadDoc = async (hotelStatus) => {
    var downloadName = hotelStatus?.[0]?.downloadURL.slice(
      164,
      hotelStatus?.[0]?.downloadURL.indexOf("?")
    );
    const response = await fetch(hotelStatus?.[0]?.downloadURL);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  var downloadExpense = async (hotelStatus) => {
    var downloadName = "receipt";
    const response = await fetch(hotelStatus);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  var handleDelete = async () => {
    await actions.deleteTripItem(id, deleteId, deleteType);
    setOpenDelete(false);
    setSelectedTab("approval");
    //await getTripData()
  };

  const toggleUp = (e, id) => {
    actions.toggleUp(e, id, fareIsOpen);
    setFareIsOpen((prev) => !prev);
  };
  var flightSubmittedIds = tripData?.data
    ? tripData?.data?.flights
        .filter((flight) => flight.status !== "Not Submitted")
        .map((status) => status.id)
    : [];
  var hotelSubmittedIds = tripData?.data
    ? tripData?.data?.hotels
        .filter((flight) => flight.status !== "Not Submitted")
        .map((status) => status.id)
    : [];
  var cabSubmittedIds = tripData?.data
    ? tripData?.data?.cabs
        ?.filter((flight) => flight.status !== "Not Submitted")
        .map((status) => status.id)
    : [];
  var busSubmittedIds = tripData?.data
    ? tripData?.data?.bus
        ?.filter((flight) => flight.status !== "Not Submitted")
        .map((status) => status.id)
    : [];

  var flightNotSubmittedIds = tripData?.data
    ? tripData?.data?.flights
        .filter((flight) => flight.status === "Not Submitted")
        .map((status) => status.id)
    : [];
  var hotelNotSubmittedIds = tripData?.data
    ? tripData?.data?.hotels
        .filter((flight) => flight.status === "Not Submitted")
        .map((status) => status.id)
    : [];
  var cabNotSubmittedIds = tripData?.data?.cabs
    ? tripData?.data?.cabs
        ?.filter((flight) => flight.status === "Not Submitted")
        ?.map((status) => status.id)
    : [];

  var busNotSubmittedIds = tripData?.data?.bus
    ? tripData?.data?.bus
        ?.filter((flight) => flight.status === "Not Submitted")
        ?.map((status) => status.id)
    : [];

  var flightArray = tripData?.requestData
    ? tripData?.requestData?.map((req) => req.data.flights)
    : [];
  var hotelArray = tripData?.requestData
    ? tripData?.requestData?.map((req) => req.data.hotels)
    : [];
  var cabArray = tripData?.requestData
    ? tripData?.requestData?.map((req) => req.data.cabs)
    : [];
  var busArray = tripData?.requestData
    ? tripData?.requestData?.map((req) => req.data.bus)
    : [];
  var expensePrice = tripData?.expenses
    ? tripData?.expenses?.reduce((sum, arr) => sum + Number(arr.data.cost), 0)
    : 0;

  var flightsIds = flightArray.length > 0 ? [].concat(...flightArray) : [];
  var hotelIds = hotelArray.length > 0 ? [].concat(...hotelArray) : [];
  var cabsIds = cabArray.length > 0 ? [].concat(...cabArray) : [];
  var busIds = busArray.length > 0 ? [].concat(...busArray) : [];
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
  if (tripDataLoading) {
    return (
      <LoadingProg
        condition={tripDataLoading}
        loadingText="Getting Trip Data..."
        progEnd={tripDataLoading}
        progTime={8}
      />
      // <>Loading...</>
    );
  }
  const expenseTypes = ["Meal", "Transport", "Miscellaneous"];

  //cons ole.log(travellerDetails["THow9jP7rUnZgbPZ7fVY"] ? travellerDetails["THow9jP7rUnZgbPZ7fVY"]?.every((item) => item.firstName.length > 0 && item.lastName.length > 0) : userDetails.every((item) => item.firstName.length > 0 && item.lastName.length > 0));

  const open = Boolean(anchorEl);
  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className={
        mergePdfLoading ? "pointer-events-none h-[100vh] overflow-hidden" : ""
      }
    >
      <ToastContainer></ToastContainer>
      {mergePdfLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-100 h-[100%]">
          <WindmillSpinner color="black" />
        </div>
      )}
      {/* <PDFViewer width="100%" height="600">
        <TripDetailsPdf
          tripData={tripData}
          userAccountDetails={userAccountDetails}
          finalPrice={price}
        />
      </PDFViewer> */}

      {/* <iframe src="https://firebasestorage.googleapis.com/v0/b/trav-biz.appspot.com/o/bookings%2FcRlcOVgoo0SKSiPshdFm9UrAymv2%2FIzb8gDh5R3dBCD4C77gi%2Fhotels%2F6YWwlZ2ZoKlq3STEuFO5%2FAIRLINE%20TICKET.pdf?alt=media&token=a0039e14-513a-4ceb-961a-b986d330cefa"></iframe> */}
      <Popup
        condition={otherBookingsTravellers}
        close={() => setOtherBookingTravellers(false)}
      >
        <h1 className="font-bold text-[20px]">Traveller Details</h1>
        {otherBookingTravDetails?.map((e, i) => (
          <>
            <p>
              {e.title} {e.firstName} {e.lastName}
            </p>
            <p>
              {e.email} {e.mobileNumber}
            </p>
          </>
        ))}
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
      <Popup
        condition={traveller}
        close={() => {
          setTraveller(false);
          setSelectedTab("travellers");
          setBookingNumber(0);
        }}
      >
        <div className="booking-popup">
          <div className="flex flex-wrap justify-between my-2">
            <span className="font-bold text-[12px] md:text-[16px]">
              {userAccountDetails?.firstName} ({userAccountDetails?.email})
            </span>
            <span className="font-bold text-[12px] md:text-[16px]">
              {tripData.data?.name}
            </span>
          </div>
          <div className="tripDetails-traveller-tabs !pointer-events-none">
            <div
              className={
                selectedTab === "travellers"
                  ? "tripDetails-traveller-tab tripDetails-traveller-tab-selected"
                  : "tripDetails-traveller-tab"
              }
              onClick={() => setSelectedTab("travellers")}
            >
              Trip Summary
            </div>
            <div
              className={
                selectedTab === "approval"
                  ? "tripDetails-traveller-tab tripDetails-traveller-tab-selected"
                  : "tripDetails-traveller-tab"
              }
              onClick={() => setSelectedTab("approval")}
            >
              Submit for Approval
            </div>
            <div
              className={
                selectedTab === "payment"
                  ? "tripDetails-traveller-tab tripDetails-traveller-tab-selected"
                  : "tripDetails-traveller-tab"
              }
              onClick={() => setSelectedTab("payment")}
            >
              Submit for Booking
            </div>
          </div>
          {selectedTab === "travellers" ? (
            <>
              <div className="approval">
                <div className="approval-tabs">
                  <div className="approval-tab-block">
                    {/* approval details sidebar- */}
                    {/* two times mapping-first one for req data second one for not requested data */}
                    {tripData?.requestData?.length > 0 ? (
                      <>
                        {tripData?.requestData?.map((request, index) => {
                          var reqTime = new Date(
                            request?.data?.createdAt?.seconds * 1000
                          );
                          return (
                            <div
                              className={
                                requestId === request.id
                                  ? "tripDetails-trip-details-flight active"
                                  : "tripDetails-trip-details-flight"
                              }
                              onClick={() => {
                                setRequestData(request.data);
                                setRequestId(request.id);
                                setBookingNumber(index);
                              }}
                            >
                              <div className="tripDetails-trip-city">
                                <div>
                                  <span className="block">
                                    {request.data.flights?.length > 0 ? (
                                      <>
                                        {request.data.flights.length}
                                        &nbsp;Flights,
                                      </>
                                    ) : null}
                                  </span>
                                  <span className="block">
                                    {request.data.hotels?.length > 0 ? (
                                      <>
                                        {request.data.hotels.length}
                                        &nbsp;Hotels,
                                      </>
                                    ) : null}
                                  </span>
                                  <span className="block">
                                    {request.data.cabs?.length > 0 ? (
                                      <>{request.data.cabs.length}&nbsp;Cabs,</>
                                    ) : null}
                                  </span>
                                  <span className="block">
                                    {request.data.bus?.length > 0 ? (
                                      <>{request.data.bus.length}&nbsp;bus,</>
                                    ) : null}
                                  </span>
                                </div>
                                <div>{request.data.status}</div>
                                <div>
                                  Requested at:
                                  {format(reqTime, "MMMM d, h:mm a")}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : null}
                    {tripData?.hotels?.filter(
                      (hotel) => !hotelIds.includes(hotel.id)
                    )?.length > 0 ||
                    tripData?.flights?.filter(
                      (hotel) => !flightsIds.includes(hotel.id)
                    )?.length > 0 ||
                    tripData?.cabs?.filter(
                      (hotel) => !cabsIds.includes(hotel.id)
                    )?.length > 0 ||
                    tripData?.bus?.filter((hotel) => !busIds.includes(hotel.id))
                      ?.length > 0 ? (
                      <div
                        className={
                          !requestData && !requestId
                            ? "tripDetails-trip-details-flight active"
                            : "tripDetails-trip-details-flight"
                        }
                        onClick={() => {
                          setRequestData(null);
                          setRequestId(null);
                        }}
                        style={{ backgroundColor: "#94d2bd" }}
                      >
                        <div className="tripDetails-trip-city">
                          <div>
                            <span className="block">
                              {tripData?.flights?.filter(
                                (hotel) => !flightsIds.includes(hotel.id)
                              )?.length > 0 ? (
                                <>
                                  {
                                    tripData?.flights?.filter(
                                      (hotel) => !flightsIds.includes(hotel.id)
                                    )?.length
                                  }
                                  &nbsp;Flights,
                                </>
                              ) : null}
                            </span>
                            <span className="block">
                              {tripData?.hotels?.filter(
                                (hotel) => !hotelIds.includes(hotel.id)
                              )?.length > 0 ? (
                                <>
                                  {
                                    tripData?.hotels?.filter(
                                      (hotel) => !hotelIds.includes(hotel.id)
                                    )?.length
                                  }
                                  &nbsp;Hotels,
                                </>
                              ) : null}
                            </span>
                            <span className="block">
                              {tripData?.cabs?.filter(
                                (hotel) => !cabsIds.includes(hotel.id)
                              )?.length > 0 ? (
                                <>
                                  {
                                    tripData?.cabs?.filter(
                                      (hotel) => !cabsIds.includes(hotel.id)
                                    )?.length
                                  }
                                  &nbsp;Cabs,
                                </>
                              ) : null}
                            </span>
                            <span className="block">
                              {tripData?.bus?.filter(
                                (hotel) => !busIds.includes(hotel.id)
                              )?.length > 0 ? (
                                <>
                                  {
                                    tripData?.bus?.filter(
                                      (hotel) => !busIds.includes(hotel.id)
                                    )?.length
                                  }
                                  &nbsp;Bus,
                                </>
                              ) : null}
                            </span>
                          </div>
                          <div>
                            <p>Not Requested</p>
                          </div>
                          <p className="font-bold">Click here to Select</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                {/* approval section- main component-same 2 times mapped for 2 things */}
                {tripData?.requestData?.length > 0 &&
                requestData &&
                requestId ? (
                  <div>
                    <div className="tripDetails-approval">
                      <div className="tripDetails-approval-block">
                        <div className="role-trip-card">
                          <h1 className="font-bold text-[17px] mb-2">{`Booking#${
                            bookingNumber + 1
                          }`}</h1>
                          <div className="flex justify-between font-bold">
                            <div className="tripDetails-totalPrice-section-Desktop flex font-bold">
                              <div className="tripDetails-totalPrice-title-Desktop">
                                Total price:
                              </div>
                              <div className="tripDetails-totalPrice-price-Desktop">
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="tripDetails-totalPrice-price-icon"
                                />
                                &nbsp;
                                {Math.ceil(
                                  tripData.flights
                                    .filter((flight) =>
                                      requestData?.flights?.includes(flight.id)
                                    )
                                    .reduce(
                                      (sum, obj) =>
                                        sum +
                                        (obj?.data?.totalFare +
                                          obj?.data?.finalFlightServiceCharge +
                                          obj?.data?.gstInFinalserviceCharge),
                                      0
                                    ) +
                                    tripData.hotels
                                      .filter((flight) =>
                                        requestData?.hotels?.includes(flight.id)
                                      )
                                      .reduce(
                                        (sum, obj) =>
                                          sum + obj?.data?.hotelTotalPrice,
                                        0
                                      ) +
                                    tripData.cabs
                                      .filter((flight) =>
                                        requestData?.cabs?.includes(flight.id)
                                      )
                                      .reduce(
                                        (sum, obj) =>
                                          sum + obj?.data?.cabTotalPrice,
                                        0
                                      ) +
                                    tripData.bus
                                      .filter((flight) =>
                                        requestData?.bus?.includes(flight.id)
                                      )
                                      .reduce(
                                        (sum, obj) =>
                                          sum + obj?.data?.busTotalPrice,
                                        0
                                      )
                                )}
                              </div>
                            </div>

                            <div className="">
                              {/* <div className="flex items-center ">
                                <span>Requested on:</span>
                                {requestData?.createdAt && (
                                  <p>
                                    {new Date(
                                      requestData?.createdAt?.seconds * 1000
                                    ).toLocaleString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "numeric",
                                      second: "numeric",
                                      hour12: true,
                                    })}
                                  </p>
                                )}
                              </div> */}
                              <div>Approval Status : {requestData?.status}</div>
                              <div>
                                Booking Status:{" "}
                                {
                                  tripData?.data?.bookings?.[bookingNumber]
                                    ?.submissionStatus
                                }
                              </div>
                            </div>
                          </div>
                          <div className="role-trip-list">
                            <div className="role-trip-type">
                              {tripData?.hotels?.filter((hotel) =>
                                requestData?.hotels.includes(hotel.id)
                              )?.length > 0 ? (
                                <div className="role-trip-hotel">
                                  Hotels -{" "}
                                  {
                                    tripData?.hotels?.filter((hotel) =>
                                      requestData?.hotels.includes(hotel.id)
                                    )?.length
                                  }
                                </div>
                              ) : null}
                              <br />
                              {tripData?.flights?.filter((hotel) =>
                                requestData?.flights.includes(hotel.id)
                              )?.length > 0 ? (
                                <div className="role-trip-hotel">
                                  Flights -{" "}
                                  {
                                    tripData?.flights?.filter((hotel) =>
                                      requestData?.flights.includes(hotel.id)
                                    )?.length
                                  }
                                </div>
                              ) : null}
                              <br />
                              {tripData?.cabs?.filter((hotel) =>
                                requestData?.cabs.includes(hotel.id)
                              )?.length > 0 ? (
                                <div className="role-trip-hotel">
                                  Cabs -{" "}
                                  {
                                    tripData?.cabs?.filter((hotel) =>
                                      requestData?.cabs.includes(hotel.id)
                                    )?.length
                                  }
                                </div>
                              ) : null}
                              <br />
                              {tripData?.bus?.filter((hotel) =>
                                requestData?.bus.includes(hotel.id)
                              )?.length > 0 ? (
                                <div className="role-trip-hotel">
                                  Bus -{" "}
                                  {
                                    tripData?.bus?.filter((hotel) =>
                                      requestData?.bus.includes(hotel.id)
                                    )?.length
                                  }
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "role-trip-openDtls role-trip-openDtls-open"
                          }
                        ></div>
                        <div className="role-trip-section">
                          <div className="role-review">
                            <div className="role-review-hotels">
                              {tripData?.hotels
                                ?.filter((hotel) =>
                                  requestData?.hotels.includes(hotel.id)
                                )
                                ?.map((hotel, s) => {
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
                                    hotel?.data?.hotelSearchQuery?.checkInDate
                                      .seconds * 1000
                                  );
                                  const formattedDate1 = `${
                                    monthNames[startdate.getMonth()]
                                  } ${startdate.getDate()}`;
                                  var endDate = getDate(
                                    hotel?.data?.hotelSearchQuery?.checkOutDate
                                      .seconds
                                  );
                                  var adults =
                                    hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
                                      (acc, obj) => {
                                        acc.adults += parseInt(obj.adults, 10);
                                        acc.child += parseInt(obj.child, 10);
                                        return acc;
                                      },
                                      { adults: 0, child: 0 }
                                    );
                                  return (
                                    <>
                                      {s === 0 ? (
                                        <div className="role-review-flights-header">
                                          Hotels
                                        </div>
                                      ) : null}
                                      <HotelCard
                                        hotel={hotel}
                                        formattedDate1={formattedDate1}
                                        endDate={endDate}
                                        adults={adults}
                                      />
                                      <div className="role-travellers-hotel">
                                        <div className="role-trip-city font-bold">
                                          Traveller Details
                                        </div>
                                        <div className="role-traveller-container">
                                          {tripData?.data?.travellerDetails[
                                            hotel?.id
                                          ]?.adults &&
                                            tripData?.data?.travellerDetails[
                                              hotel?.id
                                            ]?.adults?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Adult-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                          {tripData?.data?.travellerDetails[
                                            hotel?.id
                                          ]?.children &&
                                            tripData?.data?.travellerDetails[
                                              hotel?.id
                                            ]?.children?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Children-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                            </div>
                            <div className="role-review-flights">
                              {tripData?.flights
                                ?.filter((hotel) =>
                                  requestData?.flights.includes(hotel.id)
                                )
                                ?.map((flight, s) => {
                                  var airlinename =
                                    flight.data.flightNew.segments?.[0]
                                      ?.airlineName;
                                  var airline = airlinelogos?.filter((a) => {
                                    return airlinename.toLowerCase() === a.id;
                                  });
                                  var flightArr = [flight.data.flight].map(
                                    (flight, f) => {
                                      return {
                                        ...actions.modifyFlightObject(flight),
                                      };
                                    }
                                  );
                                  var adults = flight.data.adults;
                                  var child = flight.data.child;
                                  var infant = flight.data.infant;

                                  return (
                                    <>
                                      {s === 0 ? (
                                        <div className="role-review-flights-header">
                                          Flights
                                        </div>
                                      ) : null}
                                      <FlightCard
                                        airlinelogos={airlinelogos}
                                        flightArr={flightArr}
                                        flightData={flight}
                                      />
                                      <div className="role-travellers-flight">
                                        <div className="role-trip-city font-bold">
                                          Traveller Detail
                                        </div>
                                        <div className="role-traveller-container">
                                          {tripData?.data?.travellerDetails[
                                            flight?.id
                                          ]?.adults?.map((e, i) => (
                                            <div>
                                              <h1 className="text-left">
                                                Adult-{i + 1}
                                              </h1>
                                              <div className="flex gap-2  my-2">
                                                <h1>
                                                  <span className="font-bold">
                                                    {" "}
                                                    {e.gender}
                                                  </span>
                                                </h1>
                                                <h1>
                                                  <span className="font-bold">
                                                    {" "}
                                                    {e.firstName}
                                                  </span>
                                                </h1>
                                                <h1>
                                                  <span className="font-bold">
                                                    {" "}
                                                    {e.lastName}
                                                  </span>
                                                </h1>
                                              </div>
                                            </div>
                                          ))}
                                          {tripData?.data?.travellerDetails[
                                            flight?.id
                                          ]?.children &&
                                            tripData?.data?.travellerDetails[
                                              flight?.id
                                            ]?.children?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Children-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span>Title :</span>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                          {tripData?.data?.travellerDetails[
                                            flight?.id
                                          ]?.infants &&
                                            tripData?.data?.travellerDetails[
                                              flight?.id
                                            ]?.infants?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Infants-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                            </div>
                            <div className="role-review-hotels">
                              {tripData?.cabs
                                ?.filter((hotel) =>
                                  requestData?.cabs.includes(hotel.id)
                                )
                                ?.map((hotel, s) => {
                                  var cabReq = tripData?.data?.cabs?.filter(
                                    (hotelMain) => {
                                      return hotelMain.id === hotel.id;
                                    }
                                  );

                                  var cabSDate = hotel.data.cabStartDate
                                    ? new Date(
                                        hotel.data.cabStartDate.seconds * 1000
                                      )
                                        ?.toString()
                                        ?.slice(4, 10)
                                    : "";
                                  var cabEDate = hotel?.data?.cabEndDate
                                    ? new Date(
                                        hotel?.data?.cabEndDate?.seconds * 1000
                                      )
                                        ?.toString()
                                        ?.slice(4, 10)
                                    : "";

                                  return (
                                    <>
                                      {s === 0 ? (
                                        <div className="role-review-flights-header">
                                          Cabs
                                        </div>
                                      ) : null}
                                      {/* <Cab
                                      cab={hotel.data.cab}
                                      tripsPage={false}
                                      startDate={hotel.data.cabStartDate}
                                      endDate={hotel.data.cabEndDate}
                                      cabData={cabReq[0]}
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
                                              {hotel.data.cab.carType}
                                              <span className="font-normal text-[14px]">
                                                ({hotel.data.cab.passenger}
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
                                            <p>
                                              No of Cabs-{hotel.data.cabCount}
                                            </p>
                                            <p>
                                              Pick up:
                                              {hotel?.data?.selectedTime}
                                            </p>
                                            <p className="text-[#BB3E03] font-bold pr-2">
                                              Total Price:{" "}
                                              {Math.ceil(
                                                hotel.data.cabTotalPrice
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="role-travellers-hotel">
                                        <div className="role-trip-city font-bold">
                                          Traveller Details
                                        </div>
                                        <div className="role-traveller-container">
                                          {tripData?.data?.travellerDetails[
                                            hotel?.id
                                          ]?.adults &&
                                            tripData?.data?.travellerDetails[
                                              hotel?.id
                                            ]?.adults?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Adults-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                            </div>
                            <div className="role-review-hotels">
                              {tripData?.bus
                                ?.filter((hotel) =>
                                  requestData?.bus?.includes(hotel.id)
                                )
                                ?.map((hotel, s) => {
                                  var cabReq = tripData?.data?.bus?.filter(
                                    (hotelMain) => {
                                      return hotelMain.id === hotel.id;
                                    }
                                  );
                                  var cabSDate = hotel?.data?.bus?.DepartureTime
                                    ? new Date(hotel?.data?.bus?.DepartureTime)
                                        ?.toString()
                                        ?.slice(4, 10)
                                    : "";
                                  var cabEDate = hotel?.data?.bus?.ArrivalTime
                                    ? new Date(hotel?.data?.bus?.ArrivalTime)
                                        ?.toString()
                                        ?.slice(4, 10)
                                    : "";

                                  return (
                                    <>
                                      {s === 0 ? (
                                        <div className="role-review-flights-header">
                                          Bus
                                        </div>
                                      ) : null}
                                      {/* <Bus
                                      bus={hotel.data.bus}
                                      tripsPage={false}
                                      startDate={cabSDate}
                                      endDate={cabEDate}
                                      cabData={cabReq[0]}
                                      bookingBus={hotel.data}
                                    /> */}
                                      <div className="shadow-md w-[100%] flex gap-[10px] justify-center items-center pl-[10px]">
                                        <FaBusAlt size={40} />
                                        <div className="w-[100%]">
                                          <div className="flex justify-between items-center my-[8px]">
                                            <h1 className="font-bold">
                                              {hotel.data.bus.TravelName}
                                            </h1>
                                            <p className="text-[10pt] flex justify-start items-center bg-[#94d2bd] rounded-l-[0.8rem] px-[6px] py-[4px]">
                                              {cabSDate}-{cabEDate}
                                            </p>
                                          </div>
                                          <div className="flex items-center justify-between my-[8px]">
                                            <p>{hotel.data.bus.BusType}</p>
                                            <div className="flex gap-[10px] items-center">
                                              <p>
                                                {
                                                  hotel.data.destination
                                                    .cityName
                                                }
                                              </p>
                                              <FaArrowRightLong />
                                              <p>
                                                {hotel.data.origin.cityName}
                                              </p>
                                            </div>
                                          </div>
                                          <p className="text-[#BB3E03] font-bold text-right py-1 pr-2">
                                            Total Price:{" "}
                                            <FontAwesomeIcon
                                              icon={faIndianRupeeSign}
                                              className="tripDetails-flight-flightCard-price-icon"
                                            />
                                            {Math.ceil(
                                              hotel.data.busTotalPrice
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="role-travellers-hotel">
                                        <div className="role-trip-city font-bold">
                                          Traveller Details
                                        </div>
                                        <div className="role-traveller-container">
                                          {tripData?.data?.travellerDetails[
                                            hotel?.id
                                          ]?.adults &&
                                            tripData?.data?.travellerDetails[
                                              hotel?.id
                                            ]?.adults?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Adults-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                          <div className="role-close">
                            <FontAwesomeIcon
                              icon={faChevronUp}
                              onClick={(e) => toggleUp(e, "#role-trip-section")}
                              className="close-icon"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tripDetails-submit-main">
                      {/* <button
                        onClick={() => {
                          setSelectedTab("traveller");
                        }}
                      >
                        Previous
                      </button> */}
                      <button
                        onClick={() => {
                          setSelectedTab("approval");
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="tripDetails-approval">
                      {/* <div className="tripDetails-approval-manager">
                        <div className="tripDetails-approval-manager-header">
                          Manager Approval
                        </div>
                        <div className="tripDetails-manager-block">
                          {Object.keys(userAccountDetails?.manager).length >
                          0 ? (
                            <>
                              <div className="tripDetails-manager-name">
                                Manager Name :{" "}
                                <span>
                                  {userAccountDetails?.manager?.name}(
                                  {userAccountDetails?.manager?.email})
                                </span>
                              </div>
                              <div className="tripDetails-manager-request">
                                {requestId ? (
                                  <div className="request-status">
                                    {requestData?.status === "Approved" ? (
                                      <>
                                        <div>Your trip is approved</div>
                                        <div>
                                          Status:
                                          <span
                                            className={
                                              requestData?.status === "Pending"
                                                ? "pending"
                                                : "approve"
                                            }
                                          >
                                            {requestData?.status}
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div>
                                          Your trip is submitted for approval
                                        </div>
                                        <div>
                                          Status:
                                          <span
                                            className={
                                              requestData?.status === "Pending"
                                                ? "pending"
                                                : "approve"
                                            }
                                          >
                                            {requestData?.status}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <>
                                    <div className="request-send-message">
                                      <span>
                                        Send booking for Approval:&nbsp;&nbsp;
                                      </span>
                                      {approvalLoading ? (
                                        <button className="spin">
                                          <div className="spinner"></div>
                                        </button>
                                      ) : (
                                        <button onClick={handleManagerClick}>
                                          Yes
                                        </button>
                                      )}
                                    </div>
                                    <span>OR</span>
                                    <div className="request-message">
                                      {userAccountDetails.approvalType ===
                                      "Mandatory" ? (
                                        <>
                                          <span>
                                            Approval is mandatory.Please send
                                            the trip for approval.
                                          </span>
                                          <br />
                                          <span>
                                            <span className="font-semibold text-red-500">
                                              Note:
                                            </span>
                                            Trip will be booked only after
                                            approval from your manager
                                          </span>
                                        </>
                                      ) : (
                                        <span>
                                          Continue booking without Approval
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="tripDetails-manager-name">
                              No manager assigned
                            </div>
                          )}
                        </div>
                      </div> */}
                      <div className="tripDetails-approval-block">
                        <div className="role-trip-card">
                          <div className="tripDetails-totalPrice-section-Desktop !flex !justify-between">
                            {/* <div className="tripDetails-totalPrice-title-Desktop">
                            Total price:
                          </div> */}
                            <div className="tripDetails-totalPrice-price-Desktop !text-[17px] font-semibold">
                              Total price:
                              <FontAwesomeIcon
                                icon={faIndianRupeeSign}
                                className="tripDetails-totalPrice-price-icon"
                              />
                              &nbsp;
                              {Math.ceil(
                                tripData?.flights
                                  ?.filter(
                                    (flight) => !flightsIds?.includes(flight.id)
                                  )
                                  .reduce(
                                    (sum, obj) =>
                                      sum +
                                      (obj?.data?.totalFare +
                                        obj?.data?.finalFlightServiceCharge +
                                        obj?.data?.gstInFinalserviceCharge),
                                    0
                                  ) +
                                  tripData?.hotels
                                    ?.filter(
                                      (flight) => !hotelIds.includes(flight.id)
                                    )
                                    .reduce(
                                      (sum, obj) =>
                                        sum + obj?.data?.hotelTotalPrice,
                                      0
                                    ) +
                                  tripData?.cabs
                                    ?.filter(
                                      (flight) => !cabsIds?.includes(flight.id)
                                    )
                                    .reduce(
                                      (sum, obj) =>
                                        sum + obj?.data?.cabTotalPrice,
                                      0
                                    ) +
                                  tripData?.bus
                                    ?.filter(
                                      (flight) => !busIds?.includes(flight.id)
                                    )
                                    .reduce(
                                      (sum, obj) =>
                                        sum + obj?.data?.busTotalPrice,
                                      0
                                    )
                              )}
                              {/* {`${Math.ceil(finalPrice).toLocaleString(
                                "en-IN"
                              )} `} */}
                              {/* {`${Math.ceil(requestData?.price).toLocaleString(
                                "en-IN"
                              )} `} */}
                            </div>
                            {/* <div className="role-trip-date !text-[17px] font-semibold">
                                              <span>Created on:</span>
                                              <p>{newdate}</p>
                                            </div> */}
                          </div>
                          <div className="role-trip-list">
                            <div className="role-trip-type">
                              {tripData?.hotels?.filter(
                                (hotel) => !hotelIds.includes(hotel.id)
                              )?.length > 0 ? (
                                <div className="role-trip-hotel">
                                  Hotels -{" "}
                                  {
                                    tripData?.hotels?.filter(
                                      (hotel) => !hotelIds.includes(hotel.id)
                                    )?.length
                                  }
                                </div>
                              ) : null}
                              {tripData?.flights?.filter(
                                (hotel) => !flightsIds.includes(hotel.id)
                              )?.length > 0 ? (
                                <div className="role-trip-hotel">
                                  Flights -{" "}
                                  {
                                    tripData?.flights?.filter(
                                      (hotel) => !flightsIds.includes(hotel.id)
                                    )?.length
                                  }
                                </div>
                              ) : null}
                              {tripData?.cabs?.filter(
                                (hotel) => !cabsIds.includes(hotel.id)
                              )?.length > 0 ? (
                                <div className="role-trip-hotel">
                                  Cabs -{" "}
                                  {
                                    tripData?.cabs?.filter(
                                      (hotel) => !cabsIds.includes(hotel.id)
                                    )?.length
                                  }
                                </div>
                              ) : null}
                              {tripData?.bus?.filter(
                                (hotel) => !busIds.includes(hotel.id)
                              )?.length > 0 ? (
                                <div className="role-trip-hotel">
                                  Bus -{" "}
                                  {
                                    tripData?.bus?.filter(
                                      (hotel) => !busIds.includes(hotel.id)
                                    )?.length
                                  }
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            // fareIsOpen
                            //   ? "role-trip-openDtls role-trip-openDtls-open"
                            //   : "role-trip-openDtls"
                            "role-trip-openDtls role-trip-openDtls-open"
                          }
                          // onClick={(e) => toggleUp(e, "#role-trip-section")}
                        >
                          {/* <FontAwesomeIcon
                            icon={faChevronDown}
                            className="role-trip-openDtls-icon"
                          /> */}
                        </div>
                        <div
                          className="role-trip-section"
                          // id="role-trip-section"
                          // style={{ display: "none", cursor: "default" }}
                        >
                          <div className="role-review">
                            <div className="role-review-hotels">
                              {tripData?.hotels
                                ?.filter(
                                  (hotel) => !hotelIds.includes(hotel.id)
                                )
                                ?.map((hotel, s) => {
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
                                    hotel?.data?.hotelSearchQuery?.checkInDate
                                      .seconds * 1000
                                  );
                                  const formattedDate1 = `${
                                    monthNames[startdate.getMonth()]
                                  } ${startdate.getDate()}`;
                                  var endDate = getDate(
                                    hotel?.data?.hotelSearchQuery?.checkOutDate
                                      .seconds
                                  );
                                  var adults =
                                    hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
                                      (acc, obj) => {
                                        acc.adults += parseInt(obj.adults, 10);
                                        acc.child += parseInt(obj.child, 10);
                                        return acc;
                                      },
                                      { adults: 0, child: 0 }
                                    );

                                  return (
                                    <>
                                      {s === 0 ? (
                                        <div className="role-review-flights-header">
                                          Hotel
                                        </div>
                                      ) : null}
                                      <div>
                                        <HotelCard
                                          hotel={hotel}
                                          formattedDate1={formattedDate1}
                                          endDate={endDate}
                                          adults={adults}
                                        />
                                        {tripData?.data?.travellerDetails && (
                                          <div className="role-travellers-hotel">
                                            <div className="role-trip-city font-bold">
                                              Traveller Details
                                            </div>
                                            {tripData?.data?.travellerDetails &&
                                              tripData?.data?.travellerDetails[
                                                hotel?.id
                                              ]?.adults?.map((e, i) => (
                                                <div>
                                                  <h1 className="text-left">
                                                    Adult-{i + 1}
                                                  </h1>
                                                  <div className="flex gap-2 my-2">
                                                    <h1>
                                                      <span className="font-bold">
                                                        {e.gender}
                                                      </span>
                                                    </h1>
                                                    <h1>
                                                      <span className="font-bold">
                                                        {e.firstName}
                                                      </span>
                                                    </h1>
                                                    <h1>
                                                      <span className="font-bold">
                                                        {e.lastName}
                                                      </span>
                                                    </h1>
                                                  </div>
                                                </div>
                                              ))}
                                            {tripData?.data?.travellerDetails[
                                              hotel?.id
                                            ]?.children?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Children-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  );
                                })}
                            </div>
                            <div className="role-review-flights">
                              {tripData?.flights
                                ?.filter(
                                  (hotel) => !flightsIds.includes(hotel.id)
                                )
                                ?.map((flight, s) => {
                                  var airlinename =
                                    flight.data.flightNew.segments?.[0]
                                      ?.airlineName;
                                  var airline = airlinelogos?.filter((a) => {
                                    return airlinename.toLowerCase() === a.id;
                                  });
                                  var flightArr = [flight.data.flight].map(
                                    (flight, f) => {
                                      return {
                                        ...actions.modifyFlightObject(flight),
                                      };
                                    }
                                  );

                                  var adults = flight.data.adults;
                                  var child = flight.data.child;
                                  var infant = flight.data.infant;
                                  return (
                                    <>
                                      {s === 0 ? (
                                        <div className="role-review-flights-header">
                                          Flights
                                        </div>
                                      ) : null}
                                      <FlightCard
                                        airlinelogos={airlinelogos}
                                        flightArr={flightArr}
                                        flightData={flight}
                                        index={s}
                                      />
                                      {tripData?.data?.travellerDetails && (
                                        <div className="role-travellers-flight">
                                          <div className="role-trip-city font-bold">
                                            Traveller Details
                                          </div>

                                          {tripData?.data?.travellerDetails &&
                                            tripData?.data?.travellerDetails[
                                              flight?.id
                                            ]?.adults?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Adult-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                          {tripData?.data?.travellerDetails &&
                                            tripData?.data?.travellerDetails[
                                              flight?.id
                                            ]?.children?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Children-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {" "}
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                          {tripData?.data?.travellerDetails &&
                                            tripData?.data?.travellerDetails[
                                              flight?.id
                                            ]?.infants?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Infant-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>{e.firstName}</h1>
                                                  <h1>{e.lastName}</h1>
                                                  <h1>{e.gender}</h1>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </>
                                  );
                                })}
                            </div>
                            <div className="role-review-hotels">
                              {tripData?.cabs
                                ?.filter((hotel) => !cabsIds.includes(hotel.id))
                                ?.map((hotel, s) => {
                                  var cabReq = tripData?.data?.cabs?.filter(
                                    (hotelMain) => {
                                      return hotelMain.id === hotel.id;
                                    }
                                  );

                                  var cabSDate = hotel?.data?.cabStartDate
                                    ? new Date(
                                        hotel?.data?.cabStartDate?.seconds *
                                          1000
                                      )
                                        ?.toString()
                                        ?.slice(4, 10)
                                    : "";
                                  var cabEDate = hotel?.data?.cabEndDate
                                    ? new Date(
                                        hotel?.data?.cabEndDate?.seconds * 1000
                                      )
                                        ?.toString()
                                        ?.slice(4, 10)
                                    : "";
                                  return (
                                    <>
                                      {s === 0 ? (
                                        <div className="role-review-flights-header">
                                          Cab
                                        </div>
                                      ) : null}
                                      {/* <Cab
                                      cab={hotel.data.cab}
                                      tripsPage={false}
                                      startDate={cabSDate}
                                      endDate={cabEDate}
                                      cabData={cabReq[0]}
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
                                              {hotel.data.cab.carType}
                                              <span className="font-normal text-[14px]">
                                                ({hotel.data.cab.passenger}
                                                -Seater)
                                              </span>
                                            </p>
                                            <p>{hotel?.data?.cabType}</p>
                                            <p className="text-[10pt] flex justify-start items-center bg-[#94d2bd] rounded-l-[0.8rem] px-[6px] py-[4px]">
                                              {cabSDate}
                                              {cabEDate && "-"}
                                              {cabEDate}
                                            </p>
                                          </div>
                                          <div className="flex justify-between my-2">
                                            <p>
                                              No of Cabs-{hotel.data.cabCount}
                                            </p>
                                            <p>
                                              Pick up:
                                              {hotel?.data?.selectedTime}
                                            </p>
                                            <p className="text-[#BB3E03] font-bold pr-2">
                                              Total Price:{" "}
                                              {Math.ceil(
                                                hotel.data.cabTotalPrice
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      {tripData?.data?.travellerDetails && (
                                        <div className="role-travellers-hotel">
                                          <div className="role-trip-city font-bold">
                                            Traveller Details
                                          </div>
                                          {tripData?.data?.travellerDetails &&
                                            tripData?.data?.travellerDetails[
                                              hotel?.id
                                            ]?.adults?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Adult-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </>
                                  );
                                })}
                            </div>
                            <div className="role-review-hotels">
                              {tripData?.bus
                                ?.filter((hotel) => !busIds.includes(hotel.id))
                                ?.map((hotel, s) => {
                                  var cabReq = tripData?.data?.bus?.filter(
                                    (hotelMain) => {
                                      return hotelMain.id === hotel.id;
                                    }
                                  );
                                  var cabSDate = hotel?.data?.bus?.DepartureTime
                                    ? new Date(hotel?.data?.bus?.DepartureTime)
                                        ?.toString()
                                        ?.slice(4, 10)
                                    : "";
                                  var cabEDate = hotel?.data?.bus?.ArrivalTime
                                    ? new Date(hotel?.data?.bus?.ArrivalTime)
                                        ?.toString()
                                        ?.slice(4, 10)
                                    : "";

                                  return (
                                    <>
                                      {s === 0 ? (
                                        <div className="role-review-flights-header">
                                          Bus
                                        </div>
                                      ) : null}
                                      {/* <Bus
                                      bus={hotel.data.bus}
                                      tripsPage={false}
                                      startDate={cabSDate}
                                      endDate={cabEDate}
                                      cabData={cabReq[0]}
                                      bookingBus={hotel.data}
                                    /> */}
                                      <div className="shadow-md w-[100%] flex gap-[10px] justify-center items-center pl-[10px]">
                                        <FaBusAlt size={40} />
                                        <div className="w-[100%]">
                                          <div className="flex justify-between items-center my-[8px]">
                                            <h1 className="font-bold">
                                              {hotel.data.bus.TravelName}
                                            </h1>
                                            <p className="text-[10pt] flex justify-start items-center bg-[#94d2bd] rounded-l-[0.8rem] px-[6px] py-[4px]">
                                              {cabSDate}-{cabEDate}
                                            </p>
                                          </div>
                                          <div className="flex items-center justify-between my-[8px]">
                                            <p>{hotel.data.bus.BusType}</p>
                                            <div className="flex gap-[10px] items-center">
                                              <p>
                                                {
                                                  hotel.data.destination
                                                    .cityName
                                                }
                                              </p>
                                              <FaArrowRightLong />
                                              <p>
                                                {hotel.data.origin.cityName}
                                              </p>
                                            </div>
                                          </div>
                                          <p className="text-[#BB3E03] font-bold text-right py-1 pr-2">
                                            Total Price:{" "}
                                            {Math.ceil(
                                              hotel.data.busTotalPrice
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      {tripData?.data?.travellerDetails && (
                                        <div className="role-travellers-hotel">
                                          <div className="role-trip-city font-bold">
                                            Traveller Details
                                          </div>
                                          {tripData?.data?.travellerDetails &&
                                            tripData?.data?.travellerDetails[
                                              hotel?.id
                                            ]?.adults?.map((e, i) => (
                                              <div>
                                                <h1 className="text-left">
                                                  Adult-{i + 1}
                                                </h1>
                                                <div className="flex gap-2 my-2">
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.gender}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.firstName}
                                                    </span>
                                                  </h1>
                                                  <h1>
                                                    <span className="font-bold">
                                                      {e.lastName}
                                                    </span>
                                                  </h1>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                          {/* <div className="role-close">
                            <FontAwesomeIcon
                              icon={faChevronUp}
                              onClick={(e) => toggleUp(e, "#role-trip-section")}
                              className="close-icon"
                            />
                          </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="tripDetails-submit-main">
                      {approvalError && (
                        <div className="alerted">
                          {userAccountDetails.approvalType === "Mandatory"
                            ? "Approval is Mandatory"
                            : "Please select any above options"}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setSelectedTab("travellers");
                        }}
                      >
                        Previous
                      </button>
                      <button
                        // onClick={() => {
                        //   if (userAccountDetails.approvalType !== "Mandatory") {
                        //     setSelectedTab("payment");
                        //   } else {
                        //     setApprovalError(true);
                        //   }
                        // }}
                        onClick={() => setSelectedTab("approval")}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
          {selectedTab === "approval" ? (
            <div className="approval">
              <div className="approval-tabs">
                <div className="approval-tab-block">
                  {/* approval details sidebar- */}
                  {/* two times mapping-first one for req data second one for not requested data */}
                  {tripData?.requestData?.length > 0 ? (
                    <>
                      {tripData?.requestData?.map((request) => {
                        var reqTime = new Date(
                          request?.data?.createdAt?.seconds * 1000
                        );
                        return (
                          <div
                            className={
                              requestId === request.id
                                ? "tripDetails-trip-details-flight active"
                                : "tripDetails-trip-details-flight"
                            }
                            onClick={() => {
                              setRequestData(request.data);
                              setRequestId(request.id);
                            }}
                          >
                            <div className="tripDetails-trip-city">
                              <div>
                                <span className="block">
                                  {request.data.flights?.length > 0 ? (
                                    <>
                                      {request.data.flights.length}
                                      &nbsp;Flights,
                                    </>
                                  ) : null}
                                </span>
                                <span className="block">
                                  {request.data.hotels?.length > 0 ? (
                                    <>
                                      {request.data.hotels.length}&nbsp;Hotels,
                                    </>
                                  ) : null}
                                </span>
                                <span className="block">
                                  {request.data.cabs?.length > 0 ? (
                                    <>{request.data.cabs.length}&nbsp;Cabs,</>
                                  ) : null}
                                </span>
                                <span className="block">
                                  {request.data.bus?.length > 0 ? (
                                    <>{request.data.bus.length}&nbsp;bus,</>
                                  ) : null}
                                </span>
                              </div>
                              <div>{request.data.status}</div>
                              <div>
                                Requested at:
                                {format(reqTime, "MMMM d, h:mm a")}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : null}
                  {tripData?.hotels?.filter(
                    (hotel) => !hotelIds.includes(hotel.id)
                  )?.length > 0 ||
                  tripData?.flights?.filter(
                    (hotel) => !flightsIds.includes(hotel.id)
                  )?.length > 0 ||
                  tripData?.cabs?.filter((hotel) => !cabsIds.includes(hotel.id))
                    ?.length ||
                  tripData?.bus?.filter((hotel) => !busIds.includes(hotel.id))
                    ?.length > 0 ? (
                    <div
                      className={
                        !requestData && !requestId
                          ? "tripDetails-trip-details-flight active"
                          : "tripDetails-trip-details-flight"
                      }
                      onClick={() => {
                        setRequestData(null);
                        setRequestId(null);
                      }}
                      style={{ backgroundColor: "#94d2bd" }}
                    >
                      <div className="tripDetails-trip-city">
                        <div>
                          <span className="block">
                            {tripData?.flights?.filter(
                              (hotel) => !flightsIds.includes(hotel.id)
                            )?.length > 0 ? (
                              <>
                                {
                                  tripData?.flights?.filter(
                                    (hotel) => !flightsIds.includes(hotel.id)
                                  )?.length
                                }
                                &nbsp;Flights,
                              </>
                            ) : null}
                          </span>
                          <span className="block">
                            {tripData?.hotels?.filter(
                              (hotel) => !hotelIds.includes(hotel.id)
                            )?.length > 0 ? (
                              <>
                                {
                                  tripData?.hotels?.filter(
                                    (hotel) => !hotelIds.includes(hotel.id)
                                  )?.length
                                }
                                &nbsp;Hotels,
                              </>
                            ) : null}
                          </span>
                          <span className="block">
                            {tripData?.cabs?.filter(
                              (hotel) => !cabsIds.includes(hotel.id)
                            )?.length > 0 ? (
                              <>
                                {
                                  tripData?.cabs?.filter(
                                    (hotel) => !cabsIds.includes(hotel.id)
                                  )?.length
                                }
                                &nbsp;Cabs,
                              </>
                            ) : null}
                          </span>
                          <span className="block">
                            {tripData?.bus?.filter(
                              (hotel) => !busIds.includes(hotel.id)
                            )?.length > 0 ? (
                              <>
                                {
                                  tripData?.bus?.filter(
                                    (hotel) => !busIds.includes(hotel.id)
                                  )?.length
                                }
                                &nbsp;Bus,
                              </>
                            ) : null}
                          </span>
                        </div>
                        <div>Not Requested</div>
                        <p>Click here to select</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              {/* approval section- main component-same 2 times mapped for 2 things */}
              {tripData?.requestData?.length > 0 && requestData && requestId ? (
                <div>
                  {/* {tripData?.hotels?.filter((hotel) =>
                              requestData?.hotels.includes(hotel.id)
                            )?.length > 0 ||
                              
                            tripData?.flights?.filter((hotel) =>
                              requestData?.flights.includes(hotel.id)
                            )?.length > 0 ||
                              
                            tripData?.cabs?.filter((hotel) =>
                              requestData?.cabs.includes(hotel.id)
                            )?.length > 0 ||
                             
                               
                            tripData?.bus?.filter((hotel) =>
                              requestData?.bus.includes(hotel.id)
                            )?.length >0 && */}
                  <div className="tripDetails-approval">
                    <div className="tripDetails-approval-manager !w-[72vw] md:!w-[100%]">
                      <div className="tripDetails-approval-manager-header">
                        Approval request
                      </div>
                      <div className="tripDetails-manager-block">
                        {userAccountDetails?.manager ? (
                          <>
                            <div className="tripDetails-manager-name">
                              Approver Name :{" "}
                              <span>
                                {userAccountDetails?.manager?.name}(
                                {userAccountDetails?.manager?.email})
                              </span>
                            </div>
                            <div className="tripDetails-manager-request">
                              {requestId ? (
                                <div className="request-status">
                                  {requestData?.status === "Approved" ? (
                                    <>
                                      <div>Your trip is approved</div>
                                      <div>
                                        Status:
                                        <span
                                          className={
                                            requestData?.status === "Pending"
                                              ? "pending"
                                              : "approve"
                                          }
                                        >
                                          {requestData?.status}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      {userAccountDetails.approvalType ===
                                        "Mandatory" && (
                                        <div>
                                          Your trip is submitted for approval
                                        </div>
                                      )}
                                      <div>
                                        Status:
                                        <span
                                          className={
                                            requestData?.status === "Pending"
                                              ? "pending"
                                              : "approve"
                                          }
                                        >
                                          {requestData?.status}
                                        </span>
                                      </div>
                                      {requestData.managerComment && (
                                        <div>
                                          Comment :{requestData.managerComment}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <div className="request-send-message">
                                    <span>
                                      Send booking for Approval:&nbsp;&nbsp;
                                    </span>
                                    <input placeholder="Comments" />
                                    {approvalLoading ? (
                                      <button className="spin">
                                        <div className="spinner"></div>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleManagerClick("Pending")
                                        }
                                      >
                                        Yes
                                      </button>
                                    )}
                                  </div>

                                  <div className="request-message">
                                    {userAccountDetails.approvalType ===
                                    "Mandatory" ? (
                                      <>
                                        <span>
                                          Approval is mandatory.Please send the
                                          trip for approval.
                                        </span>
                                        <span>
                                          <span className="font-semibold text-red-500">
                                            Note:
                                          </span>
                                          Trip will be booked only after
                                          approved
                                        </span>
                                      </>
                                    ) : (
                                      <span>
                                        Continue booking without Approval
                                      </span>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="tripDetails-submit-main">
                    <button
                      onClick={() => {
                        setSelectedTab("travellers");
                        setRequestData(tripData?.requestData?.[0]?.data);
                        setRequestId(tripData?.requestData?.[0]?.id);
                        setBookingNumber(0);
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTab("payment");
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="tripDetails-approval">
                    <div className="tripDetails-approval-manager !w-[72vw] md:!w-[100%]">
                      <div className="tripDetails-approval-manager-header">
                        Approval request
                      </div>
                      <div className="tripDetails-manager-block">
                        {Object.keys(userAccountDetails?.manager).length > 0 ? (
                          <>
                            <div className="tripDetails-manager-name">
                              Approver Name :{" "}
                              <span>
                                {userAccountDetails?.manager?.name}(
                                {userAccountDetails?.manager?.email})
                              </span>
                            </div>
                            <div className="tripDetails-manager-request">
                              {requestId ? (
                                <div className="request-status">
                                  {requestData?.status === "Approved" ? (
                                    <>
                                      <div>Your trip is approved</div>
                                      <div>
                                        Status:
                                        <span
                                          className={
                                            requestData?.status === "Pending"
                                              ? "pending"
                                              : "approve"
                                          }
                                        >
                                          {requestData?.status}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div>
                                        Your trip is submitted for approval
                                      </div>
                                      <div>
                                        Status:
                                        <span
                                          className={
                                            requestData?.status === "Pending"
                                              ? "pending"
                                              : "approve"
                                          }
                                        >
                                          {requestData?.status}
                                        </span>
                                      </div>
                                      {requestData.managerComment && (
                                        <div>
                                          Comment :{requestData.managerComment}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <div className="request-send-message">
                                    <span>
                                      Send booking for Approval:&nbsp;&nbsp;
                                    </span>
                                    {approvalLoading ? (
                                      <button className="spin">
                                        <div className="spinner"></div>
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleManagerClick("Pending")
                                          }
                                        >
                                          Yes
                                        </button>
                                        {userAccountDetails.approvalType ===
                                          "Non Mandatory" && (
                                          <button
                                            onClick={() =>
                                              handleManagerClick("Skipped")
                                            }
                                            className="ml-2"
                                          >
                                            Skip
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </div>

                                  <div className="request-message !mt-2">
                                    {userAccountDetails.approvalType ===
                                    "Mandatory" ? (
                                      <>
                                        <span>
                                          Approval is mandatory.Please send the
                                          trip for approval.
                                        </span>
                                        <br />
                                        <span>
                                          <span className="font-semibold text-red-500">
                                            Note:
                                          </span>
                                          Trip will be booked only after
                                          approval.
                                        </span>
                                      </>
                                    ) : (
                                      <span>
                                        Continue booking without Approval
                                      </span>
                                    )}
                                    <div className="w-[95%] mt-2">
                                      <label className="!flex !items-baseline !flex-col">
                                        Comments/special requests/(this will be
                                        viewed by the approver)
                                        <textarea
                                          placeholder="Comments"
                                          className="w-[100%] border-[1px] border-solid border-black pl-[5px] pt-[5px] h-[70px] rounded-md focus:outline-none"
                                          value={managerComment}
                                          onChange={(e) =>
                                            setManagerComment(e.target.value)
                                          }
                                        ></textarea>
                                      </label>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="tripDetails-manager-name">
                              No Approver assigned
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                              <Link to="/roles">
                                <button className="bg-black text-white rounded-lg py-1 px-2 text-[10pt]">
                                  Assign Approver
                                </button>
                              </Link>
                              {approvalLoading ? (
                                <button className="spin">
                                  <div className="spinner"></div>
                                </button>
                              ) : (
                                <button
                                  className="bg-black text-white rounded-lg py-1 px-2 text-[10pt]"
                                  onClick={() => handleManagerClick("Skipped")}
                                >
                                  Skip
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="tripDetails-submit-main">
                    {approvalError && (
                      <div className="alerted">
                        {userAccountDetails.approvalType === "Mandatory"
                          ? "Approval is Mandatory"
                          : "Please select any above options"}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setSelectedTab("travellers");
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        // if (userAccountDetails.approvalType !== "Mandatory") {
                        //   // handleNonManagerBookings();
                        //   setSelectedTab("payment");
                        // } else {
                        //   setApprovalError(true);
                        // }
                        if (requestData?.status !== "Pending") {
                          setApprovalError(true);
                          setMandatoryError(errorMessage);
                        } else {
                          setSelectedTab("payment");
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
          {selectedTab === "payment" ? (
            <>
              <div className="payment-container">
                {tripData?.hotels?.filter(
                  (hotel) => !hotelSubmittedIds.includes(hotel.id)
                )?.length !== 0 ||
                tripData?.flights?.filter(
                  (hotel) => !flightSubmittedIds.includes(hotel.id)
                )?.length !== 0 ||
                tripData?.cabs?.filter(
                  (hotel) => !cabSubmittedIds.includes(hotel.id)
                )?.length !== 0 ||
                tripData?.bus?.filter(
                  (hotel) => !busSubmittedIds.includes(hotel.id)
                )?.length !== 0 ? (
                  <>
                    <div className="payment-block">
                      {userAccountDetails?.accountType === "PrePaid" ? (
                        <div className="payment-block-header">
                          Complete the payment
                        </div>
                      ) : (
                        <div className="payment-block-header">
                          Submit the trip for booking.
                        </div>
                      )}
                      <div className="payment-block-main">
                        <div className="payment-main-header text-center">
                          {userAccountDetails?.accountType === "PrePaid"
                            ? "Select the trips you want to complete the payment"
                            : ""}{" "}
                          <br />
                          {userAccountDetails?.approvalType === "Mandatory" ? (
                            <>
                              <span className="text-red-500 text-center">
                                Note{" "}
                                <span className="text-black">
                                  Trip will be booked only after approval.
                                </span>
                              </span>
                            </>
                          ) : (
                            ""
                          )}
                          {
                            <div>
                              {tripData?.data?.bookings?.map((book, i) => {
                                return (
                                  <div
                                    className={`payment-main-checkbox !block !pt-3 !pb-3 ${
                                      book.submissionStatus === "Booked"
                                        ? "bg-green-100"
                                        : book.submissionStatus === "Submitted"
                                        ? "bg-yellow-100"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex justify-between items-center w-[100%]">
                                      <div className="flex gap-2 items-center">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              book,
                                              e.target.checked,
                                              i
                                            )
                                          }
                                          // checked={
                                          //   book.submissionStatus === "Submitted"
                                          // }
                                          disabled={
                                            book.submissionStatus ===
                                            "Submitted"
                                          }
                                        />
                                        <h1 className="text-[10pt] font-semibold text-center py-1">
                                          Booking {i + 1}
                                        </h1>
                                      </div>
                                      <div className="flex gap-2 text-[10pt]">
                                        {book.flights.length > 0 && (
                                          <p>{book.flights.length} Flights,</p>
                                        )}
                                        {book.hotels.length > 0 && (
                                          <p>{book.hotels.length} Hotels,</p>
                                        )}
                                        {book.cabs.length > 0 && (
                                          <p>{book.cabs.length} Cabs,</p>
                                        )}
                                        {book.bus.length > 0 && (
                                          <p>{book.bus.length} Buses</p>
                                        )}
                                      </div>
                                      <p className="text-[10pt]">
                                        Total price:{" "}
                                        <span className="text-[#bb3e03] font-bold">
                                          <FontAwesomeIcon
                                            icon={faIndianRupeeSign}
                                            className="price"
                                          />
                                          {Math.ceil(book.bookingPrice)}
                                        </span>
                                      </p>
                                    </div>
                                    <div className="w-[100%]">
                                      <label className="!flex !items-baseline !flex-col">
                                        Comments(This will be viewed by the
                                        tripbizz team)
                                        {book.submissionStatus ===
                                        "Submitted" ? (
                                          <p>{book.adminComment}</p>
                                        ) : (
                                          <textarea
                                            className="w-[100%] border-[1px] border-solid border-black pl-[5px] pt-[5px] h-[30px] rounded-md focus:outline-none"
                                            // value={
                                            //   comment[`Booking ${i + 1}`] || ""
                                            // }
                                            onChange={(e) =>
                                              handleCommentChange(
                                                i,
                                                e.target.value
                                              )
                                            }
                                          ></textarea>
                                        )}
                                      </label>
                                    </div>
                                    {/* <p className="text-[10pt]">
                                      Comments: {book.comment}
                                    </p> */}
                                    {/* <div>
                                      {" "}
                                      <div className="flex items-center justify-between my-2">
                                        {" "}
                                        <p className="font-semibold text-[14px]">
                                           Approval Status :
                                          <span>{tripData.data.status}</span>
                                          {" "}
                                        </p>
                                        {" "}
                                        <p className="font-semibold text-[14px]">
                                           Booking Status :
                                          <span>{e.tripStatus}</span>
                                          {" "}
                                        </p>
                                        {" "}
                                      </div>
                                    </div> */}
                                  </div>
                                );
                              })}
                            </div>
                          }
                          {/* {userAccountDetails.accountType !== "Mandatory" && (
                            <>
                              {tripData?.hotels?.filter((hotel) =>
                                hotelNotSubmittedIds.includes(hotel.id)
                              )?.length > 0 ||
                              tripData?.flights?.filter((hotel) =>
                                flightNotSubmittedIds.includes(hotel.id)
                              )?.length > 0 ||
                              tripData?.cabs?.filter((hotel) =>
                                cabNotSubmittedIds.includes(hotel.id)
                              )?.length > 0 ||
                              tripData?.bus?.filter((hotel) =>
                                busNotSubmittedIds.includes(hotel.id)
                              )?.length > 0 ? (
                                <div className="payment-main-checkbox !flex-col">
                                  <label for={`bordered-checkbox-null`}>
                                    <input
                                      id={`bordered-checkbox-null`}
                                      type="checkbox"
                                      value=""
                                      checked={checked}
                                      name="bordered-checkbox"
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setChecked(true);
                                          setBookingPrice(
                                            (prev) => prev + finalPrice
                                          );
                                        } else {
                                          setChecked(false);
                                          setBookingPrice(
                                            (prev) => prev - finalPrice
                                          );
                                        }
                                      }}
                                    />
                                    <span
                                      style={{ background: "#808080" }}
                                      className="status"
                                    >
                                      Not Submitted&nbsp;
                                    </span>
                                    <span>
                                      {tripData?.flights?.filter((hotel) =>
                                        flightNotSubmittedIds.includes(hotel.id)
                                      ).length > 0 ? (
                                        <>
                                          {
                                            tripData?.flights?.filter((hotel) =>
                                              flightNotSubmittedIds.includes(
                                                hotel.id
                                              )
                                            ).length
                                          }
                                          -Flights&nbsp;
                                        </>
                                      ) : null}
                                    </span>
                                    <span>
                                      {tripData?.hotels?.filter((hotel) =>
                                        hotelNotSubmittedIds.includes(hotel.id)
                                      ).length > 0 ? (
                                        <>
                                          {
                                            tripData?.hotels?.filter((hotel) =>
                                              hotelNotSubmittedIds.includes(
                                                hotel.id
                                              )
                                            ).length
                                          }
                                          -Hotels&nbsp;
                                        </>
                                      ) : null}
                                    </span>
                                    <span>
                                      {tripData?.cabs?.filter((hotel) =>
                                        cabNotSubmittedIds.includes(hotel.id)
                                      ).length > 0 ? (
                                        <>
                                          {
                                            tripData?.cabs?.filter((hotel) =>
                                              cabNotSubmittedIds.includes(
                                                hotel.id
                                              )
                                            ).length
                                          }
                                          -Cabs&nbsp;
                                        </>
                                      ) : null}
                                    </span>
                                    <span>
                                      {tripData?.bus?.filter((hotel) =>
                                        busNotSubmittedIds.includes(hotel.id)
                                      ).length > 0 ? (
                                        <>
                                          {
                                            tripData?.bus?.filter((hotel) =>
                                              busNotSubmittedIds.includes(
                                                hotel.id
                                              )
                                            ).length
                                          }
                                          -Bus&nbsp;
                                        </>
                                      ) : null}
                                    </span>
                                    <span className="price-card">
                                      price:&nbsp;
                                      <FontAwesomeIcon
                                        icon={faIndianRupeeSign}
                                        className="price"
                                      />
                                      <span className="price">
                                        {Math.ceil(finalPrice).toLocaleString(
                                          "en-IN"
                                        )}
                                      </span>
                                    </span>
                                  </label>
                                  <div className="w-[100%]">
                                    <label className="!flex !items-baseline !flex-col">
                                      Comments
                                      <textarea
                                        className="w-[100%] border-[1px] border-solid border-black pl-[5px] pt-[5px] h-[70px] rounded-md focus:outline-none"
                                        onChange={(e) =>
                                          setComment(e.target.value)
                                        }
                                      ></textarea>
                                    </label>
                                  </div>
                                </div>
                              ) : null}
                            </>
                          )} */}
                        </div>
                      </div>
                    </div>
                    {/* Showing Balance */}
                    {userAccountDetails?.accountType === "PrePaid" ? (
                      <div className="balance">
                        Account Balance:
                        <span>
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className="balance-icon"
                          />
                          {Math.ceil(userAccountDetails.balance)}
                        </span>
                      </div>
                    ) : null}
                    {/*Select the checkbox which we want to submit for booking*/}

                    <>
                      {bookingPrice > 0 ? (
                        <>
                          {userAccountDetails.accountType === "PostPaid" ? (
                            <div className="wallet-block !flex !flex-row">
                              <button
                                onClick={() => {
                                  setSelectedTab("approval");
                                }}
                              >
                                Previous
                              </button>
                              {paymentLoading ? (
                                <button className="spin">
                                  <div className="spinner"></div>
                                </button>
                              ) : (
                                <button onClick={() => handleClick()}>
                                  {" "}
                                  Submit for Booking
                                </button>
                              )}
                            </div>
                          ) : (
                            <>
                              {/* Required balance is there shows the checkbox if not gives option to redirect to wallet page */}
                              {userAccountDetails.balance < bookingPrice ? (
                                <div className="wallet-block">
                                  <span>
                                    You dont have enough money to complete
                                    payment.Add money to the wallet
                                  </span>
                                  <button onClick={() => navigate("/wallet")}>
                                    {" "}
                                    Add money
                                  </button>
                                </div>
                              ) : (
                                <div className="wallet-block">
                                  {/* <span>Complete the payment</span> */}
                                  <div>
                                    <button
                                      onClick={() => {
                                        setSelectedTab("approval");
                                      }}
                                    >
                                      Previous
                                    </button>
                                    {paymentLoading ? (
                                      <button className="spin">
                                        <div className="spinner"></div>
                                      </button>
                                    ) : (
                                      <>
                                        {(selectedItems.buses ||
                                          selectedItems.cabs ||
                                          selectedItems.flights ||
                                          selectedItems.hotels) && (
                                          <button onClick={() => handleClick()}>
                                            {" "}
                                            Make payment
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <div className="alert">
                          Please select any one of the above to select for
                          booking
                        </div>
                      )}
                    </>
                  </>
                ) : (
                  // Text once the trip is successfully submitted
                  <div className="payment-thankyou">
                    Thank you for the booking. Your booking has been submitted.
                    We will get back to you soon.
                    {userAccountDetails?.accountType === "PrePaid" ? (
                      <div>
                        Wallet Balance:
                        {Math.ceil(userAccountDetails.balance).toLocaleString()}
                      </div>
                    ) : (
                      ""
                    )}
                    <button onClick={() => setTraveller(false)}>Close</button>
                  </div>
                )}
                {!isAnySelected && (
                  <p className="text-red-400 text-center text-[10pt]">
                    Select Any Booking to submit
                  </p>
                )}
                <p className="mt-2 text-center">
                  <span className="font-bold">*Note: </span> Our booking team is
                  available from 10 am to 10 pm on all days of the week. Please
                  submit your trips during these timings.
                </p>
                <p className="mt-2 text-center">
                  <span className="font-bold">**Note: </span>For flight booking
                  requests made within 48 hrs of departure time, the quoted
                  price may change at the time of booking. Our team will contact
                  you to confirm the same.
                </p>
              </div>
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
        {/* Delete the trip item */}
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
      <Popup
        condition={openHotelPrice}
        close={() => {
          setOpenHotelPrice(false);
          setHotelFinalPrice(0);
          setHotelTotalPrice(0);
          setSelectedRoom([]);
        }}
      >
        {/* Hotel price breakdown popup */}
        <HotelPriceCard
          selectedRoom={selectedRoom}
          hotelFinalPrice={hotelFinalPrice}
          hotelTotalPrice={hotelTotalPrice}
          hotelData={hotelData}
        />
      </Popup>
      <Popup
        condition={openExpense}
        close={() => {
          setOpenExpense(false);
        }}
      >
        {/* Adding expense popup */}
        <div className="expense-container">
          <div className="expense-header">Add Expense</div>
          <form className="expense-form" onSubmit={handleExpenseSubmit}>
            <div className="expense-input-feild">
              <label>Expense Type</label>
              <select onChange={(e) => setExpenseType(e.target.value)}>
                <option>Select Expense</option>
                {expenseTypes.map((expense) => {
                  return <option>{expense}</option>;
                })}
              </select>
            </div>
            <div className="expense-input-feild">
              <label>Date:</label>
              <ReactDatePicker
                minDate={new Date()}
                selected={expenseDate}
                startDate={expenseDate}
                selectsStart
                popperPlacement="auto-start"
                showPopperArrow={false}
                onChange={(e) => setExpenseDate(e)}
                showMonthYearDropdown
                dateFormat="EEE, MMM d"
                fixedHeight
                withPortal
                placeholderText="Date"
                className="flightSearch-dates-input"
                id="flightSearch-departureDate"
              />
            </div>
            <div className="expense-input-feild">
              <label>Add Description:</label>
              <textarea
                placeholder="Enter the description of expense"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                rows="4"
              />
            </div>
            <div className="expense-input-feild">
              <label>Add Cost(INR):</label>
              <input
                placeholder="Enter the cost of the expense"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div className="expense-input-feild">
              <label>Add Receipt:</label>
              <input type="file" onChange={(e) => handleExpenseFile(e)} />
            </div>
            <div className="expense-submit">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </Popup>
      <Popup
        condition={openPriceReCheck}
        close={() => setOpenPriceReCheck(false)}
      >
        <div className="flight-recheck">
          {openPriceReCheck ? (
            <HotelCard
              hotel={hotelDetails}
              formattedDate1={formatDate}
              endDate={hotelEndDate}
              adults={hotelAdults}
            />
          ) : null}
          {reCheckLoading ? (
            <>
              <LoadingProg
                condition={reCheckLoading}
                loadingText="Getting Updated Prices..."
                progEnd={reCheckLoading}
                progTime={30}
              />
            </>
          ) : (
            <div className="recheck-popup-container">
              <div className="recheck-popup-header">Hotel Price Recheck</div>
              {newSelectedRoom?.length > 0 ? (
                <div className="recheck-block">
                  <div className="recheck-block-header">
                    Hotel Name:<span>{reCheckHotelName}</span>
                  </div>
                  <div>
                    <span>Room Details</span>
                    {oldSelectedRoom.map((room, f) => {
                      return (
                        <div className="hotelInfo-roomDtls-room">
                          <div className="hotelInfo-roomDtls-room-titleSection">
                            <div className="hotelInfo-roomDtls-room-type">
                              {room.RoomTypeName}
                            </div>
                          </div>
                          <div className="hotelInfo-roomDtls-room-otherSection">
                            <div className="hotelInfo-roomDtls-room-meals">
                              <FontAwesomeIcon
                                icon={faUtensils}
                                className="hotelInfo-roomDtls-room-meals-icon"
                              />
                              {room.Inclusion && room.Inclusion.length > 0
                                ? actions.checkForTboMeals(room.Inclusion)
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
                              ? room.Inclusion.map((inclusion) => {
                                  return <span>{inclusion}</span>;
                                })
                              : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="recheck-block-rates">
                    <div className="prices">
                      <div>
                        Old Rates:
                        <span>
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className=".hotelInfo-roomDtls-room-price-icon"
                          />
                          {oldSelectedRoom
                            .reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPriceRoundedOff),
                              0
                            )
                            .toLocaleString()}
                        </span>
                      </div>
                      <div>
                        Service Charges:
                        <span>
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className=".hotelInfo-roomDtls-room-price-icon"
                          />
                          {Math.ceil(
                            (oldSelectedRoom.reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPriceRoundedOff),
                              0
                            ) *
                              domesticHotel) /
                              100
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        Old Total Price:
                        <span>
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className=".hotelInfo-roomDtls-room-price-icon"
                          />
                          {Math.ceil(
                            oldSelectedRoom.reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPriceRoundedOff),
                              0
                            ) +
                              (oldSelectedRoom.reduce(
                                (sum, arr) =>
                                  sum +
                                  Number(arr.Price.OfferedPriceRoundedOff),
                                0
                              ) *
                                domesticHotel) /
                                100
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="prices">
                      <div>
                        New Rates:
                        <span>
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className=".hotelInfo-roomDtls-room-price-icon"
                          />
                          {Math.ceil(
                            newSelectedRoom.reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPrice),
                              0
                            )
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        Service Charges:
                        <span>
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className=".hotelInfo-roomDtls-room-price-icon"
                          />
                          {Math.ceil(
                            (newSelectedRoom.reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPrice),
                              0
                            ) *
                              domesticHotel) /
                              100
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        New Total Price:
                        <span>
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className=".hotelInfo-roomDtls-room-price-icon"
                          />
                          {Math.ceil(
                            newSelectedRoom.reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPrice),
                              0
                            ) +
                              (newSelectedRoom.reduce(
                                (sum, arr) =>
                                  sum + Number(arr.Price.OfferedPrice),
                                0
                              ) *
                                domesticHotel) /
                                100
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="recheck-confirm">
                    <button
                      onClick={async () => {
                        await actions.updateHotelBookingDetails(
                          newSelectedRoom.reduce(
                            (sum, arr) =>
                              sum + Math.ceil(Number(arr.Price.OfferedPrice)),
                            0
                          ),
                          deleteId,
                          id
                        );
                        setOpenPriceReCheck(false);
                      }}
                    >
                      Keep Hotel
                    </button>
                    <button onClick={handleDelete} className="delete-btn">
                      Delete Hotel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="recheck-na">
                  <h6>
                    The selected hotel is not available please change the hotel
                  </h6>
                  <div className="recheck-na-btn">
                    <button onClick={handleDelete}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Popup>
      <Popup
        condition={reCheck}
        close={() => {
          setReCheck(false);
        }}
      >
        <div className="recheck-submit">
          <div className="recheck-submit-header">Re-check Rates</div>
          <span className="recheck-submit-content">
            Please re-check rates for the below.Since it is more than 3 hours
            since they have been added to 'My Trips'
          </span>
          <div className="recheck-submit-items">
            {tripData?.flights?.filter((flight) => {
              var hotelData = tripData?.data?.flights.filter(
                (hotels) => hotels.id === flight.id
              );
              var hotelTimeStamp = hotelData
                ? new Date(hotelData?.[0]?.date?.seconds * 1000)
                : "";

              var originalDate = new Date(hotelTimeStamp);
              var threeHoursAfter = new Date(
                originalDate.getTime() + 3 * 60 * 60 * 1000
              );
              var currentTime = new Date();
              var isTimeReCheck = currentTime > threeHoursAfter;
              return isTimeReCheck;
            }).length > 0 && (
              <div className="recheck-submit-item-header">Flights</div>
            )}
            {tripData?.flights
              ?.filter((flight) => {
                var hotelData = tripData?.data?.flights.filter(
                  (hotels) => hotels.id === flight.id
                );
                var hotelTimeStamp = hotelData
                  ? new Date(hotelData?.[0]?.date?.seconds * 1000)
                  : "";
                var originalDate = new Date(hotelTimeStamp);
                var threeHoursAfter = new Date(
                  originalDate.getTime() + 3 * 60 * 60 * 1000
                );
                var currentTime = new Date();
                var isTimeReCheck = currentTime > threeHoursAfter;
                return isTimeReCheck;
              })
              .map((flight) => {
                return (
                  <div>
                    {flight.data.flightNew.segments?.[0]?.destCityName} to{" "}
                    {flight.data.flightNew.segments?.[0]?.originCityName}
                  </div>
                );
              })}
            {tripData?.flights?.filter((flight) => {
              var hotelData = tripData?.data?.flights.filter(
                (hotels) => hotels.id === flight.id
              );

              var hotelTimeStamp = hotelData
                ? new Date(hotelData?.[0]?.date?.seconds * 1000)
                : "";
              var originalDate = new Date(hotelTimeStamp);
              var threeHoursAfter = new Date(
                originalDate.getTime() + 3 * 60 * 60 * 1000
              );
              var currentTime = new Date();
              var isTimeReCheck = currentTime > threeHoursAfter;
              return isTimeReCheck;
            }).length > 0 && (
              <div className="recheck-submit-item-header">Hotels</div>
            )}
            {tripData?.hotels
              ?.filter((hotel) => {
                var hotelData = tripData?.data?.hotels.filter(
                  (hotels) => hotels.id === hotel.id
                );
                var hotelTimeStamp = hotelData
                  ? new Date(hotelData?.[0]?.date?.seconds * 1000)
                  : "";
                var originalDate = new Date(hotelTimeStamp);
                var threeHoursAfter = new Date(
                  originalDate.getTime() + 3 * 60 * 60 * 1000
                );
                var currentTime = new Date();
                var isTimeReCheck = currentTime > threeHoursAfter;
                return isTimeReCheck;
              })
              .map((hotel) => {
                return (
                  <div>
                    {
                      hotel.data.hotelInfo.HotelInfoResult.HotelDetails
                        .HotelName
                    }
                  </div>
                );
              })}
          </div>
        </div>
      </Popup>
      <Popup
        condition={isAddedAlltravellers}
        close={() => {
          setIsAddedAlltravellers(false);
        }}
      >
        <div>
          <h1 className="font-bold text-center">
            Please add traveller details for below flights/Hotels/Cabs/Buses
          </h1>
          <div>{NotFilledData()}</div>
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
      <Navbar />
      <div className="tripDetails-header-back">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="tripDetails-header-back-icon"
          onClick={async () => {
            navigate("/trips");
            //await actions.getAllTrips(userId)
            actions.getLastDoc();
          }}
        />
      </div>
      {/* Trip details header */}
      <div className="tripDetails-header">
        <div className="tripDetails-header-name flex items-center">
          <div className="flex flex-col">
            <span className="!text-[17px] md:!text-[22px] !font-bold">
              {tripData.data?.name}
            </span>
            <span>
              created on: <span>{newdate}</span>
            </span>
          </div>
          <div>
            <button
              className="text-white bg-black hover:bg-black-200 font-medium rounded-lg text-[12px] md:text-[15px] px-4 py-2.5 text-center items-center flex gap-2"
              type="button"
              onClick={handleDropdownClick}
            >
              Downloads
              {!anchorEl ? <BsCaretDownFill /> : <BsCaretUpFill />}
            </button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{
                maxWidth: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <MenuItem sx={{ justifyContent: "space-evenly" }}>
                {" "}
                <PDFDownloadLink
                  document={
                    <TripDetailsPdf
                      tripData={tripData}
                      userAccountDetails={userAccountDetails}
                      finalPrice={price}
                    />
                  }
                  fileName={`${tripData.data?.name}`}
                  // className="bg-black text-white p-[10px] font-bold rounded-[0.8rem] flex items-center justify-center text-[10pt]"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? (
                      <p className="flex items-center justify-evenly gap-1">
                        Trip Summary{<FiDownload />}
                      </p>
                    ) : (
                      <p className="flex items-center justify-evenly gap-1">
                        Trip Summary{<FiDownload />}
                      </p>
                    )
                  }
                </PDFDownloadLink>
              </MenuItem>
              {/* <MenuItem sx={{ justifyContent: "space-evenly" }}>
                <PDFDownloadLink
                  // className="bg-black text-white p-[10px] font-bold rounded-[0.8rem] flex items-center justify-center text-[10pt]"
                  document={
                    <InvoicePdf
                      tripData={tripData}
                      userAccountDetails={userAccountDetails}
                    />
                  }
                  fileName={`${tripData.data?.name}_Invoice.pdf`}
                >
                  {({ blob, url, loading, error }) =>
                    loading ? (
                      <p className="flex items-center justify-evenly gap-1">
                        Invoice{<FiDownload />}
                      </p>
                    ) : (
                      <p className="flex items-center justify-evenly gap-1">
                        Invoice{<FiDownload />}
                      </p>
                    )
                  }
                </PDFDownloadLink>
              </MenuItem>
              <MenuItem sx={{ justifyContent: "space-evenly" }}>
                <button
                  // className="bg-black text-white w-[100%] p-[10px] font-bold rounded-[0.8rem] flex items-center justify-center text-[10pt]"
                  className="flex items-center justify-evenly gap-1"
                  onClick={async () => {
                    console.log("clicked");
                    setAnchorEl(false);
                    await actions.downloadVouchers(tripData);
                  }}
                >
                  Vouchers
                  <FiDownload />
                </button>
              </MenuItem> */}
            </Menu>
          </div>
        </div>

        <div className="tripDetails-header-status">
          {/* Showing status of each trip item */}
          {statuses.map((status) => {
            return (
              <>
                {tripData?.data?.flights?.filter(
                  (flight) => flight.status === status.status
                ).length > 0 ||
                tripData?.data?.hotels?.filter(
                  (flight) => flight.status === status.status
                ).length > 0 ||
                tripData?.data?.cabs?.filter(
                  (flight) => flight.status === status.status
                ).length > 0 ||
                tripData?.data?.bus?.filter(
                  (flight) => flight.status === status.status
                ).length > 0 ? (
                  <div className="tripsPage-main-status">
                    <div>
                      {tripData?.data?.flights?.filter(
                        (flight) => flight.status === status.status
                      ).length > 0 ? (
                        <>
                          {
                            tripData?.data?.flights?.filter(
                              (flight) => flight.status === status.status
                            ).length
                          }
                          -Flights,
                        </>
                      ) : null}
                      {tripData?.data?.hotels?.filter(
                        (flight) => flight.status === status.status
                      ).length > 0 ? (
                        <>
                          {
                            tripData?.data?.hotels?.filter(
                              (flight) => flight.status === status.status
                            ).length
                          }
                          -Hotels,
                        </>
                      ) : null}
                      {tripData?.data?.cabs?.filter(
                        (flight) => flight?.status === status?.status
                      ).length > 0 ? (
                        <>
                          {
                            tripData?.data?.cabs?.filter(
                              (flight) => flight?.status === status?.status
                            ).length
                          }
                          -Cab,
                        </>
                      ) : null}
                      {tripData?.data?.bus?.filter(
                        (flight) => flight?.status === status?.status
                      ).length > 0 ? (
                        <>
                          {
                            tripData?.data?.bus?.filter(
                              (flight) => flight?.status === status?.status
                            ).length
                          }
                          -Bus
                        </>
                      ) : null}
                      {tripData?.data?.otherBookings?.filter(
                        (flight) => flight?.status === status?.status
                      ).length > 0 ? (
                        <>
                          {
                            tripData?.data?.otherBookings?.filter(
                              (flight) => flight?.status === status?.status
                            ).length
                          }
                          -Others
                        </>
                      ) : null}
                    </div>
                    <span style={{ backgroundColor: status.color }}>
                      &nbsp;{status.status}
                    </span>
                  </div>
                ) : null}
              </>
            );
          })}
        </div>
      </div>
      {/* Trip details body */}
      <div className="tripDetails-main">
        <div className="tripsDetails-main-block">
          {tripData ? (
            <div className="tripDetails-box">
              {/* Displaying hotels */}
              <div>
                {tripData?.hotels ? (
                  <>
                    <div className="flex items-center">
                      <div className="tripDetails-hotel-header">Hotels</div>
                      <div className="tripsPage-createTrip">
                        <button onClick={handleHotels}>
                          Add Hotel
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{ color: "#0d0d0d" }}
                          />
                        </button>
                      </div>
                    </div>
                    {tripData?.hotels
                      ?.sort((a, b) => {
                        var atime = a?.data?.hotelSearchQuery?.checkInDate;
                        var btime = b?.data?.hotelSearchQuery?.checkInDate;
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
                        price = price + hotel.data.hotelTotalPrice;
                        var hotelData = tripData?.data?.hotels.filter(
                          (hotels) => hotels.id === hotel.id
                        );
                        const updatedDate =
                          hotelData && hotelData?.[0]?.updatedAt?.seconds;
                        var hotelTimeStamp =
                          hotelData &&
                          new Date(hotelData?.[0]?.date?.seconds * 1000);
                        var hotelPrice = 0;
                        var hotelStatus = tripData?.data?.hotels?.filter(
                          (f) => f?.id === hotel?.id
                        );

                        var color =
                          hotelStatus &&
                          statuses?.filter(
                            (status) =>
                              status?.status === hotelStatus?.[0]?.status
                          );
                        const startdate = new Date(
                          hotel?.data?.hotelSearchQuery?.checkInDate.seconds *
                            1000
                        );
                        const formattedDate1 = `${
                          monthNames[startdate.getMonth()]
                        } ${startdate.getDate()}`;
                        var endDate = getDate(
                          hotel?.data?.hotelSearchQuery?.checkOutDate.seconds
                        );
                        var img = hotel?.data?.hotelInfo?.HotelInfoResult
                          ?.HotelDetails
                          ? hotel?.data?.hotelInfo?.HotelInfoResult
                              ?.HotelDetails?.Images?.[0]
                          : "";
                        var rating = [];
                        var starRating =
                          hotel?.data?.hotelInfo?.HotelInfoResult?.HotelDetails
                            ?.StarRating;
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
                        // var hotelReq = tripData?.data?.hotels?.filter(
                        //   (hotelMain) => {
                        //     return hotelMain.id === hotel.id;
                        //   }
                        // );

                        var reqColor = reqStatuses?.filter(
                          (status) =>
                            hotelStatus?.[0]?.requestStatus &&
                            status?.status === hotelStatus?.[0]?.requestStatus
                        );

                        var originalDate = hotelData
                          ? new Date(hotelData?.[0]?.updatedAt?.seconds * 1000)
                          : new Date(hotelTimeStamp);
                        var threeHoursAfter = new Date(
                          originalDate.getTime() + 3 * 60 * 60 * 1000
                        );
                        var currentTime = new Date();
                        var isTimeReCheck =
                          hotelData?.[0]?.status === "Not Submitted"
                            ? currentTime > threeHoursAfter
                            : false;
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
                        return (
                          <>
                            <div
                              className="hotel-card-total"
                              style={
                                hotelStatus?.[0]
                                  ? getFlightStatusStyle(
                                      hotelStatus?.[0].status
                                    )
                                  : null
                              }
                            >
                              {/* hotel card section-image,date,details */}
                              <div className="hotel-card">
                                <div className="hotel-card-img">
                                  <img src={img} alt="hotel" />
                                </div>
                                <div className="hotel-card-details">
                                  <div className="hotel-card-header">
                                    <div className="text-[12px] md:!text-[18px] font-bold">
                                      {
                                        hotel.data.hotelInfo.HotelInfoResult
                                          .HotelDetails.HotelName
                                      }
                                    </div>
                                    <div className="hotelInfo-details-date">
                                      <span>
                                        {formattedDate1}-{endDate}
                                      </span>
                                      &nbsp;(
                                      {
                                        hotel.data.hotelSearchQuery.hotelNights
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
                              {/* Selected Room details */}
                              {hotel?.data?.selectedRoomType &&
                                hotel?.data?.selectedRoomType.map((room, f) => {
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
                                        {room?.Inclusion?.length > 0
                                          ? room?.Inclusion?.map(
                                              (inclusion) => {
                                                return <span>{inclusion}</span>;
                                              }
                                            )
                                          : null}
                                      </div>
                                    </div>
                                  );
                                })}
                              {/* Line to seperate */}
                              <div className="seperate"></div>
                              {/* Delete, added date and total price section */}

                              {isTimeReCheck ? (
                                <div className="recheck-rates">
                                  <div className="recheck-bg"></div>
                                  <div className="recheck-content">
                                    <button
                                      onClick={() => {
                                        setOpenDelete(true);
                                        setDeleteType("hotels");
                                        setDeleteId(hotel.id);
                                      }}
                                    >
                                      <MdDelete color="red" />
                                    </button>
                                    <button
                                      onClick={async () => {
                                        setHotelAdults(adults);
                                        setHotelEndDate(endDate);
                                        setFormatDate(formattedDate1);
                                        setHotelDetails(hotel);
                                        setReCheckLoading(true);
                                        setReCheckHotelName(
                                          hotel.data.hotelInfo.HotelInfoResult
                                            .HotelDetails.HotelName
                                        );
                                        setOpenPriceReCheck(true);

                                        var data =
                                          await actions.getHotelUpdatedDetails(
                                            hotel.data.hotelSearchQuery
                                              .cityHotel,
                                            hotel.data.hotelSearchQuery,
                                            hotel.data.selectedRoomType,
                                            hotel.data.hotelSearchRes
                                          );
                                        setOldSelectedRoom(
                                          hotel.data.selectedRoomType
                                        );
                                        setNewSelectedRoom(data);
                                        setReCheckLoading(false);
                                        setDeleteType("hotels");
                                        setDeleteId(hotel.id);
                                      }}
                                    >
                                      ReCheck
                                    </button>
                                  </div>
                                </div>
                              ) : null}
                              <div className="timestamp">
                                <div>
                                  {(hotelStatus &&
                                    hotelStatus?.[0]?.requestStatus) ===
                                    "Pending" ||
                                  (hotelStatus &&
                                    hotelStatus?.[0]?.status === "Submitted") ||
                                  (hotelStatus &&
                                    hotelStatus?.[0]?.status === "Booked") ||
                                  (hotelStatus &&
                                    hotelStatus?.[0]?.requestStatus ===
                                      "Approved") ? null : (
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      className="delete-icon"
                                      onClick={() => {
                                        setOpenDelete(true);
                                        setDeleteType("hotels");
                                        setDeleteId(hotel.id);
                                      }}
                                    />
                                  )}
                                </div>
                                <div
                                  onClick={() => {
                                    setTimeStampData(hotelStatus?.[0]);
                                    setAllTimeStamp(true);
                                  }}
                                >
                                  <LuAlarmClock
                                    size={15}
                                    className="cursor-pointer"
                                  />
                                </div>
                                <div>
                                  {/* Added:&nbsp;
                                  <span>
                                    {hotelTimeStamp.toString().slice(4, 24)}
                                  </span> */}
                                </div>
                                {/* {updatedDate !== undefined ? (
                                  <div>
                                    Updated:&nbsp;
                                    <span>
                                      {new Date(updatedDate*1000).toISOString().replace('T', ' ').substring(0, 19)}
                                      {new Date(updatedDate * 1000)
                                        .toString()
                                        .slice(4, 24)}
                                    </span>
                                  </div>
                                ) : null} */}
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
                                      setHotelFinalPrice(hotel.data);
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
                              {/* Booking and approval status and voucher */}
                              <div className="hotel-card-status">
                                <div className="request-status">
                                  Approval Status:
                                  <span
                                    style={{
                                      background: reqColor?.[0]
                                        ? reqColor?.[0]?.color
                                        : "#808080",
                                    }}
                                  >
                                    {hotelStatus?.[0]?.requestStatus}
                                  </span>
                                </div>
                                <div className="hotelType">
                                  {hotelStatus?.[0]?.status ? (
                                    <>
                                      <div className="hotelStatus">
                                        Booking Status:
                                        <span
                                          style={{
                                            background: color?.[0]
                                              ? color?.[0]?.color
                                              : "#808080",
                                          }}
                                        >
                                          {hotelStatus?.[0]?.status}
                                        </span>
                                      </div>
                                      {hotelStatus?.[0]?.downloadURL ? (
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
                                    </>
                                  ) : (
                                    <div className="hotelStatus">
                                      Booking Status:
                                      <span style={{ background: "#808080" }}>
                                        {" "}
                                        Not Submitted
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <HotelTravelInput
                                  hotel={hotel}
                                  hotelData={hotelStatus && hotelStatus?.[0]}
                                  userAccountDetails={userAccountDetails}
                                  tripData={tripData}
                                  adults={adults?.adults}
                                  child={adults?.child}
                                  tripId={id}
                                  hotelBookingStatus={
                                    hotelStatus && hotelStatus?.[0]?.status
                                  }
                                  endDate={endDate}
                                  userId={userId}
                                />
                              </div>
                              {hotelStatus?.[0]?.note && (
                                <p className="ml-[10pt] text-[10pt]">
                                  Note:{hotelStatus?.[0]?.note}
                                </p>
                              )}
                            </div>
                          </>
                        );
                      })}
                  </>
                ) : null}
              </div>
              {/* Displaying flights */}
              <div className="tripDetails-flight">
                {tripData?.flights ? (
                  <>
                    <div className="flex items-center">
                      <div className="tripDetails-hotel-header">Flights</div>
                      <div className="tripsPage-createTrip">
                        <button onClick={handleFlights}>
                          Add Flight
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{ color: "#0d0d0d" }}
                          />
                        </button>
                      </div>
                    </div>
                    {tripData?.flights
                      ?.sort((a, b) => {
                        var aflightArr = [a.data.flight].map((flight, f) => {
                          return { ...actions.modifyFlightObject(flight) };
                        });
                        var bflightArr = [b.data.flight].map((flight, f) => {
                          return { ...actions.modifyFlightObject(flight) };
                        });
                        return (
                          aflightArr?.[0]?.segments?.[0]?.depTimeDate -
                          bflightArr?.[0]?.segments?.[0]?.depTimeDate
                        );
                      })
                      .map((flight, f) => {
                        var flightStatus = tripData?.data?.flights?.filter(
                          (f) => f.id === flight.id
                        );
                        const charge =
                          flight?.data?.totalFare === 0
                            ? 0
                            : Math.ceil(
                                (flight?.data?.totalFare * domesticFlight) / 100
                              ) > minimumServiceCharge
                            ? Math.ceil(
                                (flight?.data?.totalFare * domesticFlight) / 100
                              )
                            : minimumServiceCharge;
                        const gst =
                          flight?.data?.totalFare === 0
                            ? 0
                            : Math.ceil(charge * 0.18);
                        price =
                          price +
                          flight?.data?.totalFare +
                          flight?.data?.gstInFinalserviceCharge +
                          flight?.data?.finalFlightServiceCharge;
                        var hotelData = tripData?.data?.flights?.filter(
                          (hotels) => hotels.id === flight.id
                        );
                        console.log(hotelData);
                        const updatedAt =
                          flightStatus && flightStatus?.[0]?.updatedAt?.seconds;
                        var hotelTimeStamp = new Date(
                          hotelData && hotelData?.[0]?.date?.seconds * 1000
                        );
                        // var flightReq = tripData?.data?.flights?.filter(
                        //   (hotelMain) => {
                        //     return hotelMain.id === flight.id;
                        //   }
                        // );
                        // var reqColor = reqStatuses.filter((status) => {
                        //   return (
                        //     flightReq &&
                        //     status?.status === flightReq[0]?.requestStatus
                        //   );
                        // });
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
                            <Flight
                              flightGrp={[flight.data.flight]}
                              index={f}
                              tripsPage={true}
                              bookingPage={true}
                              flightBooking={flight.data}
                              downloadUrl={
                                flightStatus && flightStatus?.[0]?.downloadURL
                                  ? flightStatus?.[0]?.downloadURL
                                  : undefined
                              }
                              flightStatus={flightStatus && flightStatus?.[0]}
                              timeStamp={hotelTimeStamp}
                              flightId={flight.id}
                              tripId={id}
                              // flightReq={flightReq}
                              // reqColor={reqColor}
                              updatedAt={updatedAt}
                              flight={flight}
                              id={flight.id}
                              isInternational={isInternational}
                              totalFlight={hotelData}
                              charge={charge}
                              gst={gst}
                              userId={userId}
                            />
                          </>
                        );
                      })}
                    {/* <div className="tripsPage-createTrip">
                      <button onClick={handleFlights}>
                        Add Flight&nbsp;&nbsp;
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ color: "#0d0d0d" }}
                        />
                      </button>
                    </div> */}
                  </>
                ) : null}
              </div>
              {/* Displaying cabs */}
              <div className="tripDetails-flight">
                {tripData?.cabs ? (
                  <>
                    <div className="flex items-center">
                      <div className="tripDetails-hotel-header">Cabs</div>
                      <div className="tripsPage-createTrip">
                        <button onClick={handleCabs}>
                          Add Cab
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{ color: "#0d0d0d" }}
                          />
                        </button>
                      </div>
                    </div>
                    {tripData?.cabs?.map((cab, f) => {
                      var cabReq = tripData?.data?.cabs?.filter((hotelMain) => {
                        return hotelMain.id === cab.id;
                      });
                      console.log(cab);
                      price = price + Number(cab.data.cabTotalPrice);

                      return (
                        <>
                          <Cab
                            cab={cab.data.cab}
                            tripsPage={true}
                            startDate={cab.data.cabStartDate}
                            endDate={cab.data.cabEndDate}
                            cabData={cabReq?.[0]}
                            tripsCabType={cab.data.cabType}
                            cabTotal={cab.data}
                            tripId={id}
                            countCab={cab?.data?.cabCount}
                            newCab={cabReq?.[0]}
                            totalCab={cab}
                            userId={userId}
                          />
                        </>
                      );
                    })}
                    {/* <div className="tripsPage-createTrip">
                      <button onClick={handleCabs}>
                        Add Cab&nbsp;&nbsp;
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ color: "#0d0d0d" }}
                        />
                      </button>
                    </div> */}
                  </>
                ) : null}
              </div>
              {/* Displaying buses */}
              <div className="tripDetails-flight">
                {tripData?.bus ? (
                  <>
                    <div className="flex items-center">
                      <div className="tripDetails-hotel-header">Buses</div>
                      <div className="tripsPage-createTrip">
                        <button onClick={handleBuses}>
                          Add Bus
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{ color: "#0d0d0d" }}
                          />
                        </button>
                      </div>
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

                      price = price + Number(busData.data.busTotalPrice);
                      return (
                        <Bus
                          bus={bus}
                          tripsPage={true}
                          bookingBus={busData.data}
                          busData={busDataa && busDataa?.[0]}
                          tripId={id}
                          selectedSeatsPrice={selectedSeatsPrice}
                          totalBus={busData}
                          OverallBus={OverallBus}
                          userId={userId}
                        />
                      );
                    })}
                    {/* <div className="tripsPage-createTrip">
                      <button onClick={handleBuses}>
                        Add Bus&nbsp;&nbsp;
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ color: "#0d0d0d" }}
                        />
                      </button>
                    </div> */}
                  </>
                ) : null}
              </div>
              {/* Displaying Other bookings */}
              <div className="tripDetails-flight">
                {tripData?.otherBookings ? (
                  <>
                    <div className="flex items-center">
                      <div className="text-[18pt] font-bold my-[10pt]">
                        Other Bookings
                      </div>
                      {/* <div className="tripsPage-createTrip">
                        <button onClick={handleBuses}>
                          Add Bus
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{ color: "#0d0d0d" }}
                          />
                        </button>
                      </div> */}
                    </div>
                    {tripData?.otherBookings?.map((other) => {
                      console.log(other);
                      price = price + other.data.overallBookingPrice;
                      const otherM = tripData?.data?.otherBookings?.filter(
                        (otherMain) => {
                          return otherMain.id === other.id;
                        }
                      );

                      var color = statuses?.filter((status) => {
                        return status?.status === otherM?.[0]?.status;
                      });
                      var reqColor = reqStatuses.filter((status) => {
                        return status?.status === otherM?.[0]?.requestStatus;
                      });
                      const backgroundColor =
                        otherM?.[0]?.status === "Booked"
                          ? "honeydew"
                          : "inherit";
                      const isThere = invoiceData.find(
                        (item) => item.cardId === other.id
                      );
                      console.log(isThere);
                      return (
                        <div
                          style={{
                            boxShadow:
                              "0.04rem 0.06rem 0.4rem rgba(0, 0, 0, 0.171)",
                            backgroundColor: backgroundColor,
                          }}
                          className="w-[100%] md:w-[90%] rounded-[0.8rem] mt-[10pt] pt-[10pt] pl-[10pt] pb-[3pt]"
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
                                  <p className="text-[#BB3E03] font-bold text-[9pt] md:text-[16px]">
                                    Price:
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
                                  setAllOtherTimeData(otherM?.[0]);
                                  setAllOtherTime(true);
                                }}
                              >
                                <LuAlarmClock
                                  size={15}
                                  className="cursor-pointer"
                                />
                              </div>
                              <p className="text-[#BB3E03] font-bold py-1 text-[9pt] md:text-[16px]">
                                Total Price:
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="tripsPage-totalPrice-price-icon"
                                />{" "}
                                {other?.data?.overallBookingPrice} &nbsp;
                                <FontAwesomeIcon
                                  icon={faCircleInfo}
                                  onClick={() => {
                                    setOtherPriceInfo(true);
                                    setOtherPrice({
                                      total: other?.data?.overallBookingPrice,
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
                            <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between pt-1 pb-3">
                              <p className="text-[10pt]">
                                Approval Status:
                                <span
                                  style={{
                                    background: reqColor?.[0]
                                      ? reqColor?.[0]?.color
                                      : "#808080",
                                  }}
                                  className="py-[3pt] px-[5pt] rounded-[0.8rem] text-white text-[8pt]"
                                >
                                  {otherM?.[0]?.requestStatus}
                                </span>
                              </p>
                              {otherM?.[0]?.downloadURL ? (
                                <div
                                  className="hotel-card-download !cursor-pointer"
                                  onClick={() => downloadDoc(otherM)}
                                >
                                  Voucher&nbsp;
                                  <FontAwesomeIcon icon={faDownload} />
                                </div>
                              ) : null}
                              <p className="text-[10pt]">
                                Booking Status:
                                <span
                                  style={{
                                    background: color?.[0]
                                      ? color?.[0]?.color
                                      : "#808080",
                                  }}
                                  className="py-[3pt] px-[5pt] rounded-[0.8rem] text-white text-[8pt]"
                                >
                                  {otherM?.[0]?.status}
                                </span>
                              </p>
                              <Button
                                sx={{
                                  position: "static",
                                  fontSize: "11px",
                                  width: 130,
                                }}
                                className="!bg-[#94d2bd] !text-black"
                                size="small"
                                onClick={() => {
                                  setOtherBookingTravellers(true);
                                  setOtherBookingTravDetails(
                                    other?.data?.bookingTravellers
                                  );
                                }}
                              >
                                View Travellers:
                              </Button>
                            </div>
                          </div>
                          {/* <PDFViewer width="100%" height="600">
                            <InvoicePdf1
                              type="Other"
                              other={other}
                              userAccountDetails={userAccountDetails}
                              invoiceId={isThere.invoiceId}
                              tripData={tripData}
                            />
                          </PDFViewer> */}
                          {isThere && (
                            <button onClick={() => {}}>
                              <PDFDownloadLink
                                document={
                                  <InvoicePdf1
                                    type="Other"
                                    other={other}
                                    userAccountDetails={userAccountDetails}
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
                          {otherM?.[0]?.note && (
                            <p className="ml-[10pt] text-[10pt]">
                              Note:{otherM?.[0]?.note}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    {/* <div className="tripsPage-createTrip">
                      <button onClick={handleBuses}>
                        Add Bus&nbsp;&nbsp;
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ color: "#0d0d0d" }}
                        />
                      </button>
                    </div> */}
                  </>
                ) : null}
              </div>
              {/* Displaying expenses */}
              {/* <div className="tripDetails-flight">
                <div className="flex items-center">
                  <div className="tripDetails-hotel-header">Expenses</div>
                  <div className="tripsPage-createTrip">
                    <button onClick={() => setOpenExpense(true)}>
                      Add Expenses
                      <FontAwesomeIcon
                        icon={faPlus}
                        style={{ color: "#0d0d0d" }}
                      />
                    </button>
                  </div>
                </div> */}
              {/* {tripData?.expenses ? (
                  <>
                    {tripData?.expenses?.map((expense, f) => {
                      console.log(expense.data.expenseDate);
                      return (
                        <div className="expense-card">
                          <div className="expense-card-details">
                            <div className="expense-card-header">
                              <div className="expense-card-name">
                                {expense.data.type}
                              </div>
                              <div className="expense-details-date">
                                <span>
                                  {new Date(expense.data.expenseDate * 1000)
                                    .toString()
                                    .split(" ")
                                    .splice(1, 2)
                                    .join(" ")}
                                </span>
                              </div>
                            </div>
                            <div className="expense-card-desc">
                              <div className="expense-card-people">
                                Description:
                                <span>{expense.data.description}</span>
                              </div>
                              <div className="expense-price">
                                Cost:{" "}
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="expense-icon"
                                />
                                {`${Math.ceil(expense.data.cost).toLocaleString(
                                  "en-IN"
                                )}`}
                                &nbsp;
                              </div>
                              <div
                                className="expense-price"
                                onClick={() =>
                                  downloadExpense(expense.data.file)
                                }
                              >
                                <span>
                                  Voucher:&nbsp;
                                  <FontAwesomeIcon icon={faDownload} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : null} */}
              {/* <div className="tripsPage-createTrip">
                  <button onClick={() => setOpenExpense(true)}>
                    Add Trip Expense&nbsp;&nbsp;
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ color: "#0d0d0d" }}
                    />
                  </button>
                </div> */}
              {/* </div> */}
            </div>
          ) : null}
        </div>
        {/* Mobile Price section */}
        <div className="tripDetails-totalPrice-Mobile">
          <div className="tripDetails-totalPrice-section-Mobile">
            <div className="tripDetails-totalPrice-title-Mobile">
              Total price:
            </div>
            <div className="tripDetails-totalPrice-price-Mobile">
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="tripDetails-totalPrice-price-icon"
              />
              &nbsp;{`${Math.ceil(price)} `}
            </div>
          </div>
          {tripData?.data?.flights?.filter(
            (flight) => flight.status === "Not Submitted"
          )?.length > 0 ||
          tripData?.data?.hotels?.filter(
            (flight) => flight.status === "Not Submitted"
          )?.length > 0 ||
          tripData?.data?.cabs?.filter((cab) => cab.status === "Not Submitted")
            ?.length > 0 ||
          tripData?.data?.bus?.filter((cab) => cab.status === "Not Submitted")
            ?.length > 0 ? (
            <>
              <button onClick={onBtnClick}>Proceed to Booking</button>
            </>
          ) : null}
        </div>
        {/* Desktop Price */}
        <div className="tripDetails-totalPrice-Desktop">
          <div className="tripDetails-totalPrice-section-Desktop">
            <div className="tripDetails-totalPrice-title-Desktop">
              Tripbizz price
            </div>
            <div className="tripDetails-totalPrice-price-Desktop">
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="tripDetails-totalPrice-price-icon"
              />
              &nbsp;{`${Math.ceil(price).toLocaleString("en-IN")} `}
            </div>
          </div>
          {expensePrice > 0 ? (
            <div className="tripDetails-totalPrice-section-Desktop">
              <div className="tripDetails-totalPrice-title-Desktop">
                Expense price
              </div>
              <div className="tripDetails-totalPrice-price-Desktop">
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="tripDetails-totalPrice-price-icon"
                />
                &nbsp;{`${Math.ceil(expensePrice).toLocaleString("en-IN")} `}
              </div>
            </div>
          ) : null}
          <div className="tripDetails-totalPrice-section-Desktop">
            <div className="tripDetails-totalPrice-title-Desktop">
              Total price
            </div>
            <div className="tripDetails-totalPrice-price-Desktop">
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="tripDetails-totalPrice-price-icon"
              />
              &nbsp;
              {`${Math.ceil(price + expensePrice).toLocaleString("en-IN")} `}
            </div>
          </div>
          <div className="tripDetails-totalPrice-submit-Desktop">
            {tripData?.data?.flights?.some(
              (flight) => flight?.status === "Not Submitted"
            ) ||
            tripData?.data?.hotels?.some(
              (hotel) => hotel.status === "Not Submitted"
            ) ||
            tripData?.data?.cabs?.some(
              (cab) => cab.status === "Not Submitted"
            ) ||
            tripData?.data?.bus?.some(
              (bus) => bus.status === "Not Submitted"
            ) ? (
              <>
                {tripData?.data?.flights.every((flight) => {
                  console.log("Flight Status:", flight.status);

                  const matchingFlight = tripData?.data?.flights.find(
                    (f) => f.id === flight.id
                  );

                  if (!matchingFlight) return false;

                  const flightTimeStamp = matchingFlight?.updatedAt
                    ? new Date(matchingFlight.updatedAt.seconds * 1000)
                    : new Date(matchingFlight?.date?.seconds * 1000);

                  const threeHoursAfter = new Date(
                    flightTimeStamp.getTime() + 3 * 60 * 60 * 1000
                  );

                  const currentTime = new Date();

                  const isTimeReCheck =
                    matchingFlight?.status === "Submitted" ||
                    matchingFlight?.status === "Booked" ||
                    matchingFlight?.status === "Cancelled"
                      ? true
                      : currentTime < threeHoursAfter;

                  console.log("Is Time ReCheck for Flight:", isTimeReCheck);
                  return isTimeReCheck;
                }) &&
                tripData?.data?.hotels.every((hotel) => {
                  console.log("Hotel Status:", hotel.status);

                  const matchingHotel = tripData?.data?.hotels.find(
                    (h) => h.id === hotel.id
                  );

                  if (!matchingHotel) return false;

                  const hotelTimeStamp = matchingHotel?.updatedAt
                    ? new Date(matchingHotel.updatedAt.seconds * 1000)
                    : new Date(matchingHotel?.date?.seconds * 1000);

                  const threeHoursAfter = new Date(
                    hotelTimeStamp.getTime() + 3 * 60 * 60 * 1000
                  );

                  const currentTime = new Date();

                  const isTimeReCheck =
                    matchingHotel?.status === "Submitted" ||
                    matchingHotel?.status === "Booked" ||
                    matchingHotel?.status === "Cancelled"
                      ? true
                      : currentTime < threeHoursAfter;

                  console.log("Is Time ReCheck for Hotel:", isTimeReCheck);
                  return isTimeReCheck;
                }) ? (
                  <button onClick={onBtnClick}>Proceed to Booking</button>
                ) : (
                  <button onClick={() => setReCheck(true)}>Recheck</button>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
