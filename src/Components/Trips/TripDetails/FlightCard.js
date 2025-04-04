import {
  faChevronUp,
  faIndianRupeeSign,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const FlightCard = (props) => {
  const { flightArr, airlinelogos, flightData, index } = props;
  console.log(index);
  return (
    <div className="tripDetails-flight-card">
      <div className="tripDetails-flight-segment-block">
        {flightArr?.[0]?.segments.map((segment, sg) => {
          var flightCode = "";
          segment.flightCodes.forEach((code, c) => {
            if (c === segment.flightCodes.length - 1) {
              flightCode += code;
            } else {
              flightCode += `${code}, `;
            }
          });
          var airlinename = segment.airlineName;

          var airline = airlinelogos?.filter((a) => {
            return airlinename.toLowerCase() === a.id;
          });
          return (
            <>
              <div className="tripDetails-flight-airline-block">
                <div className="tripDetails-flight-airline">
                  {airline?.[0] ? (
                    <div className="tripDetails-flight-logo">
                      <span
                        style={{ backgroundImage: `url(${airline?.[0]?.url})` }}
                      ></span>
                    </div>
                  ) : (
                    <div className="tripDetails-flight-logo">
                      <span>
                        <FontAwesomeIcon
                          icon={faPlaneDeparture}
                          className="tripDetails-flight-logo-icon"
                        />
                      </span>
                    </div>
                  )}
                  {`${segment.airlineName}`}
                  <span>&nbsp;&nbsp;({flightCode})</span>
                </div>
                <div className="tripDetails-flight-depDate-block">
                  <div className="tripDetails-flight-depDate">
                    {segment.depTimeDate.toString().slice(4, 10)}
                  </div>
                </div>
              </div>
              <div className="tripDetails-flight-segment-section">
                <div className="tripDetails-flight-arrDep">
                  <div className="tripDetails-flight-dep">
                    <div className="tripDetails-flight-depTime">
                      {segment.depTime}
                    </div>
                    <div className="tripDetails-flight-depCity">
                      {segment.originAirportCode}
                    </div>
                  </div>
                  <div className="tripDetails-flight-duration">
                    <div className="tripDetails-flight-duration-stopPts">
                      <div className="tripDetails-flight-duration-stopType">
                        {segment.stopOverPts.length === 0
                          ? "Direct"
                          : `${
                              segment.stopOverPts.length > 1
                                ? `${segment.stopOverPts.length} stops`
                                : "1 stop"
                            }`}
                        {segment.stopOverPts.length !== 0 ? (
                          <FontAwesomeIcon
                            icon={faChevronUp}
                            className="tripDetails-flight-duration-stopType-icon"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="tripDetails-flight-duration-time">
                      {segment.finalTime === "NaNm"
                        ? segment.duration
                        : segment.finalTime}
                    </div>
                  </div>
                  <div className="tripDetails-flight-arr-section">
                    <div className="tripDetails-flight-dep tripDetails-flight-arr">
                      <div className="tripDetails-flight-depTime">
                        {segment.arrTime}
                      </div>
                      <div className="tripDetails-flight-depCity">
                        {segment.destAirportCode}
                      </div>
                    </div>
                    {segment.arrAfterDays > 0 ? (
                      <div className="tripDetails-flight-depTime-afterDays">
                        <div className="tripDetails-flight-depTime-afterDays-num">{`+ ${segment.arrAfterDays}`}</div>
                        <div>{`${
                          segment.arrAfterDays > 1 ? "Days" : "Day"
                        }`}</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

           
            </>
          );
        })}
      </div>
      <div className="tripDetails-flight-flightCard-price">
                &nbsp;
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="tripDetails-flight-flightCard-price-icon"
                />
                {`${Math.ceil(
                  flightData?.data?.totalFare +
                    flightData?.data?.finalFlightServiceCharge +
                    flightData?.data?.gstInFinalserviceCharge
                )?.toLocaleString("en-IN")}`}
              </div>
    </div>
  );
};

export default FlightCard;
