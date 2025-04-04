import React, { useContext, useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../MyProvider";
import { Pagination } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { FaDownload } from "react-icons/fa";
import FlightDetails from "../../Admin/EmailandManual/FlightDetails";
import Popup from "../../Popup";
import MyContext from "../../Context";

const BookedTrips = ({ adminPage, userId }) => {
  const { actions, userAccountDetails } = useContext(MyContext);
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
  useEffect(() => {
    fetchBookings();
  }, [page]);

  const fetchBookings = async () => {
    try {
      const user = adminPage ? userId : userAccountDetails.userid;
      setLoading(true);
      let bookingQuery;
      if (page === 1) {
        // First page query with userId filter
        bookingQuery = query(
          collection(db, "bookingId"),
          where("user", "==", user), // Add userId filter here
          orderBy("createdAt", "desc"),
          limit(limitPerPage)
        );
      } else {
        // Paginated query with userId filter
        bookingQuery = query(
          collection(db, "bookingId"),
          where("user", "==", user), // Add userId filter here
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(limitPerPage)
        );
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
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
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
        console.log(bookingData);
        // setFlightData(bookingData.ticketResponce);
        return bookingData;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const downloadTicket = async (type, id) => {
    if (type === "flight") {
      const bookingData = await getBookingData(id);
      try {
        setTicketLoader(true);
        const data = {
          PNR: bookingData.ticketResponce.Response.Response.PNR,
          BookingId: bookingData.ticketResponce.Response.Response.BookingId,
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
        a.download = "generated.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTicketLoader(false);
      } catch (error) {
        console.log("Error while generating flight ticket", error);
      }
    }
  };
  const downloadInvoice = async () => {
    console.log("invoice clicked");
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
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <ClipLoader size={40} color="#3B82F6" />
            </div>
          ) : (
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 text-center">
                  Bookings
                </h1>
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
                          Booking Through
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
                          Tickets
                        </th>
                        <th className="px-2 py-4 font-semibold text-center">
                          Details
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
                              {booking?.price ? `₹${booking.price}` : "—"}
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
                                downloadTicket(booking?.type, booking.threadId)
                              }
                            >
                              <FaDownload size={"14px"} />
                            </th>
                            <th
                              className="px-2 py-4 font-semibold text-center"
                              onClick={async () => {
                                const bookingData = await getBookingData(
                                  booking.threadId
                                );
                                setFlightData(bookingData.ticketResponce);
                                setDetailsPopup(true);
                              }}
                            >
                              Details
                            </th>
                            <th
                              className="px-2 py-4 font-semibold text-center flex items-center justify-center gap-1"
                              onClick={downloadInvoice}
                            >
                              <FaDownload size={"14px"} />
                            </th>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Pagination
                  count={hasMore ? page + 1 : page}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  className="bg-white p-2 rounded-md shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookedTrips;
