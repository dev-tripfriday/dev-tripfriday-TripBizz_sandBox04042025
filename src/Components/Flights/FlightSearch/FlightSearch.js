import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../Context";
import Popup from "../../Popup";
import "./FlightSearch.css";
import FlightSearchRes from "./FlightSearchRes";
import HotelResList from "../../Hotels/HotelResList/HotelResList";
import ReactDatePicker from "react-datepicker";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faHotel,
  faPlaneDeparture,
  faRightLeft,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import HiddenSelect from "../../Utilites/HiddenSelect/HiddenSelect";
import HiddenInput from "../../Utilites/HiddenInput/HiddenInput";
import Navbar from "./Navbar";
import CabResList from "../../Cabs/CabResList/CabResList";
import BusResList from "../../Bus/BusResList/BusResList";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";

function FlightSearch(props) {
  const [origin, setOrigin] = useState("");
  const [originAirport, setOriginAirport] = useState("");
  const [originRes, setOriginRes] = useState(false);
  const [originCityName, setOriginCityName] = useState("");
  const [originAirportName, setOriginAirportName] = useState("");

  const [destination, setDestination] = useState("");
  const [destAirport, setDestAirport] = useState("");
  const [destRes, setDestRes] = useState(false);
  const [destCityName, setDestCityName] = useState("");
  const [destAirportName, setDestAirportName] = useState("");

  const [journeyType, setJourneyType] = useState("1");
  const [outboundDate, setOutBoundDate] = useState("");
  const [inboundDate, setInBoundDate] = useState("");
  const [flightCabinClass, setFlightCabinClass] = useState("Economy");
  const [directFlight, setDirectFlight] = useState(false);
  const [oneStopFlight, setOneStopFlight] = useState(false);
  const [jType, setJType] = useState(0);

  const [originDisplay, setOriginDisplay] = useState(false);
  const [destDisplay, setDestDisplay] = useState(false);

  const [adults, setAdults] = useState("1");
  const [adultsDisp, setAdultsDisp] = useState(true);

  const [children, setChildren] = useState("0");
  const [childDisp, setChildDisp] = useState(true);

  const [infants, setInfants] = useState("0");
  const [infantDisp, setInfantDisp] = useState(true);

  const [passengerError, setPassengerError] = useState("");

  const [flightOriginError, setFlightOriginError] = useState("");
  const [flightDestError, setFlightDestError] = useState("");
  const [flightDepError, setFlightDepError] = useState("");
  const [flightReturnError, setFlightReturnErrror] = useState("");
  const [hotelDestError, setHotelDestError] = useState("");
  const [hotelCheckinError, setHotelCheckinError] = useState("");
  const [hotelCheckOutError, setHotelCheckOutError] = useState("");

  const [busDesError, setBusDesError] = useState("");
  const [busStartError, setBusStartError] = useState("");
  const [busEndError, setbusEndError] = useState("");
  const [cabDestErrror, setCabDestError] = useState("");
  const [cabStartError, setCabStartError] = useState("");
  const [cabEndError, setCabEndError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [selectedTab, setSelectedTab] = useState(
    props.tab ? props.tab : "flights"
  );

  const [cityHotel, setCityHotel] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [cityHotelDisplay, setCityHotelDisplay] = useState(false);
  const [cityHotelQuery, setCityHotelQuery] = useState("");
  const [cityHotelItem, setCityHotelItem] = useState({});
  const [cityHotelResBox, setCityHotelResBox] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [hotelNights, setHotelNights] = useState("0");
  const [hotelRooms, setHotelRooms] = useState("1");
  const [hotelRoomArr, setHotelRoomArr] = useState([
    { adults: "1", child: 0, childAge: [] },
  ]);
  const [hotelAdults, setHotelAdults] = useState("1");
  const [hotelChildren, setHotelChildren] = useState("0");
  const [hotelChildArr, setHotelChildArr] = useState([]);
  const [mounted, setMounted] = useState(true);
  const [cabCityDisplay, setCabCityDisplay] = useState(false);
  const [cabCity, setCabCity] = useState("");
  const [cityCabResBox, setCityCabResBox] = useState(false);
  const [cabStartDate, setCabStartDate] = useState("");
  const [cabEndDate, setCabEndDate] = useState("");
  const [cabType, setCabType] = useState("Airport to City center Hotel");
  const [cabCityItem, setCabCityItem] = useState(null);
  const [noOfCabs, setNoOfCabs] = useState("1");
  const [nights, setNights] = useState("0");
  const [selectedTime, setSelectedTime] = useState("00:15");
  const [cabTimeDisplay, setCabTimeDisplay] = useState(false);
  const [cabCountDisplay, setCabCountDisplay] = useState(false);

  const [busOrigin, setBusOrigin] = useState("");
  const [busOriginRes, setBusOriginRes] = useState(false);
  const [busOriginCityName, setBusOriginCityName] = useState("");
  const [busOriginDisplay, setBusOriginDisplay] = useState(false);
  const [busOriginDetails, setBusOriginDetails] = useState("");

  const [busDestination, setBusDestination] = useState("");
  const [busDestRes, setBusDestRes] = useState(false);
  const [busDestCityName, setBusDestCityName] = useState("");
  const [busDestDisplay, setBusDestDisplay] = useState(false);
  const [busDestDetails, setBusDestDetails] = useState("");

  const [busOutboundDate, setBusOutBoundDate] = useState("");
  // var flights = useSelector((state) => state.flights);
  // const dispatch = useDispatch();

  const [busBoarding, setBusBoarding] = useState();
  const [busDropping, setBusDropping] = useState();
  const [multiCities, setMultiCities] = useState([]);

  $("#flightSearch-departureDate").attr("readonly", "readonly");
  $("#flightSearch-returnDate").attr("readonly", "readonly");
  const handleErroMessages = (type, message) => {
    setErrorType(type);
  };
  useEffect(() => {
    if (mounted) {
      if (selectedTab === "flights") {
        window.history.pushState({ state: selectedTab }, "", `/home/flights`);
      } else if (selectedTab === "hotels") {
        window.history.pushState({ state: selectedTab }, "", `/home/hotels`);
      } else if (selectedTab === "cabs") {
        window.history.pushState({ state: selectedTab }, "", `/home/cabs`);
      } else if (selectedTab === "bus") {
        window.history.pushState({ state: selectedTab }, "", `/home/bus`);
      }
    }
    // if (mounted) {
    //   actions.getAirportCityList();
    //   actions.getHotelCityList();
    // }
    return () => {
      setMounted(false);
    };
  }, [selectedTab]);
  const {
    actions,
    searchingFlights,
    flightResList,
    flightSessionExpiredPopup,
    airportOriginData,
    airportOriginLoading,
    airportDestData,
    airportDestLoading,
    searchingHotels,
    hotelResList,
    cityHotelRes,
    hotelErrorMessage,
    flightErrorMessage,
    notifications,
    searchingCabs,
    cabErrorMessage,
    cabResList,
    cabSearchRes,
    busOriginData,
    busOriginLoading,
    busDestData,
    busDestLoading,
    busResList,
    busErrorMessage,
    searchingBus,
    NoofBusPassengers,
  } = useContext(MyContext);
  const navigate = useNavigate();
  const handleHotelDates = (e, type) => {
    let date = e;
    let nights;

    if (type === "checkInDate") {
      setCheckInDate(date);
      setHotelCheckinError("");
      if (checkOutDate) {
        nights = actions.diffDays(date, checkOutDate);
        setHotelNights(nights);
      }
    } else if (type === "checkOutDate") {
      setCheckOutDate(date);
      setHotelCheckOutError("");
      if (checkInDate) {
        nights = actions.diffDays(checkInDate, date);
        setHotelNights(nights);
      }
    }
  };
  const handleDelete = (indexToDelete) => {
    setMultiCities((prevCities) =>
      prevCities.filter((_, index) => index !== indexToDelete)
    );
  };
  const handleCabDates = (e, type) => {
    let date = e;
    let nights;
    if (type === "cabStartDate") {
      setCabStartDate(date);
      setCabStartError("");
      if (cabEndDate) {
        nights = actions.diffDays(date, cabEndDate);
        setNights(nights);
      }
    } else if (type === "cabEndDate") {
      setCabEndDate(date);
      setCabEndError("");
      if (cabStartDate) {
        nights = actions.diffDays(cabStartDate, date);
        setNights(nights);
      }
    }
  };
  const swapValues = () => {
    const changeOrigin = originCityName;
    const changeOriginAirport = originAirport;
    const changeOriginAirportName = originAirportName;
    const changeDest = destCityName;
    const changeDestAirport = destAirport;
    const changeDestAirportName = destAirportName;
    setOriginCityName(changeDest);
    setOriginAirport(changeDestAirport);
    setOriginAirportName(changeDestAirportName);
    setDestCityName(changeOrigin);
    setDestAirport(changeOriginAirport);
    setDestAirportName(changeOriginAirportName);
  };

  const handleHotelChildren = (num) => {
    let childArr = [];

    for (var i = 1; i <= num; i++) {
      childArr.push({ age: 0 });
    }

    setHotelChildren(num);
    setHotelChildArr(childArr);
  };

  const handleHotelRooms = (rooms) => {
    var roomsArr = [...hotelRoomArr];

    if (rooms > roomsArr.length) {
      var diff = rooms - roomsArr.length;
      for (var i = 1; i <= diff; i++) {
        roomsArr.push({ adults: 1, child: 0, childAge: [] });
      }
    } else if (rooms < roomsArr.length) {
      roomsArr = roomsArr.filter((room, r) => {
        return r < rooms;
      });
    }

    setHotelRooms(rooms);
    setHotelRoomArr(roomsArr);
  };

  const handleHotelRoomsArr = (val, type, i) => {
    var roomsArr = [...hotelRoomArr];

    if (type === "adults") {
      roomsArr[i].adults = val;
    } else if (type === "child") {
      roomsArr[i].child = val;
      let childArr = [];

      for (let i = 1; i <= val; i++) {
        childArr.push({ age: 0 });
      }
      roomsArr[i].childAge = [...childArr];
    }

    setHotelRoomArr(roomsArr);
  };

  const cabinclass = {
    "Any cabin class": "1",
    Economy: "2",
    "Premium Economy": "3",
    Business: "4",
    First: "6",
  };

  const cabTypes = [
    "4 hrs cab at disposal",
    "10 hrs cab at disposal",
    "12 hrs cab at disposal",
    "8 hrs cab at disposal",
  ];

  const cabTimings = {
    "Airport to City center Hotel": [
      "00:00",
      "00:15",
      "00:30",
      "00:45",
      "01:00",
      "01:15",
      "01:30",
      "01:45",
      "02:00",
      "02:15",
      "02:30",
      "02:45",
      "03:00",
      "03:15",
      "03:30",
      "03:45",
      "04:00",
      "04:15",
      "04:30",
      "04:45",
      "05:00",
      "05:15",
      "05:30",
      "05:45",
      "06:00",
      "06:15",
      "06:30",
      "06:45",
      "07:00",
      "07:15",
      "07:30",
      "07:45",
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
      "12:15",
      "12:30",
      "12:45",
      "13:00",
      "13:15",
      "13:30",
      "13:45",
      "14:00",
      "14:15",
      "14:30",
      "14:45",
      "15:00",
      "15:15",
      "15:30",
      "15:45",
      "16:00",
      "16:15",
      "16:30",
      "16:45",
      "17:00",
      "17:15",
      "17:30",
      "17:45",
      "18:00",
      "18:15",
      "18:30",
      "18:45",
      "19:00",
      "19:15",
      "19:30",
      "19:45",
      "20:00",
      "20:15",
      "20:30",
      "20:45",
      "21:00",
      "21:15",
      "21:30",
      "21:45",
      "22:00",
      "22:15",
      "22:30",
      "22:45",
      "23:00",
      "23:15",
      "23:30",
      "23:45",
    ],
    "City center hotel to Airport": [
      "00:00",
      "00:15",
      "00:30",
      "00:45",
      "01:00",
      "01:15",
      "01:30",
      "01:45",
      "02:00",
      "02:15",
      "02:30",
      "02:45",
      "03:00",
      "03:15",
      "03:30",
      "03:45",
      "04:00",
      "04:15",
      "04:30",
      "04:45",
      "05:00",
      "05:15",
      "05:30",
      "05:45",
      "06:00",
      "06:15",
      "06:30",
      "06:45",
      "07:00",
      "07:15",
      "07:30",
      "07:45",
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
      "12:15",
      "12:30",
      "12:45",
      "13:00",
      "13:15",
      "13:30",
      "13:45",
      "14:00",
      "14:15",
      "14:30",
      "14:45",
      "15:00",
      "15:15",
      "15:30",
      "15:45",
      "16:00",
      "16:15",
      "16:30",
      "16:45",
      "17:00",
      "17:15",
      "17:30",
      "17:45",
      "18:00",
      "18:15",
      "18:30",
      "18:45",
      "19:00",
      "19:15",
      "19:30",
      "19:45",
      "20:00",
      "20:15",
      "20:30",
      "20:45",
      "21:00",
      "21:15",
      "21:30",
      "21:45",
      "22:00",
      "22:15",
      "22:30",
      "22:45",
      "23:00",
      "23:15",
      "23:30",
      "23:45",
    ],
    "City center hotel to airport": [
      "00:00",
      "00:15",
      "00:30",
      "00:45",
      "01:00",
      "01:15",
      "01:30",
      "01:45",
      "02:00",
      "02:15",
      "02:30",
      "02:45",
      "03:00",
      "03:15",
      "03:30",
      "03:45",
      "04:00",
      "04:15",
      "04:30",
      "04:45",
      "05:00",
      "05:15",
      "05:30",
      "05:45",
      "06:00",
      "06:15",
      "06:30",
      "06:45",
      "07:00",
      "07:15",
      "07:30",
      "07:45",
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
      "12:15",
      "12:30",
      "12:45",
      "13:00",
      "13:15",
      "13:30",
      "13:45",
      "14:00",
      "14:15",
      "14:30",
      "14:45",
      "15:00",
      "15:15",
      "15:30",
      "15:45",
      "16:00",
      "16:15",
      "16:30",
      "16:45",
      "17:00",
      "17:15",
      "17:30",
      "17:45",
      "18:00",
      "18:15",
      "18:30",
      "18:45",
      "19:00",
      "19:15",
      "19:30",
      "19:45",
      "20:00",
      "20:15",
      "20:30",
      "20:45",
      "21:00",
      "21:15",
      "21:30",
      "21:45",
      "22:00",
      "22:15",
      "22:30",
      "22:45",
      "23:00",
      "23:15",
      "23:30",
      "23:45",
    ],
    "4 hrs cab at disposal": [
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
      "12:15",
      "12:30",
      "12:45",
      "13:00",
      "13:15",
      "13:30",
      "13:45",
      "14:00",
      "14:15",
      "14:30",
      "14:45",
      "15:00",
      "15:15",
      "15:30",
      "15:45",
      "16:00",
    ],
    "8 hrs cab at disposal": [
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
    ],
    "12 hrs cab at disposal": ["08:00"],
    "10 hrs cab at disposal": [
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
    ],
  };

  const defaultTimings = [
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
  ];
  return (
    <>
      <Popup
        condition={flightSessionExpiredPopup}
        close={() => actions.setSessionPopup(false)}
      >
        Your session has expired please start the flight search again.
        <div>
          <button
            onClick={() => {
              actions.editFlightSearch();
              actions.setSessionPopup(false);
            }}
          >
            OK
          </button>
        </div>
      </Popup>

      <div className="flightSearch-container">
        {searchingFlights || flightErrorMessage || flightResList.length > 0 ? (
          <FlightSearchRes
            originCityName={originCityName}
            destCityName={destCityName}
            flightCabinClass={flightCabinClass}
            outboundDate={outboundDate}
            inboundDate={inboundDate}
            multiCities={multiCities}
            journeyType={journeyType}
          />
        ) : searchingHotels || hotelErrorMessage || hotelResList.length > 0 ? (
          <HotelResList />
        ) : searchingCabs || cabResList.length > 0 ? (
          <CabResList />
        ) : searchingBus || busResList?.length > 0 ? (
          <BusResList />
        ) : (
          <div className="flightSearch-block">
            <Navbar />
            <div className="flightSearch-notifications hidden">
              {/* notifications?.length > 0 */}
              {notifications?.length > 0 ? (
                <div className="role-type-approval">
                  {notifications?.map((notification) => {
                    return (
                      <div className="role-approval">
                        <span>
                          Please approve manager request of {notification.name}(
                          {notification.email})
                        </span>
                        <button
                          className="text-black ml-[20px] bg-white text-[16px] rounded-md py-[4px] px-[8px]"
                          onClick={() => navigate("/roles")}
                        >
                          Review and Approve
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="flightSearch-block-inputs">
              <div className="flightSearch-tabs">
                <div
                  className={
                    selectedTab === "flights"
                      ? "flightSearch-tab flightSearch-tab-selected"
                      : "flightSearch-tab"
                  }
                  onClick={() => setSelectedTab("flights")}
                >
                  <FontAwesomeIcon icon={faPlaneDeparture} className="mr-2" />{" "}
                  Flights
                </div>
                <div
                  className={
                    selectedTab === "hotels"
                      ? "flightSearch-tab flightSearch-tab-selected"
                      : "flightSearch-tab"
                  }
                  onClick={() => setSelectedTab("hotels")}
                >
                  <FontAwesomeIcon icon={faHotel} className="mr-2" /> Hotels
                </div>
                <div
                  className={
                    selectedTab === "cabs"
                      ? "flightSearch-tab flightSearch-tab-selected"
                      : "flightSearch-tab"
                  }
                  onClick={() => setSelectedTab("cabs")}
                >
                  <FontAwesomeIcon icon={faTaxi} className="mr-2" /> Cabs
                </div>
                <div
                  className={
                    selectedTab === "bus"
                      ? "flightSearch-tab flightSearch-tab-selected"
                      : "flightSearch-tab"
                  }
                  onClick={() => setSelectedTab("bus")}
                >
                  <FontAwesomeIcon icon={faBus} className="mr-2" /> Bus
                </div>
              </div>
              {selectedTab === "hotels" ? (
                <>
                  <div className="flightSearch-block-inputs-section">
                    <div className="flightSearch-oriDest-input">
                      <p className="text-red-500">{hotelDestError}</p>
                      {cityHotelDisplay ? (
                        <input
                          type="text"
                          value={cityHotelQuery}
                          className="hotel-input"
                          placeholder="Destination"
                          onChange={(e) => {
                            setCityHotelQuery(e.target.value);
                            setCityHotelResBox(true);
                            actions.handleChangeCityHotel(e.target.value);
                          }}
                          onBlur={() => setCityHotelDisplay(false)}
                          autoFocus={cityHotelDisplay}
                        />
                      ) : (
                        <div
                          className={`hotelSearch-oriDest-input-box ${
                            hotelDestError
                              ? "!border-[1px] !border-solid !border-red-500"
                              : ""
                          }`}
                          onClick={() => setCityHotelDisplay(true)}
                        >
                          {cityHotelItem &&
                          Object.keys(cityHotelItem).length > 0 ? (
                            <>
                              <div className="flightSearch-oriDest-input-box-cityName">
                                {`${cityHotelItem.DESTINATION}, ${
                                  cityHotelItem.STATEPROVINCE
                                    ? cityHotelItem.STATEPROVINCE
                                    : cityHotelItem.COUNTRY
                                }`}
                              </div>
                            </>
                          ) : (
                            <span className="flightSearch-oriDest-input-box-placeholder">
                              Destination
                            </span>
                          )}
                        </div>
                      )}

                      {cityHotelResBox ? (
                        <div className="flightSearch-oriDest-input-results hotel-result">
                          {cityHotelRes.length === 0 ? (
                            <div>Loading...</div>
                          ) : (
                            cityHotelRes.map((cityHotel, a) => {
                              return (
                                <div
                                  className="flightSearch-oriDest-input-result "
                                  key={`${cityHotel.refIndex}-${a}`}
                                  onClick={() => {
                                    setCityHotel(cityHotel.item.CITYID);
                                    setCountryCode(cityHotel.item.COUNTRYCODE);
                                    actions.setHotelCountryCode(
                                      cityHotel.item.COUNTRYCODE
                                    );
                                    setCityHotelItem(cityHotel.item);
                                    setCityHotelDisplay(false);
                                    setCityHotelResBox(false);
                                    setHotelDestError("");
                                  }}
                                >
                                  <div className="flightSearch-oriDest-input-result-name">
                                    <div className="flightSearch-oriDest-input-result-countryCity">
                                      {`${cityHotel.item?.DESTINATION}, ${
                                        cityHotel.item?.STATEPROVINCE &&
                                        cityHotel.item?.COUNTRY
                                        // ? cityHotel.item?.STATEPROVINCE
                                        // : cityHotel.item?.COUNTRY
                                      }`}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="hotelSearch-dates">
                      <div>
                        {hotelCheckinError && (
                          <p className="text-red-500">{hotelCheckinError}</p>
                        )}
                        <ReactDatePicker
                          minDate={new Date()}
                          selected={checkInDate}
                          startDate={checkInDate}
                          endDate={checkOutDate}
                          selectsStart
                          popperPlacement="auto-start"
                          showPopperArrow={false}
                          onChange={(e) => handleHotelDates(e, "checkInDate")}
                          showMonthYearDropdown
                          dateFormat="EEE, MMM d"
                          fixedHeight
                          withPortal
                          placeholderText="Check-In date"
                          className={`flightSearch-dates-input ${
                            hotelCheckinError
                              ? "!border-[1px]  !border-solid !border-red-500"
                              : ""
                          }`}
                          id="flightSearch-departureDate"
                        />
                      </div>
                      <div>
                        {hotelCheckOutError && (
                          <p className="text-red-500">{hotelCheckOutError}</p>
                        )}
                        <ReactDatePicker
                          minDate={checkInDate}
                          selected={checkOutDate}
                          startDate={checkInDate}
                          endDate={checkOutDate}
                          selectsEnd
                          popperPlacement="auto-start"
                          showPopperArrow={false}
                          onChange={(e) => handleHotelDates(e, "checkOutDate")}
                          showMonthYearDropdown
                          dateFormat="EEE, MMM d"
                          fixedHeight
                          withPortal
                          placeholderText="Check-Out date"
                          className={`flightSearch-dates-input ${
                            hotelCheckOutError
                              ? "!border-[1px] !border-solid !border-red-500"
                              : ""
                          }`}
                          id="flightSearch-returnDate"
                        />
                      </div>
                    </div>
                    <div className="hotelSearch-nightsRoom">
                      <HiddenInput
                        inputOnChange={setHotelNights}
                        inputType="number"
                        inputValue={hotelNights}
                        disabled={true}
                      >
                        <div className="flightSearch-passenger-disp-title">
                          Nights
                        </div>
                        <span className="flightSearch-passenger-disp-num">
                          {hotelNights}
                        </span>
                      </HiddenInput>
                      <HiddenSelect
                        selectType="number"
                        selectValue={hotelRooms}
                        selectOnChange={handleHotelRooms}
                        options={[1, 2, 3, 4]}
                      >
                        <div className="flightSearch-passenger-disp-title">
                          Rooms
                        </div>
                        <span className="flightSearch-passenger-disp-num">
                          {hotelRooms}
                        </span>
                      </HiddenSelect>
                    </div>
                    {hotelRoomArr &&
                      hotelRoomArr.map((room, r) => {
                        return (
                          <div className="hotelSearch-room-adultsChild">
                            <div className="hotelSearch-room-adultsChild-title">{`Room ${
                              r + 1
                            }`}</div>
                            <div className="hotelSearch-passenger-adultsChild">
                              <HiddenSelect
                                selectType="number"
                                selectValue={room.adults}
                                selectOnChange={(val) =>
                                  handleHotelRoomsArr(val, "adults", r)
                                }
                                options={[1, 2]}
                              >
                                <div className="flightSearch-passenger-disp-title">
                                  Adults
                                </div>
                                <span className="flightSearch-passenger-disp-num">
                                  {room.adults}
                                </span>
                              </HiddenSelect>
                              {/* <HiddenSelect
                              selectType="number"
                              selectValue={room.child}
                              selectOnChange={(val) =>
                                handleHotelRoomsArr(val, "child", r)
                              }
                              options={[0, 1, 2]}
                            >
                              <div className="flightSearch-passenger-disp-title">
                                Children (0-12 yrs)
                              </div>
                              <span className="flightSearch-passenger-disp-num">
                                {room.child}
                              </span>
                            </HiddenSelect> */}
                            </div>

                            <div className="hotelSearch-passenger-childAge">
                              {room.childAge &&
                                room.childAge.map((child, c) => {
                                  return (
                                    <HiddenSelect
                                      selectType="number"
                                      selectValue={child.age}
                                      options={[
                                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                                      ]}
                                      selectOnChange={(age) => {
                                        let roomsArr = [...hotelRoomArr];

                                        roomsArr[r].childAge[c].age = age;

                                        setHotelRoomArr(roomsArr);
                                      }}
                                    >
                                      <div className="flightSearch-passenger-disp-title">
                                        {`Child ${c + 1} age`}
                                      </div>
                                      <span className="flightSearch-passenger-disp-num">
                                        {child.age}
                                      </span>
                                    </HiddenSelect>
                                  );
                                })}
                            </div>
                          </div>
                        );
                      })}

                    <div className="flightSearch-search">
                      <button
                        onClick={() => {
                          if (cityHotel === "") {
                            setHotelDestError("Select City");
                          } else if (checkInDate === "") {
                            setHotelDestError("");
                            setHotelCheckinError("Select Check in date");
                          } else if (checkOutDate === "") {
                            setHotelCheckinError("");
                            setHotelCheckOutError("Select Check out date");
                          } else {
                            setHotelCheckOutError("");
                            actions.hotelSearch({
                              cityHotel,
                              cityDestName: `${cityHotelItem.DESTINATION}, ${cityHotelItem.STATEPROVINCE}`,
                              countryCode,
                              checkInDate,
                              checkOutDate,
                              hotelNights,
                              hotelRooms,
                              hotelRoomArr,
                            });
                          }
                        }}
                      >
                        Search Hotels
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {selectedTab === "flights" ? (
                <div className="flightSearch-block-inputs-section">
                  <div className="flightSearch-journeyType">
                    <div
                      className={
                        journeyType === "1"
                          ? "flightSearch-journeyType-btn flightSearch-journeyType-btn-selected"
                          : "flightSearch-journeyType-btn"
                      }
                    >
                      <button
                        onClick={() => {
                          setJourneyType("1");
                          setInBoundDate("");
                        }}
                      >
                        One way
                      </button>
                    </div>
                    <div
                      className={
                        journeyType === "2"
                          ? "flightSearch-journeyType-btn flightSearch-journeyType-btn-selected"
                          : "flightSearch-journeyType-btn"
                      }
                    >
                      <button onClick={() => setJourneyType("2")}>
                        Round Trip
                      </button>
                    </div>
                    <div
                      className={
                        journeyType === "3"
                          ? "flightSearch-journeyType-btn flightSearch-journeyType-btn-selected"
                          : "flightSearch-journeyType-btn"
                      }
                    >
                      <button onClick={() => setJourneyType("3")}>
                        Multi City
                      </button>
                    </div>
                  </div>

                  <p className="text-red-500">{flightOriginError}</p>
                  <div className="flightSearch-input">
                    <div className="flightSearch-oriDest">
                      <div className="flightSearch-oriDest-input">
                        {originDisplay ? (
                          <input
                            type="text"
                            value={origin}
                            placeholder="Origin"
                            onChange={(e) => {
                              setOrigin(e.target.value);
                              setOriginAirport("");
                              setOriginRes(true);
                              if (e.target.value === "") {
                                setOriginRes(false);
                              }
                              actions.handleChangeAirportKeyword(
                                e.target.value,
                                "origin"
                              );
                            }}
                            onBlur={() => setOriginDisplay(false)}
                            autoFocus={originDisplay}
                            className={`focus:!outline-none`}
                          />
                        ) : (
                          <div
                            className={`flightSearch-oriDest-input-box ${
                              flightOriginError
                                ? "!border-[1px] !border-solid !border-red-500"
                                : ""
                            }`}
                            onClick={() => setOriginDisplay(true)}
                          >
                            {originCityName ? (
                              <>
                                <div className="flightSearch-oriDest-input-box-cityName">
                                  {originCityName}
                                </div>
                                <div className="flightSearch-oriDest-input-box-airport">
                                  {`${originAirport}, ${originAirportName}`}
                                </div>
                              </>
                            ) : (
                              <span>Origin</span>
                            )}
                          </div>
                        )}
                        {originRes ? (
                          <div className="flightSearch-oriDest-input-results">
                            {airportOriginLoading ? (
                              <div>Loading ...</div>
                            ) : airportOriginData.length === 0 ? (
                              <div>No results</div>
                            ) : (
                              airportOriginData.map((airport, a) => {
                                return (
                                  <div
                                    className="flightSearch-oriDest-input-result"
                                    key={`${airport.iataCode}-${a}`}
                                    onClick={() => {
                                      setOriginRes(false);
                                      setOriginAirport(airport.iataCode);
                                      setOriginCityName(
                                        airport.address?.cityName
                                          .slice(0, 1)
                                          .toUpperCase() +
                                          airport.address?.cityName
                                            .slice(1)
                                            .toLowerCase()
                                      );
                                      console.log(airport);
                                      setOriginAirportName(airport.name);
                                      setOrigin("");
                                      setOriginDisplay(false);
                                      setFlightOriginError("");
                                    }}
                                  >
                                    <div className="flightSearch-oriDest-input-result-name">
                                      <div className="flightSearch-oriDest-input-result-countryCity">
                                        {`${airport.address?.cityName}, ${airport.address?.countryName}`}
                                      </div>
                                      <div className="flightSearch-oriDest-input-result-airport">
                                        {airport.name}
                                      </div>
                                    </div>
                                    <div className="flightSearch-oriDest-input-result-code">
                                      {airport.iataCode}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        ) : null}
                      </div>
                      <div className="flightSearch-oriDest-swap">
                        <FontAwesomeIcon
                          icon={faRightLeft}
                          onClick={swapValues}
                        />
                      </div>
                      <div className="flightSearch-oriDest-input">
                        <p className="text-red-500">{flightDestError}</p>
                        {destDisplay ? (
                          <input
                            type="text"
                            value={destination}
                            placeholder="Destination"
                            onChange={(e) => {
                              setDestination(e.target.value);
                              setDestAirport("");
                              setDestRes(true);
                              if (e.target.value === "") {
                                setDestRes(false);
                              }
                              actions.handleChangeAirportKeyword(
                                e.target.value,
                                "destination"
                              );
                            }}
                            onBlur={() => setDestDisplay(false)}
                            autoFocus={destDisplay}
                          />
                        ) : (
                          <div
                            className={`flightSearch-oriDest-input-box ${
                              flightDestError
                                ? "!border-[1px] !border-solid !border-red-500"
                                : ""
                            }`}
                            onClick={() => setDestDisplay(true)}
                          >
                            {destCityName ? (
                              <>
                                <div className="flightSearch-oriDest-input-box-cityName">
                                  {destCityName}
                                </div>
                                <div className="flightSearch-oriDest-input-box-airport">
                                  {`${destAirport}, ${destAirportName}`}
                                </div>
                              </>
                            ) : (
                              <span>Destination</span>
                            )}
                          </div>
                        )}

                        {destRes ? (
                          <div className="flightSearch-oriDest-input-results">
                            {airportDestLoading ? (
                              <div>Loading ...</div>
                            ) : airportDestData.length === 0 ? (
                              <div>No results</div>
                            ) : (
                              airportDestData.map((airport, a) => {
                                return (
                                  <div
                                    className="flightSearch-oriDest-input-result"
                                    key={`${airport.iataCode}-${a}`}
                                    onClick={() => {
                                      setDestRes(false);
                                      setDestAirport(airport.iataCode);
                                      setDestCityName(
                                        airport.address?.cityName
                                          .slice(0, 1)
                                          .toUpperCase() +
                                          airport.address?.cityName
                                            .slice(1)
                                            .toLowerCase()
                                      );
                                      setDestAirportName(airport.name);
                                      setDestination("");
                                      setDestDisplay(false);
                                      setFlightDestError("");
                                    }}
                                  >
                                    <div className="flightSearch-oriDest-input-result-name">
                                      <div className="flightSearch-oriDest-input-result-countryCity">
                                        {`${airport.address?.cityName}, ${airport.address?.countryName}`}
                                      </div>
                                      <div className="flightSearch-oriDest-input-result-airport">
                                        {airport.name}
                                      </div>
                                    </div>
                                    <div className="flightSearch-oriDest-input-result-code">
                                      {airport.iataCode}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div
                      className={
                        journeyType === "2"
                          ? "flightSearch-dates flightSearch-dates-split"
                          : "flightSearch-dates"
                      }
                    >
                      <div className="flightSearch-dates-out">
                        {flightDepError && (
                          <p className="text-red-500">{flightDepError}</p>
                        )}
                        <ReactDatePicker
                          minDate={new Date()}
                          selected={outboundDate}
                          selectsStart={journeyType === "2"}
                          startDate={outboundDate}
                          endDate={inboundDate}
                          popperPlacement="auto-start"
                          showPopperArrow={false}
                          onChange={(e) => {
                            setOutBoundDate(e);
                            setFlightDepError("");
                          }}
                          showMonthYearDropdown
                          dateFormat="EEE, MMM d"
                          fixedHeight
                          withPortal
                          placeholderText="Departure"
                          className={`flightSearch-dates-input ${
                            flightDepError
                              ? "!border-[1px] !border-solid !border-red-500"
                              : ""
                          }`}
                          id="flightSearch-departureDate"
                        />
                        {/* <input
                    type="date"
                    value={outboundDate}
                    onChange={(e) => setOutBoundDate(e.target.value)}
                  /> */}
                      </div>
                      {journeyType === "2" ? (
                        <div className="flightSearch-dates-out">
                          {flightReturnError && (
                            <p className="text-red-500">{flightReturnError}</p>
                          )}
                          <ReactDatePicker
                            minDate={outboundDate}
                            selected={inboundDate}
                            selectsEnd
                            startDate={outboundDate}
                            endDate={inboundDate}
                            popperPlacement="auto-start"
                            showPopperArrow={false}
                            onChange={(e) => {
                              setInBoundDate(e);
                              setFlightReturnErrror("");
                            }}
                            showMonthYearDropdown
                            dateFormat="EEE, MMM d"
                            fixedHeight
                            withPortal
                            placeholderText="Return"
                            className={`flightSearch-dates-input ${
                              flightReturnError
                                ? "!border-[1px] !border-solid !border-red-500"
                                : ""
                            }`}
                            id="flightSearch-returnDate"
                          />
                          {/* <input
                      type="date"
                      value={inboundDate}
                      onChange={(e) => setInBoundDate(e.target.value)}
                    /> */}
                        </div>
                      ) : null}
                      {journeyType === "3" ? (
                        <button
                          className="bg-black text-white rounded-lg px-6 py-2"
                          onClick={() => {
                            if (originAirport === "") {
                              return false;
                            } else if (destAirport === "") {
                              return false;
                            } else if (outboundDate === "") {
                              return false;
                            } else if (multiCities.length === 3) {
                              alert("Maximum 3 cities are allowed");
                              return false;
                            }
                            const multiObj = {
                              Origin: originAirport,
                              Destination: destAirport,
                              FlightCabinClass: cabinclass[flightCabinClass],
                              PreferredDepartureTime: new Date(outboundDate),
                              PreferredArrivalTime: new Date(outboundDate),
                            };
                            setMultiCities((p) => [...p, multiObj]);
                            setOriginAirport("");
                            setDestCityName("");
                            setOriginCityName("");
                            setDestAirport("");
                            setOutBoundDate("");
                          }}
                        >
                          Add
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    {journeyType === "3" ? (
                      <>
                        {multiCities.map((e, i) => (
                          <div key={i} className="flex gap-6 items-center my-1">
                            <div className="flex w-[50%] justify-between font-semibold items-center">
                              <p>{e.Origin}</p>
                              <p>{e.Destination}</p>

                              <p>
                                {format(
                                  new Date(e.PreferredArrivalTime),
                                  "dd-MMM-yyyy"
                                )}
                              </p>
                            </div>
                            <FaTrash
                              size={15}
                              onClick={() => handleDelete(i)}
                              className="  rounded-lg  text-sm cursor-pointer text-red-500"
                            />
                          </div>
                        ))}
                      </>
                    ) : null}
                  </div>
                  <div className="flightSearch-passengers">
                    <div className="flightSearch-passenger">
                      {adultsDisp ? (
                        <div
                          className="flightSearch-passenger-disp"
                          onClick={() => setAdultsDisp(false)}
                        >
                          <div className="flightSearch-passenger-disp-title">
                            Adults
                            <span>&nbsp;(12yrs+)</span>
                          </div>

                          <span className="flightSearch-passenger-disp-num">
                            {adults}
                          </span>
                        </div>
                      ) : (
                        <select
                          type="number"
                          value={adults}
                          onChange={(e) => setAdults(e.target.value)}
                          autoFocus={!adultsDisp}
                          onBlur={() => setAdultsDisp(true)}
                        >
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>
                          <option>9</option>
                        </select>
                      )}
                    </div>
                    {/* <div className="flightSearch-passenger">
                        {childDisp ? (
                          <div
                            className="flightSearch-passenger-disp"
                            onClick={() => setChildDisp(false)}
                          >
                            <div className="flightSearch-passenger-disp-title">
                              Children
                              <span>&nbsp;(2-12yrs)</span>
                            </div>

                            <span className="flightSearch-passenger-disp-num">
                              {children}
                            </span>
                          </div>
                        ) : (
                          <select
                            type="number"
                            value={children}
                            onChange={(e) => setChildren(e.target.value)}
                            autoFocus={!childDisp}
                            onBlur={() => setChildDisp(true)}
                          >
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                          </select>
                        )}
                      </div>
                      <div className="flightSearch-passenger">
                        {infantDisp ? (
                          <div
                            className="flightSearch-passenger-disp"
                            onClick={() => setInfantDisp(false)}
                          >
                            <div className="flightSearch-passenger-disp-title">
                              Infants
                              <span>&nbsp;(&lt; 2yrs)</span>
                            </div>
                            <span className="flightSearch-passenger-disp-num">
                              {infants}
                            </span>
                          </div>
                        ) : (
                          <select
                            type="number"
                            value={infants}
                            onChange={(e) => setInfants(e.target.value)}
                            autoFocus={!infantDisp}
                            onBlur={() => setInfantDisp(true)}
                          >
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                          </select>
                        )}
                      </div> */}
                    <div className="flightSearch-cabinclass">
                      <select
                        value={flightCabinClass}
                        onChange={(e) => setFlightCabinClass(e.target.value)}
                      >
                        <option>Economy</option>
                        <option>Premium Economy</option>
                        <option>Business</option>
                        <option>First</option>
                        <option>Any cabin class</option>
                      </select>
                    </div>
                    <div className="flightSearch-search-directOneStop">
                      <div className="flightSearch-directOneStop">
                        <div className="flightSearch-directOneStop-input">
                          <input
                            type="checkbox"
                            value={directFlight}
                            onChange={(e) => setDirectFlight((prev) => !prev)}
                          />
                          <label>Direct flights only</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flightSearch-search">
                    <button
                      onClick={() => {
                        const con = parseInt(adults);

                        if (con > 9) {
                          setPassengerError("Don't Exceed 9 passengers");
                        } else {
                          setPassengerError("");
                          setJType(0);
                          actions.getLastDoc();
                          if (journeyType === "1") {
                            if (originAirport === "") {
                              setFlightOriginError("Select origin");
                            } else if (destAirport === "") {
                              setFlightOriginError("");
                              setFlightDestError("Select destination");
                            } else if (outboundDate === "") {
                              setFlightOriginError("");
                              setFlightDepError("Select travel date");
                            } else {
                              setFlightDepError("");
                              actions.flightSearch({
                                adults,
                                child: children,
                                infant: infants,
                                directFlight,
                                oneStopFlight,
                                journeyType,
                                originAirport,
                                destAirport,
                                outboundDate: new Date(outboundDate),
                                inboundDate: new Date(inboundDate),
                                flightCabinClass: cabinclass[flightCabinClass],
                              });
                            }
                          } else if (journeyType === "2") {
                            console.log("this is two way");
                            if (originAirport === "") {
                              setFlightOriginError("Select origin");
                            } else if (destAirport === "") {
                              setFlightOriginError("");
                              setFlightDestError("Select destination");
                            } else if (outboundDate === "") {
                              setFlightDestError("");
                              setFlightDepError("Select travel date");
                            } else if (inboundDate === "") {
                              setFlightDepError("");
                              // setFlightError("Select return date");
                              setFlightReturnErrror("Select return date");
                            } else {
                              setFlightReturnErrror("");
                              actions.flightSearch({
                                adults,
                                child: children,
                                infant: infants,
                                directFlight,
                                oneStopFlight,
                                journeyType,
                                originAirport,
                                destAirport,
                                outboundDate: new Date(outboundDate),
                                inboundDate: new Date(inboundDate),
                                flightCabinClass: cabinclass[flightCabinClass],
                              });
                            }
                          } else if (journeyType === "3") {
                            if (multiCities.length < 2) {
                              alert("Add minimum 2 cities");
                              return false;
                            } else if (multiCities.length > 3) {
                              alert("Maximum 3 cities are allowed");
                              return false;
                            }

                            actions.flightSearch({
                              adults,
                              child: children,
                              infant: infants,
                              directFlight,
                              oneStopFlight,
                              journeyType,
                              originAirport,
                              destAirport,
                              outboundDate: new Date(outboundDate),
                              inboundDate: new Date(inboundDate),
                              flightCabinClass: cabinclass[flightCabinClass],
                              multiCities,
                            });
                          }

                          setDirectFlight(false);
                          console.log(adults, children, infants);
                        }
                      }}
                    >
                      Search Flights
                    </button>

                    {/* {flightSessionStarted || flightSessionExpired ? (
                  <div
                    className={
                      flightSessionStarted
                        ? "flightSearch-sessionStatus flightSearch-sessionStatus-started"
                        : flightSessionExpired
                        ? "flightSearch-sessionStatus flightSearch-sessionStatus-expired"
                        : "flightSearch-sessionStatus"
                    }
                  >
                    {flightSessionStarted
                      ? "Session started"
                      : flightSessionExpired
                      ? "Session expired"
                      : ""}
                  </div>
                ) : null} */}
                  </div>

                  <p className="text-red-500 text-[14px] pl-4">
                    {passengerError}
                  </p>
                </div>
              ) : null}
              {selectedTab === "cabs" ? (
                <div className="flightSearch-block-inputs-section">
                  <div className="flightSearch-oriDest-input">
                    <p className="text-red-500">{cabDestErrror}</p>
                    {cabCityDisplay ? (
                      <input
                        type="text"
                        value={cabCity}
                        className="hotel-input"
                        placeholder="Destination"
                        onChange={(e) => {
                          setCabCity(e.target.value);
                          setCityCabResBox(true);

                          actions.handleChangeCityCab(e.target.value);
                        }}
                        onBlur={() => setCabCityDisplay(false)}
                        autoFocus={cabCityDisplay}
                      />
                    ) : (
                      <div
                        className={`hotelSearch-oriDest-input-box ${
                          cabDestErrror
                            ? "!border-[1px] !border-solid !border-red-500"
                            : ""
                        }`}
                        onClick={() => setCabCityDisplay(true)}
                      >
                        {cabCityItem && cabCityItem.cityName ? (
                          <>
                            <div className="flightSearch-oriDest-input-box-cityName">
                              {`${cabCityItem.cityName}`}
                            </div>
                          </>
                        ) : (
                          <span className="flightSearch-oriDest-input-box-placeholder">
                            Destination
                          </span>
                        )}
                      </div>
                    )}
                    {cityCabResBox ? (
                      <div className="flightSearch-oriDest-input-results hotel-result">
                        {cabSearchRes.length === 0 ? (
                          <div>No results</div>
                        ) : (
                          cabSearchRes.map((cityHotel, a) => {
                            return (
                              <div
                                className="flightSearch-oriDest-input-result "
                                key={`${cityHotel.refIndex}-${a}`}
                                onClick={() => {
                                  setCabCityDisplay(false);
                                  setCityCabResBox(false);
                                  setCabCityItem(cityHotel.item);
                                  setCabDestError("");
                                }}
                              >
                                <div className="flightSearch-oriDest-input-result-name">
                                  <div className="flightSearch-oriDest-input-result-countryCity">
                                    {`${cityHotel.item.cityName}
                                      `}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    ) : null}
                  </div>
                  <div className="flightSearch-cabType">
                    {cabCityItem && cabCityItem.types.length > 0 ? (
                      <select
                        value={cabType}
                        onChange={(e) => {
                          if (!cabTypes.includes(e.target.value)) {
                            setCabEndDate("");
                          }
                          setCabType(e.target.value);
                          console.log(e.target.value);
                        }}
                      >
                        {cabCityItem.types.map((type) => {
                          return <option>{type}</option>;
                        })}
                      </select>
                    ) : (
                      <span className="flightSearch-oriDest-input-box-placeholder">
                        Select the city first
                      </span>
                    )}

                    <div className="cabSearch-dates">
                      <div>
                        <p className="text-red-500">{cabStartError}</p>
                        <ReactDatePicker
                          minDate={new Date()}
                          selected={cabStartDate}
                          startDate={cabStartDate}
                          endDate={cabEndDate}
                          selectsStart
                          popperPlacement="auto-start"
                          showPopperArrow={false}
                          onChange={(e) => handleCabDates(e, "cabStartDate")}
                          showMonthYearDropdown
                          dateFormat="EEE, MMM d"
                          fixedHeight
                          withPortal
                          placeholderText="Start date"
                          className={`flightSearch-dates-input ${
                            cabStartError
                              ? "!border-[1px] !border-solid !border-red-500"
                              : ""
                          }`}
                          id="flightSearch-departureDate"
                        />
                      </div>
                      {cabType && cabTypes.includes(cabType) ? (
                        <>
                          <div>
                            <p className="text-red-500">{cabEndError}</p>
                            <ReactDatePicker
                              minDate={cabStartDate}
                              selected={cabEndDate}
                              startDate={cabStartDate}
                              endDate={cabEndDate}
                              selectsEnd
                              popperPlacement="auto-start"
                              showPopperArrow={false}
                              onChange={(e) => handleCabDates(e, "cabEndDate")}
                              showMonthYearDropdown
                              dateFormat="EEE, MMM d"
                              fixedHeight
                              withPortal
                              placeholderText="End date"
                              className={`flightSearch-dates-input ${
                                cabEndError
                                  ? "!border-[1px] !border-solid !border-red-500"
                                  : ""
                              }`}
                              id="flightSearch-departureDate"
                            />
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="cabSearch-select">
                    {cabCountDisplay ? (
                      <select
                        type="number"
                        value={noOfCabs}
                        onChange={(e) => setNoOfCabs(e.target.value)}
                        autoFocus={cabCountDisplay}
                        onBlur={() => setCabCountDisplay(false)}
                      >
                        {[1, 2, 3, 4].map((option, o) => {
                          return <option>{option}</option>;
                        })}
                      </select>
                    ) : (
                      <div
                        className="flightSearch-passenger-cab"
                        onClick={() => setCabCountDisplay(true)}
                      >
                        <div className="flightSearch-passenger-cab-title">
                          No of Cabs
                        </div>
                        <span className="flightSearch-passenger-cab-num">
                          {noOfCabs}
                        </span>
                      </div>
                    )}
                    {cabTimeDisplay ? (
                      <select
                        type="number"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        autoFocus={cabTimeDisplay}
                        onBlur={() => setCabTimeDisplay(false)}
                      >
                        {cabTimings[cabType] ? (
                          <>
                            {cabTimings[cabType].map((option, o) => {
                              return <option>{option}</option>;
                            })}
                          </>
                        ) : (
                          <>
                            {defaultTimings.map((option, o) => {
                              return <option>{option}</option>;
                            })}
                          </>
                        )}
                      </select>
                    ) : (
                      <div
                        className="flightSearch-passenger-cab"
                        onClick={() => setCabTimeDisplay(true)}
                      >
                        <div className="flightSearch-passenger-cab-title">
                          Time
                        </div>
                        <span className="flightSearch-passenger-cab-num">
                          {selectedTime}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="cabSearch-search">
                    <button
                      onClick={async () => {
                        if (cabCityItem === null) {
                          setCabDestError("Select cab city");
                        } else if (cabStartDate === "") {
                          setCabDestError("");
                          setCabStartError("Select cab start date");
                        } else if (
                          cabType &&
                          cabTypes.includes(cabType) &&
                          cabEndDate === ""
                        ) {
                          setCabStartError("");
                          setCabEndError("Select cab end date");
                        } else {
                          setCabEndError("");
                          await actions.fetchCabs(
                            cabCityItem.cityName,
                            cabType,
                            cabStartDate,
                            cabEndDate,
                            noOfCabs,
                            Number(nights) + 1,
                            selectedTime
                          );
                        }
                      }}
                    >
                      Search Cabs
                    </button>
                  </div>
                </div>
              ) : null}
              {selectedTab === "bus" ? (
                <div className="flightSearch-block-inputs-section">
                  <div className="flightSearch-input">
                    <div className="flightSearch-oriDest">
                      <div className="flightSearch-oriDest-input">
                        <p className="text-red-500">{busDesError}</p>
                        {busOriginDisplay ? (
                          <input
                            type="text"
                            value={busOrigin}
                            placeholder="Origin"
                            onChange={(e) => {
                              setBusOrigin(e.target.value);

                              setBusOriginRes(true);
                              if (e.target.value === "") {
                                setBusOriginRes(false);
                              }
                              actions.handleChangeBusKeyword(
                                e.target.value,
                                "origin"
                              );
                            }}
                            onBlur={() => setBusOriginDisplay(false)}
                            autoFocus={busOriginDisplay}
                          />
                        ) : (
                          <div
                            className={`flightSearch-oriDest-input-box ${
                              busDesError
                                ? "!border-[1px] !border-solid !border-red-500"
                                : ""
                            }`}
                            onClick={() => setBusOriginDisplay(true)}
                          >
                            {busOriginCityName ? (
                              <>
                                <div className="flightSearch-oriDest-input-box-cityName">
                                  {busOriginCityName}
                                </div>
                              </>
                            ) : (
                              <span>Origin</span>
                            )}
                          </div>
                        )}
                        {busOriginRes ? (
                          <div className="flightSearch-oriDest-input-results">
                            {busOriginLoading ? (
                              <div>Loading ...</div>
                            ) : busOriginData.length === 0 ? (
                              <div>No results</div>
                            ) : (
                              busOriginData.map((bus, a) => {
                                return (
                                  <div
                                    className="flightSearch-oriDest-input-result"
                                    key={`${bus.CityId}-${a}`}
                                    onClick={() => {
                                      setBusOriginRes(false);
                                      setBusOriginCityName(bus.cityName);
                                      setBusOrigin("");
                                      setBusOriginDisplay(false);
                                      setBusOriginDetails(bus);
                                      setBusDesError("");
                                    }}
                                  >
                                    <div className="flightSearch-oriDest-input-result-name">
                                      <div className="flightSearch-oriDest-input-result-countryCity">
                                        {bus.cityName}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        ) : null}
                      </div>
                      <div className="flightSearch-oriDest-swap">
                        <FontAwesomeIcon
                          icon={faRightLeft}
                          onClick={swapValues}
                        />
                      </div>
                      <div className="flightSearch-oriDest-input">
                        <p className="text-red-500">{busStartError}</p>
                        {busDestDisplay ? (
                          <input
                            type="text"
                            value={busDestination}
                            placeholder="Destination"
                            onChange={(e) => {
                              setBusDestination(e.target.value);

                              setBusDestRes(true);
                              if (e.target.value === "") {
                                setBusDestRes(false);
                              }
                              actions.handleChangeBusKeyword(
                                e.target.value,
                                "destination"
                              );
                            }}
                            onBlur={() => setBusDestDisplay(false)}
                            autoFocus={busDestDisplay}
                          />
                        ) : (
                          <div
                            className={`flightSearch-oriDest-input-box ${
                              busStartError
                                ? "!border-[1px] !border-solid !border-red-500"
                                : ""
                            }`}
                            onClick={() => setBusDestDisplay(true)}
                          >
                            {busDestCityName ? (
                              <>
                                <div className="flightSearch-oriDest-input-box-cityName">
                                  {busDestCityName}
                                </div>
                              </>
                            ) : (
                              <span>Destination</span>
                            )}
                          </div>
                        )}
                        {busDestRes ? (
                          <div className="flightSearch-oriDest-input-results">
                            {busDestLoading ? (
                              <div>Loading ...</div>
                            ) : busDestData.length === 0 ? (
                              <div>No results</div>
                            ) : (
                              busDestData.map((airport, a) => {
                                return (
                                  <div
                                    className="flightSearch-oriDest-input-result"
                                    key={`${airport.id}-${a}`}
                                    onClick={() => {
                                      setBusDestRes(false);
                                      setBusDestCityName(airport.cityName);
                                      setBusDestDetails(airport);
                                      setBusDestination("");
                                      setBusDestDisplay(false);
                                      setBusStartError("");
                                    }}
                                  >
                                    <div className="flightSearch-oriDest-input-result-name">
                                      <div className="flightSearch-oriDest-input-result-countryCity">
                                        {airport.cityName}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="flightSearch-dates">
                      <div className="flightSearch-dates-out">
                        <p className="text-red-500">{busEndError}</p>
                        <ReactDatePicker
                          minDate={new Date()}
                          selected={busOutboundDate}
                          startDate={busOutboundDate}
                          popperPlacement="auto-start"
                          showPopperArrow={false}
                          onChange={(e) => {
                            setBusOutBoundDate(e);
                            setbusEndError("");
                          }}
                          showMonthYearDropdown
                          dateFormat="EEE, MMM d"
                          fixedHeight
                          withPortal
                          placeholderText="Departure"
                          className={`flightSearch-dates-input ${
                            busEndError
                              ? " !border-[1px] !border-solid !border-red-500"
                              : ""
                          }`}
                          id="flightSearch-departureDate"
                        />
                      </div>
                    </div>
                    <div className="hotelSearch-passenger-adultsChild">
                      <HiddenSelect
                        selectType="number"
                        // selectValue={room.adults}
                        selectValue={NoofBusPassengers}
                        selectOnChange={(val) =>
                          actions.changeBusPassengers(val)
                        }
                        options={[1, 2, 3, 4, 5, 6]}
                      >
                        <div className="flightSearch-passenger-disp-title">
                          Adults
                        </div>
                        <span className="flightSearch-passenger-disp-num">
                          {NoofBusPassengers}
                        </span>
                      </HiddenSelect>
                    </div>
                    <br />
                    <div className="flightSearch-search-directOneStop">
                      <div className="flightSearch-search">
                        <button
                          onClick={() => {
                            actions.getLastDoc();
                            if (busOriginDetails === "") {
                              setBusDesError("Select Origin");
                            } else if (busDestDetails === "") {
                              setBusDesError("");
                              setBusStartError("Select Destination");
                            } else if (busOutboundDate === "") {
                              setBusStartError("");
                              setbusEndError("Select travel date");
                            } else {
                              setbusEndError("");
                              actions.busSearch(
                                busOriginDetails,
                                busDestDetails,
                                busOutboundDate
                              );
                            }
                          }}
                        >
                          Search Buses
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              <p className="mt-2 px-2 md:px-0 text-[12px] md:text-[16px]">
                <span className="font-bold">Note: </span> Our booking team is
                available from 10 am to 10 pm on all days of the week. Please
                submit your trips during these timings.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FlightSearch;
