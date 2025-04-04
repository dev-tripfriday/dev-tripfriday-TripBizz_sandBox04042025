import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Page,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { db } from "./MyProvider";
const InvoicePdf = ({ tripData, userAccountDetails }) => {
  console.log(userAccountDetails);
  const index = userAccountDetails.trips.findIndex(
    (item) => item === tripData?.id
  );
  const returnInvoiceNumber = () => {
    return `${index + 1}`;
  };
  const firstTwo = userAccountDetails?.InvoiceId;
  var price = 0;
  const today = new Date();
  const day = today.toString().slice(8, 10);
  var monthStr = today.toISOString().slice(5, 7);
  var yrStr = today.toISOString();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const financialYear = month >= 4 ? year : year - 1;
  var yrString = `${financialYear % 100}-${(financialYear % 100) + 1}`;
  var randomNum = Math.floor(1 + Math.random() * 9);
  var dateString = `${day}-${monthStr}-${yrStr}`;
  var options = { day: "numeric", month: "short", year: "numeric" };

  var formattedDate = today.toLocaleDateString("en-US", options);
  const hotelBooked =
    tripData?.data?.hotels?.some((f) => f.status === "Booked") ?? false;
  const flightBooked =
    tripData?.data?.flights?.some((f) => f.status === "Booked") ?? false;
  console.log(flightBooked);
  const cabsBooked =
    tripData?.data?.cabs?.some((f) => f.status === "Booked") ?? false;
  const busBooked =
    tripData?.data?.bus?.some((f) => f.status === "Booked") ?? false;
  const anyTrue = flightBooked || hotelBooked || cabsBooked || busBooked;
  const reindex = anyTrue ? returnInvoiceNumber() : "";
  var finalString = `TB/${yrString}/${firstTwo}/${reindex}`;
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#E4E4E4",
      marginTop: 10,
    },
    table: {
      display: "table",
      width: "auto",
      marginTop: 10,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      width: "25%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
    },
    tableCell: {
      margin: 5,
      fontSize: 10,
    },
    header: {
      fontSize: 12,
      fontWeight: "bold",
      backgroundColor: "#d3d3d3",
    },
  });

  return (
    <Document>
      <Page size={"A4"} style={{ padding: 20 }}>
        <View>
          <View style={{ border: "3px solid gray" }}></View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ fontSize: 13 }}>
              <Text style={{ paddingTop: 10, paddingBottom: 10, fontSize: 17 }}>
                QuikProcess Pvt. Ltd
              </Text>
              <Text>Plot No 41, H.No:8-3-833/41</Text>
              <Text>Phase 1,Kamalapuri Colony</Text>
              <Text style={{ paddingTop: 10 }}>Hyderabad-500073</Text>
              <Text>PAN: AAACQ4319H</Text>
              <Text>GST: 36AAACQ4319H2ZI</Text>
            </View>
            <View>
              <Image
                style={{ height: "20vw", width: "30vw", objectFit: "contain" }}
                source={{
                  uri: "https://firebasestorage.googleapis.com/v0/b/trav-biz.appspot.com/o/logo%2FWhatsApp_Image_2024-05-09_at_12.49.04_PM-removebg-preview.png?alt=media&token=eba760ff-379d-4bf6-a0f5-595b5d6198f5",
                }}
              />
            </View>
          </View>
          <Text
            style={{
              textAlign: "center",
              color: "#0f4264",
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            Invoice
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ width: "50%" }}>
              <Text style={{ fontSize: 13 }}>Invoice for</Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>
                {userAccountDetails.companyName}
              </Text>
              <Text style={{ fontSize: 10 }}>
                {userAccountDetails.companyAddress}
              </Text>

              <Text style={{ fontSize: 10 }}>
                GST NO:{userAccountDetails.GSTNo}
              </Text>
              <Text style={{ fontSize: 10 }}>
                PAN: {userAccountDetails.PANNo}
              </Text>
            </View>
            <View style={{ width: "25%" }}>
              <Text style={{ fontSize: 13 }}>Invoice date</Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>
                {formattedDate}
              </Text>
            </View>
            <View style={{ width: "25%" }}>
              <Text style={{ fontSize: 13 }}>Invoice #</Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>{finalString}</Text>
            </View>
            <View></View>
          </View>
          <View
            style={{
              border: "0.5px solid gray",
              marginTop: 10,
              marginBottom: 10,
            }}
          ></View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              color: "#0f4264",
              fontSize: 14,
            }}
          >
            <Text>Description</Text>
            <Text>Charges</Text>
          </View>

          {anyTrue ? (
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.header]}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Item</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Date</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Cost</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Service charge</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>GST</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Total Cost</Text>
                </View>
              </View>

              {tripData?.hotels?.length > 0 &&
                tripData?.hotels
                  .filter((hotel) => {
                    var hotelStatus = tripData?.data?.hotels?.filter(
                      (f) => f.id === hotel.id
                    );
                    return hotelStatus[0].status === "Booked";
                  })
                  .map((hotel) => {
                    const monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];
                    var hotelName =
                      hotel.data.hotelInfo.HotelInfoResult.HotelDetails
                        .HotelName;

                    var hotelPrice = hotel.data.hotelFinalPrice;

                    const startdate = new Date(
                      hotel?.data?.hotelSearchQuery?.checkInDate.seconds * 1000
                    );

                    const formattedDate1 = `${
                      monthNames[startdate.getMonth()]
                    } ${startdate.getDate()}`;

                    var endDate = new Date(
                      hotel?.data?.hotelSearchQuery?.checkOutDate.seconds * 1000
                    );

                    const formattedDate2 = `${
                      monthNames[endDate.getMonth()]
                    } ${endDate.getDate()}`;

                    var hotelDates = formattedDate1 + "-" + formattedDate2;

                    var hotelTotalPrice = hotel.data.hotelTotalPrice;

                    var x = hotelTotalPrice - hotelPrice;

                    var margin = x > 0 ? Math.ceil(x / 1.18) : 0;

                    var GST = Math.ceil(hotelTotalPrice - hotelPrice - margin);

                    price += hotelTotalPrice;

                    return (
                      <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            Hotel:{hotelName}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{hotelDates}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{hotelPrice}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{margin}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{GST}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {hotelTotalPrice}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
              {tripData?.flights?.length > 0 &&
                tripData.flights
                  .filter((flight) => {
                    var flightStatus = tripData.data.flights.filter(
                      (f) => f.id === flight.id
                    );
                    return flightStatus[0]?.status === "Booked";
                  })
                  .map((flight) => {
                    console.log(flight);
                    var flightDetails =
                      flight.data.flightNew.segments[0].destCityName +
                      " to " +
                      flight.data.flightNew.segments[0].originCityName;
                    var totalFare = flight.data.totalFare;
                    var finalFare =
                      flight.data.totalFare +
                      flight.data.finalFlightServiceCharge +
                      flight.data.gstInFinalserviceCharge;
                    var x = finalFare - totalFare;
                    var margin = x > 0 ? Math.ceil(x / 1.18) : 0;
                    var GST = Math.ceil(finalFare - totalFare - margin);
                    var flightDates =
                      new Date(
                        flight.data.flightRequest.segments[0].PreferredArrivalTime
                      )
                        .toDateString()
                        .slice(4, 10) +
                      "," +
                      new Date(
                        flight.data.flightRequest.segments[0].PreferredArrivalTime
                      )
                        .toDateString()
                        .slice(11, 15);
                    price += finalFare;
                    return (
                      <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            Flight:{flightDetails}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{flightDates}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {flight.data.totalFare}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{margin}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{GST}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{finalFare}</Text>
                        </View>
                      </View>
                    );
                  })}

              {tripData?.cabs?.length > 0 &&
                tripData.cabs
                  .filter((cab) => {
                    var cabReq = tripData?.data?.cabs?.filter((hotelMain) => {
                      return hotelMain.id === cab.id;
                    });
                    return cabReq[0]?.status === "Booked";
                  })
                  .map((cab) => {
                    console.log(cab);
                    var cabDetails = cab.data.cabCity + "-" + cab.data.cabType;
                    var cabDate =
                      new Date(cab.data.cabStartDate.seconds * 1000)
                        .toDateString()
                        .slice(4, 10) +
                      "," +
                      new Date(cab.data.cabStartDate.seconds * 1000)
                        .toDateString()
                        .slice(11, 15);
                    var totalFare = cab.data.cabFinalPrice;
                    var finalFare = cab.data.cabTotalPrice;
                    var x = finalFare - totalFare;
                    var margin = x > 0 ? Math.ceil(x / 1.18) : 0;
                    var GST = Math.ceil(finalFare - totalFare - margin);
                    price += finalFare;
                    return (
                      <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>Cab:{cabDetails}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{cabDate}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{totalFare}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{margin}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{GST}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{finalFare}</Text>
                        </View>
                      </View>
                    );
                  })}

              {tripData?.bus?.length > 0 &&
                tripData.bus
                  .filter((bus) => {
                    var cabReq = tripData?.data?.bus?.filter((hotelMain) => {
                      return hotelMain.id === bus.id;
                    });
                    return cabReq[0]?.status === "Booked";
                  })
                  .map((bus) => {
                    console.log(bus);
                    const monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];
                    var cabDetails =
                      bus.data.origin.cityName +
                      "-" +
                      bus.data.destination.cityName;
                    // var cabDate =
                    //   new Date(bus.data.bus.ArrivalTime.seconds * 1000)
                    //     .toDateString()
                    //     .slice(4, 10) +
                    //   "," +
                    //   new Date(bus.data.bus.DepartureTime.seconds * 1000)
                    //     .toDateString()
                    //     .slice(11, 15);
                    var busDate = new Date(bus?.data?.bus?.ArrivalTime);
                    const month = monthNames[busDate.getMonth()]; // getMonth() returns 0-based index
                    const day = busDate.getDate();
                    const year = busDate.getFullYear();
                    const formattedDate = `${month} ${day}, ${year}`;

                    var totalFare = bus?.data?.selectedSeat?.reduce(
                      (total, seat) =>
                        total + seat.Price.OfferedPriceRoundedOff,
                      0
                    );
                    var finalFare = bus.data.busTotalPrice;

                    var x = finalFare - totalFare;
                    var margin = x > 0 ? Math.ceil(x / 1.18) : 0;
                    var GST = Math.ceil(finalFare - totalFare - margin);
                    price += finalFare;
                    return (
                      <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>Bus:{cabDetails}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{formattedDate}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{totalFare}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{margin}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{GST}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>{finalFare}</Text>
                        </View>
                      </View>
                    );
                  })}
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Total Price</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{Math.round(price)}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 10 }}>
              <Text style={{ textAlign: "center" }}>
                No booked records found
              </Text>
            </View>
          )}
          <Text style={{ fontSize: "8pt", marginTop: "20pt" }}>
            *This is a digitally generated invoice
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;
