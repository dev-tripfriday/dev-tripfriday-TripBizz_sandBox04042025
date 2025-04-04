import React, { useEffect, useState } from "react";
import SideNav from "../SideNav/SideNav";
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  getDoc,
  where,
} from "firebase/firestore";
import { db } from "../../MyProvider";
import { Pagination } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { FaDownload } from "react-icons/fa";
import Popup from "../../Popup";
import FlightDetails from "./FlightDetails";
import { WindmillSpinner } from "react-spinner-overlay";

const EmailandManual = ({ userPage, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [page, setPage] = useState(1);
  const limitPerPage = 20;
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ticketLoader, setTicketLoader] = useState(false);
  const [details, setDetails] = useState(null);
  const [detailsPopup, setDetailsPopup] = useState(false);
  const [flightData, setFlightData] = useState(null);
  const [invoiceLoader, setInvoiceLoader] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchBookingId, setSearchBookingId] = useState("");
  useEffect(() => {
    fetchBookings();
  }, [page]);
  const fetchBookings = async () => {
    try {
      setLoading(true);
      let bookingQuery;

      if (searchBookingId) {
        // Search by Booking ID (Direct Document Fetch)
        const bookingRef = doc(db, "bookingId", searchBookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (bookingSnap.exists()) {
          setBookings([{ id: bookingSnap.id, ...bookingSnap.data() }]);
        } else {
          setBookings([]);
        }
        setLoading(false);
        return;
      }

      if (searchEmail) {
        // Search by Email with pagination
        if (page === 1) {
          bookingQuery = query(
            collection(db, "bookingId"),
            where("email", ">=", searchEmail),
            where("email", "<=", searchEmail + "\uf8ff"), // Ensures it matches the prefix
            limit(limitPerPage)
          );
        } else {
          bookingQuery = query(
            collection(db, "bookingId"),
            collection(db, "bookingId"),
            where("email", ">=", searchEmail),
            where("email", "<=", searchEmail + "\uf8ff"),
            startAfter(lastVisible),
            limit(limitPerPage)
          );
        }
      } else if (userPage) {
        if (page === 1) {
          bookingQuery = query(
            collection(db, "bookingId"),
            where("user", "==", userId),
            orderBy("createdAt", "desc"),
            limit(limitPerPage)
          );
        } else {
          bookingQuery = query(
            collection(db, "bookingId"),
            where("user", "==", userId),
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(limitPerPage)
          );
        }
      } else {
        if (page === 1) {
          bookingQuery = query(
            collection(db, "bookingId"),
            orderBy("createdAt", "desc"),
            limit(limitPerPage)
          );
        } else {
          bookingQuery = query(
            collection(db, "bookingId"),
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(limitPerPage)
          );
        }
      }

      const querySnapshot = await getDocs(bookingQuery);

      if (!querySnapshot.empty) {
        const fetchedBookings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBookings(fetchedBookings);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(fetchedBookings.length === limitPerPage);
      } else {
        setHasMore(false);
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const getBookingData = async (id) => {
    try {
      const bookingRef = doc(db, "emailQueries", id);
      const bookingSnap = await getDoc(bookingRef);

      if (bookingSnap.exists()) {
        const bookingData = bookingSnap.data();
        // setFlightData(bookingData.ticketResponce);
        return bookingData;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };
  const getInvoiceNumber = async (userId, bookingId, companyId, bookType) => {
    console.log(bookingId);
    try {
      const invoiceRef = await db
        .collection("companies")
        .doc(companyId)
        .collection("Invoices")
        .where(bookType === "other" ? "bookingId" : "cardId", "==", bookingId)
        .get();
      const invoices = invoiceRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return {
        invoiceNumber: invoices[0].BillingInvoiceId,
      };
    } catch (error) {
      console.log(error);
    }
  };
  const downloadTicket = async (type, id, flightType, bookingId, urlfile) => {
    let flightBookData;
    setTicketLoader(true);
    if (type === "flight") {
      const bookingData = await getBookingData(id);
      console.log(bookingData);
      if (flightType === "onward") {
        flightBookData = bookingData.onwardTicketResponce;
      } else if (flightType === "return") {
        flightBookData = bookingData.returnTicketResponce;
      } else if (flightType === "oneway" || flightType === "international") {
        flightBookData = bookingData.ticketResponce;
      }
      console.log(flightBookData);
      try {
        const data = {
          PNR: flightBookData.Response.Response.PNR,
          BookingId: flightBookData.Response.Response.BookingId,
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

        const res = await fetch(
          "https://us-central1-trav-biz.cloudfunctions.net/generateFlightTicket",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              html: resData,
              outputFileName: "custom.pdf", // Optional filename
            }),
          }
        );
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Ticket.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTicketLoader(false);
      } catch (error) {
        console.log("Error while generating flight ticket", error);
      }
    } else if (type === "hotel") {
      const bookingData = await getBookingData(id);
      const htmlData = {
        travDetails: bookingData.hotelTicketData.travDetails,
        hotelName: bookingData.hotelTicketData.hotelName,
        hotelAddress: bookingData.hotelTicketData.hotelAddress,
        checkInDate: bookingData.hotelTicketData.checkInDate,
        checkOutDate: bookingData.hotelTicketData.checkOutDate,
        roomType: bookingData.hotelTicketData.roomType,
        noOfRooms: bookingData.hotelTicketData.noOfRooms,
        noOfAdults: bookingData.hotelTicketData.noOfAdults,
        Inclusions: bookingData.hotelTicketData.Inclusions,
        BookingId: bookingId,
      };
      console.log(htmlData);
      debugger;
      try {
        const res = await fetch(
          "https://us-central1-trav-biz.cloudfunctions.net/generateEmailHotelTicketVoucher",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              htmlData,
              outputFileName: "Hotel.pdf", // Optional filename
            }),
          }
        );
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "HotelVoucher.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTicketLoader(false);
      } catch (error) {
        setTicketLoader(false);
      }
    } else {
      try {
        const response = await fetch(urlfile);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "otherBook.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading the file:", error);
      }
      setTicketLoader(false);
    }
  };
  const downloadInvoice = async (
    type,
    data,
    id,
    userId,
    booktype,
    threadId,
    overallData
  ) => {
    try {
      setInvoiceLoader(true);
      const userDetailRef = await db.collection("Accounts").doc(userId).get();
      const userDetails = await userDetailRef.data();
      const companyDetailRef = await db
        .collection("companies")
        .doc(userDetails.billingAccount)
        .get();
      const companyDetails = await companyDetailRef.data();
      const invoiceNumber = await getInvoiceNumber(
        userId,
        id,
        userDetails.billingAccount,
        booktype
      );
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const financialYear = month >= 4 ? year : year - 1;
      var yrString = `${financialYear % 100}-${(financialYear % 100) + 1}`;
      var options = { day: "numeric", month: "short", year: "numeric" };
      var formattedDate = today.toLocaleDateString("en-US", options);
      var finalString = `${companyDetails?.billingInvoiceId}/${yrString}/${invoiceNumber.invoiceNumber}`;
      let flightBookData;
      if (booktype === "flight") {
        const bookingData = await getBookingData(threadId);
        console.log(bookingData);
        if (type === "onward") {
          flightBookData = bookingData.onwardTicketResponce;
        } else if (type === "return") {
          flightBookData = bookingData.returnTicketResponce;
        } else if (type === "oneway" || type === "international") {
          flightBookData = bookingData.ticketResponce;
        }
        console.log(flightBookData);
        try {
          const priceDetails = {
            price: overallData.price,
            finalTotalPrice: overallData.finalTotalPrice,
            serviceCharge: overallData.serviceCharge,
            gst: overallData.gst,
            createdAt: overallData.createdAt,
          };
          const pdfData = {
            flightData: flightBookData.Response.Response.FlightItinerary,
            bookingId: id,
            finalString: finalString,
            type: booktype,
            companyDetails: companyDetails,
            userData: userDetails,
            priceDetails: priceDetails,
          };
          const res = await fetch(
            "https://us-central1-trav-biz.cloudfunctions.net/generateInvoicePdf",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(pdfData),
            }
          );
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Invoice${finalString}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setInvoiceLoader(false);
        } catch (error) {
          setInvoiceLoader(false);
          console.log(error);
        }
      } else if (booktype === "hotel") {
        const bookingData = await getBookingData(threadId);
        const priceDetails = {
          price: overallData.price,
          finalTotalPrice: overallData.finalTotalPrice,
          serviceCharge: overallData.serviceCharge,
          gst: overallData.gst,
        };
        const pdfData = {
          hotelTicketData: bookingData.hotelTicketData,
          bookingId: id,
          finalString: finalString,
          type: booktype,
          companyDetails: companyDetails,
          userData: userDetails,
          priceDetails: priceDetails,
          createdAt: overallData.createdAt,
        };
        const res = await fetch(
          "https://us-central1-trav-biz.cloudfunctions.net/generateInvoicePdf",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pdfData),
          }
        );
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Hotel.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setInvoiceLoader(false);
      } else if (booktype === "other") {
        const priceDetails = {
          price: overallData.price,
          finalTotalPrice: overallData.finalTotalPrice,
          serviceCharge: overallData.serviceCharge,
          gst: overallData.gst,
          createdAt: overallData.createdAt,
        };
        const pdfData = {
          overallData: overallData,
          finalString: finalString,
          bookingId: id,
          type: booktype,
          companyDetails: companyDetails,
          userData: userDetails,
          bookingData: overallData,
          priceDetails: priceDetails,
        };
        const res = await fetch(
          // https://us-central1-trav-biz.cloudfunctions.net/generateInvoicePdf
          "https://us-central1-trav-biz.cloudfunctions.net/generateInvoicePdf",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pdfData),
          }
        );
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "OtherInvoice.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setInvoiceLoader(false);
      }
    } catch (error) {
      setInvoiceLoader(false);
      alert("Error while generating invoice", error);
    }
  };
  return (
    <>
      <Popup
        condition={detailsPopup}
        close={() => {
          setDetailsPopup(false);
        }}
      >
        {detailsPopup ? <FlightDetails flightData={flightData} /> : null}
      </Popup>
      {invoiceLoader && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-100 h-[100%]">
          <WindmillSpinner color="black" />
        </div>
      )}
      {ticketLoader && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-100 h-[100%]">
          <WindmillSpinner color="black" />
        </div>
      )}
      <div className="flex h-screen bg-gray-50">
        {userPage ? null : <SideNav />}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <ClipLoader size={40} color="#3B82F6" />
            </div>
          ) : (
            <div className="p-6 h-full flex flex-col">
              <div className="flex gap-2">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
                </div>
                <div className="flex  gap-4 items-center mb-4 flex-1">
                  <input
                    type="text"
                    placeholder="Enter Email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px",
                      // marginBottom: "10px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <span>Or</span>
                  <input
                    type="text"
                    placeholder="Enter Booking ID"
                    value={searchBookingId}
                    onChange={(e) => setSearchBookingId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px",
                      // marginBottom: "10px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    onClick={fetchBookings}
                    style={{
                      width: "60%",
                      padding: "7px",
                      backgroundColor: "#007BFF",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                    className="rounded-md"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-scroll flex-1">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider text-center">
                        <th className="px-2 py-4 font-semibold text-center break-words min-w-[150px]">
                          Booked Date
                        </th>
                        <th className="px-2 py-4 font-semibold text-center">
                          Type
                        </th>
                        <th className="px-2 py-4 font-semibold text-center">
                          Channel
                        </th>
                        <th className="px-2 py-4 font-semibold text-center">
                          Price
                        </th>
                        <th className="px-2 py-4 font-semibold text-center">
                          Email
                        </th>
                        <th className="px-2 py-4 font-semibold text-center">
                          Booking ID
                        </th>
                        <th className="px-2 py-4 font-semibold text-center">
                          Ticket
                        </th>
                        <th className="px-2 py-4 font-semibold text-center">
                          Company Name
                        </th>
                        <th className="px-2 py-4 font-semibold text-center">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No bookings found
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking) => (
                          <tr
                            key={booking.bookingId}
                            className="hover:bg-blue-50 transition-colors cursor-pointer max-w-[200px] text-center"
                          >
                            <td className="px-2 py-4 text-sm text-gray-800 truncate max-w-[200px]">
                              {new Date(booking.createdAt).toLocaleString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </td>
                            <td className="px-2 py-4 text-sm text-gray-800">
                              {booking?.type || "—"}
                            </td>
                            <td className="px-2 py-4 text-sm text-gray-800">
                              {booking?.bookingType || "—"}
                            </td>
                            <td className="px-2 py-4 text-sm text-gray-800">
                              {Math.round(booking?.finalTotalPrice)
                                ? `₹${Math.round(booking.finalTotalPrice)}`
                                : "—"}
                            </td>
                            <td className="px-2 py-4 text-sm text-gray-800">
                              {booking?.email || "—"}
                            </td>
                            <td className="px-2 py-4 text-sm font-medium text-gray-900">
                              {booking?.bookingId || "—"}
                            </td>
                            <th
                              className="px-2 py-4 font-semibold text-center flex items-center justify-center gap-1"
                              onClick={() =>
                                downloadTicket(
                                  booking?.type,
                                  booking.threadId,
                                  booking?.flightType,
                                  booking?.bookingId,
                                  booking?.fileUrl
                                )
                              }
                            >
                              <FaDownload size={"14px"} />
                            </th>
                            <th
                              className="px-2 py-4 font-semibold text-center"
                              // onClick={async () => {
                              //   const bookingData = await getBookingData(
                              //     booking.threadId
                              //   );
                              //   setFlightData(bookingData);
                              //   setDetailsPopup(true);
                              // }}
                            >
                              {booking?.companyName || "—"}
                            </th>
                            <th className="px-2 py-4 font-semibold text-center flex items-center justify-center gap-1">
                              <FaDownload
                                size={"14px"}
                                onClick={async () => {
                                  const bookingData = await getBookingData(
                                    booking.threadId
                                  );

                                  await downloadInvoice(
                                    booking?.flightType,
                                    bookingData,
                                    booking.bookingId,
                                    booking.user,
                                    booking.type,
                                    booking.threadId,
                                    booking
                                  );
                                }}
                              />
                            </th>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                {!searchBookingId && (
                  <Pagination
                    count={hasMore ? page + 1 : page}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    className="bg-white p-2 rounded-md shadow-sm"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmailandManual;
