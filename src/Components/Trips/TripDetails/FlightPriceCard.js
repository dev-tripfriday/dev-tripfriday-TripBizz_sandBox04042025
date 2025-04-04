import {
  faArrowRight,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import MyContext from "../../Context";

const FlightPriceCard = ({ tripsPage, flightBooking, fareData }) => {
  const { domesticFlight, minimumServiceCharge } = useContext(MyContext);
  const charge =
    flightBooking?.totalFare === 0
      ? 0
      : Math.ceil((flightBooking?.totalFare * domesticFlight) / 100) >
        minimumServiceCharge
      ? Math.ceil((flightBooking?.totalFare * domesticFlight) / 100)
      : minimumServiceCharge;
  const gst = flightBooking?.totalFare === 0 ? 0 : Math.ceil(charge * 0.18);
  return (
    <div className="tripsPage-fare-desktop">
      <div
        className="tripsPage-fare-section-desktop"
        id="tripsPage-fare-section"
      >
        <div className="tripsPage-fare-fareItem tripsPage-fare-fareItem-flightFare">
          {tripsPage ? (
            <>
              {[flightBooking].length === 1 &&
              [flightBooking]?.[0]?.flightNew.segments.length > 1 ? (
                <>
                  {[flightBooking].map((book, b) => {
                    return (
                      <div key={`b_${b+1}`}>
                        <div className="tripsPage-fare-fareItem-title">
                          Flight Fare
                        </div>
                        <div className="tripsPage-fare-fareItem-value">
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className="tripsPage-fare-fareItem-value-icon"
                          />
                          {` ${
                            book.flight.Fare.OfferedFare
                              ? Math.round(
                                  book.flight.Fare.OfferedFare
                                ).toLocaleString("en-IN")
                              : Math.round(
                                  book.flight.Fare.PublishedFare
                                ).toLocaleString("en-IN")
                          }`}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  {[flightBooking].map((book, b) => {
                    return (
                      <div key={`b_${b+1}`}>
                        <div className="tripsPage-fare-fareItem-title">
                          <span>{`${book.flightNew.segments?.[0]?.originAirportCode}`}</span>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="tripsPage-fare-fareItem-title-icon"
                          />
                          <span>{`${book.flightNew.segments?.[0]?.destAirportCode}`}</span>
                        </div>
                        <div className="tripsPage-fare-fareItem-value">
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className="tripsPage-fare-fareItem-value-icon"
                          />
                          {` ${
                            book.flight.Fare.OfferedFare
                              ? Math.round(
                                  book.flight.Fare.OfferedFare
                                ).toLocaleString("en-IN")
                              : Math.round(
                                  book.flight.Fare.PublishedFare
                                ).toLocaleString("en-IN")
                          }`}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          ) : null}
        </div>
        {fareData?.totalBaggagePrice ? (
          <div className="tripsPage-fare-fareItem">
            <div className="tripsPage-fare-fareItem-title">Excess baggage</div>
            <div className="tripsPage-fare-fareItem-value">
              {"+ "}
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="tripsPage-fare-fareItem-value-icon"
              />
              {` ${fareData?.totalBaggagePrice?.toLocaleString("en-IN")}`}
            </div>
          </div>
        ) : null}
        {fareData?.totalMealPrice ? (
          <div className="tripsPage-fare-fareItem">
            <div className="tripsPage-fare-fareItem-title">Add-on meal</div>
            <div className="tripsPage-fare-fareItem-value">
              {"+ "}
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="tripsPage-fare-fareItem-value-icon"
              />
              {` ${fareData?.totalMealPrice?.toLocaleString("en-IN")}`}
            </div>
          </div>
        ) : null}
        {fareData?.totalSeatCharges ? (
          <div className="tripsPage-fare-fareItem">
            <div className="tripsPage-fare-fareItem-title">Seat Charges</div>
            <div className="tripsPage-fare-fareItem-value">
              {"+ "}
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="tripsPage-fare-fareItem-value-icon"
              />
              {` ${fareData?.totalSeatCharges?.toLocaleString("en-IN")}`}
            </div>
          </div>
        ) : null}

        <div className="tripsPage-fare-fareItem">
          <div className="tripsPage-fare-fareItem-title">Service Charges</div>
          <div className="tripsPage-fare-fareItem-value">
            {"+ "}
            <FontAwesomeIcon
              icon={faIndianRupeeSign}
              className="tripsPage-fare-fareItem-value-icon"
            />
            {/* {Math.ceil((fareData?.totalFareSum * domesticFlight) / 100) >
            minimumServiceCharge
              ? Math.ceil((fareData?.totalFareSum * domesticFlight) / 100)
              : minimumServiceCharge} */}
            {Math.ceil(flightBooking?.finalFlightServiceCharge)}
            {/* {Math.round(flightBooking?.finalFlightServiceCharge)} */}
          </div>
        </div>
        <div className="tripsPage-fare-fareItem !text-[13px]">
          <div className="tripsPage-fare-fareItem-title !text-[13px]">GST</div>
          <div className="tripsPage-fare-fareItem-value !text-[13px]">
            {"+ "}
            <FontAwesomeIcon
              icon={faIndianRupeeSign}
              className="tripsPage-fare-fareItem-value-icon"
            />
            {Math.ceil(flightBooking?.gstInFinalserviceCharge)}
            {/* {Math.round(flightBooking?.gstInFinalserviceCharge)} */}
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
          {Math.ceil(
            flightBooking?.totalFare +
              flightBooking?.gstInFinalserviceCharge +
              flightBooking?.finalFlightServiceCharge
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightPriceCard;
