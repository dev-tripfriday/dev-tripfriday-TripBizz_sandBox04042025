import React, { useContext, useState } from "react";
import MyContext from "../../Context";
import Flight from "../Flight/Flight";
import "./FlightList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faArrowRight,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

function FlightList(props) {
  var [depSelectedTime, setDepSelectedTime] = useState(null);
  var [arrSelectedTime, setArrSelectedTime] = useState(null);
  var [airports, setAirports] = useState({});
  var [stops, setStops] = useState();
  var [intStops1, setIntStops1] = useState();
  var [intStops2, setIntStops2] = useState();
  var [airline, setAirline] = useState();
  var [intarrSelectedTime1, setIntSelectedArrTime1] = useState(null);
  var [intarrSelectedTime2, setIntSelectedArrTime2] = useState(null);
  var [intdepSelectedTime1, setIntSelectedDepTime1] = useState(null);
  var [intdepSelectedTime2, setIntSelectedDepTime2] = useState(null);
  var [count, setCount] = useState(0);
  var [cost, setCost] = useState(true);
  var [duration, setDuration] = useState(false);

  var [showFilters, setShowFilters] = useState(false);

  const {
    actions,
    flightResList,
    internationalFlights,
    flightResJType,
    flightResult,
    byDuration,
    byCost,
    airlineName,
    stopPts,
    intStopPts1,
    intStopPts2,
    bookingFlight,
  } = useContext(MyContext);
  console.log(flightResList);
  // const flights = useSelector((state)=>state.flights);
  var flightArr =
    flightResList.length > 0
      ? flightResList[0].map((flight) => {
          return { ...actions.modifyFlightObject(flight[0]) };
        })
      : null;
  // console.log(flightResList,
  //   internationalFlights,
  //   flightResJType)
  const arrHandleTimeClick = async (time) => {
    const startDate = new Date();
    const endDate = new Date();
    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setOriginStartTime(startDate);
      await actions.setOriginEndTime(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setOriginStartTime(startDate);
      await actions.setOriginEndTime(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setOriginStartTime(startDate);
      await actions.setOriginEndTime(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59);
      await actions.setOriginStartTime(startDate);
      await actions.setOriginEndTime(endDate);
    } else if (time === null) {
      await actions.setOriginStartTime(null);
      await actions.setOriginEndTime(null);
    }
  };

  const depHandleTimeClick = async (time) => {
    const startDate = new Date();
    const endDate = new Date();
    console.log("called", startDate, endDate, time);
    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setDestStartTime(startDate);
      await actions.setDestEndTime(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setDestStartTime(startDate);
      await actions.setDestEndTime(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setDestStartTime(startDate);
      await actions.setDestEndTime(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59);
      await actions.setDestStartTime(startDate);
      await actions.setDestEndTime(endDate);
    } else if (time === null) {
      await actions.setDestStartTime(null);
      await actions.setDestEndTime(null);
    }
  };

  var intArrHandleTime1Click = async (time) => {
    const startDate = new Date();
    const endDate = new Date();
    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntOriginStartTime1(startDate);
      await actions.setIntOriginEndTime1(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntOriginStartTime1(startDate);
      await actions.setIntOriginEndTime1(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntOriginStartTime1(startDate);
      await actions.setIntOriginEndTime1(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59);
      await actions.setIntOriginStartTime1(startDate);
      await actions.setIntOriginEndTime1(endDate);
    } else if (time === null) {
      await actions.setIntOriginStartTime1(null);
      await actions.setIntOriginEndTime1(null);
    }
  };
  var intArrHandleTime2Click = async (time) => {
    const startDate = new Date();
    const endDate = new Date();

    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntOriginStartTime2(startDate);
      await actions.setIntOriginEndTime2(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntOriginStartTime2(startDate);
      await actions.setIntOriginEndTime2(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntOriginStartTime2(startDate);
      await actions.setIntOriginEndTime2(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59);
      await actions.setIntOriginStartTime2(startDate);
      await actions.setIntOriginEndTime2(endDate);
    } else if (time === null) {
      await actions.setIntOriginStartTime2(null);
      await actions.setIntOriginEndTime2(null);
    }
  };

  var intDepHandleTime1Click = async (time) => {
    const startDate = new Date();
    const endDate = new Date();
    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntDestStartTime1(startDate);
      await actions.setIntDestEndTime1(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntDestStartTime1(startDate);
      await actions.setIntDestEndTime1(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntDestStartTime1(startDate);
      await actions.setIntDestEndTime1(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59);
      await actions.setIntDestStartTime1(startDate);
      await actions.setIntDestEndTime1(endDate);
    } else if (time === null) {
      await actions.setIntDestStartTime1(null);
      await actions.setIntDestEndTime1(null);
    }
  };

  var intDepHandleTime2Click = async (time) => {
    const startDate = new Date();
    const endDate = new Date();
    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntDestStartTime2(startDate);
      await actions.setIntDestEndTime2(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntDestStartTime2(startDate);
      await actions.setIntDestEndTime2(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      await actions.setIntDestStartTime2(startDate);
      await actions.setIntDestEndTime2(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59);
      await actions.setIntDestStartTime2(startDate);
      await actions.setIntDestEndTime2(endDate);
    } else if (time === null) {
      await actions.setIntDestStartTime2(null);
      await actions.setIntDestEndTime2(null);
    }
  };

  const removeFilters = () => {
    setCount(0);
    actions.setDestStartTime(null);
    actions.setDestEndTime(null);
    actions.setOriginStartTime(null);
    actions.setOriginEndTime(null);
    actions.setStopPts(null);
    actions.setAirlineName("");
    actions.setByCost(true);
    actions.setByDuration(false);
    actions.setIntDestEndTime1(null);
    actions.setIntDestEndTime2(null);
    actions.setIntDestStartTime1(null);
    actions.setIntDestStartTime2(null);
    actions.setIntOriginEndTime1(null);
    actions.setIntOriginEndTime2(null);
    actions.setIntOriginStartTime1(null);
    actions.setIntOriginStartTime2(null);
    actions.setIntStopPts1(null);
    actions.setIntStopPts2(null);
    setIntSelectedArrTime1(null);
    setIntSelectedArrTime2(null);
    setIntSelectedDepTime1(null);
    setIntSelectedDepTime2(null);
    setArrSelectedTime(null);
    setDepSelectedTime(null);
    setStops(null);
    setAirline(null);
    setIntStops1(null);
    setIntStops2(null);
    setCost(true);
    setDuration(false);
  };

  var applyFilters = async () => {
    setShowFilters(false);
    setCount(0);
    await actions.setAirlineName(airline);
    if (airline) {
      setCount((prev) => prev + 1);
    }
    await actions.setStopPts(stops);
    if (stops === 0 || stops) {
      setCount((prev) => prev + 1);
    }
    await actions.setIntStopPts1(intStops1);
    if (intStops1 === 0 || intStops1) {
      setCount((prev) => prev + 1);
    }
    await actions.setIntStopPts2(intStops2);
    if (intStops2 === 0 || intStopPts2) {
      setCount((prev) => prev + 1);
    }
    intArrHandleTime1Click(intarrSelectedTime1);
    if (intarrSelectedTime1) {
      setCount((prev) => prev + 1);
    }
    intArrHandleTime2Click(intarrSelectedTime2);
    if (intarrSelectedTime2) {
      setCount((prev) => prev + 1);
    }
    arrHandleTimeClick(arrSelectedTime);
    if (arrSelectedTime) {
      setCount((prev) => prev + 1);
    }
    intDepHandleTime1Click(intdepSelectedTime1);
    if (intdepSelectedTime1) {
      setCount((prev) => prev + 1);
    }
    intDepHandleTime2Click(intdepSelectedTime2);
    if (intdepSelectedTime2) {
      setCount((prev) => prev + 1);
    }
    depHandleTimeClick(depSelectedTime);
    if (depSelectedTime) {
      setCount((prev) => prev + 1);
    }
    actions.setByCost(cost);
    actions.setByDuration(duration);
    if (duration) {
      setCount((prev) => prev + 1);
    }
    // await setPriceState(price);
    // await setRatingState(rating);
    // if (rating) {
    //   setCount(1)
    // }
    // if (price) {
    //   setCount(1);
    // }
    // if (price && rating) {
    //   setCount(2)
    // }
  };

  var closeFilters = async () => {
    setShowFilters(false);
  };

  //console.log(arrSelectedTime);

  const addToObj = (item) => {
    if (!airports[item]) {
      const updatedTargetObject = { ...airports, [item]: true };
      setAirports(updatedTargetObject);
    }
  };
  flightArr?.map((flight) => {
    return { ...addToObj(flight.segments[0].airlineName) };
  });
  var isInternationalRound = flightArr
    ? flightArr.every((seg) => {
        return seg.segments.length === 2;
      })
    : null;
  var airlines = Object.entries(airports).map(([key, value]) => {
    return `${key}`;
  });

  return (
    <div className="flightResults-list-block">
      <div className="flightResults-list-filter">
        <div className="flightResults-desktopFilter-block">
          <div
            className="flightResults-removeFilters-desktop"
            onClick={removeFilters}
          >
            Clear Filters
          </div>
          <div className="flightResults-desktopFilter-sort">
            <div className="flightResults-desktopFilter-sort-header">Sort</div>
            <form className="flightResults-desktopFilter-sort-block">
              <div>
                <div
                  className={
                    byCost
                      ? "flightResults-desktopFilter-sort flightResults-desktopFilter-sort-selected"
                      : "flightResults-desktopFilter-sort"
                  }
                  onClick={() => {
                    actions.setByDuration(false);
                    actions.setByCost(true);
                  }}
                >
                  Price <span>(Lowest to Highest)</span>
                </div>
                <div
                  className={
                    byDuration
                      ? "flightResults-desktopFilter-sort flightResults-desktopFilter-sort-selected"
                      : "flightResults-desktopFilter-sort"
                  }
                  onClick={() => {
                    actions.setByDuration(true);
                    actions.setByCost(false);
                  }}
                >
                  Duration <span>(Shortest to Longest)</span>
                </div>
              </div>
            </form>
          </div>
          {props.journeyType === "3" ? null : (
            <div className="flightResults-desktopFilter-stopsFilter">
              <div className="flightResults-desktopFilter-stopsFilter-header">
                Number of Stops
              </div>

              {isInternationalRound ? (
                <>
                  <div className="flightResults-desktopFilter-stopsFilter-block-round">
                    <div>Onward Flight</div>
                    <div className="stops-filter-block">
                      {[
                        {
                          stops: 0,
                          name: "Nonstop only",
                        },
                        {
                          stops: 1,
                          name: "1 stop or fewer",
                        },
                        {
                          stops: 2,
                          name: "2 stops or fewer",
                        },
                      ].map((stop) => (
                        <div
                          className={
                            intStops1 === stop.stops
                              ? "stops-filters-name selected"
                              : "stops-filters-name"
                          }
                          onClick={async () => {
                            setIntStops1((prevAirline) =>
                              prevAirline === stop.stops ? null : stop.stops
                            );
                            await actions.setIntStopPts1(
                              intStopPts1 === stop.stops ? null : stop.stops
                            );
                          }}
                        >
                          {stop.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flightResults-desktopFilter-stopsFilter-block-round">
                    <div>Return Flight</div>
                    <div className="stops-filter-block">
                      {[
                        {
                          stops: 0,
                          name: "Nonstop only",
                        },
                        {
                          stops: 1,
                          name: "1 stop or fewer",
                        },
                        {
                          stops: 2,
                          name: "2 stops or fewer",
                        },
                      ].map((stop) => (
                        <div
                          className={
                            intStops2 === stop.stops
                              ? "stops-filters-name selected"
                              : "stops-filters-name"
                          }
                          onClick={async () => {
                            setIntStops2((prevAirline) =>
                              prevAirline === stop.stops ? null : stop.stops
                            );
                            await actions.setIntStopPts2(
                              intStopPts2 === stop.stops ? null : stop.stops
                            );
                          }}
                        >
                          {stop.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flightResults-desktopFilter-stopsFilter-block">
                  <div className="stops-filter-block">
                    {[
                      {
                        stops: 0,
                        name: "Nonstop only",
                      },
                      {
                        stops: 1,
                        name: "1 stop or fewer",
                      },
                      {
                        stops: 2,
                        name: "2 stops or fewer",
                      },
                    ].map((stop) => (
                      <div
                        className={
                          stops === stop.stops
                            ? "stops-filters-name selected"
                            : "stops-filters-name"
                        }
                        onClick={async () => {
                          setStops((prevAirline) =>
                            prevAirline === stop.stops ? null : stop.stops
                          );
                          await actions.setStopPts(
                            stops === stop.stops ? null : stop.stops
                          );
                        }}
                      >
                        {stop.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flightResults-desktopFilter-timeFilter">
            <div className="flightResults-desktopFilter-timeFilter-header">
              Departure Time
            </div>
            {isInternationalRound ? (
              <>
                <div className="flightResults-desktopFilter-time-block-int">
                  <div className="flightResults-desktopFilter-time-int-header">
                    Onward flight
                  </div>
                  <div className="flightResults-desktopFilter-time-int">
                    <div
                      className={`flightResults-desktopFilter-time ${
                        intarrSelectedTime1 === "morning" ? "selected" : ""
                      }`}
                      onClick={() => {
                        var time =
                          intarrSelectedTime1 === "morning" ? null : "morning";
                        setIntSelectedArrTime1((prevSelectedTime) =>
                          prevSelectedTime === "morning" ? null : "morning"
                        );
                        intArrHandleTime1Click(time);
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-desktopFilter-time-text">
                        Before 6 AM
                      </div>
                    </div>
                    <div
                      className={`flightResults-desktopFilter-time ${
                        intarrSelectedTime1 === "noon" ? "selected" : ""
                      }`}
                      onClick={() => {
                        var time =
                          intarrSelectedTime1 === "noon" ? null : "noon";
                        setIntSelectedArrTime1((prevSelectedTime) =>
                          prevSelectedTime === "noon" ? null : "noon"
                        );
                        intArrHandleTime1Click(time);
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-desktopFilter-time-text">
                        6 AM - 12 PM
                      </div>
                    </div>
                    <div
                      className={`flightResults-desktopFilter-time ${
                        intarrSelectedTime1 === "evening" ? "selected" : ""
                      }`}
                      onClick={() => {
                        var time =
                          intarrSelectedTime1 === "evening" ? null : "evening";
                        setIntSelectedArrTime1((prevSelectedTime) =>
                          prevSelectedTime === "evening" ? null : "evening"
                        );
                        intArrHandleTime1Click(time);
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-desktopFilter-time-text">
                        12 PM - 6 PM
                      </div>
                    </div>
                    <div
                      className={`flightResults-desktopFilter-time ${
                        intarrSelectedTime1 === "night" ? "selected" : ""
                      }`}
                      onClick={() => {
                        var time =
                          intarrSelectedTime1 === "night" ? null : "night";
                        setIntSelectedArrTime1((prevSelectedTime) =>
                          prevSelectedTime === "night" ? null : "night"
                        );
                        intArrHandleTime1Click(time);
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-desktopFilter-time-text">
                        After 6 PM
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flightResults-desktopFilter-time-block-int">
                  <div className="flightResults-desktopFilter-time-int-header">
                    Return flight
                  </div>
                  <div className="flightResults-desktopFilter-time-int">
                    <div
                      className={`flightResults-desktopFilter-time ${
                        intarrSelectedTime2 === "morning" ? "selected" : ""
                      }`}
                      onClick={() => {
                        var time =
                          intarrSelectedTime2 === "morning" ? null : "morning";
                        setIntSelectedArrTime2((prevSelectedTime) =>
                          prevSelectedTime === "morning" ? null : "morning"
                        );
                        intArrHandleTime2Click(time);
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-desktopFilter-time-text">
                        Before 6 AM
                      </div>
                    </div>
                    <div
                      className={`flightResults-desktopFilter-time ${
                        intarrSelectedTime2 === "noon" ? "selected" : ""
                      }`}
                      onClick={() => {
                        var time =
                          intarrSelectedTime2 === "noon" ? null : "noon";
                        setIntSelectedArrTime2((prevSelectedTime) =>
                          prevSelectedTime === "noon" ? null : "noon"
                        );
                        intArrHandleTime2Click(time);
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-desktopFilter-time-text">
                        6 AM - 12 PM
                      </div>
                    </div>
                    <div
                      className={`flightResults-desktopFilter-time ${
                        intarrSelectedTime2 === "evening" ? "selected" : ""
                      }`}
                      onClick={() => {
                        var time =
                          intarrSelectedTime2 === "evening" ? null : "evening";
                        setIntSelectedArrTime2((prevSelectedTime) =>
                          prevSelectedTime === "evening" ? null : "evening"
                        );
                        intArrHandleTime2Click(time);
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-desktopFilter-time-text">
                        12 PM - 6 PM
                      </div>
                    </div>
                    <div
                      className={`flightResults-desktopFilter-time ${
                        intarrSelectedTime2 === "night" ? "selected" : ""
                      }`}
                      onClick={() => {
                        var time =
                          intarrSelectedTime2 === "night" ? null : "night";
                        setIntSelectedArrTime2((prevSelectedTime) =>
                          prevSelectedTime === "night" ? null : "night"
                        );
                        intArrHandleTime2Click(time);
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-desktopFilter-time-text">
                        After 6 PM
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flightResults-desktopFilter-time-block">
                <div
                  className={`flightResults-desktopFilter-time ${
                    arrSelectedTime === "morning" ? "selected" : ""
                  }`}
                  onClick={async () => {
                    var time = arrSelectedTime === "morning" ? null : "morning";
                    setArrSelectedTime((prevSelectedTime) => {
                      return prevSelectedTime === "morning" ? null : "morning";
                    });
                    await arrHandleTimeClick(time);
                  }}
                >
                  <img
                    src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                    alt="Morning"
                  />
                  <div className="flightResults-desktopFilter-time-text">
                    Before 6 AM
                  </div>
                </div>
                <div
                  className={`flightResults-desktopFilter-time ${
                    arrSelectedTime === "noon" ? "selected" : ""
                  }`}
                  onClick={() => {
                    var time = arrSelectedTime === "noon" ? null : "noon";
                    setArrSelectedTime((prevSelectedTime) =>
                      prevSelectedTime === "noon" ? null : "noon"
                    );
                    arrHandleTimeClick(time);
                  }}
                >
                  <img
                    src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                    alt="Morning"
                  />
                  <div className="flightResults-desktopFilter-time-text">
                    6 AM - 12 PM
                  </div>
                </div>
                <div
                  className={`flightResults-desktopFilter-time ${
                    arrSelectedTime === "evening" ? "selected" : ""
                  }`}
                  onClick={() => {
                    var time = arrSelectedTime === "evening" ? null : "evening";
                    setArrSelectedTime((prevSelectedTime) =>
                      prevSelectedTime === "evening" ? null : "evening"
                    );
                    arrHandleTimeClick(time);
                  }}
                >
                  <img
                    src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                    alt="Morning"
                  />
                  <div className="flightResults-desktopFilter-time-text">
                    12 PM - 6 PM
                  </div>
                </div>
                <div
                  className={`flightResults-desktopFilter-time ${
                    arrSelectedTime === "night" ? "selected" : ""
                  }`}
                  onClick={() => {
                    var time = arrSelectedTime === "night" ? null : "night";
                    console.log(time);
                    setArrSelectedTime((prevSelectedTime) =>
                      prevSelectedTime === "night" ? null : "night"
                    );
                    arrHandleTimeClick(time);
                  }}
                >
                  <img
                    src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                    alt="Morning"
                  />
                  <div className="flightResults-desktopFilter-time-text">
                    After 6 PM
                  </div>
                </div>
              </div>
            )}
          </div>
          {props.journeyType === "3" ? null : (
            <div className="flightResults-desktopFilter-timeFilter">
              <div className="flightResults-desktopFilter-timeFilter-header">
                Arrival Time
              </div>
              {isInternationalRound ? (
                <>
                  <div className="flightResults-desktopFilter-time-block-int">
                    <div className="flightResults-desktopFilter-time-int-header">
                      Onward flight
                    </div>
                    <div className="flightResults-desktopFilter-time-int">
                      <div
                        className={`flightResults-desktopFilter-time ${
                          intdepSelectedTime1 === "morning" ? "selected" : ""
                        }`}
                        onClick={() => {
                          var time =
                            intdepSelectedTime1 === "morning"
                              ? null
                              : "morning";
                          setIntSelectedDepTime1((prevSelectedTime) =>
                            prevSelectedTime === "morning" ? null : "morning"
                          );
                          intDepHandleTime1Click(time);
                        }}
                      >
                        <img
                          src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                          alt="Morning"
                        />
                        <div className="flightResults-desktopFilter-time-text">
                          Before 6 AM
                        </div>
                      </div>
                      <div
                        className={`flightResults-desktopFilter-time ${
                          intdepSelectedTime1 === "noon" ? "selected" : ""
                        }`}
                        onClick={() => {
                          var time =
                            intdepSelectedTime1 === "noon" ? null : "noon";
                          setIntSelectedDepTime1((prevSelectedTime) =>
                            prevSelectedTime === "noon" ? null : "noon"
                          );
                          intDepHandleTime1Click(time);
                        }}
                      >
                        <img
                          src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                          alt="Morning"
                        />
                        <div className="flightResults-desktopFilter-time-text">
                          6 AM - 12 PM
                        </div>
                      </div>
                      <div
                        className={`flightResults-desktopFilter-time ${
                          intdepSelectedTime1 === "evening" ? "selected" : ""
                        }`}
                        onClick={() => {
                          var time =
                            intdepSelectedTime1 === "evening"
                              ? null
                              : "evening";
                          setIntSelectedDepTime1((prevSelectedTime) =>
                            prevSelectedTime === "evening" ? null : "evening"
                          );
                          intDepHandleTime1Click(time);
                        }}
                      >
                        <img
                          src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                          alt="Morning"
                        />
                        <div className="flightResults-desktopFilter-time-text">
                          12 PM - 6 PM
                        </div>
                      </div>
                      <div
                        className={`flightResults-desktopFilter-time ${
                          intdepSelectedTime1 === "night" ? "selected" : ""
                        }`}
                        onClick={() => {
                          var time =
                            intdepSelectedTime1 === "night" ? null : "night";
                          setIntSelectedDepTime1((prevSelectedTime) =>
                            prevSelectedTime === "night" ? null : "night"
                          );
                          intDepHandleTime1Click(time);
                        }}
                      >
                        <img
                          src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                          alt="Morning"
                        />
                        <div className="flightResults-desktopFilter-time-text">
                          After 6 PM
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flightResults-desktopFilter-time-block-int">
                    <div className="flightResults-desktopFilter-time-int-header">
                      Return flight
                    </div>
                    <div className="flightResults-desktopFilter-time-int">
                      <div
                        className={`flightResults-desktopFilter-time ${
                          intdepSelectedTime2 === "morning" ? "selected" : ""
                        }`}
                        onClick={() => {
                          var time =
                            intdepSelectedTime2 === "morning"
                              ? null
                              : "morning";
                          setIntSelectedDepTime2((prevSelectedTime) =>
                            prevSelectedTime === "morning" ? null : "morning"
                          );
                          intDepHandleTime2Click(time);
                        }}
                      >
                        <img
                          src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                          alt="Morning"
                        />
                        <div className="flightResults-desktopFilter-time-text">
                          Before 6 AM
                        </div>
                      </div>
                      <div
                        className={`flightResults-desktopFilter-time ${
                          intdepSelectedTime2 === "noon" ? "selected" : ""
                        }`}
                        onClick={() => {
                          var time =
                            intdepSelectedTime2 === "noon" ? null : "noon";
                          setIntSelectedDepTime2((prevSelectedTime) =>
                            prevSelectedTime === "noon" ? null : "noon"
                          );
                          intDepHandleTime2Click(time);
                        }}
                      >
                        <img
                          src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                          alt="Morning"
                        />
                        <div className="flightResults-desktopFilter-time-text">
                          6 AM - 12 PM
                        </div>
                      </div>
                      <div
                        className={`flightResults-desktopFilter-time ${
                          intdepSelectedTime2 === "evening" ? "selected" : ""
                        }`}
                        onClick={() => {
                          var time =
                            intdepSelectedTime2 === "evening"
                              ? null
                              : "evening";
                          setIntSelectedDepTime2((prevSelectedTime) =>
                            prevSelectedTime === "evening" ? null : "evening"
                          );
                          intDepHandleTime2Click(time);
                        }}
                      >
                        <img
                          src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                          alt="Morning"
                        />
                        <div className="flightResults-desktopFilter-time-text">
                          12 PM - 6 PM
                        </div>
                      </div>
                      <div
                        className={`flightResults-desktopFilter-time ${
                          intdepSelectedTime2 === "night" ? "selected" : ""
                        }`}
                        onClick={() => {
                          var time =
                            intdepSelectedTime2 === "night" ? null : "night";
                          setIntSelectedDepTime2((prevSelectedTime) =>
                            prevSelectedTime === "night" ? null : "night"
                          );
                          intDepHandleTime2Click(time);
                        }}
                      >
                        <img
                          src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                          alt="Morning"
                        />
                        <div className="flightResults-desktopFilter-time-text">
                          After 6 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flightResults-desktopFilter-time-block">
                  <div
                    className={`flightResults-desktopFilter-time ${
                      depSelectedTime === "morning" ? "selected" : ""
                    }`}
                    onClick={() => {
                      var time =
                        depSelectedTime === "morning" ? null : "morning";
                      setDepSelectedTime((prevSelectedTime) =>
                        prevSelectedTime === "morning" ? null : "morning"
                      );
                      depHandleTimeClick(time);
                    }}
                  >
                    <img
                      src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                      alt="Morning"
                    />
                    <div className="flightResults-desktopFilter-time-text">
                      Before 6 AM
                    </div>
                  </div>
                  <div
                    className={`flightResults-desktopFilter-time ${
                      depSelectedTime === "noon" ? "selected" : ""
                    }`}
                    onClick={() => {
                      var time = depSelectedTime === "noon" ? null : "noon";
                      setDepSelectedTime((prevSelectedTime) =>
                        prevSelectedTime === "noon" ? null : "noon"
                      );
                      depHandleTimeClick(time);
                    }}
                  >
                    <img
                      src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                      alt="Morning"
                    />
                    <div className="flightResults-desktopFilter-time-text">
                      6 AM - 12 PM
                    </div>
                  </div>
                  <div
                    className={`flightResults-desktopFilter-time ${
                      depSelectedTime === "evening" ? "selected" : ""
                    }`}
                    onClick={() => {
                      var time =
                        depSelectedTime === "evening" ? null : "evening";
                      setDepSelectedTime((prevSelectedTime) =>
                        prevSelectedTime === "evening" ? null : "evening"
                      );
                      depHandleTimeClick(time);
                    }}
                  >
                    <img
                      src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                      alt="Morning"
                    />
                    <div className="flightResults-desktopFilter-time-text">
                      12 PM - 6 PM
                    </div>
                  </div>
                  <div
                    className={`flightResults-desktopFilter-time ${
                      depSelectedTime === "night" ? "selected" : ""
                    }`}
                    onClick={() => {
                      var time = depSelectedTime === "night" ? null : "night";
                      setDepSelectedTime((prevSelectedTime) =>
                        prevSelectedTime === "night" ? null : "night"
                      );
                      depHandleTimeClick(time);
                    }}
                  >
                    <img
                      src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                      alt="Morning"
                    />
                    <div className="flightResults-desktopFilter-time-text">
                      After 6 PM
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flightResults-desktopFilter-airlineFilter">
            <div className="flightResults-desktopFilter-airline-header">
              Airline Name
            </div>
            {/* <form className="flightResults-desktopFilter-airline-block">
              {airlines?.map((airline) => (
                <label>
                  <input
                    type="radio"
                    value={airline}
                    name="options"
                    className="flightResults-desktopFilter-stopsFilter-input"
                    onChange={async (e) => {
                      await actions.setAirlineName(e.target.value);
                    }}
                  />
                  {airline}
                </label>
              ))}
            </form> */}
            <div
              className="flightResults-desktopFilter-airline-block"
              // onChange={(e) => {
              //   actions.setAirlineName(e.target.value)
              //   setAirline(false)
              // }}
            >
              <div className="airline-filters-block">
                {airlines?.map((airlinename) => (
                  <div
                    className={
                      airline === airlinename
                        ? "airline-filters-name selected"
                        : "airline-filters-name"
                    }
                    onClick={async () => {
                      setAirline((prevAirline) =>
                        prevAirline === airlinename ? null : airlinename
                      );
                      await actions.setAirlineName(
                        airline === airlinename ? null : airlinename
                      );
                    }}
                  >
                    {airlinename}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hotelRes-mobile-filters">
          <div
            className="hotelRes-mobile-filters-header"
            onClick={() => setShowFilters(true)}
          >
            <span>
              <FontAwesomeIcon icon={faFilter} /> Filters
              {count > 0 ? <span>{count}</span> : null}
            </span>
            {!showFilters ? (
              <FontAwesomeIcon icon={faAngleDown} size="xl" />
            ) : null}
          </div>
          <div
            className={
              showFilters
                ? "hotelRes-mobile-filters-block show"
                : "hotelRes-mobile-filters-block"
            }
          >
            <div className="filters-block">
              <div className="flightResults-mobileFilter-airline">
                <div className="flightResults-mobileFilter-airline-header">
                  Airline
                </div>
                <div
                  className="flightResults-mobileFilter-airline-block"
                  // onChange={(e) => {
                  //   actions.setAirlineName(e.target.value)
                  //   setAirline(false)
                  // }}
                >
                  <div className="airline-filters-block">
                    {airlines?.map((airlinename) => (
                      <div
                        className={
                          airline === airlinename
                            ? "airline-filters-name selected"
                            : "airline-filters-name"
                        }
                        onClick={() => {
                          setAirline((prevAirline) =>
                            prevAirline === airlinename ? null : airlinename
                          );
                        }}
                      >
                        {airlinename}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <hr className="border"></hr>
              <div className="flightResults-mobileFilter-stops">
                <div className="flightResults-mobileFilter-stops-header">
                  Stops
                </div>
                {isInternationalRound ? (
                  <>
                    <div className="flightResults-mobileFilter-stopsFilter-block-round">
                      <div>Onward Flight</div>
                      <div className="stops-filter-block">
                        {[
                          {
                            stops: 0,
                            name: "Nonstop only",
                          },
                          {
                            stops: 1,
                            name: "1 stop or fewer",
                          },
                          {
                            stops: 2,
                            name: "2 stops or fewer",
                          },
                        ].map((stop) => (
                          <div
                            className={
                              intStops1 === stop.stops
                                ? "stops-filters-name selected"
                                : "stops-filters-name"
                            }
                            onClick={() => {
                              setIntStops1((prevAirline) =>
                                prevAirline === stop.stops ? null : stop.stops
                              );
                            }}
                          >
                            {stop.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flightResults-mobileFilter-stopsFilter-block-round">
                      <div>Return Flight</div>
                      <div className="stops-filter-block">
                        {[
                          {
                            stops: 0,
                            name: "Nonstop only",
                          },
                          {
                            stops: 1,
                            name: "1 stop or fewer",
                          },
                          {
                            stops: 2,
                            name: "2 stops or fewer",
                          },
                        ].map((stop) => (
                          <div
                            className={
                              intStops2 === stop.stops
                                ? "stops-filters-name selected"
                                : "stops-filters-name"
                            }
                            onClick={() => {
                              setIntStops2((prevAirline) =>
                                prevAirline === stop.stops ? null : stop.stops
                              );
                            }}
                          >
                            {stop.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flightResults-mobileFilter-stopsFilter-block">
                    <div className="stops-filter-block">
                      {[
                        {
                          stops: 0,
                          name: "Nonstop only",
                        },
                        {
                          stops: 1,
                          name: "1 stop or fewer",
                        },
                        {
                          stops: 2,
                          name: "2 stops or fewer",
                        },
                      ].map((stop) => (
                        <div
                          className={
                            stops === stop.stops
                              ? "stops-filters-name selected"
                              : "stops-filters-name"
                          }
                          onClick={() => {
                            setStops((prevAirline) =>
                              prevAirline === stop.stops ? null : stop.stops
                            );
                          }}
                        >
                          {stop.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <hr className="border"></hr>
              <div className="flightResults-mobileFilter-arrTime">
                <div className="flightResults-mobileFilter-arrTime-header">
                  Departure Time
                </div>
                {isInternationalRound ? (
                  <>
                    <div className="flightResults-mobileFilter-time-block-int">
                      <div className="flightResults-mobileFilter-time-int-header">
                        Onward flight
                      </div>
                      <div className="flightResults-mobileFilter-time-int">
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intarrSelectedTime1 === "morning" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedArrTime1((prevSelectedTime) =>
                              prevSelectedTime === "morning" ? null : "morning"
                            );
                            //intArrHandleTime1Click('morning')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            Before 6 AM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intarrSelectedTime1 === "noon" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedArrTime1((prevSelectedTime) =>
                              prevSelectedTime === "noon" ? null : "noon"
                            );
                            //intArrHandleTime1Click('noon')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            6 AM - 12 PM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intarrSelectedTime1 === "evening" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedArrTime1((prevSelectedTime) =>
                              prevSelectedTime === "evening" ? null : "evening"
                            );
                            //intArrHandleTime1Click('evening')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            12 PM - 6 PM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intarrSelectedTime1 === "night" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedArrTime1((prevSelectedTime) =>
                              prevSelectedTime === "night" ? null : "night"
                            );
                            //intArrHandleTime1Click('night')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            After 6 PM
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flightResults-mobileFilter-time-block-int">
                      <div className="flightResults-mobileFilter-time-int-header">
                        Return flight
                      </div>
                      <div className="flightResults-mobileFilter-time-int">
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intarrSelectedTime2 === "morning" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedArrTime2((prevSelectedTime) =>
                              prevSelectedTime === "morning" ? null : "morning"
                            );
                            //intArrHandleTime2Click('morning')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            Before 6 AM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intarrSelectedTime2 === "noon" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedArrTime2((prevSelectedTime) =>
                              prevSelectedTime === "noon" ? null : "noon"
                            );
                            //intArrHandleTime2Click('noon')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            6 AM - 12 PM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intarrSelectedTime2 === "evening" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedArrTime2((prevSelectedTime) =>
                              prevSelectedTime === "evening" ? null : "evening"
                            );
                            //intArrHandleTime2Click('evening')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            12 PM - 6 PM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intarrSelectedTime2 === "night" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedArrTime2((prevSelectedTime) =>
                              prevSelectedTime === "night" ? null : "night"
                            );
                            //intArrHandleTime2Click('night')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            After 6 PM
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flightResults-mobileFilter-time-block">
                    <div
                      className={`flightResults-mobileFilter-time ${
                        arrSelectedTime === "morning" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setArrSelectedTime((prevSelectedTime) =>
                          prevSelectedTime === "morning" ? null : "morning"
                        );
                        //arrHandleTimeClick('morning')
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-mobileFilter-time-text">
                        Before 6 AM
                      </div>
                    </div>
                    <div
                      className={`flightResults-mobileFilter-time ${
                        arrSelectedTime === "noon" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setArrSelectedTime((prevSelectedTime) =>
                          prevSelectedTime === "noon" ? null : "noon"
                        );
                        //arrHandleTimeClick('noon')
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-mobileFilter-time-text">
                        6 AM - 12 PM
                      </div>
                    </div>
                    <div
                      className={`flightResults-mobileFilter-time ${
                        arrSelectedTime === "evening" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setArrSelectedTime((prevSelectedTime) =>
                          prevSelectedTime === "evening" ? null : "evening"
                        );
                        //arrHandleTimeClick('evening')
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-mobileFilter-time-text">
                        12 PM - 6 PM
                      </div>
                    </div>
                    <div
                      className={`flightResults-mobileFilter-time ${
                        arrSelectedTime === "night" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setArrSelectedTime((prevSelectedTime) =>
                          prevSelectedTime === "night" ? null : "night"
                        );
                        //arrHandleTimeClick('night')
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-mobileFilter-time-text">
                        After 6 PM
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <hr className="border"></hr>
              <div className="flightResults-mobileFilter-arrTime">
                <div className="flightResults-mobileFilter-arrTime-header">
                  Arrival Time
                </div>
                {isInternationalRound ? (
                  <>
                    <div className="flightResults-mobileFilter-time-block-int">
                      <div className="flightResults-mobileFilter-time-int-header">
                        Onward flight
                      </div>
                      <div className="flightResults-mobileFilter-time-int">
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intdepSelectedTime1 === "morning" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedDepTime1((prevSelectedTime) =>
                              prevSelectedTime === "morning" ? null : "morning"
                            );
                            //intArrHandleTime1Click('morning')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            Before 6 AM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intdepSelectedTime1 === "noon" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedDepTime1((prevSelectedTime) =>
                              prevSelectedTime === "noon" ? null : "noon"
                            );
                            //intArrHandleTime1Click('noon')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            6 AM - 12 PM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intdepSelectedTime1 === "evening" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedDepTime1((prevSelectedTime) =>
                              prevSelectedTime === "evening" ? null : "evening"
                            );
                            //intArrHandleTime1Click('evening')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            12 PM - 6 PM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intdepSelectedTime1 === "night" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedDepTime1((prevSelectedTime) =>
                              prevSelectedTime === "night" ? null : "night"
                            );
                            //intArrHandleTime1Click('night')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            After 6 PM
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flightResults-mobileFilter-time-block-int">
                      <div className="flightResults-mobileFilter-time-int-header">
                        Return flight
                      </div>
                      <div className="flightResults-mobileFilter-time-int">
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intdepSelectedTime2 === "morning" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedDepTime2((prevSelectedTime) =>
                              prevSelectedTime === "morning" ? null : "morning"
                            );
                            //intArrHandleTime2Click('morning')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            Before 6 AM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intdepSelectedTime2 === "noon" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedDepTime2((prevSelectedTime) =>
                              prevSelectedTime === "noon" ? null : "noon"
                            );
                            //intArrHandleTime2Click('noon')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            6 AM - 12 PM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intdepSelectedTime2 === "evening" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedDepTime2((prevSelectedTime) =>
                              prevSelectedTime === "evening" ? null : "evening"
                            );
                            //intArrHandleTime2Click('evening')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            12 PM - 6 PM
                          </div>
                        </div>
                        <div
                          className={`flightResults-mobileFilter-time ${
                            intdepSelectedTime2 === "night" ? "selected" : ""
                          }`}
                          onClick={() => {
                            setIntSelectedDepTime2((prevSelectedTime) =>
                              prevSelectedTime === "night" ? null : "night"
                            );
                            //intArrHandleTime2Click('night')
                          }}
                        >
                          <img
                            src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                            alt="Morning"
                          />
                          <div className="flightResults-mobileFilter-time-text">
                            After 6 PM
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flightResults-mobileFilter-time-block">
                    <div
                      className={`flightResults-mobileFilter-time ${
                        depSelectedTime === "morning" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setDepSelectedTime((prevSelectedTime) =>
                          prevSelectedTime === "morning" ? null : "morning"
                        );
                        //arrHandleTimeClick('morning')
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-mobileFilter-time-text">
                        Before 6 AM
                      </div>
                    </div>
                    <div
                      className={`flightResults-mobileFilter-time ${
                        depSelectedTime === "noon" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setDepSelectedTime((prevSelectedTime) =>
                          prevSelectedTime === "noon" ? null : "noon"
                        );
                        //arrHandleTimeClick('noon')
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-mobileFilter-time-text">
                        6 AM - 12 PM
                      </div>
                    </div>
                    <div
                      className={`flightResults-mobileFilter-time ${
                        depSelectedTime === "evening" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setDepSelectedTime((prevSelectedTime) =>
                          prevSelectedTime === "evening" ? null : "evening"
                        );
                        //arrHandleTimeClick('evening')
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-mobileFilter-time-text">
                        12 PM - 6 PM
                      </div>
                    </div>
                    <div
                      className={`flightResults-mobileFilter-time ${
                        depSelectedTime === "night" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setDepSelectedTime((prevSelectedTime) =>
                          prevSelectedTime === "night" ? null : "night"
                        );
                        //arrHandleTimeClick('night')
                      }}
                    >
                      <img
                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png"
                        alt="Morning"
                      />
                      <div className="flightResults-mobileFilter-time-text">
                        After 6 PM
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <hr className="border"></hr>
              <div className="flightResults-mobileFilter-sort">
                <div className="flightResults-mobileFilter-sort-header">
                  Sort
                </div>
                <div className="flightResults-mobileFilter-sort-block">
                  <div
                    className={
                      cost
                        ? "flightResults-mobileFilter-stopsFilter flightResults-mobileFilter-stopsFilter-selected"
                        : "flightResults-mobileFilter-stopsFilter"
                    }
                    onClick={() => {
                      setCost(true);
                      setDuration(false);
                      // actions.setByDuration(false);
                      // actions.setByCost(true);
                    }}
                  >
                    <span>Price</span> (Lowest to Highest)
                  </div>
                  <div
                    className={
                      duration
                        ? "flightResults-mobileFilter-stopsFilter flightResults-mobileFilter-stopsFilter-selected"
                        : "flightResults-mobileFilter-stopsFilter"
                    }
                    onClick={() => {
                      setCost(false);
                      setDuration(true);
                      // actions.setByDuration(true);
                      // actions.setByCost(false);
                    }}
                  >
                    <span>Duration</span> (Shortest to Longest)
                  </div>
                </div>
              </div>
              <hr className="border"></hr>
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
      </div>
      <div style={{ padding: "15px", "margin-bottom": "10vh" }}>
        {count > 0 ? (
          <div
            className="flightResults-removeFilters-mobile"
            onClick={removeFilters}
          >
            Clear Filters
          </div>
        ) : null}

        {flightResList.length > 1 && !internationalFlights ? (
          <div className="flightResults-nav">
            <div
              className={
                flightResJType === 0
                  ? "flightResults-nav-item flightResults-nav-item-selected"
                  : "flightResults-nav-item"
              }
              onClick={() => {
                actions.setFlightResJType(0);
                removeFilters();
              }}
            >
              {`${flightResult?.Origin}`}
              <FontAwesomeIcon icon={faArrowRight} className="mx-2" />
              {`${flightResult?.Destination}`}
              {/* {`Depart (${flightResList[0].length})`} */}
            </div>
            <div
              className={
                flightResJType === 1
                  ? "flightResults-nav-item flightResults-nav-item-selected"
                  : "flightResults-nav-item"
              }
              onClick={() => {
                actions.setFlightResJType(1);
                removeFilters();
              }}
            >
              {`${flightResult?.Destination}`}
              <FontAwesomeIcon icon={faArrowRight} className="mx-2" />
              {`${flightResult?.Origin}`}
              {/* {`Return(${flightResList[1].length})`} */}
            </div>
          </div>
        ) : null}

        {flightResList.length > 0 ? (
          flightResList[props.index] && (
            <>
              {actions.filterFlights(flightResList[props.index]).length > 0 ? (
                actions
                  .filterFlights(flightResList[props.index])
                  // .sort((a, b) => a[0].Fare.PublishedFare - b[0].Fare.PublishedFare)
                  .map((flightGrp, f) => {
                    return (
                      <Flight
                        key={`flight-${f}-${flightGrp[0].ResultIndex}`}
                        flightGrp={flightGrp}
                        index={f}
                        removeFilters={removeFilters}
                      />
                    );
                  })
              ) : (
                <div className="flightRes-noResults">No results found</div>
              )}
            </>
          )
        ) : (
          <div className="flightResults-error">
            Flight search hasn't returned any results
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightList;
