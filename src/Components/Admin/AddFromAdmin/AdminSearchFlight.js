import React, { useContext, useEffect, useState } from 'react'
import MyContext from '../../Context';
import ReactDatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightLeft,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";
import "../../Flights/FlightSearch/FlightSearch.css"
// import "./AdminSearchFlight.css"
import $ from "jquery";
import AdminFlightListPage from './AdminFlightListPage';
import { useParams } from 'react-router-dom';

const AdminSearchFlight=()=> {
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
  const [originDisplay, setOriginDisplay] = useState(false);
  const [destDisplay, setDestDisplay] = useState(false);
  const [oneStopFlight, setOneStopFlight] = useState(false);

  const [flightOriginError, setFlightOriginError] = useState("");
  const [flightDestError, setFlightDestError] = useState("");
  const [flightDepError, setFlightDepError] = useState("");
  const [flightReturnError, setFlightReturnErrror] = useState("");
  const [passengerError, setPassengerError] = useState("");
  const [multiCities, setMultiCities] = useState([]);

  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [infants, setInfants] = useState("0");
  const [adultsDisp, setAdultsDisp] = useState(true);
  $("#flightSearch-departureDate").attr("readonly", "readonly");
  $("#flightSearch-returnDate").attr("readonly", "readonly");
  const {
    actions,
    airportOriginData,
    airportOriginLoading,
    airportDestData,
    airportDestLoading,
    searchingFlights,
    flightErrorMessage,
    flightResList
  } = useContext(MyContext);

  const cabinclass = {
    "Any cabin class": "1",
    Economy: "2",
    "Premium Economy": "3",
    Business: "4",
    First: "6",
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
  const{userId}=useParams()
// useEffect(()=>
// {
//   const fetchUsers= async()=>
//   {
// await actions.getUserById(userId)
//   }
//   fetchUsers()
// },[])
  const handleDelete = (indexToDelete) => {
    setMultiCities((prevCities) =>
      prevCities.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    searchingFlights || flightErrorMessage || flightResList.length > 0 ? (
      <AdminFlightListPage
        originCityName={originCityName}
        destCityName={destCityName}
        flightCabinClass={flightCabinClass}
        outboundDate={outboundDate}
        inboundDate={inboundDate}
        multiCities={multiCities}
        journeyType={journeyType}
      />
    ) :
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.8rem',
      boxShadow: '0.04rem 0.06rem 0.4rem rgba(0, 0, 0, 0.171)',
      padding: '30px 15px 20px 15px',
      margin:"10pt"
    }}>
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
        </div>

        <p className="text-red-500 text-[14px] pl-4">
          {passengerError}
        </p>
      </div>
  )
}

export default AdminSearchFlight