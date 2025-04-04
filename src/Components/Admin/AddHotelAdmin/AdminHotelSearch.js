import React, { useContext, useEffect, useState } from "react";
import MyContext from "../../Context";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import ReactDatePicker from "react-datepicker";
import HiddenInput from "../../Utilites/HiddenInput/HiddenInput";
import HotelResList from "../../Hotels/HotelResList/HotelResList";
import HiddenSelect from "../../Utilites/HiddenSelect/HiddenSelect";
import $ from "jquery";

const AdminHotelSearch = (props) => {
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
  const [hotelDestError, setHotelDestError] = useState("");
  const [hotelCheckinError, setHotelCheckinError] = useState("");
  const [hotelCheckOutError, setHotelCheckOutError] = useState("");

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
  const [hotelChildren, setHotelChildren] = useState("0");
  const [hotelChildArr, setHotelChildArr] = useState([]);
  const [mounted, setMounted] = useState(true);
  const [cabStartDate, setCabStartDate] = useState("");
  const [cabEndDate, setCabEndDate] = useState("");
  const [nights, setNights] = useState("0");

  const [multiCities, setMultiCities] = useState([]);

  $("#flightSearch-departureDate").attr("readonly", "readonly");
  $("#flightSearch-returnDate").attr("readonly", "readonly");
  const handleErroMessages = (type, message) => {
    setErrorType(type);
  };
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
  return (
    <div>
      {searchingHotels || hotelErrorMessage || hotelResList.length > 0 ? (
        <HotelResList userAdmin={true} addedFromAdmin={true} />
      ) : (
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
                {cityHotelItem && Object.keys(cityHotelItem).length > 0 ? (
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
              <div className="flightSearch-passenger-disp-title">Nights</div>
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
              <div className="flightSearch-passenger-disp-title">Rooms</div>
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
                            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
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
      )}
    </div>
  );
};

export default AdminHotelSearch;
