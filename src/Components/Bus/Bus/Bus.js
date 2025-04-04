import React, { useCallback, useContext, useEffect, useState } from "react";
import "./Bus.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TbBusStop } from "react-icons/tb";
import {
  faCircleInfo,
  faDownload,
  faIndianRupee,
  faIndianRupeeSign,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import Popup from "../../Popup";
import MyContext from "../../Context";
import TravDetails from "../../Trips/TripDetails/TravellerDetails";
import { FaBusAlt } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { LuAlarmClock } from "react-icons/lu";
import { add, format, parseISO } from "date-fns";
import InvoicePdf1 from "../../InvoicePdf1";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { db } from "../../MyProvider";
import AddingTravellerSubmit from "../AddingTravellerSubmit";
import { generateBookingId } from "../../Utilites/functions";
const Bus = (props) => {
  const { control, handleSubmit, setValue, reset } = useForm();
  const [openBusDetails, setOpenBusDetails] = useState(false);
  const [bookingStyle, setBookingStyle] = useState("Manual");
  // const [timeLeft, setTimeLeft] = useState(null);
  const {
    adminTripdata,
    bookingPage,
    bus,
    tripsPage,
    bookingBus,
    busData,
    adminPage,
    tripId,
    adminBooking,
    adminTripid,
    travellerDetails,
    selectedSeatsPrice,
    totalBus,
    OverallBus,
    userPage,
    userId,
    user,
    addedFromAdmin,
  } = props;
  const {
    actions,
    tripData,
    userAccountDetails,
    busService,
    adminTripDetails,
  } = useContext(MyContext);
  const [openDelete, setOpenDelete] = useState(false);
  var [openPriceInfo, setOpenPriceInfo] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [hotelId, setHotelId] = useState(null);
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [ticketCost, setTicketCost] = useState("");

  const [openTravellers, setOpenTravellers] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busBoardingPoint, setbusBoardingPoint] = useState(false);
  const [addTravellers, setAddTravellers] = useState(false);
  const [newtravellerDetails, setNewTravellerDetails] = useState();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [busId, setBusid] = useState();
  const [alltimeStamp, setAllTimeStamp] = useState(false);
  const [timeStampDate, setTimeStampData] = useState();
  const [busSubmitFromUser, setBussubmitFromUser] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  var statuses = [
    { status: "Submitted", color: "#ffa500" },
    // { status: "Need clarification", color: "#FFC107" },
    // { status: "Price Revision", color: "#2196F3" },
    { status: "Booked", color: "#4CAF50" },
    { status: "Cancelled", color: "#FF0000" },
    // { status: "Submitted,Payment Pending", color: "#ffa500" },
    // { status: "Booked,Payment Pending", color: "#4CAF50" },
    { status: "Not Submitted", color: "#808080" },
  ];
  var reqStatuses = [
    { status: "Approved", color: "#008000" },
    { status: "Pending", color: "#ffa500" },
    { status: "Not Requested", color: "#808080" },
  ];
  const depdate = new Date(bus?.DepartureTime);
  const depformattedDate = depdate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const arrdate = new Date(bus?.ArrivalTime);
  const arrformattedDate = arrdate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const diffInMilliseconds = arrdate - depdate;
  const totalMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedTimeDiff = `${String(hours).padStart(2, "0")}hrs${String(
    minutes
  ).padStart(2, "0")}mins`;
  var color = statuses.filter((status) => {
    return status?.status === busData?.status;
  });
  var reqColor = reqStatuses.filter((status) => {
    return status?.status === busData?.requestStatus;
  });

  var downloadDoc = async () => {
    var downloadName = busData?.downloadURL.slice(
      164,
      busData?.downloadURL.indexOf("?")
    );
    const response = await fetch(busData?.downloadURL);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  var downloadName = busData?.downloadURL?.slice(
    164,
    busData?.downloadURL.indexOf("?")
  );

  var handleAdminDownload = async () => {
    var downloadName = busData?.downloadURL?.slice(
      164,
      busData?.downloadURL.indexOf("?")
    );
    const response = await fetch(busData?.downloadURL);
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
      "bus"
    );
    var bookingBus = adminBooking?.bus?.filter((bus) => {
      return bus.id === hotelId;
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
        type: "Bus",
        booking: bookingBus,
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
      "bus"
    );
    if (!file) {
      var bookingBus = adminBooking?.bus?.filter((bus) => {
        return bus.id === hotelId;
      });
      if (statuse === "Booked" || statuse === "Booked,Payment Pending") {
        await actions.sendBookingStatusEmail({
          id: adminBooking?.data?.userDetails?.userid,
          name: adminBooking?.data?.userDetails?.firstName,
          email: adminBooking?.data?.userDetails?.email,
          fileUrl: null,
          tripName: adminBooking?.data?.tripName,
          type: "Bus",
          booking: bookingBus,
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
      "bus"
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
      "bus"
    );
    setOpenUpload(false);
  };
  var handleDelete = async () => {
    await actions.deleteTripItem(tripId, busData?.id, "bus");
    setOpenDelete(false);
  };
  const [invoiceData, setInvoiceData] = useState([]);
  // var invoiceData=[]
  useEffect(() => {
    const fetch = async () => {
      const data = await actions.getInvoiceDetails(userId, tripId);
      if (data.length > 0) {
        setInvoiceData(data);
      }
    };
    fetch();
  }, []);
  var isThere = null;
  if (invoiceData.length > 0) {
    isThere = invoiceData.find((item) => item.cardId === totalBus?.id);
  }
  useEffect(() => {
    if (newtravellerDetails) {
      setIsFormDisabled(true);
      if (newtravellerDetails.adults) {
        newtravellerDetails.adults.forEach((adults, index) => {
          setValue(`adults[${index}].gender`, adults.gender);
          setValue(`adults[${index}].firstName`, adults.firstName);
          setValue(`adults[${index}].lastName`, adults.lastName);
          setValue(`adults[${index}].birthDate`, adults.birthDate);
          if (index === 0) {
            setValue(`adults[${index}].email`, adults.email);
            setValue(`adults[${index}].mobileNumber`, adults.mobileNumber);
          }
        });
      }
    }
  }, [newtravellerDetails, setValue]);
  const onSubmit = (data) => {
    console.log(totalBus);
    const newData = { [totalBus.id]: data };
    console.log(newData);

    actions.updateTravDetails(newData, tripId);
    setAddTravellers(false);
  };
  const adminBusTrav = adminBooking?.data?.travellerDetails?.[busId]?.adults;
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
  // useEffect(() => {
  //   const tripTimestamp = busData?.busSearchTime;

  //   if (tripTimestamp) {
  //     const tripDate = new Date(
  //       tripTimestamp.seconds * 1000 + tripTimestamp.nanoseconds / 1000000
  //     );
  //     const currentTime = new Date();
  //     const timeElapsed = Math.floor((currentTime - tripDate) / 1000);
  //     const totalTime = 15 * 60;
  //     const remainingTime = totalTime - timeElapsed;
  //     if (remainingTime > 0) {
  //       setTimeLeft((prevTime) =>
  //         prevTime !== remainingTime ? remainingTime : prevTime
  //       );

  //       const interval = setInterval(() => {
  //         setTimeLeft((prev) => {
  //           if (prev > 0) return prev - 1;
  //           clearInterval(interval);
  //           return 0;
  //         });
  //       }, 1000);

  //       return () => clearInterval(interval);
  //     } else {
  //       setTimeLeft(0);
  //     }
  //   }
  // }, [busData]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secondsLeft
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const busBookFromAdmin = async (overall, id) => {
    try {
      const passengers =
        adminBooking?.data?.travellerDetails[busData?.id]?.adults;
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
          LeadPassenger: index === 0,
          PassengerId: 0,
          Title: passenger.gender,
          Address: adminBooking?.data?.userDetails?.companyAddress,
          Age: Number(passenger.birthDate),
          Email: passenger.email,
          FirstName: passenger.firstName,
          Gender: genderCode,
          IdNumber: null,
          IdType: null,
          LastName: passenger.lastName,
          Phoneno: passenger.mobileNumber,
          Seat: overall.selectedSeat[index],
        };
      });
      const data = {
        ResultIndex: overall.bus.ResultIndex,
        BoardingPointId: overall.boardingPointId,
        DroppingPointId: overall.droppingPointId,
        TraceId: overall.traceId,
        Passenger: formattedPassengers,
      };
      const res = await actions.bookBusTicketFromAdmin(data);
      console.log(res);
      if (res.BookResult.Error.ErrorCode === 0) {
        await db
          .collection("Accounts")
          .doc(adminBooking?.data?.userDetails?.userid)
          .collection("trips")
          .doc(adminBooking?.data?.tripId)
          .collection("bus")
          .doc(id)
          .update({
            busBookResponce: res.BookResult,
          });
      }
      await actions.editTripStatus(
        adminBooking.data.userDetails.userid,
        adminBooking.data.tripId,
        adminBooking.id,
        "Booked",
        id,
        "bus"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const busBlockFromAdmin = async (overall, id) => {
    try {
      const passengers =
        adminBooking?.data?.travellerDetails[busData?.id]?.adults;
      const formattedBusPassengers = passengers.map((passenger, index) => {
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
          LeadPassenger: index === 0,
          PassengerId: 0,
          Title: passenger.gender,
          Address: adminBooking?.data?.userDetails?.companyAddress,
          Age: parseInt(passenger.birthDate),
          Email: passenger.email,
          FirstName: passenger.firstName,
          Gender: genderCode,
          IdNumber: null,
          IdType: null,
          LastName: passenger.lastName,
          Phoneno: passenger.mobileNumber,
          // Seat: {
          //   ColumnNo: overall.selectedSeat[index]?.ColumnNo,
          //   Height: overall.selectedSeat[index]?.Height,
          //   IsLadiesSeat: overall.selectedSeat[index]?.IsLadiesSeat || false,
          //   IsMalesSeat: overall.selectedSeat[index]?.IsMalesSeat || false,
          //   IsUpper: overall.selectedSeat[index]?.IsUpper || false,
          //   RowNo: overall.selectedSeat[index]?.RowNo || "000",
          //   SeatIndex: overall.selectedSeat[index]?.SeatIndex || 0,
          //   SeatName: overall.selectedSeat[index]?.SeatName || "5",
          //   SeatStatus: overall.selectedSeat[index]?.SeatStatus || true,
          //   SeatType: overall.selectedSeat[index]?.SeatType || 1,
          //   SeatFare: overall.selectedSeat[index]?.SeatFare || 0,
          //   Width: overall.selectedSeat[index]?.Width || 1,
          //   Price: {
          //     CurrencyCode:
          //       overall.selectedSeat[index]?.Price?.CurrencyCode || "INR",
          //     BasePrice: overall.selectedSeat[index]?.Price?.BasePrice || 10.1,
          //     Tax: overall.selectedSeat[index]?.Price?.Tax || 0.0,
          //     OtherCharges:
          //       overall.selectedSeat[index]?.Price?.OtherCharges || 0.0,
          //     Discount: overall.selectedSeat[index]?.Price?.Discount || 0.0,
          //     PublishedPrice:
          //       overall.selectedSeat[index]?.Price?.PublishedPrice || 10.1,
          //     PublishedPriceRoundedOff:
          //       overall.selectedSeat[index]?.Price?.PublishedPriceRoundedOff ||
          //       10.0,
          //     OfferedPrice:
          //       overall.selectedSeat[index]?.Price?.OfferedPrice || 9.6,
          //     OfferedPriceRoundedOff:
          //       overall.selectedSeat[index]?.Price?.OfferedPriceRoundedOff ||
          //       10.0,
          //     AgentCommission:
          //       overall.selectedSeat[index]?.Price?.AgentCommission || 0.5,
          //     AgentMarkUp:
          //       overall.selectedSeat[index]?.Price?.AgentMarkUp || 0.0,
          //     TDS: overall.selectedSeat[index]?.Price?.TDS || 0.15,
          //     GST: {
          //       CGSTAmount:
          //         overall.selectedSeat[index]?.Price?.GST?.CGSTAmount || 0.0,
          //       CGSTRate:
          //         overall.selectedSeat[index]?.Price?.GST?.CGSTRate || 0.0,
          //       CessAmount:
          //         overall.selectedSeat[index]?.Price?.GST?.CessAmount || 0.0,
          //       CessRate:
          //         overall.selectedSeat[index]?.Price?.GST?.CessRate || 0.0,
          //       IGSTAmount:
          //         overall.selectedSeat[index]?.Price?.GST?.IGSTAmount || 0.0,
          //       IGSTRate:
          //         overall.selectedSeat[index]?.Price?.GST?.IGSTRate || 12.0,
          //       SGSTAmount:
          //         overall.selectedSeat[index]?.Price?.GST?.SGSTAmount || 0.0,
          //       SGSTRate:
          //         overall.selectedSeat[index]?.Price?.GST?.SGSTRate || 0.0,
          //       TaxableAmount:
          //         overall.selectedSeat[index]?.Price?.GST?.TaxableAmount || 0.0,
          //     },
          //   },
          // },
          Seat: overall.selectedSeat[index],
        };
      });
      console.log(formattedBusPassengers);

      const data = {
        ResultIndex: overall.bus.ResultIndex,
        TraceId: overall.traceId,
        BoardingPointId: overall.boardingPointId,
        DroppingPointId: overall.droppingPointId,
        Passenger: formattedBusPassengers,
      };
      // console.log(data);
      // debugger;
      // const data = {
      //   ResultIndex: overall.bus.ResultIndex,
      //   TraceId: overall.traceId,
      //   BoardingPointId: overall.boardingPointId,
      //   DroppingPointId: overall.droppingPointId,
      //   Passenger: [
      //     {
      //       LeadPassenger: true,
      //       PassengerId: 0,
      //       Title: "Mr",
      //       Address: "Hyderabad",
      //       Age: 27,
      //       Email: "udaymamidisetti5@gmail.com",
      //       FirstName: "uday",
      //       Gender: 1,
      //       IdNumber: null,
      //       IdType: null,
      //       LastName: "krishna",
      //       Phoneno: "8125040788",
      //       Seat: {
      //         Price: {
      //           BasePrice: 1669.5,
      //           AgentCommission: 100.17,
      //           PublishedPrice: 1669.5,
      //           OfferedPrice: 1569.33,
      //           Discount: 0,
      //           AgentMarkUp: 0,
      //           GST: {
      //             CessAmount: 0,
      //             IGSTAmount: 0,
      //             CGSTRate: 0,
      //             SGSTRate: 0,
      //             TaxableAmount: 0,
      //             CGSTAmount: 0,
      //             IGSTRate: 18,
      //             SGSTAmount: 0,
      //             CessRate: 0,
      //           },
      //           Tax: 0,
      //           PublishedPriceRoundedOff: 1670,
      //           TDS: 2,
      //           OfferedPriceRoundedOff: 1569,
      //           OtherCharges: 0,
      //           CurrencyCode: "INR",
      //         },
      //         IsUpper: false,
      //         ColumnNo: "000",
      //         Width: 1,
      //         IsMalesSeat: false,
      //         RowNo: "000",
      //         SeatType: 2,
      //         IsLadiesSeat: false,
      //         SeatStatus: true,
      //         SeatIndex: 4,
      //         SeatFare: 1669.5,
      //         Height: 2,
      //         SeatName: "A5",
      //       },
      //     },
      //   ],
      // };
      console.log(JSON.stringify(data));
      // debugger;
      const res = await actions.blockbusTicket(data);
      console.log(res);
      if (res.BlockResult.Error.ErrorCode === 0) {
        await db
          .collection("Accounts")
          .doc(adminBooking?.data?.userDetails?.userid)
          .collection("trips")
          .doc(adminBooking?.data?.tripId)
          .collection("bus")
          .doc(id)
          .update({
            busBlockResponce: res.BlockResult,
          });
        await actions.getAdminTripById(adminTripid);
      }
    } catch (error) {
      console.log(error);
    }
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
  const details = `${bookingBus?.origin?.cityName} to ${
    bookingBus?.destination?.cityName
  } (${format(parseISO(bus?.DepartureTime), "MMM d")})`;
  return (
    <>
      <Popup condition={alltimeStamp} close={() => setAllTimeStamp(false)}>
        <div>
          <p>
            Added Date :
            {busData?.date &&
              format(new Date(busData?.date?.seconds * 1000), "MMMM d, h:mm a")}
          </p>
          <p>
            Sent to Approval :{" "}
            {busData?.manager_request_time
              ? format(
                  new Date(busData?.manager_request_time * 1000),
                  "MMMM d, h:mm a"
                )
              : "Not Requested for Approval"}{" "}
          </p>
          <p>
            Approved Date :{" "}
            {busData?.managerApprovedTime
              ? format(
                  new Date(busData?.managerApprovedTime?.seconds * 1000),
                  "MMMM d, h:mm a"
                )
              : "Not Approved"}
          </p>
          <p>
            Submitted Date :{" "}
            {busData?.submitted_date
              ? format(
                  new Date(busData?.submitted_date?.seconds * 1000),
                  "MMMM d, h:mm a"
                )
              : "Not Submitted"}
          </p>
          <p>
            Booked Date :{" "}
            {busData?.booked_date
              ? format(
                  new Date(busData?.booked_date?.seconds * 1000),
                  "MMMM d, h:mm a"
                )
              : "Not Booked"}
          </p>
        </div>
      </Popup>
      <Popup condition={addTravellers} close={() => setAddTravellers(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-[100%]">
          <>
            {Array.from(
              { length: parseInt(bookingBus && bookingBus.passengers) },
              (_, i) => {
                return (
                  <div key={`adult-${i}`} className="gap-[10px] mt-[20px]">
                    <h1 className="font-bold text-center py-1">
                      Passenger-{i + 1}
                    </h1>
                    <div className="gap-2 flex-wrap justify-center">
                      <div className="flex flex-wrap gap-[10px] items-center justify-center">
                        <label className="flex flex-col text-[12px]">
                          Title
                          <Controller
                            name={`adults[${i}].gender`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAccountDetails.gender : "Mr"
                            }
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
                          Age
                          <Controller
                            name={`adults[${i}].birthDate`}
                            control={control}
                            render={({ field }) => (
                              <input
                                type="number"
                                {...field}
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                placeholder="Age"
                                required
                                disabled={isFormDisabled}
                              />
                            )}
                          />
                        </label>
                      </div>
                      {i === 0 && (
                        <div className="flex flex-wrap gap-[10px] items-center my-2 justify-center">
                          <Controller
                            name={`adults[${i}].gender`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAccountDetails.gender : "Mr"
                            }
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
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </>

          <div className="flex gap-2 justify-center items-center mt-3">
            {busData?.status === "Not Submitted" ? (
              <>
                {tripData?.data?.travellerDetails &&
                tripData?.data?.travellerDetails[totalBus?.id] ? (
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
      <Popup
        condition={openBusDetails}
        close={() => {
          setOpenBusDetails(false);
        }}
      >
        <div className="bus-popup-header">Cancellation Details</div>
        <div className="busCancel-popup-block">
          <div className="busCancel-popup-tabs">
            <div className="busCancel-popup-tab">Cancellation Time</div>
            <div className="busCancel-popup-tab">Cancellation Charge</div>
          </div>
          <div className="busCancel-popup-dtls">
            {bus?.CancellationPolicies?.length > 0 &&
              bus.CancellationPolicies.map((rule, ru) => {
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
        {bookingStyle === "Manual" ? (
          <div className="admin-upload">
            {adminPage && (
              <div className="tripsPage-totalPrice-Desktop">
                <div className="tripsPage-totalPrice-section">
                  <div className="tripsPage-totalPrice">
                    <div className="tripsPage-totalPrice-title">Bus price:</div>
                    <div className="tripsPage-totalPrice-price">
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="tripsPage-totalPrice-price-icon"
                      />
                      {`${bookingBus.busPrice.toLocaleString("en-IN")} `}
                    </div>
                  </div>
                </div>
                <div className="flightBook-fare-fareItem !flex">
                  <div className="flightBook-fare-fareItem-title">
                    Service Charges
                  </div>
                  <div className="flightBook-fare-fareItem-value">
                    {"+ "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="flightBook-fare-fareItem-value-icon"
                    />
                    {Math.ceil(bookingBus.serviceCharge)}
                  </div>
                </div>
                <div className="flightBook-fare-fareItem !flex !justify-between">
                  <div className="flightBook-fare-fareItem-title">GST</div>
                  <div className="flightBook-fare-fareItem-value">
                    {"+ "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="flightBook-fare-fareItem-value-icon"
                    />
                    {Math.ceil(bookingBus.GST)}
                  </div>
                </div>
                <div className="tripsPage-totalPrice-sections">
                  <div className="tripsPage-totalPrice-title">Total price:</div>
                  <div className="tripsPage-totalPrice-price">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="tripsPage-totalPrice-price-icon"
                    />
                    {`${Math.ceil(bookingBus.busTotalPrice).toLocaleString(
                      "en-IN"
                    )} `}
                  </div>
                </div>
              </div>
            )}
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
                {busData?.downloadURL ? (
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
                  <div className="adminPage-main-status-text"></div>
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
                            (status1) => status1?.status === busData?.status
                          )?.[0]?.status
                        }
                      </option>
                      {statuses
                        .filter((status1) => status1.status !== busData?.status)
                        .map((status1) => (
                          <option value={status1?.status}>
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
                        busData?.status === "Booked" ||
                        busData?.status === "Cancelled"
                      }
                      onClick={async () => {
                        setLoading(true);
                        if (actionToConfirm === "Booked") {
                          actions.addInvoices(
                            adminTripDetails?.data?.userDetails?.userid,
                            adminTripDetails?.data?.tripId,
                            hotelId,
                            Math.ceil(bookingBus.busTotalPrice),
                            "bus",
                            details,
                            bookingBus.GST,
                            Math.ceil(bookingBus?.serviceCharge),
                            bookingBus?.selectedSeat.reduce(
                              (total, seat) =>
                                total + seat.Price.OfferedPriceRoundedOff,
                              0
                            )
                          );
                        }
                        if (actionToConfirm !== busData?.status) {
                          await handleClick(busData?.id, actionToConfirm);
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
                          "bus",
                          adminTripid,
                          adminBooking.data.userDetails.userid,
                          bookingBus.busTotalPrice,
                          adminTripDetails?.data?.userDetails?.email,
                          "Manual"
                        );
                        await actions.getAdminTripById(adminTripid);
                        setLoading(false);
                      }}
                    >
                      Yes
                    </button>
                  )}
                  <button onClick={clearMessage}>No</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* <p style={{ alignSelf: "end", color: "red" }}>
              remaining :{" "}
              <span style={{ color: "black" }}>
                {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
              </span>
            </p> */}
            <p className="font-bold">
              {bookingBus?.busBlockResponce?.Error?.ErrorCode === 0 &&
                "Bus hold Successfull"}
            </p>
            <div
              className="busMain-block"
              style={tripsPage ? getFlightStatusStyle(busData?.status) : null}
            >
              <div className="busMain-block-top">
                <div className="busMain-bus-travel">
                  <FaBusAlt />
                  <div className="busMain-bus-travel-name">
                    {bus?.TravelName}
                  </div>
                </div>
                <div className="busMain-bus-Timings">
                  <div className="busMain-Timing">
                    <span>{bus?.DepartureTime.slice(11, 16)}</span>&nbsp;
                    {depformattedDate}
                  </div>
                  <div className="busMain-dur">{formattedTimeDiff}</div>
                  <div className="busMain-Timing">
                    <span>{bus?.ArrivalTime.slice(11, 16)}</span>&nbsp;
                    {arrformattedDate}
                  </div>
                  <div className="busMain-bus-Fare">
                    <FontAwesomeIcon
                      icon={faIndianRupee}
                      className="busMain-bus-fare-icon"
                    />
                    {tripsPage || adminPage ? (
                      <>
                        {" "}
                        {bookingBus?.selectedSeat &&
                        bookingBus?.selectedSeat.length > 0
                          ? bookingBus?.selectedSeat.reduce(
                              (total, seat) =>
                                total + seat.Price.OfferedPriceRoundedOff,
                              0
                            )
                          : 0}
                      </>
                    ) : (
                      <>
                        {" "}
                        {bus?.BusPrice?.PublishedPriceRoundedOff
                          ? bus?.BusPrice?.PublishedPriceRoundedOff
                          : bus?.BusPrice?.OfferedPriceRoundedOff}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="busMain-bus-type flex justify-between items-center my-1">
                {bus?.BusType}
                <span className="flex gap-4 items-center text-[12px] md:text-[16px] pr-[10pt]">
                  {" "}
                  <span className="font-semibold">
                    {bookingBus?.origin?.cityName}
                  </span>
                  {!adminPage && !tripsPage ? null : <FaArrowRightLong />}
                  <span className="font-semibold">
                    {bookingBus?.destination?.cityName}
                  </span>
                </span>
              </div>
              <div>
                <div className="flex">
                  <p className="font-bold">Selected Seats: </p>
                  <p className="flex gap-2 ml-4">
                    {bookingBus?.selectedSeat &&
                      bookingBus?.selectedSeat.map((e, i) => (
                        <p>{e?.SeatName}</p>
                      ))}
                  </p>
                </div>
                <div className="my-2">
                  <p>
                    <span className="font-bold">Boarding Point:</span>{" "}
                    {bookingBus?.boardingPointDetails} , Time:
                    {bookingBus?.boardingTime &&
                      format(
                        parseISO(bookingBus?.boardingTime),
                        "MMMM d, h:mm a"
                      )}
                  </p>
                  <p>
                    <span className="font-bold">Dropping Point:</span>{" "}
                    {bookingBus?.droppingPointDetails} , Time:
                    {bookingBus?.droppingTime &&
                      format(
                        parseISO(bookingBus?.droppingTime),
                        "MMMM d, h:mm a"
                      )}
                  </p>
                </div>
              </div>
            </div>
            <div className="traveller-details-container !h-auto">
              <div className="traveller-details-header ">Traveller Details</div>
              {adminBooking?.data?.travellerDetails ? (
                <>
                  {adminBusTrav &&
                    adminBusTrav?.map((trav, i) => {
                      return (
                        <TravDetails type="Adults" index={i + 1} trav={trav} />
                      );
                    })}
                </>
              ) : null}
            </div>
            {bookingBus?.busBlockResponce?.Error?.ErrorCode === 0 ? (
              <>
                {bookingBus?.busBookResponce?.Error?.ErrorCode === 0 ? (
                  <button>Download Ticket</button>
                ) : (
                  <button
                    className="bg-black px-2 py-1 rounded-md text-white mt-3"
                    onClick={() => busBookFromAdmin(bookingBus, busData.id)}
                  >
                    Book now
                  </button>
                )}
              </>
            ) : (
              <button
                className="bg-black px-2 py-1 rounded-md text-white mt-3"
                onClick={() => busBlockFromAdmin(bookingBus, busData.id)}
              >
                Block now
              </button>
            )}
          </>
        )}
      </Popup>
      <Popup
        condition={openPriceInfo}
        close={() => {
          setOpenPriceInfo(false);
        }}
      >
        {tripsPage || adminPage ? (
          <div
            className="tripsPage-fare-desktop"
            style={
              tripsPage
                ? busData?.status === "Booked"
                  ? { background: "honeydew" }
                  : null
                : null
            }
          >
            <div
              className="tripsPage-fare-section-desktop"
              id="tripsPage-fare-section"
            >
              <div className="tripsPage-fare-fareItem tripsPage-fare-fareItem-flightFare">
                {tripsPage || adminPage ? (
                  <>
                    {/* <p className="font-bold">Boarding Point</p>
                    <div>
                      <p className="text-[13px]">
                        {bookingBus?.boardingPointDetails?.CityPointAddress},
                        {bookingBus?.boardingPointDetails?.CityPointName}
                      </p>
                    </div>
                    <p className="font-bold">Dropping Point</p>
                    <p className="text-[13px]">
                      {bookingBus?.droppingPointDetails?.CityPointLocation}
                    </p> */}

                    <div className="font-bold text-[13pt]">
                      <span>Bus Price</span>
                    </div>
                    <div className="text-[#94D2BD] font-bold text-[13pt] text-right">
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="tripsPage-fare-fareItem-value-icon"
                      />
                      {bookingBus?.selectedSeat &&
                      bookingBus?.selectedSeat?.length > 0
                        ? bookingBus?.selectedSeat.reduce(
                            (total, seat) =>
                              total + seat.Price.OfferedPriceRoundedOff,
                            0
                          )
                        : 0}
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
                  {/* {bookingBus.selectedSeat && bookingBus.selectedSeat.length > 0
                    ? bookingBus.selectedSeat.reduce(
                        (total, seat) =>
                          total +
                          Math.ceil(
                            (seat.Price.OfferedPriceRoundedOff * busService) /
                              100
                          ),
                        0
                      )
                    : 0} */}
                  {Math.ceil(bookingBus?.serviceCharge)}
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
                  {/* {bookingBus.selectedSeat && bookingBus.selectedSeat.length > 0
                    ? bookingBus.selectedSeat.reduce(
                        (total, seat) =>
                          total +
                          Math.ceil(
                            (seat.Price.OfferedPriceRoundedOff * busService) /
                              100
                          ),
                        0
                      )
                    : 0} */}
                  {Math.ceil(bookingBus?.GST)}
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
                {` ${Math.ceil(bookingBus?.busTotalPrice).toLocaleString(
                  "en-IN"
                )}`}
              </div>
            </div>
          </div>
        ) : null}
      </Popup>
      <Popup
        condition={busBoardingPoint}
        close={() => {
          setbusBoardingPoint(false);
        }}
      >
        {tripsPage || adminPage ? (
          <div className="tripsPage-fare-desktop">
            <div
              className="tripsPage-fare-section-desktop"
              id="tripsPage-fare-section"
            >
              <div className="tripsPage-fare-fareItem tripsPage-fare-fareItem-flightFare">
                {tripsPage || adminPage ? (
                  <>
                    <p className="font-bold">Boarding Point</p>
                    <div>
                      <p className="text-[13px]">
                        {bookingBus?.boardingPointDetails} , Time:
                        {bookingBus?.boardingTime &&
                          format(
                            parseISO(bookingBus?.boardingTime),
                            "MMMM d, h:mm a"
                          )}
                        {/* {bookingBus?.boardingPointDetails?.CityPointName} */}
                      </p>
                    </div>
                    <p className="font-bold">Dropping Point</p>
                    <p className="text-[13px]">
                      {bookingBus?.droppingPointDetails}, Time:
                      {bookingBus?.droppingTime &&
                        format(
                          parseISO(bookingBus?.droppingTime),
                          "MMMM d, h:mm a"
                        )}
                    </p>
                  </>
                ) : null}
              </div>
              {/* <div className="tripsPage-fare-fareItem">
                <div className="tripsPage-fare-fareItem-title">
                  Service Charges
                </div>
                <div className="tripsPage-fare-fareItem-value">
                  {"+ "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="tripsPage-fare-fareItem-value-icon"
                  />
                  {bookingBus.selectedSeat.length > 0
                    ? bookingBus.selectedSeat.reduce(
                        (total, seat) =>
                          total +
                          Math.ceil(
                            (seat.Price.OfferedPriceRoundedOff * 3) / 100
                          ),
                        0
                      )
                    : 0}
                </div>
              </div> */}
            </div>
            {/* <div className="tripsPage-fare-totalFare">
              <div className="tripsPage-fare-totalFare-title">Total fare</div>
              <div className="tripsPage-fare-totalFare-value">
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="tripsPage-fare-totalFare-value-icon"
                />
                {` ${Math.ceil(bookingBus?.busTotalPrice).toLocaleString(
                  "en-IN"
                )}`}
              </div>
            </div> */}
          </div>
        ) : null}
      </Popup>
      <Popup condition={openTravellers} close={() => setOpenTravellers(false)}>
        <div className="traveller-details-container">
          <div className="traveller-details-header">Traveller Details</div>
          {adminBooking?.data?.travellerDetails ? (
            <>
              {adminBusTrav &&
                adminBusTrav?.map((trav, i) => {
                  return (
                    <TravDetails type="Adults" index={i + 1} trav={trav} />
                  );
                })}
            </>
          ) : null}
        </div>
      </Popup>
      <Popup
        condition={busSubmitFromUser}
        close={() => setBussubmitFromUser(false)}
      >
        <AddingTravellerSubmit
          bookingBus={bookingBus}
          tripUserId={userId}
          busData={busData}
          tripData={tripData}
          totalBus={totalBus}
          tripId={tripId}
          setBussubmitFromUser={setBussubmitFromUser}
        />
      </Popup>
      <div>
        <div
          className="busMain-block"
          style={
            tripsPage || userPage || adminPage
              ? getFlightStatusStyle(busData?.status)
              : null
          }
        >
          {/* {tripsPage || adminPage ? (
            <div className="flex gap-[25px] justify-center items-center py-[10px]">
              <h1 className="font-bold text-[17px]">
                <span className="font-semibold">
                  {bookingBus?.origin?.cityName}
                </span>
              </h1>
              <FaArrowRightLong />
              <h1 className="font-bold text-[17px]">
                <span className="font-semibold">
                  {bookingBus?.destination?.cityName}
                </span>
              </h1>
            </div>
          ) : null} */}
          <div className="busMain-block-top">
            <div className="busMain-bus-travel">
              <FaBusAlt />
              <div className="busMain-bus-travel-name">{bus?.TravelName}</div>
            </div>
            <div className="busMain-bus-Timings">
              <div className="busMain-Timing">
                <span>{bus?.DepartureTime.slice(11, 16)}</span>&nbsp;
                {depformattedDate}
              </div>
              <div className="busMain-dur">{formattedTimeDiff}</div>
              <div className="busMain-Timing">
                <span>{bus?.ArrivalTime.slice(11, 16)}</span>&nbsp;
                {arrformattedDate}
              </div>
              <div className="busMain-bus-Fare">
                <FontAwesomeIcon
                  icon={faIndianRupee}
                  className="busMain-bus-fare-icon"
                />
                {tripsPage || adminPage ? (
                  <>
                    {" "}
                    {bookingBus?.selectedSeat &&
                    bookingBus?.selectedSeat.length > 0
                      ? bookingBus?.selectedSeat.reduce(
                          (total, seat) =>
                            total + seat.Price.OfferedPriceRoundedOff,
                          0
                        )
                      : 0}
                  </>
                ) : (
                  <>
                    {" "}
                    {bus?.BusPrice?.PublishedPriceRoundedOff
                      ? bus?.BusPrice?.PublishedPriceRoundedOff
                      : bus?.BusPrice?.OfferedPriceRoundedOff}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="busMain-bus-type flex justify-between items-center my-1">
            {bus?.BusType}
            <span className="flex gap-4 items-center text-[12px] md:text-[16px] pr-[10pt]">
              {" "}
              <span className="font-semibold">
                {bookingBus?.origin?.cityName}
              </span>
              {!adminPage && !tripsPage ? null : <FaArrowRightLong />}
              <span className="font-semibold">
                {bookingBus?.destination?.cityName}
              </span>
            </span>
          </div>
          <div className="busMain-block-bottom">
            <div className="busMain-tracking">
              <div
                className="busMain-details-btn"
                onClick={() => setOpenBusDetails(true)}
              >
                Cancellation
              </div>
              {tripsPage || adminPage ? (
                <div className="flex gap-5 items-center">
                  <div className="flex items-center">
                    <p className="!font-bold">Selected Seats:</p>
                    <p className="flex gap-2 ml-4">
                      {bookingBus?.selectedSeat &&
                        bookingBus?.selectedSeat.map((e, i) => (
                          <p>{e?.SeatName}</p>
                        ))}
                    </p>
                  </div>
                  <TbBusStop
                    className="cursor-pointer"
                    size={20}
                    onClick={() => setbusBoardingPoint(true)}
                  />
                </div>
              ) : (
                <div className="busMain-seats">
                  {bus?.AvailableSeats} Seats Left
                </div>
              )}
            </div>
            {!tripsPage && !adminPage ? (
              <div className="busMain-submit">
                <button
                  onClick={() => {
                    actions.fetchBusSeatLayout(bus);
                  }}
                >
                  Select Seats
                </button>
              </div>
            ) : null}
          </div>
          {tripsPage || adminPage ? (
            <>
              <div className="seperate"></div>
              {tripsPage && !adminPage ? (
                <>
                  <div className="timestamp">
                    <div className="flex gap-[10px] items-center">
                      <div>
                        {busData?.requestStatus === "Pending" ||
                        busData?.status === "Submitted" ||
                        busData?.status === "Booked" ||
                        busData?.requestStatus === "Approved" ? null : (
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="delete-icon"
                            onClick={() => setOpenDelete(true)}
                          />
                        )}
                      </div>
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
                      <span>
                        {new Date(busData?.date?.seconds * 1000)
                          .toString()
                          .slice(4, 15)}
                      </span> */}
                    </div>
                    <TbBusStop
                      className="cursor-pointer"
                      size={20}
                      onClick={() => setbusBoardingPoint(true)}
                    />
                    <div className="cab-header-price">
                      Total Price:{" "}
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="cab-header-price-icon"
                      />
                      &nbsp;
                      {`${Math.round(bookingBus?.busTotalPrice).toLocaleString(
                        "en-IN"
                      )}`}
                      &nbsp;
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        onClick={() => {
                          setOpenPriceInfo(true);
                        }}
                        className="info-icon"
                      />
                    </div>
                  </div>
                </>
              ) : null}

              <div className="seperate"></div>
              <div className="flightResults-tripsPage">
                {userPage && (
                  <div
                    onClick={() => {
                      setTimeStampData();
                      setAllTimeStamp(true);
                    }}
                  >
                    <LuAlarmClock size={15} className="cursor-pointer" />
                  </div>
                )}
                <div className="request-status">
                  Approval Status:
                  <span
                    style={{
                      background: reqColor?.[0]
                        ? reqColor?.[0]?.color
                        : "#808080",
                    }}
                  >
                    {busData?.requestStatus}
                  </span>
                </div>
                {busData ? (
                  <div className="flight-main-status">
                    {busData?.status ? (
                      <div className="flightStatus">
                        Booking Status:
                        <span style={{ background: color?.[0]?.color }}>
                          {busData?.status}
                        </span>
                      </div>
                    ) : null}
                    {busData?.downloadURL && (tripsPage || adminPage) ? (
                      <div
                        className="flightResults-list-flightCard-download"
                        onClick={downloadDoc}
                      >
                        Voucher&nbsp;
                        <FontAwesomeIcon icon={faDownload} />
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {adminPage && (
                  <div className="cab-header-price">
                    Total Price:{" "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="cab-header-price-icon"
                    />
                    &nbsp;
                    {`${Math.round(bookingBus?.busTotalPrice).toLocaleString(
                      "en-IN"
                    )}`}
                    &nbsp;
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      onClick={() => {
                        setOpenPriceInfo(true);
                      }}
                      className="info-icon"
                    />
                  </div>
                )}
                {tripsPage ? (
                  <div>
                    {tripData?.data?.travellerDetails &&
                    tripData?.data?.travellerDetails[totalBus.id] ? (
                      <Button
                        sx={{ position: "static", fontSize: "11px" }}
                        className="!bg-[#94d2bd] !text-black"
                        size="small"
                        onClick={() => {
                          setNewTravellerDetails(
                            () => tripData?.data?.travellerDetails[totalBus.id]
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
                          // setNewTravellerDetails(
                          //   () => tripData?.data?.travellerDetails[totalBus.id]
                          // );

                          setAddTravellers(true);
                        }}
                      >
                        Add Travellers
                      </Button>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </>
          ) : null}

          {/* {adminPage && (
            <>
              {" "}
              {isThere && (
                <button onClick={() => {}}>
                  <PDFDownloadLink
                    document={
                      <InvoicePdf1
                        type="Bus"
                        bus={OverallBus}
                        userAccountDetails={userAccountDetails}
                        invoiceId={isThere.invoiceId}
                        tripData={tripData}
                        busData={busData}
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
          )} */}
          {adminPage && bookingPage ? (
            <div className="flightBooking-admin">
              <div
                className="hotel-card-upload"
                onClick={() => {
                  setOpenUpload(true);
                  setHotelId(busData?.id);
                  setBusid(busData?.id);
                }}
              >
                <FontAwesomeIcon icon={faUpload} />
                &nbsp; Booking
              </div>
              <div className="hotel-travellers">
                <button
                  onClick={() => {
                    setOpenTravellers(true);
                    setBusid(busData?.id);
                  }}
                >
                  Traveller Details
                </button>
              </div>
            </div>
          ) : null}
          {userPage && (
            <>
              <div className="hotel-travellers ">
                {busData?.status === "Submitted" && (
                  <button
                    onClick={() => {
                      setOpenTravellers(true);
                      setBusid(busData?.id);
                    }}
                  >
                    Traveller Details
                  </button>
                )}
                {busData?.status === "Submitted" ||
                busData?.status === "Booked" ? null : (
                  <button
                    className="ml-2"
                    onClick={() => setBussubmitFromUser(true)}
                  >
                    submit
                  </button>
                )}
              </div>
            </>
          )}

          {/* {userPage && (
            <>
              {busData?.downloadURL ? (
                <div
                  className="flightResults-list-flightCard-download"
                  onClick={downloadDoc}
                >
                  Voucher&nbsp;
                  <FontAwesomeIcon icon={faDownload} />
                </div>
              ) : null}
            </>
          )} */}
          <div className=" flex ml-4  items-center ">
            {userPage ? (
              <>
                {isThere && (
                  <button onClick={() => {}}>
                    <PDFDownloadLink
                      document={
                        <InvoicePdf1
                          type="Bus"
                          bus={OverallBus}
                          userAccountDetails={user}
                          invoiceId={isThere.invoiceId}
                          tripData={userPage ? adminTripdata : tripData}
                          busData={busData}
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
                          type="Bus"
                          bus={OverallBus}
                          userAccountDetails={userAccountDetails}
                          invoiceId={isThere.invoiceId}
                          tripData={userPage ? adminTripdata : tripData}
                          busData={busData}
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
            )}
            {busData?.note && (
              <p className="ml-[10pt] text-[12pt] font-bold">
                Note:
                <span className="text-gray-500 text-[10pt]">
                  {busData?.note}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Bus;
