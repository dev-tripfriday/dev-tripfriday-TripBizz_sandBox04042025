import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Page,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { format, parse } from "date-fns";
const InvoicePdf1 = ({
  adminTripdata,
  tripData,
  userAccountDetails,
  type,
  item,
  date,
  cost,
  service,
  gst,
  totalCost,
  invoiceId,
  bus,
  flight,
  hotel,
  endDate,
  cabData,
  busData,
  totalFlight,
  hotelData,
  other,
}) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const financialYear = month >= 4 ? year : year - 1;
  var yrString = `${financialYear % 100}-${(financialYear % 100) + 1}`;
  var options = { day: "numeric", month: "short", year: "numeric" };
  var formattedDate = today.toLocaleDateString("en-US", options);
  var finalString = `TB/${yrString}/${userAccountDetails?.InvoiceId}/${invoiceId}`;
  const cabTravellerDetails =
    cabData && tripData?.data?.travellerDetails[cabData?.id];
  const busTravellerDetails =
    busData && tripData?.data?.travellerDetails[busData?.id];
  const flightTravellerDetails =
    totalFlight && tripData?.data?.travellerDetails[totalFlight?.id];
  const hotelTravellerDetails =
    hotelData && tripData?.data?.travellerDetails[hotelData?.id];
  console.log(hotelTravellerDetails, tripData);
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
    firstTableCol: {
      width: "35%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
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
              <Text>Hyderabad-500073</Text>
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
                {userAccountDetails?.companyName}
              </Text>
              <Text style={{ fontSize: 10 }}>
                {userAccountDetails?.companyAddress}
              </Text>

              <Text style={{ fontSize: 10 }}>
                GST NO:{userAccountDetails?.GSTNo}
              </Text>
              <Text style={{ fontSize: 10 }}>
                PAN: {userAccountDetails?.PANNo}
              </Text>
            </View>
            <View style={{ width: "25%" }}>
              <Text style={{ fontSize: 13 }}>Invoice date</Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>
                {formattedDate}
              </Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>
                Place of supply: Telangana
              </Text>
            </View>
            <View style={{ width: "25%" }}>
              <Text style={{ fontSize: 13 }}>Invoice #</Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>{finalString}</Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>HSN: 998551</Text>
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

          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.header]}>
              <View style={styles.firstTableCol}>
                <Text style={styles.tableCell}>Item</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Trip date/s</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Cost</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Service charge</Text>
              </View>
              {userAccountDetails?.companyLocation === "Within State" ? (
                <>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>CGST(9%)</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>SGST(9%)</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>IGST(18%)</Text>
                  </View>
                </>
              )}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Total Price</Text>
              </View>
            </View>
            {type === "Cab" && (
              <>
                <View style={styles.tableRow}>
                  <View style={styles.firstTableCol}>
                    <Text style={styles.tableCell}>{`${type}:${item}`}</Text>
                    <Text style={styles.tableCell}>
                      {cabTravellerDetails?.adults[0]?.firstName +
                        " " +
                        cabTravellerDetails?.adults[0]?.lastName}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{date.toString()}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{Math.ceil(cost)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{Math.ceil(service)}</Text>
                  </View>
                  {userAccountDetails?.companyLocation === "Within State" ? (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {parseFloat(gst / 2).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {parseFloat(gst / 2).toFixed(2)}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>{Math.ceil(gst)}</Text>
                      </View>
                    </>
                  )}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{totalCost}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.firstTableCol}>
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
                  {userAccountDetails?.companyLocation === "Within State" ? (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </>
                  )}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{totalCost}</Text>
                  </View>
                </View>
              </>
            )}
            {type === "Bus" && (
              <>
                <View style={styles.tableRow}>
                  <View style={styles.firstTableCol}>
                    <Text style={styles.tableCell}>
                      {type}: {bus?.bus?.TravelName}
                    </Text>
                    <Text>
                      {busTravellerDetails?.adults?.map((e, i) => (
                        <>
                          <Text style={{ fontSize: 8, paddingLeft: 5 }}>
                            {e.firstName} {e.lastName},
                          </Text>
                        </>
                      ))}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {format(bus?.bus?.DepartureTime, "MMM dd hh:mm a")}-
                      {format(bus?.bus?.ArrivalTime, "MMM dd hh:mm a")}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {bus?.busTotalPrice - bus?.serviceCharge - bus?.GST}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(bus?.serviceCharge)}
                    </Text>
                  </View>
                  {userAccountDetails?.companyLocation === "Within State" ? (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {parseFloat(bus?.GST / 2).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {parseFloat(bus?.GST / 2).toFixed(2)}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {Math.ceil(bus?.GST)}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(bus?.busTotalPrice)}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.firstTableCol}>
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
                  {userAccountDetails?.companyLocation === "Within State" ? (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </>
                  )}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(bus?.busTotalPrice)}
                    </Text>
                  </View>
                </View>
              </>
            )}
            {type === "Flight" && (
              <>
                <View style={styles.tableRow}>
                  <View style={styles.firstTableCol}>
                    <Text style={styles.tableCell}>{type}: </Text>
                    <Text style={{ fontSize: 8, paddingLeft: 5 }}>
                      {
                        flight?.data?.flight?.Segments[0][0].Airline
                          ?.AirlineName
                      }
                      ,{flight?.data?.flightNew?.segments[0]?.originAirportCode}
                      -{flight?.data?.flightNew?.segments[0]?.destAirportCode},
                      {/* {flight?.data?.flightNew?.segments[0]?.depTime} */}
                    </Text>
                    <Text style={{ fontSize: 8, paddingLeft: 5 }}>
                      {flightTravellerDetails?.adults?.length}Adults
                    </Text>
                    <Text style={{ paddingLeft: 5 }}>
                      {flightTravellerDetails?.adults?.map((e, i) => (
                        <>
                          <Text style={{ fontSize: 8 }}>
                            {e.firstName} {e.lastName},
                          </Text>
                        </>
                      ))}
                      {flightTravellerDetails?.children?.map((e, i) => (
                        <>
                          <Text style={{ fontSize: 8 }}>
                            {e.firstName} {e.lasttName},
                          </Text>
                        </>
                      ))}
                      {flightTravellerDetails?.infants?.map((e, i) => (
                        <>
                          <Text style={{ fontSize: 8 }}>
                            {e.firstName} {e.lasttName},
                          </Text>
                        </>
                      ))}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {format(
                        flight?.data?.flight?.Segments[0][0].Origin.DepTime,
                        "MMM dd, yyyy"
                      )}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {flight?.data?.totalFare}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(flight?.data?.finalFlightServiceCharge)}
                    </Text>
                  </View>
                  {userAccountDetails?.companyLocation === "Within State" ? (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {parseFloat(
                            flight?.data?.gstInFinalserviceCharge / 2
                          ).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {parseFloat(
                            flight?.data?.gstInFinalserviceCharge / 2
                          ).toFixed(2)}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {Math.ceil(flight?.data?.gstInFinalserviceCharge)}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(
                        flight?.data?.totalFare +
                          flight?.data?.finalFlightServiceCharge +
                          flight?.data?.gstInFinalserviceCharge
                      )}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.firstTableCol}>
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
                  {userAccountDetails?.companyLocation === "Within State" ? (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </>
                  )}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(
                        flight?.data?.totalFare +
                          flight?.data?.finalFlightServiceCharge +
                          flight?.data?.gstInFinalserviceCharge
                      )}
                    </Text>
                  </View>
                </View>
              </>
            )}
            {type === "Hotel" && (
              <>
                <View style={styles.tableRow}>
                  <View style={styles.firstTableCol}>
                    <Text style={styles.tableCell}>{type}:</Text>
                    <Text style={{ fontSize: 8, paddingLeft: 5 }}>
                      {
                        hotel?.data?.hotelInfo?.HotelInfoResult?.HotelDetails
                          ?.HotelName
                      }
                      ,{hotel?.data?.selectedRoomType[0]?.RoomTypeName}
                    </Text>
                    <Text style={{ fontSize: 8, paddingLeft: 5 }}>
                      {hotelTravellerDetails?.adults?.length} Adults
                    </Text>
                    <Text style={{ fontSize: 8, paddingLeft: 5 }}>
                      {hotelTravellerDetails?.adults?.map((e, i) => (
                        <>
                          <Text style={{ fontSize: 8 }}>
                            {e.firstName} {e.lastName},
                          </Text>
                        </>
                      ))}
                      {hotelTravellerDetails?.children?.map((e, i) => (
                        <>
                          <Text style={{ fontSize: 8 }}>{e.lastName},</Text>
                        </>
                      ))}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {format(
                        hotel?.data?.hotelSearchQuery?.checkInDate?.seconds *
                          1000,
                        "MMM dd, yyyy"
                      )}
                      {format(
                        hotel?.data?.hotelSearchQuery?.checkOutDate?.seconds *
                          1000,
                        "MMM dd, yyyy"
                      )}
                    </Text>
                    <Text style={{ fontSize: 8 }}>
                      {" "}
                      ({hotel?.data?.hotelSearchQuery?.hotelNights} nights)
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {hotel?.data?.hotelFinalPrice}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(hotel?.data?.hotelServiceCharge)}
                    </Text>
                  </View>
                  {userAccountDetails?.companyLocation === "Within State" ? (
                    <>
                      {" "}
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {parseFloat(
                            hotel?.data?.calculateGstFromService / 2
                          ).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {parseFloat(
                            hotel?.data?.calculateGstFromService / 2
                          ).toFixed(2)}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {Math.ceil(hotel?.data?.calculateGstFromService)}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(hotel?.data?.hotelTotalPrice)}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.firstTableCol}>
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
                  {userAccountDetails?.companyLocation === "Within State" ? (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </>
                  )}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(hotel?.data?.hotelTotalPrice)}
                    </Text>
                  </View>
                </View>
              </>
            )}
            {type === "Other" && (
              <>
                <View style={styles.tableRow}>
                  <View style={styles.firstTableCol}>
                    {/* <Text style={styles.tableCell}>{type}:</Text> */}
                    <Text style={{ fontSize: 8, paddingLeft: 5 }}>
                      {other?.data?.bookingType}
                    </Text>
                    <Text style={{ fontSize: 8, paddingLeft: 5 }}>
                      {other?.data?.bookingDetails}
                    </Text>
                    <Text style={{ fontSize: 8, paddingLeft: 5 }}>
                      {other?.data?.bookingTravellers?.length} Adults
                    </Text>
                    <Text style={{ fontSize: 8, paddingLeft: 5 }}>
                      {other?.data?.bookingTravellers?.map((e, i) => (
                        <>
                          <Text style={{ fontSize: 8 }}>
                            {e.firstName} {e.lastName},
                          </Text>
                        </>
                      ))}
                      {hotelTravellerDetails?.children?.map((e, i) => (
                        <>
                          <Text style={{ fontSize: 8 }}>
                            {e.firstName} {e.lastName},
                          </Text>
                        </>
                      ))}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {other?.data?.bookingDate}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {other?.data?.bookingCost}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(other?.data?.bookingService)}
                    </Text>
                  </View>
                  {userAccountDetails?.companyLocation === "Within State" ? (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {parseFloat((other?.data?.bookingGst / 2).toFixed(2))}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {parseFloat((other?.data?.bookingGst / 2).toFixed(2))}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {Math.ceil(other?.data?.bookingGst)}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(other?.data?.overallBookingPrice)}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.firstTableCol}>
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
                  {userAccountDetails?.companyLocation === "Within State" ? (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </>
                  )}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.ceil(other?.data?.overallBookingPrice)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
          <Text style={{ fontSize: "8pt", marginTop: "20pt" }}>
            *This is a digitally generated invoice
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf1;
