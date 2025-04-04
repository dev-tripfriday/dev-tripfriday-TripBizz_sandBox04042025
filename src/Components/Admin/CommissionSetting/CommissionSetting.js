import React, { useContext, useEffect, useState } from "react";
import SideNav from "../SideNav/SideNav";
import Popup from "../../Popup";
import "./CommissionSetting.css";
import MyContext from "../../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { Button, Input, TextField } from "@mui/material";

const CommissionSetting = () => {
  var {
    actions,
    internationalFlight,
    domesticFlight,
    internationalHotel,
    domesticHotel,
    cabService,
    busService,
    minimumServiceCharge,
  } = useContext(MyContext);
  var [currentTab, setCurrentTab] = useState(0);
  var [openFlight, setOpenFlight] = useState(false);
  var [openHotel, setOpenHotel] = useState(false);
  var [openCab, setOpenCab] = useState(false);
  const [openbusCommision, setOpenBusCommission] = useState();
  const [openMinimum, setOpenMinimumCommission] = useState(false);
  const [minimumCommission, setminimumCommission] = useState(null);
  var [hotelData, setHotelData] = useState({
    domesticHotels: 0,
    internationalHotels: 0,
  });
  var [flightData, setFlightData] = useState({
    domesticFlights: 0,
    internationalFlights: 0,
  });
  var [cabData, setCabData] = useState(cabService);
  const [busData, setBusData] = useState(busService);

  var hotelSubmit = async () => {
    await actions.editHotelService(hotelData);
    setOpenHotel(false);
  };

  var cabSubmit = async () => {
    await actions.editCabService(cabData);
    setOpenHotel(false);
  };
  var busSubmit = async () => {
    await actions.editBusService(busData);
    setOpenBusCommission(false);
  };

  var flightSubmit = async () => {
    await actions.editFlightService(flightData);
    setOpenFlight(false);
  };
  const minimumChargeSubmit = async () => {
    await actions.editMinimumCharge(Number(minimumCommission));
    setOpenMinimumCommission(false);
  };
  // useEffect(() => {
  //   setminimumCommission(minimumServiceCharge);
  // }, []);

  return (
    <>
      <Popup
        condition={openFlight}
        close={() => {
          setOpenFlight(false);
        }}
      >
        <div className="flightService-header">Edit Flight Commission</div>
        <div className="flightServie-block">
          <div className="flightService-type">
            <span>Domestic Flights</span>
            <input
              type="text"
              name="domesticFlights"
              placeholder="Domestic Flights"
              value={flightData.domesticFlights}
              onChange={(e) => {
                setFlightData({
                  ...flightData,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          </div>
          <div className="flightService-type">
            <span>Internationl Flights</span>
            <input
              type="text"
              name="internationalFlights"
              placeholder="International Flights"
              value={flightData.internationalFlights}
              onChange={(e) => {
                setFlightData({
                  ...flightData,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          </div>
          <div className="flightService-submit">
            <button onClick={flightSubmit}>Submit</button>
          </div>
        </div>
      </Popup>
      <Popup
        condition={openHotel}
        close={() => {
          setOpenHotel(false);
        }}
      >
        <div className="hotelService-header">Edit Hotel Commission</div>
        <div className="hotelServie-block">
          <div className="hotelService-type">
            <span>Domestic Hotels</span>
            <input
              type="text"
              name="domesticHotels"
              placeholder="Domestic hotels"
              value={hotelData.domesticHotels}
              onChange={(e) => {
                setHotelData({
                  ...hotelData,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          </div>
          <div className="hotelService-type">
            <span>Internationl hotels</span>
            <input
              type="text"
              name="internationalHotels"
              placeholder="International Hotels"
              value={hotelData.internationalHotels}
              onChange={(e) => {
                setHotelData({
                  ...hotelData,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          </div>
          <div className="hotelService-submit">
            <button onClick={hotelSubmit}>Submit</button>
          </div>
        </div>
      </Popup>
      <Popup
        condition={openCab}
        close={() => {
          setOpenCab(false);
        }}
      >
        <div className="hotelService-header">Edit Cab Commission</div>
        <div className="hotelServie-block">
          <div className="hotelService-type">
            <span>Cabs</span>
            <input
              type="text"
              name="domesticHotels"
              placeholder="Domestic hotels"
              value={cabData}
              onChange={(e) => {
                setCabData(e.target.value);
              }}
            />
          </div>
          <div className="hotelService-submit">
            <button onClick={cabSubmit}>Submit</button>
          </div>
        </div>
      </Popup>
      <Popup
        condition={openbusCommision}
        close={() => {
          setOpenBusCommission(false);
        }}
      >
        <div className="hotelService-header">Edit Bus Commission</div>
        <div className="hotelServie-block">
          <div className="hotelService-type">
            <span>Bus</span>
            <input
              type="text"
              name="busCommission"
              placeholder="change bus commission"
              value={busData}
              onChange={(e) => {
                setBusData(e.target.value);
              }}
            />
          </div>
          <div className="hotelService-submit">
            <button onClick={busSubmit}>Submit</button>
          </div>
        </div>
      </Popup>
      <Popup
        condition={openMinimum}
        close={() => {
          setOpenMinimumCommission(false);
        }}
      >
        <div className="hotelService-header">Edit Service Charge</div>
        <div className="hotelServie-block">
          <div className="hotelService-type">
            <span>Service Charge</span>
            <input
              type="text"
              name="busCommission"
              placeholder="change service charge"
              onChange={(e) => setminimumCommission(e.target.value)}
              value={minimumCommission}
            />
          </div>
          <div className="hotelService-submit">
            <button onClick={minimumChargeSubmit}>Submit</button>
          </div>
        </div>
      </Popup>
      <div className="flex">
        <SideNav />
        <div className="commission-container">
          <div className="commission-main-tabs">Commission Settings</div>
          {/* <div className="flex gap-4 items-center justify-between">
          <div className="mt-2">
            <label className="font-semibold">Minimum service charge</label>
            <br />
            <TextField
              size="small"
              className="w-[400px] my-2"
              onChange={(e) => setminimumCommission(Number(e.target.value))}
              value={minimumCommission}
            />
          </div>
          <Button
            variant="contained"
            size="small"
            onClick={minimumChargeSubmit}
          >
            ADD
          </Button>
        </div> */}
          <div className="commission-flight-box">
            <div className="commission-flight-content">
              <div className="commission-flight-edit">
                <div className="commission-flight-header">
                  Minimum Service Charge
                </div>
                <button
                  onClick={() => {
                    setOpenMinimumCommission(true);
                    setminimumCommission(minimumServiceCharge);
                  }}
                >
                  <FontAwesomeIcon icon={faPencil} /> Edit
                </button>
              </div>
              <span>Service-{minimumServiceCharge}</span>
            </div>
          </div>
          <div className="commission-flight-box">
            <div className="commission-flight-content">
              <div className="commission-flight-edit">
                <div className="commission-flight-header">Flights</div>
                <button
                  onClick={() => {
                    setOpenFlight(true);
                    setFlightData({
                      ...flightData,
                      domesticFlights: domesticFlight,
                      internationalFlights: internationalFlight,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faPencil} /> Edit
                </button>
              </div>
              <span>
                Domestic Flights-{domesticFlight}%, International Flights-
                {internationalFlight}%
              </span>
            </div>
          </div>
          <div className="commission-hotel-box">
            <div className="commission-hotel-content">
              <div className="commission-hotel-edit">
                <div className="commission-hotel-header">Hotels</div>
                <button
                  onClick={() => {
                    setOpenHotel(true);
                    setHotelData({
                      ...hotelData,
                      domesticHotels: domesticHotel,
                      internationalHotels: internationalHotel,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faPencil} /> Edit
                </button>
              </div>
              <span>
                Domestic Hotels-{domesticHotel}%, International Hotels-
                {internationalHotel}%
              </span>
            </div>
          </div>
          {/* <div className="commission-flight-box">
            <div className="commission-flight-content">
              <div className="commission-flight-edit">
                <div className="commission-flight-header">Cabs</div>
                <button onClick={() => setOpenCab(true)}>
                  <FontAwesomeIcon icon={faPencil} /> Edit
                </button>
              </div>
              <span>Cabs-{cabService}%</span>
            </div>
          </div>
          <div className="commission-flight-box">
            <div className="commission-flight-content">
              <div className="commission-flight-edit">
                <div className="commission-flight-header">Buses</div>
                <button onClick={() => setOpenBusCommission(true)}>
                  <FontAwesomeIcon icon={faPencil} /> Edit
                </button>
              </div>
              <span>Buses-{busService}%</span>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default CommissionSetting;
