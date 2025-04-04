import React, { useContext, useEffect, useState } from "react";
import "./AdminDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStarHalf,
  faStar,
  faIndianRupeeSign,
  faUpload,
  faUtensils,
  faCheckCircle,
  faBan,
  faDownload,
  faCircleInfo,
  faPencilAlt,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import MyContext from "../../Context";
import Popup from "../../Popup";
import SideNav from "../SideNav/SideNav";
import Flight from "../../Flights/Flight/Flight";
import TravDetails from "../../Trips/TripDetails/TravellerDetails";
import Cab from "../../Cabs/Cab/Cab";
import HotelPriceCard from "../../Trips/TripDetails/HotelPriceCard";
import Bus from "../../Bus/Bus/Bus";
import { RiGlobalFill } from "react-icons/ri";
import HDetailsCard from "./HDetailsCard";
import { db } from "../../MyProvider";
import Countdown from "react-countdown";
import { FaSpinner } from "react-icons/fa";
import { generateBookingId } from "../../Utilites/functions";
const AdminDetails = () => {
  const {
    actions,
    adminTripDetails,
    adminTripDataLoading,
    tripData,
    minimumServiceCharge,
    domesticFlight,
  } = useContext(MyContext);
  const params = useParams();
  const { id } = params;
  const [status, setStatus] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [bookingStyle, setBookingStyle] = useState("Manual");
  const [hotelId, setHotelId] = useState(null);
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [ticketCost, setTicketCost] = useState("");
  const [mounted, setMounted] = useState(true);
  const [openTravellers, setOpenTravellers] = useState(false);
  const [tripId, setTripId] = useState();
  const [loading, setLoading] = useState(false);
  const [hotelTotalPrice, setHotelTotalPrice] = useState(0);
  const [hotelGst, setHotelGst] = useState(0);
  const [hotelFinalPrice, setHotelFinalPrice] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [hotelData, setHotelData] = useState(null);
  const [travellerCount, setTravellerCount] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [openAdminPrice, setOpenAdminPrice] = useState(false);
  const [openOtherBooking, setOpenOtherBooking] = useState(false);
  const [otherBookTravellersPopup, setOtherBookTravellersPopup] =
    useState(false);
  const [otherBookTravellers, setOtherBookTravellers] = useState();
  const [otherBookPrice, setOtherBookPrice] = useState({
    bookingTotal: 0,
    bookingService: 0,
    bookingGst: 0,
    totalBooking: 0,
  });
  const [otherData, setOtherData] = useState();
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isHotelHold, setISHotelHold] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [apiconformation, setApiConformation] = useState(false);
  const [freecan, setFreeCan] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeUp, setTimeUp] = useState(false);
  const [holdloader, setHoldloader] = useState(false);
  const [vocherloder, setVocherloader] = useState(false);
  const [successmsg, setSuccessmsg] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [pdfloader, setPdfLoader] = useState(false);
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
  var statuses = ["Submitted", "Booked", "Cancelled"];
  var tripstatuses = [
    { status: "Paid and Submitted", color: "#ffa500" },
    { status: "Booked", color: "#4CAF50" },
    { status: "Cancelled", color: "#FF0000" },
    { status: "Not Submitted", color: "#808080" },
  ];
  var reqStatuses = [
    { status: "Approved", color: "#008000" },
    { status: "Pending", color: "#ffa500" },
    { status: "Not Requested", color: "#808080" },
  ];
  var handleClick = async (hotelId, statuse, type) => {
    await actions.editTripStatus(
      adminTripDetails.data.userDetails.userid,
      adminTripDetails.data.tripId,
      adminTripDetails.id,
      statuse,
      hotelId,
      type
    );
    if (!file) {
      var bookingHotel = adminTripDetails?.hotels?.filter((hotel) => {
        return hotel.id === hotelId;
      });
      var bookingOther = adminTripDetails?.otherBookings?.filter((hotel) => {
        return hotel.id === hotelId;
      });
      if (statuse === "Booked" || statuse === "Booked,Payment Pending") {
        if (type === "add") {
          console.log("came to MAil");
          await actions.sendBookingStatusEmail({
            id: adminTripDetails?.data?.userDetails?.userid,
            name: adminTripDetails?.data?.userDetails?.firstName,
            email: adminTripDetails?.data?.userDetails?.email,
            fileUrl: null,
            tripName: adminTripDetails?.data?.tripName,
            typeName: hotelName,
            type: "Hotel",
            booking: bookingHotel,
            travellerDetails: adminTripDetails.data.travellerDetails,
          });
        } else if (type === "other") {
          await actions.sendBookingStatusEmail({
            id: adminTripDetails?.data?.userDetails?.userid,
            name: adminTripDetails?.data?.userDetails?.firstName,
            email: adminTripDetails?.data?.userDetails?.email,
            fileUrl: null,
            tripName: adminTripDetails?.data?.tripName,
            typeName: hotelName,
            type: "Other",
            booking: bookingOther,
          });
        }
      }
    }
  };
  var handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  var handleFileSubmit = async (type) => {
    var doc = await actions.addBookingDocuments(
      file,
      adminTripDetails.data.userDetails.userid,
      adminTripDetails.data.tripId,
      hotelId,
      adminTripDetails.id,
      type
    );
    var bookingHotel = adminTripDetails?.hotels?.filter((hotel) => {
      return hotel.id === hotelId;
    });
    var bookingOther = adminTripDetails?.otherBookings?.filter((hotel) => {
      return hotel.id === hotelId;
    });
    if (
      actionToConfirm === "Booked" ||
      actionToConfirm === "Booked,Payment Pending"
    ) {
      if (type === "hotel") {
        await actions.sendBookingStatusEmail({
          id: adminTripDetails?.data?.userDetails?.userid,
          name: adminTripDetails?.data?.userDetails?.firstName,
          email: adminTripDetails?.data?.userDetails?.email,
          fileUrl: doc,
          tripName: adminTripDetails?.data?.tripName,
          typeName: hotelName,
          type: "Hotel",
          booking: bookingHotel,
          travellerDetails: adminTripDetails.data.travellerDetails,
        });
      } else if (type === "other") {
        await actions.sendBookingStatusEmail({
          id: adminTripDetails?.data?.userDetails?.userid,
          name: adminTripDetails?.data?.userDetails?.firstName,
          email: adminTripDetails?.data?.userDetails?.email,
          fileUrl: doc,
          tripName: adminTripDetails?.data?.tripName,
          typeName: hotelName,
          type: "Other",
          booking: bookingOther,
        });
      }
    }

    setFile(null);
    setOpenUpload(false);
    return {
      fileUrl: doc,
    };
  };
  var addTicketCost = async (type) => {
    await actions.addTicketCostAdmin(
      ticketCost,
      adminTripDetails.data.userDetails.userid,
      adminTripDetails.data.tripId,
      hotelId,
      adminTripDetails.id,
      type
    );
    setOpenUpload(false);
  };
  var addHotelNote = async (type) => {
    await actions.addNoteAdmin(
      note,
      adminTripDetails.data.userDetails.userid,
      adminTripDetails.data.tripId,
      hotelId,
      adminTripDetails.id,
      "hotel"
    );
    setOpenUpload(false);
  };
  var addOtherNote = async (type) => {
    await actions.addNoteAdmin(
      note,
      adminTripDetails.data.userDetails.userid,
      adminTripDetails.data.tripId,
      hotelId,
      adminTripDetails.id,
      "other"
    );
    setOpenUpload(false);
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

  useEffect(() => {
    if (mounted) {
      actions.getAdminTripById(id);
    }
    return () => {
      setMounted(false);
    };
  }, []);
  var totalPrice =
    adminTripDetails?.flights?.reduce(
      (sum, obj) =>
        sum +
        (obj?.data[0]?.totalFare +
          obj?.data[0]?.finalFlightServiceCharge +
          obj?.data[0]?.gstInFinalserviceCharge),
      0
    ) +
    adminTripDetails?.hotels?.reduce(
      (sum, obj) => sum + obj?.data?.hotelTotalPrice,
      0
    ) +
    adminTripDetails?.cabs?.reduce(
      (sum, obj) => sum + obj?.data?.cabTotalPrice,
      0
    ) +
    adminTripDetails?.bus?.reduce(
      (sum, obj) => sum + obj?.data?.busTotalPrice,
      0
    ) +
    adminTripDetails?.otherBookings?.reduce(
      (sum, obj) => sum + obj?.data?.overallBookingPrice,
      0
    );
  var handleAdminDownload = async (downloadUrl) => {
    var downloadName = downloadUrl?.slice(164, downloadUrl.indexOf("?"));
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
  var logOut = () => {
    actions.signOut();
  };

  var downloadDoc = async (downloadUrl) => {
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
  // console.log(tripId,hotelId,"999DdvRhDHsH6Qg7hANkHeM");
  const adminHotelTravAdult =
    adminTripDetails?.data?.travellerDetails[hotelId || tripId]?.adults;
  const adminHotelTravChild =
    adminTripDetails?.data?.travellerDetails[tripId]?.children;
  var hotelTripinfo;

  const handleBlockHotel = async () => {
    setSuccessmsg("");
    setHoldloader(true);
    let currentIndex = 0;

    const groupedPassengers = hotelData.data.hotelSearchQuery.hotelRoomArr.map(
      (room) => {
        const totalAdults = parseInt(room.adults); // Only adults in the room
        const passengersForRoom = adminHotelTravAdult.slice(
          currentIndex,
          currentIndex + totalAdults
        );

        // Update the pointer
        currentIndex += totalAdults;

        // Return passengers for this room
        return passengersForRoom.map((trav, ind) => ({
          Title: trav.gender,
          FirstName: trav.firstName,
          MiddleName: null,
          LastName: trav.lastName,
          Phoneno: trav.mobileNumber || null,
          Email: trav.email || null,
          PaxType: 1,
          LeadPassenger: ind === 0, // First passenger in the room is the lead
        }));
      }
    );

    const mappedData = selectedRoom.map((_, ind) => {
      return {
        RoomIndex: selectedRoom[ind].RoomIndex,
        RoomTypeCode: selectedRoom[ind].RoomTypeCode,
        RoomTypeName: selectedRoom[ind].RoomTypeName,
        RatePlanCode: selectedRoom[ind].RatePlanCode,
        BedTypes: [
          {
            BedTypeCode: null,
            BedTypeDescription: "",
          },
        ],
        SmokingPreference: 0,
        Supplements: null,
        Price: selectedRoom[ind].Price,
        HotelPassenger: groupedPassengers[ind],
      };
    });

    const query = {
      ResultIndex: hotelData.data.hotelSearchRes.ResultIndex,
      HotelCode: hotelData.data.hotelCode,
      HotelName:
        hotelData.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName,
      GuestNationality: "IN",
      NoOfRooms: parseInt(hotelData.data.hotelSearchQuery.hotelRooms),
      ClientReferenceNo: "0",
      IsVoucherBooking: "false",
      CategoryId: hotelData.data.selectedRoomType?.[0].CategoryId,
      HotelRoomsDetails: mappedData,
      IsPackageFare: false,
      IsPackageDetailsMandatory: false,
      TraceId: hotelData.hotelTraceId,
    };
    const blockRoomFromAdmin = await actions.blockRoomFromAdmin(query);
    // if (blockRoomFromAdmin.success) {
    //   await db
    //     .collection("Accounts")
    //     .doc(adminTripDetails.data.userDetails.userid)
    //     .collection("trips")
    //     .doc(adminTripDetails.data.tripId)
    //     .collection("hotels")
    //     .doc(hotelId)
    //     .update({ isHotelHold: true,BookingId:blockRoomFromAdmin.data.BookResult.BookingId });
    //     setSuccessmsg("Hotel has been blocked successfully!")
    //   } else {
    //   console.log(blockRoomFromAdmin.message);
    // }
    actions.getAdminTripById(id);
    setHoldloader(false);
    // setOpenUpload(false);
  };
  const handle_Book_Hotel = async () => {
    setVocherloader(true);
    setSuccessmsg("");
    let currentIndex = 0;

    const groupedPassengers = hotelData.data.hotelSearchQuery.hotelRoomArr.map(
      (room) => {
        const totalAdults = parseInt(room.adults);
        const passengersForRoom = adminHotelTravAdult.slice(
          currentIndex,
          currentIndex + totalAdults
        );

        currentIndex += totalAdults;

        return passengersForRoom.map((trav, ind) => ({
          Title: trav.gender,
          FirstName: trav.firstName,
          MiddleName: null,
          LastName: trav.lastName,
          Phoneno: trav.mobileNumber || null,
          Email: trav.email || null,
          PaxType: 1,
          LeadPassenger: ind === 0,
        }));
      }
    );

    const mappedData = selectedRoom.map((_, ind) => {
      return {
        RoomIndex: selectedRoom[ind].RoomIndex,
        RoomTypeCode: selectedRoom[ind].RoomTypeCode,
        RoomTypeName: selectedRoom[ind].RoomTypeName,
        RatePlanCode: selectedRoom[ind].RatePlanCode,
        BedTypes: [
          {
            BedTypeCode: null,
            BedTypeDescription: "",
          },
        ],
        SmokingPreference: 0,
        Supplements: null,
        Price: selectedRoom[ind].Price,
        HotelPassenger: groupedPassengers[ind],
      };
    });

    const query = {
      ResultIndex: hotelData.data.hotelSearchRes.ResultIndex,
      HotelCode: hotelData.data.hotelCode,
      HotelName:
        hotelData.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName,
      GuestNationality: "IN",
      NoOfRooms: parseInt(hotelData.data.hotelSearchQuery.hotelRooms),
      ClientReferenceNo: "0",
      IsVoucherBooking: "true",
      CategoryId: hotelData.data.selectedRoomType?.[0].CategoryId,
      HotelRoomsDetails: mappedData,
      IsPackageFare: false,
      IsPackageDetailsMandatory: false,
      TraceId: hotelData.hotelTraceId,
    };
    const bookedRes = await actions.bookRoomFromAdmin(query);
    if (bookedRes.success) {
      await db
        .collection("Accounts")
        .doc(adminTripDetails.data.userDetails.userid)
        .collection("trips")
        .doc(adminTripDetails.data.tripId)
        .collection("hotels")
        .doc(hotelId)
        .update({ isBooked: true });
      setSuccessmsg("Hotel has been booked successfully!");
    } else {
      console.log(bookedRes.message);
    }
    actions.getAdminTripById(id);
    setVocherloader(false);
    setSuccessmsg("Hotel has been booked successfully!");
  };
  const handle_GenerateVoucher = async () => {
    setSuccessmsg("");
    setVocherloader(true);
    const vocherData = {
      BookingId: bookingId,
    };
    const bookedRes = await actions.generateVoucherFromAdmin(vocherData);
    if (bookedRes.success) {
      await db
        .collection("Accounts")
        .doc(adminTripDetails.data.userDetails.userid)
        .collection("trips")
        .doc(adminTripDetails.data.tripId)
        .collection("hotels")
        .doc(hotelId)
        .update({ isBooked: true });
      setSuccessmsg("Hotel has been booked successfully!");
    } else {
      console.log(bookedRes.message);
    }
    actions.getAdminTripById(id);
    setVocherloader(false);
  };
  const handle_generatePdf = async () => {
    setPdfLoader(true);
    const vocherData = {
      BookingId: bookingId,
    };
    const pdfData = await actions.generatePdfFromAdmin(vocherData);
    try {
      const res = await fetch(
        "https://us-central1-trav-biz.cloudfunctions.net/generateHotelTicketVoucher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pdfData.data),
        }
      );
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "HotelVoucher.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setPdfLoader(false);
    } catch (error) {
      setPdfLoader(false);
      console.log(error);
    }
  };
  const Timer = ({ firestoreTimestamp }) => {
    const startTime = new Date(
      firestoreTimestamp?.seconds * 1000 +
        firestoreTimestamp?.nanoseconds / 1000000
    );
    const endTime = startTime.getTime() + 15 * 60 * 1000;
    const renderer = ({ minutes, seconds, completed }) => {
      if (completed) {
        return <span className="error-msg">Time's up!</span>;
      } else {
        return (
          <span className="msg">
            Remaining {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </span>
        );
      }
    };
    const handleComplete = () => {
      setTimeUp(true);
    };
    return (
      <Countdown
        date={endTime}
        renderer={renderer}
        onComplete={handleComplete}
      />
    );
  };

  const renderVoucherConfirmation = () => (
    <div>
      <p>Are you sure you want to book the hotel?</p>
      <p>
        An amount of Rs.
        {`${Math.ceil(hotelData.data.hotelFinalPrice).toLocaleString(
          "en-IN"
        )}`}{" "}
        will be debited from your wallet.
      </p>
      <div className="flex gap-2">
        <button
          className="bg-black text-white rounded-md py-1 px-3"
          onClick={handle_GenerateVoucher}
        >
          {vocherloder ? (
            <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
          ) : (
            "Book"
          )}
        </button>
        <button
          onClick={() => {
            setOpenUpload(false);
            setApiConformation(false);
          }}
          className="bg-black text-white rounded-md py-1 px-3"
        >
          Cancel
        </button>
      </div>
    </div>
  );
  const renderVoucherBooking = () => (
    <div>
      <p>Are you sure you want to book the hotel?</p>
      <p>
        An amount of Rs.
        {`${Math.ceil(hotelData.data.hotelFinalPrice).toLocaleString(
          "en-IN"
        )}`}{" "}
        will be debited from your wallet.
      </p>
      <div className="flex gap-2">
        <button
          className="bg-black text-white rounded-md py-1 px-3"
          onClick={handle_Book_Hotel}
        >
          {vocherloder ? (
            <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
          ) : (
            "Book"
          )}
        </button>
        <button
          onClick={() => {
            setOpenUpload(false);
            setApiConformation(false);
          }}
          className="bg-black text-white rounded-md py-1 px-3"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderBlockHotelButton = () => (
    <button
      onClick={handleBlockHotel}
      className="bg-black text-white rounded-md py-1 px-3"
    >
      {holdloader ? (
        <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
      ) : (
        "BlockHotel"
      )}
    </button>
  );

  const renderHotelHoldSection = () => (
    <div className="flex items-center gap-3 justify-center">
      {isHotelHold ? (
        apiconformation ? (
          renderVoucherConfirmation()
        ) : (
          <button
            className="bg-black text-white rounded-md py-1 px-3"
            onClick={() => setApiConformation(true)}
          >
            VoucherBook
          </button>
        )
      ) : (
        renderBlockHotelButton()
      )}
    </div>
  );

  const renderBookingSuccessSection = () => (
    <div className="flex items-center gap-3 justify-center">
      {apiconformation ? (
        successmsg !== "" ? (
          <div>{renderVoucherBooking()}</div>
        ) : (
          successmsg
        )
      ) : (
        <button
          className="bg-black text-white rounded-md py-1 px-3"
          onClick={() => setApiConformation(true)}
        >
          VoucherBook
        </button>
      )}
    </div>
  );

  const renderRecheckButton = () => (
    <button className="bg-black text-white rounded-md py-1 px-3 block m-auto my-4">
      RecheckHotelAgain
    </button>
  );
  return (
    <>
      {!adminTripDataLoading ? (
        <>
          <Popup
            condition={openUpload}
            close={() => {
              setOpenUpload(false);
              setHotelFinalPrice(0);
              setHotelTotalPrice(0);
              setSelectedRoom([]);
              setHotelId(null);
              setBookingStyle("Manual");
              setApiConformation(false);
              setTimeUp(false);
            }}
          >
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
                <div>
                  <h3>Hotel Price:</h3>
                  <HotelPriceCard
                    selectedRoom={selectedRoom}
                    hotelFinalPrice={hotelFinalPrice}
                    hotelTotalPrice={hotelTotalPrice}
                    hotelData={hotelData}
                  />
                </div>
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
                      rows="4"
                      onChange={(e) => setNote(e.target.value)}
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
                    {hotelData?.downloadURL ? (
                      <div className="flight-file">
                        <div onClick={handleAdminDownload}>
                          <FontAwesomeIcon
                            icon={faDownload}
                            onClick={() => downloadDoc(hotelData.downloadDoc)}
                          />
                          `{hotelData?.downloadURL?.slice(0, 34)}...`
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="adminPage-main-statusSave">
                    <div className="adminPage-main-status">
                      <div className="adminPage-main-status-text">Status</div>
                      <div className="adminPage-status-btn">
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
                            hotelData?.status === "Booked" ||
                            hotelData?.status === "Cancelled"
                          }
                          onClick={async () => {
                            setLoading(true);
                            if (actionToConfirm === "Booked") {
                              actions.addInvoices(
                                adminTripDetails?.data?.userDetails?.userid,
                                adminTripDetails?.data?.tripId,
                                hotelId,
                                Math.ceil(hotelTotalPrice),
                                "hotels",
                                hotelTripinfo,
                                Math.ceil(hotelGst),
                                Math.ceil(hotelData?.data?.hotelServiceCharge),
                                Math.ceil(hotelData?.data?.hotelFinalPrice)
                              );
                            }
                            if (actionToConfirm !== hotelData.status) {
                              await handleClick(
                                hotelId,
                                actionToConfirm,
                                "add"
                              );
                            }
                            if (file) {
                              await handleFileSubmit("hotel");
                            }
                            if (ticketCost.length > 0) {
                              await addTicketCost("hotel");
                            }
                            if (note.length > 0) {
                              await addHotelNote();
                            }
                            await generateBookingId(
                              "hotel",
                              adminTripDetails?.data?.tripId,
                              adminTripDetails?.data?.userDetails?.userid,
                              Math.ceil(hotelData?.data?.hotelFinalPrice),
                              adminTripDetails?.data?.userDetails?.email,
                              "Manual"
                            );
                            await actions.getAdminTripById(id);
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
              <div className="w-100 h-[75vh] overflow-y-scroll">
                {!isBooked
                  ? startTime && <Timer firestoreTimestamp={startTime} />
                  : null}
                {/* {startTime && Timer(startTime)} */}
                <HDetailsCard data={hotelData} trav={adminHotelTravAdult} />
                {successmsg ? (
                  <div className="confirm-msg">{successmsg}</div>
                ) : null}
                {/* {!isBooked?!timeUp ? (
                  freecan ? (
                    <div className="flex items-center gap-3 justify-center">
                      {isHotelHold ? (
                        <div className="flex items-center gap-3 justify-center">
                          {apiconformation ? (
                            <div>
                              <p>Are you sure you want to book the hotel?</p>
                              <p>
                                An amount of Rs.
                                {`${Math.ceil(
                                  hotelData.data.hotelFinalPrice
                                ).toLocaleString("en-IN")}`}{" "}
                                Amount will be debited from your wallet.
                              </p>
                              <div className="flex gap-2">
                                <button
                                  className="bg-black text-white rounded-md py-1 px-3"
                                  onClick={handle_GenerateVoucher}
                                >
                                  {vocherloder?<FaSpinner className="animate-spin mr-2 ml-2" size={20} />: "Book"}
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenUpload(false);
                                    setApiConformation(false);
                                  }}
                                  className="bg-black text-white rounded-md py-1 px-3"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="bg-black text-white rounded-md py-1 px-3"
                              onClick={() => setApiConformation(true)}
                            >
                              VoucherBook
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={handleBlockHotel}
                          className="bg-black text-white rounded-md py-1 px-3"
                        >
                          {holdloader?<FaSpinner className="animate-spin mr-2 ml-2" size={20} />:"BlockHotel"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 justify-center">
                      {apiconformation ? (
                        successmsg!==""?<div>
                          <p>Are you sure you want to book the hotel?</p>
                          <p>
                            An amount of Rs.
                            {`${Math.ceil(
                              hotelData.data.hotelFinalPrice
                            ).toLocaleString("en-IN")}`}{" "}
                            Amount will be debited from your wallet.
                          </p>
                          <div className="flex gap-2">
                            <button
                              className="bg-black text-white rounded-md py-1 px-3"
                              onClick={handle_Book_Hotel}
                            >
                             {vocherloder?<FaSpinner className="animate-spin mr-2 ml-2" size={20} />: "Book1"}
                            </button>
                            <button
                              onClick={() => {
                                setOpenUpload(false);
                                setApiConformation(false);
                              }}
                              className="bg-black text-white rounded-md py-1 px-3"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>:successmsg
                      ) : (
                        <button
                          className="bg-black text-white rounded-md py-1 px-3"
                          onClick={() => setApiConformation(true)}
                        >
                          VoucherBook
                        </button>
                      )}
                    </div>
                  )
                ) : (
                  <>
                    <button className="bg-black text-white rounded-md py-1 px-3 block m-auto my-4">
                      RecheckHotelAgain
                    </button>
                  </>
                ):null} */}

                {!isBooked
                  ? !timeUp
                    ? freecan
                      ? renderHotelHoldSection()
                      : renderBookingSuccessSection()
                    : renderRecheckButton()
                  : null}
                {isBooked ? (
                  <button
                    onClick={handle_generatePdf}
                    className="bg-black text-white rounded-md py-1 px-3 block m-auto my-4"
                  >
                    {pdfloader ? (
                      <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
                    ) : (
                      "Download voucher"
                    )}
                  </button>
                ) : null}
              </div>
            )}
          </Popup>
          <Popup
            condition={openTravellers}
            close={() => setOpenTravellers(false)}
          >
            <div className="traveller-details-container">
              <div className="traveller-details-header">Traveller Details</div>
              {adminTripDetails?.data?.travellerDetails ? (
                <>
                  {adminHotelTravAdult &&
                    adminHotelTravAdult?.map((trav, i) => {
                      return (
                        <TravDetails
                          type={"Adult"}
                          index={i + 1}
                          trav={trav}
                          key={`i__${i + 1}`}
                        />
                      );
                    })}
                  {adminHotelTravChild &&
                    adminHotelTravChild?.map((trav, i) => {
                      return (
                        <TravDetails
                          type={"Adult"}
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
            condition={openAdminPrice}
            close={() => {
              setOpenAdminPrice(false);
            }}
          >
            <HotelPriceCard
              selectedRoom={selectedRoom}
              hotelFinalPrice={hotelFinalPrice}
              hotelTotalPrice={hotelTotalPrice}
              hotelData={hotelData}
            />
          </Popup>
          <Popup
            condition={openOtherBooking}
            close={() => {
              setOpenOtherBooking(false);
              clearMessage();
            }}
          >
            <div>
              {/* <button
                onClick={() => handleClick(hotelId, "Booked", "other")}
                className="bg-black text-white rounded-lg py-1 px-2"
              >
                Book
              </button> */}
            </div>
            <div className="admin-upload">
              <div className="tripsPage-totalPrice-Desktop">
                <div className="tripsPage-totalPrice-section">
                  <div className="tripsPage-totalPrice">
                    <div className="tripsPage-totalPrice-title">
                      Other booking price:
                    </div>
                    <div className="tripsPage-totalPrice-price">
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="tripsPage-totalPrice-price-icon"
                      />
                      {`${otherBookPrice.bookingTotal.toLocaleString(
                        "en-IN"
                      )} `}
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
                    {Math.ceil(otherBookPrice.bookingService)}
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
                    {Math.ceil(otherBookPrice.bookingGst)}
                  </div>
                </div>
                <div className="tripsPage-totalPrice-sections">
                  <div className="tripsPage-totalPrice-title">Total price:</div>
                  <div className="tripsPage-totalPrice-price">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="tripsPage-totalPrice-price-icon"
                    />
                    {`${Math.ceil(otherBookPrice.totalBooking).toLocaleString(
                      "en-IN"
                    )} `}
                  </div>
                </div>
              </div>
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
                    rows="4"
                    onChange={(e) => setNote(e.target.value)}
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
                </div>
                {/* <div className="adminPage-main-statusSave">
                  <div className="adminPage-main-status">
                    <div className="adminPage-main-status-text">Status</div>
                    <div className="adminPage-status-btn">
                      <select
                        onChange={async (e) => {
                          await setStatus(e.target.value);
                        }}
                      >
                        <option>
                          {
                            statuses.filter(
                              (status1) => status1 === hotelData?.status
                            )[0]
                          }
                        </option>
                        {statuses
                          .filter((status1) => status1 !== hotelData?.status)
                          .map((status1, ind) => (
                            <option value={status1} key={`s_${ind + 1}`}>
                              {status1}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div> */}
                <div className="adminPage-main-statusSave">
                  <div className="adminPage-main-status">
                    <div className="adminPage-main-status-text">Status</div>
                    <div className="adminPage-status-btn">
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
                  <div className="flex justify-between gap-2">
                    <p>{confirmationMessage}</p>
                    {loading ? (
                      <button className="spin">
                        <div className="spinner"></div>
                      </button>
                    ) : (
                      <button
                        disabled={
                          hotelData?.status === "Booked" ||
                          hotelData?.status === "Cancelled"
                        }
                        onClick={async () => {
                          setLoading(true);
                          if (actionToConfirm === "Booked") {
                            let fileLink = null;
                            if (file) {
                              var doc = await actions.addBookingDocuments(
                                file,
                                adminTripDetails.data.userDetails.userid,
                                adminTripDetails.data.tripId,
                                hotelId,
                                adminTripDetails.id,
                                "other"
                              );
                              fileLink = doc;
                            }
                            console.log(fileLink);
                            debugger;
                            console.log(otherData);
                            console.log("revi__Checking");
                            const bookingId = await generateBookingId(
                              "other",
                              adminTripDetails?.data?.tripId,
                              adminTripDetails?.data?.userDetails?.userid,
                              otherData?.data?.overallBookingPrice,
                              adminTripDetails?.data?.userDetails?.email,
                              "Manual",
                              Math.ceil(otherData?.data?.bookingGst),
                              Math.ceil(otherData?.data?.bookingService),
                              otherData?.data?.bookingDetails,
                              otherData?.data?.bookingDate,
                              fileLink,
                              otherData?.data?.bookingCost,
                              adminTripDetails?.data?.userDetails?.companyName
                            );
                            actions.addInvoices(
                              adminTripDetails?.data?.userDetails?.userid,
                              adminTripDetails?.data?.tripId,
                              hotelId,
                              Math.round(otherData?.data?.overallBookingPrice),
                              "otherbookings",
                              otherData?.data?.bookingDetails,
                              Math.round(otherData?.data?.bookingGst),
                              Math.round(otherData?.data?.bookingService),
                              Math.round(otherData?.data?.bookingCost),
                              bookingId.bookingId,
                              otherData?.data?.bookingDate,
                              fileLink,
                              Math.round(otherData?.data?.overallBookingPrice)
                            );
                          }
                          if (actionToConfirm !== hotelData.status) {
                            await handleClick(
                              hotelId,
                              actionToConfirm,
                              "other"
                            );
                          }

                          if (ticketCost.length > 0) {
                            await addTicketCost("other");
                          }
                          if (note.length > 0) {
                            await addOtherNote();
                          }
                          generateBookingId(
                            "other",
                            adminTripDetails?.data?.tripId,
                            adminTripDetails?.data?.userDetails?.userid,
                            otherData?.data?.overallBookingPrice,
                            adminTripDetails?.data?.userDetails?.email,
                            "Manual",
                            Math.ceil(otherData?.data?.bookingGst),
                            Math.ceil(otherData?.data?.bookingService),
                            otherData?.data?.bookingDetails,
                            otherData?.data?.bookingDate
                          );
                          await actions.getAdminTripById(id);
                          setLoading(false);
                          setOpenOtherBooking(false);
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
                  <>
                    {hotelData?.status !== "Booked" &&
                      hotelData?.status !== "Cancelled" && (
                        <button
                          disabled={
                            hotelData?.status === "Booked" ||
                            hotelData?.status === "Cancelled"
                          }
                          onClick={async () => {
                            setLoading(true);
                            if (status === "Booked") {
                              console.log("revi__Checking");
                              actions.addInvoices(
                                adminTripDetails?.data?.userDetails?.userid,
                                adminTripDetails?.data?.tripId,
                                hotelId,
                                Math.ceil(otherData?.data?.overallBookingPrice),
                                "otherbookings",
                                otherData?.data?.bookingDetails,
                                Math.ceil(otherData?.data?.bookingGst),
                                Math.ceil(otherData?.data?.bookingService),
                                Math.ceil(otherData?.data?.bookingCost)
                              );
                            }
                            if (status !== hotelData.status) {
                              await handleClick(hotelId, status, "other");
                            }
                            if (file) {
                              await handleFileSubmit("other");
                            }
                            if (ticketCost.length > 0) {
                              await addTicketCost("other");
                            }
                            if (note.length > 0) {
                              await addOtherNote();
                            }
                            generateBookingId(
                              "other",
                              adminTripDetails?.data?.tripId,
                              adminTripDetails?.data?.userDetails?.userid,
                              otherData?.data?.overallBookingPrice,
                              adminTripDetails?.data?.userDetails?.email,
                              "Manual"
                            );
                            await actions.getAdminTripById(id);
                            setLoading(false);
                            setOpenOtherBooking(false);
                          }}
                        >
                          Save Details
                        </button>
                      )}
                  </>
                )} */}
              </div>
            </div>
          </Popup>
          <Popup
            condition={otherBookTravellersPopup}
            close={() => {
              setOtherBookTravellersPopup(false);
            }}
          >
            {otherBookTravellers &&
              otherBookTravellers?.map((trav, i) => {
                return (
                  <div key={`i__${i + 1}`}>
                    <h1 className="text-center font-semibold">Adult-{i + 1}</h1>
                    <p>
                      {trav.title} {trav.firstName} {trav.lastName}
                    </p>
                  </div>
                );
              })}
          </Popup>
          <div className="adminPage-block">
            <SideNav />
            <div className="adminPage-main-block">
              <div className="adminPage-main-header">
                <div className="adminPage-main-topHeader">
                  <div className="adminPage-main-logout">
                    <button onClick={logOut}>Logout</button>
                  </div>
                </div>
                {/* <button onClick={() => navigate("/adminSearchFlight")}>
                  Navigation
                </button> */}
              </div>
              <div className="adminDetails-main-content">
                <div className="adminPage-main-section">
                  <div className="adminPage-main-body">
                    <div className="adminPage-main-body-name">Trip name</div>
                    <div className="adminPage-main-body-trip">
                      {adminTripDetails?.data?.tripName}
                    </div>
                    <div className="adminPage-main-body-date">
                      {/* {format(
                        adminTripDetails?.data?.date?.seconds,
                        "MMMM d, h:mm a"
                      )} */}
                    </div>
                  </div>
                  <div className="adminPage-main-totalPrice">
                    <span>TotalPrice:&nbsp;</span>
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="adminPage-main-totalPrice-icon"
                    />
                    {`${Math.ceil(totalPrice).toLocaleString("en-IN")}`}
                  </div>
                </div>
                <div className="adminPage-user-section">
                  <div className="adminPage-user-title">
                    User Account Details
                  </div>
                  <div className="adminPage-user-body">
                    <div className="adminPage-user-body-title">
                      <span>Name:</span>
                      {`${adminTripDetails?.data?.userDetails?.firstName} ${adminTripDetails?.data?.userDetails?.lastName}`}
                    </div>
                    <div className="adminPage-user-body-title">
                      <span>Email:</span>
                      {adminTripDetails?.data?.userDetails?.email}
                    </div>
                    <div className="adminPage-user-body-title">
                      <span>Mobile Number:</span>
                      {adminTripDetails?.data?.userDetails?.mobileNumber}
                    </div>
                    <div className="adminPage-user-body-title">
                      <span>Account Type:</span>
                      {adminTripDetails?.data?.userDetails?.accountType}
                    </div>
                    <div className="adminPage-user-body-title">
                      <span>Approval Type:</span>
                      {adminTripDetails?.data?.userDetails?.approvalType}
                    </div>
                    <div className="adminPage-user-body-title">
                      <span>Company Name:</span>
                      {adminTripDetails?.data?.userDetails?.companyName}
                    </div>
                  </div>
                </div>
                <div className="tripDetails-box">
                  <div className="tripDetails-hotel">
                    {adminTripDetails?.hotels?.length > 0 ? (
                      <div className="tripDetails-hotel-header">Hotels</div>
                    ) : null}
                    {adminTripDetails?.hotels
                      ?.sort((a, b) => {
                        var atime = new Date(
                          a?.data?.hotelSearchQuery?.checkInDate.seconds * 1000
                        );
                        var btime = new Date(
                          b?.data?.hotelSearchQuery?.checkInDate.seconds * 1000
                        );
                        return atime - btime;
                      })
                      ?.map((hotel, index) => {
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
                        var rating = [];
                        var starRating =
                          hotel?.data?.hotelInfo?.HotelInfoResult?.HotelDetails
                            ?.StarRating;
                        var starRatingFull = Math.floor(starRating);
                        var downloadName = hotel?.downloadURL?.slice(
                          164,
                          hotel.downloadURL.indexOf("?")
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
                              ?.HotelDetails?.Images[0]
                          : "";
                        var color = tripstatuses.filter((status) => {
                          return status?.status === hotel?.status;
                        });
                        var hotelStatus =
                          adminTripDetails?.data?.hotels?.filter(
                            (f) => f.id === hotel.id
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
                        var reqColor = reqStatuses.filter((status) => {
                          return status?.status === hotel?.requestStatus;
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
                        hotelTripinfo = `${hotel?.data?.hotelInfo?.HotelInfoResult?.HotelDetails?.HotelName} ${formattedDate1}-${endDate} (${hotel.data.hotelSearchQuery.hotelNights} Nights)`;

                        return (
                          <div
                            key={`h_${index + 1}`}
                            className="hotel-card-total"
                            style={
                              hotel.status === "Booked"
                                ? { background: "honeydew" }
                                : null
                            }
                          >
                            <div className="hotel-card">
                              <div className="hotel-card-img">
                                <img src={img} alt="Hotel" />
                              </div>
                              <div className="hotel-card-details">
                                <div className="hotel-card-name">
                                  {
                                    hotel.data.hotelInfo.HotelInfoResult
                                      .HotelDetails.HotelName
                                  }
                                </div>

                                <span className="bg-[#94D2BD] float-right text-black font-semibold rounded-tl-[0.8rem] rounded-bl-[0.8rem] text-[13px] pl-[4px] py-[6px]">
                                  {formattedDate1}-{endDate}
                                  &nbsp;(
                                  {hotel.data.hotelSearchQuery.hotelNights}{" "}
                                  Nights)
                                </span>

                                <div className="hotel-card-details-row">
                                  <div
                                    className="hotel-card-rating"
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    {rating.map((star, ind) => {
                                      return (
                                        <div key={`st_${ind + 1}`}>{star}</div>
                                      );
                                    })}
                                  </div>
                                  <div className="hotelInfo-details-passengers">
                                    Adults-{adults?.adults},&nbsp;Children-
                                    {adults?.child}
                                    <div>{hotel.data.hotelCode}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {hotel?.data?.selectedRoomType &&
                              hotel?.data?.selectedRoomType.map((room, f) => {
                                return (
                                  <div
                                    className="hotelInfo-roomDtls-room"
                                    key={`i_${f + 1}`}
                                  >
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
                                            : room?.Price.PublishedPriceRoundedOff.toLocaleString(
                                                "en-IN"
                                              )
                                        } `}
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
                                            (inclusion, ind) => {
                                              return (
                                                <span key={`ind_${ind}`}>
                                                  {inclusion}
                                                </span>
                                              );
                                            }
                                          )
                                        : null}
                                    </div>
                                  </div>
                                );
                              })}
                            <div className="seperate"></div>
                            <div className="hotel-card-status">
                              <div className="request-status">
                                Approval Status:
                                <span
                                  style={{
                                    background: reqColor[0]
                                      ? reqColor[0].color
                                      : "#808080",
                                  }}
                                >
                                  {hotel?.requestStatus}
                                </span>
                              </div>
                              <div className="hotelType">
                                <div className="hotelStatus">
                                  Booking Status:
                                  <span
                                    style={{
                                      background: color[0]
                                        ? color[0].color
                                        : "#808080",
                                    }}
                                  >
                                    {hotel.status}
                                  </span>
                                </div>
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
                                    setOpenAdminPrice(true);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="seperate"></div>
                            <div className="hotel-card-admin-details-upload">
                              {hotel.downloadURL ? (
                                <div className="hotel-file">
                                  <div
                                    onClick={() => {
                                      handleAdminDownload(hotel.downloadURL);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faDownload} />`
                                    {downloadName.slice(0, 14)}...`
                                  </div>
                                </div>
                              ) : null}
                              {hotel.ticketCost ? (
                                <div className="hotel-ticket-cost">
                                  Ticket Cost:{" "}
                                  <span>
                                    <FontAwesomeIcon
                                      icon={faIndianRupeeSign}
                                      className="hotelInfo-roomDtls-room-price-icon"
                                    />{" "}
                                    {hotel.ticketCost}
                                  </span>
                                </div>
                              ) : null}
                              {hotel.note ? (
                                <div className="flight-ticket-cost">
                                  Note: {hotel.note}
                                </div>
                              ) : null}
                              {hotel?.note ||
                              hotel?.ticketCost ||
                              hotel?.downloadURL ? (
                                <FontAwesomeIcon
                                  icon={faPencilAlt}
                                  className="upload-icon"
                                  onClick={() => {
                                    setOpenUpload(true);
                                    setStatus(hotel.status);
                                    setNote(hotel.note ? hotel.note : "");
                                    setTicketCost(
                                      hotel.ticketCost ? hotel.ticketCost : ""
                                    );
                                    setHotelId(hotel.id);
                                    setHotelData(hotel);
                                  }}
                                />
                              ) : null}
                            </div>
                            {hotel?.note ||
                            hotel?.ticketCost ||
                            hotel?.downloadURL ? (
                              <div className="seperate"></div>
                            ) : null}

                            <div className="hotel-card-admin-details">
                              <div
                                className="hotel-card-upload"
                                onClick={() => {
                                  setStartTime(hotel.hotelSearchTime);
                                  const allRoomsHaveValidLastVoucherDate =
                                    hotel?.data?.selectedRoomType.every(
                                      (room) => {
                                        if (!room.LastVoucherDate) return false;
                                        const timePart =
                                          room.LastVoucherDate.split("T")[1];
                                        return (
                                          room.CancellationPolicy !== null &&
                                          timePart !== "00:00:00"
                                        );
                                      }
                                    );
                                  setFreeCan(allRoomsHaveValidLastVoucherDate);
                                  setOpenUpload(true);
                                  setStatus(hotel.status);
                                  setNote(hotel.note ? hotel.note : "");
                                  setTicketCost(
                                    hotel.ticketCost ? hotel.ticketCost : ""
                                  );
                                  setHotelId(hotel.id);
                                  setHotelFinalPrice(
                                    hotel.data.hotelFinalPrice
                                  );
                                  setHotelTotalPrice(
                                    hotel.data.hotelTotalPrice
                                  );
                                  setSelectedRoom(hotel.data.selectedRoomType);
                                  setHotelData(hotel);
                                  setHotelName(
                                    hotel.data.hotelInfo.HotelInfoResult
                                      .HotelDetails.HotelName
                                  );
                                  setHotelGst(
                                    hotel.data.calculateGstFromService
                                  );
                                  setISHotelHold(hotel.data.isHotelHold);
                                  setBookingId(hotel.data.BookingId);
                                  setIsBooked(hotel.data.isBooked);
                                }}
                              >
                                <FontAwesomeIcon icon={faUpload} />
                                &nbsp; Booking
                              </div>
                              <div className="hotel-travellers">
                                <button
                                  onClick={() => {
                                    setOpenTravellers(!openTravellers);
                                    setTripId(hotel.id);
                                    setTravellerCount(adults);
                                  }}
                                >
                                  Traveller Details
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {adminTripDetails?.flights?.length > 0 ? (
                      <div className="tripDetails-hotel-header">Flights</div>
                    ) : null}
                    {adminTripDetails?.flights ? (
                      <>
                        {adminTripDetails?.flights
                          ?.sort((a, b) => {
                            var aflightArr = [a.data[0].flight].map(
                              (flight, f) => {
                                return {
                                  ...actions.modifyFlightObject(flight),
                                };
                              }
                            );
                            var bflightArr = [b.data[0].flight].map(
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
                          ?.map((flight, f) => {
                            var reqColor = reqStatuses.filter((status) => {
                              return status?.status === flight?.requestStatus;
                            });
                            const charge =
                              flight?.data[0]?.totalFare === 0
                                ? 0
                                : Math.ceil(
                                    (flight?.data[0]?.totalFare *
                                      domesticFlight) /
                                      100
                                  ) > minimumServiceCharge
                                ? Math.ceil(
                                    (flight?.data[0]?.totalFare *
                                      domesticFlight) /
                                      100
                                  )
                                : minimumServiceCharge;

                            const gst =
                              flight?.data[0]?.totalFare === 0
                                ? 0
                                : Math.ceil(charge * 0.18);
                            return (
                              <Flight
                                flightGrp={[flight?.data[0]?.flight]}
                                tripsPage={false}
                                bookingPage={true}
                                adminPage={true}
                                flightBooking={flight.data[0]}
                                adminBooking={adminTripDetails}
                                flightData={flight}
                                travellerDetails={
                                  adminTripDetails?.data?.travellerDetails
                                    ? adminTripDetails?.data?.travellerDetails[
                                        flight.id
                                      ]
                                    : []
                                }
                                reqColor={reqColor}
                                adminTripid={id}
                                flightStatus={flight}
                                charge={charge}
                                gst={gst}
                                key={`f_${f + 1}`}
                              />
                            );
                          })}
                      </>
                    ) : null}
                    {adminTripDetails?.cabs?.length > 0 ? (
                      <div className="tripDetails-hotel-header">Cabs</div>
                    ) : null}
                    {adminTripDetails?.cabs ? (
                      <>
                        {adminTripDetails?.cabs
                          ?.sort((a, b) => {
                            var adate = a.data.cabStartDate;
                            var bdate = b.data.cabStartDate;
                            return adate - bdate;
                          })
                          ?.map((flight) => {
                            var reqColor = reqStatuses.filter((status) => {
                              return status?.status === flight?.requestStatus;
                            });

                            var cabReq = adminTripDetails?.data?.cabs?.filter(
                              (hotelMain) => {
                                return hotelMain.id === flight.id;
                              }
                            );
                            console.log(flight);

                            return (
                              <>
                                {flight && (
                                  <Cab
                                    tripsPage={false}
                                    adminPage={true}
                                    bookingPage={true}
                                    adminBooking={adminTripDetails}
                                    cabData={flight}
                                    startDate={flight.data.cabStartDate}
                                    endDate={flight.data.cabEndDate}
                                    travellerDetails={
                                      adminTripDetails?.data?.travellerDetails
                                        ? adminTripDetails?.data
                                            ?.travellerDetails[flight.id]
                                        : []
                                    }
                                    reqColor={reqColor}
                                    adminTripid={id}
                                    cab={flight.data.cab}
                                    cabTotal={flight.data}
                                    cabTotalPrice={flight.data.cabTotalPrice}
                                    tripsCabType={flight.data.cabType}
                                  />
                                )}
                              </>
                            );
                          })}
                      </>
                    ) : null}
                    {adminTripDetails?.bus?.length > 0 ? (
                      <div className="tripDetails-hotel-header">Bus</div>
                    ) : null}
                    {adminTripDetails?.bus ? (
                      <>
                        {adminTripDetails?.bus
                          ?.sort((a, b) => {
                            var adate = a?.data?.bus?.DepartureTime;
                            var bdate = b?.data?.bus?.ArrivalTime;
                            return adate - bdate;
                          })
                          ?.map((flight, f) => {
                            return (
                              <div key={`f_${f + 1}`}>
                                <Bus
                                  bookingPage={true}
                                  bus={flight?.data?.bus}
                                  tripsPage={false}
                                  adminPage={true}
                                  bookingBus={flight?.data}
                                  busData={flight}
                                  adminTripid={id}
                                  adminBooking={adminTripDetails}
                                  travellerDetails={
                                    adminTripDetails?.data?.travellerDetails
                                      ? adminTripDetails?.data
                                          ?.travellerDetails[flight.id]
                                      : []
                                  }
                                />
                              </div>
                            );
                          })}
                      </>
                    ) : null}
                    {adminTripDetails?.otherBookings?.length > 0 ? (
                      <div className="tripDetails-hotel-header">
                        Other Bookings
                      </div>
                    ) : null}
                    {adminTripDetails?.otherBookings?.map((other) => {
                      console.log(adminTripDetails);
                      const otherM =
                        adminTripDetails?.data?.otherBookings?.filter(
                          (otherMain) => {
                            return otherMain.id === other.id;
                          }
                        );
                      console.log(otherM[0]);
                      var color = tripstatuses?.filter((status) => {
                        return status?.status === otherM[0]?.status;
                      });
                      var reqColor = reqStatuses.filter((status) => {
                        return status?.status === otherM[0]?.requestStatus;
                      });

                      const backgroundColor =
                        otherM[0]?.status === "Booked" ? "honeydew" : "inherit";
                      return (
                        <div
                          style={{
                            boxShadow:
                              "0.04rem 0.06rem 0.4rem rgba(0, 0, 0, 0.171)",
                            backgroundColor: backgroundColor,
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
                              <p className="text-[#BB3E03] font-bold">
                                Total Price:
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  className="tripsPage-totalPrice-price-icon"
                                />{" "}
                                {other?.data?.overallBookingPrice}
                              </p>
                            </div>
                            <div className="border-[1px] border-dotted border-[#001219] mb-1"></div>
                            <div className="flex items-center justify-between">
                              <p className="text-[10pt]">
                                Approval Status:
                                <span
                                  style={{
                                    background: reqColor[0]
                                      ? reqColor[0]?.color
                                      : "#808080",
                                  }}
                                  className="py-[3pt] px-[5pt] rounded-[0.8rem] text-white text-[8pt] font-bold"
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
                                  className="py-[3pt] px-[5pt] rounded-[0.8rem] text-white text-[8pt] font-bold"
                                >
                                  {otherM[0].status}
                                </span>
                              </p>
                            </div>
                          </div>
                          {/* <button
                            onClick={() => {
                              setOpenOtherBooking(true);
                              setHotelId(other.id);
                            }}
                          >
                            Booking
                          </button> */}
                          <div className="hotel-card-admin-details flex items-center justify-around mt-2 mb-2 cursor-pointer">
                            <div
                              className="hotel-card-upload"
                              onClick={() => {
                                setOpenOtherBooking(true);
                                setHotelId(other.id);
                                setStatus(other.status);

                                setNote(other.note ? other.note : "");
                                setTicketCost(
                                  other.ticketCost ? other.ticketCost : ""
                                );
                                setHotelData(otherM[0]);
                                setOtherBookPrice((prevState) => ({
                                  ...prevState,
                                  bookingTotal: other?.data?.bookingCost,
                                  bookingService: other?.data?.bookingService,
                                  bookingGst: other?.data?.bookingGst,
                                  totalBooking:
                                    other?.data?.overallBookingPrice,
                                }));
                                setOtherData(other);
                              }}
                            >
                              <FontAwesomeIcon icon={faUpload} />
                              &nbsp; Booking
                            </div>
                            <div className="hotel-travellers">
                              <button
                                onClick={() => {
                                  setOtherBookTravellersPopup(true);
                                  setOtherBookTravellers(
                                    other?.data?.bookingTravellers
                                  );
                                }}
                              >
                                Traveller Details
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/* {adminTripDetails?.data?.} */}
                    {adminTripDetails?.bookingComments && (
                      <h1 className="font-bold text-[20px] mt-4">Comments</h1>
                    )}
                    {adminTripDetails?.bookingComments?.map(
                      (comment, index) => {
                        return (
                          <div
                            className="shadow-md w-[90%] mt-2 py-4 px-2"
                            key={`ind__${index + 1}`}
                          >
                            <p className="font-semibold">Booking {index + 1}</p>
                            <p>
                              <span className="font-semibold">Comments: </span>
                              {comment?.adminComment}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default AdminDetails;
