import React, { useEffect, useState } from "react";
import { format } from "date-fns";
const FlightDetails = ({ flightData }) => {
  console.log(flightData);
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchDetails();
  }, [flightData]);
  const fetchDetails = async () => {
    if (!flightData) {
      return;
    }
    setLoading(true);
    const data = {
      PNR: flightData.Response.Response.PNR,
      BookingId: flightData.Response.Response.BookingId,
    };
    const BookingRes = await fetch(
      "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/getflightBookingDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const resData = await BookingRes.json();
    console.log(resData);
    setdata(resData);
    setLoading(false);
  };

  if (loading) {
    return <p>Loading..</p>;
  }
  return (
    <div>
      <table>
        <tr>
          <th></th>
          <th>PNR No.</th>
          <th>Departure</th>
          <th>Arrival</th>
        </tr>
        <tr>
          <td>
            {data?.Response?.FlightItinerary?.Origin}-
            {data?.Response?.FlightItinerary?.Destination}
          </td>
          <td>
            {data?.Response?.FlightItinerary?.AirlineCode}-
            {data?.Response?.FlightItinerary?.PNR}
          </td>
          <td>
            {
              data?.Response?.FlightItinerary?.Segments[0]?.Origin.DepTime.split(
                "T"
              )[0]
            }
          </td>
          <td>
            {
              data?.Response?.FlightItinerary?.Segments[0]?.Destination.ArrTime.split(
                "T"
              )[0]
            }
          </td>
        </tr>
      </table>

      <table>
        <tr>
          <th>Passenger Name</th>
          <th>Passenger Type</th>
          <th>GST No.</th>
        </tr>
        {data?.Response?.FlightItinerary?.Passenger?.map((passenger, index) => (
          <tr key={index}>
            <td>
              {passenger?.Title} {passenger?.FirstName} {passenger?.LastName}
            </td>
            <td>Adult</td>
            <td>{index === 0 ? passenger?.GSTNumber : ""}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default FlightDetails;
