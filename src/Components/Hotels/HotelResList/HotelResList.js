import React, { useState, useContext } from "react";
import MyContext from "../../Context";
import LoadingProg from "../../Loading/LoadingProg";
import "./HotelResList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faFilter,
  faIndianRupeeSign,
  faPencil,
  faStar,
  faStarHalf,
} from "@fortawesome/free-solid-svg-icons";
import HotelInfo from "../HotelInfo/HotelInfo";
import HotelDesc from "../HotelDesc/HotelDesc";
import Navbar from "../../Flights/FlightSearch/Navbar";
import Popup from "../../Popup";

function HotelResList({ userAdmin, addedFromAdmin }) {
  var [hotelDesc, setHotelDesc] = useState(false);
  var [location, setLocation] = useState("");
  var [address, setAddress] = useState("");
  var [description, setDescription] = useState("");
  var [price, setPrice] = useState();
  var [rating, setRating] = useState();
  var [count, setCount] = useState(0);
  var [isRatingSelected, setIsRatingSelected] = useState(null);
  var [isPriceSelected, setIsPriceSelected] = useState(null);
  var [showFilters, setShowFilters] = useState(false);
  var [showName, setShowName] = useState(false);

  var {
    searchingHotels,
    hotelResList,
    actions,
    fetchingHotelInfo,
    hotelInfoRes,
    hotelSearchName,
    hotelSearchCheckIn,
    hotelSearchCheckOut,
    hotelSearchAdults,
    hotelSearchChild,
    hotelSearchNights,
    hotelSearchText,
    hotelRating,
    hotelStaticData,
    hotelRooms,
    recommondedHotels,
    hotelImageList,
    hotelErrorMessage,
    cityHotel,
    hotelSessionExpiredPopup,
  } = useContext(MyContext);

  var price0to1and5k = Array.isArray(hotelResList)
    ? hotelResList
        ?.filter((hotel) => {
          var staticData = hotelStaticData[hotel.HotelCode];
          var hotelName = hotel.HotelName
            ? hotel.HotelName
            : staticData?.HotelName;
          return hotelName?.length > 0;
        })
        .filter((hotel) => {
          return hotel.Price.OfferedPriceRoundedOff < 1500 * hotelSearchNights;
        }).length
    : null;

  var price1and5kto2and5k = Array.isArray(hotelResList)
    ? hotelResList
        ?.filter((hotel) => {
          var staticData = hotelStaticData[hotel.HotelCode];
          var hotelName = hotel.HotelName
            ? hotel.HotelName
            : staticData?.HotelName;
          return hotelName?.length > 0;
        })
        ?.filter((hotel) => {
          return (
            hotel.Price.OfferedPriceRoundedOff >= 1500 * hotelSearchNights &&
            hotel.Price.OfferedPriceRoundedOff < 2500 * hotelSearchNights
          );
        }).length
    : null;
  var price2and5kto4k = Array.isArray(hotelResList)
    ? hotelResList
        ?.filter((hotel) => {
          var staticData = hotelStaticData[hotel.HotelCode];
          var hotelName = hotel.HotelName
            ? hotel.HotelName
            : staticData?.HotelName;
          return hotelName?.length > 0;
        })
        ?.filter((hotel) => {
          return (
            hotel.Price.OfferedPriceRoundedOff >= 2500 * hotelSearchNights &&
            hotel.Price.OfferedPriceRoundedOff < 4000 * hotelSearchNights
          );
        }).length
    : null;

  var price4kto6k = Array.isArray(hotelResList)
    ? hotelResList
        ?.filter((hotel) => {
          var staticData = hotelStaticData[hotel.HotelCode];
          var hotelName = hotel.HotelName
            ? hotel.HotelName
            : staticData?.HotelName;
          return hotelName?.length > 0;
        })
        ?.filter((hotel) => {
          return (
            hotel.Price.OfferedPriceRoundedOff >= 4000 * hotelSearchNights &&
            hotel.Price.OfferedPriceRoundedOff < 6000 * hotelSearchNights
          );
        }).length
    : null;

  var price6kto8k = Array.isArray(hotelResList)
    ? hotelResList
        ?.filter((hotel) => {
          var staticData = hotelStaticData[hotel.HotelCode];
          var hotelName = hotel.HotelName
            ? hotel.HotelName
            : staticData?.HotelName;
          return hotelName?.length > 0;
        })
        ?.filter((hotel) => {
          return (
            hotel.Price.OfferedPriceRoundedOff >= 6000 * hotelSearchNights &&
            hotel.Price.OfferedPriceRoundedOff < 8000 * hotelSearchNights
          );
        }).length
    : null;

  var price8kto10k = Array.isArray(hotelResList)
    ? hotelResList
        ?.filter((hotel) => {
          var staticData = hotelStaticData[hotel.HotelCode];
          var hotelName = hotel.HotelName
            ? hotel.HotelName
            : staticData?.HotelName;
          return hotelName?.length > 0;
        })
        ?.filter((hotel) => {
          return (
            hotel.Price.OfferedPriceRoundedOff >= 8000 * hotelSearchNights &&
            hotel.Price.OfferedPriceRoundedOff < 10000 * hotelSearchNights
          );
        }).length
    : null;

  var pricegt10k = Array.isArray(hotelResList)
    ? hotelResList
        ?.filter((hotel) => {
          var staticData = hotelStaticData[hotel.HotelCode];
          var hotelName = hotel.HotelName
            ? hotel.HotelName
            : staticData?.HotelName;
          return hotelName?.length > 0;
        })
        ?.filter((hotel) => {
          return (
            hotel.Price.OfferedPriceRoundedOff >= 10000 * hotelSearchNights
          );
        }).length
    : null;

  var setRatingState = async (rating) => {
    // setIsRatingSelected((prevSelectedTime) =>
    //   prevSelectedTime === rating ? null : rating
    // );
    await actions.setHotelRating(rating);
  };

  var setPriceState = async (price) => {
    // setIsPriceSelected((prevSelectedPrice) =>
    //   prevSelectedPrice === price ? null : price
    // );
    if (price === "price1and5k") {
      await actions.setHotelPriceStart(1 * hotelSearchNights);
      await actions.setHotelPriceEnd(1500 * hotelSearchNights);
    }
    if (price === "price2and5k") {
      await actions.setHotelPriceStart(1500 * hotelSearchNights);
      await actions.setHotelPriceEnd(2500 * hotelSearchNights);
    }
    if (price === "price4k") {
      await actions.setHotelPriceStart(2500 * hotelSearchNights);
      await actions.setHotelPriceEnd(4000 * hotelSearchNights);
    }
    if (price === "price6k") {
      await actions.setHotelPriceStart(4000 * hotelSearchNights);
      await actions.setHotelPriceEnd(6000 * hotelSearchNights);
    }
    if (price === "price8k") {
      await actions.setHotelPriceStart(6000 * hotelSearchNights);
      await actions.setHotelPriceEnd(8000 * hotelSearchNights);
    }
    if (price === "price10k") {
      await actions.setHotelPriceStart(8000 * hotelSearchNights);
      await actions.setHotelPriceEnd(10000 * hotelSearchNights);
    }
    if (price === "pricegt10k") {
      await actions.setHotelPriceStart(10000 * hotelSearchNights);
      await actions.setHotelPriceEnd(1000000 * hotelSearchNights);
    }
    if (price === null) {
      await actions.setHotelPriceStart(null);
      await actions.setHotelPriceEnd(null);
    }
  };
  //console.log(hotelErrorMessage);
  var removeFilters = async () => {
    setCount(0);
    setIsRatingSelected(null);
    setIsPriceSelected(null);
    await actions.setHotelPriceStart(null);
    await actions.setHotelPriceEnd(null);
    await actions.setHotelRating(null);
    await actions.setHotelSearchText(null);
  };

  var closeFilters = async () => {
    setShowFilters(false);
  };

  var applyFilters = async () => {
    setShowFilters(false);
    setCount(0);
    await setPriceState(price);
    await setRatingState(rating);
    if (rating) {
      setCount((prev) => prev + 1);
    }
    if (price) {
      setCount((prev) => prev + 1);
    }
  };
  //console.log(hotelImageList);
  var handleName = () => {
    setShowName(!showName);
  };

  var setDesktopPrice = async (price) => {
    setIsPriceSelected((prevSelectedPrice) =>
      prevSelectedPrice === price ? null : price
    );

    if (price === "price1and5k") {
      await actions.setHotelPriceStart(
        price === "price1and5k" ? 1 * hotelSearchNights : null
      );
      await actions.setHotelPriceEnd(
        price === "price1and5k" ? 1500 * hotelSearchNights : null
      );
    }
    if (price === "price2and5k") {
      await actions.setHotelPriceStart(
        price === "price2and5k" ? 1500 * hotelSearchNights : null
      );
      await actions.setHotelPriceEnd(
        price === "price2and5k" ? 2500 * hotelSearchNights : null
      );
    }
    if (price === "price4k") {
      await actions.setHotelPriceStart(
        price === "price4k" ? 2500 * hotelSearchNights : null
      );
      await actions.setHotelPriceEnd(
        price === "price4k" ? 4000 * hotelSearchNights : null
      );
    }
    if (price === "price6k") {
      await actions.setHotelPriceStart(
        price === "price6k" ? 4000 * hotelSearchNights : null
      );
      await actions.setHotelPriceEnd(
        price === "price6k" ? 6000 * hotelSearchNights : null
      );
    }
    if (price === "price8k") {
      await actions.setHotelPriceStart(
        price === "price8k" ? 6000 * hotelSearchNights : null
      );
      await actions.setHotelPriceEnd(
        price === "price8k" ? 8000 * hotelSearchNights : null
      );
    }
    if (price === "price10k") {
      await actions.setHotelPriceStart(
        price === "price10k" ? 8000 * hotelSearchNights : null
      );
      await actions.setHotelPriceEnd(
        price === "price10k" ? 10000 * hotelSearchNights : null
      );
    }
    if (price === "pricegt10k") {
      await actions.setHotelPriceStart(
        price === "pricegt10k" ? 10000 * hotelSearchNights : null
      );
      await actions.setHotelPriceEnd(
        price === "pricegt10k" ? 1000000 * hotelSearchNights : null
      );
    }
    if (price === null) {
      console.log("called");
      await actions.setHotelPriceStart(null);
      await actions.setHotelPriceEnd(null);
    }
  };

  var hotelImages = async (query) => {
    console.log("called");
    var res = await actions.convertXmlToJsonHotel(query);
    return res;
  };

  const hotelIdsInObject = recommondedHotels
    ? Object.keys(recommondedHotels)
    : [];
  //console.log(hotelResList)
  // console.log(hotelIdsInObject);
  // console.log(hotelResList.filter(hotel =>
  //   hotelIdsInObject.includes(hotel.HotelCode)
  // ));
  if (searchingHotels) {
    return (
      <LoadingProg
        condition={searchingHotels}
        loadingText={"Searching hotels"}
        progEnd={searchingHotels}
        progTime={35}
      />
      //<>Loading...</>
    );
  } else if (fetchingHotelInfo || hotelInfoRes) {
    return <HotelInfo userAdmin={userAdmin} addedFromAdmin={addedFromAdmin} />;
  } else {
    return (
      <>
        <Popup
          condition={hotelSessionExpiredPopup}
          close={() => actions.setHotelSessionPopup(false)}
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
        <HotelDesc
          condition={hotelDesc}
          close={() => {
            setHotelDesc(false);
            setLocation("");
            setAddress("");
            setDescription("");
          }}
          location={location}
          address={address}
          description={description}
        />
        <Navbar />
        <div className="hotelRes-header">
          <div className="hotelRes-header-destName">
            {hotelSearchName}
            <div
              className="hotelRes-header-destName-edit"
              onClick={async () => {
                await actions.setHotelErrorMessage();
                await actions.backToHotelSearchPage();
                removeFilters();
                await actions.setHotelSearchText("");
              }}
            >
              <FontAwesomeIcon icon={faPencil} />
            </div>
          </div>
          <div className="hotelRes-header-othrDtls">{`${hotelSearchCheckIn
            .toString()
            .slice(4, 10)} - ${hotelSearchCheckOut
            .toString()
            .slice(4, 10)} | ${hotelRooms} ${
            hotelRooms > 1 ? "Rooms" : "Room"
          } | ${hotelSearchAdults} ${
            hotelSearchAdults > 1 ? "Adults" : "Adult"
          }${
            hotelSearchChild
              ? ` | ${hotelSearchChild} ${
                  hotelSearchChild > 1 ? "Children" : "Child"
                } `
              : ""
          }| ${hotelSearchNights} ${
            hotelSearchNights > 1 ? "nights" : "night"
          }`}</div>
        </div>
        <div className="hotelRes-block">
          <div className="hotelRes-filters-Desktop">
            <div
              className="hotelRes-filters-Desktop-clear"
              onClick={removeFilters}
            >
              Clear Filters
            </div>
            <div className="hotelRes-filters-Desktop-rating">
              <div className="hotelRes-filters-Desktop-rating-header">
                Rating
              </div>
              <form className="hotelRes-filters-Desktop-rating-radio">
                <label
                  onClick={async () => {
                    setRating((prevSelectedTime) =>
                      prevSelectedTime === 1 ? null : 1
                    );
                    setIsRatingSelected((prevSelectedTime) =>
                      prevSelectedTime === 1 ? null : 1
                    );
                    await actions.setHotelRating(rating === 1 ? null : 1);
                  }}
                  className={isRatingSelected === 1 ? "selected" : ""}
                >
                  {[0].map((rate) => (
                    <FontAwesomeIcon
                      icon={faStar}
                      className="hotelRes-card-rating-icon"
                    />
                  ))}
                </label>
                <label
                  onClick={async (e) => {
                    setRating((prevSelectedTime) =>
                      prevSelectedTime === 2 ? null : 2
                    );
                    setIsRatingSelected((prevSelectedTime) =>
                      prevSelectedTime === 2 ? null : 2
                    );
                    await actions.setHotelRating(rating === 2 ? null : 2);
                  }}
                  className={isRatingSelected === 2 ? "selected" : ""}
                >
                  {[0, 1].map((rate) => (
                    <FontAwesomeIcon
                      icon={faStar}
                      className="hotelRes-card-rating-icon"
                    />
                  ))}
                </label>
                <label
                  onClick={async (e) => {
                    setRating((prevSelectedTime) =>
                      prevSelectedTime === 3 ? null : 3
                    );
                    setIsRatingSelected((prevSelectedTime) =>
                      prevSelectedTime === 3 ? null : 3
                    );
                    await actions.setHotelRating(rating === 3 ? null : 3);
                  }}
                  className={isRatingSelected === 3 ? "selected" : ""}
                >
                  {[0, 1, 2].map((rate) => (
                    <FontAwesomeIcon
                      icon={faStar}
                      className="hotelRes-card-rating-icon"
                    />
                  ))}
                </label>
                <label
                  onClick={async (e) => {
                    setRating((prevSelectedTime) =>
                      prevSelectedTime === 4 ? null : 4
                    );
                    setIsRatingSelected((prevSelectedTime) =>
                      prevSelectedTime === 4 ? null : 4
                    );
                    await actions.setHotelRating(rating === 4 ? null : 4);
                  }}
                  className={isRatingSelected === 4 ? "selected" : ""}
                >
                  {[0, 1, 2, 3].map((rate) => (
                    <FontAwesomeIcon
                      icon={faStar}
                      className="hotelRes-card-rating-icon"
                    />
                  ))}
                </label>
                <label
                  onClick={async (e) => {
                    setRating((prevSelectedTime) =>
                      prevSelectedTime === 5 ? null : 5
                    );
                    setIsRatingSelected((prevSelectedTime) =>
                      prevSelectedTime === 5 ? null : 5
                    );
                    await actions.setHotelRating(rating === 5 ? null : 5);
                  }}
                  className={isRatingSelected === 5 ? "selected" : ""}
                >
                  {[0, 1, 2, 3, 4].map((rate) => (
                    <FontAwesomeIcon
                      icon={faStar}
                      className="hotelRes-card-rating-icon"
                    />
                  ))}
                </label>
              </form>
            </div>
            <div className="hotelRes-filters-Desktop-price">
              <div className="hotelRes-filters-Desktop-price-header">Price</div>
              <div className="hotelRes-filters-Desktop-price-radio">
                <label
                  onClick={() => {
                    setDesktopPrice(
                      isPriceSelected === "price1and5k" ? null : "price1and5k"
                    );
                  }}
                  className={
                    isPriceSelected === "price1and5k" ? "selected" : ""
                  }
                >
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {0 * hotelSearchNights} to{" "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {1500 * hotelSearchNights} ({`${price0to1and5k}`})
                </label>
                <label
                  onClick={() => {
                    setDesktopPrice(
                      isPriceSelected === "price2and5k" ? null : "price2and5k"
                    );
                  }}
                  className={
                    isPriceSelected === "price2and5k" ? "selected" : ""
                  }
                >
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {1500 * hotelSearchNights} -{" "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {2500 * hotelSearchNights} ({`${price1and5kto2and5k}`})
                </label>
                <label
                  onClick={() => {
                    setDesktopPrice(
                      isPriceSelected === "price4k" ? null : "price4k"
                    );
                  }}
                  className={isPriceSelected === "price4k" ? "selected" : ""}
                >
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {2500 * hotelSearchNights} -{" "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {4000 * hotelSearchNights} ({`${price2and5kto4k}`})
                </label>
                <label
                  onClick={() => {
                    setDesktopPrice(
                      isPriceSelected === "price6k" ? null : "price6k"
                    );
                  }}
                  className={isPriceSelected === "price6k" ? "selected" : ""}
                >
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {4000 * hotelSearchNights} -{" "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {6000 * hotelSearchNights} ({`${price4kto6k}`})
                </label>
                <label
                  onClick={() => {
                    setDesktopPrice(
                      isPriceSelected === "price8k" ? null : "price8k"
                    );
                  }}
                  className={isPriceSelected === "price8k" ? "selected" : ""}
                >
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {6000 * hotelSearchNights} -{" "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {8000 * hotelSearchNights} ({`${price6kto8k}`})
                </label>
                <label
                  onClick={() => {
                    setDesktopPrice(
                      isPriceSelected === "price10k" ? null : "price10k"
                    );
                  }}
                  className={isPriceSelected === "price10k" ? "selected" : ""}
                >
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {8000 * hotelSearchNights} to{" "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {10000 * hotelSearchNights} ({`${price8kto10k}`})
                </label>
                <label
                  onClick={() => {
                    setDesktopPrice(
                      isPriceSelected === "pricegt10k" ? null : "pricegt10k"
                    );
                  }}
                  className={isPriceSelected === "pricegt10k" ? "selected" : ""}
                >
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="hotelRes-card-price-icon"
                  />{" "}
                  {10000 * hotelSearchNights}+ ({`${pricegt10k}`})
                </label>
              </div>
            </div>
          </div>
          <div className="hotelRes-mobile-filters">
            <div className="hotelRes-mobile-filters-header">
              <span>
                Filters <FontAwesomeIcon icon={faFilter} />
                {count > 0 ? <span>{count}</span> : null}
              </span>
              {!showFilters ? (
                <FontAwesomeIcon
                  icon={faAngleDown}
                  size="xl"
                  onClick={() => setShowFilters(true)}
                />
              ) : null}
            </div>
            <div
              className={
                showFilters
                  ? "hotelRes-mobile-filters-block show"
                  : "hotelRes-mobile-filters-block"
              }
            >
              <div className="hotelRes-filters-mobile-rating">
                <div className="hotelRes-filters-mobile-rating-header">
                  Rating
                </div>
                <form className="hotelRes-filters-Mobile-rating-radio">
                  <label
                    onClick={() => {
                      setRating((prevSelectedTime) =>
                        prevSelectedTime === 1 ? null : 1
                      );
                      setIsRatingSelected((prevSelectedTime) =>
                        prevSelectedTime === 1 ? null : 1
                      );
                    }}
                    className={isRatingSelected === 1 ? "selected" : ""}
                  >
                    {[0].map((rate) => (
                      <FontAwesomeIcon
                        icon={faStar}
                        className="hotelRes-card-rating-icon"
                      />
                    ))}
                  </label>
                  <label
                    onClick={async (e) => {
                      setRating((prevSelectedTime) =>
                        prevSelectedTime === 2 ? null : 2
                      );
                      setIsRatingSelected((prevSelectedTime) =>
                        prevSelectedTime === 2 ? null : 2
                      );
                    }}
                    className={isRatingSelected === 2 ? "selected" : ""}
                  >
                    {[0, 1].map((rate) => (
                      <FontAwesomeIcon
                        icon={faStar}
                        className="hotelRes-card-rating-icon"
                      />
                    ))}
                  </label>
                  <label
                    onClick={async (e) => {
                      setRating((prevSelectedTime) =>
                        prevSelectedTime === 3 ? null : 3
                      );
                      setIsRatingSelected((prevSelectedTime) =>
                        prevSelectedTime === 3 ? null : 3
                      );
                    }}
                    className={isRatingSelected === 3 ? "selected" : ""}
                  >
                    {[0, 1, 2].map((rate) => (
                      <FontAwesomeIcon
                        icon={faStar}
                        className="hotelRes-card-rating-icon"
                      />
                    ))}
                  </label>
                  <label
                    onClick={async (e) => {
                      setRating((prevSelectedTime) =>
                        prevSelectedTime === 4 ? null : 4
                      );
                      setIsRatingSelected((prevSelectedTime) =>
                        prevSelectedTime === 4 ? null : 4
                      );
                    }}
                    className={isRatingSelected === 4 ? "selected" : ""}
                  >
                    {[0, 1, 2, 3].map((rate) => (
                      <FontAwesomeIcon
                        icon={faStar}
                        className="hotelRes-card-rating-icon"
                      />
                    ))}
                  </label>
                  <label
                    onClick={async (e) => {
                      setRating((prevSelectedTime) =>
                        prevSelectedTime === 5 ? null : 5
                      );
                      setIsRatingSelected((prevSelectedTime) =>
                        prevSelectedTime === 5 ? null : 5
                      );
                    }}
                    className={isRatingSelected === 5 ? "selected" : ""}
                  >
                    {[0, 1, 2, 3, 4].map((rate) => (
                      <FontAwesomeIcon
                        icon={faStar}
                        className="hotelRes-card-rating-icon"
                      />
                    ))}
                  </label>
                </form>
              </div>
              <div className="hotelRes-filters-Mobile-price">
                <div className="hotelRes-filters-Mobile-price-header">
                  Price
                </div>
                <div className="hotelRes-filters-Mobile-price-radio">
                  <label
                    onClick={() => {
                      setPrice((prevSelectedPrice) =>
                        prevSelectedPrice === "price1and5k"
                          ? null
                          : "price1and5k"
                      );
                      setIsPriceSelected((prevSelectedPrice) =>
                        prevSelectedPrice === "price1and5k"
                          ? null
                          : "price1and5k"
                      );
                    }}
                    className={
                      isPriceSelected === "price1and5k" ? "selected" : ""
                    }
                  >
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {0 * hotelSearchNights} to{" "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {1500 * hotelSearchNights} ({`${price0to1and5k}`})
                  </label>
                  <label
                    onClick={() => {
                      setPrice((prevSelectedPrice) =>
                        prevSelectedPrice === "price2and5k"
                          ? null
                          : "price2and5k"
                      );
                      setIsPriceSelected((prevSelectedPrice) =>
                        prevSelectedPrice === "price2and5k"
                          ? null
                          : "price2and5k"
                      );
                    }}
                    className={
                      isPriceSelected === "price2and5k" ? "selected" : ""
                    }
                  >
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {1500 * hotelSearchNights} -{" "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {2500 * hotelSearchNights} ({`${price1and5kto2and5k}`})
                  </label>
                  <label
                    onClick={() => {
                      setPrice((prevSelectedPrice) =>
                        prevSelectedPrice === "price4k" ? null : "price4k"
                      );
                      setIsPriceSelected((prevSelectedPrice) =>
                        prevSelectedPrice === "price4k" ? null : "price4k"
                      );
                    }}
                    className={isPriceSelected === "price4k" ? "selected" : ""}
                  >
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {2500 * hotelSearchNights} -{" "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {4000 * hotelSearchNights} ({`${price2and5kto4k}`})
                  </label>
                  <label
                    onClick={() => {
                      setPrice((prevSelectedPrice) =>
                        prevSelectedPrice === "price6k" ? null : "price6k"
                      );
                      setIsPriceSelected((prevSelectedPrice) =>
                        prevSelectedPrice === "price6k" ? null : "price6k"
                      );
                    }}
                    className={isPriceSelected === "price6k" ? "selected" : ""}
                  >
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {4000 * hotelSearchNights} -{" "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {6000 * hotelSearchNights} ({`${price4kto6k}`})
                  </label>
                  <label
                    onClick={() => {
                      setPrice((prevSelectedPrice) =>
                        prevSelectedPrice === "price8k" ? null : "price8k"
                      );
                      setIsPriceSelected((prevSelectedPrice) =>
                        prevSelectedPrice === "price8k" ? null : "price8k"
                      );
                    }}
                    className={isPriceSelected === "price8k" ? "selected" : ""}
                  >
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {6000 * hotelSearchNights} -{" "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {8000 * hotelSearchNights} ({`${price6kto8k}`})
                  </label>
                  <label
                    onClick={() => {
                      setPrice((prevSelectedPrice) =>
                        prevSelectedPrice === "price10k" ? null : "price10k"
                      );
                      setIsPriceSelected((prevSelectedPrice) =>
                        prevSelectedPrice === "price10k" ? null : "price10k"
                      );
                    }}
                    className={isPriceSelected === "price10k" ? "selected" : ""}
                  >
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {8000 * hotelSearchNights} to{" "}
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {10000 * hotelSearchNights} ({`${price8kto10k}`})
                  </label>
                  <label
                    onClick={() => {
                      setPrice((prevSelectedPrice) =>
                        prevSelectedPrice === "pricegt10k" ? null : "pricegt10k"
                      );
                      setIsPriceSelected((prevSelectedPrice) =>
                        prevSelectedPrice === "pricegt10k" ? null : "pricegt10k"
                      );
                    }}
                    className={
                      isPriceSelected === "pricegt10k" ? "selected" : ""
                    }
                  >
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="hotelRes-card-price-icon"
                    />{" "}
                    {10000 * hotelSearchNights}+ ({`${pricegt10k}`})
                  </label>
                </div>
              </div>
              <div className="hotelRes-apply-filters">
                <button onClick={applyFilters}>Apply</button>
              </div>
              <div className="hotelRes-close-filters">
                <FontAwesomeIcon
                  icon={faAngleUp}
                  onClick={closeFilters}
                  size="xl"
                />
              </div>
            </div>
          </div>
          <div style={{ padding: "15px" }}>
            {count > 0 ? (
              <div
                className="hotelRes-filters-Mobile-clear"
                onClick={removeFilters}
              >
                Clear Filters
              </div>
            ) : null}
            <div className="hotelRes-filters-search-mobile">
              <input
                type="text"
                placeholder="Search for your favourite hotel"
                value={hotelSearchText}
                onChange={async (e) => {
                  await actions.setHotelSearchText(e.target.value);
                }}
              />
            </div>
            {hotelResList.length > 0 ? (
              <>
                {actions.filterHotels(hotelResList).length > 0 ? (
                  <div className="hotelRes-title">{`Hotel search results (${
                    actions.filterHotels(hotelResList).filter((hotel) => {
                      var staticData = hotelStaticData[hotel.HotelCode];
                      var hotelName = hotel.HotelName
                        ? hotel.HotelName
                        : staticData?.HotelName;
                      return hotelName?.length > 0;
                    })?.length
                  })`}</div>
                ) : null}

                <div className="hotelRes-filters-search-desktop">
                  <input
                    type="text"
                    placeholder="Search for your favourite hotel"
                    value={hotelSearchText}
                    onChange={async (e) => {
                      await actions.setHotelSearchText(e.target.value);
                    }}
                  />
                </div>
              </>
            ) : null}
            {hotelResList.length > 0 ? (
              <>
                {actions.filterHotels(hotelResList).length > 0 ? (
                  <>
                    {actions
                      .filterHotels(hotelResList)
                      .filter((hotel) => {
                        var staticData = hotelStaticData[hotel.HotelCode];
                        var hotelName = hotel.HotelName
                          ? hotel.HotelName
                          : staticData?.HotelName;
                        return hotelName?.length > 0;
                      })
                      .filter((hotel) =>
                        hotelIdsInObject.includes(hotel.HotelCode)
                      )
                      .map((hotel, h) => {
                        var rating = [];
                        //var hotelImg = hotel.HotelPicture === "https://images.cdnpath.com/Images/HotelNA.jpg" ? "https://i.travelapi.com/hotels/35000000/34870000/34867700/34867648/89943464_z.jpg" : hotel.HotelPicture

                        var starRating = hotel.StarRating;
                        //var gethotels = hotelImages({ cityId: cityHotel, hotelId: hotel.HotelCode })
                        var starRatingFull = Math.floor(starRating);
                        const staticData = hotelStaticData[hotel.HotelCode];
                        var img = hotelImageList?.hasOwnProperty(
                          hotel.HotelCode
                        )
                          ? hotelImageList[hotel.HotelCode]
                          : {};
                        var hotelPic = img?.HotelPicture
                          ? img?.HotelPicture
                          : "https://i.travelapi.com/hotels/35000000/34870000/34867700/34867648/89943464_z.jpg";

                        var hotelImg =
                          hotel.HotelPicture ===
                          "https://images.cdnpath.com/Images/HotelNA.jpg"
                            ? hotelPic
                            : hotel.HotelPicture;

                        for (var i = 1; i <= Math.ceil(starRating); i++) {
                          if (i > starRatingFull) {
                            rating.push(
                              <FontAwesomeIcon
                                icon={faStarHalf}
                                className="hotelRes-card-rating-icon"
                              />
                            );
                          } else {
                            rating.push(
                              <FontAwesomeIcon
                                icon={faStar}
                                className="hotelRes-card-rating-icon"
                              />
                            );
                          }
                        }
                        // if (hotel.HotelName) {
                        return (
                          <div className="hotelRes-card">
                            <div className="hotelRes-card-img">
                              <img src={hotelImg} alt="hotel logo" />
                            </div>
                            <div className="hotelRes-card-details">
                              <div className="hotelRes-card-name">
                                <p
                                  className={
                                    showName
                                      ? "hotelRes-name expand"
                                      : "hotelRes-name"
                                  }
                                  onClick={handleName}
                                >
                                  {`${
                                    hotel.HotelName
                                      ? hotel.HotelName
                                      : staticData?.HotelName
                                  }`}
                                </p>
                                <div className="hotelRes-featured">
                                  Recommended
                                </div>
                              </div>
                              <div className="hotelRes-card-details-box">
                                <div className="hotelRes-card-details-row">
                                  <div className="hotelRes-card-price">
                                    <FontAwesomeIcon
                                      icon={faIndianRupeeSign}
                                      className="hotelRes-card-price-icon"
                                    />
                                    {`${
                                      hotel.Price.OfferedPriceRoundedOff
                                        ? hotel.Price.OfferedPriceRoundedOff.toLocaleString(
                                            "en-IN"
                                          )
                                        : hotel.Price.PublishedPriceRoundedOff.toLocaleString(
                                            "en-IN"
                                          )
                                    }`}
                                  </div>
                                  <div className="hotelRes-card-rating">
                                    {rating.map((star) => {
                                      return star;
                                    })}
                                  </div>
                                </div>
                                {/* {hotel.HotelDescription ? (
                        <div className="hotelRes-card-hotelInfo-desc">
                          {hotel.HotelDescription.slice(0, 40) + "..."}
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="hotelRes-card-hotelInfo-desc-icon"
                            onClick={() => {
                              setHotelDesc(true);
                              setLocation(hotel.HotelLocation);
                              setAddress(hotel.Address);
                              setDescription(hotel.HotelDescription);
                            }}
                          />
                        </div>
                      ) : null} */}
                                <div className="hotelRes-card-hotelInfo-btn">
                                  <button
                                    onClick={() => {
                                      actions.fetchHotelInfo({
                                        resultIndex: hotel.ResultIndex,
                                        hotelCode: hotel.HotelCode,
                                        categoryId:
                                          hotel.SupplierHotelCodes &&
                                          hotel.SupplierHotelCodes.length > 0
                                            ? hotel.SupplierHotelCodes[0]
                                                .CategoryId
                                            : "",
                                        hotelSearchRes: hotel,
                                        hotelName: hotel.HotelName
                                        ? hotel.HotelName
                                        : staticData?.HotelName
                                      });
                                    }}
                                  >
                                    Book
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                        // }
                      })}
                    {actions
                      .filterHotels(hotelResList)
                      .filter((hotel) => {
                        var staticData = hotelStaticData[hotel.HotelCode];
                        var hotelName = hotel.HotelName
                          ? hotel.HotelName
                          : staticData?.HotelName;
                        return hotelName?.length > 0;
                      })
                      .filter(
                        (hotel) => !hotelIdsInObject.includes(hotel.HotelCode)
                      )
                      .map((hotel, h) => {
                        //var hotelImg = hotel.HotelPicture === "https://images.cdnpath.com/Images/HotelNA.jpg" ? "https://i.travelapi.com/hotels/35000000/34870000/34867700/34867648/89943464_z.jpg" : hotel.HotelPicture
                        //var gethotels = hotelImages({ cityId: cityHotel, hotelId: hotel.HotelCode })
                        var rating = [];

                        var starRating = hotel.StarRating;
                        var starRatingFull = Math.floor(starRating);
                        const staticData = hotelStaticData[hotel.HotelCode];
                        var img = hotelImageList?.hasOwnProperty(
                          hotel.HotelCode
                        )
                          ? hotelImageList[hotel.HotelCode]
                          : {};
                        var hotelPic = img?.HotelPicture
                          ? img?.HotelPicture
                          : "https://i.travelapi.com/hotels/35000000/34870000/34867700/34867648/89943464_z.jpg";
                        var hotelImg =
                          hotel.HotelPicture ===
                          "https://images.cdnpath.com/Images/HotelNA.jpg"
                            ? hotelPic
                            : hotel?.HotelPicture;

                        for (var i = 1; i <= Math.ceil(starRating); i++) {
                          if (i > starRatingFull) {
                            rating.push(
                              <FontAwesomeIcon
                                icon={faStarHalf}
                                className="hotelRes-card-rating-icon"
                              />
                            );
                          } else {
                            rating.push(
                              <FontAwesomeIcon
                                icon={faStar}
                                className="hotelRes-card-rating-icon"
                              />
                            );
                          }
                        }
                        // if (hotel.HotelName) {
                      const hotelName= hotel.HotelName? hotel.HotelName : staticData?.HotelName
                        return (
                          <div className="hotelRes-card">
                            <div className="hotelRes-card-img">
                              <img src={hotelImg} alt="hotel logo" />
                            </div>
                            <div className="hotelRes-card-details">
                              <div className="hotelRes-card-name">
                                <p className="hotelRes-name">
                                  {/* {`${
                                    hotel.HotelName
                                      ? hotel.HotelName
                                      : staticData?.HotelName
                                  }`}{" "} */}
                                  {hotelName}
                                </p>
                              </div>
                              <div className="hotelRes-card-details-box">
                                <div className="hotelRes-card-details-row">
                                  <div className="hotelRes-card-price">
                                    <FontAwesomeIcon
                                      icon={faIndianRupeeSign}
                                      className="hotelRes-card-price-icon"
                                    />
                                    {`${
                                      hotel.Price.OfferedPriceRoundedOff
                                        ? hotel.Price.OfferedPriceRoundedOff.toLocaleString(
                                            "en-IN"
                                          )
                                        : hotel.Price.PublishedPriceRoundedOff.toLocaleString(
                                            "en-IN"
                                          )
                                    }`}
                                  </div>
                                  <div className="hotelRes-card-rating">
                                    {rating.map((star) => {
                                      return star;
                                    })}
                                  </div>
                                </div>
                                {/* {hotel.HotelDescription ? (
                        <div className="hotelRes-card-hotelInfo-desc">
                          {hotel.HotelDescription.slice(0, 40) + "..."}
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="hotelRes-card-hotelInfo-desc-icon"
                            onClick={() => {
                              setHotelDesc(true);
                              setLocation(hotel.HotelLocation);
                              setAddress(hotel.Address);
                              setDescription(hotel.HotelDescription);
                            }}
                          />
                        </div>
                      ) : null} */}
                                <div className="hotelRes-card-hotelInfo-btn">
                                  <button
                                    onClick={() => {
                                      actions.fetchHotelInfo({
                                        resultIndex: hotel.ResultIndex,
                                        hotelCode: hotel.HotelCode,
                                        categoryId:
                                          hotel.SupplierHotelCodes &&
                                          hotel.SupplierHotelCodes.length > 0
                                            ? hotel.SupplierHotelCodes[0]
                                                .CategoryId
                                            : "",
                                        hotelSearchRes: hotel,
                                        hotelName:hotelName
                                      });
                                    }}
                                  >
                                    Book
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                        // }
                      })}
                  </>
                ) : (
                  <div className="hotelRes-noResults">No results found</div>
                )}
              </>
            ) : (
              <div className="hotelRes-error">
                {hotelErrorMessage.ErrorMessage}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default HotelResList;
