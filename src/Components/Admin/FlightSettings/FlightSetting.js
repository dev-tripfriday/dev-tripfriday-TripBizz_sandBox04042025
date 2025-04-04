import React, { useContext, useState } from "react";
import SideNav from "../SideNav/SideNav";
import "./FlightSetting.css";
import MyContext from "../../Context";

const FlightSetting = () => {
  var { actions } = useContext(MyContext);
  var [file, setFile] = useState();
  const [hotelCity, setHotelCity] = useState();
  const [cabDetails, setCabDetails] = useState();
  var handleInput = async () => {
    if (!file) return false;
    await actions.uploadAirportList(file);
  };
  const handleHotelCityList = async () => {
    if (!hotelCity) return false;
    await actions.uploadHotelCityList(hotelCity);
  };
  const handleCabCityList = async () => {
    if (!cabDetails) return false;
    await actions.uploadCabDetailsList(cabDetails);
  };
  return (
    <div className="flightsetting-block !flex">
      <SideNav />
      <div className="flightsetting-main-block">
        <div className="flightsetting-main-tabs">
          <div className="flightsetting-main-tabs-list flightsetting-main-tabs-list-active">
            Airport City List
          </div>
        </div>

        <div className="flightsetting-main-content">
          <div className="flightsetting-main-box">
            <div className="flightsetting-main-header">Upload the CSV File</div>
            <div className="flightsetting-main-input">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button onClick={handleInput}>Submit</button>
            </div>
          </div>
        </div>
        <div className="flightsetting-main-tabs">
          <div className="flightsetting-main-tabs-list flightsetting-main-tabs-list-active">
            Hotel City List
          </div>
        </div>

        <div className="flightsetting-main-content">
          <div className="flightsetting-main-box">
            <div className="flightsetting-main-header">Upload the CSV File</div>
            <div className="flightsetting-main-input">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setHotelCity(e.target.files[0])}
              />
              <button onClick={handleHotelCityList}>Submit</button>
            </div>
          </div>
        </div>
        <div className="flightsetting-main-tabs">
          <div className="flightsetting-main-tabs-list flightsetting-main-tabs-list-active">
            Cab Cost List
          </div>
        </div>

        <div className="flightsetting-main-content">
          <div className="flightsetting-main-box">
            <div className="flightsetting-main-header">Upload the CSV File</div>
            <div className="flightsetting-main-input">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCabDetails(e.target.files[0])}
              />
              <button onClick={handleCabCityList}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSetting;
