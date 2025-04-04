import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import { collection, getDocs } from "firebase/firestore";
import LoadingProg from '../../Loading/LoadingProg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faIndianRupeeSign,
  faPencil,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import MyContext from "../../Context";
import "../../Flights/FlightSearch/FlightSearch.css";
import AdminFlightList from "./AdminFlightList";
import AdminFlightBooking from "./AdminFlightBooking";
function AdminFlightListPage(props) {
const [mounted, setMounted] = useState(true);
const [airlinelogos, setAirlinelogos] = useState([]);

const {
    actions,
    flightResList,
    searchingFlights,
    flightBookPage,
    flightResJType,
    flightAdults,
    flightChild,
    flightInfant,
    bookingFlight,
  } = useContext(MyContext);

if (bookingFlight && bookingFlight.length > 0) {
    var { totalFareSum } = actions.getTotalFares(bookingFlight);
  }

  var airlinename1 = bookingFlight
    ? bookingFlight[0]?.flightNew?.segments[0]?.airlineName
    : "";
  var airline1 = airlinelogos?.filter((a) => {
    return airlinename1?.toLowerCase() === a.id;
  });

  var airlinename2 = bookingFlight
    ? bookingFlight[1]?.flightNew?.segments[0]?.airlineName
    : "";
  var airline2 = airlinelogos?.filter((a) => {
    return airlinename2?.toLowerCase() === a.id;
  });
  const getData = async () => {
    const db = firebase.firestore();
    const AccountsCollectionRef = collection(db, "airlinelogos");
    const docSnap = await getDocs(AccountsCollectionRef);
    var updatedAirlinelogos = [];
    docSnap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      updatedAirlinelogos.push({ id: doc.id, url: doc.data().url });
      setAirlinelogos({ ...setAirlinelogos, [doc.id]: doc.data().url });
    });
    setAirlinelogos(updatedAirlinelogos);
  };
  useEffect(() => {
    if (mounted) {
      getData();
    }
    return () => [setMounted(false)];
  }, []);

  var {
    originCityName,
    destCityName,
    flightCabinClass,
    outboundDate,
    inboundDate,
    journeyType,
    multiCities,
  } = props;
  const removeFilters = () => {
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
  };

  return (
    <div className="flightRes-block">
    {!flightBookPage ? (
      <>
        <div className="flightRes-header">
          <div className="flightRes-header-oriDest">
            <div className="flightRes-header-oriDest-name">
              {journeyType === "3"
                ? `${multiCities[0].Origin} to ${
                    multiCities[multiCities.length - 1].Destination
                  }`
                : `${originCityName} to ${destCityName}`}
              <div className="flightRes-header-oriDest-edit">
                <FontAwesomeIcon
                  icon={faPencil}
                  className="flightRes-header-oriDest-edit-icon"
                  onClick={() => {
                    actions.setFlightErrorMessage();
                    actions.editFlightSearch();
                    actions.setRes();
                    removeFilters();
                  }}
                />
              </div>
            </div>
            <div className="flightRes-header-oriDest-details">
              {journeyType === "3"
                ?  ( `${new Date(multiCities?.[0]?.PreferredArrivalTime)
                  .toString()
                  .slice(4, 10)} - ${new Date(multiCities?.[multiCities.length-1]?.PreferredArrivalTime)
                  .toString()
                  .slice(4, 10)} | ${flightAdults} ${
            flightAdults > 1 ? "Adults" : "Adults"
          } ${
            flightChild > 0
              ? `, ${flightChild} ${
                  flightChild > 1 ? "children" : "child"
                }`
              : ""
          }   ${
            flightInfant > 0
              ? `, ${flightInfant} ${
                  flightInfant > 1 ? "infants" : "infant"
                }`
              : ""
          } | ${flightCabinClass}`
            )
                : `${
                    inboundDate
                      ? `${new Date(outboundDate)
                          .toString()
                          .slice(4, 10)} - ${new Date(inboundDate)
                          .toString()
                          .slice(4, 10)}`
                      : `${new Date(outboundDate).toString().slice(4, 10)}`
                  } | ${flightAdults} ${
                    flightAdults > 1 ? "Adults" : "Adults"
                  } ${
                    flightChild > 0
                      ? `, ${flightChild} ${
                          flightChild > 1 ? "children" : "child"
                        }`
                      : ""
                  }   ${
                    flightInfant > 0
                      ? `, ${flightInfant} ${
                          flightInfant > 1 ? "infants" : "infant"
                        }`
                      : ""
                  } | ${flightCabinClass}`}
            </div>
          </div>
        </div>
      </>
    ) : null}
    {searchingFlights ? ( //searchingFlights
      <LoadingProg
        condition={searchingFlights}
        loadingText={"Searching flights"}
        progEnd={searchingFlights}
        progTime={35}
      />
    ):
    flightBookPage ? (
   <AdminFlightBooking/>
    ) : (
      <div className="flightResults-block">
        {flightResJType === 0 ? (
          <AdminFlightList index={0} journeyType={journeyType} />
        ) : (
          <AdminFlightList index={1} journeyType={journeyType} />
        )}
        {flightResList.length > 1 &&
        bookingFlight &&
        bookingFlight.length > 0 ? (
          <div className="flightResults-bookSelect">
            <div className="flightResults-bookSelect-item">
              <div className="flightResults-bookSelect-item-dep">
                <div className="flightResults-bookSelect-item-dep-time">
                  {bookingFlight[0].flightNew.segments[0].depTime}
                </div>
                <div className="flightResults-bookSelect-item-dep-airport">
                  {bookingFlight[0].flightNew.segments[0].originAirportCode}
                </div>
              </div>
              <div className="flightResults-bookSelect-item-dep-arrow">
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
              <div className="flightResults-bookSelect-item-dep flightResults-bookSelect-item-arr">
                <div className="flightResults-bookSelect-item-dep-time">
                  {bookingFlight[0].flightNew.segments[0].arrTime}
                </div>
                <div className="flightResults-bookSelect-item-dep-airport">
                  {bookingFlight[0].flightNew.segments[0].destAirportCode}
                </div>
              </div>
              <div className="flightResults-bookSelect-item-fare">
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  className="flightResults-list-flightCard-price-icon"
                />
                {bookingFlight[0].flightNew.fare}
              </div>
              <div></div>
              <div className="flightResults-bookSelect-item-airline">
                {airline1[0] ? (
                  <div className="flightResults-bookSelect-item-logo">
                    <span
                      style={{ backgroundImage: `url(${airline1[0]?.url})` }}
                    ></span>
                  </div>
                ) : (
                  <div className="flightResults-bookSelect-item-logo">
                    <span>
                      <FontAwesomeIcon
                        icon={faPlaneDeparture}
                        className="flightResults-bookSelect-item-logo-icon"
                      />
                    </span>
                  </div>
                )}
                {bookingFlight[0].flightNew.segments[0].airlineName}
              </div>
            </div>
            {bookingFlight[1] ? (
              <div className="flightResults-bookSelect-item flightResults-bookSelect-item-last">
                <div className="flightResults-bookSelect-item-dep">
                  <div className="flightResults-bookSelect-item-dep-time">
                    {bookingFlight[1].flightNew.segments[0].depTime}
                  </div>
                  <div className="flightResults-bookSelect-item-dep-airport">
                    {bookingFlight[1].flightNew.segments[0].originAirportCode}
                  </div>
                </div>
                <div className="flightResults-bookSelect-item-dep-arrow">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
                <div className="flightResults-bookSelect-item-dep flightResults-bookSelect-item-arr">
                  <div className="flightResults-bookSelect-item-dep-time">
                    {bookingFlight[1].flightNew.segments[0].arrTime}
                  </div>
                  <div className="flightResults-bookSelect-item-dep-airport">
                    {bookingFlight[1].flightNew.segments[0].destAirportCode}
                  </div>
                </div>
                <div className="flightResults-bookSelect-item-fare">
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightResults-list-flightCard-price-icon"
                  />
                  {bookingFlight[1].flightNew.fare}
                </div>
                <div></div>
                <div className="flightResults-bookSelect-item-airline">
                  {airline2[0] ? (
                    <div className="flightResults-bookSelect-item-logo">
                      <span
                        style={{
                          backgroundImage: `url(${airline2[0]?.url})`,
                        }}
                      ></span>
                    </div>
                  ) : (
                    <div className="flightResults-bookSelect-item-logo">
                      <span>
                        <FontAwesomeIcon
                          icon={faPlaneDeparture}
                          className="flightResults-bookSelect-item-logo-icon"
                        />
                      </span>
                    </div>
                  )}
                  {bookingFlight[1].flightNew.segments[0].airlineName}
                </div>
              </div>
            ) : null}
            {bookingFlight.length === 2 ? (
              <div className="flightResults-bookSelect-book">
                <div className="flightResults-bookSelect-book-fare">
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="flightResults-bookSelect-book-fare-icon"
                  />
                  {`${totalFareSum.toLocaleString("en-IN")}`}
                </div>
                <button
                  onClick={() =>
                    actions.fetchingFlightBookData(bookingFlight)
                  }
                >
                  Book
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    )}
  </div>
  )
}

export default AdminFlightListPage