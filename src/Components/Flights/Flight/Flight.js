import React, { useContext, useEffect, useState } from "react";
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
  faUpload,
  faCutlery,
  faCalendarXmark,
  faChair,
  faTrash,
  faCircleInfo,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ImSpinner2 } from "react-icons/im";
import { format } from "date-fns";
import firebase from "firebase/compat/app";
import { collection, getDocs } from "firebase/firestore";
import Popup from "../../Popup";
import "./Flight.css";

import { ScaleLoader } from "react-spinners";
import TravDetails from "../../Trips/TripDetails/TravellerDetails";
import FlightPriceCard from "../../Trips/TripDetails/FlightPriceCard";
import LoadingProg from "../../Loading/LoadingProg";
import FlightCard from "../../Trips/TripDetails/FlightCard";
import { MdDelete } from "react-icons/md";
import { Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { LuAlarmClock } from "react-icons/lu";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePdf1 from "../../InvoicePdf1";
import { db } from "../../MyProvider";
import { generateBookingId } from "../../Utilites/functions";
const ruleType = {
  Cancellation: "Cancellation",
  Reissue: "Date change",
};

function Flight(props) {
  const { control, handleSubmit, setValue } = useForm();
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
  const [openUpload, setOpenUpload] = useState(false);
  const [hotelId, setHotelId] = useState(null);
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [ticketCost, setTicketCost] = useState("");
  const [mounted, setMounted] = useState(true);
  const [open, setOpen] = useState(false);
  const [openTravellers, setOpenTravellers] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [deleteType, setDeleteType] = useState(false);
  const [openFlightPrice, setOpenFlightPrice] = useState(false);
  const [openFareRules, setOpenFareRules] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openAdminPrice, setOpenAdminPrice] = useState(false);
  const [openPriceReCheck, setOpenPriceReCheck] = useState(false);
  const [reCheckData, setReCheckData] = useState(null);
  const [reCheckBaggage, setReCheckBaggage] = useState(0);
  const [reCheckMeals, setReCheckMeals] = useState(0);
  const [reCheckSeats, setReCheckSeats] = useState(0);
  const [openAdminFareRules, setOpenAdminFareRules] = useState(false);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [recheckSeatsAvailable, setRecheckSeatsAvailable] = useState(false);
  const [addTravellers, setAddTravellers] = useState(false);
  const [newtravellerDetails, setNewTravellerDetails] = useState();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [newFlightId, setNewFlightid] = useState();
  const [alltimeStamp, setAllTimeStamp] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [bookingStyle, setBookingStyle] = useState("Manual");
  const [timeLeft, setTimeLeft] = useState(null);
  const [holdStatus, setHoldStatus] = useState(false);
  const [ticketLccStatus, setTicketLccStatus] = useState(false);
  const [newFare, setNewFare] = useState({});
  const [isPriceChanged, setIsPriceChanged] = useState(false);
  const [newFlightPrice, setNewFlightPrice] = useState(0);
  const [newLccFare, setNewLccFare] = useState({});
  const [isPriceChangedLcc, setIsPriceChangedLcc] = useState(false);
  const [newLccFlightPrice, setNewLccFlightPrice] = useState(0);
  const [ticketLoader, setTicketLoader] = useState(false);
  const [flightBookConformation, setFlightBookingConformation] =
    useState(false);
  const [lccConformation, setLccConformation] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  var statuses = [
    { status: "Submitted", color: "#ffa500" },
    // { status: "Need clarification", color: "#FFC107" },
    // { status: "Price Revision", color: "#2196F3" },
    { status: "Booked", color: "#4CAF50" },
    { status: "Cancelled", color: "#FF0000" },
    // { status: "Submitted,Payment Pending", color: "#ffa500" },
    // { status: "Booked,Payment Pending", color: "#4AF50" },
    { status: "Not Submitted", color: "#808080" },
  ];
  var reqStatuses = [
    { status: "Approved", color: "#008000" },
    { status: "Pending", color: "#ffa500" },
    { status: "Not Requested", color: "#808080" },
    { status: "Skipped", color: "#808080" },
  ];

  const {
    actions,
    bookingFlight,
    flightResJType,
    flightResList,
    domesticFlight,
    userAccountDetails,
    tripData,
    adminTripDetails,
    recheckError,
    recheckLoad,
  } = useContext(MyContext);
  // console.log(adminTripDetails?.flights?.[0]?.data?.[0]?.flight?.Fare.OfferedFare, "ravi");

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
    timeStamp,
    flightId,
    adminTripid,
    tripId,
    flight,
    isInternational,
    id,
    totalFlight,
    user,
    userId,
  } = props;
  var reqColor = reqStatuses.filter((status) => {
    return status?.status === flightStatus?.requestStatus;
  });
  const toggle = (e) => {
    setIsOpen((prev) => !prev);
    actions.toggle(e, `#flightIndex${index}`);
  };
  var flightArr = flightGrp.map((flight, f) => {
    return { ...actions.modifyFlightObject(flight) };
  });
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
  const onSubmit = (data) => {
    const newData = { [flight.id]: data };
    // console.log(newData,"dfkdjf");
    // setNewTravellerDetails({
    //   ...newtravellerDetails,
    //   [id]: data,
    // });
    // console.log(newtravellerDetails);
    actions.updateTravDetails(newData, tripId, userId);
    setAddTravellers(false);
    // console.log(data); // Handle form submission here
  };
  var originalDate = flightStatus?.updatedAt
    ? new Date(flightStatus.updatedAt?.seconds * 1000)
    : new Date(timeStamp);
  var threeHoursAfter = new Date(originalDate.getTime() + 3 * 60 * 60 * 1000);
  var currentTime = new Date();
  var isTimeReCheck =
    flightStatus?.status === "Not Submitted"
      ? currentTime > threeHoursAfter
      : false;

  // var invoiceData=[]
  useEffect(() => {
    const fetch = async () => {
      const data = await actions.getInvoiceDetails(userId, tripId);
      if (data?.length > 0) {
        setInvoiceData(data);
      }
    };
    fetch();
  }, [tripId]);
  var isThere = null;
  if (invoiceData.length > 0) {
    isThere = invoiceData.find((item) => item.cardId === totalFlight?.[0]?.id);
  }
  useEffect(() => {
    if (mounted) {
      getData();
    }
    return () => [setMounted(false)];
  }, [mounted]);
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
      if (newtravellerDetails.infants) {
        newtravellerDetails.infants.forEach((infants, index) => {
          setValue(`infants[${index}].gender`, infants.gender);
          setValue(`infants[${index}].firstName`, infants.firstName);
          setValue(`infants[${index}].lastName`, infants.lastName);
          // Set other values similarly
          if (isInternational) {
            setValue(
              `infants[${index}].passportNumber`,
              infants.passportNumber
            );
            setValue(
              `infants[${index}].passportIssueCountry`,
              infants.passportIssueCountry
            );
            setValue(
              `infants[${index}].passportIssueDate`,
              infants.passportIssueDate
            );
            setValue(
              `infants[${index}].passportExpiryDate`,
              infants.passportExpiryDate
            );
            // setValue(`infants[${index}].birthDate`, infants.birthDate);
          }
        });
      }
    }
  }, [newtravellerDetails, setValue]);

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
  var downloadName = flightData?.downloadURL?.slice(
    164,
    flightData?.downloadURL.indexOf("?")
  );

  var handleAdminDownload = async () => {
    var downloadName = flightData?.downloadURL?.slice(
      164,
      flightData?.downloadURL.indexOf("?")
    );
    const response = await fetch(flightData?.downloadURL);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  var handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  var handleFileSubmit = async () => {
    var doc = await actions.addBookingDocuments(
      file,
      adminBooking.data.userDetails.userid,
      adminBooking.data.tripId,
      hotelId,
      adminBooking.id,
      "flight"
    );
    var data = [flightBooking].map((book, b) => {
      return (
        book.flightNew.segments[0].originAirportCode +
        "to" +
        book.flightNew.segments[0].destAirportCode
      );
    });
    var bookingFlight = adminBooking?.flights?.filter((flight) => {
      return flight.id === hotelId;
    });
    if (
      actionToConfirm === "Booked" ||
      actionToConfirm === "Booked,Payment Pending"
    ) {
      await actions.sendBookingStatusEmail({
        id: adminBooking?.data?.userDetails?.userid,
        name: adminBooking?.data?.userDetails?.firstName,
        email: adminBooking?.data?.userDetails?.email,
        fileUrl: doc,
        tripName: adminBooking?.data?.tripName,
        typeName: data,
        type: "Flight",
        booking: bookingFlight,
        travellerDetails: adminBooking.data.travellerDetails,
      });
    }
    setOpenUpload(false);
  };

  var handleClick = async (hotelId, statuse) => {
    await actions.editTripStatus(
      adminBooking.data.userDetails.userid,
      adminBooking.data.tripId,
      adminBooking.id,
      statuse,
      hotelId,
      "flight"
    );

    var data = [flightBooking].map((book, b) => {
      return (
        book.flightNew.segments?.[0]?.originAirportCode +
        "to" +
        book.flightNew.segments?.[0]?.destAirportCode
      );
    });
    if (!file) {
      var bookingFlight = adminBooking?.flights?.filter((flight) => {
        return flight.id === hotelId;
      });
      if (statuse === "Booked" || statuse === "Booked,Payment Pending") {
        await actions.sendBookingStatusEmail({
          id: adminBooking?.data?.userDetails?.userid,
          name: adminBooking?.data?.userDetails?.firstName,
          email: adminBooking?.data?.userDetails?.email,
          fileUrl: null,
          tripName: adminBooking?.data?.tripName,
          typeName: data,
          type: "Flight",
          booking: bookingFlight,
          travellerDetails: adminBooking.data.travellerDetails,
        });
      }
    }
  };

  var addTicketCost = async () => {
    await actions.addTicketCostAdmin(
      ticketCost,
      adminBooking.data.userDetails.userid,
      adminBooking.data.tripId,
      hotelId,
      adminBooking.id,
      "flight"
    );
    setOpenUpload(false);
  };

  var addNote = async () => {
    await actions.addNoteAdmin(
      note,
      adminBooking.data.userDetails.userid,
      adminBooking.data.tripId,
      hotelId,
      adminBooking.id,
      "flight"
    );
    setOpenUpload(false);
  };

  var handleDelete = async () => {
    await actions.deleteTripItem(tripId, deleteId, deleteType, userId);
    setOpenDelete(false);
  };

  var color = statuses.filter((status) => {
    return status?.status === flightStatus?.status;
  });
  var adColor = statuses.filter((status) => {
    return status?.status === flightData?.status;
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
  var getUpdatedFares = (ssrData) => {
    var baggagePrice = 0;
    var mealPrice = 0;
    // var seatPrice = 0;

    if (ssrData?.Baggage) {
      flightBooking?.selectedBaggage?.forEach((selectedBaggage, s) => {
        selectedBaggage.forEach((selected) => {
          const matchingBag = ssrData.Baggage[s].find(
            (bag) =>
              bag.Weight === selected.baggage && bag.Price === selected.price
          );
          if (matchingBag) {
            baggagePrice += matchingBag.Price;
          }
        });
      });
    }
    if (ssrData?.MealDynamic) {
      flightBooking?.selectedMeals?.forEach((selectedMeals, s) => {
        selectedMeals.forEach((selected) => {
          const matchingMeal = ssrData.MealDynamic[s].find(
            (meal) =>
              meal.AirlineDescription === selected.mealDesc &&
              meal.Price === selected.price
          );
          if (matchingMeal) {
            mealPrice += matchingMeal.Price;
          }
        });
      });
    }
    if (ssrData?.SeatDynamic) {
      var x = 0;
      flightBooking.seats.forEach((seat, s) => {
        seat.forEach((t, i) => {
          Object.keys(t).forEach((sa) => {
            var seatDetails = t[sa];
            var matchingData = ssrData?.SeatDynamic[s]?.SegmentSeat[
              i
            ]?.RowSeats[Number(seatDetails.RowNo)]?.Seats?.find(
              (X) =>
                X?.RowNo === seatDetails?.RowNo &&
                X?.SeatNo === seatDetails?.SeatNo
            );
            x += matchingData?.Price;
          });
        });
      });
    }
    setReCheckSeats(x);
    setReCheckBaggage(baggagePrice);
    setReCheckMeals(mealPrice);
  };
  const areSeatsAvailable = (seatData, selectedSeats) => {
    if (!selectedSeats || !seatData) {
      setRecheckSeatsAvailable(true);
      return;
    }
    const allSeats = [];
    for (let segment of seatData) {
      for (let rowSeats of segment.Seats) {
        allSeats.push(rowSeats);
      }
    }

    // Check each selected seat
    for (let key in selectedSeats) {
      // const selectedSeat = selectedSeats[key];

      const seat = allSeats.find((s) => s.Code === key);

      if (!seat || seat.AvailablityType !== String(1)) {
        setRecheckSeatsAvailable(false);
        // return false; // Seat is not available
      }
    }

    setRecheckSeatsAvailable(true); // All selected seats are available
  };

  var fareData = tripsPage ? actions.getTotalFares([flightBooking]) : "";
  var mainfare = adminPage ? actions.getTotalFares([flightBooking]) : "";
  var fData = adminPage ? actions.objToArr(flightBooking) : null;
  var id =
    flightBooking?.seats?.[0]?.length > 0
      ? Object.keys(flightBooking?.seats?.[0]?.[0])
      : "";
  var adminId =
    fData?.seats?.[0].length > 0 ? Object.keys(fData?.seats?.[0]?.[0]) : "";
  const adminFlightTrav =
    adminBooking?.data?.travellerDetails?.[newFlightId]?.adults;
  const adminFlightChild =
    adminBooking?.data?.travellerDetails?.[newFlightId]?.children;
  const adminFlightInfant =
    adminBooking?.data?.travellerDetails?.[newFlightId]?.infants;
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
  const holdingFlightTicket = async (data, id) => {
    if (data.flight.IsLCC === false) {
      try {
        setHoldStatus(true);
        const passengers = adminBooking?.data?.travellerDetails[id]?.adults;
        const formattedPassengers = passengers?.map((passenger, index) => {
          let genderCode;
          switch (passenger.gender) {
            case "Mr":
              genderCode = 1;
              break;
            case "Ms":
              genderCode = 2;
              break;
            case "Mrs":
              genderCode = 3;
              break;
            default:
              genderCode = 1;
          }
          return {
            Title: passenger.gender,
            FirstName: passenger.firstName,
            LastName: passenger.lastName,
            PaxType: 1,
            DateOfBirth: passenger.birthDate,
            Gender: genderCode,
            PassportNo: "",
            PassportExpiry: "",
            AddressLine1: adminBooking?.data?.userDetails?.companyAddress,
            AddressLine2: "",
            Fare: isPriceChanged
              ? newFare
              : {
                  Currency: data.flight.Fare.Currency,
                  BaseFare: data.flight.Fare.BaseFare,
                  Tax: data.flight.Fare.Tax,
                  YQTax: data.flight.Fare.YQTax,
                  AdditionalTxnFeePub: data.flight.Fare.AdditionalTxnFeePub,
                  AdditionalTxnFeeOfrd: data.flight.Fare.AdditionalTxnFeeOfrd,
                  OtherCharges: data.flight.Fare.OtherCharges,
                  Discount: data.flight.Fare.Discount,
                  PublishedFare: data.flight.Fare.PublishedFare,
                  OfferedFare: data.flight.Fare.OfferedFare,
                  TdsOnCommission: data.flight.Fare.TdsOnCommission,
                  TdsOnPLB: data.flight.Fare.TdsOnPLB,
                  TdsOnIncentive: data.flight.Fare.TdsOnIncentive,
                  ServiceFee: data.flight.Fare.ServiceFee,
                },
            City: "Hyderabad",
            CountryCode: "IN",
            CellCountryCode: "+91",
            ContactNo: passenger.mobileNumber,
            Nationality: "IN",
            Email: "support@tripbizz.com",
            IsLeadPax: index === 0,
            FFAirlineCode: null,
            FFNumber: "",
            GSTCompanyAddress: adminBooking?.data?.userDetails?.companyAddress,
            GSTCompanyContactNumber: "+91 9949269044",
            GSTCompanyName: adminBooking?.data?.userDetails?.companyName,
            GSTNumber: adminBooking?.data?.userDetails?.GSTNo,
            GSTCompanyEmail: "support@tripbizz.com",
          };
        });
        const formattedData = {
          TraceId: flightData?.traceId,
          ResultIndex: data.resultIndex,
          Passengers: formattedPassengers,
        };

        const res = await actions.bookFlightFromAdmin(formattedData);

        if (res.Response.Error.ErrorCode === 0) {
          try {
            await db
              .collection("Accounts")
              .doc(adminBooking?.data?.userDetails?.userid)
              .collection("trips")
              .doc(adminBooking?.data?.tripId)
              .collection("flights")
              .doc(id)
              .update({ "0.HoldResponce": res.Response, "0.isHolded": true });
            // ticketIssue(data, id);
            await actions.getAdminTripById(
              adminTripid,
              adminBooking.data.userDetails.userid
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await db
              .collection("Accounts")
              .doc(adminBooking?.data?.userDetails?.userid)
              .collection("trips")
              .doc(adminBooking?.data?.tripId)
              .collection("flights")
              .doc(id)
              .update({ "0.HoldResponce": res.Response });
            await actions.getAdminTripById(
              adminTripid,
              adminBooking.data.userDetails.userid
            );
          } catch (error) {
            console.log(error);
          }
        }
        setOpenUpload(true);
        setHoldStatus(false);
      } catch (error) {
        console.log(error);
        setHoldStatus(false);
      }
    }
  };

  const issuingTicketFornonLcc = async (bookingFlightData, id) => {
    try {
      // setTicketnonLccStatus(true);
      const data = {
        TraceId: flightData?.traceId,
        PNR: bookingFlightData.HoldResponce.Response.PNR,
        BookingId: bookingFlightData.HoldResponce.Response.BookingId,
      };
      const res = await actions.issueTicketFromForNonLccAdmin(data);
      if (res.Responce.Error.ErrorCode === 0) {
        await db
          .collection("Accounts")
          .doc(adminBooking?.data?.userDetails?.userid)
          .collection("trips")
          .doc(adminBooking?.data?.tripId)
          .collection("flights")
          .doc(id)
          .update({
            "0.TicketResponce": res.Response,
          });
        await actions.getAdminTripById(
          adminTripid,
          adminBooking.data.userDetails.userid
        );
      }
      // setTicketnonLccStatus(false);
    } catch (error) {
      console.log(error);
      // setTicketnonLccStatus(false);
    }
  };
  const issuingTicketForLcc = async (data, id) => {
    if (data.flight.IsLCC) {
      try {
        //   Origin:
        //   flightBooking?.flight?.Segments?.flat(1)?.[0]?.Origin?.Airport
        //     ?.AirportCode,
        // Destination:
        //   flightBooking?.flight?.Segments?.flat(1)?.[flightBooking?.flight?.Segments?.flat(1)?.length-1]?.Destination
        //     ?.Airport?.AirportCode,
        let staticBaggage = {
          WayType: 0,
          Code: "No Baggage",
          Description: 0,
          Weight: 0,
          Currency: "",
          Price: 0,
          Origin: "",
          Destination: "",
        };

        let staticMeal = {
          WayType: 0,
          Code: "No Meal",
          Description: 0,
          AirlineDescription: "",
          Quantity: 0,
          Currency: "",
          Price: 0,
          Origin: "",
          Destination: "",
        };

        setTicketLccStatus(true);
        const passengers = adminBooking?.data?.travellerDetails[id]?.adults;
        const formattedPassengers = passengers?.map((passenger, index) => {
          let genderCode;
          switch (passenger.gender) {
            case "Mr":
              genderCode = 1;
              break;
            case "Ms":
              genderCode = 2;
              break;
            case "Mrs":
              genderCode = 3;
              break;
            default:
              genderCode = 1;
          }
          return {
            Title: passenger.gender,
            FirstName: passenger.firstName,
            LastName: passenger.lastName,
            PaxType: 1,
            DateOfBirth: passenger.birthDate,
            Gender: genderCode,
            PassportNo: "",
            PassportExpiry: "",
            AddressLine1: adminBooking?.data?.userDetails?.companyAddress,
            AddressLine2: "",
            Fare: isPriceChangedLcc
              ? newLccFare
              : {
                  BaseFare: data.flight.Fare.BaseFare,
                  Tax: data.flight.Fare.Tax,
                  YQTax: data.flight.Fare.YQTax,
                  AdditionalTxnFeePub: data.flight.Fare.AdditionalTxnFeePub,
                  AdditionalTxnFeeOfrd: data.flight.Fare.AdditionalTxnFeeOfrd,
                  OtherCharges: data.flight.Fare.OtherCharges,
                },
            //               Baggage: data.userSelectedBaggage?.[index]
            // || data.baggageData?.[0]?.[index]
            // || staticBaggage,

            Baggage: staticBaggage,
            MealDynamic: staticMeal,
            SeatDynamic: data.seats
              .flat()
              .map((seatObj) => Object.values(seatObj)[index]),
            City: "Hyderabad",
            CountryCode: "IN",
            CountryName: "India",
            CellCountryCode: "+91",
            ContactNo: passenger.mobileNumber,
            Nationality: "IN",
            Email: "support@tripbizz.com",
            IsLeadPax: index === 0,
            GSTCompanyAddress: adminBooking?.data?.userDetails?.companyAddress,
            GSTCompanyContactNumber: "+91 9949269044",
            GSTCompanyName: adminBooking?.data?.userDetails?.companyName,
            GSTNumber: adminBooking?.data?.userDetails?.GSTNo,
            GSTCompanyEmail: "support@tripbizz.com",
          };
        });

        const formattedData = {
          TraceId: flightData?.traceId,
          ResultIndex: data.resultIndex,
          Passengers: formattedPassengers,
          IsPriceChangeAccepted: true,
        };
        const res = await actions.issueTicketForLccFlightsFromAdmin(
          formattedData
        );
        if (res.Response.Error.ErrorCode === 0) {
          await db
            .collection("Accounts")
            .doc(adminBooking?.data?.userDetails?.userid)
            .collection("trips")
            .doc(adminBooking?.data?.tripId)
            .collection("flights")
            .doc(id)
            .update({
              "0.TicketResponce": res.Response,
            });
          await actions.getAdminTripById(
            adminTripid,
            adminBooking.data.userDetails.userid
          );
        }
        setTicketLccStatus(false);
      } catch (error) {
        console.log(error);
        setTicketLccStatus(false);
      }
    }
  };

  const ticketIssue = async (data, id) => {
    if (data.flight.IsLCC) {
      try {
        // setTicketStatus(true);
        const passengers = adminBooking?.data?.travellerDetails[id]?.adults;
        const formattedPassengers = passengers?.map((passenger, index) => {
          let genderCode;
          switch (passenger.gender) {
            case "Mr":
              genderCode = 1;
              break;
            case "Ms":
              genderCode = 2;
              break;
            case "Mrs":
              genderCode = 3;
              break;
            default:
              genderCode = 1;
          }

          return {
            Title: passenger.gender,
            FirstName: passenger.firstName,
            LastName: passenger.lastName,
            PaxType: 1,
            DateOfBirth: passenger.birthDate,
            Gender: genderCode,
            PassportNo: "",
            PassportExpiry: "",
            AddressLine1: adminBooking?.data?.userDetails?.companyAddress,
            AddressLine2: "",
            Fare: {
              BaseFare: data.flight.Fare.BaseFare,
              Tax: data.flight.Fare.Tax,
              YQTax: data.flight.Fare.YQTax,
              AdditionalTxnFeePub: data.flight.Fare.AdditionalTxnFeePub,
              AdditionalTxnFeeOfrd: data.flight.Fare.AdditionalTxnFeeOfrd,
              OtherCharges: data.flight.Fare.OtherCharges,
            },
            Baggage: data.userSelectedBaggage[index],
            MealDynamic: data.userSelectedMeal[index],
            SeatDynamic: data.seats
              .flat()
              .map((seatObj) => Object.values(seatObj)[index]),
            City: "Hyderabad",
            CountryCode: "IN",
            CountryName: "India",
            CellCountryCode: "+91",
            ContactNo: passenger.mobileNumber,
            Nationality: "IN",
            Email: "support@tripbizz.com",
            IsLeadPax: index === 0,
            GSTCompanyAddress: adminBooking?.data?.userDetails?.companyAddress,
            GSTCompanyContactNumber: "+91 9949269044",
            GSTCompanyName: adminBooking?.data?.userDetails?.companyName,
            GSTNumber: adminBooking?.data?.userDetails?.GSTNo,
            GSTCompanyEmail: "support@tripbizz.com",
          };
        });
        console.log(formattedPassengers);
        const formattedData = {
          TraceId: flightData?.traceId,
          ResultIndex: data.resultIndex,
          Passengers: formattedPassengers,
        };
        const res = await actions.issueTicketFromAdmin(formattedData);

        await db
          .collection("Accounts")
          .doc(adminBooking?.data?.userDetails?.userid)
          .collection("trips")
          .doc(adminBooking?.data?.tripId)
          .collection("flights")
          .doc(id)
          .update({
            "0.TicketResponce": res.Response,
          });
        await actions.getAdminTripById(
          adminTripid,
          adminBooking.data.userDetails.userid
        );
        // setTicketStatus(false);
      } catch (error) {
        console.log(error);
        // setTicketStatus(false);
      }
    } else {
      const data = {
        TraceId: flightData?.traceId,
        PNR: data.HoldResponce.Response.PNR,
        BookingId: data.HoldResponce.Response.BookingId,
      };
      const res = await actions.issueTicketFromAdmin(data);
      console.log(res);
    }
  };
  const downloadFlightticket = async () => {
    setTicketLoader(true);

    const data = {
      PNR: flightBooking?.TicketResponce?.Response?.PNR,
      BookingId: flightBooking?.TicketResponce?.Response?.BookingId,
    };
    const BookingRes = await fetch(
      "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/getflightBookingDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const resData = await BookingRes.json();

    const res = await fetch(
      "https://us-central1-trav-biz.cloudfunctions.net/generateFlightTicket",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: resData,
          outputFileName: "custom.pdf", // Optional filename
        }),
      }
    );
    const blob = await res.blob();
    await actions.addBookingDocuments(
      blob,
      adminBooking.data.userDetails.userid,
      adminBooking.data.tripId,
      hotelId,
      adminBooking.id,
      "flight"
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated.pdf"; // Filename for download
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTicketLoader(false);
  };
  // .catch((error) => console.error("Error generating PDF:", error));
  // };
  useEffect(() => {
    const tripTimestamp = flightData?.flightSearchTime;
    if (tripTimestamp) {
      const tripDate = new Date(
        tripTimestamp.seconds * 1000 + tripTimestamp.nanoseconds / 1000000
      );
      const currentTime = new Date();
      const timeElapsed = Math.floor((currentTime - tripDate) / 1000);
      const totalTime = 15 * 60;
      const remainingTime = totalTime - timeElapsed;

      if (remainingTime > 0 && remainingTime !== 0) {
        setTimeLeft(remainingTime);

        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev > 0) return prev - 1;
            clearInterval(interval);
            return 0;
          });
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setTimeLeft(0);
      }
    }
  }, []);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secondsLeft
      .toString()
      .padStart(2, "0")}`;
  };

  const flightRecheck = async () => {
    setHoldStatus(true);
    const data = {
      TraceId: flightData?.traceId,
      ResultIndex: flightBooking?.resultIndex,
    };
    const recheck = await actions.getFlightUpdatedQuote(data);
    if (recheck?.Response?.IsPriceChanged) {
      setHoldStatus(false);
      setNewFare(recheck?.Response?.Results?.Fare);
      setIsPriceChanged(true);
      setNewFlightPrice(recheck?.Response?.Results?.OfferedFare);
    } else {
      setNewFare({});
      setIsPriceChanged(false);
      setNewFlightPrice(null);
      holdingFlightTicket(flightBooking, flightData?.id);
    }
  };
  const flightRecheckHold = () => {
    setNewFare({});
    setIsPriceChanged(false);
    setNewFlightPrice(null);
    holdingFlightTicket(flightBooking, flightData?.id);
  };
  const flightRecheckLcc = async () => {
    setTicketLccStatus(true);
    const data = {
      TraceId: flightData?.traceId,
      ResultIndex: flightBooking?.resultIndex,
    };
    const recheck = await actions.getFlightUpdatedQuote(data);
    if (recheck?.Response?.IsPriceChanged) {
      setTicketLccStatus(false);
      setNewLccFare(recheck?.Response?.Results?.Fare);
      setIsPriceChangedLcc(true);
      setNewLccFlightPrice(recheck?.Response?.Results?.OfferedFare);
    } else {
      setNewLccFare({});
      setIsPriceChangedLcc(false);
      setNewLccFlightPrice(null);
      issuingTicketForLcc(flightBooking, flightData?.id);
    }
  };
  const flightRecheckHoldLcc = () => {
    setNewLccFare({});
    setIsPriceChangedLcc(false);
    setNewLccFlightPrice(null);
    issuingTicketForLcc(flightBooking, flightData?.id);
  };
  const handleButtonClick = (action) => {
    if (action === "Booked") {
      setConfirmationMessage("Are you sure you want to book?");
      setActionToConfirm("Booked");
    } else if (action === "Cancelled") {
      setConfirmationMessage("Are you sure you want to cancel?");
      setActionToConfirm("Cancelled");
    }
  };
  const clearMessage = () => setConfirmationMessage("");

  const detailsList = flightArr?.[0]?.segments.map(
    (segment) =>
      `${segment.originAirportCode} to ${
        segment.destAirportCode
      } (${segment.depTimeDate.toString().slice(4, 10)})`
  );
  return (
    <>
      {/* <Popup
        condition={flightBookConformation}
        close={() => setFlightBookingConformation(false)}
      ></Popup> */}
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
                <div className="flightStopDtls-popup-card" key={`s_${s + 1}`}>
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
      <Popup
        condition={baggage}
        close={() => {
          setBaggage(false);
          setBaggageDtls({});
        }}
      >
        <div className="flightBaggage-popup-block">
          {`${
            baggageDtls.baggage
              ? `Check-In baggage: ${baggageDtls.baggage}`
              : ""
          }${baggageDtls.baggage && baggageDtls.cabinBaggage ? " | " : ""} ${
            baggageDtls.cabinBaggage
              ? `Cabin baggage: ${baggageDtls.cabinBaggage}`
              : ""
          }`}
        </div>
      </Popup>
      <Popup
        condition={cancellation}
        close={() => {
          setCancellation(false);
          setCancelDtls([]);
        }}
      >
        {cancelDtls.length === 0 ? (
          <>
            <ScaleLoader
              // css={override}
              // sizeUnit={"px"}
              size={17}
              color={"#94D2BD"}
              loading={cancelDtls.length === 0}
            />
            &nbsp;&nbsp;Loading Cancellation Data
          </>
        ) : (
          <>
            {Array.isArray(cancelDtls) ? (
              <>
                <div className="flightCancel-popup-block">
                  <div className="flightCancel-popup-tabs">
                    <div className="flightCancel-popup-tab">Journey points</div>
                    <div className="flightCancel-popup-tab">Type</div>
                    <div className="flightCancel-popup-tab">Range</div>
                    <div className="flightCancel-popup-tab">Charge</div>
                  </div>
                  <div className="flightCancel-popup-dtls">
                    {cancelDtls.map((ruleBlock, ru) => {
                      return (
                        <div
                          className="flightCancel-popup-rulesSection"
                          key={`ru_${ru + 1}`}
                        >
                          {ruleBlock.map((rule, r) => {
                            return (
                              <div
                                className="flightCancel-popup-rules"
                                key={`r__${r + 1}`}
                              >
                                <div className="flightCancel-popup-rule">
                                  {rule.JourneyPoints}
                                </div>
                                <div className="flightCancel-popup-rule">
                                  {ruleType[rule.Type]}
                                </div>
                                <div className="flightCancel-popup-rule">
                                  {rule.To === null ||
                                  rule.From === null ||
                                  rule.Unit === null
                                    ? "-"
                                    : rule.To === ""
                                    ? `> ${rule.From} ${rule.Unit} from departure`
                                    : rule.From === "0"
                                    ? `0 - ${rule.To} ${rule.Unit} from departure`
                                    : ` ${rule.To} - ${rule.From} ${rule.Unit} from departure`}
                                </div>
                                <div className="flightCancel-popup-rule">
                                  {rule.Details}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ height: "80vh", overflow: "scroll" }}>
                <div dangerouslySetInnerHTML={{ __html: cancelDtls }} />
              </div>
            )}
          </>
        )}
      </Popup>
      <Popup condition={openUpload} close={() => setOpenUpload(false)}>
        <div className="flex items-center w-[70%] m-auto justify-center ">
          <p
            onClick={() => setBookingStyle("Manual")}
            className={
              bookingStyle === "Manual"
                ? "bg-black text-white px-3 py-1 rounded-tl-md rounded-bl-md cursor-pointer border-[1px] border-solid border-black"
                : "px-3 py-1 cursor-pointer border-[1px] border-solid border-black rounded-tl-md rounded-bl-md"
            }
          >
            Manual Booking
          </p>
          {/* <p
            onClick={() => setBookingStyle("Api")}
            className={
              bookingStyle === "Api"
                ? "bg-black text-white px-3 py-1 rounded-tr-md rounded-br-md cursor-pointer border-[1px] border-solid border-black"
                : "px-3 py-1 cursor-pointer border-[1px] border-solid border-black rounded-tr-md rounded-br-md"
            }
          >
            Book through api
          </p> */}
        </div>
        {bookingStyle === "Manual" && (
          <div className="admin-upload">
            <FlightPriceCard
              flightBooking={flightBooking}
              fareData={mainfare}
              tripsPage={adminPage}
            />
            <div className="admin-upload-popup">
              <div>
                <span>Add ticket cost:</span>
                <input
                  type="text"
                  placeholder="Enter Ticket Cost"
                  value={ticketCost}
                  onChange={(e) => setTicketCost(e.target.value)}
                />
              </div>
              <div>
                <span>Add a Note:</span>
                <textarea
                  type="text"
                  placeholder="Add note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="admin-upload-file">
                <div>
                  <span>Upload the file:</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      handleFileChange(e);
                    }}
                  />
                </div>
                {flightData?.downloadURL ? (
                  <div className="flight-file">
                    <div onClick={handleAdminDownload}>
                      <FontAwesomeIcon
                        icon={faDownload}
                        onClick={downloadDoc}
                      />
                      `{downloadName?.slice(0, 40)}...`
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="adminPage-main-statusSave">
                <div className="adminPage-main-status">
                  <div className="adminPage-main-status-text">Status</div>
                  <div className="adminPage-status-btn">
                    {/* <select
                      onChange={async (e) => {
                        console.log(e.target.value);
                        await setStatus(e.target.value);
                      }}
                    >
                      <option>
                        {
                          statuses.filter(
                            (status1) => status1?.status === flightData?.status
                          )?.[0]?.status
                        }
                      </option>
                      {statuses
                        .filter(
                          (status1) => status1.status !== flightData?.status
                        )
                        .map((status1) => (
                          <option value={status1?.status} key={status1?.status}>
                            {status1?.status}
                          </option>
                        ))}
                    </select> */}
                    <button onClick={() => handleButtonClick("Cancelled")}>
                      Cancel
                    </button>
                    <button onClick={() => handleButtonClick("Booked")}>
                      Book
                    </button>
                  </div>
                </div>
              </div>
              {confirmationMessage && (
                <div className="confirmation-message">
                  <p>{confirmationMessage}</p>
                  {loading ? (
                    <button className="spin">
                      <div className="spinner"></div>
                    </button>
                  ) : (
                    <button
                      disabled={
                        flightData?.status === "Booked" ||
                        flightData?.status === "Cancelled"
                      }
                      onClick={async () => {
                        setLoading(true);
                        const price = Math.ceil(
                          flightBooking?.totalFare +
                            flightBooking?.gstInFinalserviceCharge +
                            flightBooking?.finalFlightServiceCharge
                        );
                        if (actionToConfirm === "Booked") {
                          actions.addInvoices(
                            adminTripDetails?.data?.userDetails?.userid,
                            adminTripDetails?.data?.tripId,
                            hotelId,
                            price,
                            "flights",
                            detailsList.join(","),
                            flightBooking?.gstInFinalserviceCharge,
                            flightBooking?.finalFlightServiceCharge,
                            flightBooking?.totalFare
                          );
                        }
                        if (actionToConfirm !== flightData?.status) {
                          await handleClick(flightData?.id, actionToConfirm);
                        }
                        if (file) {
                          await handleFileSubmit();
                        }
                        if (ticketCost.length > 0) {
                          await addTicketCost();
                        }
                        if (note.length > 0) {
                          await addNote();
                        }
                        generateBookingId(
                          "flight",
                          adminTripid,
                          adminBooking.data.userDetails.userid,
                          flightBooking?.totalFare,
                          adminTripDetails?.data?.userDetails?.email,
                          "Manual"
                        );
                        await actions.getAdminTripById(
                          adminTripid,
                          adminBooking.data.userDetails.userid
                        );
                        setLoading(false);
                      }}
                    >
                      Yes
                    </button>
                  )}
                  <button onClick={clearMessage}>No</button>
                </div>
              )}
              {/* {loading ? (
                <button className="spin">
                  <div className="spinner"></div>
                </button>
              ) : (
                <> */}
              {/* {flightData?.status !== "Booked" &&
                    flightData?.status !== "Cancelled" && (
                      <button
                        disabled={
                          flightData?.status === "Booked" ||
                          flightData?.status === "Cancelled"
                        }
                        onClick={async () => {
                          setLoading(true);
                          const price = Math.ceil(
                            flightBooking?.totalFare +
                              flightBooking?.gstInFinalserviceCharge +
                              flightBooking?.finalFlightServiceCharge
                          );
                          if (status === "Booked") {
                            actions.addInvoices(
                              adminTripDetails?.data?.userDetails?.userid,
                              adminTripDetails?.data?.tripId,
                              hotelId,
                              price,
                              "Flight",
                              detailsList.join(",")
                            );
                          }
                          if (status !== flightData?.status) {
                            await handleClick(flightData?.id, status);
                          }
                          if (file) {
                            await handleFileSubmit();
                          }
                          if (ticketCost.length > 0) {
                            await addTicketCost();
                          }
                          if (note.length > 0) {
                            await addNote();
                          }
                          await actions.getAdminTripById(
                            adminTripid,
                            adminBooking.data.userDetails.userid
                          );
                          setLoading(false);
                        }}
                      >
                        Save Details
                      </button>
                    )} */}
              {/* </> */}
              {/* )} */}
            </div>
          </div>
        )}
        {bookingStyle === "Api" && (
          <div className="overflow-scroll w-[100%] h-[60vh]">
            {flightBooking?.TicketResponce ? (
              <>
                {/* <p className="font-semibold py-3">Flight Booking Successfull</p> */}
                <div className="w-[100%]">
                  <FlightCard
                    airlinelogos={airlinelogos}
                    flightArr={flightArr}
                    flightData={{ data: flightBooking }}
                  />
                </div>
                <div className="traveller-details-container !h-auto !w-[60%] !m-auto">
                  <div className="traveller-details-header !text-center">
                    Traveller Details
                  </div>
                  {adminBooking?.data?.travellerDetails ? (
                    <>
                      {adminBooking?.data?.travellerDetails?.[
                        flightData?.id
                      ]?.adults?.map((trav, i) => {
                        return (
                          <TravDetails
                            type="Adults"
                            index={i + 1}
                            trav={trav}
                            key={i + 1}
                          />
                        );
                      })}
                    </>
                  ) : null}
                </div>
                <div className="flex gap-4 items-center justify-center my-3">
                  <p className=" font-bold">Flight Booking Successfull</p>
                  <div className="flex items-center gap-3 ">
                    {ticketLoader ? (
                      <ImSpinner2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <button
                          onClick={downloadFlightticket}
                          className="bg-black text-white rounded-md py-1 px-3"
                        >
                          Download Ticket
                        </button>
                      </>
                    )}
                    <button
                      className="bg-black text-white rounded-lg px-2 py-1"
                      onClick={async () => {
                        const price = Math.ceil(
                          flightBooking?.totalFare +
                            flightBooking?.gstInFinalserviceCharge +
                            flightBooking?.finalFlightServiceCharge
                        );
                        actions.addInvoices(
                          adminTripDetails?.data?.userDetails?.userid,
                          adminTripDetails?.data?.tripId,
                          hotelId,
                          price,
                          "flights",
                          detailsList.join(","),
                          flightBooking?.gstInFinalserviceCharge
                        );
                        await actions.editTripStatus(
                          adminBooking.data.userDetails.userid,
                          adminBooking.data.tripId,
                          adminBooking.id,
                          "Booked",
                          hotelId,
                          "flight"
                        );
                        var data = [flightBooking].map((book, b) => {
                          return (
                            book.flightNew.segments[0].originAirportCode +
                            "to" +
                            book.flightNew.segments[0].destAirportCode
                          );
                        });
                        var bookingFlight = adminBooking?.flights?.filter(
                          (flight) => {
                            return flight.id === hotelId;
                          }
                        );
                        console.log(
                          bookingFlight.downloadURL,
                          adminBooking?.data?.userDetails?.firstName
                        );
                        await actions.sendBookingStatusEmail({
                          id: adminBooking?.data?.userDetails?.userid,
                          name: adminBooking?.data?.userDetails?.firstName,
                          email: adminBooking?.data?.userDetails?.email,
                          fileUrl: bookingFlight.downloadURL,
                          tripName: adminBooking?.data?.tripName,
                          typeName: data,
                          type: "Flight",
                          booking: bookingFlight,
                          travellerDetails: adminBooking.data.travellerDetails,
                        });
                        setOpenUpload(false);
                        await actions.getAdminTripById(
                          adminTripid,
                          adminBooking.data.userDetails.userid
                        );
                      }}
                    >
                      Mark as Booked
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p style={{ alignSelf: "end", color: "red" }}>
                  remaining :{" "}
                  <span style={{ color: "black" }}>
                    {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
                  </span>
                </p>
                <div style={{ width: "100%" }}>
                  {flightBooking?.HoldResponce?.Error?.ErrorCode !== 0 && (
                    <>
                      <div>
                        {flightBooking?.HoldResponce?.Error?.ErrorCode === 0 ? (
                          <p className="font-bold text-lg text-center">
                            Flight Hold successfull
                          </p>
                        ) : (
                          <p className="font-bold text-lg text-center">
                            {flightBooking?.HoldResponce?.Error?.ErrorMessage}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  {flightBooking?.HoldResponce?.Error?.ErrorCode === 0 && (
                    <>
                      <div>
                        {flightBooking?.HoldResponce?.Error?.ErrorCode === 0 ? (
                          <p className="font-bold text-lg text-center">
                            Flight Hold successfull
                          </p>
                        ) : (
                          <p className="font-bold text-lg text-center">
                            {flightBooking?.HoldResponce?.Error?.ErrorMessage}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  <FlightCard
                    airlinelogos={airlinelogos}
                    flightArr={flightArr}
                    flightData={{ data: flightBooking }}
                  />
                  <div className="traveller-details-container !h-auto !w-[70%] !m-auto">
                    <div className="traveller-details-header !text-center">
                      Traveller Details
                    </div>
                    {adminBooking?.data?.travellerDetails ? (
                      <>
                        {adminBooking?.data?.travellerDetails?.[
                          flightData?.id
                        ]?.adults?.map((trav, i) => {
                          return (
                            <TravDetails
                              type="Adults"
                              index={i + 1}
                              trav={trav}
                              key={i + 1}
                            />
                          );
                        })}
                      </>
                    ) : null}
                  </div>
                </div>
                {isPriceChanged && (
                  <div>
                    <p>Flight Price Changed </p>
                    <ul>
                      <li>
                        Old Price :
                        {
                          // adminTripDetails?.flights?.[0]?.data?.[0]?.flight?.Fare
                          //   .OfferedFare
                          flightBooking.flightNew.fare
                        }
                      </li>
                      <li>New Price :{newFlightPrice}</li>
                    </ul>
                  </div>
                )}
                {isPriceChangedLcc && (
                  <div>
                    <p>Flight Price Changed </p>
                    <ul>
                      <li>Old Price :{flightBooking.flightNew.fare}</li>
                      <li>New Price :{newLccFlightPrice}</li>
                    </ul>
                  </div>
                )}
                {timeLeft !== 0 ? (
                  <>
                    {flightBooking?.flight?.IsLCC ? (
                      <div className="flex items-center gap-2 justify-center my-2">
                        {!lccConformation && (
                          <button
                            // onClick={
                            //   isPriceChangedLcc
                            //     ? flightRecheckHoldLcc
                            //     : flightRecheckLcc
                            // }
                            // onClick={() => {
                            //   setOpenUpload(false)
                            //   setFlightBookingConformation(true)}}
                            onClick={() => setLccConformation(true)}
                            // onClick={downloadFlightticket}
                            className="bg-black text-white rounded-md py-1 px-3"
                          >
                            {ticketLccStatus ? (
                              <ImSpinner2 className="animate-spin" size={18} />
                            ) : isPriceChangedLcc ? (
                              "Continue"
                            ) : (
                              "Book"
                            )}
                          </button>
                        )}
                        {isPriceChangedLcc && (
                          <button
                            className="bg-black text-white rounded-md py-1 px-3"
                            onClick={() => setOpenUpload(false)}
                          >
                            close
                          </button>
                        )}

                        {/* {lccConformation && (
                          <button
                            // onClick={() => {
                            //   issuingTicketFornonLcc(
                            //     flightBooking,
                            //     flightData?.id
                            //   );
                            // }}
                            onClick={() => setLccConformation(true)}
                            className="bg-black text-white rounded-md py-1 px-3"
                          >
                            Book
                          </button>
                        )} */}
                        <>
                          {lccConformation && (
                            <div>
                              <p>Are you sure you want to book the flight?</p>
                              <p>
                                An amount of Rs.{flightBooking.flightNew.fare}{" "}
                                Amount will be debited from your wallet.
                              </p>
                              <div className="flex gap-2 justify-center my-3">
                                <button
                                  onClick={
                                    isPriceChangedLcc
                                      ? flightRecheckHoldLcc
                                      : flightRecheckLcc
                                  }
                                  className="bg-black text-white rounded-md py-1 px-3"
                                >
                                  Book Ticket
                                </button>
                                <button
                                  className="border-[1px] border-solid text-black rounded-md py-1 px-3"
                                  onClick={() => setLccConformation(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-center my-2">
                        {!flightBooking.isHolded ? (
                          <>
                            <button
                              onClick={
                                isPriceChanged
                                  ? flightRecheckHold
                                  : flightRecheck
                              }
                              className="bg-black text-white rounded-md py-1 px-3"
                              // disabled={
                              //   flightBooking?.HoldResponce?.Error?.ErrorCode === 0
                              // }
                            >
                              {holdStatus ? (
                                <ImSpinner2
                                  className="animate-spin"
                                  size={18}
                                />
                              ) : isPriceChanged ? (
                                "Continue"
                              ) : (
                                "Hold"
                              )}
                            </button>
                            {isPriceChanged && (
                              <button
                                className="bg-black text-white rounded-md py-1 px-3"
                                onClick={() => setOpenUpload(false)}
                              >
                                close
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            {flightBookConformation ? (
                              ""
                            ) : (
                              <button
                                // onClick={() => {
                                //   issuingTicketFornonLcc(
                                //     flightBooking,
                                //     flightData?.id
                                //   );
                                // }}
                                onClick={() =>
                                  setFlightBookingConformation(true)
                                }
                                className="bg-black text-white rounded-md py-1 px-3"
                              >
                                Ticket Issue
                              </button>
                            )}
                            <>
                              {flightBookConformation && (
                                <div>
                                  <p>
                                    Are you sure you want to book the flight?
                                  </p>
                                  <p>
                                    An amount of Rs.
                                    {flightBooking.flightNew.fare} Amount will
                                    be debited from your wallet.
                                  </p>
                                  <div className="flex gap-2 justify-center my-3">
                                    <button
                                      onClick={() => {
                                        issuingTicketFornonLcc(
                                          flightBooking,
                                          flightData?.id
                                        );
                                      }}
                                      className="bg-black text-white rounded-md py-1 px-3"
                                    >
                                      Book
                                    </button>
                                    <button
                                      className="border-[1px] border-solid text-black rounded-md py-1 px-3"
                                      onClick={() =>
                                        setFlightBookingConformation(false)
                                      }
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        // bookFromAdmin(flightBooking, flightData?.id);
                      }}
                      className="bg-black text-white rounded-md py-1 px-3 block m-auto my-4"
                    >
                      RecheckFlightAgain
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}
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
                {flightBooking?.selectedBaggage.map((meal, i) => {
                  return (
                    <div key={`i__${i + 1}`}>
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
                            <span key={`i__${s + 1}`}>
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
                    </div>
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
                              <div
                                className="flightBook-cancel-details-text"
                                key={`r__${r + 1}`}
                              >
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
                              <div
                                className="flightBook-cancel-details-text"
                                key={`r__${r + 1}`}
                              >
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
            {flightBooking.selectedMeals.map((meal, m) => {
              return (
                <div key={`m__${m + 1}`}>
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
                        <span key={`s__${s + 1}`}>
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
                </div>
              );
            })}
          </>
        ) : null}
      </Popup>
      <Popup condition={tripsSeat} close={() => setTripsSeat(false)}>
        {id.length > 0 ? (
          <div className="tripsPage-flight-seat">
            Selected Seats:
            {id?.map((ids, index) => {
              return (
                <div key={`ind__${index + 1}`}>
                  Passenger-{index + 1}:&nbsp;
                  {flightBooking
                    ? flightBooking?.seats?.[0]?.length > 0
                      ? flightBooking?.seats?.[0]?.[0]?.[ids]?.Code
                      : ""
                    : ""}
                  &nbsp;
                  {index !== id.length - 1 ? "," : ""}
                </div>
              );
            })}
            {/* Selected Seat:{flightBooking ? flightBooking?.seats[0].length > 0 ? flightBooking?.seats[0][0][id[0]]?.Code : '' : ''} */}
          </div>
        ) : null}
      </Popup>
      <Popup
        condition={open}
        close={() => {
          setOpen(false);
          actions.setFlightResJType(0);
        }}
      >
        Please select onward flight first
      </Popup>
      <Popup condition={openTravellers} close={() => setOpenTravellers(false)}>
        <div className="traveller-details-container">
          <div className="traveller-details-header">Traveller Details</div>
          {adminBooking?.data?.travellerDetails ? (
            <>
              {adminFlightTrav &&
                adminFlightTrav?.map((trav, i) => {
                  return (
                    <TravDetails
                      type="Adults"
                      index={i + 1}
                      trav={trav}
                      key={`i__${i + 1}`}
                    />
                  );
                })}
            </>
          ) : null}
          {adminBooking?.data?.travellerDetails ? (
            <>
              {adminFlightChild &&
                adminFlightChild?.map((trav, i) => {
                  return (
                    <TravDetails
                      type="Children"
                      index={i + 1}
                      trav={trav}
                      key={`i__${i + 1}`}
                    />
                  );
                })}
            </>
          ) : null}
          {adminBooking?.data?.travellerDetails ? (
            <>
              {adminFlightInfant &&
                adminFlightInfant?.map((trav, i) => {
                  return (
                    <TravDetails
                      type="Infants"
                      index={i + 1}
                      trav={trav}
                      key={`i__${i + 1}`}
                    />
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
      <Popup
        condition={openFlightPrice}
        close={() => {
          setOpenFlightPrice(false);
        }}
      >
        <FlightPriceCard
          flightBooking={flightBooking}
          fareData={fareData}
          tripsPage={tripsPage}
        />
      </Popup>
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
        condition={openAdminPrice}
        close={() => {
          setOpenAdminPrice(false);
        }}
      >
        <FlightPriceCard
          flightBooking={flightBooking}
          fareData={mainfare}
          tripsPage={adminPage}
        />
      </Popup>
      <Popup
        condition={openPriceReCheck}
        close={() => {
          setOpenPriceReCheck(false);
        }}
      >
        <div className="flight-recheck">
          {tripsPage ? (
            <FlightCard
              airlinelogos={airlinelogos}
              flightArr={flightArr}
              flightData={{ data: flightBooking }}
            />
          ) : null}
          {recheckLoad ? (
            <>
              <LoadingProg
                condition={recheckLoad}
                loadingText={"Getting updated prices"}
                progEnd={recheckLoad}
                progTime={90}
              />
            </>
          ) : recheckError ? (
            <div>
              <p className="font-semibold text-center">
                Unable to get updated price for this flight.
              </p>
              <div className="recheck-confirm">
                <button
                  onClick={async () =>
                    await actions.updateFlightBookingDetails(
                      recheckSeatsAvailable
                        ? reCheckData?.flightData?.Fare?.OfferedFare
                        : Math.ceil(
                            reCheckData?.flightData?.Fare?.OfferedFare -
                              reCheckSeats
                          ),
                      // reCheckData?.flightData?.Fare?.OfferedFare,
                      flightId,
                      tripId
                    )
                  }
                >
                  Keep Flight
                </button>
                <button onClick={handleDelete} className="delete-btn">
                  Delete Flight
                </button>
              </div>
            </div>
          ) : (
            <>
              {tripsPage && (
                <div className="recheck-popup-container">
                  <div className="recheck-popup-header">
                    Flight Price Recheck
                  </div>
                  <div className="recheck-block">
                    <div className="recheck-block-header">
                      <div>Flight Details:</div>
                      <div>
                        <span>
                          {
                            flightBooking.flightNew.segments?.[0]
                              ?.originCityName
                          }{" "}
                          to{" "}
                          {flightBooking.flightNew.segments?.[0]?.destCityName}
                        </span>
                      </div>
                    </div>
                    <div className="recheck-block-rates">
                      <div className="old-price pl-[10px] pt-[10px] pb-[10px] pr-[10px]">
                        <div className="old-price-header">Old Rates</div>
                        <div className="old-price-block">
                          <div className="old-price-details">
                            <div className="old-price-details-title">
                              Flight Price:
                            </div>
                            <div className="old-price-details-value">
                              <FontAwesomeIcon
                                icon={faIndianRupeeSign}
                                className="old-price-details-title-icon"
                              />
                              {` ${
                                flightBooking.flight.Fare.OfferedFare
                                  ? Math.ceil(
                                      flightBooking.flight.Fare.OfferedFare
                                    ).toLocaleString("en-IN")
                                  : Math.ceil(
                                      flightBooking.flight.Fare.PublishedFare
                                    ).toLocaleString("en-IN")
                              }`}
                            </div>
                          </div>
                          {fareData?.totalBaggagePrice ? (
                            <div className="old-price-details">
                              <div className="old-price-details-title">
                                Baggage :
                              </div>
                              <div className="old-price-details-value">
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="old-price-details-title-icon"
                                />
                                {` ${fareData?.totalBaggagePrice?.toLocaleString(
                                  "en-IN"
                                )}`}
                              </div>
                            </div>
                          ) : null}
                          {fareData?.totalMealPrice ? (
                            <div className="old-price-details">
                              <div className="old-price-details-title">
                                Meal:
                              </div>
                              <div className="old-price-details-value">
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="old-price-details-title-icon"
                                />
                                {` ${fareData?.totalMealPrice?.toLocaleString(
                                  "en-IN"
                                )}`}
                              </div>
                            </div>
                          ) : null}
                          {fareData?.totalSeatCharges ? (
                            <div className="old-price-details">
                              <div className="old-price-details-title">
                                Seat:
                              </div>
                              <div className="old-price-details-value">
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="old-price-details-title-icon"
                                />
                                {` ${fareData?.totalSeatCharges?.toLocaleString(
                                  "en-IN"
                                )}`}
                              </div>
                            </div>
                          ) : null}
                          {fareData?.totalBaggagePrice ? (
                            <div className="old-price-details">
                              <div className="old-price-details-title">
                                Baggage :
                              </div>
                              <div className="old-price-details-value">
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="old-price-details-title-icon"
                                />
                                {` ${fareData?.totalBaggagePrice?.toLocaleString(
                                  "en-IN"
                                )}`}
                              </div>
                            </div>
                          ) : null}
                          <div className="old-price-details">
                            <div className="old-price-details-title">
                              Service Fee and Taxes :
                            </div>
                            <div className="old-price-details-value">
                              <FontAwesomeIcon
                                icon={faIndianRupeeSign}
                                className="old-price-details-title-icon"
                              />
                              {Math.ceil(
                                (fareData?.totalFareSum * domesticFlight) / 100
                              )}
                            </div>
                          </div>
                          <div className="old-price-details">
                            <div className="old-price-details-title">
                              Total Price :
                            </div>
                            <div className="old-price-details-value">
                              <FontAwesomeIcon
                                icon={faIndianRupeeSign}
                                className="old-price-details-title-icon"
                              />
                              {Math.ceil(fareData?.finalPrice).toLocaleString(
                                "en-IN"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="old-price shadow-md border-[1px] border-solid rounded-md pl-[10px] pt-[10px] pb-[10px] pr-[10px]">
                        <div className="old-price-header">New Rates</div>
                        <div className="old-price-block">
                          <div className="old-price-details">
                            <div className="old-price-details-title">
                              Flight Price:
                            </div>
                            <div className="old-price-details-value">
                              <FontAwesomeIcon
                                icon={faIndianRupeeSign}
                                className="old-price-details-title-icon"
                              />
                              {` ${
                                reCheckData?.flightData?.Fare?.OfferedFare
                                  ? Math.ceil(
                                      reCheckData?.flightData?.Fare?.OfferedFare
                                    ).toLocaleString("en-IN")
                                  : Math.ceil(
                                      reCheckData?.flightData?.Fare
                                        ?.PublishedFare
                                    ).toLocaleString("en-IN")
                              }`}
                            </div>
                          </div>
                          {fareData?.totalBaggagePrice ? (
                            <div className="old-price-details">
                              <div className="old-price-details-title">
                                Baggage :
                              </div>
                              <div className="old-price-details-value">
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="old-price-details-title-icon"
                                />
                                {Math.ceil(reCheckBaggage).toLocaleString(
                                  "en-IN"
                                )}
                              </div>
                            </div>
                          ) : null}
                          {fareData?.totalMealPrice ? (
                            <div className="old-price-details">
                              <div className="old-price-details-title">
                                Meal :
                              </div>
                              <div className="old-price-details-value">
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="old-price-details-title-icon"
                                />
                                {Math.ceil(reCheckMeals).toLocaleString(
                                  "en-IN"
                                )}
                              </div>
                            </div>
                          ) : null}
                          {fareData?.totalSeatCharges ? (
                            <div className="old-price-details">
                              <div className="old-price-details-title">
                                Seat :
                              </div>
                              <div className="old-price-details-value">
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="old-price-details-title-icon"
                                />
                                {` ${
                                  recheckSeatsAvailable
                                    ? reCheckSeats?.toLocaleString("en-IN")
                                    : 0
                                  // reCheckSeats?.toLocaleString("en-IN")
                                }`}
                              </div>
                            </div>
                          ) : null}
                          <div className="old-price-details">
                            <div className="old-price-details-title">
                              Service fee and Taxes :
                            </div>
                            <div className="old-price-details-value">
                              <FontAwesomeIcon
                                icon={faIndianRupeeSign}
                                className="old-price-details-title-icon"
                              />
                              {` ${Math.ceil(
                                ((reCheckData?.flightData?.Fare?.OfferedFare +
                                  reCheckBaggage +
                                  reCheckSeats +
                                  reCheckMeals) *
                                  domesticFlight) /
                                  100
                              )?.toLocaleString("en-IN")}`}
                            </div>
                          </div>
                          <div className="old-price-details">
                            <div className="old-price-details-title">
                              Total Price:
                            </div>
                            <div className="old-price-details-value">
                              <FontAwesomeIcon
                                icon={faIndianRupeeSign}
                                className="old-price-details-title-icon"
                              />
                              {` ${Math.ceil(
                                reCheckData?.flightData?.Fare?.OfferedFare +
                                  reCheckBaggage +
                                  // reCheckSeats +
                                  (recheckSeatsAvailable ? reCheckSeats : 0) +
                                  reCheckMeals +
                                  ((reCheckData?.flightData?.Fare?.OfferedFare +
                                    reCheckBaggage +
                                    reCheckSeats +
                                    reCheckMeals) *
                                    domesticFlight) /
                                    100
                              )?.toLocaleString("en-IN")}`}
                            </div>
                          </div>
                          <div>
                            {recheckSeatsAvailable ? null : (
                              <p>
                                <span className="text-red-500">Note:</span>
                                Selected seats are not available.To book flight
                                with seats,
                                <br /> please delete the flight and add to trip
                                again.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="recheck-confirm">
                      <button
                        onClick={async () =>
                          await actions.updateFlightBookingDetails(
                            recheckSeatsAvailable
                              ? reCheckData?.flightData?.Fare?.OfferedFare
                              : Math.ceil(
                                  reCheckData?.flightData?.Fare?.OfferedFare -
                                    reCheckSeats
                                ),
                            // reCheckData?.flightData?.Fare?.OfferedFare,
                            flightId,
                            tripId
                          )
                        }
                      >
                        Keep Flight
                      </button>
                      <button onClick={handleDelete} className="delete-btn">
                        Delete Flight
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Popup>
      <Popup
        condition={openAdminFareRules}
        close={() => setOpenAdminFareRules(false)}
      >
        {adminPage ? (
          <>
            <div className="flightBook-fareRules-section-admin-header">
              Fare Rules
            </div>
            <div className="flightBook-fareRules-section-admin">
              <div
                dangerouslySetInnerHTML={{ __html: flightBooking?.fareRules }}
              />
            </div>
          </>
        ) : null}
      </Popup>
      <Popup condition={addTravellers} close={() => setAddTravellers(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-[100%]">
          {Array.from({ length: parseInt(flight?.data?.adults) }, (_, i) => {
            return (
              <div key={`adult-${i}`} className="gap-[10px] mt-[20px]">
                <h1 className="font-bold text-center py-1">Adult-{i + 1}</h1>
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
                    {/* <label className="flex flex-col text-[12px]">
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
                    </label> */}

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
          })}
          {Array.from({ length: parseInt(flight?.data?.child) }, (_, i) => {
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
          ))}
          <div className="flex gap-2 justify-center items-center mt-3">
            {flightStatus?.status === "Not Submitted" ? (
              <>
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
              </>
            ) : null}
          </div>
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
              <div key={`i__${sg + 1}`}>
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
                    // bookingPage &&
                    //   flightArr[0].segments.length > 1 &&
                    //   segIndex === sg
                    false
                      ? "flightResults-list-flightCard-segment-section flightResults-list-flightCard-segment-section-selected"
                      : "flightResults-list-flightCard-segment-section"
                  }
                  // onClick={
                  //   bookingPage && flightArr[0].segments.length > 1
                  //     ? () => setSegIndex(sg)
                  //     : null
                  // }
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
                        {/* {segment.stopOverPts.map((stopPt, sp) => {
                        if (
                          sp === 0 ||
                          (sp > 0 && segment.stopOverPts[sp - 1].charNum <= 12)
                        ) {
                          if (stopPt.charNum > 12) {
                            return (
                              <div className="flightResult-list-flightCard-duration-stopPt">
                                {stopPt.cityName.slice(
                                  0,
                                  stopPt.cityName.length - (stopPt.charNum - 12)
                                ) + " ..."}
                              </div>
                            );
                          } else if (stopPt.charNum <= 12) {
                            return (
                              <div className="flightResult-list-flightCard-duration-stopPt">
                                {`${stopPt.cityName}${
                                  segment.stopOverPts.length > 1 ? "," : ""
                                }`}
                              </div>
                            );
                          }
                        }
                        return "";
                      })} */}
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
              </div>
            );
          })}
        </div>

        <div className="flightResults-list-flightCard-header">
          {/* <div className="flightResults-list-flightCard-airline">
            {`${airlineName}`}
            <span>({flightCode})</span>
          </div> */}

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
                    // console.log(flightArr[index].resultIndex);
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
                        //actions.fetchFareRule(flightArr[0].resultIndex, "Indigo", 600)
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
              {/* {bookingPage && tripsPage ? (
                  <div className="flightResults-list-flightCard-depDate-block">
                    <div className="flightResults-list-flightCard-depDate">
                      {flightArr[0].segments[0].depTimeDate.toString().slice(4, 10)}
                    </div>
                  </div>
                ) : null} */}
            </>
          )}
        </div>
        <div className="flightBooking-admin-details">
          {adminPage ? (
            <>
              <div className="flightBooking-admin-details-card">
                <div className="flightBooking-admin-details-header">
                  Baggage
                </div>
                {Array.isArray(fData?.baggagePrice) ? (
                  <>
                    {fData?.baggageDtls?.cabinBaggage ? (
                      <div className="flightBook-baggageMeals-bag-detail">
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="flightBook-baggageMeals-bag-detail-icon"
                        />
                        Cabin baggage:
                        <span>{fData?.baggageDtls?.cabinBaggage}</span>
                      </div>
                    ) : null}
                    {fData?.baggageDtls?.baggage ? (
                      <div className="flightBook-baggageMeals-bag-detail">
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="flightBook-baggageMeals-bag-detail-icon"
                        />
                        Check-in baggage:
                        <span>{fData?.baggageDtls?.baggage}&nbsp;KG</span>
                      </div>
                    ) : null}
                    {Array.isArray(fData?.selectedBaggage) ? (
                      <>
                        {fData?.selectedBaggage.map((meal, m) => {
                          return (
                            <div key={`i__${m + 1}`}>
                              <div className="flightBook-meals">
                                {meal.map((meals, i) => {
                                  return (
                                    <span key={`i__${i + 1}`}>
                                      {meals.price > 0 ? (
                                        <>
                                          Passenger-{i + 1}:{meals.baggage}{" "}
                                          -&gt;{meals.price}
                                        </>
                                      ) : null}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : null}
                  </>
                ) : null}
              </div>
              <div className="flightBooking-admin-details-card">
                <div className="flightBooking-admin-details-header">
                  Selected Seats
                </div>
                {adminId.length > 0 ? (
                  <div className="tripsPage-flight-seat">
                    {adminId?.map((ids, index) => {
                      return (
                        <div key={`i__${index + 1}`}>
                          Passenger-{index + 1}&nbsp;
                          {fData
                            ? fData?.seats?.[0]?.length > 0
                              ? fData?.seats?.[0]?.[0]?.[ids]?.Code
                              : ""
                            : ""}
                          &nbsp;
                          {index !== adminId.length - 1 ? "," : ""}
                        </div>
                      );
                    })}
                    {/* Selected Seat:{flightBooking ? flightBooking?.seats[0].length > 0 ? flightBooking?.seats[0][0][id[0]]?.Code : '' : ''} */}
                  </div>
                ) : (
                  <div>No Seats Selected</div>
                )}
              </div>
              <div className="flightBooking-admin-details-card">
                <div className="flightBooking-admin-details-header">
                  Selected Meal
                </div>
                {Array.isArray(fData?.selectedMeals) ? (
                  <>
                    {fData?.selectedMeals.map((meal, m) => {
                      return (
                        <div key={`i__${m + 1}`}>
                          <div className="flightBook-meals">
                            {meal.map((meals, i) => {
                              return (
                                <span key={`i__${i + 1}`}>
                                  {meals.price > 0 ? (
                                    <>
                                      Passenger-{i + 1}:{meals.mealDesc} -&gt;
                                      {meals.price}
                                    </>
                                  ) : null}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : null}
              </div>
            </>
          ) : null}
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
            {userPage ? null : (
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
                          // setReCheckLoading(true);
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
                          // setReCheckLoading(false);
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
            )}
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
                        userPage
                          ? adminTripdata?.data?.name
                          : tripData.data?.name
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
                          userAccountDetails={userAccountDetails}
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
          </>
        ) : null}
        {flightArr.length > 1 && !tripsPage ? (
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
                  key={`i__${f + 1}`}
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

                      {!bookingPage ? (
                        <div className="flightResults-list-flightCard-book">
                          <button
                            onClick={() => {
                              console.log(flightArr[f].resultIndex);
                              if (flightResJType === 1 && !bookingFlight) {
                                setOpen(true);
                                return;
                              } else {
                                //actions.fetchFareRule(flightArr[0].resultIndex, "Indigo", 600)
                                actions.fetchFlightBookData(
                                  flightArr[f].resultIndex,
                                  flightGrp[f],
                                  {
                                    baggage:
                                      flightArr[f].segments?.[0]?.baggage,
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
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        {adminPage ? (
          <>
            <div className="flightBooking-admin">
              <div className="request-status">
                Approval Status:
                <span
                  style={{
                    background: reqColor?.[0]
                      ? reqColor?.[0]?.color
                      : "#808080",
                  }}
                >
                  {flightData?.requestStatus}
                </span>
              </div>
              <div className="hotelType">
                <div className="hotelStatus">
                  Booking Status:
                  <span
                    style={{
                      background: adColor?.[0]
                        ? adColor?.[0]?.color
                        : "#808080",
                    }}
                  >
                    {flightData.status}
                  </span>
                </div>
              </div>
              <div className="flightResults-list-flightCard-price">
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="flightResults-list-flightCard-price-icon"
                />
                {`${Math.ceil(
                  flightBooking.totalFare +
                    flightBooking.finalFlightServiceCharge +
                    flightBooking.gstInFinalserviceCharge
                )}`}
                &nbsp;
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  onClick={() => setOpenAdminPrice(true)}
                  className="info-icon"
                />
              </div>
            </div>
            <div className="seperate"></div>
            <div className="flightBooking-admin-upload">
              {flightData.downloadURL ? (
                <div className="flight-file">
                  <div onClick={handleAdminDownload}>
                    <FontAwesomeIcon icon={faDownload} onClick={downloadDoc} />`
                    {downloadName?.slice(0, 14)}...`
                  </div>
                </div>
              ) : null}
              {flightData.ticketCost ? (
                <div className="flight-ticket-cost">
                  Ticket Cost:{" "}
                  <span>
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelInfo-roomDtls-room-price-icon"
                    />{" "}
                    {flightData.ticketCost}
                  </span>
                </div>
              ) : null}
              {flightData.note ? (
                <div className="flight-ticket-cost">
                  Note: {flightData.note}
                </div>
              ) : null}
              {flightData?.note ||
              flightData?.ticketCost ||
              flightData?.downloadURL ? (
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="upload-icon"
                  onClick={() => {
                    setOpenUpload(true);
                    // setStatus(flightData.status);
                    setNote(flightData.note ? flightData.note : "");
                    setTicketCost(
                      flightData.ticketCost ? flightData.ticketCost : ""
                    );
                    setHotelId(flightData.id);
                  }}
                />
              ) : null}
            </div>
            {flightData?.note ||
            flightData?.ticketCost ||
            flightData?.downloadURL ? (
              <div className="seperate"></div>
            ) : null}

            <div className="flightBooking-admin">
              {flightData.status !== "Booked" && (
                <div
                  className="hotel-card-upload"
                  onClick={() => {
                    setOpenUpload(true);
                    setHotelId(flightData?.id);
                  }}
                >
                  <FontAwesomeIcon icon={faUpload} />
                  &nbsp; Booking
                </div>
              )}
              <div className="hotel-travellers">
                <button
                  onClick={() => {
                    setOpenTravellers(true);
                    setNewFlightid(flightData?.id);
                    //setTripId(hotel.id)
                  }}
                >
                  Traveller Details
                </button>
              </div>
              <div className="hotel-travellers">
                <button
                  onClick={() => {
                    setOpenAdminFareRules(true);
                    //setTripId(hotel.id)
                  }}
                >
                  Fare Rules
                </button>
              </div>
            </div>
          </>
        ) : null}
        {userPage && (
          <>
            <div className="hotel-travellers">
              <button
                onClick={() => {
                  setOpenTravellers(true);
                  setNewFlightid(flightData?.id);
                  console.log(flightData);
                  //setTripId(hotel.id)
                }}
              >
                Traveller Details
              </button>
            </div>
          </>
        )}
        {flightStatus?.note && (
          <p className="ml-[10pt] text-[10pt]">Note:{flightStatus?.note}</p>
        )}
      </div>
    </>
  );
}

export default Flight;
