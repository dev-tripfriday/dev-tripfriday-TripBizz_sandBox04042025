import React, { useContext, useState } from "react";
import MyContext from "../../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import HiddenSelect from "../../Utilites/HiddenSelect/HiddenSelect";
import ReactDatePicker from "react-datepicker";
import BusResList from "../../Bus/BusResList/BusResList";
const AdminBusSearch = (props) => {
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
    s,
  } = useContext(MyContext);
  const [originAirport, setOriginAirport] = useState("");
  const [originCityName, setOriginCityName] = useState("");
  const [originAirportName, setOriginAirportName] = useState("");
  const [destAirport, setDestAirport] = useState("");
  const [destCityName, setDestCityName] = useState("");
  const [destAirportName, setDestAirportName] = useState("");
  const [busDesError, setBusDesError] = useState("");
  const [busStartError, setBusStartError] = useState("");
  const [busEndError, setbusEndError] = useState("");
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
  return (
    <div>
      {searchingBus || busResList?.length > 0 ? (
        <BusResList userAdmin={true} addedFromAdmin={true} />
      ) : (
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
                      actions.handleChangeBusKeyword(e.target.value, "origin");
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
                <FontAwesomeIcon icon={faRightLeft} onClick={swapValues} />
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
                selectOnChange={(val) => actions.changeBusPassengers(val)}
                options={[1, 2, 3, 4, 5, 6]}
              >
                <div className="flightSearch-passenger-disp-title">Adults</div>
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
      )}
    </div>
  );
};

export default AdminBusSearch;
