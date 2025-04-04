import React, { Component } from "react";
import MyContext from "./Context";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import axios from "axios";
import $, { data } from "jquery";
import { seatTypeJson } from "./Flights/SeatType";
import Papa from "papaparse";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  deleteField,
  getDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Fuse from "fuse.js";
import convert from "xml-js";
import { format } from "date-fns";
const cabinclassMap = {
  1: "Any cabin class",
  2: "Economy",
  3: "Premium Economy",
  4: "Business",
  5: "Premium Business class",
  6: "First",
};

const seatTypeObj = {
  0: "Not set",
  1: "Window",
  2: "Aisle",
  3: "Middle",
  4: "WindowRecline",
  5: "WindowWing",
  6: "WindowExitRow",
  7: "WindowReclineWing",
  8: "WindowReclineExitRow",
  9: "WindowWingExitRow",
  10: "AisleRecline",
  11: "AisleWing",
  12: "AisleExitRow",
  13: "AisleReclineWing",
  14: "AisleReclineExitRow",
  15: "AisleWingExitRow",
  16: "MiddleRecline",
  17: "MiddleWing",
  18: "MiddleExitRow",
  19: "MiddleReclineWing",
  20: "MiddleReclineExitRow",
  21: "MiddleWingExitRow",
  22: "WindowReclineWingExitRow",
  23: "AisleReclineWingExitRow",
  24: "MiddleReclineWingExitRow",
  25: "WindowBulkhead",
  26: "WindowQuiet",
  27: "WindowBulkheadQuiet",
  28: "MiddleBulkhead",
  29: "MiddleQuiet",
  30: "MiddleBulkheadQuiet",
  31: "AisleBulkhead",
  32: "AisleQuiet",
  33: "AisleBulkheadQuiet",
  34: "CentreAisle",
  35: "CentreMiddle",
  36: "CentreAisleBulkHead",
  37: "CentreAisleQuiet",
  38: "CentreAisleBulkHeadQuiet",
  39: "CentreMiddleBulkHead",
  40: "CentreMiddleQuiet",
  41: "CentreMiddleBulkHeadQuiet",
  42: "WindowBulkHeadWing",
  43: "WindowBulkHeadExitRow",
  44: "MiddleBulkHeadWing",
  45: "MiddleBulkHeadExitRow",
  46: "AisleBulkHeadWing",
  47: "AisleBulkHeadExitRow",
  48: "NoSeatAtThisLocation",
  49: "WindowAisle",
  50: "NoSeatRow",
  51: "NoSeatRowExit",
  52: "NoSeatRowWing",
  53: "NoSeatRowWingExit",
  54: "WindowAisleRecline",
  55: "WindowAisleWing",
  56: "WindowAisleExitRow",
  57: "WindowAisleReclineWing",
  58: "WindowAisleReclineExitRow",
  59: "WindowAisleWingExitRow",
  60: "WindowAisleBulkhead",
  61: "WindowAisleBulkheadWing",
};

const firebaseConfig = {
  apiKey: "AIzaSyCO0L6F5WZbtH7Um6sJQh3EXeU4yXPWdA8",
  authDomain: "tripbizz-sandbox.firebaseapp.com",
  projectId: "tripbizz-sandbox",
  storageBucket: "tripbizz-sandbox.appspot.com",
  messagingSenderId: "197605633859",
  appId: "1:197605633859:web:0bd44687729bd9edd089f6",
  measurementId: "G-VBBVE79Z1K",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
// firebase.initializeApp(firebaseConfig);
// const firebase = loadDb();
export const db = firebase.firestore();
export const auth = getAuth(firebase.initializeApp(firebaseConfig));
const storage = getStorage(firebase.initializeApp(firebaseConfig));
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const postUserData = async (
  firstName,
  lastName,
  email,
  mobileNumber,
  countryCode,
  GSTNo,
  PANNo,
  billingAccount,
  companyName,
  companyAddress,
  balance,
  approvalType,
  gender,
  companyLocation,
  companyId,
  uid,
  managerId,
  accountType
) => {
  var AccountsCollectionRef = doc(db, "Accounts", uid);
  try {
    await setDoc(AccountsCollectionRef, {
      firstName: firstName,
      email: email,
      lastName: lastName,
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      GSTNo: GSTNo,
      PANNo: PANNo,
      billingAccount: billingAccount,
      companyName: companyName,
      companyAddress: companyAddress,
      balance: 0,
      approvalType: approvalType,
      gender: gender,
      companyLocation: companyLocation,
      companyId: companyId,
      userid: uid,
      trips: [],
      role: "user",
      teamMembers: [],
      manager: {
        status: "Approved",
        userId: managerId,
      },
      notifications: [],
      accountType: accountType,
    });
  } catch (error) {
    console.error(error);
  }
};

var dateObject = new Date();
var options = {
  month: "short",
  day: "numeric",
};
var newTripDateString = dateObject.toLocaleString("en-US", options);
var newTripCompleteString = "newTrip_" + newTripDateString;
let abortAirportController;
class MyProvider extends Component {
  state = {
    userLoginStatus: {
      loggedIn: false,
      isLoading: true,
      status: "Authenticating",
      role: "user",
    },
    hotelInfoRes: false,
    hotelSessionExpired: false,
    hotelSessionStarted: false,
    hotelResList: [],
    cityHotelRes: [],
    busResList: [],
    internationalFlights: false,
    flightResList: [],
    flightSessionStarted: false,
    flightSessionExpired: false,
    airportOriginData: [],
    airportOriginLoading: false,
    airportDestData: [],
    airportDestLoading: false,
    busOriginData: [],
    busOriginLoading: false,
    busDestData: [],
    busDestLoading: false,
    flightResJType: 0,
    users: [],
    trip: {
      flights: [],
      hotels: [],
      bus: [],
      cabs: [],
      otherBookings: [],
      date: new Date(),
      name: "",
      status: "",
    },
    tripData: {
      id: null,
      data: null,
      hotels: null,
      flights: null,
    },
    docId: null,
    role: "user",
    selectedTripId: null,
    airlineName: "",
    originStartTime: null,
    originEndTime: null,
    destStartTime: null,
    intOriginStartTime1: null,
    intOriginEndTime1: null,
    intOriginStartTime2: null,
    intOriginEndTime2: null,
    intDestStartTime1: null,
    intDestEndTime1: null,
    intDestStartTime2: null,
    intDestEndTime2: null,
    downloadVisible: false,
    intStopPts1: null,
    intStopPts2: null,
    destEndTime: null,
    stopPts: null,
    byDuration: false,
    byCost: true,
    hotelRating: null,
    hotelPriceStart: null,
    hotelPriceEnd: null,
    hotelSearchText: null,
    loginError: false,
    signupError: null,
    signUpLoader: false,
    totalTrips: [],
    changePasswordError: "",
    searchingCabs: false,
    cabErrorMessage: null,
    cabResList: [],
    userTripStatus: {
      userTrips: [],
      tripLoading: true,
    },
    adminDetails: {},
    adminTripDetails: {},
    isLogging: false,
    isLoading: false,
    isDownloadReady: false,
    userId: null,
    tripsLoading: true,
    selectedTrip: null,
    emailNotFound: false,
    offset: null,
    approveLoading: true,
    adminUserLoading: true,
    submittedTrips: [],
    cabSearchRes: [],
    adminUserId: null,
    cabNights: 0,
    busFuse: null,
    mergePdfLoading: false,
    NoofBusPassengers: 1,
    BusOperatorName: "",
    isInternationalFlight: "",
    isAllfieldsThere: false,
    busDuration: false,
    busCost: true,
    resetBusDetails: [],
    busFilterReset: [],
    managerRequestLoading: false,
    adminRequestIds: [],
    busService: null,
    GSTpercent: null,
    minimumServiceCharge: null,
    internationalFlightService: null,
    internationalHotelService: null,
    selectedSeats: [],
    hotelCountryCode: null,
    recheckError: false,
    recheckLoad: false,
    adminUid: "",
    flightSearchTime: "",
    hotelSearchTime: "",
    busSearchTime: "",
    adminsLoader: false,
    actions: {
      delay: (time) =>
        new Promise((resolve, reject) => setTimeout(resolve, time)),
      isInternational: (results) => {
        if (results.length > 1) {
          console.log(results, results.length);
          return false;
        }
        return true;
      },

      setAdminrequestIds: (value) => {
        this.setState({ adminRequestIds: value });
      },
      convertSeatTypeJson: () => {
        var seatType = {};
        seatTypeJson.forEach((type, t) => {
          seatType[Number(type.Number)] = type["Seat Type"];
        });
        console.log("Seat type", seatType);
      },
      toggle: (e, eleId) => {
        if (e) {
          e.preventDefault();
        }
        console.log("Just toggle is running!!", $(eleId));
        // $(eleId).css("display","none")
        if ($(eleId).hasClass("show")) {
          $(eleId).removeClass("show");
          $(eleId).stop(true, true).slideUp(350);
          return false;
        } else {
          $(eleId).toggleClass("show");
          $(eleId).stop(true, true).slideDown(350);
          // $(window).scrollTop($(eleId).offset().top - 120);
        }
      },
      toggleUp: (e, eleId, isUp) => {
        if (e) {
          e.preventDefault();
        }

        if (!isUp) {
          $(eleId).stop(true, true).slideDown(350);
        } else {
          $(eleId).stop(true, true).slideUp(350);
        }
      },
      setFlightResJType: (value) => {
        this.setState({
          flightResJType: value,
        });
      },
      convertTboDateFormat: (startDate) => {
        var month = Number(startDate.getMonth() + 1);
        var date = Number(startDate.getDate());
        return `${date < 10 ? "0" + String(date) : String(date)}/${
          month < 10 ? "0" + String(month) : String(month)
        }/${startDate.getFullYear()}`;
      },
      backToHotelSearchPage: () => {
        this.setState({
          hotelResList: [],
          hotelSearchResult: {},
          hotelTokenId: "",
          hotelSessionStarted: false,
          hotelSessionEnded: false,
        });
      },
      backToCabSearchPage: () => {
        this.setState({
          cabResList: [],
          searchingCabs: false,
        });
      },
      hotelSearch: async (query) => {
        //Fields needed:  city or hotel name, check-in, nights, check-out, nationality, rooms, adults, children, star-rating
        // await this.state.actions.getRecommondedHotelList();
        this.setState({
          hotelSearchTime: new Date(),
          hotelResList: [],
          hotelSearchQuery: query,
          searchingHotels: true,
          cityHotel: query.cityHotel,
          hotelSessionStarted: false,
          hotelSessionEnded: false,
          hotelSearchName: query.cityDestName,
          hotelSearchCheckIn: query.checkInDate,
          hotelSearchCheckOut: query.checkOutDate,
          hotelSearchAdults: query.hotelRoomArr.reduce(
            (acc, room, r) => acc + Number(room.adults),
            0
          ),
          hotelSearchChild: query.hotelRoomArr.reduce(
            (acc, room, r) => acc + Number(room.child),
            0
          ),
          hotelSearchNights: Number(query.hotelNights),
          hotelRoomArr: query.hotelRoomArr,
          hotelRooms: Number(query.hotelRooms),
        });

        let roomGuests = [];

        query.hotelRoomArr.forEach((room, r) => {
          roomGuests.push({
            NoOfAdults: Number(room.adults),
            NoOfChild: Number(room.child),
            ChildAge: room.childAge.map((child, c) => Number(child.age)),
          });
        });
        var request = {
          checkInDate: this.state.actions.convertTboDateFormat(
            query.checkInDate
          ),
          cityId: query.cityHotel,
          nights: query.hotelNights,
          countryCode: query.countryCode,
          noOfRooms: query.hotelRooms,
          roomGuests: [...roomGuests],
        };

        console.log("Hotel req", request);
        // const cityId = String(query.cityHotel);
        // var accCollectionRef = db
        //   .collection("hotelImages")
        //   .doc(cityId);
        // await accCollectionRef.set({
        //   hotelImageList: []
        // })

        var hotelStatic = await Promise.all([
          fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelSearchRes",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(request),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err)),
          this.state.actions.convertXmlToJson(request.cityId),
          //this.state.actions.convertXmlToJsonHotel({ cityId: "145710", hotelId: "00193836" })
          this.state.actions.getHotelImages(request.cityId),
        ]);

        console.log("Result", hotelStatic);

        var hotelRes = hotelStatic[0];
        var staticdata = hotelStatic[1];

        // var hotelRes = await fetch(
        //   "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelSearchRes",
        //   {
        //     method: "POST",
        //     // credentials: "include",
        //     headers: {
        //       "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(request)
        //   }
        // )
        //   .then((res) => res.json())
        //   .catch((err) => console.log(err));

        console.log("Hotel result", hotelRes);
        if (hotelRes?.error) {
          console.log("error");
          this.setState({
            hotelResList: [],
            hotelErrorMessage: hotelRes?.error,
            searchingHotels: false,
            hotelSessionStarted: true,
          });
        } else {
          this.setState({
            hotelResList: hotelRes.hotelResult?.HotelSearchResult?.HotelResults,
            hotelTraceId: hotelRes.hotelResult?.HotelSearchResult?.TraceId,
            hotelStaticData: staticdata,
            hotelTokenId: hotelRes.tokenId,
            searchingHotels: false,
            hotelSessionStarted: true,
          });
        }
        var hotelSessionTimeout = setTimeout(() => {
          this.setState(
            {
              hotelSessionStarted: false,
              hotelSessionExpired: true,
            },
            () => {
              console.log("Session expired");
            }
          );
        }, 840000);
        clearTimeout(hotelSessionTimeout);
      },
      setHotelErrorMessage: () => {
        this.setState({
          hotelErrorMessage: null,
        });
      },
      fetchHotelInfo: async (query) => {
        console.log(query.hotelName, "query.hotelSearchRes.HotelName");
        if (!this.state.hotelSessionExpired) {
          this.setState({
            hotelInfoRes: [],
            fetchingHotelInfo: true,
          });

          var hotelInfoReq = {
            traceId: this.state.hotelTraceId,
            tokenId: this.state.hotelTokenId,
            resultIndex: query.resultIndex,
            hotelCode: query.hotelCode,
            categoryId: query.categoryId ? query.categoryId : null,
          };

          console.log("Hotel info req", hotelInfoReq);

          var hotelInfoRes = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelInfoRes",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(hotelInfoReq),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));

          hotelInfoRes.hotelSearchRes = query.hotelSearchRes;

          console.log("Hotel info res", hotelInfoRes.roomResult);

          let roomTypes = this.state.hotelRoomArr.map((room, r) => {
            return {
              ...hotelInfoRes.roomResult?.GetHotelRoomResult
                ?.HotelRoomsDetails[0],

              roomTypeIndex: 0,
            };
          });
          var hotelImg =
            hotelInfoRes?.hotelInfo?.HotelInfoResult?.HotelDetails?.Images
              ?.length > 0
              ? hotelInfoRes?.hotelInfo?.HotelInfoResult?.HotelDetails
                  ?.Images[0]
              : "https://i.travelapi.com/hotels/35000000/34870000/34867700/34867648/89943464_z.jpg";
          // const hotelPrice = this.state.actions.calculateHotelFinalPrice([...roomTypes])
          // const calculatedServiceCharge =(hotelPrice * this.state.domesticHotel )/ 100;
          // const finalHotelServiceCharge =
          //   calculatedServiceCharge > 150 ? calculatedServiceCharge : 150;
          // const calculateGstFromService =
          //   finalHotelServiceCharge * (this.state.GSTpercent / 100);
          this.setState({
            hotelInfoRes,
            fetchingHotelInfo: false,
            bookingHotel: {
              ...hotelInfoRes,
              hotelCode: query.hotelSearchRes.HotelCode,
              hotelPrice: query.hotelSearchRes.Price.OfferedPriceRoundedOff
                ? query.hotelSearchRes.Price.OfferedPriceRoundedOff
                : query.hotelSearchRes.Price.PublishedPriceRoundedOff,
              hotelName: query.hotelName,
              selectedRoomType: [...roomTypes],
              hotelServiceCharge: this.state.actions.calculateHotelFinalPrice([
                ...roomTypes,
              ]).finalHotelServiceCharge,
              calculateGstFromService:
                this.state.actions.calculateHotelFinalPrice([...roomTypes])
                  .calculateGstFromService,
              hotelFinalPrice: this.state.actions.calculateHotelFinalPrice([
                ...roomTypes,
              ]).finalPrice,
              hotelTotalPrice:
                this.state.actions.calculateHotelFinalPrice([...roomTypes])
                  .finalPrice +
                this.state.actions.calculateHotelFinalPrice([...roomTypes])
                  .finalHotelServiceCharge +
                this.state.actions.calculateHotelFinalPrice([...roomTypes])
                  .calculateGstFromService,
              hotelSearchQuery: this.state.hotelSearchQuery,
              hotelImages: hotelImg,
            },
          });
        } else {
          this.setState({
            hotelSessionExpired: true,
            hotelSessionExpiredPopup: true,
          });
          console.log(
            "Hotel session has expired please make a search request again!!"
          );
        }
      },
      setHotelCountryCode: (code) => {
        this.setState({ hotelCountryCode: code });
      },
      calculateHotelFinalPrice: (selectedRoomType) => {
        console.log(this.state.domesticHotel);

        let finalPrice = 0;
        selectedRoomType.forEach((room, r) => {
          finalPrice += room.Price
            ? room.Price.OfferedPriceRoundedOff
              ? Number(room.Price.OfferedPriceRoundedOff)
              : Number(room.Price.PublishedPriceRoundedOff)
            : 0;
        });
        const calculatedServiceCharge =
          (finalPrice *
            (this.state.hotelCountryCode === "IN"
              ? this.state.domesticHotel
              : this.state.internationalHotelService)) /
          100;
        const finalHotelServiceCharge =
          calculatedServiceCharge > this.state.minimumServiceCharge
            ? calculatedServiceCharge
            : this.state.minimumServiceCharge;
        const calculateGstFromService =
          finalHotelServiceCharge * (this.state.GSTpercent / 100);
        return { finalPrice, finalHotelServiceCharge, calculateGstFromService };
      },
      inclusionToStr: (inclusions) => {
        var mealStr = "";

        inclusions.forEach((inc, i) => {
          mealStr += inc.toLowerCase().trim();
        });

        return mealStr;
      },
      checkIncludesDinner: (str) => {
        if (str.includes("gala")) {
          var splitStr = str.split("dinner");

          for (var i = 0; i < splitStr.length - 1; i++) {
            var galaSplit = splitStr[i].split("gala");
            var galaSplitNxt = splitStr[i + 1].split("gala");

            if (
              !(
                galaSplit[galaSplit.length - 1] === "" || galaSplitNxt[0] === ""
              )
            ) {
              return true;
            }
          }

          return false;
        } else {
          if (str.includes("dinner")) {
            return true;
          }
          return false;
        }
      },
      checkForTboMeals: (inclusions) => {
        var meals = this.state.actions.inclusionToStr(inclusions);

        var includedStr = "";
        var mealsStr = meals.replace(/\s/g, "").toLowerCase();
        var mealsArr = [false, false, false, false];

        if (
          mealsStr.includes("breakfast") ||
          mealsStr.includes("halfboard") ||
          mealsStr.includes("fullboard") ||
          mealsStr.includes("allmeals")
        ) {
          mealsArr[0] = true;
        }
        if (
          mealsStr.includes("lunch") ||
          mealsStr.includes("fullboard") ||
          mealsStr.includes("allmeals")
        ) {
          mealsArr[1] = true;
        }
        if (
          // (mealsStr.includes("dinner") ||
          this.state.actions.checkIncludesDinner(mealsStr) ||
          mealsStr.includes("halfboard") ||
          mealsStr.includes("fullboard") ||
          mealsStr.includes("allmeals")
        ) {
          mealsArr[2] = true;
        }

        if (mealsStr.trim().includes("breakfastfor1")) {
          mealsArr[3] = true;
          mealsArr[0] = false;
        }

        includedStr = this.state.actions.setMealType(mealsArr);

        return includedStr;
      },
      setMealType: (meals) => {
        //[true,undefined,true]
        var mealNames = {
          0: "Breakfast",
          1: "Lunch",
          2: "Dinner",
          3: "Breakfast for 1",
        };
        var mealText = "";

        meals = meals
          .map((meal, m) => {
            if (meal) {
              return mealNames[m];
            }
            return meal;
          })
          .filter((meal) => meal);
        //

        meals.forEach((meal, m) => {
          if (m === meals.length - 1 && meals.length > 1) {
            mealText += ` and ${meal}`;
          } else if (m === meals.length - 2 || meals.length === 1) {
            mealText += meal;
          } else {
            mealText += `${meal}, `;
          }
        });
        if (mealText === "") {
          mealText = "No meals";
        }
        return mealText;
      },
      validCancelDate: (date) => {
        var cancelDate = new Date(date);
        var currDate = new Date();
        if (cancelDate > currDate) {
          return true;
        }
        return false;
      },
      selectHotelRoomType: (room, selectedRoom, r) => {
        var bookingHotel = { ...this.state.bookingHotel };

        bookingHotel.selectedRoomType[selectedRoom] = {
          ...room,
          roomTypeIndex: r,
        };
        bookingHotel.hotelFinalPrice =
          this.state.actions.calculateHotelFinalPrice(
            bookingHotel.selectedRoomType
          ).finalPrice;
        bookingHotel.hotelTotalPrice =
          this.state.actions.calculateHotelFinalPrice(
            bookingHotel.selectedRoomType
          ).finalPrice +
          this.state.actions.calculateHotelFinalPrice(
            bookingHotel.selectedRoomType
          ).finalHotelServiceCharge +
          this.state.actions.calculateHotelFinalPrice(
            bookingHotel.selectedRoomType
          ).calculateGstFromService;
        // bookingHotel.hotelTotalPrice =
        //   this.state.actions.calculateHotelFinalPrice(
        //     bookingHotel.selectedRoomType
        //   ).finalPrice +
        //   (this.state.actions.calculateHotelFinalPrice(
        //     bookingHotel.selectedRoomType
        //   ).finalPrice *
        //     this.state.domesticHotel) /
        //     100;
        bookingHotel.hotelServiceCharge =
          this.state.actions.calculateHotelFinalPrice(
            bookingHotel.selectedRoomType
          ).finalHotelServiceCharge;
        bookingHotel.calculateGstFromService =
          this.state.actions.calculateHotelFinalPrice(
            bookingHotel.selectedRoomType
          ).calculateGstFromService;
        this.setState({
          bookingHotel,
        });
        console.log(bookingHotel, "bookingHotel");
      },
      flightSearch: async (query) => {
        this.setState({
          flightSearchTime: new Date(),
          flightResList: [],
          searchingFlights: true,
          flightSessionStarted: false,
          flightSessionExpired: false,
          flightAdults: query.adults,
          flightChild: query.child,
          flightInfant: query.infant,
          flightTravellers:
            Number(query.adults) + Number(query.child) + Number(query.infant),
        });

        var request = {
          adults: query.adults,
          child: query.child,
          infant: query.infant,
          directFlight: query.directFlight,
          oneStopFlight: query.oneStopFlight,
          journeyType: query.journeyType,
          preferredAirlines: null,
          sources: null,
        };

        var segments = [];
        var months = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
        ];

        if (query.journeyType === "2") {
          segments = [
            {
              Origin: query.originAirport,
              Destination: query.destAirport,
              FlightCabinClass: query.flightCabinClass,
              PreferredDepartureTime: `${new Date(
                query.outboundDate
              ).getFullYear()}-${
                months[new Date(query.outboundDate).getMonth()]
              }-${
                new Date(query.outboundDate).getDate() < 10
                  ? "0" + new Date(query.outboundDate).getDate()
                  : new Date(query.outboundDate).getDate()
              }T00:00:00`,
              PreferredArrivalTime: `${new Date(
                query.outboundDate
              ).getFullYear()}-${
                months[new Date(query.outboundDate).getMonth()]
              }-${
                new Date(query.outboundDate).getDate() < 10
                  ? "0" + new Date(query.outboundDate).getDate()
                  : new Date(query.outboundDate).getDate()
              }T00:00:00`,
            },
            {
              Origin: query.destAirport,
              Destination: query.originAirport,
              FlightCabinClass: query.flightCabinClass,
              PreferredDepartureTime: `${new Date(
                query.inboundDate
              ).getFullYear()}-${
                months[new Date(query.inboundDate).getMonth()]
              }-${
                new Date(query.inboundDate).getDate() < 10
                  ? "0" + new Date(query.inboundDate).getDate()
                  : new Date(query.inboundDate).getDate()
              }T00:00:00`,
              PreferredArrivalTime: `${new Date(
                query.inboundDate
              ).getFullYear()}-${
                months[new Date(query.inboundDate).getMonth()]
              }-${
                new Date(query.inboundDate).getDate() < 10
                  ? "0" + new Date(query.inboundDate).getDate()
                  : new Date(query.inboundDate).getDate()
              }T00:00:00`,
            },
          ];
        } else if (query.journeyType === "3") {
          segments = query.multiCities;
        } else {
          segments = [
            {
              Origin: query.originAirport,
              Destination: query.destAirport,
              FlightCabinClass: query.flightCabinClass,
              PreferredDepartureTime: `${new Date(
                query.outboundDate
              ).getFullYear()}-${
                months[new Date(query.outboundDate).getMonth()]
              }-${
                new Date(query.outboundDate).getDate() < 10
                  ? "0" + new Date(query.outboundDate).getDate()
                  : new Date(query.outboundDate).getDate()
              }T00:00:00`,
              PreferredArrivalTime: `${new Date(
                query.outboundDate
              ).getFullYear()}-${
                months[new Date(query.outboundDate).getMonth()]
              }-${
                new Date(query.outboundDate).getDate() < 10
                  ? "0" + new Date(query.outboundDate).getDate()
                  : new Date(query.outboundDate).getDate()
              }T00:00:00`,
            },
          ];
        }

        request.segments = segments;

        console.log("Search req", request);

        var flightRes = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightSearch",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));

        console.log(flightRes);

        var flightReqs = [];
        if (flightRes?.flightResult?.Response?.Results.length === 1) {
          console.log(request);
          flightReqs.push(request);
          this.setState({
            flightReq1: request,
          });
          this.setState({
            flightReq: flightReqs,
          });
        } else {
          var req1 = request;
          var req2 = request;
          var segments1 = request.segments[0];
          var segments2 = request.segments[1];
          req1.segments = [segments1];
          req2.segments = [segments2];
          var new1 = { ...req1, segments: [segments1] };
          var new2 = { ...req2, segments: [segments2] };
          new1.journeyType = "1";
          new2.journeyType = "1";
          flightReqs.push(new1, new2);
          this.setState({
            flightReq: flightReqs,
          });
        }
        if (flightRes.flightResult?.errorMessage) {
          this.setState({
            flightResult: {},
            flightResList: [],
            searchingFlights: false,
            flightSessionStarted: true,
            flightErrorMessage: flightRes.flightResult.errorMessage,
          });
        } else {
          this.state.actions.separateFlightsByType(
            flightRes.flightResult.Response.Results
          );
          this.setState({
            flightSearchToken: flightRes.tokenId,
            searchingFlights: false,
            flightSessionStarted: true,
            flightTraceId: flightRes.flightResult.Response.TraceId,
            flightResult: flightRes.flightResult.Response,
          });
        }

        var flightSessionTimeout = setTimeout(() => {
          this.setState(
            {
              flightSessionStarted: false,
              flightSessionExpired: true,
            },
            () => {
              console.log("Session expired");
            }
          );
        }, 840000);
        clearTimeout(flightSessionTimeout);
      },
      setFlightErrorMessage: () => {
        this.setState({
          flightErrorMessage: null,
        });
      },
      getTotalFares: (bookingFlight) => {
        var totalFareSum = 0;
        var totalSeatCharges = 0;
        var totalBaggagePrice = 0;
        var totalMealPrice = 0;
        var totalSeatPrice = 0;
        var totalService = 0;
        var totalGst = 0;
        var isEitherOrBothNotIn = false;
        bookingFlight.forEach((seg, s) => {
          isEitherOrBothNotIn =
            seg?.flightNew?.segments[0]?.originCountryCode !== "IN" ||
            seg?.flightNew?.segments[0]?.destCountryCode !== "IN";

          var segmentTotalFare = seg.totalFare ? Number(seg.totalFare) : 0;
          var segmentSeatCharges = seg.seatCharges
            ? Number(seg.seatCharges)
            : 0;
          var segmentBaggagePrice = 0;
          var segmentMealPrice = 0;
          var segmentSeatPrice = 0;

          if (Array.isArray(seg.selectedBaggage)) {
            seg.selectedBaggage.forEach((baggage) => {
              baggage.forEach((bag) => {
                segmentBaggagePrice += bag.price ? Number(bag.price) : 0;
              });
            });
          }

          if (Array.isArray(seg.selectedMeals)) {
            seg.selectedMeals.forEach((meals) => {
              meals.forEach((meal) => {
                segmentMealPrice += meal.price ? Number(meal.price) : 0;
              });
            });
          }

          if (Array.isArray(seg.selectedSeats)) {
            seg.selectedSeats.forEach((seat) => {
              segmentSeatPrice += seat.price ? Number(seat.price) : 0;
            });
          }

          var segmentTotalSum =
            Math.ceil(segmentTotalFare) +
            Math.ceil(segmentSeatCharges) +
            Math.ceil(segmentBaggagePrice) +
            Math.ceil(segmentMealPrice) +
            Math.ceil(segmentSeatPrice);

          // Calculate service charge based on base fare only
          const maximumService =
            (isEitherOrBothNotIn
              ? this.state.internationalFlight
              : this.state.domesticFlight) / 100;

          const fmax = segmentTotalFare * maximumService;
          var flightServiceCharge =
            segmentTotalFare === 0
              ? 0
              : Math.max(fmax, this.state.minimumServiceCharge);
          totalService += Math.ceil(flightServiceCharge);
          var gstOnServiceCharge =
            segmentTotalFare === 0
              ? 0
              : flightServiceCharge * (this.state.GSTpercent / 100);
          totalGst += Math.ceil(gstOnServiceCharge);
          var segmentFinalPrice =
            segmentTotalSum + flightServiceCharge + gstOnServiceCharge;

          bookingFlight[s].finalPrice = Math.ceil(segmentFinalPrice);
          bookingFlight[s].finalFlightServiceCharge =
            Math.ceil(flightServiceCharge);
          bookingFlight[s].gstInFinalserviceCharge =
            Math.ceil(gstOnServiceCharge);
          bookingFlight[s].totalBaggagePrice = Math.ceil(segmentBaggagePrice);
          bookingFlight[s].totalMealPrice = Math.ceil(segmentMealPrice);
          bookingFlight[s].totalSeatPrice = Math.ceil(segmentSeatPrice);
          totalFareSum += segmentTotalFare;
          totalSeatCharges += segmentSeatCharges;
          totalBaggagePrice += segmentBaggagePrice;
          totalMealPrice += segmentMealPrice;
          totalSeatPrice += segmentSeatPrice;
        });
        // Calculate overall service charge and GST based on total base fare

        var overallFinalPrice = Math.ceil(
          // overallTotalSum + overallServiceCharge + overallGST
          totalFareSum + totalGst + totalService
        );
        return {
          totalFareSum,
          totalSeatCharges,
          totalBaggagePrice,
          totalMealPrice,
          totalSeatPrice,
          finalPrice: overallFinalPrice,
        };
      },

      calculateTotalFlightFare: (bookingFlight, bookIndex) => {
        var totalFare = 0;

        totalFare += bookingFlight[bookIndex].flight?.Fare?.OfferedFare
          ? Math.ceil(bookingFlight[bookIndex].flight?.Fare?.OfferedFare)
          : Math.ceil(bookingFlight[bookIndex].flight?.Fare?.PublishedFare);

        bookingFlight[bookIndex].selectedBaggage.forEach((bgp, b) => {
          var x = 0;
          var x = 0;
          bgp.forEach((bag) => {
            x += bag.price ? Number(bag.price) : 0;
          });
          totalFare += x;
        });
        bookingFlight[bookIndex].selectedMeals.forEach((mp, b) => {
          var x = 0;
          mp.forEach((bag) => {
            x += bag.price ? Number(bag.price) : 0;
          });
          totalFare += x;
        });
        bookingFlight[bookIndex].seats.forEach((seatSeg, sg) => {
          seatSeg.forEach((seat, s) => {
            Object.values(seat).forEach((sp, b) => {
              totalFare += sp.Price ? sp.Price : 0;
            });
          });
        });
        return totalFare;
      },
      handleChangeFlightBook: async (
        e,
        type,
        bookIndex,
        segIndex,
        seat,
        seatSegIdx,
        rmSeat
      ) => {
        var bookingFlight = [...this.state.bookingFlight];

        if (type === "baggage") {
          if (e.target.value !== "No excess baggage") {
            bookingFlight[bookIndex].baggagePrice[segIndex] = Number(
              e.target.value.split("at")[1].split("Rs")[1].split("/-")[0].trim()
            );
            bookingFlight[bookIndex].baggageWeight[segIndex] = Number(
              e.target.value.split("at")[0].split("KG")[0].trim()
            );
          } else {
            bookingFlight[bookIndex].baggagePrice[segIndex] = 0;
            bookingFlight[bookIndex].baggageWeight[segIndex] = 0;
          }
        } else if (type === "meal") {
          if (e.target.value !== "No add-on meal") {
            bookingFlight[bookIndex].mealPrice[segIndex] = Number(
              e.target.value.split("->")[1].split("Rs")[1].split("/")[0].trim()
            );
            bookingFlight[bookIndex].mealDesc[segIndex] = e.target.value
              .split("->")[0]
              .trim();
          } else {
            bookingFlight[bookIndex].mealPrice[segIndex] = 0;
            bookingFlight[bookIndex].mealDesc[segIndex] = "";
          }
        } else if (type === "seats") {
          if (!bookingFlight[bookIndex].seats[segIndex]) {
            bookingFlight[bookIndex].seats[segIndex] = [];
          }
          if (!bookingFlight[bookIndex].seats[segIndex][seatSegIdx]) {
            bookingFlight[bookIndex].seats[segIndex][seatSegIdx] = {};
          }

          if (rmSeat) {
            delete bookingFlight[bookIndex].seats[segIndex][seatSegIdx][rmSeat];
          }

          if (seat) {
            bookingFlight[bookIndex].seats[segIndex][seatSegIdx][seat.Code] =
              seat;
          }

          var seatCharges = 0;

          bookingFlight[bookIndex].seats.forEach((seatSeg, sg) => {
            seatSeg.forEach((seat, s) => {
              Object.values(seat).forEach((sp, b) => {
                seatCharges += sp.Price ? sp.Price : 0;
              });
            });
          });
          bookingFlight[bookIndex].seatCharges = seatCharges;
        }

        bookingFlight[bookIndex].totalFare =
          this.state.actions.calculateTotalFlightFare(bookingFlight, bookIndex);

        this.setState({
          bookingFlight,
        });
      },
      handleMeal: async (
        e,
        type,
        bookIndex,
        segIndex,
        traveller,
        selectedBagIndex
      ) => {
        console.log(e, type, bookIndex, segIndex, traveller, selectedBagIndex);
        var bookingFlight = [...this.state.bookingFlight];
        if (type === "meal") {
          if (e.target.value !== "No add-on meal") {
            if (!bookingFlight[bookIndex].userSelectedMeal) {
              bookingFlight[bookIndex].userSelectedMeal = [];
            }
            bookingFlight[bookIndex].selectedMeals[segIndex][traveller].price =
              Number(
                e.target.value
                  .split("->")[1]
                  .split("Rs")[1]
                  .split("/")[0]
                  .trim()
              );
            bookingFlight[bookIndex].selectedMeals[segIndex][
              traveller
            ].mealDesc = e.target.value.split("->")[0].trim();
            bookingFlight[bookIndex].userSelectedMeal[traveller] =
              bookingFlight[bookIndex].mealData[0][selectedBagIndex];
          } else {
            bookingFlight[bookIndex].selectedMeals[segIndex][
              traveller
            ].price = 0;
            bookingFlight[bookIndex].selectedMeals[segIndex][
              traveller
            ].mealDesc = "";
            bookingFlight[bookIndex].userSelectedMeal[traveller] =
              bookingFlight[bookIndex].mealData[0][selectedBagIndex];
          }
        } else if (type === "baggage") {
          if (e.target.value !== "No excess baggage") {
            if (!bookingFlight[bookIndex].userSelectedBaggage) {
              bookingFlight[bookIndex].userSelectedBaggage = [];
            }

            bookingFlight[bookIndex].selectedBaggage[segIndex][
              traveller
            ].price = Number(
              e.target.value
                .split("at")[1]
                .split("Rs")[1]
                .split("/-")[0]
                .split(" ")[1]
                .trim()
            );
            bookingFlight[bookIndex].selectedBaggage[segIndex][
              traveller
            ].baggage = Number(
              e.target.value.split("at")[0].split("KG")[0].trim()
            );
            bookingFlight[bookIndex].selectedBaggage[segIndex][traveller].text =
              e.target.value
                .split("at")[1]
                .split("Rs")[1]
                .split("/-")[0]
                .split(" ")
                .slice(2)
                .join(" ");
            bookingFlight[bookIndex].userSelectedBaggage[traveller] =
              bookingFlight[bookIndex].baggageData[0][selectedBagIndex];
          } else {
            bookingFlight[bookIndex].selectedBaggage[segIndex][
              traveller
            ].price = 0;
            bookingFlight[bookIndex].selectedBaggage[segIndex][
              traveller
            ].baggage = 0;
            bookingFlight[bookIndex].selectedBaggage[segIndex][traveller].text =
              "";
            bookingFlight[bookIndex].userSelectedBaggage[traveller] =
              bookingFlight[bookIndex].baggageData[0][selectedBagIndex];
          }
        }
        bookingFlight[bookIndex].totalFare =
          this.state.actions.calculateTotalFlightFare(bookingFlight, bookIndex);
        this.setState({
          bookingFlight,
        });
      },
      setFlightBookPage: (value) => {
        this.setState({
          flightBookPage: value,
        });
      },
      setBookingFlight: (value) => {
        this.setState({
          bookingFlight: [...value],
        });
      },
      editFlightSearch: () => {
        this.setState({
          flightResult: {},
          flightResList: [],
        });
      },
      diffMinutes: (dateStr1, dateStr2) => {
        var date1 = new Date(dateStr1);
        var date2 = new Date(dateStr2);

        var diff = date2 - date1;

        var diffMinutes = Math.floor(diff / 1000 / 60);

        return diffMinutes;
      },
      diffDays: (dateStr1, dateStr2) => {
        var date1 = new Date(
          `${
            dateStr1.getMonth() + 1
          }/${dateStr1.getDate()}/${dateStr1.getFullYear()}`
        );
        var date2 = new Date(
          `${
            dateStr2.getMonth() + 1
          }/${dateStr2.getDate()}/${dateStr2.getFullYear()}`
        );

        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      },
      isExitRow: (row) => {
        var firstSeat = row.Seats[0];
        var i = 1;
        while (firstSeat.noSeat && i < row.Seats.length) {
          firstSeat = row.Seats[i];
          i++;
        }
        if (
          !firstSeat.noSeat &&
          seatTypeObj[firstSeat.SeatType].includes("ExitRow")
        ) {
          return true;
        }
        return false;
      },
      modifyFlightObject: (flight) => {
        var totalDuration = 0;
        var totalDur = 0;
        var segments = flight?.Segments?.map((segment, sg) => {
          var seg1 = segment[0];
          var segLast = segment[segment.length - 1];

          var originCityName = seg1.Origin.Airport.CityName;
          var originAirportCode = seg1.Origin.Airport.AirportCode;
          var originAirportName = seg1.Origin.Airport.AirportName;
          var originTerminal = seg1.Origin.Airport.Terminal;
          var originCountryCode = segLast.Origin.Airport.CountryCode;

          var destCityName = segLast.Destination.Airport.CityName;
          var destAirportCode = segLast.Destination.Airport.AirportCode;
          var destAirportName = segLast.Destination.Airport.AirportName;
          var destTerminal = segLast.Destination.Airport.Terminal;
          var destCountryCode = segLast.Destination.Airport.CountryCode;

          var depTimeDate = new Date(seg1.Origin.DepTime);
          var arrTimeDate = new Date(segLast.Destination.ArrTime);

          var depTimeArr = seg1.Origin.DepTime.split("T")[1].split(":");
          var arrTimeArr = segLast.Destination.ArrTime.split("T")[1].split(":");
          var depTime = `${depTimeArr[0]}:${depTimeArr[1]}`;
          var arrTime = `${arrTimeArr[0]}:${arrTimeArr[1]}`;

          var durationSum = 0;

          var stopOverPts = [];
          var charNum = 0;

          var finalDur = 0;

          var segRoutes = [];

          var dur = 0;
          var flightCodes = [];
          segment.forEach((seg, s) => {
            var flightCode = `${seg.Airline.AirlineCode} - ${seg.Airline.FlightNumber} ${seg.Airline.FareClass}`;
            flightCodes[s] = flightCode;
            var flightDuration =
              seg.Duration !== 0
                ? seg.Duration
                : seg.AccumulatedDuration
                ? seg.AccumulatedDuration
                : 0;

            dur += flightDuration + seg.GroundTime;

            durationSum += flightDuration;
            if (s === segment.length - 1) {
              finalDur += seg.AccumulatedDuration;
            }
            if (s > 0) {
              var currDepTime = seg.Origin.DepTime;
              var prevArrTime = segment[s - 1].Destination.ArrTime;

              var diffMin = this.state.actions.diffMinutes(
                prevArrTime,
                currDepTime
              );
              durationSum += diffMin;

              var stopDurationNum = diffMin / 60;
              var stopDurHours = Math.floor(stopDurationNum);
              var stopDurMins = Math.ceil(
                60 * (stopDurationNum - Math.floor(stopDurationNum))
              );
              var stopDuration = `${stopDurHours ? `${stopDurHours}h ` : ""}${
                stopDurMins !== 0 ? `${stopDurMins}m` : ""
              }`;

              charNum += seg.Origin.Airport.CityName.length;

              stopOverPts.push({
                cityName: seg.Origin.Airport.CityName,
                stopDuration,
                charNum,
              });
            }

            var durNum = flightDuration / 60;
            var durHrs = Math.floor(durNum);
            var durMns = Math.ceil(60 * (durNum - Math.floor(durNum)));
            var durationStr = `${durHrs ? `${durHrs}h ` : ""}${
              durMns !== 0 ? `${durMns}m` : ""
            }`;
            var dpTimeStr = seg.Origin.DepTime;
            var arTimeStr = seg.Destination.ArrTime;

            var depDate = new Date(dpTimeStr);
            var arrDate = new Date(arTimeStr);

            var dpTimeArr = dpTimeStr.split("T")[1].split(":");
            var arTimeArr = arTimeStr.split("T")[1].split(":");
            var dpTime = `${dpTimeArr[0]}:${dpTimeArr[1]}`;
            var arTime = `${arTimeArr[0]}:${arTimeArr[1]}`;

            segRoutes.push({
              originCode: seg.Origin.Airport.AirportCode,
              destCode: seg.Destination.Airport.AirportCode,
              flightDur: durationStr,
              layoverDur: stopDuration ? stopDuration : null,
              depTime: dpTime,
              arrTime: arTime,
              arrAfterDays: this.state.actions.diffDays(depDate, arrDate),
              arrCity: seg.Origin.Airport.CityName,
              destCity: seg.Destination.Airport.CityName,
            });
          });

          var cabinClass = cabinclassMap[segment[0].CabinClass]
            ? cabinclassMap[segment[0].CabinClass]
            : "";
          var durationNum = durationSum / 60;
          var durHours = Math.floor(durationNum);

          var durMins = Math.ceil(60 * (durationNum - Math.floor(durationNum)));
          var finalSum = finalDur / 60;
          var finalHrs = Math.floor(finalSum);

          var finalsMins = Math.ceil(60 * (finalSum - Math.floor(finalSum)));
          var duration = `${durHours ? `${durHours}h ` : ""}${
            durMins !== 0 ? `${durMins}m` : ""
          }`;
          var finalTime = `${finalHrs ? `${finalHrs}h ` : ""}${
            finalsMins !== 0 ? `${finalsMins}m` : ""
          }`;
          totalDur += durHours * 60 + durMins;
          var arrAfterDays = this.state.actions.diffDays(
            depTimeDate,
            arrTimeDate
          );

          totalDuration += dur;
          return {
            airlineName: seg1.Airline.AirlineName,
            mainFlgtCode: flightCodes[0],
            flightCodes,
            arrTime,
            arrTimeDate,
            depTime,
            depTimeDate,
            arrAfterDays,
            originCityName,
            originAirportCode,
            originAirportName,
            originTerminal,
            originCountryCode,
            destCityName,
            destAirportCode,
            destAirportName,
            destTerminal,
            destCountryCode,
            duration,
            dur,
            stopOverPts,
            segRoutes,
            baggage: seg1.Baggage,
            cabinBaggage: seg1.CabinBaggage,
            cabinClass,
            finalDur,
            finalTime,
          };
        });
        return {
          segments,
          fare: flight?.Fare?.OfferedFare
            ? Math.ceil(flight?.Fare?.OfferedFare)
            : Math.ceil(flight?.Fare?.PublishedFare),
          fareType: flight?.FareClassification?.Type,
          fareRules: flight?.MiniFareRules ? flight?.MiniFareRules : [],
          resultIndex: flight?.ResultIndex,
          totalDuration,
          totalDur,
        };
      },
      modifyHotelRes: (hotel) => {
        var hotelNew = {};

        //
      },
      backToHotelResPage: () => {
        this.setState({
          hotelInfoRes: false,
          bookingHotel: {},
        });
      },
      setFlightSession: (value) => {
        this.setState({
          flightsessionExpired: value,
        });
      },
      validSeatMap: (seatData) => {
        var valid = false;
        //console.log(seatData);
        seatData.SegmentSeat.forEach((seg, s) => {
          var firstRow = seg.RowSeats[1];

          if (firstRow?.Seats?.length === 6) {
            valid = true;
          }
        });

        return valid;
      },
      getWingPosArr: (seatData) => {
        var wingPosArr = seatData.map((seatSeg, s) => {
          return [...this.state.actions.getWingPos(seatSeg.RowSeats)];
        });

        return wingPosArr;
      },
      getWingPos: (rowSeats) => {
        var wingPosArr = [];

        rowSeats.forEach((row, r) => {
          var firstSeat = row.Seats[0];
          var i = 1;
          while (firstSeat.noSeat && i < row.Seats.length) {
            firstSeat = row.Seats[i];
            i++;
          }

          if (
            !firstSeat.noSeat &&
            seatTypeObj[firstSeat.SeatType].includes("Wing")
          ) {
            wingPosArr.push(firstSeat.RowNo);
          }
        });

        return wingPosArr;
      },
      fillUpSegmentSeats: (seatData) => {
        var seatDataNew = seatData.map((seatSeg, s) => {
          return {
            RowSeats: this.state.actions.fillUpRowSeats(seatSeg.RowSeats),
          };
        });

        return seatDataNew;
      },
      fillUpRowSeats: (rowSeats) => {
        var rowsNum = 0;
        var firstRow = rowSeats[1];
        rowsNum = Number(firstRow.Seats[0].RowNo) - 1;
        var rows = [];
        for (var i = 1; i <= rowsNum; i++) {
          rows.push({
            Seats: [
              {
                AvailablityType: 3,
                Code: `${i}A`,
                RowNo: `${i}`,
                SeatNo: "A",
                SeatType: 0,
              },
              {
                AvailablityType: 3,
                Code: `${i}B`,
                RowNo: `${i}`,
                SeatNo: "B",
                SeatType: 0,
              },
              {
                AvailablityType: 3,
                Code: `${i}C`,
                RowNo: `${i}`,
                SeatNo: "C",
                SeatType: 0,
              },
              {
                AvailablityType: 3,
                Code: `${i}D`,
                RowNo: `${i}`,
                SeatNo: "D",
                SeatType: 0,
              },
              {
                AvailablityType: 3,
                Code: `${i}E`,
                RowNo: `${i}`,
                SeatNo: "E",
                SeatType: 0,
              },
              {
                AvailablityType: 3,
                Code: `${i}F`,
                RowNo: `${i}`,
                SeatNo: "F",
                SeatType: 0,
              },
            ],
          });
        }

        rowSeats.shift();

        var seatsNo = {
          0: "A",
          1: "B",
          2: "C",
          3: "D",
          4: "E",
          5: "F",
        };

        rowSeats.forEach((row, r) => {
          if (row.Seats.length < 6) {
            var i = 0;
            var s = 0;
            var seats = [];
            while (s < 6) {
              if (
                (row.Seats[i] && row.Seats[i].SeatNo !== seatsNo[s]) ||
                !row.Seats[i]
              ) {
                seats[s] = { noSeat: true };
              } else {
                seats[s] = { ...row.Seats[i] };
                i++;
              }
              s++;
            }

            row.Seats = [...seats];
            // console.log("Filled seats", seats);
          }
        });
        return [...rows, ...rowSeats];
      },
      populateBookData: (bookingFlight, flightBookData, fareData) => {
        bookingFlight.forEach((book, bookIndex) => {
          if (flightBookData && flightBookData[bookIndex]) {
            // if(flightBookData[bookIndex].fareRules){

            // }
            book.fareRules = fareData[bookIndex];
            if (
              flightBookData[bookIndex].ssrResult &&
              flightBookData[bookIndex].ssrResult.Response
            ) {
              book.baggageData = flightBookData[bookIndex].ssrResult.Response
                .Baggage
                ? [...flightBookData[bookIndex].ssrResult.Response.Baggage]
                : [];
              book.mealData = flightBookData[bookIndex].ssrResult.Response
                .MealDynamic
                ? [...flightBookData[bookIndex].ssrResult.Response.MealDynamic]
                : [];
              console.log(
                flightBookData[bookIndex]?.ssrResult?.Response?.SeatDynamic
              );
              book.seatData = flightBookData[bookIndex].ssrResult.Response
                .SeatDynamic
                ? [...flightBookData[bookIndex].ssrResult.Response.SeatDynamic]
                : [];
            }
          }
        });
      },
      fetchingFlightBookData: async (bookingFlight) => {
        // var bookingFlight = bookingFlight
        //   ? [...bookingFlight]
        //   : [...this.state.bookingFlight];

        if (!this.state.flightSessionExpired) {
          this.setState({
            flightBookPage: true,
            flightBookDataLoading: true,
          });

          var bookReqs = [];
          var bookReqList = [];
          var fareReq = [];
          bookingFlight.forEach((flightB, b) => {
            var request = {
              tokenId: this.state.flightSearchToken,
              traceId: this.state.flightTraceId,
              resultIndex: flightB.resultIndex,
            };

            bookReqList.push(request);
            fareReq.push(
              this.state.actions.fetchFareRule(
                flightB.resultIndex,
                "indigo",
                100
              )
            );
            bookReqs.push(
              fetch(
                "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightBookData",
                {
                  method: "POST",
                  // credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(request),
                }
              )
                .then((res) => res.json())
                .catch((err) => console.log(err))
            );
          });

          console.log("Flight booking req", bookReqList);

          var flightBookData = await Promise.all(bookReqs);
          var fareData = await Promise.all(fareReq);
          this.state.actions.populateBookData(
            bookingFlight,
            flightBookData,
            fareData
          );

          this.setState({
            bookingFlight,
            flightBookDataLoading: false,
          });
        } else {
          this.setState({
            flightSessionExpiredPopup: true,
          });
          console.log(
            "Flight session has expired please make a search request again"
          );
        }
      },
      fetchFlightBookData: async (
        resultIndex,
        flight,
        baggageDtls,
        arrIndex
      ) => {
        var bookingFlight = this.state.bookingFlight
          ? [...this.state.bookingFlight]
          : [];
        var addedMeals = [];
        var addedBaggage = [];

        for (let i = 0; i < flight.Segments.length; i++) {
          const selectedMeals = [];
          const selectedBaggage = [];
          for (let j = 0; j < this.state.flightTravellers; j++) {
            const mealObj = {
              price: 0,
              mealDesc: 0,
            };
            const baggageObj = {
              price: 0,
              baggage: 0,
              text: "",
            };
            selectedMeals.push(mealObj);
            selectedBaggage.push(baggageObj);
          }

          addedMeals.push(selectedMeals);
          addedBaggage.push(selectedBaggage);
        }

        bookingFlight[this.state.flightResJType] = {
          flight,
          flightNew: this.state.actions.modifyFlightObject(flight),
          baggageData: [],
          mealData: [],
          seatData: [],
          baggagePrice: [0, 0],
          baggageWeight: [0, 0],
          mealPrice: [0, 0],
          mealDesc: ["", ""],
          seats: [[], []],
          totalFare: flight.Fare.OfferedFare
            ? Math.ceil(flight.Fare.OfferedFare)
            : Math.ceil(flight.Fare.PublishedFare),
          baggageDtls,
          resultIndex,
          arrIndex,
          selectedMeals: addedMeals,
          selectedBaggage: addedBaggage,
          adults: this.state.flightAdults,
          child: this.state.flightChild,
          infant: this.state.flightInfant,
          travellers: this.state.flightTravellers,
          flightRequest: this.state.flightReq[this.state.flightResJType],
        };
        console.log(bookingFlight);
        if (
          this.state.flightResList.length > 1 &&
          this.state.flightResJType === 0
          // &&
          // bookingFlight.length <= 1
        ) {
          this.setState({
            bookingFlight,
            flightResJType: 1,
          });
        } else {
          this.setState({
            bookingFlight,
          });
          if (this.state.flightResList.length === 1) {
            this.state.actions.fetchingFlightBookData(bookingFlight);
          }
        }
      },
      bookFlightFromAdmin: async (data) => {
        const responce = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightAdminBooking",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resData = await responce.json();
        console.log(resData);
        return resData;
      },
      issueTicketFromForNonLccAdmin: async (data) => {
        const responce = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/issueTicketfornonlcc",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resData = await responce.json();
        console.log(resData);
        return resData;
      },
      issueTicketForLccFlightsFromAdmin: async (data) => {
        const responce = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/issueTicketforlcc",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resData = await responce.json();
        console.log(resData);
        return resData;
      },
      getFlightUpdatedQuote: async (data) => {
        const responce = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/getUpdatedPrices",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resData = await responce.json();
        console.log(resData);
        return resData;
      },
      blockbusTicket: async (data) => {
        const responce = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/busblock",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resData = await responce.json();
        console.log(resData);
        return resData;
      },
      setSessionPopup: async (value) => {
        this.setState({
          flightSessionExpiredPopup: value,
        });
      },
      setHotelSessionPopup: async (value) => {
        this.setState({
          flightSessionExpiredPopup: value,
        });
      },
      fetchFareRule: async (resultIndex, airlineName, fare) => {
        if (!this.state.flightSessionExpired) {
          console.log(
            `Fare rule running for ${airlineName}(${fare.toLocaleString(
              "en-IN"
            )}/-)`
          );
          var request = {
            traceId: this.state.flightTraceId,
            resultIndex,
          };

          var fareRuleRes = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightFareRule",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(request),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));
          return fareRuleRes?.fareRuleResult?.Response?.FareRules?.[0]
            ?.FareRuleDetail;
        } else {
          console.log(
            "Flight session expired, Please make a search request again"
          );
        }
      },
      separateFlightsByType: (results) => {
        this.setState({
          flightResList: results,
          internationalFlights: results.length > 1 ? false : true,
        });
      },
      handleChangeAirportKeyword: (keyword, type) => {
        if (type === "origin") {
          this.setState({
            airportOriginLoading: true,
          });

          this.changeOriginAirportKeyword(keyword);
        } else if (type === "destination") {
          this.setState({
            airportDestLoading: true,
          });
          this.changeDestAirportKeyword(keyword);
        }
      },
      handleChangeCityHotel: (keyword) => {
        this.changeCityKeyword(keyword);
      },
      handleChangeCityCab: (keyword) => {
        this.changeCabCityKeyword(keyword);
      },
      cancelOriginAiportReq: () => {
        if (abortAirportController) {
          abortAirportController.abort();
        }
        this.setState({
          airportOriginData: [],
          airportOriginLoading: false,
        });
      },
      cancelDestAiportReq: () => {
        if (abortAirportController) {
          abortAirportController.abort();
        }
        this.setState({
          airportDestData: [],
          airportDestLoading: false,
        });
      },
      fetchBookingData: () => {},
      setCabNights: () => {
        this.setState({ cabNights: 0 });
      },
      fetchCabs: async (
        city,
        type,
        startDate,
        endDate,
        noOfCabs,
        nights,
        time
      ) => {
        this.setState({
          cabCity: city,
          cabType: type,
          cabStartDate: startDate,
          cabEndDate: endDate,
          searchingCabs: true,
          cabCount: noOfCabs,
          cabNights: nights,
          selectedTime: time,
        });
        const cabCityRef = db
          .collection("cabDetailsList")
          .doc(city)
          .collection("Types")
          .doc(type);
        const cabCityDoc = await cabCityRef.get();
        const cabdata = cabCityDoc.data();

        this.setState({
          cabResList: cabdata.types,
        });
      },
      handleChangeBusKeyword: (keyword, type) => {
        if (type === "origin") {
          this.setState({
            busOriginLoading: true,
          });

          this.changeOriginBusKeyword(keyword);
        } else if (type === "destination") {
          this.setState({
            busDestLoading: true,
          });
          this.changeDestBusKeyword(keyword);
        }
      },
      busSearch: async (originDetails, destDetails, outboundDate) => {
        try {
          this.setState({
            busSearchTime: new Date(),
            busResList: [],
            searchingBus: true,
            busSessionStarted: false,
            busSessionExpired: false,
            busDate: outboundDate,
            originDetails,
            destDetails,
          });
          var busReq = {
            DateOfJourney:
              this.state.actions.convertTboDateFormat(outboundDate),
            DestinationId: destDetails.id,
            OriginId: originDetails.id,
          };
          this.setState({
            busReq,
            originDetails,
            destDetails,
          });

          var busRes = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/busSearchRes",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(busReq),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));
          console.log(busRes);
          if (busRes?.responce?.error) {
            this.setState({
              busResList: [],
              busErrorMessage: busRes?.error,
              searchingBus: false,
              busSessionStarted: true,
            });
          } else {
            this.setState({
              busResList:
                busRes?.response?.busResult?.BusSearchResult?.BusResults,
              busTraceId: busRes?.response?.busResult?.BusSearchResult?.TraceId,
              busTokenId: busRes.tokenId,
              searchingBus: false,
              busSessionStarted: true,
            });
            this.setState({
              resetBusDetails:
                busRes?.response?.busResult?.BusSearchResult?.BusResults,
              busTraceId: busRes?.response?.busResult?.BusSearchResult?.TraceId,
              busTokenId: busRes.tokenId,
              searchingBus: false,
              busSessionStarted: true,
            });
            this.setState({
              busFilterReset:
                busRes?.response?.busResult?.BusSearchResult?.BusResults,
              busTraceId: busRes?.response?.busResult?.BusSearchResult?.TraceId,
              busTokenId: busRes.tokenId,
              searchingBus: false,
              busSessionStarted: true,
            });
          }
        } catch (error) {}
      },
      setBusSearch: () => {
        this.setState({ searchingBus: false });
      },
      backToBusResPage: () => {
        this.setState({
          fetchingBusSeat: false,
          bookingBus: null,
          selectedSeats: [],
        });
      },
      busSearchbyName: (input, data) => {
        if (input === "") {
          this.setState({ resetBusDetails: this.state.busFilterReset });
          return;
        }
        const filteredBuses = [...this.state.busResList];
        const filter = data.filter((item) =>
          item.TravelName.toLowerCase().includes(input.toLowerCase())
        );
        if (filter.length > 0) {
          this.setState({
            resetBusDetails: filter,
          });
        } else {
          this.setState({
            resetBusDetails: [],
            noResultsFound: true,
          });
        }
      },
      setBusDuration: async (value) => {
        this.setState({
          busDuration: value,
        });
      },
      setBusCost: async (value) => {
        this.setState({
          busCost: value,
        });
      },
      filterByDuration: (data) => {
        const filteredBuses = [...this.state.busResList];
        const filterByDuration = data.map((obj) => ({
          ...obj,
          duration: new Date(obj.ArrivalTime) - new Date(obj.DepartureTime),
        }));
        const sortedData = filterByDuration.sort(
          (a, b) => a.duration - b.duration
        );
        this.setState({ resetBusDetails: sortedData });
      },
      filterByPrice: (data) => {
        console.log("enteres");
        const filteredBuses = [...this.state.busResList];
        const sortedData = data.sort(
          (a, b) =>
            a.BusPrice.OfferedPriceRoundedOff -
            b.BusPrice.OfferedPriceRoundedOff
        );
        this.setState({ resetBusDetails: sortedData });
      },
      resetBusFilter: () => {
        this.setState({ resetBusDetails: this.state.busFilterReset });
        this.setState({
          busCost: true,
        });
        this.setState({
          busDuration: false,
        });
      },
      busFilter: (filteredBus, type, data) => {},
      backToBusSearchPage: () => {
        this.setState({
          busResList: [],
          busTraceId: "",
          busTokenId: "",
        });
      },
      fetchBusSeatLayout: async (bus) => {
        this.setState({
          fetchingBusSeat: true,
          bookingBus: {},
          BusOperatorName: bus?.TravelName,
        });
        var request = {
          traceId: this.state.busTraceId,
          ResultIndex: bus.ResultIndex,
        };
        var busRes = await Promise.all([
          fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/busSeatLayout",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(request),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err)),
          fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/busBoardingPoint",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(request),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err)),
        ]);

        var busSeatLayout = busRes[0].response;
        var busBoardingDetails = busRes[1].response;

        this.setState({
          fetchingBusSeat: false,
          bookingBus: {
            bus,
            busBoardingDetails,
            busSeatLayout,
            busRequest: this.state.busReq,
            origin: this.state.originDetails,
            destination: this.state.destDetails,
          },
          busRes,
        });
      },
      setBusBookDetails: async (data, type) => {
        console.log(data);
        var bookingBus = { ...this.state.bookingBus };
        if (type === "seat") {
          const threePercent = data.reduce((total, seat) => {
            return (
              total +
              Math.ceil(
                (seat.Price.OfferedPriceRoundedOff * this.state.busService) /
                  100
              )
            );
          }, 0);
          console.log(threePercent);
          const totPrice = data.reduce((total, seat) => {
            return total + seat.Price.OfferedPriceRoundedOff;
          }, 0);

          const calculatedServiceCharge =
            threePercent > this.state.minimumServiceCharge
              ? threePercent
              : this.state.minimumServiceCharge;
          const eighteenPercentGst =
            calculatedServiceCharge * (this.state.GSTpercent / 100);
          const gstAddedPrice =
            calculatedServiceCharge +
            calculatedServiceCharge * (this.state.GSTpercent / 100);
          const finalPrice = totPrice + gstAddedPrice;

          bookingBus.passengers = this.state.NoofBusPassengers;
          bookingBus.selectedSeat = data;
          bookingBus.GST = eighteenPercentGst;
          bookingBus.serviceCharge = calculatedServiceCharge;
          bookingBus.busTotalPrice = finalPrice;
          bookingBus.busPrice = totPrice;
          bookingBus.traceId = this.state.busTraceId;
        }
        if (type === "boardingPoint") {
          bookingBus.boardingPointDetails = data.CityPointName;
          bookingBus.boardingTime = data.CityPointTime;
          bookingBus.boardingPointId = data.CityPointIndex;
        }
        if (type === "droppingPoint") {
          bookingBus.droppingPointDetails = data.CityPointLocation;
          bookingBus.droppingTime = data.CityPointTime;
          bookingBus.droppingPointId = data.CityPointIndex;
        }

        this.setState({
          bookingBus,
        });
      },
      bookBusTicketFromAdmin: async (data) => {
        const responce = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/busBook",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resData = await responce.json();
        console.log(resData);
        return resData;
      },
      signUp: async (userData) => {
        this.setState({ signUpLoader: true });
        try {
          const { user } = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
          );
          //await sendEmailVerification(userCredentials?.user);
          var passportdownloadURL = "";
          if (userData.passport && userData.passport.length > 0) {
            const newFileRef = ref(storage, `documents/${user.uid}/passport/`);
            const items = await listAll(newFileRef);
            await Promise.all(
              items.items.map(async (item) => {
                await deleteObject(item);
              })
            );
            const storageRef = ref(
              storage,
              `documents/${user.uid}/passport/` + userData.passport[0]?.name
            );
            await uploadBytes(storageRef, userData?.passport[0]);
            passportdownloadURL = await getDownloadURL(storageRef);
          }
          var aadhardownloadURL = "";
          if (userData.aadharCard && userData.aadharCard.length > 0) {
            const newFileRef = ref(storage, `documents/${user.uid}/aadhar/`);
            const items = await listAll(newFileRef);
            await Promise.all(
              items.items.map(async (item) => {
                await deleteObject(item);
              })
            );
            const storageRef = ref(
              storage,
              `bookings/${user.uid}/aadhar/` + userData.aadharCard[0]?.name
            );
            await uploadBytes(storageRef, userData?.aadharCard[0]);
            aadhardownloadURL = await getDownloadURL(storageRef);
          }
          await updateProfile(user, { displayName: userData.firstName });
          const managerId = userData.managerId ? userData.managerId : user.uid;
          postUserData(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.mobileNumber,
            userData.countryCode,
            userData.GSTNo,
            userData.PANNo,
            userData.billingAccount,
            userData.companyName,
            userData.companyAddress,
            userData.balance,
            userData.approvalType,
            userData.gender,
            userData.companyLocation,
            userData.companyId,
            user.uid,
            managerId,
            userData.accountType
          );
          this.state.actions.sendAccountCreationEmail({
            email: userData.email,
            name: userData.firstName + " " + userData.lastName,
            approver: userData.approvalEmail,
            password: userData.password,
          });
          this.setState({ signUpLoader: false });
        } catch (error) {
          console.log(error);
          this.setState({
            signupError: error?.errors ? error.errors[0].messgae : "Error",
          });
          this.setState({ signUpLoader: false });
        }
      },
      logIn: async ({ email, password }) => {
        try {
          this.setState({
            isLogging: false,
          });
          const userCredentials = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          var role = await this.state.actions.getUserById(
            userCredentials.user.uid
          );

          this.setState({
            loginSessionExpired: false,
            user: userCredentials.user,
            // userLoginStatus: {
            //   loggedIn: true,
            //   isLoading: false,
            //   status: "loggedIn",
            //   role: this.state.userAccountDetails?.role
            // }
          });
          this.setState({
            isLogging: true,
          });
          return role;
        } catch (error) {
          console.log(error);
          this.setState({
            loginError: true,
            userLoginStatus: {
              loggedIn: false,
              isLoading: false,
              status: "Not logged in",
              role: "user",
            },
          });
        }
      },
      signOut: async () => {
        try {
          await signOut(auth);
          this.state.actions.setRes();
          this.setState({
            userAccountDetails: null,
            userLoginStatus: {
              loggedIn: false,
              isLoading: false,
              status: "loggedOut",
              role: "user",
            },
          });
        } catch (error) {
          console.error(error);
        }
      },
      signInWithGoogle: async () => {
        try {
          const { user } = await signInWithPopup(auth, googleProvider);
          const userName = user.displayName;
          const userEmail = user.email;
          const uid = user.uid;
          postUserData(userName, userEmail, uid);
          this.setState({
            loginSessionExpired: false,
            user: user,
            userLoginStatus: {
              loggedIn: true,
              isLoading: false,
              status: "loggedIn",
            },
          });
        } catch (error) {
          console.error(error);
        }
      },
      signInWithFacebook: async () => {
        try {
          const { user } = await signInWithPopup(auth, facebookProvider);
          const userName = user.displayName;
          const userEmail = user.email;
          const uid = user.uid;
          postUserData(userName, userEmail, uid);
          this.setState({
            loginSessionExpired: false,
            user: user,
            userLoginStatus: {
              loggedIn: true,
              isLoading: false,
              status: "loggedIn",
            },
          });
        } catch (error) {
          console.error(error);
        }
      },
      updateUserProfile: async (userid, userData) => {
        var accountDocRef = db.collection("Accounts").doc(userid);
        var passportdownloadURL = "";
        if (typeof userData.passport === "object") {
          const newFileRef = ref(storage, `documents/${userid}/passport/`);
          const items = await listAll(newFileRef);
          await Promise.all(
            items.items.map(async (item) => {
              await deleteObject(item);
            })
          );
          const storageRef = ref(
            storage,
            `documents/${userid}/passport/` + userData.passport.name
          );
          await uploadBytes(storageRef, userData.passport);
          passportdownloadURL = await getDownloadURL(storageRef);
        }
        var aadhardownloadURL = "";
        if (typeof userData.aadharCard === "object") {
          const newFileRef = ref(storage, `documents/${userid}/aadhar/`);
          const items = await listAll(newFileRef);
          await Promise.all(
            items.items.map(async (item) => {
              await deleteObject(item);
            })
          );
          const storageRef = ref(
            storage,
            `bookings/${userid}/aadhar/` + userData.aadharCard.name
          );
          await uploadBytes(storageRef, userData.aadharCard);
          aadhardownloadURL = await getDownloadURL(storageRef);
        }
        await updateDoc(accountDocRef, {
          firstName: userData.firstName ? userData.firstName : "",
          lastName: userData.lastName ? userData.lastName : "",
          mobileNumber: userData.mobileNumber ? userData.mobileNumber : "",
          passportNumber: userData.passportNumber
            ? userData.passportNumber
            : "",
          aadharCard:
            aadhardownloadURL.length > 0
              ? aadhardownloadURL
              : userData.aadharCard,
          passport:
            passportdownloadURL.length > 0
              ? passportdownloadURL
              : userData.passport,
          GSTNo: userData.GSTNo ? userData.GSTNo : "",
          PANNo: userData.PANNo ? userData.PANNo : "",
          companyName: userData.companyName ? userData.companyName : "",
        });
        var accdata = await accountDocRef.get();
        await this.state.actions.getUserById(userid);
        return accdata.data();
      },
      setAdminData: async () => {
        try {
          var accountsRef = db.collection("Accounts");
          var roleQuery = accountsRef.where("role", "==", "admin");
          var querySnapshot = await roleQuery.get();
          var admin = [];

          querySnapshot.forEach((doc) => {
            var data = doc.data();
            admin.push({
              data,
            });
            this.setState({
              adminDetails: data,
            });
          });

          var docCollectionRef = db
            .collection("Accounts")
            .doc(admin[0].data.userid);

          this.setState({
            domesticFlight: Number(admin[0].data.domesticFlights),
            internationalFlight: Number(admin[0].data.internationalFlights),
            domesticHotel: Number(admin[0].data.domesticHotels),
            internationalHotel: Number(admin[0].data.internationalHotels),
            cabService: Number(admin[0].data.cabs),
            busService: Number(admin[0].data.buses),
            minimumServiceCharge: admin[0].data.minimumServiceCharge,
            GSTpercent: admin[0].data.GSTpercent,
            internationalFlightService: Number(
              admin[0].data.internationalFlights
            ),
            internationalHotelService: Number(
              admin[0].data.internationalHotels
            ),
          });
          this.setState({ adminUid: data });

          await this.state.actions.getAllUsers();
        } catch (error) {
          console.log(error);
        }
      },
      getSubmittedTrips: async (count) => {
        var accountsRef = db.collection("Accounts");
        var roleQuery = accountsRef.where("role", "==", "admin");
        var querySnapshot = await roleQuery.get();
        var admin = [];
        querySnapshot.forEach((doc) => {
          var data = doc.data();
          admin.push({
            data,
          });
          this.setState({
            adminDetails: data,
          });
        });
        var docCollectionRef = db
          .collection("Accounts")
          .doc(admin[0].data.userid);

        var adminTrips = [];

        var tripsDocRef = docCollectionRef
          .collection("trips")
          .orderBy("submittedDate", "desc")
          .limit(20);
        var trips = await tripsDocRef.get();
        if (trips) {
          await trips.forEach(async (doc) => {
            var docCollectionRef = db
              .collection("Accounts")
              .doc(doc.data()?.userDetails?.userid)
              .collection("trips")
              .doc(doc.data().tripId);

            var doc1 = await docCollectionRef.get();
            var sendData = doc1.data(); // No need to await here
            const totalIds = [];
            sendData?.flights.map((flight) => {
              return totalIds.push(flight);
            });
            sendData?.hotels.map((flight) => {
              return totalIds.push(flight);
            });
            sendData?.cabs?.map((flight) => {
              return totalIds.push(flight);
            });
            sendData?.bus?.map((flight) => {
              return totalIds.push(flight);
            });
            sendData?.otherBookings?.map((flight) => {
              return totalIds.push(flight);
            });
            var isBooked = totalIds.every(
              (item) =>
                item.status === "Booked" ||
                item.status === "Booked,Payment Pending"
            );
            var isNew = totalIds.every((item) => item.status !== "Booked");
            adminTrips.push({
              data: doc.data(),
              id: doc.id,
              tripData: sendData,
              status: isBooked
                ? "Booked"
                : isNew
                ? "New Request"
                : "New Request",
            });
          });
        }
        if (this.state.submittedTrips.length === 0) {
          this.setState({
            submittedTrips: adminTrips,
          });
        }

        return adminTrips;
      },
      getAllSubmittedTrips: async (count) => {
        var accountsRef = db.collection("Accounts");
        var roleQuery = accountsRef.where("role", "==", "admin");
        var querySnapshot = await roleQuery.get();
        var admin = [];
        querySnapshot.forEach((doc) => {
          var data = doc.data();
          admin.push({
            data,
          });
          this.setState({
            adminDetails: data,
          });
        });
        var docCollectionRef = db
          .collection("Accounts")
          .doc(admin[0].data.userid);

        var adminTrips = [];

        var tripsDocRef = docCollectionRef.collection("trips");

        var trips = await tripsDocRef.get();
        if (trips) {
          await trips.forEach(async (doc) => {
            var docCollectionRef = db
              .collection("Accounts")
              .doc(doc.data()?.userDetails?.userid)
              .collection("trips")
              .doc(doc.data().tripId);

            var doc1 = await docCollectionRef.get();
            var sendData = doc1.data();
            const totalIds = [];
            sendData?.flights.map((flight) => {
              return totalIds.push(flight);
            });
            sendData?.hotels.map((flight) => {
              return totalIds.push(flight);
            });
            sendData?.cabs?.map((flight) => {
              return totalIds.push(flight);
            });
            sendData?.bus?.map((flight) => {
              return totalIds.push(flight);
            });
            sendData?.otherBookings?.map((flight) => {
              return totalIds.push(flight);
            });
            var isBooked = totalIds.every(
              (item) =>
                item.status === "Booked" ||
                item.status === "Booked,Payment Pending"
            );
            var isNew = totalIds.every((item) => item.status !== "Booked");
            adminTrips.push({
              data: doc.data(),
              id: doc.id,
              tripData: sendData,
              status: isBooked
                ? "Booked"
                : isNew
                ? "New Request"
                : "New Request",
            });
          });
        }
        if (this.state.submittedTrips.length === 0) {
          this.setState({
            submittedTrips: adminTrips,
          });
        }

        return adminTrips;
      },
      setAirlineName: async (value) => {
        this.setState({
          airlineName: value,
        });
      },
      setOriginStartTime: async (value) => {
        this.setState({
          originStartTime: value,
        });
      },
      setOriginEndTime: async (value) => {
        this.setState({
          originEndTime: value,
        });
      },
      setDestStartTime: async (value) => {
        this.setState({
          destStartTime: value,
        });
      },
      setDestEndTime: async (value) => {
        this.setState({
          destEndTime: value,
        });
      },
      setStopPts: async (value) => {
        this.setState({
          stopPts: value,
        });
      },
      setByDuration: async (value) => {
        this.setState({
          byDuration: value,
        });
      },
      setByCost: async (value) => {
        this.setState({
          byCost: value,
        });
      },
      filterFlights: (flightArr) => {
        var filteredArr = flightArr;
        if (this.state.byCost) {
          filteredArr.sort(
            (a, b) => a[0].Fare.PublishedFare - b[0].Fare.PublishedFare
          );
        }
        if (this.state.byDuration) {
          filteredArr.sort((a, b) => {
            var aFlight = this.state.actions.modifyFlightObject(a[0]);
            var bFlight = this.state.actions.modifyFlightObject(b[0]);

            var aDur = aFlight.totalDur;
            var bDur = bFlight.totalDur;

            return aDur - bDur;
          });
        }
        if (this.state.stopPts === 0 || this.state.stopPts) {
          filteredArr = filteredArr.filter((a) => {
            var newflightObj = this.state.actions.modifyFlightObject(a[0]);
            return (
              newflightObj.segments[0].stopOverPts.length <= this.state.stopPts
            );
          });
        }
        if (this.state.airlineName) {
          filteredArr = filteredArr.filter((a) => {
            var newflightObj = this.state.actions.modifyFlightObject(a[0]);
            return (
              newflightObj.segments[0].airlineName === this.state.airlineName
            );
          });
        }
        if (this.state.originStartTime && this.state.originEndTime) {
          if (this.state.originEndTime.getHours() === 23) {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[0].depTimeDate).getHours() >=
                  this.state.originStartTime.getHours() &&
                (new Date(newflightObj.segments[0].depTimeDate).getHours() <
                  this.state.originEndTime.getHours() ||
                  (new Date(newflightObj.segments[0].depTimeDate).getHours() ===
                    this.state.originEndTime.getHours() &&
                    new Date(
                      newflightObj.segments[0].depTimeDate
                    ).getMinutes() < this.state.originEndTime.getMinutes()))
              );
            });
          } else {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[0].depTimeDate).getHours() >=
                  this.state.originStartTime.getHours() &&
                new Date(newflightObj.segments[0].depTimeDate).getHours() <
                  this.state.originEndTime.getHours()
              );
            });
          }
        }
        if (this.state.destStartTime && this.state.destEndTime) {
          if (this.state.destEndTime.getHours() === 23) {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[0].arrTimeDate).getHours() >=
                  this.state.destStartTime.getHours() &&
                (new Date(newflightObj.segments[0].arrTimeDate).getHours() <
                  this.state.destEndTime.getHours() ||
                  (new Date(newflightObj.segments[0].arrTimeDate).getHours() ===
                    this.state.destEndTime.getHours() &&
                    new Date(
                      newflightObj.segments[0].arrTimeDate
                    ).getMinutes() < this.state.destEndTime.getMinutes()))
              );
            });
          } else {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[0].arrTimeDate).getHours() >=
                  this.state.destStartTime.getHours() &&
                new Date(newflightObj.segments[0].arrTimeDate).getHours() <
                  this.state.destEndTime.getHours()
              );
            });
          }
        }
        if (this.state.intDestStartTime1 && this.state.intDestEndTime1) {
          if (this.state.intDestEndTime1.getHours() === 23) {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[0].arrTimeDate).getHours() >=
                  this.state.intDestStartTime1.getHours() &&
                (new Date(newflightObj.segments[0].arrTimeDate).getHours() <
                  this.state.intDestEndTime1.getHours() ||
                  (new Date(newflightObj.segments[0].arrTimeDate).getHours() ===
                    this.state.intDestEndTime1.getHours() &&
                    new Date(
                      newflightObj.segments[0].arrTimeDate
                    ).getMinutes() < this.state.intDestEndTime1.getMinutes()))
              );
            });
          } else {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[0].arrTimeDate).getHours() >=
                  this.state.intDestStartTime1.getHours() &&
                new Date(newflightObj.segments[0].arrTimeDate).getHours() <
                  this.state.intDestEndTime1.getHours()
              );
            });
          }
        }
        if (this.state.intDestStartTime2 && this.state.intDestEndTime2) {
          if (this.state.intDestEndTime2.getHours() === 23) {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[1].arrTimeDate).getHours() >=
                  this.state.intDestStartTime2.getHours() &&
                (new Date(newflightObj.segments[1].arrTimeDate).getHours() <
                  this.state.intDestEndTime2.getHours() ||
                  (new Date(newflightObj.segments[1].arrTimeDate).getHours() ===
                    this.state.intDestEndTime2.getHours() &&
                    new Date(
                      newflightObj.segments[1].arrTimeDate
                    ).getMinutes() < this.state.intDestEndTime2.getMinutes()))
              );
            });
          } else {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[1].arrTimeDate).getHours() >=
                  this.state.intDestStartTime2.getHours() &&
                new Date(newflightObj.segments[1].arrTimeDate).getHours() <
                  this.state.intDestEndTime2.getHours()
              );
            });
          }
        }
        if (this.state.intOriginStartTime1 && this.state.intOriginEndTime1) {
          if (this.state.intOriginEndTime1.getHours() === 23) {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[0].depTimeDate).getHours() >=
                  this.state.intOriginStartTime1.getHours() &&
                (new Date(newflightObj.segments[0].depTimeDate).getHours() <
                  this.state.intOriginEndTime1.getHours() ||
                  (new Date(newflightObj.segments[0].depTimeDate).getHours() ===
                    this.state.intOriginEndTime1.getHours() &&
                    new Date(
                      newflightObj.segments[0].depTimeDate
                    ).getMinutes() < this.state.intOriginEndTime1.getMinutes()))
              );
            });
          } else {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[0].depTimeDate).getHours() >=
                  this.state.intOriginStartTime1.getHours() &&
                new Date(newflightObj.segments[0].depTimeDate).getHours() <
                  this.state.intOriginEndTime1.getHours()
              );
            });
          }
        }
        if (this.state.intOriginStartTime2 && this.state.intOriginEndTime2) {
          if (this.state.intOriginEndTime2.getHours() === 23) {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[1].depTimeDate).getHours() >=
                  this.state.intOriginStartTime2.getHours() &&
                (new Date(newflightObj.segments[1].depTimeDate).getHours() <
                  this.state.intOriginEndTime2.getHours() ||
                  (new Date(newflightObj.segments[1].depTimeDate).getHours() ===
                    this.state.intOriginEndTime2.getHours() &&
                    new Date(
                      newflightObj.segments[1].depTimeDate
                    ).getMinutes() < this.state.intOriginEndTime2.getMinutes()))
              );
            });
          } else {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                new Date(newflightObj.segments[1].depTimeDate).getHours() >=
                  this.state.intOriginStartTime2.getHours() &&
                new Date(newflightObj.segments[1].depTimeDate).getHours() <
                  this.state.intOriginEndTime2.getHours()
              );
            });
          }
        }
        if (this.state.intStopPts1 === 0 || this.state.intStopPts1) {
          filteredArr = filteredArr.filter((a) => {
            var newflightObj = this.state.actions.modifyFlightObject(a[0]);
            return (
              newflightObj.segments[0].stopOverPts.length <=
              this.state.intStopPts1
            );
          });
        }
        if (this.state.intStopPts2 === 0 || this.state.intStopPts2) {
          filteredArr = filteredArr.filter((a) => {
            var newflightObj = this.state.actions.modifyFlightObject(a[0]);
            return (
              newflightObj.segments[1].stopOverPts.length <=
              this.state.intStopPts2
            );
          });
        }
        return filteredArr;
      },
      setIntStopPts1: (value) => {
        this.setState({
          intStopPts1: value,
        });
      },
      setIntStopPts2: (value) => {
        this.setState({
          intStopPts2: value,
        });
      },
      setIntOriginStartTime1: (value) => {
        this.setState({
          intOriginStartTime1: value,
        });
      },
      setIntOriginStartTime2: (value) => {
        this.setState({
          intOriginStartTime2: value,
        });
      },
      setIntOriginEndTime1: (value) => {
        this.setState({
          intOriginEndTime1: value,
        });
      },
      setIntOriginEndTime2: (value) => {
        this.setState({
          intOriginEndTime2: value,
        });
      },
      setIntDestStartTime1: (value) => {
        this.setState({
          intDestStartTime1: value,
        });
      },
      setIntDestStartTime2: (value) => {
        this.setState({
          intDestStartTime2: value,
        });
      },
      setIntDestEndTime1: (value) => {
        this.setState({
          intDestEndTime1: value,
        });
      },
      setIntDestEndTime2: (value) => {
        this.setState({
          intDestEndTime2: value,
        });
      },
      setDocId: (value) => {
        this.setState({
          docId: value,
        });
      },
      setTrips: async (value) => {
        this.setState({
          userTripStatus: value,
        });
      },
      setTrip: (value) => {
        this.setState({
          trip: value,
        });
      },
      setTripData: (value) => {
        this.setState({
          tripData: value,
        });
      },
      setUserAccountDetails: (value) => {
        this.setState({
          userAccountDetails: value,
        });
      },
      setStateAsync: async (stateUpdate) => {
        return new Promise((resolve) => {
          this.setState(stateUpdate, resolve);
        });
      },
      createTripFromAdmin: async (name, id) => {
        await this.state.actions.setStateAsync((prevState) => ({
          trip: {
            ...prevState.trip,
            name: name,
          },
        }));
        try {
          var accountDocRef = db.collection("Accounts").doc(id);
          var tripcollectionRef = accountDocRef.collection("trips");

          var tripdocRef = await tripcollectionRef.add(this.state.trip);
          await db
            .collection("Accounts")
            .doc(id)
            .update({
              trips: arrayUnion(tripdocRef.id),
            });
          return tripdocRef.id;
        } catch (error) {
          console.log(error);
        }
      },
      createTrip: async (name) => {
        await this.state.actions.setStateAsync((prevState) => ({
          trip: {
            ...prevState.trip,
            name: name,
          },
        }));
        try {
          var accountDocRef = db
            .collection("Accounts")
            .doc(this.state.userAccountDetails.userid);
          var tripcollectionRef = accountDocRef.collection("trips");

          var tripdocRef = await tripcollectionRef.add(this.state.trip);
          await db
            .collection("Accounts")
            .doc(this.state.userAccountDetails.userid)
            .update({
              trips: arrayUnion(tripdocRef.id),
            });
          this.state.actions.setSelectedTripId(tripdocRef.id);
          return tripdocRef.id;
        } catch (error) {
          console.log(error);
        }
      },
      getAllTrips: async (userId) => {
        try {
          this.setState({
            tripsLoading: true,
          });
          const accountDocRef = db.collection("Accounts").doc(userId);
          const tripsCollectionRef = accountDocRef.collection("trips");
          const tripsArray = [];
          const querySnapshot = await tripsCollectionRef.get();
          await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              var hotels = await this.state.actions.getAllHotels(
                doc.id,
                userId
              );
              var flights = await this.state.actions.getAllFlights(
                doc.id,
                userId
              );
              var bus = await this.state.actions.getAllBus(doc.id, userId);
              tripsArray.push({
                id: doc.id,
                data: doc.data(),
                hotels: hotels,
                flights: flights,
                bus: bus,
              });
            })
          );
          this.setState({
            tripsLoading: false,
          });
          await this.state.actions.setTrips({
            userTrips: tripsArray,
            tripLoading: false,
          });
        } catch (error) {
          console.log(error);
        }
      },
      setUsers: async (value) => {
        this.setState({
          users: value,
        });
      },
      getAllUsers: async () => {
        try {
          const accountDocRef = db.collection("Accounts");
          var userArray = [];
          const querySnapshot = await accountDocRef.get();

          querySnapshot.forEach(async (doc) => {
            userArray.push({
              id: doc.id,
              data: doc.data(),
            });
          });

          var userArr = userArray.filter((user) => {
            return user.data.role !== "admin";
          });
          this.state.actions.setUsers(userArr);
        } catch (error) {
          console.log(error);
        }
      },
      getAllHotels: async (id, userid) => {
        var hotelCollectionRef = db
          .collection("Accounts")
          .doc(userid)
          .collection("trips")
          .doc(id)
          .collection("hotels");
        const querysnapshot = await hotelCollectionRef.get();
        var hotelsArray = [];
        querysnapshot.forEach((doc) => {
          hotelsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        return hotelsArray;
      },
      getAllOtherBookings: async (id, userid) => {
        var otherCollectionRef = db
          .collection("Accounts")
          .doc(userid)
          .collection("trips")
          .doc(id)
          .collection("otherbookings");
        const querysnapshot = await otherCollectionRef.get();
        var otherArray = [];
        querysnapshot.forEach((doc) => {
          otherArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        return otherArray;
      },
      getAllCabs: async (id, userid) => {
        var cabCollectionRef = db
          .collection("Accounts")
          .doc(userid)
          .collection("trips")
          .doc(id)
          .collection("cabs");
        const querysnapshot = await cabCollectionRef.get();
        var cabsArray = [];
        querysnapshot.forEach((doc) => {
          cabsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        return cabsArray;
      },
      getAllExpenses: async (id, userid) => {
        var cabCollectionRef = db
          .collection("Accounts")
          .doc(userid)
          .collection("trips")
          .doc(id)
          .collection("expenses");
        const querysnapshot = await cabCollectionRef.get();
        var expenseArray = [];
        querysnapshot.forEach((doc) => {
          expenseArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        return expenseArray;
      },
      getAllBookings: async (id, userid) => {
        var bookingCollectionRef = db
          .collection("Accounts")
          .doc(userid)
          .collection("trips")
          .doc(id)
          .collection("otherbookings");
        const querysnapshot = await bookingCollectionRef.get();
        var bookingsArray = [];
        querysnapshot.forEach((doc) => {
          bookingsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        return bookingsArray;
      },
      getAllFlights: async (id, userid) => {
        var hotelCollectionRef = db
          .collection("Accounts")
          .doc(userid)
          .collection("trips")
          .doc(id)
          .collection("flights");
        const querysnapshot = await hotelCollectionRef.get();
        var flightsArray = [];
        var n = 0;

        await querysnapshot.forEach(async (doc) => {
          var modifiedFlightObj = await this.state.actions.objToArr(
            doc.data()[n]
          );
          flightsArray.push({
            id: doc.id,
            data: modifiedFlightObj,
          });
          n++;
        });
        return flightsArray;
      },
      getAllBus: async (id, userid) => {
        var hotelCollectionRef = db
          .collection("Accounts")
          .doc(userid)
          .collection("trips")
          .doc(id)
          .collection("bus");
        const querysnapshot = await hotelCollectionRef.get();
        var bus = [];

        await querysnapshot.forEach(async (doc) => {
          var modifiedFlightObj = await this.state.actions.objToArr(doc.data());
          bus.push({
            id: doc.id,
            data: modifiedFlightObj,
          });
        });
        return bus;
      },
      getRequestData: async (id, userid) => {
        var hotelCollectionRef = db
          .collection("Accounts")
          .doc(userid)
          .collection("tripRequests")
          .doc(id);
        var doc = await hotelCollectionRef.get();
        var sendData = await doc.data();
        return sendData;
      },
      getRequests: async (req, userid) => {
        var reqs = [];
        await req.forEach(async (reqe) => {
          var hotelCollectionRef = db
            .collection("Accounts")
            .doc(userid)
            .collection("tripRequests")
            .doc(reqe);
          var doc = await hotelCollectionRef.get();
          var sendData = await doc.data();
          reqs.push({ data: sendData, id: doc.id });
        });
        return reqs;
      },
      getTripDocById: async (id, userid) => {
        try {
          this.setState({
            tripDataLoading: true,
          });
          var docCollectionRef = db
            .collection("Accounts")
            .doc(userid)
            .collection("trips")
            .doc(id);
          var doc = await docCollectionRef.get();
          var sendData = await doc.data();
          const [
            flights,
            hotels,
            requestData,
            cabs,
            otherBookings,
            expenses,
            bus,
          ] = await Promise.all([
            this.state.actions.getAllFlights(docCollectionRef.id, userid),
            this.state.actions.getAllHotels(docCollectionRef.id, userid),
            sendData?.requestId
              ? this.state.actions.getRequests(sendData.requestId, userid)
              : "",
            this.state.actions.getAllCabs(docCollectionRef.id, userid),
            this.state.actions.getAllBookings(docCollectionRef.id, userid),
            this.state.actions.getAllExpenses(docCollectionRef.id, userid),
            this.state.actions.getAllBus(docCollectionRef.id, userid),
          ]);
          this.state.actions.setTripData({
            id: doc.id,
            data: doc.data(),
            hotels: hotels,
            flights: flights,
            cabs: cabs,
            otherBookings: otherBookings,
            requestData: requestData,
            expenses,
            bus: bus.length > 0 ? bus : [],
          });

          this.setState({
            tripDataLoading: false,
          });
          return sendData;
        } catch (error) {
          console.log(error);
        }
      },
      arrToObj: (varr) => {
        if (Array.isArray(varr)) {
          varr.forEach((cVarr, c) => {
            cVarr = this.state.actions.arrToObj(cVarr);
          });
          varr = Object.assign({}, varr);
        } else if (typeof varr === "object" && varr !== null) {
          Object.keys(varr).forEach((key, k) => {
            varr[key] = this.state.actions.arrToObj(varr[key]);
          });
          varr = Object.assign({}, varr);
        }
        return varr;
      },
      objToArr: (obj) => {
        if (Array.isArray(obj)) {
          return obj.map((element) => this.state.actions.objToArr(element));
        } else if (typeof obj === "object" && obj !== null) {
          const keys = Object.keys(obj);
          if (keys.every((key) => !isNaN(key))) {
            return keys.map((key) => this.state.actions.objToArr(obj[key]));
          } else {
            const newObj = {};
            keys.forEach((key) => {
              newObj[key] = this.state.actions.objToArr(obj[key]);
            });
            return newObj;
          }
        }
        return obj;
      },
      getTripDoc: async (id, userid) => {
        try {
          var docCollectionRef = db
            .collection("Accounts")
            .doc(userid)
            .collection("trips")
            .doc(id);
          var doc = await docCollectionRef.get();
          var sendData = await doc.data();
          const [
            flights,
            hotels,
            requestData,
            cabs,
            expenses,
            bus,
            otherBookings,
          ] = await Promise.all([
            this.state.actions.getAllFlights(docCollectionRef.id, userid),
            this.state.actions.getAllHotels(docCollectionRef.id, userid),
            sendData?.requestId
              ? this.state.actions.getRequests(sendData?.requestId, userid)
              : "",
            this.state.actions.getAllCabs(docCollectionRef.id, userid),
            this.state.actions.getAllExpenses(docCollectionRef.id, userid),
            this.state.actions.getAllBus(docCollectionRef.id, userid),
            this.state.actions.getAllOtherBookings(docCollectionRef.id, userid),
          ]);
          this.state.actions.setTripData({
            id: doc.id,
            data: doc.data(),
            hotels: hotels,
            flights: flights,
            cabs: cabs,
            expenses,
            requestData: requestData,
            bus,
            otherBookings: otherBookings,
          });
          return sendData;
        } catch (error) {
          console.log(error);
        }
      },
      getUserDetails: async (userid) => {
        var docCollectionRef = db.collection("Accounts").doc(userid);
        const doc = await docCollectionRef.get();
        var managerCollectionRef = db
          .collection("Accounts")
          .doc(doc.data().manager.userId);
        var managerDoc = await managerCollectionRef.get();
        var managerData = await managerDoc.data();
        return { user: doc.data(), manager: managerData };
      },
      getAdminTripDoc: async (id, userid) => {
        try {
          var docCollectionRef = db
            .collection("Accounts")
            .doc(userid)
            .collection("trips")
            .doc(id);
          var doc = await docCollectionRef.get();
          const [flights, hotels, bus, cabs, user, otherBookings] =
            await Promise.all([
              this.state.actions.getAllFlights(docCollectionRef.id, userid),
              this.state.actions.getAllHotels(docCollectionRef.id, userid),
              this.state.actions.getAllBus(docCollectionRef.id, userid),
              this.state.actions.getAllCabs(docCollectionRef.id, userid),
              this.state.actions.getUserDetails(userid),
              this.state.actions.getAllOtherBookings(
                docCollectionRef.id,
                userid
              ),
            ]);
          return {
            id: doc.id,
            data: doc.data(),
            hotels: hotels,
            flights: flights,
            bus: bus,
            cabs: cabs,
            otherBookings: otherBookings,
            user: user,
          };
        } catch (error) {
          console.log(error);
        }
      },
      editTripById: async (id, data, type, userId) => {
        try {
          this.setState({
            searchingFlights: false,
            searchingHotels: false,
            fetchingHotelInfo: false,
            hotelInfoRes: false,
            flightResList: [],
            hotelResList: [],
            bookingFlight: [],
            bookingHotel: [],
          });
          this.state.actions.setFlightBookPage(false);
          var tripDocRef = db
            .collection("Accounts")
            .doc(userId ? userId : this.state.userAccountDetails.userid)
            .collection("trips")
            .doc(id);
          var tripsnap = await tripDocRef.get();
          var tripData = await tripsnap.data();
          // var details = [];
          if (type === "hotels") {
            const hotelDocRef = tripDocRef.collection("hotels");
            var newHotelDocRef = await hotelDocRef.add(data);
            //console.log(newHotelDocRef);
            var totalTrav = data?.hotelSearchQuery?.hotelRoomArr?.reduce(
              (acc, obj) => {
                acc.adults += parseInt(obj.adults, 10);
                acc.child += parseInt(obj.child, 10);
                return acc;
              },
              { adults: 0, child: 0 }
            );
            // var travDetails = [];
            // for (let i = 0; i < totalTrav.adults + totalTrav.child; i++) {
            //   travDetails.push({
            //     firstName: "",
            //     lastName: "",
            //     type: i + 1 <= totalTrav.adults ? "Adult" : "Child",
            //   });
            // }
            await db
              .collection("Accounts")
              .doc(userId ? userId : this.state.userId)
              .collection("trips")
              .doc(id)
              .update({
                hotels: arrayUnion({
                  id: newHotelDocRef.id,
                  status: "Not Submitted",
                  date: new Date(),
                  requestStatus: "Not Requested",
                  note: "",
                  hotelTraceId: this.state.hotelTraceId,
                  hotelSearchTime: this.state.hotelSearchTime,
                }),
              });
            // details = { ...details, [newHotelDocRef.id]: travDetails };
          }
          if (type === "flights") {
            const flightDocRef = tripDocRef.collection("flights");
            //console.log(JSON.stringify(data), this.state.actions.arrToObj(data));
            var fd = data.map((flight) => {
              return this.state.actions.arrToObj([flight]);
            });
            await Promise.all(
              await fd.map(async (flight) => {
                // var travDetailsFlight = [];

                var docRef = await flightDocRef.add(flight);

                // for (var i = 0; i < flight[0].travellers; i++) {
                //   console.log("called");
                //   travDetailsFlight.push({
                //     firstName: "",
                //     lastName: "",
                //     type:
                //       i + 1 <= flight[0].adults
                //         ? "Adult"
                //         : i + 1 <= flight[0].adults + flight[0].child
                //         ? "Child"
                //         : "Infant",
                //   });
                // }
                await db
                  .collection("Accounts")
                  .doc(userId ? userId : this.state.userId)
                  .collection("trips")
                  .doc(id)
                  .update({
                    flights: arrayUnion({
                      id: docRef.id,
                      status: "Not Submitted",
                      date: new Date(),
                      requestStatus: "Not Requested",
                      note: "",
                      traceId: this.state.flightTraceId,
                      flightSearchTime: this.state.flightSearchTime,
                    }),
                  });
                // details = { ...details, [docRef.id]: travDetailsFlight };
              })
            );
          }
          if (type === "cabs") {
            const cabDocRef = tripDocRef.collection("cabs");
            var newCabDocRef = await cabDocRef.add(data);
            // var travDetailsCab = [];
            // travDetailsCab.push({
            //   firstName: "",
            //   lastName: "",
            //   type: "Adult",
            // });
            await db
              .collection("Accounts")
              .doc(this.state.userAccountDetails.userid)
              .collection("trips")
              .doc(tripDocRef.id)
              .update({
                cabs: arrayUnion({
                  date: new Date(),
                  requestStatus: "Not Requested",
                  id: newCabDocRef.id,
                  status: "Not Submitted",
                  note: "",
                }),
              });
            // details = { ...details, [newCabDocRef.id]: travDetailsCab };
          }
          if (type === "bus") {
            console.log("called");
            const busDocRef = tripDocRef.collection("bus");
            var busObjData = this.state.actions.arrToObj(data);
            // var newBusDocRef = await busDocRef.add(data);
            // var travDetailsBus = [];
            // travDetailsBus.push({
            //   firstName: "",
            //   lastName: "",
            //   type: "Adult",
            // });
            var newBusDocRef = await busDocRef.add(busObjData);
            await db
              .collection("Accounts")
              .doc(userId ? userId : this.state.userId)
              .collection("trips")
              .doc(id)
              .update({
                bus: arrayUnion({
                  id: newBusDocRef.id,
                  status: "Not Submitted",
                  date: new Date(),
                  requestStatus: "Not Requested",
                  note: "",
                  busSearchTime: this.state.busSearchTime,
                }),
              });
            // details = { ...details, [newBusDocRef.id]: travDetailsBus };
          }
          this.setState({ selectedSeats: [] });

          await this.state.actions.getTripDoc(
            id,
            userId ? userId : this.state.userId
          );
          await this.state.actions.getTripDocById(
            id,
            userId ? userId : this.state.userId
          );
        } catch (error) {
          console.log(error);
        }
      },
      addOtherBoookings: async (userId, id, data) => {
        console.log(data);
        try {
          var tripDocRef = db
            .collection("Accounts")
            .doc(userId)
            .collection("trips")
            .doc(id);
          const otherBookref = tripDocRef.collection("otherbookings");
          var newBusDocRef = await otherBookref.add(data);
          await db
            .collection("Accounts")
            .doc(userId)
            .collection("trips")
            .doc(id)
            .update({
              otherBookings: arrayUnion({
                id: newBusDocRef.id,
                status: "Submitted",
                date: new Date(),
                requestStatus: data.bookingStatus,
                fromAdmin: true,
                managerApprovedTime: "",
                note: "",
              }),
            });

          this.state.actions.addBookings(id, {
            id: newBusDocRef.id,
            adminComment: "",
            bookingPrice: data.bookingCost,
            bookingStatus: "Pending",
            bus: [],
            cabs: [],
            flights: [],
            hotels: [],
            comment: data.bookingComments,
            status: "Submitted",
            date: new Date(),
            requestStatus: data.bookingStatus,
            submissionStatus: "Submitted",
          });
          return {
            id: newBusDocRef.id,
            status: "Submitted",
            date: new Date(),
            requestStatus: data.bookingStatus,
            fromAdmin: true,
            managerApprovedTime: "",
            note: "",
          };
        } catch (error) {
          console.log(error);
        }
      },
      editTripByIdAdmin: async (id, data, type, userId) => {
        try {
          this.setState({
            searchingFlights: false,
            searchingHotels: false,
            fetchingHotelInfo: false,
            hotelInfoRes: false,
            flightResList: [],
            hotelResList: [],
            bookingFlight: [],
            bookingHotel: [],
          });
          this.state.actions.setFlightBookPage(false);
          var accountDocRef = db
            .collection("Accounts")
            .doc(this.state.adminDetails.userid);
          var tripCollectionRef = accountDocRef.collection("trips");
          var tripQuery = tripCollectionRef.where("tripId", "==", id);
          var querysnapshot = await tripQuery.get();
          var tripDocRef = db
            .collection("Accounts")
            .doc(userId)
            .collection("trips")
            .doc(id);
          var adminDocRef = querysnapshot.docs[0].ref;
          if (type === "hotels") {
            const hotelDocRef = tripDocRef.collection("hotels");
            var newHotelDocRef = await hotelDocRef.add(data);
            await db
              .collection("Accounts")
              .doc(userId)
              .collection("trips")
              .doc(id)
              .update({
                hotels: arrayUnion({
                  id: newHotelDocRef.id,
                  status: "Submitted,Payment Pending",
                  date: new Date(),
                  requestStatus: "Not Requested",
                }),
              });
            await adminDocRef.update({
              hotels: arrayUnion({
                id: newHotelDocRef.id,
                status: "Submitted,Payment Pending",
                date: new Date(),
                requestStatus: "Not Requested",
              }),
            });
          }
          if (type === "flights") {
            const flightDocRef = tripDocRef.collection("flights");
            var fd = data.map((flight) => {
              return this.state.actions.arrToObj([flight]);
            });
            await Promise.all(
              await fd.map(async (flight) => {
                var docRef = await flightDocRef.add(flight);
                await db
                  .collection("Accounts")
                  .doc(userId)
                  .collection("trips")
                  .doc(id)
                  .update({
                    flights: arrayUnion({
                      id: docRef.id,
                      status: "Submitted,Payment Pending",
                      date: new Date(),
                      requestStatus: "Not Requested",
                    }),
                  });
                await adminDocRef.update({
                  flights: arrayUnion({
                    id: docRef.id,
                    status: "Submitted,Payment Pending",
                    date: new Date(),
                    requestStatus: "Not Requested",
                  }),
                });
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
      getUserTripsById: async (id) => {
        var accountsRef = await db
          .collection("Accounts")
          .doc(id)
          .collection("trips")
          .get();
        var adminTrips = [];

        accountsRef.forEach((doc) => {
          var data = doc.data();
          if (doc.data().status === "Submitted,Payment Pending") {
            adminTrips.push({
              data,
              id: doc.id,
            });
          }
        });
        this.setState({
          adminUserTrips: adminTrips,
        });
        return adminTrips;
        //var querySnapshot = await roleQuery.get();
      },
      getUserById: async (id) => {
        try {
          var userCollectionRef = db.collection("Accounts").doc(id);
          var doc = await userCollectionRef.get();
          var userData = await doc.data();
          var manager = {};

          if (userData.role !== "admin") {
            if (Object.keys(userData.manager).length > 0) {
              var managerCollectionRef = db
                .collection("Accounts")
                .doc(userData.manager.userId);
              var managerDoc = await managerCollectionRef.get();
              var managerData = await managerDoc.data();
              manager = {
                name: managerData?.firstName,
                email: managerData?.email,
                userId: userData.manager.userId,
              };
            }
          }
          this.state.actions.setUserAccountDetails({ ...userData, manager });
          this.setState({
            userLoginStatus: {
              loggedIn: true,
              isLoading: false,
              status: "loggedIn",
              role: userData.role,
            },
            notifications: userData?.notifications,
            teamMembers: userData?.teamMembers,
            noOfPages: Math.ceil(userData?.trips?.length / 10) - 1,
          });

          if ((await userData.role) === "admin") {
            this.setState({
              role: "admin",
            });
            this.state.actions.getAllUserTrips();
          }
          return userData.role;
        } catch (error) {
          console.log("Error", error);
        }
      },
      getUserByIdAdmin: async (id, page = 1) => {
        this.setState({
          adminUserLoading: true,
        });

        const TRIPS_PER_PAGE = 10;

        var userCollectionRef = db.collection("Accounts").doc(id);
        var doc = await userCollectionRef.get();
        var userData = await doc.data();

        var trips = [];

        if (userData.trips.length > 0) {
          let tripQuery = userCollectionRef
            .collection("trips")
            .orderBy("date", "desc")
            .limit(TRIPS_PER_PAGE);

          // Calculate the number of documents to skip
          const documentsToSkip = (page - 1) * TRIPS_PER_PAGE;

          if (documentsToSkip > 0) {
            const snapshot = await tripQuery.limit(documentsToSkip).get();
            const lastVisible = snapshot.docs[snapshot.docs.length - 1];
            tripQuery = tripQuery.startAfter(lastVisible);
          }

          var tripDocs = await tripQuery.get();

          trips = tripDocs.docs.map((tripDoc) => ({
            id: tripDoc.id,
            data: tripDoc.data(),
          }));
        }

        // Get the total number of trips
        const totalTripsSnapshot = await userCollectionRef
          .collection("trips")
          .get();
        const totalTrips = totalTripsSnapshot.size;

        const data1 = {
          ...userData,
          trips,
          totalTrips,
          currentPage: page,
        };

        this.setState({
          adminUserLoading: false,
          adminUserData: data1,
        });

        return data1;
      },

      setSelectedTripId: async (value) => {
        try {
          var docCollectionRef = db
            .collection("Accounts")
            .doc(this.state.userId)
            .collection("trips")
            .doc(value);
          var doc = await docCollectionRef.get();
          var flights = await this.state.actions.getAllFlights(
            doc.id,
            this.state.userId
          );
          var hotels = await this.state.actions.getAllHotels(
            doc.id,
            this.state.userId
          );
          this.state.actions.setSelectedTrip({
            id: doc.id,
            data: doc.data(),
            hotels: hotels,
            flights: flights,
          });
          this.setState({
            selectedTripId: value,
          });
        } catch (error) {
          console.log(error);
        }
      },
      setSelectedTrip: async (value) => {
        this.setState({
          selectedTrip: value,
        });
      },
      setSelectedId: async (value) => {
        this.setState({
          selectedTripId: null,
        });
      },
      setRes: async () => {
        this.setState({
          searchingFlights: false,
          searchingHotels: false,
          fetchingHotelInfo: false,
          hotelInfoRes: false,
          flightResList: [],
          hotelResList: [],
          bookingFlight: [],
          cabResList: [],
          searchingCabs: false,
          bookingHotel: [],
          busResList: [],
          searchingBus: false,
          fetchingBusSeat: false,
          NoofBusPassengers: 1,
          busErrorMessage: false,
          bookingBus: false,
        });

        this.state.actions.setFlightBookPage(false);
      },
      createNewTrip: async (name, type, data) => {
        var accountDocRef = db
          .collection("Accounts")
          .doc(this.state.userAccountDetails.userid);
        var tripcollectionRef = accountDocRef.collection("trips");
        var newtripdocRef = await tripcollectionRef.add({
          flights: [],
          hotels: [],
          cabs: [],
          bus: [],
          date: new Date(),
          name: newTripCompleteString,
          status: "Not Submitted",
        });
        var tripDocRef = db
          .collection("Accounts")
          .doc(this.state.userAccountDetails.userid)
          .collection("trips")
          .doc(newtripdocRef.id);
        await updateDoc(tripDocRef, {
          name: name,
        });
        await db
          .collection("Accounts")
          .doc(this.state.userId)
          .update({
            trips: arrayUnion(newtripdocRef.id),
          });
        if (type === "hotels") {
          const hotelDocRef = tripDocRef.collection("hotels");
          var newDocRef = await hotelDocRef.add(data);
          await db
            .collection("Accounts")
            .doc(this.state.userAccountDetails.userid)
            .collection("trips")
            .doc(tripDocRef.id)
            .update({
              hotels: arrayUnion({
                date: new Date(),
                requestStatus: "Not Requested",
                id: newDocRef.id,
                status: "Not Submitted",
                note: "",
                hotelTraceId: this.state.hotelTraceId,
                hotelSearchTime: this.state.hotelSearchTime,
              }),
            });
        }
        if (type === "flights") {
          const hotelDocRef = tripDocRef.collection("flights");

          var fd = data.map((flight) => {
            return this.state.actions.arrToObj([flight]);
          });
          var changedObj = data.map((flight) => {
            return this.state.actions.objToArr(flight);
          });

          this.setState({
            bookingFlight: changedObj,
          });
          // fd.map(async (flight) => {
          //   var flightDocRef = await hotelDocRef.add(flight);
          //   await db
          //     .collection("Accounts")
          //     .doc(this.state.userId)
          //     .collection("trips")
          //     .doc(tripDocRef.id)
          //     .update({
          //       flights: arrayUnion({
          //         date: new Date(),
          //         requestStatus: "Not Requested",
          //         id: flightDocRef.id,
          //         status: "Not Submitted"
          //       })
          //     });
          // })
          await Promise.all(
            await fd.map(async (flight) => {
              var docRef = await hotelDocRef.add(flight);

              await db
                .collection("Accounts")
                .doc(this.state.userId)
                .collection("trips")
                .doc(tripDocRef.id)
                .update({
                  flights: arrayUnion({
                    id: docRef.id,
                    status: "Not Submitted",
                    date: new Date(),
                    requestStatus: "Not Requested",
                    note: "",
                    flightSearchTime: this.state.flightSearchTime,
                    traceId: this.state.flightTraceId,
                  }),
                });
            })
          );
          // this.setState({
          //   bookingFlight: data
          // })
        }
        if (type === "cabs") {
          const cabDocRef = tripDocRef.collection("cabs");
          console.log(data);
          var newCabDocRef = await cabDocRef.add(data);
          await db
            .collection("Accounts")
            .doc(this.state.userAccountDetails.userid)
            .collection("trips")
            .doc(tripDocRef.id)
            .update({
              cabs: arrayUnion({
                date: new Date(),
                requestStatus: "Not Requested",
                id: newCabDocRef.id,
                status: "Not Submitted",
                note: "",
              }),
            });
        }
        if (type === "bus") {
          const busDocRef = tripDocRef.collection("bus");
          var busObjData = this.state.actions.arrToObj(data);
          var newBusDocRef = await busDocRef.add(busObjData);
          await db
            .collection("Accounts")
            .doc(this.state.userAccountDetails.userid)
            .collection("trips")
            .doc(tripDocRef.id)
            .update({
              bus: arrayUnion({
                date: new Date(),
                requestStatus: "Not Requested",
                id: newBusDocRef.id,
                status: "Not Submitted",
                note: "",
                busSearchTime: this.state.busSearchTime,
              }),
            });
        }
        this.setState({ selectedSeats: [] });
        await this.state.actions.getTripDoc(
          newtripdocRef.id,
          this.state.userId
        );
        //await this.state.actions.getAllTrips(this.state.userAccountDetails.userid);
        return newtripdocRef.id;
      },
      addExpenseToTrip: async (
        id,
        type,
        file,
        cost,
        description,
        expenseDate
      ) => {
        try {
          var tripDocRef = db
            .collection("Accounts")
            .doc(this.state.userAccountDetails.userid)
            .collection("trips")
            .doc(id);
          const hotelDocRef = tripDocRef.collection("expenses");
          var newHotelDocRef = await hotelDocRef.add({
            type,
            cost,
            description,
            expenseDate,
          });
          const storageRef = ref(
            storage,
            `trips/${this.state.userId}/${id}/expenses/${newHotelDocRef.id}/` +
              file.name
          );
          await uploadBytes(storageRef, file);
          var downloadURL = await getDownloadURL(storageRef);
          var expenseDocRef = hotelDocRef.doc(newHotelDocRef.id);
          await updateDoc(expenseDocRef, { file: downloadURL });
          await db
            .collection("Accounts")
            .doc(this.state.userId)
            .collection("trips")
            .doc(id)
            .update({
              expenses: arrayUnion({
                id: newHotelDocRef.id,
                date: new Date(),
              }),
            });
        } catch (error) {
          console.log(error);
        }
      },
      createAdminNewtrip: async (name, type, data, userId) => {
        var accountDocRef = db.collection("Accounts").doc(userId);
        var tripcollectionRef = accountDocRef.collection("trips");
        var newtripdocRef = await tripcollectionRef.add({
          flights: [],
          hotels: [],
          date: new Date(),
          name: newTripCompleteString,
          status: "Submitted,Payment Pending",
        });
        var tripDocRef = db
          .collection("Accounts")
          .doc(userId)
          .collection("trips")
          .doc(newtripdocRef.id);
        await updateDoc(tripDocRef, {
          name: name,
        });
        await db
          .collection("Accounts")
          .doc(userId)
          .update({
            trips: arrayUnion(newtripdocRef.id),
          });
        var hotelArray = [];
        var flightArray = [];
        if (type === "hotels") {
          const hotelDocRef = tripDocRef.collection("hotels");
          var newDocRef = await hotelDocRef.add(data);
          await db
            .collection("Accounts")
            .doc(userId)
            .collection("trips")
            .doc(tripDocRef.id)
            .update({
              hotels: arrayUnion({
                date: new Date(),
                requestStatus: "Not Requested",
                id: newDocRef.id,
                status: "Submitted,Payment Pending",
              }),
            });
          hotelArray.push({
            date: new Date(),
            requestStatus: "Not Requested",
            id: newDocRef.id,
            status: "Submitted,Payment Pending",
          });
        }
        if (type === "flights") {
          const hotelDocRef = tripDocRef.collection("flights");

          var fd = data.map((flight) => {
            return this.state.actions.arrToObj([flight]);
          });
          var changedObj = data.map((flight) => {
            return this.state.actions.objToArr(flight);
          });

          this.setState({
            bookingFlight: changedObj,
          });
          await Promise.all(
            await fd.map(async (flight) => {
              var docRef = await hotelDocRef.add(flight);
              await db
                .collection("Accounts")
                .doc(userId)
                .collection("trips")
                .doc(tripDocRef.id)
                .update({
                  flights: arrayUnion({
                    id: docRef.id,
                    status: "Submitted,Payment Pending",
                    date: new Date(),
                    requestStatus: "Not Requested",
                  }),
                });
              flightArray.push({
                date: new Date(),
                requestStatus: "Not Requested",
                id: docRef.id,
                status: "Submitted,Payment Pending",
              });
            })
          );
        }
        var docCollectionRef = db
          .collection("Accounts")
          .doc(this.state.adminDetails.userid);
        var userDoc = db.collection("Accounts").doc(userId);
        var userSnapshot = await userDoc.get();
        var userData = userSnapshot.data();
        var tripCollectionRef = docCollectionRef.collection("trips");
        var newtripDocRef = await tripCollectionRef.add({
          userDetails: userData,
          tripId: newtripdocRef.id,
          tripName: name,
          hotels: hotelArray,
          flights: flightArray,
          status: "Not Submitted",
          submittedDate: Date.now(),
        });
        await updateDoc(docCollectionRef, {
          trips: arrayUnion(newtripDocRef.id),
        });
        return newtripdocRef.id;
      },
      addTripsToAdmin: async (
        tripId,
        data,
        userDetails,
        submittedHotels,
        submittedFlights,
        submittedCabs,
        submittedBus,
        comment,
        userId,
        requestStatus
      ) => {
        console.log(userId);
        const userCollectionRef = db.collection("Accounts").doc(userId);
        const doc = await userCollectionRef.get();
        const userData = doc.data();
        var docCollectionRef = db
          .collection("Accounts")
          .doc(this.state.adminDetails.userid);
        var tripCollectionRef = docCollectionRef.collection("trips");
        var data1 = await this.state.actions.getTripDocById(
          tripId,
          userId ? userId : this.state.userAccountDetails.userid
        );
        var hotelArray = [];
        hotelArray = submittedHotels?.map((hotel) => {
          return { status: "Not Submitted", id: hotel };
        });
        var flightArray = [];
        flightArray = submittedFlights.map((flight) => {
          return { status: "Not Submitted", id: flight };
        });

        var cabArray = [];
        cabArray = submittedCabs.map((flight) => {
          return { status: "Not Submitted", id: flight };
        });
        var busArray = [];
        busArray =
          submittedBus.length > 0
            ? submittedBus.map((flight) => {
                return { status: "Not Submitted", id: flight };
              })
            : [];

        var newtripDocRef = await tripCollectionRef.add({
          userDetails: userData ? userData : this.state.userAccountDetails,
          tripId: tripId,
          tripName: data1?.name,
          hotels: hotelArray,
          flights: flightArray,
          cabs: cabArray,
          status: "Not Submitted",
          submittedDate: Date.now(),
          travellerDetails: userDetails,
          bus: busArray,
          comment: comment,
        });
        var adminRef = await db
          .collection("Accounts")
          .doc(this.state.adminDetails.userid);
        await updateDoc(adminRef, {
          trips: arrayUnion(newtripDocRef.id),
        });
        var accountCollectionRef = db
          .collection("Accounts")
          .doc(userId ? userId : this.state.userId);
        var tripCollectionRefe = accountCollectionRef
          .collection("trips")
          .doc(tripId);
        await tripCollectionRefe.update({
          status: "Submitted",
          travellerDetails: userDetails,
        });
        if (flightArray) {
          flightArray.map((flight) => {
            return this.state.actions.editTripStatus(
              userId ? userId : this.state.userId,
              tripId,
              newtripDocRef.id,
              "Submitted",
              flight.id,
              "flight"
            );
          });
        }
        if (hotelArray) {
          hotelArray.map((hotel) => {
            return this.state.actions.editTripStatus(
              this.state.userId,
              tripId,
              newtripDocRef.id,
              "Submitted",
              hotel.id,
              "add"
            );
          });
        }
        if (cabArray) {
          cabArray.map((cab) => {
            return this.state.actions.editTripStatus(
              this.state.userId,
              tripId,
              newtripDocRef.id,
              "Submitted",
              cab.id,
              "cabs"
            );
          });
        }
        if (busArray) {
          busArray.map((cab) => {
            return this.state.actions.editTripStatus(
              this.state.userId,
              tripId,
              newtripDocRef.id,
              "Submitted",
              cab.id,
              "bus"
            );
          });
        }
      },
      getAdminData: async () => {
        try {
          var docCollectionRef = db
            .collection("Accounts")
            .doc(this.state.adminDetails.userid);
          var adminTrips = [];
          var tripsDocRef = docCollectionRef.collection("trips");
          var trips = await tripsDocRef.get();
          trips.forEach((doc) => {
            adminTrips.push({
              data: doc.data(),
            });
          });
        } catch (error) {
          console.log(error);
        }
      },
      setHotelRating: (value) => {
        this.setState({
          hotelRating: value,
        });
      },
      setHotelPriceStart: (value) => {
        this.setState({
          hotelPriceStart: value,
        });
      },
      setHotelPriceEnd: (value) => {
        this.setState({
          hotelPriceEnd: value,
        });
      },
      setHotelSearchText: (value) => {
        this.setState({
          hotelSearchText: value,
        });
      },
      filterHotels: (hotelResList) => {
        // console.log(this.state.byDuration);
        var filteredArr = hotelResList;

        if (this.state.hotelRating) {
          //console.log(this.state.hotelRating);
          filteredArr = filteredArr.filter(
            (hotel) => hotel.StarRating === this.state.hotelRating
          );
        }
        if (this.state.hotelPriceStart && this.state.hotelPriceEnd) {
          //console.log(this.state.hotelPriceStart, this.state.hotelPriceEnd);
          filteredArr = filteredArr.filter((hotel) => {
            return (
              hotel.Price.OfferedPriceRoundedOff >=
                this.state.hotelPriceStart &&
              hotel.Price.OfferedPriceRoundedOff < this.state.hotelPriceEnd
            );
          });
        }
        if (this.state.hotelSearchText) {
          filteredArr = filteredArr.filter((hotel) => {
            const staticData = this.state.hotelStaticData[hotel.HotelCode];
            if (hotel.HotelName) {
              return hotel.HotelName.toLowerCase().includes(
                this.state.hotelSearchText.toLowerCase()
              );
            } else {
              return staticData?.HotelName.toLowerCase().includes(
                this.state.hotelSearchText.toLowerCase()
              );
            }
          });
        }
        return filteredArr;
      },
      setTotalTrips: async (value) => {
        this.setState({
          totalTrips: value,
        });
      },
      getAllUserTrips: async () => {
        try {
          var accCollectionRef = await db.collection("Accounts").get();
          var allTrips = [];
          for (const accountDoc of accCollectionRef.docs) {
            const tripsSnapshot = await accountDoc.ref
              .collection("trips")
              .get();
            tripsSnapshot.forEach(async (tripDoc) => {
              var userData = accountDoc.data();
              var hotels = await this.state.actions.getAllHotels(tripDoc.id);
              var flights = await this.state.actions.getAllFlights(tripDoc.id);
              const tripData = tripDoc.data();
              allTrips.push({
                accountId: accountDoc.id,
                userDetails: userData,
                tripId: tripDoc.id,
                hotelData: hotels,
                flightData: flights,
                ...tripData,
              });
            });
          }
          this.state.actions.setTotalTrips(allTrips);
        } catch (error) {
          console.log(error);
        }
      },

      addBookings: async (tripId, newBooking) => {
        var accountCollectionRef = db
          .collection("Accounts")
          .doc(this.state.userId);
        const tripCollectionRef = doc(accountCollectionRef, "trips", tripId);
        try {
          const userTripDetails = await getDoc(tripCollectionRef);
          if (userTripDetails.exists()) {
            // Check if bookings array exists
            const tripData = userTripDetails.data();
            let updatedBookings = [];

            if (tripData.bookings) {
              // Bookings array exists, concatenate it with the new array
              updatedBookings = [...tripData.bookings, ...newBooking];
            } else {
              // Bookings array does not exist, create it with the new array
              updatedBookings = newBooking;
            }

            // Update the document with the updated bookings array
            await updateDoc(tripCollectionRef, {
              bookings: updatedBookings,
            });
          } else {
            console.log("Trip document does not exist.");
          }
        } catch (error) {
          console.error("Error updating bookings:", error);
        }
      },
      updateBookingStatus: async (tripId, indexes, adminComment) => {
        var accountCollectionRef = db
          .collection("Accounts")
          .doc(this.state.userId);
        const tripCollectionRef = doc(accountCollectionRef, "trips", tripId);
        try {
          const userTripDetails = await getDoc(tripCollectionRef);
          if (userTripDetails.exists()) {
            const tripData = userTripDetails.data();
            if (tripData.bookings) {
              if (tripData.bookings.length) {
                // Update the specific field in the booking object at the given index
                const updatedBookings = [...tripData.bookings];
                indexes.forEach((index) => {
                  const key = `Booking${index + 1}`;
                  if (index >= 0 && index < updatedBookings.length) {
                    updatedBookings[index] = {
                      ...updatedBookings[index],
                      submissionStatus: "Submitted",
                      // adminComment:"fhf"
                      adminComment: adminComment[key] ?? "",
                      submissionDate: new Date(),
                    };
                  } else {
                    console.log(`Invalid index provided: ${index}`);
                  }
                });

                await updateDoc(tripCollectionRef, {
                  bookings: updatedBookings,
                });

                console.log(`Successfully updated field:`);
              } else {
                console.log("Invalid index provided.");
              }
            } else {
              console.log("No bookings to update.");
            }
          } else {
            console.log("Trip document does not exist.");
          }
        } catch (error) {
          console.error("Error updating booking field at index:", error);
        }
      },
      editTripStatus: async (
        userId,
        tripId,
        adminTripId,
        status,
        hotelId,
        type
      ) => {
        try {
          if (type === "add") {
            var accountCollectionRef = db.collection("Accounts").doc(userId);
            var tripCollectionRef = accountCollectionRef
              .collection("trips")
              .doc(tripId);

            var userHotelDetails = await tripCollectionRef.get();
            console.log(userHotelDetails);
            var userHotelArray = userHotelDetails.data()?.hotels;
            var userCurrHotel = userHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(tripCollectionRef, {
              hotels: arrayRemove(userCurrHotel[0]),
            });
            await updateDoc(tripCollectionRef, {
              hotels: arrayUnion({
                ...userCurrHotel[0],
                status: status,
                submitted_date: userCurrHotel[0].submitted_date
                  ? userCurrHotel[0].submitted_date
                  : new Date(),
                booked_date:
                  status === "Booked" || status === "Booked,Payment Pending"
                    ? new Date()
                    : null,
              }),
            });
            if (status === "Cancelled") {
              var busDocRef = tripCollectionRef
                .collection("hotels")
                .doc(hotelId);
              var updateFields = {
                calculateGstFromService: 0,
                hotelTotalPrice: 0,
                hotelServiceCharge: 0,
              };
              busDocRef
                .update(updateFields)
                .then(() => {
                  console.log("Bus document successfully updated!");
                })
                .catch((error) => {
                  console.error("Error updating bus document: ", error);
                });
            }
            var adminCollectionRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollectionRef = adminCollectionRef
              .collection("trips")
              .doc(adminTripId);
            var adminHotelDetails = await admintripCollectionRef.get();
            var adminHotelArray = adminHotelDetails.data().hotels;
            var admincurrHotel = adminHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(admintripCollectionRef, {
              hotels: arrayRemove(admincurrHotel[0]),
            });
            console.log(status);
            if (status === "Booked" || status === "Booked,Payment Pending") {
              await updateDoc(admintripCollectionRef, {
                hotels: arrayUnion({
                  ...userCurrHotel[0],
                  status: status,
                  bookedAt: Date.now(),
                }),
              });
            } else {
              await updateDoc(admintripCollectionRef, {
                hotels: arrayUnion({
                  ...userCurrHotel[0],
                  status: status,
                  submitted_date: new Date(),
                }),
              });
            }
          }
          if (type === "flight") {
            var accCollectionRef = db.collection("Accounts").doc(userId);
            var tripCollecRef = accCollectionRef
              .collection("trips")
              .doc(tripId);
            var userFlightDetails = await tripCollecRef.get();
            var userFlightArray = userFlightDetails.data().flights;
            var userCurrFlight = userFlightArray.filter((flight) => {
              return flight.id === hotelId;
            });
            await updateDoc(tripCollecRef, {
              flights: arrayRemove(userCurrFlight[0]),
            });

            await updateDoc(tripCollecRef, {
              flights: arrayUnion({
                ...userCurrFlight[0],
                status: status,
                submitted_date: userCurrFlight[0].submitted_date
                  ? userCurrFlight[0].submitted_date
                  : new Date(),
                booked_date:
                  status === "Booked" || status === "Booked,Payment Pending"
                    ? new Date()
                    : null,
              }),
            });
            if (status === "Cancelled") {
              var busDocRef = tripCollecRef.collection("flights").doc(hotelId);
              var updateFields = {
                "0.gstInFinalserviceCharge": 0,
                "0.totalFare": 0,
                "0.finalFlightServiceCharge": 0,
                "0.finalPrice": 0,
                "0.seatCharges": 0,
                "0.totalMealPrice": 0,
                "0.totalBaggagePrice": 0,
                "0.totalSeatPrice": 0,
              };
              busDocRef
                .update(updateFields)
                .then(() => {
                  console.log("Bus document successfully updated!");
                })
                .catch((error) => {
                  console.error("Error updating bus document: ", error);
                });
            }
            var adminCollecRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollecRef = adminCollecRef
              .collection("trips")
              .doc(adminTripId);
            var adminFlightDetails = await admintripCollecRef.get();
            var adminFlightArray = adminFlightDetails.data().flights;
            var flightArray = Object.values(adminFlightArray);
            var admincurrFlight = flightArray.filter((flight) => {
              return flight.id === hotelId;
            });
            await updateDoc(admintripCollecRef, {
              flights: arrayRemove(admincurrFlight[0]),
            });

            if (status === "Booked" || status === "Booked,Payment Pending") {
              await updateDoc(admintripCollecRef, {
                flights: arrayUnion({
                  ...userCurrFlight[0],
                  status: status,
                  bookedAt: Date.now(),
                }),
              });
            } else {
              await updateDoc(admintripCollecRef, {
                flights: arrayUnion({
                  ...userCurrFlight[0],
                  status: status,
                  submitted_date: new Date(),
                }),
              });
            }
          }
          if (type === "cabs") {
            var accountCollecRef = db.collection("Accounts").doc(userId);
            var tripColleRef = accountCollecRef.collection("trips").doc(tripId);
            var userCabDetails = await tripColleRef.get();
            var userCabsArray = userCabDetails.data().cabs;
            var userCurrCabs = userCabsArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            console.log(userCurrCabs);
            await updateDoc(tripColleRef, {
              cabs: arrayRemove(userCurrCabs[0]),
            });

            await updateDoc(tripColleRef, {
              cabs: arrayUnion({
                ...userCurrCabs[0],
                status: status,
                submitted_date: userCurrCabs[0].submitted_date
                  ? userCurrCabs[0].submitted_date
                  : new Date(),
                booked_date:
                  status === "Booked" || status === "Booked,Payment Pending"
                    ? new Date()
                    : null,
              }),
            });
            if (status === "Cancelled") {
              var busDocRef = tripColleRef.collection("cabs").doc(hotelId);
              var updateFields = {
                gstInFinalserviceCharge: 0,
                cabTotalPrice: 0,
                finalServiceCharge: 0,
              };
              busDocRef
                .update(updateFields)
                .then(() => {
                  console.log("Bus document successfully updated!");
                })
                .catch((error) => {
                  console.error("Error updating bus document: ", error);
                });
            }
            var adminCollectRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);

            var admintripCollectRef = adminCollectRef
              .collection("trips")
              .doc(adminTripId);
            var adminCabsDetails = await admintripCollectRef.get();
            var adminCabsArray = adminCabsDetails.data().cabs;
            var admincurrCabs = adminCabsArray.filter((hotel) => {
              return hotel.id === hotelId;
            });

            await updateDoc(admintripCollectRef, {
              cabs: arrayRemove(admincurrCabs[0]),
            });

            if (status === "Booked" || status === "Booked,Payment Pending") {
              await updateDoc(admintripCollectRef, {
                cabs: arrayUnion({
                  ...userCurrCabs[0],
                  status: status,
                  bookedAt: Date.now(),
                }),
              });
            } else {
              await updateDoc(admintripCollectRef, {
                cabs: arrayUnion({
                  ...userCurrCabs[0],
                  status: status,
                  submitted_date: new Date(),
                }),
              });
            }
          }
          if (type === "bus") {
            var accountCollectRef = db.collection("Accounts").doc(userId);
            var tripCollRef = accountCollectRef.collection("trips").doc(tripId);
            var userBusDetails = await tripCollRef.get();
            var userBussArray = userBusDetails.data().bus;
            var userCurrBuss = userBussArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(tripCollRef, {
              bus: arrayRemove(userCurrBuss[0]),
            });

            await updateDoc(tripCollRef, {
              bus: arrayUnion({
                ...userCurrBuss[0],
                status: status,
                submitted_date: userCurrBuss[0].submitted_date
                  ? userCurrBuss[0].submitted_date
                  : new Date(),
                booked_date:
                  status === "Booked" || status === "Booked,Payment Pending"
                    ? new Date()
                    : null,
              }),
            });
            if (status === "Cancelled") {
              var busDocRef = tripCollRef.collection("bus").doc(hotelId);
              var updateFields = {
                GST: 0,
                busTotalPrice: 0,
                serviceCharge: 0,
              };
              busDocRef
                .update(updateFields)
                .then(() => {
                  console.log("Bus document successfully updated!");
                })
                .catch((error) => {
                  console.error("Error updating bus document: ", error);
                });
            }
            var adminCollRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);

            var admintripCollRef = adminCollRef
              .collection("trips")
              .doc(adminTripId);
            var adminBusDetails = await admintripCollRef.get();
            var adminBusArray = adminBusDetails.data().bus;
            var admincurrBus = adminBusArray.filter((hotel) => {
              return hotel.id === hotelId;
            });

            await updateDoc(admintripCollRef, {
              bus: arrayRemove(admincurrBus[0]),
            });

            if (status === "Booked" || status === "Booked,Payment Pending") {
              await updateDoc(admintripCollRef, {
                bus: arrayUnion({
                  ...userCurrBuss[0],
                  status: status,
                  bookedAt: Date.now(),
                }),
              });
            } else {
              await updateDoc(admintripCollRef, {
                bus: arrayUnion({
                  ...userCurrBuss[0],
                  status: status,
                  submitted_date: new Date(),
                }),
              });
            }
          }
          if (type === "other") {
            var accountCollectRef = db.collection("Accounts").doc(userId);
            var tripCollRef = accountCollectRef.collection("trips").doc(tripId);
            var userBusDetails = await tripCollRef.get();
            console.log(userBusDetails.data().otherBookings);
            var userBussArray = userBusDetails.data().otherBookings;
            var userCurrBuss = userBussArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(tripCollRef, {
              otherBookings: arrayRemove(userCurrBuss[0]),
            });

            await updateDoc(tripCollRef, {
              otherBookings: arrayUnion({
                ...userCurrBuss[0],
                status: status,
                booked_date:
                  status === "Booked" || status === "Booked,Payment Pending"
                    ? new Date()
                    : null,
              }),
            });
            if (status === "Cancelled") {
              var busDocRef = tripCollRef
                .collection("otherbookings")
                .doc(hotelId);
              var updateFields = {
                bookingCost: 0,
                bookingGst: 0,
                bookingService: 0,
                overallBookingPrice: 0,
              };
              busDocRef
                .update(updateFields)
                .then(() => {
                  console.log("Bus document successfully updated!");
                })
                .catch((error) => {
                  console.error("Error updating bus document: ", error);
                });
            }

            var adminCollRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);

            var admintripCollRef = adminCollRef
              .collection("trips")
              .doc(adminTripId);
            var adminBusDetails = await admintripCollRef.get();
            var adminBusArray = adminBusDetails.data().otherBookings;
            console.log(adminBusArray);
            var admincurrBus = adminBusArray.filter((hotel) => {
              return hotel.id === hotelId;
            });

            await updateDoc(admintripCollRef, {
              otherBookings: arrayRemove(admincurrBus[0]),
            });

            if (status === "Booked" || status === "Booked,Payment Pending") {
              await updateDoc(admintripCollRef, {
                otherBookings: arrayUnion({
                  ...userCurrBuss[0],
                  status: status,
                  bookedAt: Date.now(),
                }),
              });
            } else {
              await updateDoc(admintripCollRef, {
                otherBookings: arrayUnion({
                  ...userCurrBuss[0],
                  status: status,
                }),
              });
            }
          }
          await this.state.actions.getTripDoc(
            tripId,
            userId ? userId : this.state.userId
          );
          // await this.state.actions.getTripDocById(tripId,userId)
        } catch (error) {
          console.log(error);
        }
      },
      updateTravDetails: async (travellerDetails, tripId, userId) => {
        var tripDocRef = db
          .collection("Accounts")
          .doc(userId ? userId : this.state.userId)
          .collection("trips")
          .doc(tripId);
        var tripSnap = await tripDocRef.get();
        var tripData = tripSnap.data();
        var travDetails = tripData?.travellerDetails;
        var newTravDetails = { ...travDetails, ...travellerDetails };
        await tripDocRef.update({
          travellerDetails: newTravDetails,
        });
        await this.state.actions.getTripDoc(
          tripId,
          userId ? userId : this.state.userId
        );
      },
      editOtherAdminTrip: async (
        tripId,
        travellerDetails,
        submittedOtherBookings,
        user,
        userId,
        templateData
      ) => {
        try {
          const { getTripDocById, sendBookingSubmitEmail, addOtherAdminTrips } =
            this.state.actions;
          const accountDocRef = db
            .collection("Accounts")
            .doc(this.state.adminDetails.userid);
          const tripCollectionRef = accountDocRef.collection("trips");
          const tripQuery = tripCollectionRef.where("tripId", "==", tripId);

          const data1 = await getTripDocById(tripId, userId);
          const querysnapshot = await tripQuery.get();

          const hotelArray = [];
          const flightArray = [];
          const cabArray = [];
          const busArray = [];
          const newOtherBookings = Array.isArray(submittedOtherBookings)
            ? submittedOtherBookings
            : [submittedOtherBookings];

          const userFullName = `${user.firstName} ${user.lastName}`;
          await sendBookingSubmitEmail({
            id: userId,
            name: userFullName,
            email: user.email,
            tripName: data1?.name,
            templateData,
          });

          if (!querysnapshot.empty) {
            const docRef = querysnapshot.docs[0].ref;
            const admintripdata = querysnapshot.docs[0].data();

            if (admintripdata) {
              const existingOtherBookings = Array.isArray(
                admintripdata.otherBookings
              )
                ? admintripdata.otherBookings
                : [];

              // Merge new bookings with existing ones
              const updatedOtherBookings = [
                ...existingOtherBookings,
                ...newOtherBookings,
              ];

              await docRef.update({
                hotels: [...admintripdata.hotels, ...hotelArray],
                flights: [...admintripdata.flights, ...flightArray],
                travellerDetails: travellerDetails,
                cabs: [...admintripdata.cabs, ...cabArray],
                bus: [...admintripdata.bus, ...busArray],
                otherBookings: updatedOtherBookings, // Update with the combined array
              });
            } else {
              console.error("admintripdata is undefined");
            }
          } else {
            await addOtherAdminTrips(
              tripId,
              travellerDetails,
              newOtherBookings,
              user,
              userId
            );
          }
        } catch (error) {
          console.error("Error in editOtherAdminTrip:", error);
        }
      },

      addOtherAdminTrips: async (
        tripId,
        travellerDetails,
        submittedOtherBookings,
        user,
        userId
      ) => {
        var docCollectionRef = db
          .collection("Accounts")
          .doc(this.state.adminDetails.userid);
        var tripCollectionRef = docCollectionRef.collection("trips");
        var data1 = await this.state.actions.getTripDocById(tripId, userId);
        var hotelArray = [];
        var flightArray = [];
        var cabArray = [];
        var busArray = [];
        var otherBookings = submittedOtherBookings;
        var newtripDocRef = await tripCollectionRef.add({
          userDetails: user,
          tripId: tripId,
          tripName: data1?.name,
          hotels: hotelArray,
          flights: flightArray,
          cabs: cabArray,
          status: "Submitted",
          submittedDate: Date.now(),
          travellerDetails: travellerDetails,
          bus: busArray,
          otherBookings: otherBookings,
          comment: "",
        });
        var adminRef = await db
          .collection("Accounts")
          .doc(this.state.adminDetails.userid);
        await updateDoc(adminRef, {
          trips: arrayUnion(newtripDocRef.id),
        });
        var accountCollectionRef = db
          .collection("Accounts")
          .doc(this.state.userId);
        var tripCollectionRefe = accountCollectionRef
          .collection("trips")
          .doc(tripId);
      },
      editAdminTrips: async (
        tripid,
        data,
        travellerDetails,
        submittedHotels,
        submittedFlights,
        requestIds,
        submittedCabs,
        tripName,
        submittedBus,
        notBus,
        comment,
        templateData,
        userId
      ) => {
        var accountDocRef = db
          .collection("Accounts")
          .doc(this.state.adminDetails.userid);
        var tripCollectionRef = accountDocRef.collection("trips");
        var tripQuery = tripCollectionRef.where("tripId", "==", tripid);
        var querysnapshot = await tripQuery.get();
        var hotelArray = [];
        hotelArray = submittedHotels?.map((hotel) => {
          return { status: "Not Submitted", id: hotel };
        });
        for (const req of requestIds) {
          const userDocRef = db
            .collection("Accounts")
            .doc(userId ? userId : this.state.userId);
          const tripReqcollectionRef = userDocRef.collection("tripRequests");
          const tripReqDoc = tripReqcollectionRef.doc(req);
          await updateDoc(tripReqDoc, {
            tripStatus: "Submitted",
          });
        }

        var flightArray = [];
        flightArray = submittedFlights?.map((flight) => {
          return { status: "Not Submitted", id: flight };
        });
        await this.state.actions.sendBookingSubmitEmail({
          id: this.state.userId,
          name:
            this.state.userAccountDetails.firstName +
            this.state.userAccountDetails.lastName,
          email: this.state.userAccountDetails.email,
          tripName: tripName,
          templateData: templateData,
        });
        var cabArray = [];
        cabArray = submittedCabs?.map((hotel) => {
          return { status: "Not Submitted", id: hotel };
        });
        var busArray = [];
        busArray =
          submittedBus.length > 0
            ? submittedBus?.map((hotel) => {
                return { status: "Not Submitted", id: hotel };
              })
            : [];
        if (!querysnapshot.empty) {
          var docRef = querysnapshot.docs[0].ref;
          var admintripdata = querysnapshot.docs[0].data();

          await docRef.update({
            hotels: [...admintripdata.hotels, ...hotelArray],
            flights: [...admintripdata.flights, ...flightArray],
            travellerDetails: travellerDetails,
            cabs: [...admintripdata.cabs, ...cabArray],
            bus: [...admintripdata.bus, ...busArray],
          });
        } else {
          await this.state.actions.addTripsToAdmin(
            tripid,
            data,
            travellerDetails,
            submittedHotels,
            submittedFlights,
            submittedCabs,
            submittedBus,
            comment,
            userId
          );
          return;
        }
        var accountCollectionRef = db
          .collection("Accounts")
          .doc(userId ? userId : this.state.userId);
        var tripCollectionRef1 = accountCollectionRef
          .collection("trips")
          .doc(tripid);
        await updateDoc(tripCollectionRef1, {
          status: "Submitted",
          travellerDetails: travellerDetails,
        });
        if (!querysnapshot.empty) {
          if (flightArray) {
            flightArray.map((flight) => {
              return this.state.actions.editTripStatus(
                userId ? userId : this.state.userId,
                tripid,
                querysnapshot.docs[0].id,
                "Submitted",
                flight.id,
                "flight"
              );
            });
          }
          if (hotelArray) {
            hotelArray.map((hotel) => {
              return this.state.actions.editTripStatus(
                this.state.userId,
                tripid,
                querysnapshot.docs[0].id,
                "Submitted",
                hotel.id,
                "add"
              );
            });
          }
          if (cabArray) {
            cabArray.map((cab) => {
              return this.state.actions.editTripStatus(
                this.state.userId,
                tripid,
                querysnapshot.docs[0].id,
                "Submitted",
                cab.id,
                "cabs"
              );
            });
          }
          if (busArray) {
            busArray.map((cab) => {
              return this.state.actions.editTripStatus(
                this.state.userId,
                tripid,
                querysnapshot.docs[0].id,
                "Submitted",
                cab.id,
                "bus"
              );
            });
          }
        }
        await this.state.actions.getUserById(
          userId ? userId : this.state.userId
        );
        // await this.state.actions.getTripDocById(tripid,userId?userId:this.state.userId)
        //this.state.actions.editTripStatus(this.state.userId,tripid,querysnapshot.id)
      },
      AdminTrips_addingFromAdminUser: async (
        tripid,
        data,
        travellerDetails,
        submittedHotels,
        submittedFlights,
        requestIds,
        submittedCabs,
        tripName,
        submittedBus,
        notBus,
        comment,
        templateData,
        userId
      ) => {
        var accountDocRef = db
          .collection("Accounts")
          .doc(this.state.adminDetails.userid);
        var tripCollectionRef = accountDocRef.collection("trips");
        var tripQuery = tripCollectionRef.where("tripId", "==", tripid);
        var querysnapshot = await tripQuery.get();
        var flightArray = [];
        flightArray = submittedFlights?.map((flight) => {
          return { status: "Not Submitted", id: flight };
        });
        await this.state.actions.sendBookingSubmitEmail({
          id: userId,
          name:
            travellerDetails[`${submittedFlights}`].adults?.[0]?.firstName +
            travellerDetails[`${submittedFlights}`].adults?.[0]?.lastName,
          email: travellerDetails[`${submittedFlights}`].adults?.[0]?.email,
          tripName: tripName,
          templateData: templateData,
        });
        var accountCollectionRef = db
          .collection("Accounts")
          .doc(userId ? userId : this.state.userId);
        var tripCollectionRef1 = accountCollectionRef
          .collection("trips")
          .doc(tripid);
        const tripDoc = await tripCollectionRef1.get();
        const existingTravellerDetails = tripDoc.data().travellerDetails || {};
        if (!querysnapshot.empty) {
          var docRef = querysnapshot.docs[0].ref;
          var admintripdata = querysnapshot.docs[0].data();
          await docRef.update({
            flights: [...admintripdata.flights, ...flightArray],
            travellerDetails: {
              ...existingTravellerDetails,
              ...travellerDetails,
            },
          });
        } else {
          await this.state.actions.addTripsToAdmin(
            tripid,
            data,
            travellerDetails,
            submittedHotels,
            submittedFlights,
            submittedCabs,
            submittedBus,
            comment,
            userId
          );
          // await this.state.actions.getTripDocById(tripid,userId)
          return;
        }
        //   var accountCollectionRef = db
        //   .collection("Accounts")
        //   .doc(userId?userId:this.state.userId);
        // var tripCollectionRef1 = accountCollectionRef
        //   .collection("trips")
        //   .doc(tripid);
        // await updateDoc(tripCollectionRef1, {
        //   status: "Submitted",
        //   travellerDetails: {...tripCollectionRef1.travellerDetails,travellerDetails},
        // });
        //       var accountCollectionRef = db
        //   .collection("Accounts")
        //   .doc(userId ? userId : this.state.userId);
        // var tripCollectionRef1 = accountCollectionRef
        //   .collection("trips")
        //   .doc(tripid);
        // const tripDoc = await tripCollectionRef1.get();
        // const existingTravellerDetails = tripDoc.data().travellerDetails || {};
        await updateDoc(tripCollectionRef1, {
          status: "Submitted",
          travellerDetails: {
            ...existingTravellerDetails,
            ...travellerDetails,
          },
        });

        if (!querysnapshot.empty) {
          if (flightArray) {
            flightArray.map((flight) => {
              return this.state.actions.editTripStatus(
                userId ? userId : this.state.userId,
                tripid,
                querysnapshot.docs[0].id,
                "Submitted",
                flight.id,
                "flight"
              );
            });
          }
        }
        // await this.state.actions.getTripDocById(tripid,userId)
      },
      updateAdminTripAccepted: async (trip, req) => {
        console.log(req.tripId);
        var accountDocRef = db
          .collection("Accounts")
          .doc(this.state.adminDetails.userid);
        var tripCollectionRef = accountDocRef.collection("trips");
        var tripQuery = tripCollectionRef.where("tripId", "==", req.tripId);
        var querysnapshot = await tripQuery.get();

        if (querysnapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        var tripDocRef = querysnapshot.docs[0].ref;
        var tripData = querysnapshot.docs[0].data();

        // Update function for each item type
        const updateItems = (itemType, approvalItems) => {
          if (approvalItems && approvalItems.length > 0) {
            tripData[itemType] = tripData[itemType].map((item) => {
              if (approvalItems.includes(item.id)) {
                return {
                  ...item,
                  date: item.date || new Date(),
                  requestStatus: "Approved",
                };
              }
              return item;
            });
          }
        };

        // Update each item type
        updateItems("flights", trip.approvalRequest.flights);
        updateItems("hotels", trip.approvalRequest.hotels);
        updateItems("cabs", trip.approvalRequest.cabs);
        updateItems("bus", trip.approvalRequest.bus);
        updateItems("otherBookings", trip.approvalRequest.otherBookings);
        // Update the document with the modified data
        await tripDocRef.update(tripData);
        console.log("Document successfully updated");
      },
      setAdminTripDetails: async (value) => {
        this.setState({
          adminTripDetails: value,
        });
      },
      getAdminTripById: async (id) => {
        try {
          this.setState({
            adminTripDataLoading: true,
          });
          var accCollectionRef = db
            .collection("Accounts")
            .doc("xckvJhNcSpaIf3t2eBuYCDrqpAT2");
          var tripCollectionRef = accCollectionRef.collection("trips").doc(id);
          var doc = await tripCollectionRef.get();
          const data = await doc.data();
          var flightIds = await doc.data().flights;
          var hotelIds = await doc.data().hotels;
          var cabIds = await doc.data().cabs;
          var busIds = await doc.data().bus;
          var otherIds = await doc.data().otherBookings;
          var flights = [];
          var hotels = [];
          var cabs = [];
          var bus = [];
          var otherBookings = [];
          if (flightIds.length > 0) {
            await Promise.all(
              await flightIds.map(async (flightId) => {
                var hotelCollectionRef = await db
                  .collection("Accounts")
                  .doc(data.userDetails.userid)
                  .collection("trips")
                  .doc(data.tripId)
                  .collection("flights")
                  .doc(flightId.id);
                const querysnapshot = await hotelCollectionRef.get();
                var sendData = await querysnapshot.data();
                var modifiedFlightObj = await this.state.actions.objToArr(
                  sendData
                );
                flights.push({
                  ...flightId,
                  data: modifiedFlightObj,
                });
              })
            );
          }
          if (hotelIds.length > 0) {
            await Promise.all(
              await hotelIds.map(async (flightId) => {
                var hotelCollectionRef = await db
                  .collection("Accounts")
                  .doc(data.userDetails.userid)
                  .collection("trips")
                  .doc(data.tripId)
                  .collection("hotels")
                  .doc(flightId.id);
                const querysnapshot = await hotelCollectionRef.get();
                var sendData = await querysnapshot.data();
                var modifiedFlightObj = await this.state.actions.objToArr(
                  sendData
                );
                hotels.push({
                  data: modifiedFlightObj,
                  ...flightId,
                });
              })
            );
          }
          if (cabIds?.length > 0) {
            await Promise.all(
              await cabIds.map(async (flightId) => {
                var hotelCollectionRef = await db
                  .collection("Accounts")
                  .doc(data.userDetails.userid)
                  .collection("trips")
                  .doc(data.tripId)
                  .collection("cabs")
                  .doc(flightId.id);
                const querysnapshot = await hotelCollectionRef.get();
                var sendData = await querysnapshot.data();

                cabs.push({
                  data: sendData,
                  ...flightId,
                });
              })
            );
          }
          if (busIds?.length > 0) {
            await Promise.all(
              await busIds.map(async (flightId) => {
                var hotelCollectionRef = await db
                  .collection("Accounts")
                  .doc(data.userDetails.userid)
                  .collection("trips")
                  .doc(data.tripId)
                  .collection("bus")
                  .doc(flightId.id);
                const querysnapshot = await hotelCollectionRef.get();
                var sendData = await querysnapshot.data();
                var modifiedBusObj = await this.state.actions.objToArr(
                  sendData
                );
                bus.push({
                  data: modifiedBusObj,
                  ...flightId,
                });
              })
            );
          }
          if (otherIds?.length > 0) {
            await Promise.all(
              await otherIds.map(async (otherId) => {
                var hotelCollectionRef = await db
                  .collection("Accounts")
                  .doc(data.userDetails.userid)
                  .collection("trips")
                  .doc(data.tripId)
                  .collection("otherbookings")
                  .doc(otherId.id);
                const querysnapshot = await hotelCollectionRef.get();
                var sendData = await querysnapshot.data();

                otherBookings.push({
                  data: sendData,
                  ...otherId,
                });
              })
            );
          }
          var bookingCommentRef = await db
            .collection("Accounts")
            .doc(data.userDetails.userid)
            .collection("trips")
            .doc(data.tripId)
            .get();
          this.state.actions.setAdminTripDetails({
            id: doc.id,
            data: doc.data(),
            flights,
            hotels,
            cabs,
            bus,
            otherBookings,
            bookingComments: bookingCommentRef.data().bookings,
          });
          this.setState({
            adminTripDataLoading: false,
          });
        } catch (error) {
          console.log(error);
          this.setState({
            adminTripDataLoading: false,
          });
        }
      },
      toggleSeatSelection: (seat) => {
        // console.log(seat);
        const isSelected = this.state.selectedSeats.some(
          (s) =>
            s.RowNo === seat.RowNo &&
            s.ColumnNo === seat.ColumnNo &&
            s.IsUpper === seat.IsUpper
        );

        if (seat.SeatStatus) {
          if (isSelected) {
            // Remove seat from selected seats
            this.setState((prevState) => ({
              selectedSeats: prevState.selectedSeats.filter(
                (s) =>
                  !(
                    s.RowNo === seat.RowNo &&
                    s.ColumnNo === seat.ColumnNo &&
                    s.IsUpper === seat.IsUpper
                  )
              ),
            }));
          } else {
            // Add seat to selected seats
            this.setState((prevState) => {
              const updatedSeats = [...prevState.selectedSeats, seat];
              if (updatedSeats.length > this.state.NoofBusPassengers) {
                updatedSeats.shift();
              }
              return { selectedSeats: updatedSeats };
            });
          }
        }
      },
      addBookingDocuments: async (
        file,
        userId,
        tripId,
        hotelId,
        adminTripId,
        type
      ) => {
        try {
          var downloadURL;
          if (type === "hotel") {
            console.log("called hotel");
            const newFileRef = ref(
              storage,
              `bookings/${userId}/${tripId}/hotels/${hotelId}/`
            );
            const items = await listAll(newFileRef);
            await Promise.all(
              items.items.map(async (item) => {
                await deleteObject(item);
              })
            );
            const storageRef = ref(
              storage,
              `bookings/${userId}/${tripId}/hotels/${hotelId}/` + file.name
            );
            await uploadBytes(storageRef, file);
            downloadURL = await getDownloadURL(storageRef);

            var accountCollectionRef = db.collection("Accounts").doc(userId);
            var tripCollectionRef = accountCollectionRef
              .collection("trips")
              .doc(tripId);
            var userHotelDetails = await tripCollectionRef.get();
            var userHotelArray = userHotelDetails.data().hotels;
            var userCurrHotel = userHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });

            await updateDoc(tripCollectionRef, {
              hotels: arrayRemove(userCurrHotel[0]),
            });

            var data1 = { ...userCurrHotel[0], downloadURL };
            await updateDoc(tripCollectionRef, {
              hotels: arrayUnion(data1),
            });
            var adminCollectionRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollectionRef = adminCollectionRef
              .collection("trips")
              .doc(adminTripId);
            var adminHotelDetails = await admintripCollectionRef.get();
            var adminHotelArray = adminHotelDetails.data().hotels;
            var admincurrHotel = adminHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(admintripCollectionRef, {
              hotels: arrayRemove(admincurrHotel[0]),
            });
            var hotelData = {
              ...admincurrHotel[0],
              downloadURL: downloadURL,
            };
            await updateDoc(admintripCollectionRef, {
              hotels: arrayUnion(hotelData),
            });
          } else if (type === "flight") {
            console.log("called flight");
            const newFileRef = ref(
              storage,
              `bookings/${userId}/${tripId}/flights/${hotelId}/`
            );
            const items = await listAll(newFileRef);
            await Promise.all(
              items.items.map(async (item) => {
                await deleteObject(item);
              })
            );
            const storageRef = ref(
              storage,
              `bookings/${userId}/${tripId}/hotels/${hotelId}/` +
                (file.name || "FlightTicket.pdf")
            );
            await uploadBytes(storageRef, file);
            downloadURL = await getDownloadURL(storageRef);

            var accCollectionRef = db.collection("Accounts").doc(userId);
            var tripCollecRef = accCollectionRef
              .collection("trips")
              .doc(tripId);
            var userFlightDetails = await tripCollecRef.get();
            var userFlightArray = userFlightDetails.data().flights;
            var userCurrFlight = userFlightArray.filter((flight) => {
              return flight.id === hotelId;
            });

            //console.log('called in ');
            await updateDoc(tripCollecRef, {
              flights: arrayRemove(userCurrFlight[0]),
            });
            var data = { ...userCurrFlight[0], downloadURL: downloadURL };
            await updateDoc(tripCollecRef, {
              flights: arrayUnion(data),
            });
            var adminCollecRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollecRef = adminCollecRef
              .collection("trips")
              .doc(adminTripId);
            var adminFlightDetails = await admintripCollecRef.get();
            var adminFlightArray = adminFlightDetails.data().flights;
            var flightArray = Object.values(adminFlightArray);
            var admincurrFlight = flightArray.filter((flight) => {
              return flight.id === hotelId;
            });
            await updateDoc(admintripCollecRef, {
              flights: arrayRemove(admincurrFlight[0]),
            });
            var flightData = {
              ...admincurrFlight[0],
              downloadURL: downloadURL,
            };
            await updateDoc(admintripCollecRef, {
              flights: arrayUnion(flightData),
            });
          } else if (type === "cabs") {
            const newFileRef = ref(
              storage,
              `bookings/${userId}/${tripId}/cabs/${hotelId}/`
            );
            const items = await listAll(newFileRef);
            await Promise.all(
              items.items.map(async (item) => {
                await deleteObject(item);
              })
            );
            const storageRef = ref(
              storage,
              `bookings/${userId}/${tripId}/cabs/${hotelId}/` + file.name
            );
            await uploadBytes(storageRef, file);
            downloadURL = await getDownloadURL(storageRef);

            var accountCollecRef = db.collection("Accounts").doc(userId);
            var tripCollcRef = accountCollecRef.collection("trips").doc(tripId);
            var userCabDetails = await tripCollcRef.get();
            var userCabArray = userCabDetails.data().cabs;
            var userCurrCab = userCabArray.filter((cab) => {
              return cab.id === hotelId;
            });

            await updateDoc(tripCollcRef, {
              cabs: arrayRemove(userCurrCab[0]),
            });

            var data2 = { ...userCurrCab[0], downloadURL };
            await updateDoc(tripCollcRef, {
              cabs: arrayUnion(data2),
            });
            var adminColleRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripColleRef = adminColleRef
              .collection("trips")
              .doc(adminTripId);
            var adminCabDetails = await admintripColleRef.get();
            var adminCabArray = adminCabDetails.data().cabs;
            var admincurrCab = adminCabArray.filter((cab) => {
              return cab.id === hotelId;
            });
            await updateDoc(admintripColleRef, {
              cabs: arrayRemove(admincurrCab[0]),
            });
            var cabData = {
              ...admincurrCab[0],
              downloadURL: downloadURL,
            };
            await updateDoc(admintripColleRef, {
              cabs: arrayUnion(cabData),
            });
          } else if (type === "bus") {
            const newFileRef = ref(
              storage,
              `bookings/${userId}/${tripId}/bus/${hotelId}/`
            );
            const items = await listAll(newFileRef);
            await Promise.all(
              items.items.map(async (item) => {
                await deleteObject(item);
              })
            );
            const storageRef = ref(
              storage,
              `bookings/${userId}/${tripId}/bus/${hotelId}/` + file.name
            );
            await uploadBytes(storageRef, file);
            downloadURL = await getDownloadURL(storageRef);

            var accountCollRef = db.collection("Accounts").doc(userId);
            var tripCollRef = accountCollRef.collection("trips").doc(tripId);
            var userBusDetails = await tripCollRef.get();
            var userBusArray = userBusDetails.data().bus;
            var userCurrBus = userBusArray.filter((cab) => {
              return cab.id === hotelId;
            });

            await updateDoc(tripCollRef, {
              bus: arrayRemove(userCurrBus[0]),
            });

            var data3 = { ...userCurrBus[0], downloadURL };
            await updateDoc(tripCollRef, {
              bus: arrayUnion(data3),
            });
            var adminCollRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollRef = adminCollRef
              .collection("trips")
              .doc(adminTripId);
            var adminBusDetails = await admintripCollRef.get();
            var adminBusArray = adminBusDetails.data().bus;
            var admincurrBus = adminBusArray.filter((cab) => {
              return cab.id === hotelId;
            });
            await updateDoc(admintripCollRef, {
              bus: arrayRemove(admincurrBus[0]),
            });
            var cabData1 = {
              ...admincurrBus[0],
              downloadURL: downloadURL,
            };
            await updateDoc(admintripCollRef, {
              bus: arrayUnion(cabData1),
            });
          } else if (type === "other") {
            const newFileRef = ref(
              storage,
              `bookings/${userId}/${tripId}/otherBookings/${hotelId}/`
            );
            const items = await listAll(newFileRef);
            await Promise.all(
              items.items.map(async (item) => {
                await deleteObject(item);
              })
            );
            const storageRef = ref(
              storage,
              `bookings/${userId}/${tripId}/otherBookings/${hotelId}/` +
                file.name
            );
            await uploadBytes(storageRef, file);
            downloadURL = await getDownloadURL(storageRef);

            var accountCollRef = db.collection("Accounts").doc(userId);
            var tripCollRef = accountCollRef.collection("trips").doc(tripId);
            var userBusDetails = await tripCollRef.get();
            var userBusArray = userBusDetails.data().otherBookings;
            var userCurrBus = userBusArray.filter((cab) => {
              return cab.id === hotelId;
            });

            await updateDoc(tripCollRef, {
              otherBookings: arrayRemove(userCurrBus[0]),
            });

            var data3 = { ...userCurrBus[0], downloadURL };
            await updateDoc(tripCollRef, {
              otherBookings: arrayUnion(data3),
            });
            var adminCollRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollRef = adminCollRef
              .collection("trips")
              .doc(adminTripId);
            var adminBusDetails = await admintripCollRef.get();
            var adminBusArray = adminBusDetails.data().otherBookings;
            var admincurrBus = adminBusArray.filter((cab) => {
              return cab.id === hotelId;
            });
            await updateDoc(admintripCollRef, {
              otherBookings: arrayRemove(admincurrBus[0]),
            });
            var cabData1 = {
              ...admincurrBus[0],
              downloadURL: downloadURL,
            };
            await updateDoc(admintripCollRef, {
              otherBookings: arrayUnion(cabData1),
            });
          }
          return downloadURL;
        } catch (error) {
          console.log(error);
        }
      },
      addTicketCostAdmin: async (
        ticketcost,
        userId,
        tripId,
        hotelId,
        adminTripId,
        type
      ) => {
        try {
          if (type === "hotel") {
            // var accountCollectionRef = db.collection("Accounts").doc(userId);
            // var tripCollectionRef = accountCollectionRef
            //   .collection("trips")
            //   .doc(tripId);
            // var userHotelDetails = await tripCollectionRef.get();

            // var userHotelArray = userHotelDetails.data().hotels;
            // var userCurrHotel = userHotelArray.filter((hotel) => {
            //   return hotel.id === hotelId;
            // });
            // var hotelDoc = {
            //   ...userCurrHotel[0],
            //   ticketCost: ticketcost
            // }
            // if (!userCurrHotel[0].ticketCost) {
            //   await updateDoc(tripCollectionRef, {
            //     hotels: arrayRemove(userCurrHotel[0])
            //   });
            // } else {
            //   await updateDoc(tripCollectionRef, {
            //     hotels: arrayRemove(hotelDoc)
            //   });
            // }
            // await updateDoc(tripCollectionRef, {
            //   hotels: arrayUnion(hotelDoc)
            // });
            var adminCollectionRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollectionRef = adminCollectionRef
              .collection("trips")
              .doc(adminTripId);
            var adminHotelDetails = await admintripCollectionRef.get();
            var adminHotelArray = adminHotelDetails.data().hotels;
            var admincurrHotel = adminHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(admintripCollectionRef, {
              hotels: arrayRemove(admincurrHotel[0]),
            });
            var hotelData1 = {
              ...admincurrHotel[0],
              ticketCost: ticketcost,
            };
            await updateDoc(admintripCollectionRef, {
              hotels: arrayUnion(hotelData1),
            });
          } else if (type === "flight") {
            // var accCollectionRef = db.collection("Accounts").doc(userId);
            // var tripCollecRef = accCollectionRef
            //   .collection("trips")
            //   .doc(tripId);
            // var userFlightDetails = await tripCollecRef.get();
            // var userFlightArray = userFlightDetails.data().flights;
            // var userCurrFlight = userFlightArray.filter((flight) => {
            //   return flight.id === hotelId;
            // });
            // var hotelDoc1 = {
            //   ...userCurrFlight[0],
            //   ticketCost: ticketcost
            // }
            // if (!userCurrFlight[0].ticketCost) {
            //   await updateDoc(tripCollecRef, {
            //     flights: arrayRemove(userCurrFlight[0])
            //   });
            // } else {

            //   console.log(hotelDoc1);
            //   await updateDoc(tripCollecRef, {
            //     flights: arrayRemove(hotelDoc1)
            //   });
            // }
            // await updateDoc(tripCollecRef, {
            //   flights: arrayUnion(hotelDoc1)
            // });
            var adminCollecRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollecRef = adminCollecRef
              .collection("trips")
              .doc(adminTripId);
            var adminFlightDetails = await admintripCollecRef.get();
            var adminFlightArray = adminFlightDetails.data().flights;
            var flightArray = Object.values(adminFlightArray);
            var admincurrFlight = flightArray.filter((flight) => {
              return flight.id === hotelId;
            });
            await updateDoc(admintripCollecRef, {
              flights: arrayRemove(admincurrFlight[0]),
            });
            var flightData = {
              ...admincurrFlight[0],
              ticketCost: ticketcost,
            };
            await updateDoc(admintripCollecRef, {
              flights: arrayUnion(flightData),
            });
          } else if (type === "cabs") {
            var adminColleRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripColleRef = adminColleRef
              .collection("trips")
              .doc(adminTripId);
            var adminCabDetails = await admintripColleRef.get();
            var adminCabArray = adminCabDetails.data().cabs;
            var admincurrCab = adminCabArray.filter((Cab) => {
              return Cab.id === hotelId;
            });
            await updateDoc(admintripColleRef, {
              cabs: arrayRemove(admincurrCab[0]),
            });
            var cabData1 = {
              ...admincurrCab[0],
              ticketCost: ticketcost,
            };
            await updateDoc(admintripColleRef, {
              cabs: arrayUnion(cabData1),
            });
          } else if (type === "bus") {
            var adminCollRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollRef = adminCollRef
              .collection("trips")
              .doc(adminTripId);
            var adminBusDetails = await admintripCollRef.get();
            var adminBusArray = adminBusDetails.data().bus;
            var admincurrBus = adminBusArray.filter((Cab) => {
              return Cab.id === hotelId;
            });
            await updateDoc(admintripCollRef, {
              bus: arrayRemove(admincurrBus[0]),
            });
            var cabData2 = {
              ...admincurrBus[0],
              ticketCost: ticketcost,
            };
            await updateDoc(admintripCollRef, {
              bus: arrayUnion(cabData2),
            });
          } else if (type === "other") {
            var adminCollRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollRef = adminCollRef
              .collection("trips")
              .doc(adminTripId);
            var adminBusDetails = await admintripCollRef.get();
            var adminBusArray = adminBusDetails.data().otherBookings;
            var admincurrBus = adminBusArray.filter((Cab) => {
              return Cab.id === hotelId;
            });
            await updateDoc(admintripCollRef, {
              otherBookings: arrayRemove(admincurrBus[0]),
            });
            var cabData2 = {
              ...admincurrBus[0],
              ticketCost: ticketcost,
            };
            await updateDoc(admintripCollRef, {
              otherBookings: arrayUnion(cabData2),
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      addNoteAdmin: async (
        note,
        userId,
        tripId,
        hotelId,
        adminTripId,
        type
      ) => {
        try {
          if (type === "hotel") {
            console.log("came to hotel");
            var accountCollectionRef = db.collection("Accounts").doc(userId);
            var tripCollectionRef = accountCollectionRef
              .collection("trips")
              .doc(tripId);
            var userHotelDetails = await tripCollectionRef.get();
            var userHotelArray = userHotelDetails.data()?.hotels;
            var userCurrHotel = userHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(tripCollectionRef, {
              hotels: arrayRemove(userCurrHotel[0]),
            });
            await updateDoc(tripCollectionRef, {
              hotels: arrayUnion({
                ...userCurrHotel[0],
                note: note,
              }),
            });
            var adminCollectionRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollectionRef = adminCollectionRef
              .collection("trips")
              .doc(adminTripId);
            var adminHotelDetails = await admintripCollectionRef.get();
            var adminHotelArray = adminHotelDetails.data().hotels;
            var admincurrHotel = adminHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });

            await updateDoc(admintripCollectionRef, {
              hotels: arrayRemove(admincurrHotel[0]),
            });
            var hotelData = {
              ...admincurrHotel[0],
              note: note,
            };
            await updateDoc(admintripCollectionRef, {
              hotels: arrayUnion(hotelData),
            });
          } else if (type === "flight") {
            var accountCollectionRef = db.collection("Accounts").doc(userId);
            var tripCollectionRef = accountCollectionRef
              .collection("trips")
              .doc(tripId);

            var userHotelDetails = await tripCollectionRef.get();
            var userHotelArray = userHotelDetails.data()?.flights;
            var userCurrHotel = userHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(tripCollectionRef, {
              flights: arrayRemove(userCurrHotel[0]),
            });
            await updateDoc(tripCollectionRef, {
              flights: arrayUnion({
                ...userCurrHotel[0],
                note: note,
              }),
            });
            var adminCollecRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollecRef = adminCollecRef
              .collection("trips")
              .doc(adminTripId);
            var adminFlightDetails = await admintripCollecRef.get();
            var adminFlightArray = adminFlightDetails.data().flights;
            var flightArray = Object.values(adminFlightArray);
            var admincurrFlight = flightArray.filter((flight) => {
              return flight.id === hotelId;
            });
            await updateDoc(admintripCollecRef, {
              flights: arrayRemove(admincurrFlight[0]),
            });
            var flightData = {
              ...admincurrFlight[0],
              note: note,
            };
            await updateDoc(admintripCollecRef, {
              flights: arrayUnion(flightData),
            });
          } else if (type === "cabs") {
            var accountCollectionRef = db.collection("Accounts").doc(userId);
            var tripCollectionRef = accountCollectionRef
              .collection("trips")
              .doc(tripId);

            var userHotelDetails = await tripCollectionRef.get();
            var userHotelArray = userHotelDetails.data()?.cabs;
            var userCurrHotel = userHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(tripCollectionRef, {
              cabs: arrayRemove(userCurrHotel[0]),
            });
            await updateDoc(tripCollectionRef, {
              cabs: arrayUnion({
                ...userCurrHotel[0],
                note: note,
              }),
            });
            var adminColleRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripColleRef = adminColleRef
              .collection("trips")
              .doc(adminTripId);
            var adminCabDetails = await admintripColleRef.get();
            var adminCabArray = adminCabDetails.data().cabs;
            var admincurrCab = adminCabArray.filter((Cab) => {
              return Cab.id === hotelId;
            });

            await updateDoc(admintripColleRef, {
              cabs: arrayRemove(admincurrCab[0]),
            });
            var cabData = {
              ...admincurrCab[0],
              note: note,
            };
            await updateDoc(admintripColleRef, {
              cabs: arrayUnion(cabData),
            });
          } else if (type === "bus") {
            var accountCollectionRef = db.collection("Accounts").doc(userId);
            var tripCollectionRef = accountCollectionRef
              .collection("trips")
              .doc(tripId);

            var userHotelDetails = await tripCollectionRef.get();
            var userHotelArray = userHotelDetails.data()?.bus;
            var userCurrHotel = userHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(tripCollectionRef, {
              bus: arrayRemove(userCurrHotel[0]),
            });
            await updateDoc(tripCollectionRef, {
              bus: arrayUnion({
                ...userCurrHotel[0],
                note: note,
              }),
            });
            var accountCollectionRef = db.collection("Accounts").doc(userId);
            var tripCollectionRef = accountCollectionRef
              .collection("trips")
              .doc(tripId);

            var userHotelDetails = await tripCollectionRef.get();
            var userHotelArray = userHotelDetails.data()?.cabs;
            var userCurrHotel = userHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            await updateDoc(tripCollectionRef, {
              cabs: arrayRemove(userCurrHotel[0]),
            });
            await updateDoc(tripCollectionRef, {
              cabs: arrayUnion({
                ...userCurrHotel[0],
                note: note,
              }),
            });
            var adminCollRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollRef = adminCollRef
              .collection("trips")
              .doc(adminTripId);
            var adminBusDetails = await admintripCollRef.get();
            var adminBusArray = adminBusDetails.data().bus;
            var admincurrBus = adminBusArray.filter((Cab) => {
              return Cab.id === hotelId;
            });

            await updateDoc(admintripCollRef, {
              bus: arrayRemove(admincurrBus[0]),
            });
            var cabData1 = {
              ...admincurrBus[0],
              note: note,
            };
            await updateDoc(admintripCollRef, {
              bus: arrayUnion(cabData1),
            });
          } else if (type === "other") {
            console.log("came to other");
            var accountCollectionRef = db.collection("Accounts").doc(userId);
            var tripCollectionRef = accountCollectionRef
              .collection("trips")
              .doc(tripId);
            var userHotelDetails = await tripCollectionRef.get();
            var userHotelArray = userHotelDetails.data()?.otherBookings;
            console.log(userHotelArray);
            var userCurrHotel = userHotelArray.filter((hotel) => {
              return hotel.id === hotelId;
            });
            console.log(userCurrHotel);
            await updateDoc(tripCollectionRef, {
              otherBookings: arrayRemove(userCurrHotel[0]),
            });
            await updateDoc(tripCollectionRef, {
              otherBookings: arrayUnion({
                ...userCurrHotel[0],
                note: note,
              }),
            });

            var adminCollRef = db
              .collection("Accounts")
              .doc(this.state.adminDetails.userid);
            var admintripCollRef = adminCollRef
              .collection("trips")
              .doc(adminTripId);
            var adminBusDetails = await admintripCollRef.get();
            var adminBusArray = adminBusDetails.data().otherBookings;
            var admincurrBus = adminBusArray.filter((Cab) => {
              return Cab.id === hotelId;
            });

            await updateDoc(admintripCollRef, {
              otherBookings: arrayRemove(admincurrBus[0]),
            });
            var cabData1 = {
              ...admincurrBus[0],
              note: note,
            };
            await updateDoc(admintripCollRef, {
              otherBookings: arrayUnion(cabData1),
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      setIsDownloadReady: (value) => {
        this.setState({
          isDownloadReady: value,
        });
      },
      downloadXmlFile: async (query) => {
        console.log(query.cityHotel1);

        if (query.cityHotel1) {
          this.setState({
            isLoading: true,
          });
          var hotelStatic = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/staticdata",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ cityId: query.cityHotel1 }),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));

          var parser = new DOMParser();
          const xmlDoc = parser.parseFromString(
            hotelStatic.HotelData,
            "application/xml"
          );

          const blob = new Blob(
            [new XMLSerializer().serializeToString(xmlDoc)],
            {
              type: "application/xml",
            }
          );
          // const blob = new Blob([jsonContent], { type: 'application/json' });
          // const link = document.createElement('a');
          // link.download = "fileNa6me";
          // link.href = window.URL.createObjectURL(blob);
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
          // console.log(window.URL.createObjectURL(blob));

          const newFileRef = ref(
            storage,
            `cityXMl/${query.cityHotelItem.DESTINATION}/${query.cityHotelItem.DESTINATION}.xml`
          );

          await uploadBytes(newFileRef, blob);
          const downloadURL = await getDownloadURL(newFileRef);
          var accCollectionRef = db
            .collection("cityXmlDownload")
            .doc("downloadCityXmlFiles");
          await updateDoc(accCollectionRef, {
            links: arrayUnion({
              city: query.cityHotelItem.DESTINATION,
              link: downloadURL,
            }),
          });
          this.setState({
            isLoading: false,
            isDownloadReady: true,
          });
        }
      },
      convertXmlToJson: async (cityId) => {
        var hotelStatic = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/staticdata",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cityId: cityId }),
          }
        )
          .then((res) => res.json())
          .catch((err) => {
            return;
          });
        var hotelObject = {};
        if (hotelStatic) {
          var jsonResult = convert.xml2json(hotelStatic?.HotelData, {
            compact: true,
            spaces: 2,
          });
          var jsonContent = JSON.parse(jsonResult);

          var x = Array.isArray(
            jsonContent?.ArrayOfBasicPropertyInfo?.BasicPropertyInfo
          )
            ? jsonContent?.ArrayOfBasicPropertyInfo?.BasicPropertyInfo?.forEach(
                (hotel) => {
                  var hotelCode = hotel["_attributes"]["TBOHotelCode"];
                  hotelObject[hotelCode] = {
                    BrandCode: hotel["_attributes"]["BrandCode"],
                    HotelCityCode: hotel["_attributes"]["HotelCityCode"],
                    HotelName: hotel["_attributes"]["HotelName"],
                    TBOHotelCode: hotel["_attributes"]["TBOHotelCode"],
                    LocationCategoryCode:
                      hotel["_attributes"]["LocationCategoryCode"],
                    Address: hotel["Address"],
                  };
                }
              )
            : null;
        }

        return hotelObject;
      },
      convertCsvToJson: async (csvFile) => {
        var jsonResult;
        if (csvFile) {
          Papa.parse(csvFile, {
            complete: async (result) => {
              jsonResult = JSON.stringify(result.data, null, 2);
              var accCollectionRef = db
                .collection("hotelAutoComplete")
                .doc("hotelCityListJson");

              await updateDoc(accCollectionRef, {
                hotelCityList: jsonResult,
              });
            },
            header: true, // Set to true if the CSV file has a header row
            dynamicTyping: true, // Automatically convert numbers and booleans
            skipEmptyLines: true, // Skip empty lines
          });
          console.log(jsonResult);
          return jsonResult;
        }
      },
      uploadAirportList: async (csvFile) => {
        var jsonResult;
        if (csvFile) {
          Papa.parse(csvFile, {
            complete: async (result) => {
              const cleanedData = result.data.map((row) => {
                return Object.fromEntries(
                  Object.entries(row).filter(
                    ([key, value]) => key.trim() && value.trim()
                  )
                );
              });
              console.log(cleanedData);
              var accCollectionRef = db
                .collection("flightAutoComplete")
                .doc("flightCityListJson");
              console.log(result.data);
              if (cleanedData && cleanedData.length > 0) {
                await updateDoc(accCollectionRef, {
                  airportList: cleanedData,
                });
              } else {
                console.error("Result data is empty or invalid.");
              }
            },
            header: true,
            skipEmptyLines: true,
          });
          return jsonResult;
        }
      },
      uploadHotelCityList: async (csvFile) => {
        var jsonResult;
        if (csvFile) {
          Papa.parse(csvFile, {
            complete: async (result) => {
              var accCollectionRef = db
                .collection("hotelMainAutoComplete")
                .doc("hotelCityListJson");
              await updateDoc(accCollectionRef, {
                hotelCityList: result.data,
              })
                .then(() => console.log("Successfull"))
                .catch((e) => console.log(e));
            },
            header: true,
            skipEmptyLines: true,
          });
          return jsonResult;
        }
      },
      uploadRecommondedHotelCityList: async (csvFile) => {
        var jsonResult;
        if (csvFile) {
          Papa.parse(csvFile, {
            complete: async (result) => {
              var accCollectionRef = db
                .collection("recomondedHotels")
                .doc("recommondedHotelCityListJson");
              await setDoc(accCollectionRef, {
                hotelCityList: result.data,
              });
            },
            header: true,
            skipEmptyLines: true,
          });
          console.log(jsonResult);
          return jsonResult;
        }
      },
      upladCabCityList: async (csvFile) => {
        if (csvFile) {
          Papa.parse(csvFile, {
            complete: async (result) => {
              const formattedOptions = {};
              var accCollectionRef = db.collection("cabAutoComplete");
              result.data.forEach(async (res) => {
                const { City, Option } = res;
                var accRef = accCollectionRef.doc(City);
                if (!formattedOptions[City]) {
                  formattedOptions[City] = [];
                  accRef.set({
                    types: [],
                  });
                }
                if (formattedOptions[City].includes(Option)) {
                  return;
                }
                formattedOptions[City].push(Option);

                await updateDoc(accRef, {
                  types: arrayUnion(Option),
                });
                //console.log(formattedOptions);
              });
              console.log(formattedOptions);
            },
            header: true,
            skipEmptyLines: true,
          });
        }
      },
      uploadCabDetailsList: async (csvFile) => {
        if (csvFile) {
          Papa.parse(csvFile, {
            complete: async (result) => {
              console.log(result);
              const formattedOptions = {};
              var accCollectionRef = db.collection("cabDetailsList");
              var cityRef, typeRef;
              result.data
                .filter((res) => {
                  const {
                    Car,
                    "Max. number of passengers": maxPassengers,
                    Price,
                    City,
                    Option,
                  } = res;
                  return Car && maxPassengers && Price && City && Option;
                })
                .forEach(async (res) => {
                  const {
                    Car,
                    "Max. number of passengers": maxPassengers,
                    Price,
                    Notes,
                    City,
                    Option,
                  } = res;
                  console.log(City);
                  var accRef = accCollectionRef.doc(City);
                  if (!formattedOptions[City]) {
                    formattedOptions[City] = {};
                  }
                  if (!formattedOptions[City][Option]) {
                    cityRef = accRef.collection("Types").doc(Option);
                    formattedOptions[City][Option] = [];
                    cityRef.set({
                      types: [],
                    });
                  }
                  formattedOptions[City][Option].push({
                    carType: Car,
                    passenger: maxPassengers,
                    price: Price,
                    notes: Notes,
                  });
                  await updateDoc(cityRef, {
                    types: arrayUnion({
                      carType: Car,
                      passenger: maxPassengers,
                      price: Price,
                      notes: Notes,
                    }),
                  });
                  //console.log(formattedOptions);
                });
              console.log(formattedOptions);
            },
            header: true,
            skipEmptyLines: true,
          });
        }
      },
      getAirportCityList: async () => {
        var accCollectionRef = db
          .collection("flightAutoComplete")
          .doc("flightCityListJson");
        var data1 = await accCollectionRef.get();
        var airportList = data1.data().airportList;
        // this.setState({
        //   airportList: airportList
        // });
        var fuse = new Fuse(airportList, {
          keys: ["cityName", "name", "iataCode", "countryName"],
          includeScore: true,
          threshold: 0.2,
        });
        this.setState({
          airportFuse: fuse,
        });
      },
      getHotelCityList: async () => {
        try {
          var accCollectionRef = db
            .collection("hotelMainAutoComplete")
            .doc("hotelCityListJson");

          var data1 = await accCollectionRef.get();
          var hotelLists = data1.data().hotelCityList;
          // const accountDocRef = db.collection("hotelAutoComplete");
          // var hotelLists = [];
          // const querySnapshot = await accountDocRef.get();
          // querySnapshot.forEach(async (doc) => {
          //   doc.data().hotelList.forEach((hotel) => {
          //     hotelLists.push(hotel);
          //   });
          // });
          // this.setState({
          //   hotelList: hotelLists
          // });
          var fuse = new Fuse(hotelLists, {
            keys: [
              "CITYID",
              "DESTINATION",
              "STATEPROVINCE",
              "STATEPROVINCECODE",
              "COUNTRY",
              "COUNTRYCODE",
            ],
            includeScore: true,
            threshold: 0.2,
          });

          this.setState({
            hotelFuse: fuse,
          });
        } catch (error) {
          console.log(error);
        }
      },
      getMainHotelCityList: async () => {
        try {
          const accountDocRef = db.collection("hotelAutoComplete");
          var hotelLists = [];
          const querySnapshot = await accountDocRef.get();
          querySnapshot.forEach(async (doc) => {
            doc.data().hotelList.forEach((hotel) => {
              hotelLists.push(hotel);
            });
          });
          var mainfuse = new Fuse(hotelLists, {
            keys: [
              "CITYID",
              "DESTINATION",
              "STATEPROVINCE",
              "STATEPROVINCECODE",
              "COUNTRY",
              "COUNTRYCODE",
            ],
            includeScore: true,
            threshold: 0.2,
          });
          // this.setState({
          //   mainFuse: mainfuse
          // });
          return mainfuse;
        } catch (error) {
          console.log(error);
        }
      },
      getRecommondedHotelList: async () => {
        var accCollectionRef = db
          .collection("recomondedHotels")
          .doc("recommondedHotelCityListJson");
        var data1 = await accCollectionRef.get();
        var recommondedHotels = data1.data().hotelCityList;

        var hotelObj = {};
        recommondedHotels.forEach((hotel) => {
          hotelObj[hotel["Hotel Code"]] = hotel;
        });
        this.setState({
          recommondedHotels: hotelObj,
        });
      },
      getCabCities: async () => {
        var cabCityRef = db.collection("cabAutoComplete");
        var cabCityDoc = await cabCityRef.get();
        var cabCityList = [];
        var cabCityDetailsList = {};
        await cabCityDoc.forEach((doc) => {
          cabCityList.push({ cityName: doc.id, types: doc.data().types });
          cabCityDetailsList = {
            ...cabCityDetailsList,
            [doc.id]: doc.data().types,
          };
        });
        var fuse = new Fuse(cabCityList, {
          keys: ["cityName"],
          includeScore: true,
          threshold: 0.2,
        });
        this.setState({
          cabCityList,
          cabCityDetailsList,
          cabFuse: fuse,
        });
      },
      addHotels: async () => {
        // var hotelJson = jsonObj.map((hotel) => {
        //   return {
        //     CITYID: hotel.CITYID,
        //     DESTINATION: hotel.DESTINATION,
        //     STATEPROVINCE: hotel.STATEPROVINCE,
        //     STATEPROVINCECODE: hotel.STATEPROVINCECODE,
        //     COUNTRY: hotel.COUNTRY,
        //     COUNTRYCODE: hotel.COUNTRYCODE
        //   };
        // });
        // var accCollectionRef = db
        //   .collection("hotelAutoComplete")
        //   .doc(`hotelCityJson6`);
        // var hotelJson1 = hotelJson.slice(50000);
        // await setDoc(accCollectionRef, {
        //   hotelList: hotelJson1
        // })
      },
      getAirlineLogos: async () => {
        const db = firebase.firestore();
        const airlineCollectionRef = collection(db, "airlinelogos");
        const docSnap = await getDocs(airlineCollectionRef);
        var updatedAirlinelogos = [];
        docSnap.forEach((doc) => {
          updatedAirlinelogos.push({ id: doc.id, url: doc.data().url });
        });
        this.setState({
          airlineLogos: updatedAirlinelogos,
        });
      },
      convertXmlToJsonHotel: async (query) => {
        var hotelStatic = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/staticdata",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cityId: query.cityId,
              hotelId: query.hotelId,
            }),
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));
        var xmlstring = hotelStatic?.HotelData || "";
        if (xmlstring.length > 0) {
          var jsonResult = convert.xml2json(xmlstring, {
            compact: true,
            spaces: 2,
          });
          var jsonContent = JSON.parse(jsonResult);
          var jsonObj = {};

          if (
            Array.isArray(
              jsonContent?.ArrayOfBasicPropertyInfo?.BasicPropertyInfo
                ?.VendorMessages?.VendorMessage
            )
          ) {
            const cityId = String(query.cityId);
            var accCollectionRef = db.collection("hotelImages").doc(cityId);

            if (
              Array.isArray(
                jsonContent.ArrayOfBasicPropertyInfo.BasicPropertyInfo
                  .VendorMessages.VendorMessage[1]?.SubSection?.Paragraph
              )
            ) {
              jsonObj = {
                [query.hotelId]: {
                  HotelPicture:
                    jsonContent.ArrayOfBasicPropertyInfo.BasicPropertyInfo
                      .VendorMessages.VendorMessage[1]?.SubSection?.Paragraph[0]
                      ?.URL?._text,
                  HotelName:
                    jsonContent.ArrayOfBasicPropertyInfo.BasicPropertyInfo
                      ?._attributes?.HotelName,
                },
              };

              await updateDoc(accCollectionRef, {
                hotelImageList: arrayUnion(jsonObj),
              });
            } else {
              jsonObj = {
                [query.hotelId]: {
                  HotelPicture:
                    jsonContent.ArrayOfBasicPropertyInfo.BasicPropertyInfo
                      .VendorMessages.VendorMessage[1]?.SubSection?.Paragraph
                      ?.URL?._text,
                  HotelName:
                    jsonContent.ArrayOfBasicPropertyInfo.BasicPropertyInfo
                      ?._attributes?.HotelName,
                },
              };
              //const cityId = String(query.cityId);
              var accCollecRef = db.collection("hotelImages").doc(cityId);

              await updateDoc(accCollecRef, {
                hotelImageList: arrayUnion(jsonObj),
              });
            }
            jsonObj = {
              [query.hotelId]: {
                HotelPicture:
                  jsonContent.ArrayOfBasicPropertyInfo.BasicPropertyInfo
                    .VendorMessages.VendorMessage[1]?.SubSection?.Paragraph[0]
                    ?.URL?._text,
                HotelName:
                  jsonContent.ArrayOfBasicPropertyInfo.BasicPropertyInfo
                    ?._attributes?.HotelName,
              },
            };
          }
        }
        return hotelStatic;
      },
      getHotelImages: async (cityId) => {
        const cityIds = String(cityId);
        const documentRef = db.collection("hotelImages").doc(cityIds);

        const doc = await documentRef.get();

        if (doc.exists) {
          const documentData = await doc.data();
          const transformedData = documentData.hotelImageList.reduce(
            (acc, entry) => {
              const hotelId = Object.keys(entry)[0];
              const hotelData = entry[hotelId];
              acc[hotelId] = hotelData;
              return acc;
            },
            {}
          );
          this.setState({
            hotelImageList: transformedData,
          });
          return transformedData;
        }
      },
      reauthenticate: async (email, password) => {
        try {
          var user = firebase.auth().currentUser;
          const credentials = firebase.auth.EmailAuthProvider.credential(
            email,
            password
          );
          var getUserDetails = await user.reauthenticateWithCredential(
            credentials
          );
          return getUserDetails.user.email;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
      changeUserPassword: async (email, currentPassword, newPassword) => {
        try {
          var getResEmail = await this.state.actions.reauthenticate(
            email,
            currentPassword
          );
          var user = firebase.auth().currentUser;
          if (email === getResEmail) {
            console.log(newPassword);
            await updatePassword(user, newPassword);
            this.setState({
              changePasswordError: null,
            });
          } else {
            this.setState({
              changePasswordError: "Incorrect password",
            });
          }
          this.setState({
            changePassword: false,
          });
        } catch (error) {
          console.log(error);
        }
      },
      editFlightService: async (serviceFee) => {
        try {
          var adminCollectionRef = db
            .collection("Accounts")
            .doc(this.state.adminDetails.userid);
          await updateDoc(adminCollectionRef, {
            domesticFlights: serviceFee.domesticFlights,
            internationalFlights: serviceFee.internationalFlights,
          });
        } catch (error) {
          console.log(error);
        }
      },
      editHotelService: async (serviceFee) => {
        try {
          var adminCollectionRef = db
            .collection("Accounts")
            .doc(this.state.adminDetails.userid);
          await updateDoc(adminCollectionRef, {
            domesticHotels: serviceFee.domesticHotels,
            internationalHotels: serviceFee.internationalHotels,
          });
        } catch (error) {
          console.log(error);
        }
      },
      editCabService: async (serviceFee) => {
        try {
          var adminCollectionRef = db
            .collection("Accounts")
            .doc(this.state.adminDetails.userid);
          await updateDoc(adminCollectionRef, {
            cabService: serviceFee,
          });
        } catch (error) {
          console.log(error);
        }
      },
      editMinimumCharge: async (serviceFee) => {
        try {
          var adminCollectionRef = db
            .collection("Accounts")
            .doc(this.state.adminDetails.userid);
          await updateDoc(adminCollectionRef, {
            minimumServiceCharge: serviceFee,
          });
        } catch (error) {
          console.log(error);
        }
      },
      editBusService: async (serviceFee) => {
        try {
          var adminCollectionRef = db
            .collection("Accounts")
            .doc(this.state.adminDetails.userid);
          await updateDoc(adminCollectionRef, {
            busService: serviceFee,
          });
        } catch (error) {
          console.log(error);
        }
      },
      editManager: async (managerData) => {
        this.setState({ managerRequestLoading: true });
        try {
          var accountsRef = db.collection("Accounts");
          var userQuery = accountsRef.where("email", "==", managerData.email);
          var querysnapshot = await userQuery.get();

          var userData = [];

          await querysnapshot.forEach((doc) => {
            userData.push(doc.data());
          });
          if (userData.length === 0) {
            this.setState({
              emailNotFound: true,
            });
            this.setState({ managerRequestLoading: true });
            return;
          }
          var currentUserRef = await db
            .collection("Accounts")
            .doc(this.state.userId);
          var managerData1 = {
            status: "pending",
            userId: userData[0].userid,
          };

          await updateDoc(currentUserRef, {
            manager: managerData1,
          });
          var managerRef = db.collection("Accounts").doc(userData[0].userid);
          var notifications = {
            userId: this.state.userId,
            message: "You have a new manager request.",
            name: this.state.userAccountDetails.firstName,
            email: this.state.userAccountDetails.email,
          };
          await updateDoc(managerRef, {
            notifications: arrayUnion(notifications),
          });
          const options = {
            managerEmail: managerData.email,
            userEmail: this.state.userAccountDetails.email,
            managerName: managerData.name,
            userName: this.state.userAccountDetails.firstName,
          };
          console.log(options);
          const response = await fetch(
            "https://tripbizzapi-lxyskuwaba-uc.a.run.app/userToManagerRequest",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(options),
            }
          );
          this.setState({ managerRequestLoading: false });
        } catch (error) {
          console.log(error);
          this.setState({ managerRequestLoading: false });
        }
      },
      editTeamMembers: async (notification, userid) => {
        try {
          var currentUserRef = db.collection("Accounts").doc(this.state.userId);
          await updateDoc(currentUserRef, {
            notifications: arrayRemove(notification),
          });
          await updateDoc(currentUserRef, {
            teamMembers: arrayUnion(notification),
          });
          var userRef = db.collection("Accounts").doc(userid);
          await updateDoc(userRef, {
            "manager.status": "Approved",
          });
          await this.state.actions.getUserById(this.state.userId);
        } catch (error) {
          console.log(error);
        }
      },
      setOffset: async (value) => {
        this.setState({
          offset: value,
        });
      },
      getLastDoc: async () => {
        try {
          var collectionRef = db.collection("Accounts").doc(this.state.userId);
          var tripsCollecRef = collectionRef.collection("trips");
          var docs = [];
          if (!this.state.offset) {
            await this.state.actions.setTrips({
              userTrips: docs,
              tripLoading: true,
            });
            const promises = [];
            const querySnapshot = await tripsCollecRef
              .orderBy("date", "desc")
              .limit(10)
              .get();

            querySnapshot.forEach((doc) => {
              promises.push(
                new Promise(async (resolve) => {
                  // Create a promise for each iteration
                  var hotels = await this.state.actions.getAllHotels(
                    doc.id,
                    this.state.userId
                  );
                  var flights = await this.state.actions.getAllFlights(
                    doc.id,
                    this.state.userId
                  );
                  var cabs = await this.state.actions.getAllCabs(
                    doc.id,
                    this.state.userId
                  );
                  var bus = await this.state.actions.getAllBus(
                    doc.id,
                    this.state.userId
                  );
                  var otherBookings =
                    await this.state.actions.getAllOtherBookings(
                      doc.id,
                      this.state.userId
                    );
                  docs.push({
                    id: doc.id,
                    data: doc.data(),
                    hotels: hotels,
                    flights: flights,
                    cabs: cabs,
                    bus,
                    otherBookings: otherBookings,
                  });
                  resolve();
                })
              );
            });

            await Promise.all(promises);

            await this.state.actions.setTrips({
              userTrips: docs,
              tripLoading: false,
            });
          } else {
            await this.state.actions.setTrips({
              userTrips: docs,
              tripLoading: true,
            });
            //const documentsToSkip = Math.max(0, this.state.offset - 10);
            //const querySnapshot = await tripsCollecRef.orderBy("date", "desc").offset(this.state.offset).limit(10).get();
            const documentsToSkip = Math.max(0, this.state.offset - 10);

            const querySnapshot = await tripsCollecRef
              .orderBy("date", "desc")
              .limit(documentsToSkip + 10)
              .get();
            const reversedDocs = [];

            querySnapshot.forEach((doc) => {
              reversedDocs.unshift(doc);
            });

            const docsToDisplay = reversedDocs.slice(0, 10);

            const promises = [];

            docsToDisplay.forEach((doc) => {
              promises.push(
                new Promise(async (resolve) => {
                  var hotels = await this.state.actions.getAllHotels(
                    doc.id,
                    this.state.userId
                  );
                  var flights = await this.state.actions.getAllFlights(
                    doc.id,
                    this.state.userId
                  );
                  docs.push({
                    id: doc.id,
                    data: doc.data(),
                    hotels: hotels,
                    flights: flights,
                  });
                  resolve();
                })
              );
            });

            await Promise.all(promises);
            await this.state.actions.setTrips({
              userTrips: docs,
              tripLoading: false,
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      deleteTripItem: async (tripId, itemId, itemType, userId) => {
        try {
          const docCollecRef = db
            .collection("Accounts")
            .doc(userId ? userId : this.state.userId)
            .collection("trips")
            .doc(tripId);
          var data = await docCollecRef.get();
          // var travellerDetails = data.data().travellerDetail;
          // delete travellerDetails[itemId]
          // updateDoc(docCollecRef, {
          //   travellerDetail: travellerDetails
          // })

          if (itemType === "hotels") {
            var hotels = await data.data().hotels;

            var deletedHotel = await hotels.filter(
              (hotel) => hotel.id === itemId
            );
            await updateDoc(docCollecRef, {
              hotels: arrayRemove(deletedHotel[0]),
            });
            await updateDoc(docCollecRef, {
              [`travellerDetails.${itemId}`]: deleteField(),
            });
            var hotelDoc = await docCollecRef
              .collection("hotels")
              .doc(itemId)
              .delete();
          }
          if (itemType === "flights") {
            var flights = await data.data().flights;
            var deletedFlight = await flights.filter(
              (flight) => flight.id === itemId
            );
            console.log(deletedFlight);
            await updateDoc(docCollecRef, {
              flights: arrayRemove(deletedFlight[0]),
            });
            await updateDoc(docCollecRef, {
              [`travellerDetails.${itemId}`]: deleteField(),
            });
            var flightDoc = await docCollecRef
              .collection("flights")
              .doc(itemId)
              .delete();
          }
          if (itemType === "cabs") {
            var cabs = await data.data().cabs;
            var deletedCab = await cabs.filter(
              (flight) => flight.id === itemId
            );
            await updateDoc(docCollecRef, {
              cabs: arrayRemove(deletedCab[0]),
            });
            await updateDoc(docCollecRef, {
              [`travellerDetails.${itemId}`]: deleteField(),
            });
            var cabDoc = await docCollecRef
              .collection("cabs")
              .doc(itemId)
              .delete();
          }
          if (itemType === "bus") {
            var buses = await data.data().bus;

            var deletedBus = await buses.filter((hotel) => hotel.id === itemId);
            await updateDoc(docCollecRef, {
              bus: arrayRemove(deletedBus[0]),
            });
            await updateDoc(docCollecRef, {
              [`travellerDetails.${itemId}`]: deleteField(),
            });
            var busDoc = await docCollecRef
              .collection("bus")
              .doc(itemId)
              .delete();
          }
          this.setState({
            tripData: null,
            tripDataLoading: true,
          });
          await this.state.actions.getTripDocById(tripId, userId);
          // await this.state.actions.getAdminTripDoc(tripId, userId);
        } catch (error) {
          console.log(error);
        }
      },
      sendAdminApproval: async (
        userId,
        managerId,
        tripId,
        price,
        managerComment,
        status,
        data
      ) => {
        var userDocRef = db.collection("Accounts").doc(userId);
        var tripCollecRef = userDocRef.collection("trips").doc(tripId);
        const tripData = await tripCollecRef.get();
        var tripReqcollectionRef = userDocRef.collection("tripRequests");
        var otherBookingsArray = tripData
          .data()
          .otherBookings.filter((other) => other.requestStatus === "Pending");
        var reqOther = otherBookingsArray.map((hotel) => {
          return hotel.id;
        });
        var newtripdocRef = await tripReqcollectionRef.add({
          createdAt: new Date(),
          status: status,
          tripId: tripId,
          userId: userId,
          price: price,
          flights: [],
          hotels: [],
          cabs: [],
          bus: [],
          otherBookings: reqOther,
          tripStatus: "Submitted",
          managerComment: managerComment,
        });
        var managerDocRef = db.collection("Accounts").doc(managerId);
        if (managerId) {
          if (status !== "Skipped") {
            await updateDoc(managerDocRef, {
              approvalRequests: arrayUnion({
                userId: userId,
                status: "Pending",
                tripId: tripId,
                requestId: newtripdocRef.id,
                totalPrice: price,
                flights: [],
                hotels: [],
                cabs: [],
                bus: [],
                managerComment: managerComment,
                otherBookings: reqOther,
              }),
            });
          }
        }
      },
      sendApproval: async (
        userId,
        managerId,
        tripId,
        travellerDetails,
        price,
        managerComment,
        status
      ) => {
        var userDocRef = db.collection("Accounts").doc(userId);
        var tripCollecRef = userDocRef.collection("trips").doc(tripId);
        const tripData = await tripCollecRef.get();
        var flightArray = tripData
          .data()
          .flights.filter((flight) => flight.requestStatus === "Not Requested");
        var hotelArray = tripData
          .data()
          .hotels.filter((hotel) => hotel.requestStatus === "Not Requested");
        var cabArray = tripData
          .data()
          ?.cabs?.filter((cab) => cab.requestStatus === "Not Requested");
        var busArray =
          tripData
            .data()
            ?.bus?.filter((bus) => bus.requestStatus === "Not Requested") ?? [];

        var reqFlights = flightArray.map((flight) => {
          return flight.id;
        });
        var reqHotels = hotelArray.map((hotel) => {
          return hotel.id;
        });
        var reqCabs =
          cabArray?.length > 0
            ? cabArray?.map((hotel) => {
                return hotel.id;
              })
            : [];
        var reqBus = busArray.map((bus) => {
          return bus.id;
        });

        var tripReqcollectionRef = userDocRef.collection("tripRequests");
        var newtripdocRef = await tripReqcollectionRef.add({
          createdAt: new Date(),
          status: status,
          tripId: tripId,
          userId: userId,
          price: price,
          flights: reqFlights,
          hotels: reqHotels,
          cabs: reqCabs,
          bus: reqBus,
          tripStatus: "Not Submitted",
          managerComment: managerComment,
        });

        if (status === "Pending") {
          var managerDocRef = db.collection("Accounts").doc(managerId);
          await updateDoc(managerDocRef, {
            approvalRequests: arrayUnion({
              userId: userId,
              status: "Pending",
              tripId: tripId,
              requestId: newtripdocRef.id,
              totalPrice: price,
              flights: reqFlights,
              hotels: reqHotels,
              cabs: reqCabs,
              bus: reqBus,
              managerComment: managerComment,
            }),
          });
        }
        var newTravellers = {
          ...tripData.data().travellerDetails,
          ...travellerDetails,
        };
        await updateDoc(tripCollecRef, {
          requestId: arrayUnion(newtripdocRef.id),
          travellerDetails: newTravellers,
          price: price,
        });
        await flightArray.forEach(async (flight) => {
          await updateDoc(tripCollecRef, {
            flights: arrayRemove(flight),
          });
          var newflight = {
            ...flight,
            requestStatus: status,
            manager_request_time: new Date(),
          };
          await updateDoc(tripCollecRef, {
            flights: arrayUnion(newflight),
          });
        });
        await hotelArray.forEach(async (hotel) => {
          await updateDoc(tripCollecRef, {
            hotels: arrayRemove(hotel),
          });
          var newhotel = {
            ...hotel,
            requestStatus: status,
            manager_request_time: new Date(),
          };
          await updateDoc(tripCollecRef, {
            hotels: arrayUnion(newhotel),
          });
        });
        await cabArray?.forEach(async (cab) => {
          await updateDoc(tripCollecRef, {
            cabs: arrayRemove(cab),
          });
          var newCab = {
            ...cab,
            requestStatus: status,
            manager_request_time: new Date(),
          };
          await updateDoc(tripCollecRef, {
            cabs: arrayUnion(newCab),
          });
        });
        await busArray?.forEach(async (bus) => {
          await updateDoc(tripCollecRef, {
            bus: arrayRemove(bus),
          });
          var newBus = {
            ...bus,
            requestStatus: status,
            manager_request_time: new Date(),
          };
          await updateDoc(tripCollecRef, {
            bus: arrayUnion(newBus),
          });
        });
        await Promise.all([
          await this.state.actions.getTripDoc(
            tripId,
            userId ? userId : this.state.userId
          ),
        ]);

        var reqData = {
          createdAt: new Date(),
          status: status,
          tripId: tripId,
          userId: userId,
          price: price,
          flights: reqFlights,
          hotels: reqHotels,
          cabs: cabArray,
          bus: busArray,
        };
        var reqId = newtripdocRef.id;
        return { reqId, reqData };
      },
      getTripsFlights: async (flightIds, tripId, userId) => {
        var flightsArray = [];
        if (flightIds.length > 0) {
          await flightIds.forEach(async (flightId) => {
            var hotelCollectionRef = db
              .collection("Accounts")
              .doc(userId)
              .collection("trips")
              .doc(tripId)
              .collection("flights")
              .doc(flightId);
            const querysnapshot = await hotelCollectionRef.get();
            var sendData = await querysnapshot.data();
            var modifiedFlightObj = await this.state.actions.objToArr(sendData);
            flightsArray.push({
              id: querysnapshot.id,
              data: modifiedFlightObj,
            });
          });
          return flightsArray;
        } else {
          return [];
        }
      },
      getTripsHotels: async (hotelIds, tripId, userId) => {
        var hotelArray = [];
        if (hotelIds.length > 0) {
          await hotelIds.forEach(async (hotelId) => {
            var hotelCollectionRef = db
              .collection("Accounts")
              .doc(userId)
              .collection("trips")
              .doc(tripId)
              .collection("hotels")
              .doc(hotelId);
            const querysnapshot = await hotelCollectionRef.get();
            var sendData = await querysnapshot.data();
            hotelArray.push({
              id: querysnapshot.id,
              data: sendData,
            });
          });
          return hotelArray;
        } else {
          return [];
        }
      },
      getTripsCabs: async (hotelIds, tripId, userId) => {
        var hotelArray = [];
        if (hotelIds?.length > 0) {
          await hotelIds.forEach(async (hotelId) => {
            var hotelCollectionRef = db
              .collection("Accounts")
              .doc(userId)
              .collection("trips")
              .doc(tripId)
              .collection("cabs")
              .doc(hotelId);
            const querysnapshot = await hotelCollectionRef.get();
            var sendData = await querysnapshot.data();
            hotelArray.push({
              id: querysnapshot.id,
              data: sendData,
            });
          });
          return hotelArray;
        } else {
          return [];
        }
      },
      getTripsBuses: async (BusIds, tripId, userId) => {
        var busArray = [];
        if (BusIds?.length > 0) {
          await BusIds.forEach(async (busId) => {
            var busCollectionRef = db
              .collection("Accounts")
              .doc(userId)
              .collection("trips")
              .doc(tripId)
              .collection("bus")
              .doc(busId);
            const querysnapshot = await busCollectionRef.get();
            var sendData = await querysnapshot.data();
            busArray.push({
              id: querysnapshot.id,
              data: sendData,
            });
          });
          return busArray;
        } else {
          return [];
        }
      },
      getTripsOthers: async (otherIds, tripId, userId) => {
        var otherArray = [];
        if (otherIds?.length > 0) {
          await otherIds.forEach(async (otherId) => {
            var busCollectionRef = db
              .collection("Accounts")
              .doc(userId)
              .collection("trips")
              .doc(tripId)
              .collection("otherbookings")
              .doc(otherId);
            const querysnapshot = await busCollectionRef.get();
            var sendData = await querysnapshot.data();
            otherArray.push({
              id: querysnapshot.id,
              data: sendData,
            });
          });
          return otherArray;
        } else {
          return [];
        }
      },
      getTripsForApproval: async (approvalRequests) => {
        if (!approvalRequests) {
          this.setState({
            approveLoading: false,
          });
          return;
        }
        console.log(approvalRequests?.slice(0, 14));
        var requestData = [];
        this.setState({
          approveLoading: true,
        });
        if (approvalRequests) {
          // const start = (page - 1) * tripsPerpage;
          // const end = start + tripsPerpage;
          // const paginatedRequests = approvalRequests
          //   .reverse()
          //   .slice(start, end);
          await Promise.all(
            approvalRequests.slice(-10)?.map(async (req) => {
              var userDataRef = db.collection("Accounts").doc(req.userId);
              var data = await userDataRef.get();
              var tripRef = userDataRef.collection("trips").doc(req.tripId);
              // var anotherTrip = (await userDataRef.collection("trips").orderBy("date","asc").limit(10).get())
              // console.log(anotherTrip.docs);
              const [flights, hotels, cabs, bus, otherBookings] =
                await Promise.all([
                  await this.state.actions.getTripsFlights(
                    req.flights,
                    req.tripId,
                    req.userId
                  ),
                  await this.state.actions.getTripsHotels(
                    req.hotels,
                    req.tripId,
                    req.userId
                  ),
                  await this.state.actions.getTripsCabs(
                    req.cabs,
                    req.tripId,
                    req.userId
                  ),
                  await this.state.actions.getTripsBuses(
                    req.bus,
                    req.tripId,
                    req.userId
                  ),
                  await this.state.actions.getTripsOthers(
                    req.otherBookings,
                    req.tripId,
                    req.userId
                  ),
                ]);
              var doc = await tripRef.get();
              var tripReqRef = userDataRef
                .collection("tripRequests")
                .doc(req.requestId);
              var reqDoc = await tripReqRef.get();

              var tripDetails = {
                userDetails: data.data(),
                tripDetails: {
                  id: doc.id,
                  data: doc.data(),
                  hotels: hotels,
                  flights: flights,
                  cabs: cabs,
                  bus: bus,
                  otherBookings: otherBookings,
                },
                requestDetails: reqDoc.data(),
                approvalRequest: req,
              };
              requestData.push(tripDetails);
            })
          );
        }
        this.setState({
          approveLoading: false,
        });
        return requestData;
      },
      getAllTripsForApproval: async (approvalRequests) => {
        var requestAllData = [];
        this.setState({
          approveAllLoading: true,
        });
        if (approvalRequests) {
          // const start = (page - 1) * tripsPerpage;
          // const end = start + tripsPerpage;
          // const paginatedRequests = approvalRequests
          //   .reverse()
          //   .slice(start, end);
          await Promise.all(
            approvalRequests?.map(async (req) => {
              var userDataRef = db.collection("Accounts").doc(req.userId);
              var data = await userDataRef.get();
              var tripRef = userDataRef.collection("trips").doc(req.tripId);
              // var anotherTrip = (await userDataRef.collection("trips").orderBy("date","asc").limit(10).get())
              // console.log(anotherTrip.docs);
              const [flights, hotels, cabs, bus] = await Promise.all([
                await this.state.actions.getTripsFlights(
                  req.flights,
                  req.tripId,
                  req.userId
                ),
                await this.state.actions.getTripsHotels(
                  req.hotels,
                  req.tripId,
                  req.userId
                ),
                await this.state.actions.getTripsCabs(
                  req.cabs,
                  req.tripId,
                  req.userId
                ),
                await this.state.actions.getTripsBuses(
                  req.bus,
                  req.tripId,
                  req.userId
                ),
              ]);
              var doc = await tripRef.get();
              var tripReqRef = userDataRef
                .collection("tripRequests")
                .doc(req.requestId);
              var reqDoc = await tripReqRef.get();

              var tripDetails = {
                userDetails: data.data(),
                tripDetails: {
                  id: doc.id,
                  data: doc.data(),
                  hotels: hotels,
                  flights: flights,
                  cabs: cabs,
                  bus: bus,
                },
                requestDetails: reqDoc.data(),
                approvalRequest: req,
              };
              requestAllData.push(tripDetails);
            })
          );
        }
        this.setState({
          approveAllLoading: false,
        });
        return requestAllData;
      },
      nonMandatoryRequests: async () => {},
      approveTripRequest: async (approvalRequest, managerId, templateData) => {
        var userDocRef = db.collection("Accounts").doc(approvalRequest.userId);
        const userDoc = await userDocRef.get();
        const userData = await userDoc.data();

        var tripRef = userDocRef
          .collection("trips")
          .doc(approvalRequest.tripId);
        var tripSnapshot = await tripRef.get();
        var tripData = await tripSnapshot.data();

        console.log(tripData);
        console.log(approvalRequest);
        console.log(managerId);

        await this.state.actions.sendBookingApprovedEmail({
          id: userData.id,
          userName: userData.firstName + userData.lastName,
          userEmail: userData.email,
          managerEmail: this.state.userAccountDetails.email,
          managerName:
            this.state.userAccountDetails.firstName +
            this.state.userAccountDetails.lastName,
          tripName: tripData.name,
          templateData: templateData,
        });
        if (approvalRequest.flights) {
          var flightData = tripData.flights.filter((flight) =>
            approvalRequest.flights.includes(flight.id)
          );
          for (const flight of flightData) {
            await updateDoc(tripRef, { flights: arrayRemove(flight) });
            var fData = {
              ...flight,
              requestStatus: "Approved",
              managerApprovedTime: new Date(),
            };
            await updateDoc(tripRef, { flights: arrayUnion(fData) });
          }
        }

        if (approvalRequest.hotels) {
          var hotelData = tripData.hotels.filter((hotel) =>
            approvalRequest.hotels.includes(hotel.id)
          );
          for (const hotel of hotelData) {
            await updateDoc(tripRef, { hotels: arrayRemove(hotel) });
            var fData = {
              ...hotel,
              requestStatus: "Approved",
              managerApprovedTime: new Date(),
            };
            await updateDoc(tripRef, { hotels: arrayUnion(fData) });
          }
        }

        if (approvalRequest.cabs.length > 0) {
          var cabData = tripData.cabs?.filter((cab) =>
            approvalRequest.cabs.includes(cab.id)
          );
          if (cabData) {
            for (const cab of cabData) {
              await updateDoc(tripRef, { cabs: arrayRemove(cab) });
              var fData = {
                ...cab,
                requestStatus: "Approved",
                managerApprovedTime: new Date(),
              };
              await updateDoc(tripRef, { cabs: arrayUnion(fData) });
            }
          }
        }

        if (approvalRequest.bus.length > 0) {
          var busData = tripData.bus?.filter((bus) =>
            approvalRequest.bus.includes(bus.id)
          );
          if (busData) {
            for (const bus of busData) {
              await updateDoc(tripRef, { bus: arrayRemove(bus) });
              var fData = {
                ...bus,
                requestStatus: "Approved",
                managerApprovedTime: new Date(),
              };
              await updateDoc(tripRef, { bus: arrayUnion(fData) });
            }
          }
        }
        if (approvalRequest.otherBookings) {
          console.log(tripData?.otherbookings);
          var othersData = tripData.otherBookings.filter((other) =>
            approvalRequest.otherBookings.includes(other.id)
          );

          for (const other of othersData) {
            await updateDoc(tripRef, { otherBookings: arrayRemove(other) });
            var fData = {
              ...other,
              requestStatus: "Approved",
              managerApprovedTime: new Date(),
            };
            await updateDoc(tripRef, { otherBookings: arrayUnion(fData) });
          }
        }

        var tripReqcollectionRef = userDocRef
          .collection("tripRequests")
          .doc(approvalRequest.requestId);
        var managerDocRef = db.collection("Accounts").doc(managerId);

        await updateDoc(managerDocRef, {
          approvalRequests: arrayRemove(approvalRequest),
        });
        var data = {
          ...approvalRequest,
          status: "Approved",
          managerApprovedTime: new Date(),
        };
        await updateDoc(managerDocRef, { approvalRequests: arrayUnion(data) });

        await updateDoc(tripReqcollectionRef, {
          status: "Approved",
          updatedAt: new Date(),
          approvedTime: new Date(),
        });
      },
      getApprovalTrips: async (requestId, tripId) => {
        var userDataRef = db
          .collection("Accounts")
          .doc(this.state.userId)
          .collection("tripRequests")
          .doc(requestId);
        var data = await userDataRef.get();
        console.log(data.data());
        var tripRef = userDataRef.collection("trips").doc(tripId);
        // const [flights, hotels] = await Promise.all([
        //   this.state.actions.getAllFlights(tripRef.id, requestId.userId),
        //   this.state.actions.getAllHotels(tripRef.id, requestId.userId)
        // ]);
        const flightIds = data.data().flights.map((id) => id.id);
        const hotelIds = data.data().hotels.map((id) => id.id);

        // var doc = await tripRef.get();
        // var tripReqRef = userDataRef.collection("tripRequests").doc(req.requestId)
        // var reqDoc = await tripReqRef.get();
        // var tripDetails = {
        //   userDetails: data.data(),
        //   tripDetails: {
        //     id: doc.id,
        //     data: doc.data(),
        //     hotels: hotels,
        //     flights: flights
        //   },
        //   requestDetails: reqDoc.data(),
        //   approvalRequest: req
        // }
        // requestData.push(tripDetails);
      },
      updateWalletBalance: async (paymentDetails, balance) => {
        var accCollectionRef = db.collection("Accounts").doc(this.state.userId);
        var accSnapShot = await accCollectionRef.get();
        console.log(accSnapShot);
        var userData = await accSnapShot.data();
        var finalBalance = Number(userData.balance) + Number(balance);
        var data = {
          Date: Date.now(),
          type: "Credit",
          amount: balance,
          application: "",
          balance: finalBalance,
          payment: paymentDetails,
        };
        await updateDoc(accCollectionRef, {
          balance: finalBalance,
          transactions: arrayUnion(data),
        });
        await this.state.actions.getUserById(this.state.userId);
      },
      makeTripPayment: async (tripName, price) => {
        var accCollectionRef = db.collection("Accounts").doc(this.state.userId);
        var accSnapShot = await accCollectionRef.get();
        console.log(accSnapShot);
        var userData = accSnapShot.data();
        var finalBalance = Number(userData.balance) - Number(price);
        var data = {
          Date: Date.now(),
          type: "Debit",
          amount: price,
          application: tripName,
          balance: finalBalance,
        };
        await updateDoc(accCollectionRef, {
          balance: finalBalance,
          transactions: arrayUnion(data),
        });
        await this.state.actions.getUserById(this.state.userId);
      },
      createOrder: async (money) => {
        try {
          const body = {
            amount: money,
            receipt: "receipt_0011",
          };
          const response = await fetch(
            "https://tripbizzapi-lxyskuwaba-uc.a.run.app/getOrderId",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          var data = await response.json();
          return data;
        } catch (error) {
          console.log(error);
        }
      },
      updateAdminBalance: async (userId, price, details) => {
        var accCollectionRef = db.collection("Accounts").doc(userId);
        var accSnapShot = await accCollectionRef.get();
        var userData = accSnapShot.data();
        var finalBalance = Number(userData.balance) + Number(price);
        var data = {
          Date: Date.now(),
          type: "Credit",
          amount: price,
          application: "",
          balance: finalBalance,
          payment: details,
        };
        await updateDoc(accCollectionRef, {
          balance: finalBalance,
          transactions: arrayUnion(data),
        });
        await this.state.actions.getUserByIdAdmin(userId);
      },
      setAdminUserId: async (value) => {
        this.setState({
          adminUserId: value,
        });
      },
      sendAccountCreationEmail: async (userData) => {
        try {
          const response = await fetch(
            "https://tripbizzapi-lxyskuwaba-uc.a.run.app/sendCreateEmail",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          var data = await response.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      sendBookingApprovedEmail: async (userData) => {
        try {
          const response = await fetch(
            "https://tripbizzapi-lxyskuwaba-uc.a.run.app/sendBookingApporvedEmail",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          var data = await response.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      sendBookingStatusEmail: async (userData) => {
        try {
          const response = await fetch(
            "https://tripbizzapi-lxyskuwaba-uc.a.run.app/sendStatusChangeEmail",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          var data = await response.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      sendBookingApprovalEmail: async (userData) => {
        const live =
          "https://tripbizzapi-lxyskuwaba-uc.a.run.app/sendBookingApprovalEmail";
        try {
          const response = await fetch(
            "https://tripbizzapi-lxyskuwaba-uc.a.run.app/sendBookingApprovalEmail",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          var data = await response.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      sendBookingSubmitEmail: async (userData) => {
        try {
          const response = await fetch(
            "https://tripbizzapi-lxyskuwaba-uc.a.run.app/sendBookingSubmitEmail",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          var data = await response.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      normalizeDate: (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
      },
      createExcelSheet: async (data, startDate, endDate) => {
        const normalizedStartDate = this.state.actions.normalizeDate(startDate);
        const normalizedEndDate = this.state.actions.normalizeDate(endDate);
        var downloadJSON = [];
        await Promise.all(
          data?.map(async (trip) => {
            var tripData = {
              tripName: trip?.tripData?.name,
              tripCreatedDate: format(
                new Date(trip.tripData?.date?.seconds * 1000),
                "dd-MM-yyyy HH:mm:ss eee"
              ),
              clientName:
                trip.data.userDetails?.firstName +
                trip.data.userDetails?.lastName,
              clientEmail: trip.data.userDetails?.email,
              clientMobile: trip.data.userDetails?.mobileNumber,
              clientGST: trip.data.userDetails?.GSTNo,
              clientPAN: trip.data.userDetails?.PANNo,
              clientCompnay: trip.data.userDetails?.companyName,
            };
            const totalIds = [];
            trip.data?.flights?.map((flight) => {
              return totalIds.push({
                type: "flights",
                id: flight.id,
                bookedAt: flight?.bookedAt,
                status: flight.status,
              });
            });
            trip.data?.hotels?.map((flight) => {
              return totalIds.push({
                type: "hotels",
                id: flight.id,
                bookedAt: flight?.bookedAt,
                status: flight.status,
              });
            });
            trip.data?.bus?.map((flight) => {
              return totalIds.push({
                type: "bus",
                id: flight.id,
                bookedAt: flight?.bookedAt,
                status: flight.status,
              });
            });
            trip?.data?.cabs?.map((flight) => {
              return totalIds.push({
                type: "cabs",
                id: flight.id,
                bookedAt: flight?.bookedAt,
                status: flight.status,
              });
            });
            trip?.data?.otherBookings?.map((flight) => {
              return totalIds.push({
                type: "otherbookings",
                id: flight.id,
                bookedAt: flight?.bookedAt,
                status: flight.status,
              });
            });
            var newIds = totalIds.filter((type) => {
              return type.status === "Booked";
            });
            var finalIds = newIds.filter((id) => {
              const bookedDate = this.state.actions.normalizeDate(id.bookedAt);
              return (
                bookedDate >= normalizedStartDate &&
                bookedDate <= normalizedEndDate
              );
            });
            await Promise.all(
              finalIds.map(async (item) => {
                const itemType =
                  item.type === "otherbookings" ? "otherBookings" : item.type;
                var addedDate = trip.data[itemType]?.filter((flight) => {
                  return flight.id === item.id;
                });
                var accCollecRef = db
                  .collection("Accounts")
                  .doc(trip?.data?.userDetails?.userid);
                var tripCollecRef = accCollecRef
                  .collection("trips")
                  .doc(trip.data.tripId);
                var itemCollecRef = tripCollecRef
                  .collection(item.type)
                  .doc(item.id);
                var invoiceRef = await accCollecRef
                  .collection("invoices")
                  .doc(trip.data.tripId)
                  .get();
                const invoices = invoiceRef
                  .data()
                  ?.invoiceDetails?.filter(
                    (invoiceData) => invoiceData.cardId === item.id
                  );
                var itemSnap = await itemCollecRef.get();
                if (!itemSnap.exists) {
                  console.log(itemSnap, trip);
                }
                var itemTypeData = itemSnap.data();
                var itemDesc, quotedPrice, Servicefee, GST, cost;
                if (item.type === "flights") {
                  var data2 = await this.state.actions.objToArr(itemTypeData);
                  var flightArr =
                    data2?.length > 0
                      ? [data2[0].flight]?.map((flight, f) => {
                          return {
                            ...this.state.actions.modifyFlightObject(flight),
                          };
                        })
                      : [];

                  if (!Array.isArray(flightArr)) return [];

                  const data = await Promise.all(
                    flightArr?.[0]?.segments.map(async (book, ind) => {
                      return (
                        book?.originAirportCode +
                        "-" +
                        book?.destAirportCode +
                        "-" +
                        book?.depTime +
                        "-" +
                        book?.arrTime
                        // +
                        // "-"
                        // +
                        // book?.depTimeDate.toLocaleString() +
                        // "-" +
                        // book?.arrTimeDate.toLocaleString()
                      );
                    })
                  );
                  itemDesc = data.join(",");
                  quotedPrice =
                    itemTypeData &&
                    Math.ceil(
                      itemTypeData[0]?.totalFare +
                        itemTypeData[0]?.finalFlightServiceCharge +
                        itemTypeData[0]?.gstInFinalserviceCharge
                    );
                  var flightBookPrice = addedDate
                    ? addedDate[0]?.ticketCost
                      ? addedDate[0]?.ticketCost
                      : 0
                    : 0;
                  // var x = quotedPrice - itemTypeData[0].totalFare;
                  Servicefee = Math.ceil(
                    itemTypeData[0].finalFlightServiceCharge
                  );
                  GST = Math.ceil(itemTypeData[0].gstInFinalserviceCharge);
                  cost = Math.ceil(itemTypeData[0].totalFare);
                }

                if (item.type === "hotels") {
                  itemDesc =
                    itemTypeData?.hotelInfo?.HotelInfoResult?.HotelDetails
                      ?.HotelName +
                    "-" +
                    itemTypeData?.hotelSearchQuery?.cityDestName +
                    `("${format(
                      new Date(
                        itemTypeData?.hotelSearchQuery?.checkInDate?.seconds *
                          1000
                      ),
                      "dd-MM-yyyy"
                    )}"--"${format(
                      new Date(
                        itemTypeData?.hotelSearchQuery?.checkOutDate?.seconds *
                          1000
                      ),
                      "dd-MM-yyyy"
                    )}")`;
                  quotedPrice = Math.ceil(itemTypeData.hotelTotalPrice);
                  var hotelBookPrice = addedDate
                    ? addedDate[0]?.ticketCost
                      ? addedDate[0]?.ticketCost
                      : 0
                    : 0;
                  Servicefee = Math.ceil(itemTypeData.hotelServiceCharge);
                  GST = Math.ceil(itemTypeData.calculateGstFromService);
                  cost = Math.ceil(itemTypeData.hotelFinalPrice);
                }
                if (item.type === "cabs") {
                  itemDesc =
                    itemTypeData.cab.carType +
                    "-" +
                    itemTypeData.cabType +
                    "-" +
                    itemTypeData.cabCity;
                  quotedPrice = itemTypeData.cabTotalPrice;

                  var cabBookPrice = addedDate
                    ? addedDate[0]?.ticketCost
                      ? addedDate[0]?.ticketCost
                      : 0
                    : 0;
                  // var z = quotedPrice - itemTypeData.cabFinalPrice;
                  Servicefee = Math.ceil(itemTypeData.finalServiceCharge);
                  GST = Math.ceil(itemTypeData.gstInFinalserviceCharge);
                  cost = Math.ceil(itemTypeData.cabFinalPrice);
                }
                if (item.type === "otherbookings") {
                  itemDesc = itemTypeData.bookingDetails;
                  quotedPrice = Math.ceil(itemTypeData.overallBookingPrice);
                  // var z = quotedPrice - itemTypeData.bookingCost;
                  Servicefee = Math.ceil(itemTypeData.bookingService);
                  GST = Math.ceil(itemTypeData.bookingGst);
                  cost = Math.ceil(itemTypeData.bookingCost);
                }
                if (item.type === "bus") {
                  itemDesc =
                    itemTypeData.boardingPointDetails +
                    "-" +
                    itemTypeData.droppingPointDetails;
                  quotedPrice = Math.ceil(itemTypeData.busTotalPrice);
                  // var z = quotedPrice - itemTypeData.busPrice;
                  Servicefee = Math.ceil(itemTypeData.serviceCharge);
                  GST = Math.ceil(itemTypeData.GST);
                  cost = Math.ceil(itemTypeData.busPrice);
                }
                var itemData = {
                  itemType: item.type,
                  addedDate: format(
                    new Date(addedDate[0]?.date?.seconds * 1000),
                    "dd-MM-yyyy HH:mm:ss eee"
                  ),
                  bookingStatus: addedDate ? addedDate[0]?.status : "",
                  itemDescription: itemDesc,
                  cost,
                  quotedPrice: Math.ceil(quotedPrice).toLocaleString(),
                  Servicefee,
                  GST,
                  bookedDate: format(
                    new Date(item.bookedAt),
                    "dd-MM-yyyy HH:mm:ss eee"
                  ),
                  bookedCost: addedDate
                    ? addedDate[0]?.ticketCost
                      ? addedDate[0]?.ticketCost
                      : 0
                    : 0,
                  invoiceNo: invoices?.[0]?.invoiceId,
                };
                downloadJSON.push({ ...tripData, ...itemData });
              })
            );
          })
        );
        const getColumnWidths = (data) => {
          const columnWidths = [];
          if (data.length === 0) return columnWidths;

          const keys = Object.keys(data[0]);
          keys.forEach((key) => {
            const maxWidth = Math.max(
              ...data.map((item) => item[key]?.toString().length || 0),
              key.length
            );
            columnWidths.push({ wch: maxWidth + 2 }); // Add some extra space for readability
          });
          return columnWidths;
        };
        const worksheet = XLSX.utils.json_to_sheet(downloadJSON);
        worksheet["!cols"] = getColumnWidths(downloadJSON); // Set column widths

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        saveAs(blob, "data.xlsx");
      },
      getHotelUpdatedDetails: async (
        cityId,
        searchReq,
        selectedRoom,
        hotelRes
      ) => {
        console.log(selectedRoom);
        var checkInDate = new Date(searchReq.checkInDate.seconds * 1000);
        let roomGuests = [];

        searchReq.hotelRoomArr.forEach((room, r) => {
          roomGuests.push({
            NoOfAdults: Number(room.adults),
            NoOfChild: Number(room.child),
            ChildAge: room.childAge.map((child, c) => Number(child.age)),
          });
        });

        var request = {
          checkInDate: this.state.actions.convertTboDateFormat(checkInDate),
          nights: searchReq.hotelNights,
          countryCode: searchReq.countryCode,
          cityId: cityId,
          noOfRooms: searchReq.hotelRooms,
          roomGuests: roomGuests,
          HotelId: hotelRes.HotelCode,
        };

        var hotelStatic = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelSearchRes",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));
        if (hotelStatic?.error?.ErrorCode > 0) {
          return [];
        }
        var hotelResults =
          hotelStatic.hotelResult.HotelSearchResult.HotelResults;
        var data = hotelResults.filter((hotel) => {
          return hotel.HotelCode === hotelRes.HotelCode;
        });
        console.log(data);
        if (!data && data.length === 0) {
          return [];
        }
        var infoReq = {
          traceId: hotelStatic.hotelResult.HotelSearchResult.TraceId,
          tokenId: hotelStatic.tokenId,
          resultIndex: data[0].ResultIndex,
          hotelCode: data[0].HotelCode,
          categoryId:
            data[0].SupplierHotelCodes && data[0].SupplierHotelCodes.length > 0
              ? data[0].SupplierHotelCodes[0].CategoryId
              : "",
        };

        var hotelInfoRes = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelInfoRes",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(infoReq),
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));
        var selectedRooms = [];
        hotelInfoRes.roomResult.GetHotelRoomResult.HotelRoomsDetails.forEach(
          (mainRoom) => {
            selectedRoom.forEach((room) => {
              if (
                mainRoom.RoomTypeName === room.RoomTypeName &&
                mainRoom.RoomTypeCode === room.RoomTypeCode &&
                // mainRoom.RatePlanCode === room.RatePlanCode &&
                // mainRoom.RoomIndex === room.RoomIndex &&
                mainRoom.LastCancellationDate === room.LastCancellationDate
              ) {
                selectedRooms.push(mainRoom);
              }
            });
          }
        );
        console.log(selectedRooms);
        return selectedRooms;
      },
      getFlightUpdatedDetails: async (searchReqs, flight) => {
        try {
          this.setState({ recheckLoad: true });
          var flightRes = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightSearch",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(searchReqs),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));
          var flightSearchToken = flightRes.tokenId;
          var flightTraceId = flightRes?.flightResult?.Response?.TraceId;
          console.log(flightRes?.flightResult?.Response?.Results[0]);
          var data = flightRes?.flightResult?.Response?.Results[0].filter(
            (fData) => {
              if (fData[0].Segments.length > 1) {
                return (
                  fData[0].flightCodeStr === flight.flightCodeStr &&
                  fData[0].Segments[fData[0].Segments.length - 1][
                    fData[0].Segments[0].length - 1
                  ].Destination.ArrTime ===
                    flight.Segments[flight.Segments.length - 1][
                      flight.Segments[0].length - 1
                    ].Destination.ArrTime
                );
              } else {
                return (
                  fData[0].flightCodeStr === flight.flightCodeStr &&
                  fData[0].Segments[0][fData[0].Segments[0].length - 1]
                    .Destination.ArrTime ===
                    flight.Segments[0][flight.Segments[0].length - 1]
                      .Destination.ArrTime
                );
              }
            }
          );
          // const fareFilteredFlight = data.filter(
          //   (e, i) =>
          //     e.FareRules[0].FareBasisCode === flight.FareRules[0].FareBasisCode
          // );
          const fareFilteredFlight = data.map((e, i) =>
            e.filter(
              (f, j) =>
                f.FareRules[0].FareBasisCode ===
                flight.FareRules[0].FareBasisCode
            )
          );

          const filteredResIndex = data?.filter(
            (item, i) => item[i].ResultIndex === flight.ResultIndex
          );

          var resIndex = fareFilteredFlight[0][0].ResultIndex;

          var request = {
            tokenId: flightSearchToken,
            traceId: flightTraceId,
            resultIndex: resIndex,
          };

          var data2 = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightBookData",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(request),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));

          var flightData = data2.fareQuoteResult.Response.Results;
          console.log(data2);
          var ssrData = data2?.ssrResult?.Response;
          console.log(ssrData);
          console.log(flightData);
          this.setState({ recheckLoad: false });
          return { flightData, ssrData };
        } catch (error) {
          console.log(error);
          this.setState({ recheckLoad: false });
          this.setState({ recheckError: true });
        }
      },
      updateFlightBookingDetails: async (newprice, flightId, tripId) => {
        var tripsRef = db
          .collection("Accounts")
          .doc(this.state.userId)
          .collection("trips")
          .doc(tripId);
        var tripSnap = await tripsRef.get();
        var tripData = tripSnap.data();
        var tripItem = tripData.flights.filter(
          (flight) => flight.id === flightId
        );

        await updateDoc(tripsRef, {
          flights: arrayRemove(tripItem[0]),
        });
        await updateDoc(tripsRef, {
          flights: arrayUnion({ ...tripItem[0], updatedAt: new Date() }),
        });
        var itemRef = tripsRef.collection("flights").doc(flightId);
        var itemsnap = await itemRef.get();
        var itemData = itemsnap.data();
        var totPrice =
          itemData["0"].finalPrice -
          itemData["0"].flight.Fare.OfferedFare +
          newprice;
        itemData["0"].finalPrice = totPrice;
        itemData["0"].totalFare =
          itemData["0"].totalFare -
          itemData["0"].flight.Fare.OfferedFare +
          newprice;
        itemData["0"].flightNew.fare =
          itemData["0"].flightNew.fare -
          itemData["0"].flight.Fare.OfferedFare +
          newprice;
        itemData["0"].flight.Fare.OfferedFare = newprice;
        itemData["0"].flight.Fare.PublishedFare = newprice;
        itemRef.update(itemData);
        await this.state.actions.getTripDocById(tripId, this.state.userId);
      },
      updateHotelBookingDetails: async (newprice, hotelId, tripId) => {
        var tripsRef = db
          .collection("Accounts")
          .doc(this.state.userId)
          .collection("trips")
          .doc(tripId);
        var tripSnap = await tripsRef.get();
        var tripData = tripSnap.data();
        var tripItem = tripData.hotels.filter((hotel) => hotel.id === hotelId);
        await updateDoc(tripsRef, {
          hotels: arrayRemove(tripItem[0]),
        });
        await updateDoc(tripsRef, {
          hotels: arrayUnion({ ...tripItem[0], updatedAt: new Date() }),
        });
        var itemRef = tripsRef.collection("hotels").doc(hotelId);
        var itemsnap = await itemRef.get();
        var itemData = itemsnap.data();
        var totprice =
          itemData.hotelTotalPrice - itemData.hotelFinalPrice + newprice;
        itemData.hotelTotalPrice = totprice;
        itemData.hotelFinalPrice = newprice;
        itemRef.update(itemData);
        await this.state.actions.getTripDocById(tripId, this.state.userId);
      },
      createInvoice: async (tripData) => {
        var hotelString = "";
        var price = 0;
        const today = new Date();
        const day = today.toString().slice(8, 10);
        var monthStr = today.toISOString().slice(5, 7);
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const financialYear = month >= 4 ? year : year - 1;
        var yrString = `${financialYear % 100}-${(financialYear % 100) + 1}`;
        var randomNum = Math.floor(1 + Math.random() * 9);
        var dateString = `${day}${monthStr}`;
        var finalString = `TB/${yrString}/${dateString}${randomNum}`;
        if (tripData.hotels.length > 0) {
          tripData.hotels
            .filter((hotel) => {
              var hotelStatus = tripData?.data?.hotels?.filter(
                (f) => f.id === hotel.id
              );
              return hotelStatus[0].status === "Booked";
            })
            .forEach((hotel) => {
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
                hotel.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName;
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
              hotelString += `
              <tr>
              <td class="main-tr">Hotel: ${hotelName}</td>
              <td class="main-tr">${hotelDates}</td>
              <td class="main-tr">${hotelPrice}</td>
              <td class="main-tr">${margin}</td>
              <td class="main-tr">${GST}</td>
              <td class="main-tr">${hotelTotalPrice}</td>
              </tr>
            `;
            });
        }
        if (tripData.flights.length > 0) {
          tripData.flights
            .filter((flight) => {
              var flightStatus = tripData.data.flights.filter(
                (f) => f.id === flight.id
              );
              return flightStatus[0].status === "Booked";
            })
            .forEach((flight) => {
              var flightDetails =
                flight.data.flightNew.segments[0].destCityName +
                " to " +
                flight.data.flightNew.segments[0].originCityName;
              var totalFare = flight.data.totalFare;
              var finalFare = flight.data.finalPrice;
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
              hotelString += `
            <tr>
              <td class="main-tr">Flight:${flightDetails} </td>
              <td class="main-tr">${flightDates}</td>
              <td class="main-tr">${totalFare}</td>
              <td class="main-tr">${margin}</td>
              <td class="main-tr">${GST}</td>
              <td class="main-tr">${finalFare}</td>
            </tr>
              `;
            });
        }
        if (tripData.cabs.length > 0) {
          tripData.cabs
            .filter((cab) => {
              var cabReq = tripData?.data?.cabs?.filter((hotelMain) => {
                return hotelMain.id === cab.id;
              });
              return cabReq[0].status === "Booked";
            })
            .forEach((cab) => {
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
              hotelString += `
            <tr>
              <td>Cab:${cabDetails} </td>
              <td>${cabDate}</td>
              <td>${totalFare}</td>
              <td>${margin}</td>
              <td>${GST}</td>
              <td>${finalFare}</td>
            </tr>
              `;
            });
        }
        var htmlString = `
        <!DOCTYPE html>
          <html>
          <head>
          <style>
          
          table{
            margin-top:15pt;
          }
          .main-table  .main-tr {
            border: 1px solid black;
            border-collapse:collapse;
          }
          .main-table{
          	border: 1px solid black;
            border-collapse:collapse;
          }
          td{
            color:black;
          }
          .main{
            padding-bottom:10pt;
            border-bottom:1px solid gray;
            }
            .top{
            border:2px solid gray;
            }
            .own-company{
            display:flex;
            justify-content:space-between;
            }
            .left{
            display:flex;
            flex-direction:column;
            }
            .left span{
            font-size:15pt;
            font-weight:bold;
            margin-bottom:10pt;
            }
            p{
            margin:0;
            }
            .right{
            margin:10pt 10pt;
            }
            .right img{
            height:10vw;
            width:20vw;
            }
            .header{
            font-size:25pt;
            text-align:center;
            color:#0f4264;
            }
            
            .user-company{
            margin-top:12pt;
            display:grid;
            grid-template-columns:1fr 1fr 1fr;
            justify-content:space-between;
            }
            
            .user-left span{
            font-size:15pt;
            font-weight:bold;
            margin-bottom:10pt;
            }
            
            .middle span{
            font-size:15pt;
            font-weight:bold;
            margin-bottom:10pt;
            }
            
            .user-right span{
            font-size:15pt;
            font-weight:bold;
            margin-bottom:10pt;
            }
            
          </style>
          </head>
          <body>
          <div class="top"></div>
          <div class="main">
          <table style="width:100%">
          <tr>
          <td class="left">
          <span>QuikProcess Pvt. Ltd.</span>
          <p>Plot No. 41, H.No. 8-3-833/41</p> <p>Phase 1, Kamalapuri Colony</p> <p>Hyderabad-500073</p> <p>PAN: AAACQ4319H</p> <p>GST: 36AAACQ4319H2ZI</p>
          </td>
          <td class="right">
          <img src="https://firebasestorage.googleapis.com/v0/b/trav-biz.appspot.com/o/logo%2Ftripbizz-logo.png?alt=media&token=51978d9b-6e09-4752-9262-a27abf98eb61"/>
          </td>
          </tr>
          </table>
          <div class="header">
          Invoice
          </div>
          <table style="width:100%">
          <tr>
            <td class="user-left">
              <span>Invoice for</span>
              <p>Tripfriday</p> 
              <p>PAN: AAACQ4319H</p>
              <p>GST: 36AAACQ4319H2ZI</p>
            </td>
            <td class="middle">
              <span>Invoice Date</span>
              <p>May 3 2024</p>
            </td>
            <td class="user-right">
              <span>Invoice #</span>
              <p>${finalString}</p>
            </td>
          </tr>
        </table>
          </div>
          <table style="width:100%">
            <tr>
              <th>Item</th>
              <th>Date</th> 
              <th>Cost</th>
              <th>Service Charge</th>
              <th>Gst</th>
              <th>Total Cost</th>
            </tr>
            ${hotelString}
            <tr>
            <td>Total Price</td>
            <td></td> 
              <td></td>
              <td></td>
              <td></td>
              <td>${price}</td>
            </tr>
          </table>
          <div>This is a digitally generated invoice</div>
          </body>
          </html>
        `;
        return htmlString;
      },
      downloadVouchers: async (tripData) => {
        console.log("Loading");
        this.setState({ mergePdfLoading: true });
        var dataUrls = [];
        if (tripData.hotels.length > 0) {
          tripData.hotels
            .filter((hotel) => {
              var hotelStatus = tripData?.data?.hotels?.filter(
                (f) => f.id === hotel.id
              );
              return hotelStatus[0].status === "Booked";
            })
            ?.forEach((hotel) => {
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
              var hotelStatus = tripData?.data?.hotels?.filter(
                (f) => f.id === hotel.id
              );
              var hotelData =
                "Hotel : " +
                hotel.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName;
              dataUrls.push({
                url: hotelStatus[0].downloadURL,
                data: hotelData + "," + hotelDates,
              });
            });
        }
        if (tripData.flights.length > 0) {
          tripData.flights
            .filter((flight) => {
              var flightStatus = tripData.data.flights.filter(
                (f) => f.id === flight.id
              );
              return flightStatus[0].status === "Booked";
            })
            ?.forEach((flight) => {
              var flightDetails =
                flight.data.flightNew.segments[0].destCityName +
                " to " +
                flight.data.flightNew.segments[0].originCityName;
              var flightStatus = tripData.data.flights.filter(
                (f) => f.id === flight.id
              );
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
              dataUrls.push({
                url: flightStatus[0].downloadURL,
                data: flightDetails + "," + flightDates,
              });
            });
        }
        if (tripData.cabs.length > 0) {
          tripData.cabs
            .filter((cab) => {
              var cabReq = tripData?.data?.cabs?.filter((hotelMain) => {
                return hotelMain.id === cab.id;
              });
              return cabReq[0].status === "Booked";
            })
            ?.forEach((cab) => {
              var cabReq = tripData?.data?.cabs?.filter((hotelMain) => {
                return hotelMain.id === cab.id;
              });
              var cabDetails = cab.data.cabCity + "-" + cab.data.cabType;
              var cabDate =
                new Date(cab.data.cabStartDate.seconds * 1000)
                  .toDateString()
                  .slice(4, 10) +
                "," +
                new Date(cab.data.cabStartDate.seconds * 1000)
                  .toDateString()
                  .slice(11, 15);
              dataUrls.push({
                data: cabDetails + "," + cabDate,
                url: cabReq[0].downloadURL,
              });
            });
        }
        if (tripData.bus.length > 0) {
          tripData.bus
            .filter((cab) => {
              var cabReq = tripData?.data?.bus?.filter((hotelMain) => {
                return hotelMain.id === cab.id;
              });
              return cabReq[0].status === "Booked";
            })
            ?.forEach((cab) => {
              var cabReq = tripData?.data?.bus?.filter((hotelMain) => {
                return hotelMain.id === cab.id;
              });
              console.log(cabReq);
              // var cabDetails = cab.data.cabCity + "-" + cab.data.cabType;
              // var cabDate =
              //   new Date(cab.data.cabStartDate.seconds * 1000)
              //     .toDateString()
              //     .slice(4, 10) +
              //   "," +
              //   new Date(cab.data.cabStartDate.seconds * 1000)
              //     .toDateString()
              //     .slice(11, 15);
              dataUrls.push({
                // data: cabDetails + "," + cabDate,
                url: cabReq[0].downloadURL,
              });
            });
        }
        if (dataUrls.length > 0) {
          try {
            const response = await fetch(
              " https://tripbizzapi-lxyskuwaba-uc.a.run.app/merge-pdfs",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ dataUrls: dataUrls }),
              }
            );
            if (!response.ok) {
              this.setState({ mergePdfLoading: false });
              throw new Error("Network response was not ok.");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "report.pdf";
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            this.setState({ mergePdfLoading: false });
          } catch (error) {
            this.setState({ mergePdfLoading: false });
            console.log(error);
          }
        } else {
          this.setState({ mergePdfLoading: false });
        }
      },
      blockHotelRoom: async (bookingBus) => {
        var req = {
          BoardingPointId:
            bookingBus?.busBoardingDetails?.busResult?.GetBusRouteDetailResult
              ?.BoardingPointsDetails[0].CityPointIndex,
          Passenger: [
            {
              LeadPassenger: true,
              PassengerId: 0,
              Title: "Mr.",
              Address: "Hyderabad",
              Age: 12,
              Email: "dev@tripfriday.com",
              FirstName: "Sriharsha",
              Gender: 1,
              IdNumber: null,
              IdType: null,
              LastName: "Thonukunuri",
              Phoneno: "8688112811",
              Seat: bookingBus?.busSeatLayout?.busResult?.GetBusSeatLayOutResult
                ?.SeatLayoutDetails.SeatLayout.SeatDetails[0][0],
            },
            {
              LeadPassenger: false,
              PassengerId: 0,
              Title: "Mr.",
              Address: "Hyderabad",
              Age: 12,
              Email: "dev@tripfriday.com",
              FirstName: "Sriharsha",
              Gender: 1,
              IdNumber: null,
              IdType: null,
              LastName: "Thonukunuri",
              Phoneno: "8688112811",
              Seat: bookingBus?.busSeatLayout?.busResult?.GetBusSeatLayOutResult
                ?.SeatLayoutDetails.SeatLayout.SeatDetails[0][2],
            },
            {
              LeadPassenger: false,
              PassengerId: 0,
              Title: "Mr.",
              Address: "Hyderabad",
              Age: 12,
              Email: "dev@tripfriday.com",
              FirstName: "Sriharsha",
              Gender: 1,
              IdNumber: null,
              IdType: null,
              LastName: "Thonukunuri",
              Phoneno: "8688112811",
              Seat: bookingBus?.busSeatLayout?.busResult?.GetBusSeatLayOutResult
                ?.SeatLayoutDetails.SeatLayout.SeatDetails[0][1],
            },
          ],
          DroppingPointId:
            bookingBus?.busBoardingDetails?.busResult?.GetBusRouteDetailResult
              ?.DroppingPointsDetails[0].CityPointIndex,
          traceId: this.state.busTraceId,
          ResultIndex: bookingBus.bus.ResultIndex,
        };
        var busRes = await fetch(
          "http://127.0.0.1:5001/trav-biz/us-central1/tripbizzApi/busBlock",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));
        console.log(busRes);
      },
      bookRoom: async (bookingBus) => {
        var req = {
          BoardingPointId:
            bookingBus?.busBoardingDetails?.busResult?.GetBusRouteDetailResult
              ?.BoardingPointsDetails[0].CityPointIndex,
          Passenger: [
            {
              LeadPassenger: true,
              PassengerId: 0,
              Title: "Mr.",
              Address: "Hyderabad",
              Age: 12,
              Email: "dev@tripfriday.com",
              FirstName: "Sriharsha",
              Gender: 1,
              IdNumber: null,
              IdType: null,
              LastName: "Thonukunuri",
              Phoneno: "8688112811",
              Seat: bookingBus?.busSeatLayout?.busResult?.GetBusSeatLayOutResult
                ?.SeatLayoutDetails.SeatLayout.SeatDetails[0][0],
            },
            {
              LeadPassenger: false,
              PassengerId: 0,
              Title: "Mr.",
              Address: "Hyderabad",
              Age: 12,
              Email: "dev@tripfriday.com",
              FirstName: "Sriharsha",
              Gender: 1,
              IdNumber: null,
              IdType: null,
              LastName: "Thonukunuri",
              Phoneno: "8688112811",
              Seat: bookingBus?.busSeatLayout?.busResult?.GetBusSeatLayOutResult
                ?.SeatLayoutDetails.SeatLayout.SeatDetails[0][2],
            },
            {
              LeadPassenger: false,
              PassengerId: 0,
              Title: "Mr.",
              Address: "Hyderabad",
              Age: 12,
              Email: "dev@tripfriday.com",
              FirstName: "Sriharsha",
              Gender: 1,
              IdNumber: null,
              IdType: null,
              LastName: "Thonukunuri",
              Phoneno: "8688112811",
              Seat: bookingBus?.busSeatLayout?.busResult?.GetBusSeatLayOutResult
                ?.SeatLayoutDetails.SeatLayout.SeatDetails[0][1],
            },
          ],
          DroppingPointId:
            bookingBus?.busBoardingDetails?.busResult?.GetBusRouteDetailResult
              ?.DroppingPointsDetails[0].CityPointIndex,
          traceId: this.state.busTraceId,
          ResultIndex: bookingBus.bus.ResultIndex,
        };
        var busRes = await fetch(
          "http://127.0.0.1:5001/trav-biz/us-central1/tripbizzApi/busBook",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));
        console.log(busRes);
        return busRes.response;
      },
      getBookDetails: async (busRes) => {
        var req = {
          traceId: this.state.busTraceId,
          BusId: busRes?.busResult?.BookResult?.BusId,
        };
        var busResu = await fetch(
          "https://tripbizzapi-lxyskuwaba-uc.a.run.app/busBookDetails",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));
        console.log(busResu);
      },
      changeAccountType: async (type, value, userid) => {
        var userDocRef = db.collection("Accounts").doc(userid);
        if (type === "payment") {
          await updateDoc(userDocRef, {
            accountType: value,
          });
        }
        if (type === "approval") {
          await updateDoc(userDocRef, {
            approvalType: value,
          });
        }
      },
      changeBusPassengers: (value) => {
        console.log(value);
        this.setState({ NoofBusPassengers: value });
      },
      addInvoices: async (
        userId,
        tripId,
        id,
        price,
        type,
        details,
        gst,
        serviceCharge,
        cost,
        bookingId,
        bookingDate,
        link,
        finalTotalPrice
      ) => {
        // const usersCollection = db.collection("Accounts");
        // try {
        //   await db.runTransaction(async (transaction) => {
        //     const userDocRef = usersCollection.doc(userId);
        //     const userDocSnapshot = await transaction.get(userDocRef);
        //     if (!userDocSnapshot.exists) {
        //       throw new Error("User does not exist!");
        //     }
        //     const userData = userDocSnapshot.data();
        //     const currentInvoiceCount = userData.invoiceCount || 0;
        //     const invoiceDocRef = userDocRef.collection("invoices").doc(tripId);
        //     const invoiceDocSnapshot = await transaction.get(invoiceDocRef);
        //     if (invoiceDocSnapshot.exists) {
        //       const data = invoiceDocSnapshot.data();
        //       const currentDetails = data.invoiceDetails || [];
        //       const updatedDetails = [
        //         ...currentDetails,
        //         {
        //           cardId: id,
        //           bookedAt: new Date(),
        //           invoiceId: currentInvoiceCount + 1,
        //         },
        //       ];
        //       transaction.update(invoiceDocRef, {
        //         invoiceDetails: updatedDetails,
        //       });
        //     } else {
        //       await transaction.set(invoiceDocRef, {
        //         invoiceDetails: [
        //           {
        //             cardId: id,
        //             bookedAt: new Date(),
        //             invoiceId: currentInvoiceCount + 1,
        //           },
        //         ],
        //       });
        //     }
        //     transaction.update(userDocRef, {
        //       invoiceCount: currentInvoiceCount + 1,
        //     });
        //     const querySnapshot = await db
        //       .collection("companies")
        //       .where("companyName", "==", userData.billingAccount)
        //       .get();
        //     if (!querySnapshot.empty) {
        //       const docId = querySnapshot.docs[0].id;
        //       const invoiceData = {
        //         companyId: docId,
        //         cardId: id,
        //         bookedAt: new Date(),
        //         invoiceStatus: "Not Sent",
        //         sentDate: null,
        //         receiptStatus: "Pending",
        //         receivedDate: null,
        //         userName: userData.firstName,
        //         invoiceNo: userData.InvoiceId,
        //         userId: userData.userid,
        //         price: price,
        //         paid: null,
        //         pending: null,
        //         type: type,
        //         details: details,
        //         tripId: tripId,
        //         invoiceCount: currentInvoiceCount + 1,
        //         email: userData.email,
        //         gst: gst,
        //         serviceCharge: serviceCharge,
        //         cost: cost,
        //       };
        //       await db.collection("billingAccountInvoices").add(invoiceData);
        //     }
        //   });

        //   console.log("Service added to invoice details successfully!");
        // } catch (error) {
        //   console.error("Error adding service: ", error);
        // }
        try {
          const usersCollection = db.collection("Accounts");
          const userDocRef = await usersCollection.doc(userId).get();
          const userData = userDocRef.data();
          const companyRef = await db
            .collection("companies")
            .doc(userData.billingAccount);
          const previous = (await companyRef.get()).data().InvoiceCount;
          const updatedCount = previous + 1;
          await companyRef.update({
            InvoiceCount: updatedCount,
          });
          const invoiceData = {
            companyId: userData.billingAccount,
            cardId: tripId,
            bookedAt: new Date(),
            invoiceStatus: "Not Sent",
            sentDate: null,
            receiptStatus: "Pending",
            receivedDate: null,
            userName: userData.firstName,
            userId: userData.userid,
            price: price,
            paid: null,
            pending: null,
            type: type,
            details: details,
            tripId: tripId,
            email: userData.email,
            gst: gst,
            serviceCharge: serviceCharge,
            cost: cost,
            BillingInvoiceId: updatedCount,
            bookingId: bookingId,
            bookingDate: bookingDate,
            fileUrl: link,
            finalTotalPrice: finalTotalPrice,
          };
          await companyRef.collection("Invoices").add(invoiceData);
        } catch (error) {
          console.error("Error adding service: ", error);
        }
      },

      getInvoiceDetails: async (userId, tripId) => {
        const usersCollection = db.collection("Accounts");
        try {
          const invoiceDocRef = usersCollection
            .doc(userId)
            .collection("invoices")
            .doc(tripId);
          const docSnapshot = await invoiceDocRef.get();

          if (docSnapshot.exists) {
            const data = docSnapshot.data();
            const invoiceDetails = data.invoiceDetails || [];

            console.log("Invoice details:", invoiceDetails);
            return invoiceDetails;
          } else {
            console.log("No invoice found for this user and trip.");
            return [];
          }
        } catch (error) {
          console.error("Error retrieving invoice details:", error);
          return null;
        }
      },
      blockRoomFromAdmin: async (data) => {
        const responce = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/blockRoom",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resData = await responce.json();
        console.log(resData);
        return resData;
      },
      bookRoomFromAdmin: async (data) => {
        const responce = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/bookRoom",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resData = await responce.json();
        console.log(resData);
        return resData;
      },
      generateVoucherFromAdmin: async (data) => {
        const responce = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/generateVoucher",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resData = await responce.json();
        console.log(resData);
        return resData;
      },
      generatePdfFromAdmin: async (data) => {
        const responce = await fetch(
          "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelGetBookingDetail",
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resData = await responce.json();
        console.log(resData);
        return resData;
      },
    },
  };

  componentDidMount = async () => {
    this.setState({
      userLoginStatus: {
        loggedIn: false,
        isLoading: true,
        status: "Authenticating",
        role: "user",
      },
    });
    auth.onAuthStateChanged(async (userCredentials) => {
      if (userCredentials) {
        await this.state.actions.getUserById(userCredentials?.uid);
        this.setState({
          loginSessionExpired: false,
        });
        this.setState({
          userId: userCredentials?.uid,
        });

        await this.state.actions.getAirportCityList();
        await this.state.actions.getHotelCityList();
        await this.state.actions.getCabCities();
        await this.state.actions.setAdminData();
        await this.state.actions.getLastDoc();
        await this.state.actions.getMainHotelCityList();
      } else {
        this.setState({
          user: "",
          userLoginStatus: {
            loggedIn: false,
            isLoading: false,
            status: "Not loggedIn",
          },
        });
      }
    });
  };
  debounce = (cb, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };

  changeCityKeyword = this.debounce((query) => {
    var results = this.state.hotelFuse.search(query);
    if (results.length > 0) {
      this.setState({
        cityHotelRes: results,
      });
    } else {
      this.cityKeywordReq(query);
    }
  }, 1000);

  cityKeywordReq = async (query) => {
    var fuse = await this.state.actions.getMainHotelCityList();
    var res = fuse.search(query);
    this.setState({
      cityHotelRes: res,
    });
  };

  changeCabCityKeyword = this.debounce((query) => {
    var results = this.state.cabFuse.search(query);
    console.log("Search results", results);
    this.setState({
      cabSearchRes: results,
    });
  }, 1000);

  changeOriginAirportKeyword = this.debounce(async (keyword) => {
    if (keyword !== "") {
      try {
        var results = this.state.airportFuse.search(keyword);

        if (results.length > 0) {
          var data = results.map((res, r) => {
            var item = res.item;
            return {
              name: item.name,
              iataCode: item.iataCode,
              address: {
                cityName: item.cityName,
                countryName: item.countryName,
              },
            };
          });

          this.setState({
            airportOriginData: data,
            airportOriginLoading: false,
          });
        } else {
          var data = await this.airportKeywordReq(keyword, "Origin");
          console.log(data);
          this.setState({
            airportOriginData: data?.data?.data,
            airportOriginLoading: false,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      if (abortAirportController) {
        abortAirportController.abort();
      }
      this.setState({
        airportOriginData: [],
        airportOriginLoading: false,
      });
    }
  }, 500);

  changeDestAirportKeyword = this.debounce(async (keyword) => {
    if (keyword !== "") {
      try {
        var results = this.state.airportFuse.search(keyword);

        if (results.length > 0) {
          var data = results.map((res, r) => {
            var item = res.item;
            return {
              name: item.name,
              iataCode: item.iataCode,
              address: {
                cityName: item.cityName,
                countryName: item.countryName,
              },
            };
          });

          this.setState({
            airportDestData: data,
            airportDestLoading: false,
          });
        } else {
          var data = await this.airportKeywordReq(keyword, "Dest");

          this.setState({
            airportDestData: data?.data?.data,
            airportDestLoading: false,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      if (abortAirportController) {
        abortAirportController.abort();
      }
      this.setState({
        airportDestData: [],
        airportDestLoading: false,
      });
    }
  }, 500);

  changeOriginBusKeyword = this.debounce(async (keyword) => {
    if (keyword !== "") {
      try {
        var results = [];
        //var results = this.state.busFuse.search(keyword);
        if (results.length > 0) {
          var data = results.map((res, r) => {
            var item = res.item;
            return {
              cityName: item.CityName,
              id: item.CityId,
            };
          });
          this.setState({
            busOriginData: data,
            busOriginLoading: false,
          });
        } else {
          var data = await this.busKeywordReq(keyword);
          var fuse = new Fuse(data.data.BusCities, {
            keys: ["CityName"],
            includeScore: true,
            threshold: 0.2,
          });
          var res = fuse.search(keyword);
          var resData = res.map((res, r) => {
            var item = res.item;
            return {
              cityName: item.CityName,
              id: item.CityId,
            };
          });
          this.setState({
            busOriginData: resData,
            busOriginLoading: false,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({
        airportOriginData: [],
        airportOriginLoading: false,
      });
    }
  }, 500);

  changeDestBusKeyword = this.debounce(async (keyword) => {
    if (keyword !== "") {
      try {
        var results = [];
        //var results = this.state?.busFuse?.search(keyword);
        if (results?.length > 0) {
          var data = results.map((res, r) => {
            var item = res.item;
            return {
              cityName: item.CityName,
              id: item.CityId,
            };
          });
          this.setState({
            busDestData: data,
            busDestLoading: false,
          });
        } else {
          var data = await this.busKeywordReq(keyword);

          var fuse = new Fuse(data.data.BusCities, {
            keys: ["CityName"],
            includeScore: true,
            threshold: 0.2,
          });
          var res = fuse.search(keyword);
          var resData = res.map((res, r) => {
            var item = res.item;
            return {
              cityName: item.CityName,
              id: item.CityId,
            };
          });
          this.setState({
            busDestData: resData,
            busDestLoading: false,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({
        airportOriginData: [],
        airportOriginLoading: false,
      });
    }
  }, 500);

  airportKeywordReq = (keyword, type) => {
    if (abortAirportController) {
      abortAirportController.abort();
    }
    abortAirportController = new AbortController();
    console.log(`Req for ${type}`, keyword);
    return axios.post(
      "https://us-central1-tripfriday-2b399.cloudfunctions.net/paymentApi/airportSearch",
      { keyword, subType: "CITY,AIRPORT", page: 0 },
      { signal: abortAirportController.signal }
    );
  };

  busKeywordReq = (keyword) => {
    try {
      return axios.post(
        "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/getBusCityList"
      );
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <MyContext.Provider
            value={{
              ...this.state,
            }}
          >
            {this.props.children}
          </MyContext.Provider>
        </div>
      </React.Fragment>
    );
  }
}

export default MyProvider;
