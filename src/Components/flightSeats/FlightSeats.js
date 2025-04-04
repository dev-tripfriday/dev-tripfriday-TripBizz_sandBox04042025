import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../MyProvider";
import MyContext from "../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import "../Flights/FlightBooking/FlightBooking.css";
const FlightSeats = () => {
  const { threadId, flightId } = useParams();
  const { actions } = useContext(MyContext);
  const [seatData, setSeatData] = useState([]);
  const [wingPosArr, setWingPosArr] = useState([]);
  const [seatSegIdx, setSeatSegIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState([]);
  const fetchFlightDetails = async () => {
    setLoading(true);
    const data = await db
      .collection("emailQueries")
      .doc(threadId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log("No such document!");
        }
      });
    await fetchFlightSeats(data);
    setLoading(false);
  };
  const fetchFlightSeats = async (data) => {
    const parsed = JSON.parse(data.flights);
    const flightArray = Object.values(parsed);
    const selectedFlight = getDataByKey(flightArray.flat(), flightId);
    const flightFareRuleRequest = {
      traceId: data.traceId,
      resultIndex: selectedFlight.ResultIndex,
    };
    const flightBookRequest = {
      tokenId: data.tokenId,
      traceId: data.traceId,
      resultIndex: selectedFlight.ResultIndex,
    };
    try {
      const [bookDataResponse] = await Promise.all([
        fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightBookData",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(flightBookRequest),
          }
        ).then((res) => res.json()),
      ]);
      // console.log(fareRuleResponse);
      console.log(bookDataResponse);
      setSeatData(
        actions.fillUpSegmentSeats(
          bookDataResponse.ssrResult.Response.SeatDynamic[0].SegmentSeat
        )
      );
      setWingPosArr(
        actions.getWingPosArr(
          bookDataResponse.ssrResult.Response.SeatDynamic[0].SegmentSeat
        )
      );
      // console.log("Flight fare rule response", fareRuleResponse);
      setSegments(
        bookDataResponse?.fareQuoteResult?.Response?.Results?.Segments[0]
      );
      console.log("Flight book data", bookDataResponse);
    } catch (error) {
      console.error("Error in fetching flight data", error);
    }
  };
  function getDataByKey(array, key) {
    const obj = array.find((item) => item[key]);
    return obj ? obj[key] : null;
  }
  useEffect(() => {
    fetchFlightDetails();
  }, []);
  console.log(segments);
  return (
    <div>
      {loading ? (
        <div className="h-[100vh] flex items-center justify-center">
          <ClipLoader />
        </div>
      ) : (
        <div className="flightBook-selectSeats md:!w-[30%] w-![100%] !m-auto !mt-5">
          {seatData.length > 1 ? (
            <div className="flightBook-selectSeats-segNav">
              {seatData.map((seatSeg, s) => {
                console.log(seatSeg);
                return (
                  <div
                    className={
                      seatSegIdx === s
                        ? "flightBook-selectSeats-segNav-item flightBook-selectSeats-segNav-item-selected"
                        : "flightBook-selectSeats-segNav-item"
                    }
                    onClick={() => setSeatSegIdx(s)}
                  >
                    {/* {`${bookingFlight[bookIndex].flightNew.segments[segIndex].segRoutes[s]?.originCode} -> ${bookingFlight[bookIndex].flightNew.segments[segIndex].segRoutes[s]?.destCode}`} */}
                    <p>
                      {segments[s].Origin.Airport.AirportCode}-
                      {segments[s].Destination.Airport.AirportCode}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : null}
          <div className="flightBook-selectSeats-segSeatMap">
            {seatData[seatSegIdx] &&
              // actions
              //   .fillUpRowSeats(seatData[seatSegIdx].RowSeats)
              seatData[seatSegIdx].RowSeats.map((row, r) => {
                return (
                  <>
                    {actions.isExitRow(row) ? (
                      <div className="flightBook-selectSeats-segSeatMap-exitRow">
                        {wingPosArr &&
                        wingPosArr.length > 0 &&
                        row.Seats &&
                        row.Seats[0] &&
                        wingPosArr[seatSegIdx].includes(row.Seats[0].RowNo) ? (
                          <div
                            className={
                              wingPosArr[seatSegIdx].indexOf(
                                row.Seats[0].RowNo
                              ) === 0
                                ? "flightBook-selectSeats-segSeatMap-row-wingLeft flightBook-selectSeats-segSeatMap-row-wingLeft-first"
                                : wingPosArr[seatSegIdx].indexOf(
                                    row.Seats[0].RowNo
                                  ) ===
                                  wingPosArr[seatSegIdx].length - 1
                                ? "flightBook-selectSeats-segSeatMap-row-wingLeft flightBook-selectSeats-segSeatMap-row-wingLeft-last"
                                : "flightBook-selectSeats-segSeatMap-row-wingLeft"
                            }
                            style={{
                              height: `${40}px`,
                            }}
                          ></div>
                        ) : null}
                        <div className="flightBook-selectSeats-segSeatMap-exitRow-section">
                          <span className="flightBook-selectSeats-segSeatMap-exitRow-chevronLeft">
                            <FontAwesomeIcon icon={faChevronLeft} />
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </span>
                          Emergency exit
                          <span className="flightBook-selectSeats-segSeatMap-exitRow-chevronRight">
                            <FontAwesomeIcon icon={faChevronRight} />
                            <FontAwesomeIcon icon={faChevronRight} />
                          </span>
                        </div>
                        {wingPosArr &&
                        wingPosArr.length > 0 &&
                        row.Seats &&
                        row.Seats[0] &&
                        wingPosArr[seatSegIdx].includes(row.Seats[0].RowNo) ? (
                          <div
                            className={
                              wingPosArr[seatSegIdx].indexOf(
                                row.Seats[0].RowNo
                              ) === 0
                                ? "flightBook-selectSeats-segSeatMap-row-wingRight flightBook-selectSeats-segSeatMap-row-wingRight-first"
                                : wingPosArr[seatSegIdx].indexOf(
                                    row.Seats[0].RowNo
                                  ) ===
                                  wingPosArr[seatSegIdx].length - 1
                                ? "flightBook-selectSeats-segSeatMap-row-wingRight flightBook-selectSeats-segSeatMap-row-wingRight-last"
                                : "flightBook-selectSeats-segSeatMap-row-wingRight"
                            }
                            style={{
                              height: `${40}px`,
                            }}
                          ></div>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="flightBook-selectSeats-segSeatMap-row">
                      {wingPosArr &&
                      wingPosArr.length > 0 &&
                      row.Seats &&
                      row.Seats[0] &&
                      wingPosArr[seatSegIdx].includes(row.Seats[0].RowNo) ? (
                        <div
                          className={
                            !actions.isExitRow(row)
                              ? wingPosArr[seatSegIdx].indexOf(
                                  row.Seats[0].RowNo
                                ) === 0
                                ? "flightBook-selectSeats-segSeatMap-row-wingLeft flightBook-selectSeats-segSeatMap-row-wingLeft-first"
                                : wingPosArr[seatSegIdx].indexOf(
                                    row.Seats[0].RowNo
                                  ) ===
                                  wingPosArr[seatSegIdx].length - 1
                                ? "flightBook-selectSeats-segSeatMap-row-wingLeft flightBook-selectSeats-segSeatMap-row-wingLeft-last"
                                : "flightBook-selectSeats-segSeatMap-row-wingLeft"
                              : "flightBook-selectSeats-segSeatMap-row-wingLeft"
                          }
                          style={{
                            height: `${60}px`,
                          }}
                        ></div>
                      ) : null}
                      <span className="flightBook-selectSeats-segSeatMap-row-leftCol">
                        {Array.isArray(row?.Seats) ? (
                          <>
                            {row?.Seats?.map((seat, s) => {
                              if (s >= 0 && s <= 2) {
                                if (seat.noSeat) {
                                  return (
                                    <div className="flightBook-selectSeats-segSeatMap-row-seat-section">
                                      <div className="flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-noSeat"></div>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="flightBook-selectSeats-segSeatMap-row-seat-section">
                                    <div
                                      className={`${
                                        seat.AvailablityType === 3
                                          ? "flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-reserved"
                                          : seat.AvailablityType === 1
                                          ? "flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-open"
                                          : "flightBook-selectSeats-segSeatMap-row-seat"
                                      } 
                                      `}
                                    >
                                      {seat.Code}
                                    </div>
                                    {seat.Price ? (
                                      <div className="flightBook-selectSeats-segSeatMap-row-seat-price">
                                        {`${seat.Price.toLocaleString(
                                          "en-IN"
                                        )} `}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              }
                              return "";
                            })}
                          </>
                        ) : null}
                      </span>
                      <span className="flightBook-selectSeats-segSeatMap-row-rightCol">
                        {Array.isArray(row?.Seats) ? (
                          <>
                            {row.Seats.map((seat, s) => {
                              if (s >= 3 && s <= 5) {
                                if (seat.noSeat) {
                                  return (
                                    <div className="flightBook-selectSeats-segSeatMap-row-seat-section">
                                      <div className="flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-noSeat"></div>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="flightBook-selectSeats-segSeatMap-row-seat-section">
                                    <div
                                      className={`${
                                        seat.AvailablityType === 3
                                          ? "flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-reserved"
                                          : seat.AvailablityType === 1
                                          ? "flightBook-selectSeats-segSeatMap-row-seat flightBook-selectSeats-segSeatMap-row-seat-open"
                                          : "flightBook-selectSeats-segSeatMap-row-seat"
                                      } `}
                                    >
                                      {seat.Code}
                                    </div>
                                    {seat.Price ? (
                                      <div className="flightBook-selectSeats-segSeatMap-row-seat-price">
                                        {`${seat.Price.toLocaleString(
                                          "en-IN"
                                        )} `}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              }
                              return "";
                            })}
                          </>
                        ) : null}
                      </span>
                      {wingPosArr &&
                      wingPosArr.length > 0 &&
                      row.Seats &&
                      row.Seats[0] &&
                      wingPosArr[seatSegIdx].includes(row.Seats[0].RowNo) ? (
                        <div
                          className={
                            !actions.isExitRow(row)
                              ? wingPosArr[seatSegIdx].indexOf(
                                  row.Seats[0].RowNo
                                ) === 0
                                ? "flightBook-selectSeats-segSeatMap-row-wingRight flightBook-selectSeats-segSeatMap-row-wingRight-first"
                                : wingPosArr[seatSegIdx].indexOf(
                                    row.Seats[0].RowNo
                                  ) ===
                                  wingPosArr[seatSegIdx].length - 1
                                ? "flightBook-selectSeats-segSeatMap-row-wingRight flightBook-selectSeats-segSeatMap-row-wingRight-last"
                                : "flightBook-selectSeats-segSeatMap-row-wingRight"
                              : "flightBook-selectSeats-segSeatMap-row-wingRight"
                          }
                          style={{
                            height: `${60}px`,
                          }}
                        ></div>
                      ) : null}
                    </div>
                  </>
                );
              })}
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default FlightSeats;
