import React, { useState, useContext } from "react";
import MyContext from "../../Context";
import LoadingProg from "../../Loading/LoadingProg";
import "./HotelInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
  faBan,
  faCheckCircle,
  faChevronUp,
  faIndianRupeeSign,
  faLeftLong,
  faPlus,
  faStar,
  faStarHalf,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import HotelDesc from "../HotelDesc/HotelDesc";
import HotelImages from "../HotelImages/HotelImages";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../../Popup";
import Navbar from "../../Flights/FlightSearch/Navbar";

function HotelInfo({ userAdmin }) {
  const { userFromAdmin, tripFromAdmin } = useParams();
  const [breakfastFilter, setBreakfastFilter] = useState(false);
  const [cancelFilter, setCancelFilter] = useState(false);
  const [hotelDesc, setHotelDesc] = useState(false);
  const [hotelImages, setHotelImages] = useState(false);
  const [submitIsOpen, setSubmitIsOpen] = useState(false);
  const [adminSubmitIsOpen, setAdminSubmitIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [fareIsOpen, setFareIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    hotelInfoRes,
    fetchingHotelInfo,
    actions,
    bookingHotel,
    selectedTripId,
    selectedTrip,
    userTripStatus,
    hotelStaticData,
    userId,
    domesticHotel,
    hotelSessionExpiredPopup,
    hotelSessionExpired,
    adminUserId,
    adminUserTrips,
  } = useContext(MyContext);

  var rating = [];
  var starRating = hotelInfoRes?.hotelSearchRes?.StarRating;
  var starRatingFull = Math.floor(starRating);

  var addtoTrip = async (id) => {
    if (!hotelSessionExpired) {
      await actions.editTripById(id, bookingHotel, "hotels");
      //await actions.getAllTrips(userAccountDetails?.userid);
      await actions.getLastDoc();
    } else {
      actions.setHotelSessionPopup(true);
    }
  };

  const toggleUp = (e, id) => {
    actions.toggleUp(e, id, fareIsOpen);
    setFareIsOpen((prev) => !prev);
  };

  const myDate = new Date();
  const myString =
    bookingHotel?.hotelSearchQuery?.cityDestName?.split(",")[0].trim() + "trip";

  const navigate = useNavigate();

  const formattedDate = `${myDate.toLocaleString("default", {
    month: "long",
  })} ${myDate.getDate()}`;
  const combinedString = `${myString}_${formattedDate}`;
  var [defaultInput, setDefaultInput] = useState(combinedString);

  var getTime = (seconds) => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    var dateString = `${month} ${dayOfWeek}`;
    return dateString;
  };
  for (var i = 1; i <= Math.ceil(starRating); i++) {
    if (i > starRatingFull) {
      rating.push(
        <FontAwesomeIcon
          icon={faStarHalf}
          className="hotelInfo-starRating-icon"
        />
      );
    } else {
      rating.push(
        <FontAwesomeIcon icon={faStar} className="hotelInfo-starRating-icon" />
      );
    }
  }
  var adults = bookingHotel?.hotelSearchQuery?.hotelRoomArr.reduce(
    (acc, obj) => {
      acc.adults += parseInt(obj.adults, 10);
      acc.child += parseInt(obj.child, 10);
      return acc;
    },
    { adults: 0, child: 0 }
  );

  var handleInputChange = (e) => {
    setDefaultInput(e.target.value);
  };

  var adminAddToTrip = async (id) => {
    await actions.editTripByIdAdmin(id, bookingHotel, "hotels", adminUserId);
  };

  var handleAdminAddToTrip = async () => {
    if (!hotelSessionExpired) {
      setLoading(true);
      var newtripid = await actions.createAdminNewTrip(
        defaultInput,
        "hotels",
        bookingHotel,
        adminUserId
      );
      navigate(`users/${adminUserId}/trips/${newtripid}`, {
        state: { userId: userId },
      });
      setLoading(false);
    } else {
      actions.setHotelSessionPopup(true);
    }
  };

  console.log(bookingHotel);
  var handleAddToTrip = async () => {
    if (!hotelSessionExpired) {
      setLoading(true);
      var details = [];
      for (let i = 0; i <= bookingHotel.travellers; i++) {
        details.push({
          firstName: "",
          lastName: "",
          type: i + 1 <= bookingHotel.travellers.adults ? "Adult" : "Child",
        });
      }
      var newtripid = await actions.createNewTrip(
        defaultInput,
        "hotels",
        bookingHotel,
        details
      );
      navigate(`/trips/${newtripid}`, { state: { userId: userId } });
      setLoading(false);
      //await actions.getAllTrips(userId)
      await actions.getLastDoc();
    } else {
      actions.setHotelSessionPopup(true);
    }
  };

  //console.log(bookingHotel);

  if (fetchingHotelInfo) {
    return (
      <LoadingProg
        condition={fetchingHotelInfo}
        loadingText="Getting Hotel Info"
        progEnd={fetchingHotelInfo}
        progTime={25}
      />
      //<>Loading...</>
    );
  }

  // console.log(hotelInfoRes.roomResult?.GetHotelRoomResult?.HotelRoomsDetails[0]);
  //console.log(bookingHotel?.hotelSearchQuery?.cityDestName?.split(',')[0].trim());
  //console.log(hotelInfoRes.roomResult?.GetHotelRoomResult?.HotelRoomsDetails);
  //console.log(hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.Description);
  //console.log(bookingHotel);
  return (
    <>
      {hotelInfoRes?.hotelInfo?.HotelInfoResult ? (
        <>
          <Popup
            condition={hotelSessionExpiredPopup}
            close={() => {
              actions.setHotelSessionPopup(false);
            }}
          >
            Your session has expired please start the hotel search again.
            <div>
              <button
                onClick={() => {
                  actions.backToHotelSearchPage();
                  actions.setHotelSessionPopup(false);
                }}
              >
                OK
              </button>
            </div>
          </Popup>
          <Popup condition={submitIsOpen} close={() => setSubmitIsOpen(false)}>
            <div className="hotelBook-createNew">
              <div className="hotelBook-bar-content">
                <div className={`bar-fill ${activeTab}`} />
              </div>
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
                      <div className="tripsPage-change">OR</div>
                      <span className="tripsPage-createTrip-header">
                        Select an existing trip
                      </span>
                      {userTripStatus
                        ? userTripStatus?.userTrips
                            .sort((a, b) => {
                              var aTime = new Date(
                                a?.data?.date?.seconds * 1000
                              );
                              var bTime = new Date(
                                b?.data?.date?.seconds * 1000
                              );
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
                      <span>Enter new trip details</span>
                      <textarea
                        id="multiline-input"
                        name="multiline-input"
                        type="text"
                        value={defaultInput}
                        onChange={handleInputChange}
                        placeholder="Enter the name of your trip"
                      />
                      {/* {loading ? (
                        <button className="spin">
                          <div className="spinner"></div>
                        </button>
                      ) : (
                        <button onClick={handleAddToTrip}>Add to trip</button>
                      )} */}
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
                      {adminUserTrips?.length > 0
                        ? adminUserTrips
                            ?.sort((a, b) => {
                              var aTime = new Date(
                                a?.data?.date?.seconds * 1000
                              );
                              var bTime = new Date(
                                b?.data?.date?.seconds * 1000
                              );
                              return bTime - aTime;
                            })
                            ?.map((trip) => {
                              var date = getTime(trip?.data?.date?.seconds);
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
                                  <p>{date}</p>
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

                      {/* {loading ? (
                        <button className="spin">
                          <div className="spinner"></div>
                        </button>
                      ) : (
                        <button onClick={handleAdminAddToTrip}>
                          Add to trip
                        </button>
                      )} */}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </Popup>
          <HotelDesc
            condition={hotelDesc}
            close={() => setHotelDesc(false)}
            location={
              hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.HotelName
            }
            description={
              hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.Description
            }
          />
          <HotelImages
            condition={hotelImages}
            close={() => setHotelImages(false)}
            images={
              hotelInfoRes?.hotelInfo?.HotelInfoResult?.HotelDetails?.Images
                ? [
                    ...hotelInfoRes?.hotelInfo?.HotelInfoResult?.HotelDetails
                      ?.Images,
                  ]
                : []
            }
          />
          <Navbar />
          <div className="hotelRes-main">
            <div className="hotelInfo-block">
              <div className="hotelInfo-header">
                <div className="hotelInfo-header-back">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="hotelInfo-header-back-icon"
                    onClick={() => actions.backToHotelResPage()}
                  />
                </div>
              </div>
              <div className="hotelInfo-section">
                <div className="hotelInfo-header-section">
                  <div className="hotelInfo-imgs">
                    <div
                      className="hotelInfo-img"
                      onClick={() => setHotelImages(true)}
                    >
                      <img
                        src={
                          hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails
                            .Images
                            ? hotelInfoRes.hotelInfo.HotelInfoResult
                                .HotelDetails.Images[0]
                            : ""
                        }
                        alt="mainImg"
                      />
                    </div>
                  </div>
                  <div className="hotelInfo-namePrice">
                    <div className="hotelInfo-name">
                      {bookingHotel?.hotelName
                        ? bookingHotel?.hotelName
                        : hotelStaticData[bookingHotel?.hotelCode]?.HotelName}
                      <div className="hotelInfo-starRating">
                        {rating.map((star) => {
                          return star;
                        })}
                      </div>
                    </div>
                    <div className="hotelInfo-price">
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="hotelInfo-price-icon"
                      />
                      {`${
                        hotelInfoRes.hotelSearchRes.Price.OfferedPriceRoundedOff
                          ? hotelInfoRes.hotelSearchRes.Price.OfferedPriceRoundedOff.toLocaleString(
                              "en-IN"
                            )
                          : hotelInfoRes.hotelSearchRes.Price.PublishedPriceRoundedOff.toLocaleString(
                              "en-IN"
                            )
                      }`}
                    </div>
                    <div className="hotelInfo-location-Desktop">
                      {hotelInfoRes.hotelSearchRes.HotelLocation ? (
                        <div className="hotelInfo-address">
                          <span>Location:</span>
                          {`${hotelInfoRes.hotelSearchRes.HotelLocation}`}
                        </div>
                      ) : null}
                      <div className="hotelInfo-address">
                        <span>Address:</span>
                        {`${hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.Address}`}
                      </div>
                      {hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails
                        .Description ? (
                        <div className="hotelInfo-description">
                          Description
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="hotelInfo-description-icon"
                            onClick={() => setHotelDesc(true)}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="hotelInfo-location-Mobile">
                  {hotelInfoRes.hotelSearchRes.HotelLocation ? (
                    <div className="hotelInfo-address">
                      <span>Location:</span>
                      {`${hotelInfoRes.hotelSearchRes.HotelLocation}`}
                    </div>
                  ) : null}
                  <div className="hotelInfo-address">
                    <span>Address:</span>
                    {`${hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.Address}`}
                  </div>
                  {hotelInfoRes.hotelSearchRes.HotelDescription ? (
                    <div className="hotelInfo-description">
                      {hotelInfoRes.hotelSearchRes.HotelDescription.slice(
                        0,
                        60
                      ) + "..."}
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="hotelInfo-description-icon"
                        onClick={() => setHotelDesc(true)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="hotelInfo-details">
                <div className="hotelInfo-details-date">
                  {`${bookingHotel?.hotelSearchQuery?.checkInDate.toLocaleString(
                    "default",
                    { month: "long" }
                  )} ${bookingHotel.hotelSearchQuery.checkInDate.getDate()}, ${bookingHotel?.hotelSearchQuery?.checkInDate.getFullYear()}`}{" "}
                  -{" "}
                  {`${bookingHotel?.hotelSearchQuery?.checkOutDate.toLocaleString(
                    "default",
                    { month: "long" }
                  )} ${bookingHotel.hotelSearchQuery.checkOutDate.getDate()}, ${bookingHotel?.hotelSearchQuery?.checkOutDate.getFullYear()}`}
                  ,&nbsp;
                  {bookingHotel.hotelSearchQuery.hotelNights} Nights
                </div>
                <div className="hotelInfo-details-passengers">
                  Adults-{adults?.adults},&nbsp;Children-{adults?.child}
                </div>
              </div>
              <div className="hotelInfo-roomDtls-block">
                <div className="hotelInfo-roomDtls-title">Room details</div>
                <div className="hotelInfo-roomDtls-tabs">
                  {bookingHotel.selectedRoomType &&
                    bookingHotel.selectedRoomType.map((room, r) => {
                      return (
                        <div
                          className={
                            r === selectedRoom
                              ? "hotelInfo-roomDtls-tab hotelInfo-roomDtls-tab-selected"
                              : "hotelInfo-roomDtls-tab"
                          }
                          onClick={() => setSelectedRoom(r)}
                        >
                          {`Room ${r + 1}`}
                        </div>
                      );
                    })}
                </div>
                <div className="hotelInfo-roomDtls-roomTypes-section">
                  <div className="hotelInfo-roomDtls-filters">
                    <div
                      className={
                        breakfastFilter
                          ? "hotelInfo-roomDtls-filter hotelInfo-roomDtls-filter-selected"
                          : "hotelInfo-roomDtls-filter"
                      }
                      onClick={() => setBreakfastFilter((prev) => !prev)}
                    >
                      Breakfast
                    </div>
                    <div
                      className={
                        cancelFilter
                          ? "hotelInfo-roomDtls-filter hotelInfo-roomDtls-filter-selected"
                          : "hotelInfo-roomDtls-filter"
                      }
                      onClick={() => setCancelFilter((prev) => !prev)}
                    >
                      Refundable
                    </div>
                  </div>
                  <div className="hotelInfo-roomDtls-list">
                    {hotelInfoRes.roomResult?.GetHotelRoomResult
                      ?.HotelRoomsDetails &&
                      hotelInfoRes.roomResult?.GetHotelRoomResult?.HotelRoomsDetails.filter(
                        (room, r) => {
                          if (breakfastFilter && cancelFilter) {
                            if (
                              actions
                                .checkForTboMeals(room.Inclusion)
                                .includes("Breakfast") &&
                              actions.validCancelDate(room.LastCancellationDate)
                            ) {
                              return true;
                            }
                            return false;
                          } else if (breakfastFilter) {
                            if (
                              actions
                                .checkForTboMeals(room.Inclusion)
                                .includes("Breakfast")
                            ) {
                              return true;
                            }
                            return false;
                          } else if (cancelFilter) {
                            if (
                              actions.validCancelDate(room.LastCancellationDate)
                            ) {
                              return true;
                            }
                            return false;
                          }
                          return true;
                        }
                      ).map((room, r) => {
                        return (
                          <div
                            className={
                              bookingHotel.selectedRoomType[selectedRoom] &&
                              bookingHotel.selectedRoomType[selectedRoom]
                                .RoomTypeCode === room?.RoomTypeCode &&
                              bookingHotel.selectedRoomType[selectedRoom]
                                .LastCancellationDate ===
                                room?.LastCancellationDate &&
                              bookingHotel.selectedRoomType[selectedRoom].Price
                                .OfferedPriceRoundedOff ===
                                room?.Price.OfferedPriceRoundedOff &&
                              bookingHotel.selectedRoomType[selectedRoom]
                                .SequenceNo === room?.SequenceNo
                                ? "hotelInfo-roomDtls-room hotelInfo-roomDtls-room-selected"
                                : "hotelInfo-roomDtls-room"
                            }
                            onClick={() =>
                              actions.selectHotelRoomType(room, selectedRoom, r)
                            }
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
                </div>
              </div>
            </div>
            <div className="hotelInfo-totalPrice-Mobile">
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
                {bookingHotel?.selectedRoomType &&
                  bookingHotel?.selectedRoomType?.map((room, r) => {
                    return (
                      <div
                        className={
                          bookingHotel.selectedRoomType[selectedRoom] &&
                          bookingHotel.selectedRoomType[selectedRoom]
                            .RoomTypeCode === room?.RoomTypeCode
                            ? "hotelInfo-roomDtls-room hotelInfo-roomDtls-room-selected"
                            : "hotelInfo-roomDtls-room"
                        }
                        onClick={() =>
                          actions.selectHotelRoomType(room, selectedRoom, r)
                        }
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
                      </div>
                    );
                  })}
                <div className="flightBook-fare-fareItem flightBook-fare-fareItem-flightFare">
                  <div className="flightBook-fare-fareItem-title">
                    Hotel Price
                  </div>
                  <div className="flightBook-fare-fareItem-value">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="flightBook-fare-fareItem-value-icon"
                    />
                    {`${bookingHotel.hotelFinalPrice.toLocaleString("en-IN")} `}
                  </div>
                </div>
                <div className="flightBook-fare-fareItem !flex !justify-between !items-center">
                  <div className="flightBook-fare-fareItem-title">
                    Service Charges
                  </div>
                  <div className="flightBook-fare-fareItem-value">
                    {"+ "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="flightBook-fare-fareItem-value-icon"
                    />
                    {Math.ceil(bookingHotel.hotelServiceCharge)}
                  </div>
                </div>
                <div className="flightBook-fare-fareItem !flex !justify-between !items-center">
                  <div className="flightBook-fare-fareItem-title">GST</div>
                  <div className="flightBook-fare-fareItem-value">
                    {"+ "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="flightBook-fare-fareItem-value-icon"
                    />
                    {Math.ceil(bookingHotel.calculateGstFromService)}
                  </div>
                </div>
              </div>
              <div className="hotelInfo-fare-box">
                <div className="hotelInfo-totalPrice-section">
                  <div className="hotelInfo-totalPrice-title">Total price:</div>
                  <div className="hotelInfo-totalPrice-price">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelInfo-totalPrice-price-icon"
                    />
                    {`${Math.ceil(bookingHotel.hotelTotalPrice).toLocaleString(
                      "en-IN"
                    )} `}
                  </div>
                </div>
                {/* <div className="flightBook-fare-submit">
                  {adminUserId ? (
                    <button
                      onClick={() => {
                        setAdminSubmitIsOpen(true);
                      }}
                    >
                      Add to trip
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
                                actions.editTripById(
                                  selectedTripId,
                                  bookingHotel,
                                  "hotels"
                                );
                                navigate(`/trips/${selectedTripId}`);
                              }}
                              className="hotelBook-addData"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => {
                                actions.backToHotelResPage();
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
                            setDefaultInput(combinedString);
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
            <div className="hotelInfo-totalPrice-Desktop">
              <div className="hotelInfo-totalPrice-section">
                {bookingHotel?.selectedRoomType &&
                  bookingHotel?.selectedRoomType?.map((room, r) => {
                    return (
                      <div
                        className={
                          bookingHotel.selectedRoomType[selectedRoom] &&
                          bookingHotel.selectedRoomType[selectedRoom]
                            .RoomTypeCode === room?.RoomTypeCode
                            ? "hotelInfo-roomDtls-room hotelInfo-roomDtls-room-selected"
                            : "hotelInfo-roomDtls-room"
                        }
                        onClick={() =>
                          actions.selectHotelRoomType(room, selectedRoom, r)
                        }
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
                      </div>
                    );
                  })}
                <div className="hotelInfo-totalPrice">
                  <div className="hotelInfo-totalPrice-title">Room price:</div>
                  <div className="hotelInfo-totalPrice-price">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelInfo-totalPrice-price-icon"
                    />
                    {`${bookingHotel.hotelFinalPrice.toLocaleString("en-IN")} `}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center my-1">
                <div className="flightBook-fare-fareItem-title">
                  Service Charges
                </div>
                <div className="flightBook-fare-fareItem-value">
                  {"+ "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightBook-fare-fareItem-value-icon"
                  />
                  {/* {Math.ceil((bookingHotel.hotelFinalPrice * domesticHotel) / 100)} */}
                  {Math.ceil(bookingHotel.hotelServiceCharge)}
                </div>
              </div>
              <div className="flex justify-between items-center my-1">
                <div className="flightBook-fare-fareItem-title">GST</div>
                <div className="flightBook-fare-fareItem-value">
                  {"+ "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightBook-fare-fareItem-value-icon"
                  />
                  {/* {Math.ceil((bookingHotel.hotelFinalPrice * domesticHotel) / 100)} */}
                  {/* {bookingHotel.hotelServiceCharge} */}
                  {Math.ceil(bookingHotel.calculateGstFromService)}
                </div>
              </div>
              <div className="hotelInfo-totalPrice-sections">
                <div className="hotelInfo-totalPrice-title">Total price:</div>
                <div className="hotelInfo-totalPrice-price">
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelInfo-totalPrice-price-icon"
                  />
                  {Math.round(bookingHotel.hotelTotalPrice)}
                </div>
              </div>
              {/* <div className="flightBook-fare-submit">
                {userAdmin ? (
                  <button
                    onClick={() => {
                      actions.editTripById(
                        tripFromAdmin,
                        bookingHotel,
                        "hotels",
                        userFromAdmin
                      );
                      navigate(
                        `/users/${userFromAdmin}/trips/${tripFromAdmin}`
                      );
                    }}
                  >
                    Add to Trip
                  </button>
                ) : (
                  <>
                    {adminUserId ? (
                      <button
                        onClick={() => {
                          setAdminSubmitIsOpen(true);
                        }}
                      >
                        Add to trip
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
                                  actions.editTripById(
                                    selectedTripId,
                                    bookingHotel,
                                    "hotels"
                                  );
                                  navigate(`/trips/${selectedTripId}`);
                                }}
                                className="hotelBook-addData"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => {
                                  actions.backToHotelResPage();
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
                              setDefaultInput(combinedString);
                            }}
                          >
                            Add to trip
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div> */}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="hotelRes-main">
            <div className="hotelInfo-block">
              <div className="hotelInfo-header">
                <div className="hotelInfo-header-back">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="hotelInfo-header-back-icon"
                    onClick={() => actions.backToHotelResPage()}
                  />
                </div>
              </div>
              <div className="hotelInfo-section">
                The selected hotel is not available, Please select another hotel
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default HotelInfo;
