import React, { useContext, useEffect, useState } from "react";
import "./Cab.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faDownload,
  faIndianRupeeSign,
  faLeftLong,
  faPencilAlt,
  faPlus,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import MyContext from "../../Context";
import Popup from "../../Popup";
import { useNavigate } from "react-router-dom";
import TravDetails from "../../Trips/TripDetails/TravellerDetails";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { LuAlarmClock } from "react-icons/lu";
import { format } from "date-fns";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import InvoicePdf1 from "../../InvoicePdf1";
import { FaTaxi } from "react-icons/fa";
import { generateBookingId } from "../../Utilites/functions";
const Cab = (props) => {
  const { control, handleSubmit, setValue, reset } = useForm();
  var [activeTab, setActiveTab] = useState("tab1");
  var [submitIsOpen, setSubmitIsOpen] = useState(false);
  var [loading, setLoading] = useState(false);
  var [status, setStatus] = useState(null);
  var [openUpload, setOpenUpload] = useState(false);
  var [hotelId, setHotelId] = useState(null);
  var [file, setFile] = useState(null);
  var [note, setNote] = useState("");
  var [ticketCost, setTicketCost] = useState("");
  var [openTravellers, setOpenTravellers] = useState(false);
  var [cabId, setCabId] = useState();
  var [openPriceInfo, setOpenPriceInfo] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [addTravellers, setAddTravellers] = useState(false);
  const [newtravellerDetails, setNewTravellerDetails] = useState();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [alltimeStamp, setAllTimeStamp] = useState(false);
  const [timeStampDate, setTimeStampData] = useState();
  const [pickUpPopup, setPickUpPopup] = useState(false);
  const [pickUp, setPickUp] = useState("");
  const [drop, setDrop] = useState("");
  const {
    cabStartDate,
    cabEndDate,
    cabCity,
    cabType,
    userTripStatus,
    actions,
    cabCount,
    cabService,
    cabNights,
    selectedTime,
    approvedCabs,
    userAccountDetails,
    tripData,
    adminTripDetails,
    GSTpercent,
    minimumServiceCharge,
  } = useContext(MyContext);
  const {
    adminTripdata,
    cab,
    startDate,
    endDate,
    tripsPage,
    cabData,
    adminBooking,
    adminTripid,
    adminPage,
    cabTotal,
    tripsCabType,
    approvePage,
    tripId,
    userId,
    countCab,
    totalCab,
    bookingPage,
    userPage,
    user,
    travellerDetails,
    // newCab,
  } = props;
  console.log(adminBooking);
  var myStr = cabCity + "_trip";
  const formattedDate = `${cabStartDate?.toLocaleString("default", {
    month: "long",
  })} ${cabStartDate?.getDate()}`;
  const combinedString = `${myStr}_${formattedDate}`;
  var [defaultInput, setDefaultInput] = useState(combinedString);
  const [invoiceData, setInvoiceData] = useState([]);
  const [cabLocationPopup, setCabLocationPopup] = useState(false);
  // var invoiceData=[]
  useEffect(() => {
    const fetch = async () => {
      const data = await actions.getInvoiceDetails(userId, tripId);
      if (data.length > 0) {
        setInvoiceData(data);
      }
      console.log(data);
    };
    fetch();
  }, []);
  var isThere = null;
  if (invoiceData.length > 0) {
    isThere = invoiceData.find((item) => item.cardId === totalCab?.id);
  }
  useEffect(() => {
    if (newtravellerDetails) {
      setIsFormDisabled(true);
      if (newtravellerDetails.adults) {
        newtravellerDetails.adults.forEach((adults, index) => {
          setValue(`adults[${index}].gender`, adults.gender);
          setValue(`adults[${index}].firstName`, adults.firstName);
          setValue(`adults[${index}].lastName`, adults.lastName);
          setValue(`adults[${index}].email`, adults.email);
          setValue(`adults[${index}].mobileNumber`, adults.mobileNumber);
        });
      }
    }
  }, [newtravellerDetails, setValue]);
  const navigate = useNavigate();
  const cabs = ["Airport to City center Hotel", "City center hotel to airport"];
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
  var imgs = [
    {
      passenger: 4,
      type: "Sedan",
      image:
        "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/hatchback_new.png",
    },
    {
      passenger: 4,
      type: "Indica or similar",
      image:
        "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/sedan_new.png",
    },
    {
      passenger: 6,
      type: "SUV (Innova/Ertiga)",
      image:
        "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
    },
    {
      passenger: 6,
      type: "Innova",
      image:
        "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
    },
    {
      passenger: 6,
      type: "Innova crysta",
      image:
        "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
    },
    {
      passenger: 6,
      type: "Innova Crysta",
      image:
        "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
    },
    {
      passenger: 6,
      type: "Ertiga",
      image:
        "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
    },
  ];
  var cabImg = imgs.filter((img) => img.type.trim() === cab.carType.trim());
  var handleAddToTrip = async () => {
    setLoading(true);
    var cabFinalPrice;
    if (cabNights > 0) {
      cabFinalPrice = cab.price * Number(cabCount) * cabNights;
    } else {
      cabFinalPrice = cab.price * Number(cabCount);
    }
    const calculateCabservice = (cabFinalPrice * cabService) / 100;
    const finalServiceCharge =
      calculateCabservice > minimumServiceCharge
        ? calculateCabservice
        : minimumServiceCharge;
    const gstInFinalserviceCharge = finalServiceCharge * (GSTpercent / 100);

    var cabTotalPrice =
      finalServiceCharge + gstInFinalserviceCharge + cabFinalPrice;

    var newtripid = await actions.createNewTrip(defaultInput, "cabs", {
      cabCity,
      cabType,
      cab,
      cabStartDate,
      cabEndDate,
      cabCount,
      cabTotalPrice,
      cabFinalPrice,
      cabNights,
      selectedTime,
      pickUp,
      drop,
      finalServiceCharge: finalServiceCharge,
      gstInFinalserviceCharge: gstInFinalserviceCharge,
    });
    navigate(`/trips/${newtripid}`, { state: { userId: userId } });
    setLoading(false);
    await actions.getLastDoc();
  };
  const onSubmit = (data) => {
    const newData = { [totalCab.id]: data };
    // setNewTravellerDetails({
    //   ...newtravellerDetails,
    //   [id]: data,
    // });
    // console.log(newtravellerDetails);
    actions.updateTravDetails(newData, tripId);
    setAddTravellers(false);
    // console.log(data); // Handle form submission here
  };
  var downloadDoc = async () => {
    var downloadName = cabData?.downloadURL.slice(
      164,
      cabData?.downloadURL.indexOf("?")
    );
    const response = await fetch(cabData?.downloadURL);
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
    await actions.deleteTripItem(tripId, cabData?.id, "cabs");
    setOpenDelete(false);
    //await getTripData()
  };

  var getTime = (seconds) => {
    const timestampInSeconds = seconds;
    const timestampInMilliseconds = timestampInSeconds * 1000;
    const date = new Date(timestampInMilliseconds);
    return date;
  };

  var handleInputChange = (e) => {
    setDefaultInput(e.target.value);
  };
  var cabFinalPrice;
  if (cabNights > 0) {
    cabFinalPrice = cab.price * Number(cabCount) * cabNights;
  } else {
    cabFinalPrice = cab.price * Number(cabCount);
  }

  var addtoTrip = async (id) => {
    var cabFinalPrice;
    if (cabNights > 0) {
      cabFinalPrice = cab.price * Number(cabCount) * cabNights;
    } else {
      cabFinalPrice = cab.price * Number(cabCount);
    }
    const calculateCabservice = (cabFinalPrice * cabService) / 100;
    const finalServiceCharge =
      calculateCabservice > minimumServiceCharge
        ? calculateCabservice
        : minimumServiceCharge;
    const gstInFinalserviceCharge = finalServiceCharge * (GSTpercent / 100);

    var cabTotalPrice =
      finalServiceCharge + gstInFinalserviceCharge + cabFinalPrice;

    await actions.editTripById(
      id,
      {
        cabCity,
        cabType,
        cab,
        cabStartDate,
        cabEndDate,
        cabCount,
        cabTotalPrice,
        cabFinalPrice,
        cabNights,
        selectedTime,
        pickUp,
        drop,
        finalServiceCharge: finalServiceCharge,
        gstInFinalserviceCharge: gstInFinalserviceCharge,
      },
      "cabs"
    );
    await actions.getLastDoc();
  };

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

  var handleClick = async (hotelId, statuse) => {
    await actions.editTripStatus(
      adminBooking.data.userDetails.userid,
      adminBooking.data.tripId,
      adminBooking.id,
      statuse,
      hotelId,
      "cabs"
    );
    if (!file) {
      var bookingCab = adminBooking?.cabs?.filter((cab) => {
        return cab.id === hotelId;
      });
      if (status === "Booked" || status === "Booked,Payment Pending") {
        await actions.sendBookingStatusEmail({
          id: adminBooking?.data?.userDetails?.userid,
          name: adminBooking?.data?.userDetails?.firstName,
          email: adminBooking?.data?.userDetails?.email,
          fileUrl: null,
          tripName: adminBooking?.data?.tripName,
          typeName: cabTotal.cabCity,
          type: "Cab",
          booking: bookingCab,
          travellerDetails: adminBooking.data.travellerDetails,
        });
      }
    }
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
      "cabs"
    );
    var bookingCab = adminBooking?.cabs?.filter((cab) => {
      return cab.id === hotelId;
    });
    if (status === "Booked" || status === "Booked,Payment Pending") {
      await actions.sendBookingStatusEmail({
        id: adminBooking?.data?.userDetails?.userid,
        name: adminBooking?.data?.userDetails?.firstName,
        email: adminBooking?.data?.userDetails?.email,
        fileUrl: doc,
        tripName: adminBooking?.data?.tripName,
        typeName: cabTotal.cabCity,
        type: "Cab",
        booking: bookingCab,
        travellerDetails: adminBooking.data.travellerDetails,
      });
    }
    setFile(null);
    setOpenUpload(false);
  };

  var addTicketCost = async () => {
    await actions.addTicketCostAdmin(
      ticketCost,
      adminBooking.data.userDetails.userid,
      adminBooking.data.tripId,
      hotelId,
      adminBooking.id,
      "cabs"
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
      "cabs"
    );
    setOpenUpload(false);
  };

  var color = statuses.filter((status) => {
    return status?.status === cabData?.status;
  });
  var reqColor = reqStatuses.filter((status) => {
    return status?.status === cabData?.requestStatus;
  });
  const adminCabTrav = adminBooking?.data?.travellerDetails[cabId]?.adults;
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
  return (
    <>
      <Popup
        condition={pickUpPopup}
        close={() => {
          setPickUpPopup(false);
        }}
      >
        <div>
          <div className="flex gap-4 flex-wrap justify-center">
            <label className="flex flex-col">
              Pick up
              <textarea
                placeholder="Enter pick up point"
                className="h-[90px] border-[1px] border-black border-solid focus:outline-none rounded-md px-[5px] py-[4px] placeholder:text-sm"
                onChange={(e) => setPickUp(e.target.value)}
                value={pickUp}
              ></textarea>
            </label>
            {(cabType === "Airport to City center Hotel" ||
              cabType === "City center hotel to airport") && (
              <label className="flex flex-col">
                Drop
                <textarea
                  placeholder="Enter dropping point"
                  className="h-[90px] border-[1px] border-black border-solid focus:outline-none rounded-md px-[5px] py-[4px] placeholder:text-sm"
                  onChange={(e) => setDrop(e.target.value)}
                  value={drop}
                ></textarea>
              </label>
            )}
          </div>
          <button
            className="bg-[#000] text-white text-[14px] rounded-md py-[5px] px-[10px] mt-4 block m-auto"
            onClick={() => {
              if (pickUp === "" && drop === "") {
                return;
              }
              setSubmitIsOpen(true);
            }}
          >
            Add to trip
          </button>
        </div>
        {/* Delete the trip item */}
      </Popup>
      <Popup condition={alltimeStamp} close={() => setAllTimeStamp(false)}>
        <div>
          <p>
            Added Date :
            {cabData?.date &&
              format(new Date(cabData?.date?.seconds * 1000), "MMMM d, h:mm a")}
          </p>
          <p>
            Sent to Approval :{" "}
            {cabData?.manager_request_time
              ? format(
                  new Date(cabData?.manager_request_time * 1000),
                  "MMMM d, h:mm a"
                )
              : "Not Requested for Approval"}{" "}
          </p>
          <p>
            Approved Date :{" "}
            {cabData?.managerApprovedTime
              ? format(
                  new Date(cabData?.managerApprovedTime?.seconds * 1000),
                  "MMMM d, h:mm a"
                )
              : "Not Approved"}
          </p>
          <p>
            Submitted Date :{" "}
            {cabData?.submitted_date
              ? format(
                  new Date(cabData?.submitted_date?.seconds * 1000),
                  "MMMM d, h:mm a"
                )
              : "Not Submitted"}
          </p>
          <p>
            Booked Date :{" "}
            {cabData?.booked_date
              ? format(
                  new Date(cabData?.booked_date?.seconds * 1000),
                  "MMMM d, h:mm a"
                )
              : "Not Booked"}
          </p>
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
        condition={openUpload}
        close={() => {
          setOpenUpload(false);
        }}
      >
        <div className="admin-upload">
          {adminPage && (
            <div className="tripsPage-totalPrice-Desktop">
              <div className="tripsPage-totalPrice-section">
                <div className="tripsPage-totalPrice">
                  <div className="tripsPage-totalPrice-title">Cab price:</div>
                  <div className="tripsPage-totalPrice-price">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="tripsPage-totalPrice-price-icon"
                    />
                    {`${cabTotal.cabFinalPrice.toLocaleString("en-IN")} `}
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
                  {Math.ceil(cabTotal.finalServiceCharge)}
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
                  {Math.ceil(cabTotal.gstInFinalserviceCharge)}
                </div>
              </div>
              <div className="tripsPage-totalPrice-sections">
                <div className="tripsPage-totalPrice-title">Total price:</div>
                <div className="tripsPage-totalPrice-price">
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="tripsPage-totalPrice-price-icon"
                  />
                  {`${Math.ceil(cabTotal.cabTotalPrice).toLocaleString(
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
              {cabData?.downloadURL ? (
                <div className="flight-file">
                  <div onClick={handleAdminDownload}>
                    <FontAwesomeIcon
                      icon={faDownload}
                      onClick={() => downloadDoc(cabData.downloadURL)}
                    />
                    `{cabData?.downloadURL?.slice(0, 34)}...`
                  </div>
                </div>
              ) : null}
            </div>
            <div className="adminPage-main-statusSave">
              <div className="adminPage-main-status">
                <div className="adminPage-main-status-text">Status</div>
                <div className="adminPage-status-btn">
                  <select
                    onChange={async (e) => {
                      console.log(e.target.value);
                      await setStatus(e.target.value);
                    }}
                  >
                    <option>
                      {
                        statuses.filter(
                          (status1) => status1?.status === cabData?.status
                        )?.[0]?.status
                      }
                    </option>
                    {statuses
                      .filter((status1) => status1.status !== cabData?.status)
                      .map((status1) => (
                        <option value={status1?.status}>
                          {status1?.status}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            {bookingLoading ? (
              <button className="spin">
                <div className="spinner"></div>
              </button>
            ) : (
              <>
                {cabData?.status !== "Booked" &&
                  cabData?.status !== "Cancelled" && (
                    <button
                      disabled={
                        cabData?.status === "Booked" ||
                        cabData?.status === "Cancelled"
                      }
                      onClick={async () => {
                        setBookingLoading(true);
                        if (status === "Booked") {
                          actions.addInvoices(
                            adminTripDetails?.data?.userDetails?.userid,
                            adminTripDetails?.data?.tripId,
                            hotelId
                          );
                        }
                        if (status !== cabData.status) {
                          await handleClick(hotelId, status);
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
                          "cab",
                          adminTripid,
                          adminBooking.data.userDetails.userid,
                          cab?.ticketCost,
                          adminTripDetails?.data?.userDetails?.email,
                          "Manual"
                        );
                        await actions.getAdminTripById(adminTripid);
                        setBookingLoading(false);
                      }}
                    >
                      Save Details
                    </button>
                  )}
              </>
            )}
          </div>
        </div>
      </Popup>
      <Popup condition={openTravellers} close={() => setOpenTravellers(false)}>
        <div className="traveller-details-container">
          <div className="traveller-details-header">Traveller Details</div>
          {adminBooking?.data?.travellerDetails ? (
            <>
              {adminCabTrav &&
                adminCabTrav?.map((trav, i) => {
                  return <TravDetails type="Adults" index="1" trav={trav} />;
                })}
            </>
          ) : null}
        </div>
      </Popup>
      <Popup
        condition={openPriceInfo}
        close={() => {
          setOpenPriceInfo(false);
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
                    <span>Cab Price</span>
                  </div>
                  <div className="tripsPage-fare-fareItem-value">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="tripsPage-fare-fareItem-value-icon"
                    />
                    {` ${Math.ceil(cabTotal?.cabFinalPrice)}`}
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
                {Math.ceil(cabTotal?.finalServiceCharge)}
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
                {Math.ceil(cabTotal?.gstInFinalserviceCharge)}
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
              {` ${Math.ceil(cabTotal?.cabTotalPrice).toLocaleString("en-IN")}`}
            </div>
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
      <Popup condition={addTravellers} close={() => setAddTravellers(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-[100%]">
          <>
            {Array.from({ length: 1 }, (_, i) => {
              return (
                <div key={`adult-${i}`} className="gap-[10px] mt-[20px]">
                  <h1 className="font-bold text-center py-1">Adult-{i + 1}</h1>
                  <div className="gap-2 flex-wrap justify-center">
                    <div className="flex gap-[10px] items-center flex-wrap justify-center">
                      <label className="flex flex-col text-[12px]">
                        Title
                        <Controller
                          name={`adults[${i}].gender`}
                          control={control}
                          defaultValue={
                            i === 0 ? userAccountDetails.gender : ""
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
                    </div>
                    {i === 0 && (
                      <div className="flex gap-[10px] items-center my-2 flex-wrap justify-center">
                        <Controller
                          name={`adults[${i}].gender`}
                          control={control}
                          defaultValue={
                            i === 0 ? userAccountDetails.gender : ""
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
            })}
          </>

          <div className="flex gap-2 justify-center items-center mt-3">
            {cabData?.status === "Not Submitted" ? (
              <>
                {tripData?.data?.travellerDetails &&
                tripData?.data?.travellerDetails[totalCab?.id] ? (
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
        condition={cabLocationPopup}
        close={() => setCabLocationPopup(false)}
      >
        {(adminPage || tripsPage) && (
          <>
            <p>
              <span>Pickup: </span>
              {cabTotal.pickUp}
            </p>
            <p>
              <span>Drop :</span>
              {cabTotal.drop}
            </p>
          </>
        )}
      </Popup>
      <div
        className="cab-container"
        style={tripsPage ? getFlightStatusStyle(cabData?.status) : null}
      >
        <div className="cab-card">
          <div className="cab-img">
            <img src={cabImg?.[0]?.image} alt="Cab" />
          </div>
          <div className="cab-card-details">
            <div className="cab-header">
              <div className="cab-header-name">
                <span>{cab.carType}</span>({cab.passenger} Seater)
              </div>
              {tripsPage || adminPage ? <div>{tripsCabType}</div> : null}
              <div className="cab-header-date">
                {tripsPage || adminPage || approvePage ? (
                  <>
                    {`${new Date(startDate.seconds * 1000)
                      ?.toString()
                      ?.slice(4, 10)} ${endDate ? "-" : ""} ${
                      endDate
                        ? new Date(endDate.seconds * 1000)
                            ?.toString()
                            ?.slice(4, 10)
                        : ""
                    } `}
                    {`(${
                      cabTotal?.cabNights > 0 && cabTotal?.cabNights === 1
                        ? cabTotal?.cabNights + " Trip"
                        : cabTotal?.cabNights + " days"
                    })`}
                  </>
                ) : (
                  <>
                    {`${cabStartDate?.toString()?.slice(4, 10)} ${
                      cabEndDate ? "-" : ""
                    } ${
                      cabEndDate ? cabEndDate?.toString()?.slice(4, 10) : ""
                    } `}
                    {`(${
                      cabNights > 0 && cabEndDate ? cabNights + "days" : "Trip"
                    })`}
                    {/* {`${cabEndDate }`} */}
                  </>
                )}
              </div>
            </div>
            <div className="cab-body">
              <p className="text-[9pt] md:text-[16px] font-bold">
                <span className="font-semibold !text-[9pt] md:!text-[16px]">
                  No of Cabs-{cabData?.data?.cabCount}
                </span>
                {tripsPage ? <>{countCab}</> : <>{cabCount}</>}
              </p>
              <span>{cab.notes}</span>
              {adminPage || tripsPage ? <span>{cabTotal?.cabCity}</span> : null}
              {adminPage && (
                <div>
                  <FaTaxi
                    size={18}
                    className="cursor-pointer"
                    onClick={() => setCabLocationPopup(true)}
                  />
                </div>
              )}
              <div className="cab-header-price">
                <span>
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="cab-header-price-icon"
                  />
                  {Number(cab.price).toLocaleString()}&nbsp;
                  {cabs.includes(cabType) ? "per trip" : "per day"}
                </span>
              </div>
              <div className="cab-header-price">
                <span>
                  {!adminPage && !tripsPage ? (
                    <>
                      {" "}
                      <span>Total: </span>
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="cab-header-price-icon"
                      />
                      {cabFinalPrice}
                    </>
                  ) : null}
                </span>
                {!tripsPage && !adminPage ? (
                  <span className="cab-header-service">
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="cab-header-price-icon-add"
                    />
                    {cabService}% service fee
                  </span>
                ) : null}
              </div>
              {/* {!tripsPage && !adminPage ? (
                <button
                  onClick={() => {
                    // setSubmitIsOpen(true);
                    setPickUpPopup(true);
                  }}
                >
                  Add to trip
                </button>
              ) : null} */}
            </div>
          </div>
        </div>
        {tripsPage || adminPage ? (
          <>
            <div className="seperate"></div>
            {tripsPage && !adminPage ? (
              <>
                <div className="timestamp">
                  <div>
                    {cabData?.requestStatus === "Pending" ||
                    cabData?.status === "Submitted" ||
                    cabData?.status === "Booked" ||
                    cabData?.requestStatus === "Approved" ? null : (
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="delete-icon"
                        onClick={() => setOpenDelete(true)}
                      />
                    )}
                  </div>
                  <div
                    onClick={() => {
                      console.log(cabData);
                      console.log(tripData);
                      setTimeStampData(tripData);
                      setAllTimeStamp(true);
                    }}
                  >
                    <LuAlarmClock size={15} className="cursor-pointer" />
                  </div>
                  <div>
                    Pick up Time:
                    <span className="font-bold">{cabTotal.selectedTime}</span>
                  </div>
                  <div>
                    <FaTaxi
                      size={18}
                      className="cursor-pointer"
                      onClick={() => setCabLocationPopup(true)}
                    />
                  </div>
                  <div>
                    {/* Added:&nbsp;
                    <span>
                      {new Date(cabData?.date?.seconds * 1000)
                        .toString()
                        .slice(4, 24)}
                    </span> */}
                  </div>
                  <div className="cab-header-price">
                    Total Price:{" "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="cab-header-price-icon"
                    />
                    {`${Math.ceil(cabTotal.cabTotalPrice).toLocaleString(
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
                    console.log(cabData);
                    console.log(tripData);
                    setTimeStampData(tripData);
                    setAllTimeStamp(true);
                  }}
                >
                  <LuAlarmClock size={15} className="cursor-pointer" />
                </div>
              )}
              {
                <div className="request-status">
                  Approval Status:
                  <span
                    style={{
                      background: reqColor?.[0]
                        ? reqColor?.[0]?.color
                        : "#808080",
                    }}
                  >
                    {cabData?.requestStatus}
                  </span>
                </div>
              }
              {cabData ? (
                <div className="flight-main-status">
                  {cabData?.status ? (
                    <div className="flightStatus">
                      Booking Status:
                      <span style={{ background: color?.[0]?.color }}>
                        {cabData?.status}
                      </span>
                    </div>
                  ) : null}
                  {cabData?.downloadURL && tripsPage ? (
                    <div
                      className="flightResults-list-flightCard-download"
                      onClick={downloadDoc}
                    >
                      Voucher&nbsp;
                      <FontAwesomeIcon icon={faDownload} />
                    </div>
                  ) : null}
                  {cabData?.downloadURL && userPage ? (
                    <div
                      className="flightResults-list-flightCard-download"
                      onClick={downloadDoc}
                    >
                      Voucher&nbsp;
                      <FontAwesomeIcon icon={faDownload} />
                    </div>
                  ) : null}
                  {adminPage && (
                    <div className="cab-header-price">
                      Total Price:{" "}
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="cab-header-price-icon"
                      />
                      {`${Math.ceil(cabTotal.cabTotalPrice).toLocaleString(
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
                </div>
              ) : null}

              {tripsPage ? (
                <div>
                  {tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[totalCab?.id] ? (
                    <Button
                      sx={{ position: "static", fontSize: "11px" }}
                      className="!bg-[#94d2bd] !text-black"
                      size="small"
                      onClick={() => {
                        console.log(totalCab.id);

                        setNewTravellerDetails(
                          () => tripData?.data?.travellerDetails[totalCab.id]
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
                        console.log(totalCab.id);

                        // setNewTravellerDetails(
                        //   () => tripData?.data?.travellerDetails[totalCab.id]
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
            {userPage ? (
              <>
                {isThere && (
                  <button onClick={() => {}}>
                    <PDFDownloadLink
                      document={
                        <InvoicePdf1
                          type="Cab"
                          item={`${cabTotal?.cabCity} - ${tripsCabType}`}
                          date={`${new Date(startDate.seconds * 1000)
                            ?.toString()
                            ?.slice(4, 10)} ${endDate ? "-" : ""} ${
                            endDate
                              ? new Date(endDate.seconds * 1000)
                                  ?.toString()
                                  ?.slice(4, 10)
                              : ""
                          } `}
                          cost={cabTotal?.cabFinalPrice}
                          service={cabTotal?.finalServiceCharge}
                          gst={`${Math.ceil(
                            cabTotal?.gstInFinalserviceCharge
                          )}`}
                          totalCost={` ${Math.ceil(
                            cabTotal?.cabTotalPrice
                          ).toLocaleString("en-IN")}`}
                          userAccountDetails={user}
                          invoiceId={isThere.invoiceId}
                          tripData={userPage ? adminTripdata : tripData}
                          cabData={cabData}
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
                          type="Cab"
                          item={`${cabTotal?.cabCity} - ${tripsCabType}`}
                          date={`${new Date(startDate.seconds * 1000)
                            ?.toString()
                            ?.slice(4, 10)} ${endDate ? "-" : ""} ${
                            endDate
                              ? new Date(endDate.seconds * 1000)
                                  ?.toString()
                                  ?.slice(4, 10)
                              : ""
                          } `}
                          cost={cabTotal?.cabFinalPrice}
                          service={cabTotal?.finalServiceCharge}
                          gst={`${Math.ceil(
                            cabTotal?.gstInFinalserviceCharge
                          )}`}
                          totalCost={` ${Math.ceil(cabTotal?.cabTotalPrice)}`}
                          userAccountDetails={userAccountDetails}
                          invoiceId={isThere.invoiceId}
                          tripData={tripData}
                          cabData={cabData}
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

        {adminPage ? (
          <>
            <div className="seperate"></div>
            <div className="hotel-card-admin-details-upload">
              {cabData.downloadURL ? (
                <div className="hotel-file">
                  <div
                    onClick={() => {
                      handleAdminDownload(cab.downloadURL);
                    }}
                  >
                    <FontAwesomeIcon icon={faDownload} />`
                    {cabData.downloadURL.slice(0, 14)}...`
                  </div>
                </div>
              ) : null}
              {cabData.ticketCost ? (
                <div className="hotel-ticket-cost">
                  Ticket Cost:{" "}
                  <span>
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelInfo-roomDtls-room-price-icon"
                    />{" "}
                    {cabData.ticketCost}
                  </span>
                </div>
              ) : null}
              {cabData.note ? (
                <div className="flight-ticket-cost">Note: {cab.note}</div>
              ) : null}
              {cabData?.note || cabData?.ticketCost || cabData?.downloadURL ? (
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="upload-icon"
                  onClick={() => {
                    setOpenUpload(true);
                    setStatus(cab.status);
                    setNote(cab.note ? cab.note : "");
                    setTicketCost(cab.ticketCost ? cab.ticketCost : "");
                    setHotelId(cabData.id);
                  }}
                />
              ) : null}
            </div>
            {cabData?.note || cabData?.ticketCost || cabData?.downloadURL ? (
              <div className="seperate"></div>
            ) : null}
            {bookingPage && (
              <div className="hotel-card-admin-details">
                <div
                  className="hotel-card-upload"
                  onClick={() => {
                    setOpenUpload(true);
                    setStatus(cabData.status);
                    setNote(cabData.note ? cabData.note : "");
                    setTicketCost(cabData.ticketCost ? cabData.ticketCost : "");
                    setHotelId(cabData.id);
                  }}
                >
                  <FontAwesomeIcon icon={faUpload} />
                  &nbsp; Booking
                </div>
                <div className="hotel-travellers">
                  <button
                    onClick={() => {
                      setOpenTravellers(!openTravellers);
                      console.log(cabData);
                      setCabId(cabData.id);
                    }}
                  >
                    Traveller Details
                  </button>
                </div>
              </div>
            )}
            {userPage && (
              <div className="hotel-card-admin-details">
                <div className="hotel-travellers">
                  <button
                    onClick={() => {
                      console.log(adminBooking);
                      setOpenTravellers(!openTravellers);
                      console.log(cabData);
                      setCabId(cabData.id);
                    }}
                  >
                    Traveller Details
                  </button>
                </div>
              </div>
            )}
          </>
        ) : null}
        {cabData?.note && (
          <p className="ml-[10pt] text-[10pt]">Note:{cabData?.note}</p>
        )}
      </div>
    </>
  );
};

export default Cab;
