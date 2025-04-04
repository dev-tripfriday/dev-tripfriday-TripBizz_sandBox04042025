import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyProvider from "./Components/MyProvider";
import MyContext from "./Components/Context";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./Components/ProtectedRoute/AdminRoute";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

const Home = lazy(() => import("./Components/Home/Home"));
const Privacy = lazy(() => import("./Components/Home/Privacy"));
const TermsAndConditions = lazy(() =>
  import("./Components/Home/TermsAndConditions")
);
const CancellationPolicy = lazy(() =>
  import("./Components/Home/CancellationPolicy")
);
const Downloads = lazy(() => import("./Components/Downloads/Downloads"));
const FlightSearch = lazy(() =>
  import("./Components/Flights/FlightSearch/FlightSearch")
);
const FlightSeats = lazy(() => import("./Components/flightSeats/FlightSeats"));
const UnProtectedPayment = lazy(() =>
  import("./Components/UnprotectedPayment/UnprotectedPayment")
);
const BookedTrips = lazy(() =>
  import("./Components/Trips/MyTrips/BookedTrips")
);
const TripDetails = lazy(() =>
  import("./Components/Trips/TripDetails/TripDetails")
);
const ChangePassword = lazy(() =>
  import("./Components/User/ChangePassword/ChangePassword")
);
const Profile = lazy(() => import("./Components/User/Profile/Profile"));
const Role = lazy(() => import("./Components/User/Role/Role"));
const AllRequests = lazy(() => import("./Components/User/Role/AllRequests"));
const Wallet = lazy(() => import("./Components/Wallet/Wallet"));
const AdminPage = lazy(() => import("./Components/Admin/AdminPage/AdminPage"));
const AdminDetails = lazy(() =>
  import("./Components/Admin/AdminDetails/AdminDetails")
);
const FlightSetting = lazy(() =>
  import("./Components/Admin/FlightSettings/FlightSetting")
);
const HotelSetting = lazy(() =>
  import("./Components/Admin/HotelSettings/HotelSetting")
);
const Users = lazy(() => import("./Components/Admin/Users/Users"));
const CommissionSetting = lazy(() =>
  import("./Components/Admin/CommissionSetting/CommissionSetting")
);
const Report = lazy(() => import("./Components/Admin/Report/Report"));
const BillingAccountHome = lazy(() =>
  import(
    "./Components/Admin/billingAccount/billingAccountHome/BillingAccountHome"
  )
);
const EachCompanyBillingAccount = lazy(() =>
  import(
    "./Components/Admin/billingAccount/eachCompany/EachCompanyBillingAccount "
  )
);
const AllBookings = lazy(() =>
  import("./Components/Admin/AdminPage/AllBookings")
);
const UserProfile = lazy(() =>
  import("./Components/Admin/UserProfile/UserProfile")
);
const UserTrips = lazy(() => import("./Components/Admin/UserTrips/UserTrips"));
const Logs = lazy(() => import("./Components/Admin/AdminLogs/Logs"));
const LogMessages = lazy(() =>
  import("./Components/Admin/AdminLogs/LogMessages")
);
const EmailandManual = lazy(() =>
  import("./Components/Admin/EmailandManual/EmailandManual")
);
const AdminSearchFlight = lazy(() =>
  import("./Components/Admin/AddFromAdmin/AdminSearchFlight")
);
const AdminBusSearch = lazy(() =>
  import("./Components/Admin/AddBusAdmin/AdminBusSearch")
);
const AdminHotelSearch = lazy(() =>
  import("./Components/Admin/AddHotelAdmin/AdminHotelSearch")
);

function App() {
  return (
    <MyProvider>
      <Router>
        <MyContext.Consumer>
          {({ actions }) => (
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/cancellation" element={<CancellationPolicy />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/:threadId/:flightId" element={<FlightSeats />} />
                <Route
                  path="/checkout/:userId"
                  element={<UnProtectedPayment />}
                />
                <Route
                  path="/home"
                  element={<ProtectedRoute element={<FlightSearch />} />}
                />
                <Route
                  path="/home/flights"
                  element={
                    <ProtectedRoute element={<FlightSearch tab="flights" />} />
                  }
                />
                <Route
                  path="/home/hotels"
                  element={
                    <ProtectedRoute element={<FlightSearch tab="hotels" />} />
                  }
                />
                <Route
                  path="/home/cabs"
                  element={
                    <ProtectedRoute element={<FlightSearch tab="cabs" />} />
                  }
                />
                <Route
                  path="/home/bus"
                  element={
                    <ProtectedRoute element={<FlightSearch tab="bus" />} />
                  }
                />
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute element={<FlightSearch tab="flights" />} />
                  }
                />
                {/* <Route
                  path="/signup"
                  element={
                    <ProtectedRoute
                      element={<FlightSearch tab="flights" />}
                      signUp={true}
                    />
                  }
                /> */}
                {/* <Route
                  path="/trips"
                  element={<ProtectedRoute element={<MyTrips />} />}
                /> */}
                <Route
                  path="/trips"
                  element={<ProtectedRoute element={<BookedTrips />} />}
                />
                <Route
                  path="/trips/:id"
                  element={<ProtectedRoute element={<TripDetails />} />}
                />
                <Route
                  path="/changepassword"
                  element={<ProtectedRoute element={<ChangePassword />} />}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute element={<Profile />} />}
                />
                <Route
                  path="/roles"
                  element={<ProtectedRoute element={<Role />} />}
                />
                <Route
                  path="/allrequests"
                  element={<ProtectedRoute element={<AllRequests />} />}
                />
                <Route
                  path="/wallet"
                  element={<ProtectedRoute element={<Wallet />} />}
                />
                <Route
                  path="/admin"
                  element={<AdminRoute element={<AdminPage />} />}
                />
                <Route
                  path="/admin/:id"
                  element={<AdminRoute element={<AdminDetails />} />}
                />
                <Route
                  path="/flightsetting"
                  element={<AdminRoute element={<FlightSetting />} />}
                />
                <Route
                  path="/hotelsetting"
                  element={<AdminRoute element={<HotelSetting />} />}
                />
                <Route
                  path="/commissionsetting"
                  element={<AdminRoute element={<CommissionSetting />} />}
                />
                <Route
                  path="/report"
                  element={<AdminRoute element={<Report />} />}
                />
                <Route
                  path="/billing"
                  element={<AdminRoute element={<BillingAccountHome />} />}
                />
                <Route
                  path="/billing/eachCompany/:name"
                  element={
                    <AdminRoute element={<EachCompanyBillingAccount />} />
                  }
                />
                <Route
                  path="/users"
                  element={<AdminRoute element={<Users />} />}
                />
                <Route
                  path="/allbookings"
                  element={<AdminRoute element={<AllBookings />} />}
                />
                <Route
                  path="/users/:id"
                  element={<AdminRoute element={<UserProfile />} />}
                />
                <Route
                  path="/users/:id/logs"
                  element={<AdminRoute element={<Logs />} />}
                />
                <Route
                  path="/users/:id/logs/logMessages/:docId"
                  element={<AdminRoute element={<LogMessages />} />}
                />
                <Route
                  path="/users/:userId/trips/:tripId"
                  element={<AdminRoute element={<UserTrips />} />}
                />
                <Route
                  path="/adminSearchFlight/:userId/trips/:tripId"
                  element={<AdminRoute element={<AdminSearchFlight />} />}
                />
                <Route
                  path="/adminSearchBus/:userFromAdmin/trips/:tripFromAdmin"
                  element={<AdminRoute element={<AdminBusSearch />} />}
                />
                <Route
                  path="/adminSearchHotel/:userFromAdmin/trips/:tripFromAdmin"
                  element={<AdminRoute element={<AdminHotelSearch />} />}
                />
                <Route
                  path="/bookings"
                  element={<AdminRoute element={<EmailandManual />} />}
                />
              </Routes>
            </Suspense>
          )}
        </MyContext.Consumer>
      </Router>
    </MyProvider>
  );
}

export default App;
