import React, { useContext, useEffect, useState } from "react";
import SideNav from "../SideNav/SideNav";
import "./Report.css";
import ReactDatePicker from "react-datepicker";
import MyContext from "../../Context";

const Report = () => {
  const { actions, submittedTrips } = useContext(MyContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(true);
  const oneYearBack = new Date();
  oneYearBack.setFullYear(oneYearBack.getFullYear() - 1);
  const handleCabDates = (e, type) => {
    let date = e;
    if (type === "startDate") {
      setStartDate(date);
    } else if (type === "endDate") {
      setEndDate(date);
    }
  };
  var downloadReport = () => {
    actions.createExcelSheet(submittedTrips, startDate, endDate);
  };
  const getTripData = async () => {
    await actions.getSubmittedTrips();
  };

  useEffect(() => {
    if (mounted) {
      var fetchData = async () => {
        await getTripData();
      };
      fetchData();
    }
    return () => {
      setMounted(false);
    };
  }, [submittedTrips]);

  return (
    <div className="flex">
      <SideNav />
      <div className="report-main-block">
        <div className="report-main-tabs">
          <div className="report-main-tabs-list">Report</div>
        </div>
        <div className="report-content">
          <div className="report-content-header">
            Select the dates ypu want to download the report
          </div>
          <form className="report-content-form">
            <ReactDatePicker
              minDate={oneYearBack}
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              selectsEnd
              popperPlacement="auto-start"
              showPopperArrow={false}
              onChange={(e) => handleCabDates(e, "startDate")}
              showMonthYearDropdown
              dateFormat="EEE, MMM d"
              fixedHeight
              withPortal
              placeholderText="Start date"
              className="flightSearch-dates-input"
              id="flightSearch-departureDate"
            />
            <ReactDatePicker
              minDate={startDate}
              selected={endDate}
              startDate={startDate}
              endDate={endDate}
              selectsEnd
              popperPlacement="auto-start"
              showPopperArrow={false}
              onChange={(e) => handleCabDates(e, "endDate")}
              showMonthYearDropdown
              dateFormat="EEE, MMM d"
              fixedHeight
              withPortal
              placeholderText="End date"
              className="flightSearch-dates-input"
              id="flightSearch-departureDate"
            />
          </form>
          {loading ? (
            <button className="spin">
              <div className="spinner"></div>
            </button>
          ) : (
            <button className="report-button" onClick={downloadReport}>
              Download Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
