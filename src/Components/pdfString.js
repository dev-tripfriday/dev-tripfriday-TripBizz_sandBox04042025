import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Font,
  Image,
} from "@react-pdf/renderer";
import { useContext } from "react";
import MyContext from "./Context";
import { RiGlobalFill } from "react-icons/ri";

// export const createString = async (tripData, actions, userAccountDetails) => {
// var statuses = [
//   { status: "Paid and Submitted", color: "#ffa500" },
//   { status: "Need clarification", color: "#FFC107" },
//   { status: "Price Revision", color: "#2196F3" },
//   { status: "Booked", color: "#4CAF50" },
//   { status: "Cancelled", color: "#FF0000" },
//   { status: "Submitted,Payment Pending", color: "#ffa500" },
//   { status: "Booked,Payment Pending", color: "#4CAF50" },
//   { status: "Not Submitted", color: "#808080" },
// ];
// var reqStatuses = [
//   { status: "Approved", color: "#008000" },
//   { status: "Pending", color: "#ffa500" },
//   { status: "Not Requested", color: "#808080" },
// ];
//   var profileDetails = `
//   <div class="flight-header">Profile Details</div>
//   <div class='role-traveller-box'>
//                 <div>First Name:<span>${userAccountDetails.firstName}</span> </div>
//                 <div>Last Name:<span>${userAccountDetails.lastName}</span> </div>
//                 <div>Email:<span>${userAccountDetails.email}</span> </div>
//                 <div>Mobile Number:<span>${userAccountDetails.mobileNumber}</span> </div>
//                 <div>Company Name:<span>${userAccountDetails.companyName}</span> </div>
//                 <div>Company GST Number:<span>${userAccountDetails.GSTNO}</span> </div>
//                 <div>Company PAN Number:<span>${userAccountDetails.PANNO}</span> </div>
//             </div>
//   `;
//   var newdate = new Date(tripData?.data?.date?.seconds * 1000).toLocaleString(
//     "en-US"
//   );
//   var flightString = "";
//   var hotelString = "";
//   var cabString = "";
//   var headingString = `
//                <div class='tripDetails-header'>
//                 <div class='tripDetails-header-name'>
//                     <span class='trip-name'>${tripData.data?.name}</span>
//                     <span>created on: <span>${newdate}</span></span>
//                 </div>
//                 </div>
//   `;
//   var cssString = `
//   .request-status {
//     font-size: 10pt;
//     display: flex;
//     font-weight: bold;
//   }
//   .request-status span {
//     font-size: 8pt;
//     padding: 3pt 5pt;
//     font-weight: bold;
//     color: white;
//     border-radius: 0.8rem;
//     text-align: center;
//   }
//   .cab-container .timestamp {
//     padding: 3pt 10pt;
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-start;
//     flex-direction:row;
//     font-size: 10pt;
//     gap: 10pt;
//   }
//   .cab-container .timestamp .cab-header-price {
//     margin-right: 10px;
//     font-size: 12pt;
//     font-weight: bold;
//     color: #BB3E03;
//     display: flex;
//     justify-content: flex-end;
//     align-items: center;
//   }
//   .cab-container .timestamp .cab-header-price .cab-header-price-icon {
//     margin-right: 5px;
//     font-size: 10pt;
//   }
//   .cab-container{
//     box-shadow: 0.04rem 0.06rem 0.4rem rgba(0, 0, 0, 0.171);;
//             border-radius: 0.8rem;
//             padding: 10px 0px 10px 10px;
//             margin: 10pt 0;
//   }
//   .cab-container .cab-card {
//     display: flex;
//     gap: 10pt;
//     margin: 10pt 0;
//   }
//   .cab-container .cab-card .cab-img img {
//     width: 15vw;
//     height: 15vw;
//   }
//   .cab-container .cab-card .cab-card-details {
//     width: 100%;
//   }
//   .cab-container .cab-card .cab-card-details .cab-header {
//     display: flex;
//     justify-content: space-between;
//   }
//   .cab-container .cab-card .cab-card-details .cab-header .cab-header-name {
//     display: flex;
//   }
//   .cab-container .cab-card .cab-card-details .cab-header .cab-header-name span {
//     font-weight: bold;
//     font-size: 12pt;
//     margin-right: 5px;
//   }
//   .cab-container .cab-card .cab-card-details .cab-header .cab-header-date {
//     font-size: 10pt;
//     display: flex;
//     justify-content: flex-start;
//     align-items: center;
//     background-color: #94d2bd;
//     border-radius: 0.8rem 0rem 0rem 0.8rem;
//     padding: 5pt;
//   }
//   .cab-container .cab-card .cab-card-details .cab-body {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     margin-top: 10pt;
//   }
//   .cab-container .cab-card .cab-card-details .cab-body .cab-header-price {
//     margin-right: 10px;
//     font-size: 12pt;
//     font-weight: bold;
//     color: #BB3E03;
//     display: flex;
//     justify-content: flex-end;
//     align-items: center;
//     flex-direction: column;
//   }
//   .cab-container .cab-card .cab-card-details .cab-body .cab-header-price .cab-header-price-icon {
//     margin-right: 5px;
//     font-size: 10pt;
//   }
//   .cab-container .cab-card .cab-card-details .cab-body .cab-header-price .cab-header-price-icon-add {
//     font-size: 6pt;
//     margin-right: 5px;
//   }
//   .cab-container .cab-card .cab-card-details .cab-body span {
//     font-size: 12pt;
//   }
//   .cab-container .cab-card .cab-card-details .cab-body .cab-header-service {
//     font-size: 8pt;
//   }
//   .cab-container .cab-card .cab-card-details .cab-body button {
//     padding: 5pt 10pt;
//     background-color: #001219;
//     border-radius: 0.8rem;
//     color: #fff;
//     border: none;
//   }
//   .role-traveller-block{
//     border-radius: 8px;

//   }
//   .role-traveller-header {
//     font-size: 10pt;
//     font-weight: bold;
//   }
//   .tripDetails-header {
//     display: flex;
//     margin: 10px 20px;
//     flex-direction: column;
//   }
//   .tripDetails-header .tripDetails-download-report button {
//     background-color: #001219;
//     border: none;
//     border-radius: 0.8rem;
//     color: white;
//     font-weight: bold;
//     font-size: 10pt;
//     padding: 4px 15px;
//   }
//   .tripDetails-header .tripDetails-header-name {
//     display: flex;
//     flex-direction: column;
//     justify-content: flex-start;
//   }
//   .tripDetails-header .tripDetails-header-name span {
//     font-size: 10.5pt;
//     font-weight: bolder;
//   }
//   .tripDetails-header .tripDetails-header-name span span {
//     color: #94D2BD;
//   }
//   .tripDetails-header .tripDetails-header-name .trip-name {
//     font-size: 20pt;
//     font-weight: 900;
//   }
//   .tripDetails-header .tripDetails-header-date {
//     padding: 10px;
//     border-radius: 0.8rem;
//     background-color: #001219;
//     color: #f5f5f5;
//     width: 55%;
//   }
//   .role-traveller-box {
//     display:grid;
//     grid-template-columns:1fr 1fr;
//     gap: 2.5pt;
//     overflow: overlay;
//   }

//   .role-traveller-box div {
//     display: flex;
//     text-align: left;
//     font-size: 10pt;
//   }
//   .role-traveller-box div span {
//     font-weight: bold;
//     margin-left: 2pt;
//   }
//     .flight-header{
//       font-size:15pt;
//       margin:10pt 0;
//     }
//     .flight-main{
//         box-shadow: 0.04rem 0.06rem 0.4rem rgba(0, 0, 0, 0.171);;
//             border-radius: 0.8rem;
//             padding: 10px 0px 10px 10px;
//             margin: 10pt 0;
//         }
//  .flightResults-list-flightCard-segment-block {
//   margin-bottom: 15px;
//   padding: 0 0 0 15px;
// }

// .flightResults-list-flightCard-segment-block.flightResults-list-flightCard-segment-seperate
//   .flightResults-list-flightCard-segment-section {
//   border-radius: 0.8rem;
//   margin-bottom: 15px;
//   background-color: rgb(245, 245, 245);
// }
// .flightResults-list-flightCard-segment-block.flightResults-list-flightCard-segment-seperate
//   .flightResults-list-flightCard-segment-section.flightResults-list-flightCard-segment-section-selected {
//   border: 2px solid $highlight;
//   background-color: $highlightLite;
// }
// .flightResults-list-flightCard-airline-block {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 6px;
// }
// .flightResults-list-flightCard-airline {
//   font-size: 12pt;
//   font-weight: bold;
//   color: $primary;
//   display: flex;
//   // flex-direction: column;
//   justify-content: flex-start;
//   align-items: center;
//   span {
//     font-size: 8pt;
//     color: rgb(121, 121, 121);
//     // line-height: 16px;
//   }
// }
// .flightResults-list-flightCard-logo {
//   margin: 10px 10px 10px 0px;
// }
// .flightResults-list-flightCard-logo span {
//   height: 25px;
//   width: 25px;
//   display: block;
//   background-position: 50%;
//   background-size: contain;
//   background-repeat: no-repeat;
// }
// .flightResults-list-flightCard-logo span .flightResults-list-flightCard-logo-icon {
//   height: 22px;
// }
// .flightResults-list-flightCard-depDate-block {
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   background-color: #94D2BD;
//   border-radius: 0.8rem 0rem 0rem 0.8rem;
//   padding: 5pt;
// }
// .flightResults-list-flightCard-depDate {
//   font-size: 10pt;
//   font-weight: bold;
//   color: #001219;
// }
// .flightResults-list-flightCard-segment-section {
//   padding-right: 15px;
// }
// .flightResults-list-flightCard-depTime {
//   font-size: 18pt;
//   font-weight: bold;
// }

// .flightResults-list-flightCard-arr-section {
//   display: flex;
//   justify-content: flex-end;
//   align-items: flex-start;
// }

// .flightResults-list-flightCard-depTime-afterDays {
//   font-size: 6pt;
//   font-weight: bold;
//   margin-left: 6px;
//   color: red;
// }
// .flightResults-list-flightCard-depTime-afterDays .flightResults-list-flightCard-depTime-afterDays-num {
//   font-size: 9pt;
// }

// .flightResults-list-flightCard-depCity {
//   font-size: 13pt;
//   font-weight: bold;
//   color: rgb(111, 111, 111);
// }
// .flightResults-list-flightCard-arrDep {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// }
// .flightResults-list-flightCard-duration-time {
//   display: flex;
//   justify-content: center;
//   align-items: flex-start;
//   padding-top: 2px;
//   font-size: 12pt;
//   font-weight: bold;
//   color: #001219;
// }
// .flightResults-list-flightCard-duration {
//   height: 60px;
//   width: 55%;
// }

// .flightResults-list-flightCard-duration-time,
// .flightResult-list-flightCard-duration-stopPts {
//   height: 30px;
// }
// .flightResults-list-flightCard-duration-time,
// .flightResult-list-flightCard-duration-stopPts {
//   height: 30px;
// }

// .flightResult-list-flightCard-duration-stopPts {
//   display: flex;
//   justify-content: center;
//   align-items: flex-end;
//   padding-bottom: 5px;
//   border-bottom: 1px dashed rgb(150, 150, 150);
//   font-size: 8pt;
//   font-weight: bold;
//   color: rgb(160, 160, 160);
// }
// .flightResult-list-flightCard-duration-stopPts .flightResult-list-flightCard-duration-stopType {
//   font-size: 10pt;
//   color: rgb(80, 80, 80);
//   margin-right: 3px;
//   color: #94D2BD;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
// }
// .flightResult-list-flightCard-duration-stopPts .flightResult-list-flightCard-duration-stopType .flightResult-list-flightCard-duration-stopType-icon {
//   margin-left: 5px;
//   color: rgb(80, 80, 80);
//   font-size: 9pt;
// }
// .flightResult-list-flightCard-duration-stopPts .flightResult-list-flightCard-duration-stopPt {
//   margin-right: 3px;
// }
// .flightResults-list-flightCard-arr-section {
//   display: flex;
//   justify-content: flex-end;
//   align-items: flex-start;
// }

// .flightResults-list-flightCard-dep.flightResults-list-flightCard-arr {
//   text-align: right;
// }

// .flightResults-list-flightCard-airportNames {
//   font-size: 9pt;
//   font-weight: bold;
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   -moz-column-gap: 90px;
//        column-gap: 90px;
//   margin-top: 10px;
//   color: rgb(150, 150, 150);
// }
// .flightResults-list-flightCard-airportNames .flightResults-list-flightCard-cityName {
//   font-size: 11pt;
//   font-weight: bold;
//   margin-bottom: 2px;
//   color: rgb(80, 80, 80);
// }
// .flightResults-list-flightCard-airportNames .flightResults-list-flightCard-airportName-dest {
//   text-align: right;
// }

// .flightResults-list-flightCard-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 15px;
//   padding: 0 15px;
// }
// .flightResults-list-flightCard-fareList .flightResults-list-flightCard-header {
//   padding: 0;
// }

// .flightResults-list-flightCard-fare {
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   width: 50%;
// }
// .flightResults-list-flightCard-fareList-fareBox {
//   padding: 5px 10px;
//   border: 1px solid rgb(80, 80, 80);
//   border-radius: 0.8rem;
//   margin-bottom: 10px;
//   margin-right: 5px;
//   cursor: pointer;
// }

// .flightResults-list-flightCard-fareList-fareBox.flightResults-list-flightCard-fareList-fareBox-selected {
//   border: 2px solid green;
//   color: green;
//   font-weight: bold;
// }

// .flightResults-list-flightCard-fareList {
//   padding: 30px 8px 0 8px;
// }
// .flightResults-list-flightCard-fareList .flightResults-list-flightCard-header {
//   padding: 0;
// }
// .flightResults-list-flightCard-fareType {
//   font-size: 10pt;
//   margin-bottom: 5px;
//   color: #108bbc;
//   font-weight: bold;
// }
// .flightResults-list-flightCard-price {
//   margin-right: 10px;
//   font-size: 14pt;
//   font-weight: bold;
//   color: #BB3E03;
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
// }
// .flightResults-list-flightCard-price .flightResults-list-flightCard-price-icon {
//   margin-right: 5px;
// }
// .flightResults-list-flightCard-fTypeBadge {
//   padding: 3px 10px;
//   font-size: 10pt;
//   font-weight: bold;
//   border-radius: 0.8rem;
// }
// .flightResults-list-flightCard-travellers {
//   font-size: 12pt;
//   font-weight: bold;
//   color: rgb(80, 80, 80);
// }

// .flightResults-list-flightCard-cabinClass {
//   font-size: 12pt;
//   font-weight: bold;
//   color: rgb(80, 80, 80);
// }
// .timestamp {
//   padding: 3pt 10pt;
//   display: flex;
//   justify-content: space-between;
//   font-size: 10pt;
//   gap: 10pt;
// }
// .timestamp span {
//   font-weight: bold;
// }
// .timestamp .request-status {
//   margin: auto 2pt;
//   font-size: 8pt;
// }
// .timestamp .request-status span {
//   font-size: 8pt;
//   padding: 5pt 8pt;
//   font-weight: bold;
//   color: white;
//   border-radius: 0.8rem;
// }
// .timestamp .delete-icon {
//   font-weight: bold;
//   color: #ff0000;
//   cursor: pointer;
// }
// .flightResults-tripsPage {
//   display: flex;
//   align-items: flex-start;
//   justify-content: flex-start;
//   margin: 5pt 10pt;
//   gap: 8pt;
// }
// .flightResults-tripsPage .request-status {
//   font-size: 10pt;
// }
// .flightResults-tripsPage .request-status span {
//   font-size: 8pt;
//   padding: 3pt 5pt;
//   font-weight: bold;
//   color: white;
//   border-radius: 0.8rem;
// }
// .flightResults-tripsPage .flight-main-status {
//   display: flex;
//   align-items: center;
//   justify-self: center;
//   gap: 15pt;
// }
// .flightResults-tripsPage .flightStatus {
//   font-size: 10pt;
// }
// .flightResults-tripsPage .flightStatus span {
//   padding: 3pt 5pt;
//   color: white;
//   border-radius: 0.8rem;
//   font-size: 8pt;
// }
// .flightResults-list-flightCard-price-trips {
//   font-size: 14pt;
//   font-weight: bold;
//   color: #BB3E03;
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
// }
// .flightResults-list-flightCard-price-trips .flightResults-list-flightCard-price-icon {
//   margin-right: 5px;
// }

// .hotel-main{
// box-shadow: 0.04rem 0.06rem 0.4rem rgba(0, 0, 0, 0.171);;
//     border-radius: 0.8rem;
//     padding: 10px 0px 10px 10px;
//     margin: 10pt 0;
// }
//   .hotel-card {
//     display: flex;
//     justify-content: flex-start;
//     align-items: center;
//     margin-bottom: 15px;
//     border-radius: 0.8rem;
//     padding: 10px 0px 10px 10px;
//   }
//   .hotel-card-img {
//     width: 10vw;
//     height: 10vw;
//     border-radius: 0.4rem;
//     overflow: hidden;
//     margin-right: 10px;
//   }
//   .hotel-card-img img {
//     object-fit: cover;
//     width: 100%;
//     height: 100%;
//   }
//   .hotel-card-details {
//     width: 80%;
//   }
//   .hotel-card-header {
//     display: flex;
//     justify-content: space-between;
//     flex-direction: row;
//   }
//   .hotel-card-name {
//     font-size: 12pt;
//     font-weight: bold;
//     margin-bottom: 8px;
//   }
//   .hotelInfo-details-date {
//     font-size: 10pt;
//     display: flex;
//     justify-content: flex-start;
//     align-items: center;
//     background-color: #94d2bd;
//     border-radius: 0.8rem 0rem 0rem 0.8rem;
//     padding: 5pt;
//   }
//   .hotel-card-rating {
//     font-size: 12pt;
//     font-weight: bold;
//     margin-bottom: 5px;
//   }
//   .hotel-card-rating-icon {
//     margin-right: 2px;
//     color: gold;
//   }
//   .hotel-card-people {
//     margin: 10px;
//   }
//   .hotel-card-people span {
//     font-weight: bold;
//   }
//   .hotelInfo-roomDtls-room {
//     margin: 10px;
//   }
//   .hotelInfo-roomDtls-room {
//       background-color: whitesmoke;
//       padding: 10px;
//       border-radius: 0.8rem;
//       margin-bottom: 10px;
//       }
//   .hotelInfo-roomDtls-room-titleSection {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//   }
//   .hotelInfo-roomDtls-room-type {
//     font-weight: bold;
//   }
//   .hotelInfo-roomDtls-room-price {
//     font-weight: bold;
//   }
//   .hotelInfo-roomDtls-room-otherSection {
//     display: flex;
//     justify-content: space-between;
//   }
//   .hotelInfo-roomDtls-room-meals,
//   .hotelInfo-roomDtls-room-cancel {
//     font-weight: bold;
//   }
//   .hotel-card-status {
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
//     margin: 5pt 10pt;
//     flex-direction: row;
//     align-items: center;
//     }
// }
// .request-status {
//     font-size: 10pt;
// }
// .timestamp {
//     padding: 3pt 10pt;
//     display: flex;
//     justify-content: space-between;
//     font-size: 10pt;
//     }

//     .timestamp span {
//         font-weight: bold;
//     }

//     .timestamp .delete-icon {
//         font-weight: bold;
//         color: #ff0000;
//         cursor: pointer;
//     }

//     .request-status span {
//         font-size: 8pt;
//         padding: 3pt 5pt;
//         font-weight: bold;
//         color: #ffff;
//         border-radius: 0.8rem;
//     }
//   .hotelType {
//     gap: 15pt;
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
//     }
//   .hotelStatus {
//     font-size: 10pt;
//     span {
//       padding: 3pt 5pt;
//       font-weight: bold;
//       color: #ffff;
//       border-radius: 0.8rem;
//       font-size: 8pt;
//     }

// `;

//   if (tripData.hotels.length > 0) {
//     hotelString += `
//     <div class="flight-header">Hotels</div>`;
//     tripData.hotels.forEach((hotel) => {
// const monthNames = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];
//       var hotelStatus = tripData?.data?.hotels?.filter(
//         (f) => f.id === hotel.id
//       );
//       var hotelReq = tripData.data.hotels.filter((hotelMain) => {
//         return hotelMain.id === hotel.id;
//       });
// var hotelData = tripData?.data?.hotels.filter(
//   (hotels) => hotels.id === hotel.id
// );
// var hotelTimeStamp = new Date(hotelData[0]?.date?.seconds * 1000);
// const startdate = new Date(
//   hotel?.data?.hotelSearchQuery?.checkInDate.seconds * 1000
// );
//       const formattedDate1 = `${
//         monthNames[startdate.getMonth()]
//       } ${startdate.getDate()}`;
//       var endDate = new Date(
//         hotel?.data?.hotelSearchQuery?.checkOutDate.seconds * 1000
//       ).toLocaleString();
//       var img = hotel?.data?.hotelInfo?.HotelInfoResult?.HotelDetails
//         ? hotel?.data?.hotelInfo?.HotelInfoResult?.HotelDetails.Images[0]
//         : "";
//       var rating = [];
//       var starRating =
//         hotel.data.hotelInfo.HotelInfoResult.HotelDetails.StarRating;
//       var starRatingFull = Math.floor(starRating);
//       var adults = hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
//         (acc, obj) => {
//           acc.adults += parseInt(obj.adults, 10);
//           acc.child += parseInt(obj.child, 10);
//           return acc;
//         },
//         { adults: 0, child: 0 }
//       );
//       var ratingIcons = rating
//         .map((icon) => `<i class="fas fa-star hotel-card-rating-icon"></i>`)
//         .join("");
//       var priceIcon = `<i class="fas fa-rupee-sign flightResults-list-flightCard-price-icon  hotelInfo-roomDtls-room-price-icon"></i>`;
//       var mealsIcon = `<i class="fas fa-utensils hotelInfo-roomDtls-room-meals-icon"></i>`;
//       var banIcon = `<i class="fas fa-ban hotelInfo-roomDtls-room-cancel-icon"></i>`;
//       for (var i = 1; i <= Math.ceil(starRating); i++) {
//         if (i <= starRatingFull) {
//           rating.push(ratingIcons);
//         } else if (i - starRatingFull === 0.5) {
//           rating.push(ratingIcons);
//         } else {
//           rating.push(ratingIcons);
//         }
//       }
// var reqColor = reqStatuses.filter((status) => {
//   return status?.status === hotelReq[0]?.requestStatus;
// });
// var color = statuses.filter((status) => {
//   return status?.status === hotelStatus[0]?.status;
// });
// var approveColor = reqColor[0] ? reqColor[0].color : "#808080";
// var bgColor = color[0] ? color[0].color : "#808080";
//       const selectedRoomDetails = hotel?.data?.selectedRoomType;
//       const selectedRoomHTML = selectedRoomDetails
//         ? selectedRoomDetails
//             .map((room, f) => {
//               return `

//                 <div class="hotelInfo-roomDtls-room">
//                     <div class="hotelInfo-roomDtls-room-titleSection">
//                         <div class="hotelInfo-roomDtls-room-type">${
//                           room.RoomTypeName
//                         }</div>
//                         <div class="hotelInfo-roomDtls-room-price">
//                             ${priceIcon}
//                             ${
//                               room.Price.OfferedPriceRoundedOff
//                                 ? room.Price.OfferedPriceRoundedOff.toLocaleString(
//                                     "en-IN"
//                                   )
//                                 : room.Price.PublishedPriceRoundedOff.toLocaleString(
//                                     "en-IN"
//                                   )
//                             }
//                         </div>
//                     </div>
//                     <div class="hotelInfo-roomDtls-room-otherSection">
//                         <div class="hotelInfo-roomDtls-room-meals">
//                            ${mealsIcon}
//                             "No meals"
//                         </div>
//                         <div class="hotelInfo-roomDtls-room-cancel">
//                             ${banIcon}
//                             "Non-refundable"
//                         </div>
//                     </div>
//                 </div>
//             `;
//             })
//             .join("")
//         : "";
//       var travDetails = "";
//       if (tripData.data.travellerDetails) {
//         if (tripData.data.travellerDetails[hotel.id]) {
//           tripData.data.travellerDetails[hotel.id].forEach((trav, i) => {
//             travDetails += `
//             <div class="role-traveller-block">
//             <div class='role-traveller-header'>
//             Traveller ${i + 1}
//               </div>
//             <div class='role-traveller-box'>
//                   <div>First Name:<span>${trav.firstName}</span> </div>
//                   <div>Last Name:<span>${trav.lastName}</span> </div>
//               </div>
//               </div>
//             `;
//           });
//         }
//       }

//       hotelString += `
//             <div class="hotel-main">
//             <div class="hotel-card">
//             <div class="hotel-card-img">
//                 <img src=${img} alt='hotel' />
//             </div>
//             <div class="hotel-card-details">
//                 <div class='hotel-card-header'>
//                     <div class="hotel-card-name">${
//                       hotel.data.hotelInfo.HotelInfoResult.HotelDetails
//                         .HotelName
//                     }</div>
//                     <div class="hotelInfo-details-date">
//                         <span>${formattedDate1}-${endDate}</span>&nbsp;(${
//         hotel.data.hotelSearchQuery.hotelNights
//       } Nights)
//                     </div>
//                 </div>
//                 <div class="hotel-card-details-row">
//                     <div class="hotel-card-rating">
//                     ${rating.join("")}
//                     </div>
//                 </div>
//                 <div class="hotel-card-people">
//                     Adults-${adults?.adults} Children-${adults?.child}
//                 </div>
//             </div>
//         </div>
//         ${selectedRoomHTML}
//         <div class="timestamp">

//                      <div>
//                          Added Date:&nbsp;<span>${hotelTimeStamp
//                            .toString()
//                            .slice(4, 24)}</span>
//                      </div>
//                      <div class="flightResults-list-flightCard-price-trips">
//                          Total Price: ${priceIcon}
//                          ${Math.ceil(hotel.data.hotelTotalPrice).toLocaleString(
//                            "en-IN"
//                          )}
//                          &nbsp;
//                      </div>
//              </div>
//             <div class="seperate"></div>
//             <div class='hotel-card-status'>
//                 <div class='request-status'>
//                     Approval Status:<span style="background: ${approveColor};">${
//         hotelReq[0]?.requestStatus
//       }</span>
//                 </div>
//                 <div class='hotelType'>
//                     <div class='hotelStatus' >
//                         Booking Status:<span style="background: ${bgColor};">${
//         hotelStatus[0]?.status
//       }</span>
//                     </div>
//                 </div>
//     </div>
//     ${travDetails}
//     <div/>`;
//     });
//   }
// if (tripData.flights.length > 0) {
//   flightString += `
//     <div class="flight-header">Flights</div>`;
//   tripData.flights.forEach((flight, s) => {
// var flightStatus = tripData.data.flights.filter((f) => f.id === flight.id);

// var hotelData = tripData?.data?.flights.filter(
//   (hotels) => hotels.id === flight.id
// );
// var timeStamp = new Date(hotelData[0]?.date?.seconds * 1000);
// var flightReq = tripData.data.flights.filter((hotelMain) => {
//   return hotelMain.id === flight.id;
// });
//     var reqColor = reqStatuses.filter((status) => {
//       return status?.status === flightReq[0]?.requestStatus;
//     });
//     var bookingFlight = flight.data;
// var color = statuses.filter((status) => {
//   return status?.status === flightStatus[0]?.status;
// });
//     var approveColor = reqColor[0] ? reqColor[0]?.color : "#808080";
//     var bgColor = color[0]?.color ? color[0].color : "#808080";
//     var flightArr = [flight.data.flight].map((flight, f) => {
//       return { ...actions.modifyFlightObject(flight) };
//     });
//     var passenger = `${bookingFlight.adults} ${
//       bookingFlight.adults > 1 ? "Adults" : "Adult"
//     }
//                 ${
//                   bookingFlight.child > 0
//                     ? `, ${bookingFlight.child} ${
//                         bookingFlight.child > 1 ? "children" : "child"
//                       }`
//                     : ""
//                 }
//                 ${
//                   bookingFlight.infant > 0
//                     ? `, ${bookingFlight.infant} ${
//                         bookingFlight.infant > 1 ? "infants" : "infant"
//                       }`
//                     : ""
//                 }`;
//     var flightIcon = `<i class="fas fa-plane-departure flightResults-list-flightCard-logo-icon"></i>`;
//     var priceIcon = `<i class="fas fa-rupee-sign flightResults-list-flightCard-price-icon "></i>`;
//     var flightArrString = flightArr[0].segments.map((segment, sg) => {
//       var flightCode = "";
//       segment.flightCodes.forEach((code, c) => {
//         if (c === segment.flightCodes.length - 1) {
//           flightCode += code;
//         } else {
//           flightCode += `${code}, `;
//         }
//       });
//       return `
//                     <div class="flightResults-list-flightCard-airline-block">
//                         <div class="flightResults-list-flightCard-airline">
//                         <div class="flightResults-list-flightCard-logo">
//                                     <span>${flightIcon}</span>
//                                 </div>
//                             ${segment.airlineName}
//                             <span>&nbsp;&nbsp;(${flightCode})</span>
//                         </div>

//                         <div class="flightResults-list-flightCard-depDate-block">
//                             <div class="flightResults-list-flightCard-depDate">
//                                 ${segment.depTimeDate.toString().slice(4, 10)}
//                             </div>
//                         </div>
//                     </div>
//                     <div class="flightResults-list-flightCard-segment-section">
//                         <div class="flightResults-list-flightCard-arrDep">
//                             <div class="flightResults-list-flightCard-dep">
//                                 <div class="flightResults-list-flightCard-depTime">
//                                     ${segment.depTime}
//                                 </div>
//                                 <div class="flightResults-list-flightCard-depCity">
//                                     ${segment.originAirportCode}
//                                 </div>
//                             </div>
//                             <div class="flightResults-list-flightCard-duration">
//                                 <div
//                                     class="flightResult-list-flightCard-duration-stopPts"

//                                 >
//                                     <div class="flightResult-list-flightCard-duration-stopType">
//                                         ${
//                                           segment.stopOverPts.length === 0
//                                             ? "Direct"
//                                             : segment.stopOverPts.length > 1
//                                             ? `${segment.stopOverPts.length} stops`
//                                             : "1 stop"
//                                         }

//                                     </div>
//                                 </div>
//                                 <div class="flightResults-list-flightCard-duration-time">
//                                     ${
//                                       segment.finalTime === "NaNm"
//                                         ? segment.duration
//                                         : segment.finalTime
//                                     }
//                                 </div>
//                             </div>
//                             <div class="flightResults-list-flightCard-arr-section">
//                                 <div class="flightResults-list-flightCard-dep flightResults-list-flightCard-arr">
//                                     <div class="flightResults-list-flightCard-depTime">
//                                         ${segment.arrTime}
//                                     </div>
//                                     <div class="flightResults-list-flightCard-depCity">
//                                         ${segment.destAirportCode}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                             <div class="flightResults-list-flightCard-airportNames">
//                                 <div class="flightResults-list-flightCard-airportName">
//                                     <div class="flightResults-list-flightCard-cityName">
//                                         ${segment.originCityName}
//                                     </div>
//                                     ${segment.originAirportName}
//                                 </div>
//                                 <div class="flightResults-list-flightCard-airportName flightResults-list-flightCard-airportName-dest">
//                                     <div class="flightResults-list-flightCard-cityName">
//                                         ${segment.destCityName}
//                                     </div>
//                                     ${segment.destAirportName}
//                                 </div>
//                             </div>
//                     </div>`;
//     });

//     var travDetails = "";
//     if (tripData.data.travellerDetails) {
//       if (tripData.data.travellerDetails[flight.id]) {
//         tripData.data.travellerDetails[flight.id].forEach((trav, i) => {
//           travDetails += `
//           <div class="role-traveller-block">
//           <div class='role-traveller-header'>
//           Traveller ${i + 1}
//             </div>
//           <div class='role-traveller-box'>
//                 <div>First Name:<span>${trav.firstName}</span> </div>
//                 <div>Last Name:<span>${trav.lastName}</span> </div>
//             </div>
//             </div>
//           `;
//         });
//       }
//     }

//     flightString += `
//             <div class="flight-main">
//                 <div
//                     class="flightResults-list-flightCard-segment-block"
//                 >
//                     ${flightArrString}
//                 </div>

//                 <div class="flightResults-list-flightCard-header">
//                     <div class="flightResults-list-flightCard-fTypeBadge">
//                         ${bookingFlight.flightNew.fareType}
//                     </div>
//                     <div class="flightResults-list-flightCard-travellers">
//                     ${passenger}
//                     </div>
//                     <div class="flightResults-list-flightCard-cabinClass">
//                         ${flightArr[0].segments[0].cabinClass}
//                     </div>
//                 </div>

//             <div class="seperate"></div>
//                 <div class="timestamp">
//                   <div>
//                     Added Date:&nbsp;<span>${timeStamp
//                       .toString()
//                       .slice(4, 25)}</span>
//                   </div>
//                   <div class="flightResults-list-flightCard-price-trips">
//                     Total Price: <FontAwesomeIcon
//                       icon={faIndianRupeeSign}
//                       class="flightResults-list-flightCard-price-icon"
//                     />
//                     ${Math.ceil(bookingFlight?.finalPrice)?.toLocaleString(
//                       "en-IN"
//                     )}
//                     ${priceIcon}
//                   </div>
//                 </div>
//                 <div class="seperate"></div>
//                 <div class="flightResults-tripsPage">
//                   <div class='request-status'>
//                     Approval Status:<span style="background: ${approveColor}">${
//       flightReq[0]?.requestStatus
//     }</span>
//                   </div>
//                       <div class="flight-main-status">
//                               <div class="flightStatus" >
//                                 Booking Status:<span style="background: ${bgColor}">${
//       flightStatus[0].status
//     }</span>
//                               </div>
//                       </div>
//                 </div>
//                 ${travDetails}
//                 </div>
//             `;
//   });
// }
//   if (tripData?.cabs?.length > 0) {
//     cabString += `
//     <div class="flight-header">Cabs</div>`;
//     tripData.cabs.forEach((cab, s) => {
// var cabReq = tripData?.data?.cabs?.filter((hotelMain) => {
//   return hotelMain.id === cab.id;
// });
// var imgs = [
//   {
//     passenger: 4,
//     type: "Sedan",
//     image:
//       "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/hatchback_new.png",
//   },
//   {
//     passenger: 4,
//     type: "Indica or similar",
//     image:
//       "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/sedan_new.png",
//   },
//   {
//     passenger: 6,
//     type: "SUV (Innova/Ertiga)",
//     image:
//       "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
//   },
//   {
//     passenger: 6,
//     type: "Innova",
//     image:
//       "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
//   },
//   {
//     passenger: 6,
//     type: "Innova crysta",
//     image:
//       "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
//   },
//   {
//     passenger: 6,
//     type: "Innova Crysta",
//     image:
//       "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
//   },
//   {
//     passenger: 6,
//     type: "Ertiga",
//     image:
//       "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
//   },
// ];
// const cabs = [
//   "Airport to City center Hotel",
//   "City center hotel to airport",
// ];
// var color = statuses.filter((status) => {
//   return status?.status === cabReq[0]?.status;
// });
// var reqColor = reqStatuses.filter((status) => {
//   return status?.status === cabReq[0]?.requestStatus;
// });
// var cabColor = reqColor[0] ? reqColor[0]?.color : "#808080";
// var bgColor = color[0].color;
// var cabImg = imgs.filter(
//   (img) => img.type.trim() === cab.data.cab.carType.trim()
// );
//       var travDetails = "";
//       if (tripData.travellerDetails) {
//         if (tripData.data.travellerDetails[cab.id]) {
//           tripData.data.travellerDetails[cab.id].forEach((trav, i) => {
//             travDetails += `
//           <div class="role-traveller-block">
//           <div class='role-traveller-header'>
//           Traveller ${i + 1}
//             </div>
//           <div class='role-traveller-box'>
//                 <div>First Name:<span>${trav.firstName}</span> </div>
//                 <div>Last Name:<span>${trav.lastName}</span> </div>
//             </div>
//             </div>
//           `;
//           });
//         }
//       }

//       cabString += `
//       <div class="cab-container">
//       <div class='cab-card'>
// <div class='cab-img'>
//     <img src="${cabImg[0]?.image}" alt='Cab' />
// </div>
//       <div class='cab-card-details'>
//           <div class='cab-header'>
//               <div class='cab-header-name'>
//                   <span>${cab.data.cab.carType}</span>
//                   (${cab.data.cab.passenger} Seater)
//               </div>
//                           ${cab.data.cabType}
//               <div class='cab-header-date'>
// ${new Date(cab.data.cabStartDate.seconds * 1000)
//   ?.toString()
//   .slice(4, 15)}
//               </div>
//           </div>
//           <div class='cab-body'>
//               <span>${cab.notes ? cab.notes : ""}</span>
//               ${cab.data.cabCity}

//               <div class='cab-header-price'>
//                   <span><FontAwesomeIcon icon={faIndianRupeeSign} class='cab-header-price-icon' />${Number(
//                     cab.data.cabFinalPrice
//                   ).toLocaleString()}&nbsp;${
//         cabs.includes(cab.data.cabType) ? "per trip" : "per day"
//       }</span>
//               </div>

//           </div>
//       </div>
//   </div>
//             <div class="seperate"></div>
//             <div class="timestamp">
//                 <div>
//                     Added Date:&nbsp;<span>${new Date(
//                       cabReq[0]?.date?.seconds * 1000
//                     )
//                       .toString()
//                       .slice(4, 15)}</span>
//                 </div>
//                 <div class="cab-header-price">
//                     Total Price: <FontAwesomeIcon
//                         icon={faIndianRupeeSign}
//                         class="cab-header-price-icon"
//                     />
//                     ${Math.ceil(cab.data.cabTotalPrice).toLocaleString("en-IN")}
//                 </div>
//               </div>
//             <div class="seperate"></div>
//             <div class="flightResults-tripsPage">
//                 <div class='request-status'>
//             Approval Status:<span style="background:${cabColor}">${
// cabReq[0]?.requestStatus
//       }</span>
//                 </div>
//                 <div class='flight-main-status'>
//                     <div class="flightStatus" >
//                 Booking Status:<span style="background: ${bgColor}">${
// cabReq[0].status
//       }</span>
//                     </div>
//                 </div>
//             </div>
//         ${travDetails}
//   </div>
//       `;
//     });
//   }
//   var mainHtmlString = `<!DOCTYPE html>
//     <html>
//     <head>
//     <title>Page Title</title>
//     <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.min.js"></script>

//     <style>
//         ${cssString}
//     </style>
//     </head>
//     <body>
//     ${headingString}
//     ${profileDetails}
//     ${flightString}
//     ${hotelString}
//     ${cabString}
//     </body>
//     </html>
//     `;

//   return mainHtmlString;
// };

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  header: {
    display: "flex",
    // margin: "10px 20px",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerName: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  tripName: {
    fontSize: "16pt",
    fontWeight: "bold",
  },
  date: {
    color: "#94D2BD",
    fontSize: 10,
  },
});

const TripDetailsPdf = ({ tripData, userAccountDetails }) => {
  var newdate = new Date(tripData?.data?.date?.seconds * 1000).toLocaleString(
    "en-US"
  );

  var statuses = [
    { status: "Submitted", color: "#ffa500" },
    { status: "Need clarification", color: "#FFC107" },
    { status: "Price Revision", color: "#2196F3" },
    { status: "Booked", color: "#4CAF50" },
    { status: "Cancelled", color: "#FF0000" },
    { status: "Submitted,Payment Pending", color: "#ffa500" },
    { status: "Booked,Payment Pending", color: "#4CAF50" },
    { status: "Not Submitted", color: "#808080" },
  ];
  var reqStatuses = [
    { status: "Approved", color: "#008000" },
    { status: "Pending", color: "#ffa500" },
    { status: "Not Requested", color: "#808080" },
    { status: "Skipped", color: "#808080" },
  ];
  const finalPrice = () => {
    var price = 0;
    tripData?.flights?.map(
      (e) =>
        (price =
          price +
          e.data.totalFare +
          e.data.finalFlightServiceCharge +
          e.data.gstInFinalserviceCharge)
    );
    tripData?.hotels?.map(
      (hotel) => (price = price + hotel.data.hotelTotalPrice)
    );
    tripData?.cabs?.map(
      (cab) => (price = price + Number(cab.data.cabTotalPrice))
    );
    tripData?.bus?.map(
      (bus) => (price = price + Number(bus.data.busTotalPrice))
    );
    tripData?.otherBookings?.map(
      (bus) => (price = price + Number(bus.data.overallBookingPrice))
    );
    tripData?.expenses?.map(
      (expense) => (price = price + Number(expense.data.cost))
    );
    return Math.ceil(price);
  };

  return (
    <Document>
      <Page style={styles.page} size="A4">
        <View style={styles.header}>
          <View style={styles.headerName}>
            <Text style={styles.tripName}>{tripData?.data?.name}</Text>
            <Text
              style={{
                marginTop: 10,
                marginBottom: 10,
                fontSize: 10,
              }}
            >
              Created on: <Text style={styles.date}>{newdate}</Text>
            </Text>
          </View>
          <View>
            <Image
              style={{ height: "15vw", width: "25vw", objectFit: "contain" }}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/trav-biz.appspot.com/o/logo%2FWhatsApp_Image_2024-05-09_at_12.49.04_PM-removebg-preview.png?alt=media&token=eba760ff-379d-4bf6-a0f5-595b5d6198f5",
              }}
            />
          </View>
        </View>
        <Text
          style={{
            fontSize: "15pt",
            marginBottom: 10,
          }}
        >
          Profile Details
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ display: "flex", gap: 5 }}>
            <Text style={{ fontSize: 11 }}>
              First Name:<Text>{userAccountDetails.firstName}</Text>{" "}
            </Text>
            <Text style={{ fontSize: 11 }}>
              Email:<Text>{userAccountDetails.email}</Text>{" "}
            </Text>
            <Text style={{ fontSize: 11 }}>
              Company Name:<Text>{userAccountDetails.companyName}</Text>{" "}
            </Text>
            <Text style={{ fontSize: 11 }}>
              Company PAN Number:<Text>{userAccountDetails.PANNo}</Text>{" "}
            </Text>
          </View>
          <View style={{ display: "flex", gap: 5 }}>
            <Text style={{ fontSize: 11 }}>
              Last Name:<Text>{userAccountDetails.lastName}</Text>{" "}
            </Text>

            <Text style={{ fontSize: 11 }}>
              Mobile Number:<Text>{userAccountDetails.mobileNumber}</Text>{" "}
            </Text>

            <Text style={{ fontSize: 11 }}>
              Company GST Number:<Text>{userAccountDetails.GSTNo}</Text>{" "}
            </Text>
            <Text style={{ fontSize: 11 }}>
              Approver:
              <Text>
                {userAccountDetails.manager.name}(
                {userAccountDetails.manager.email})
              </Text>{" "}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "whitesmoke",
            padding: 5,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <View>
            <Text style={{ marginTop: 5 }}>Summary</Text>
            {statuses.map((status) => {
              return (
                <View>
                  {tripData?.data?.flights?.filter(
                    (flight) => flight.status === status.status
                  ).length > 0 ||
                  tripData?.data?.hotels?.filter(
                    (flight) => flight.status === status.status
                  ).length > 0 ||
                  tripData?.data?.cabs?.filter(
                    (flight) => flight.status === status.status
                  ).length > 0 ||
                  tripData?.data?.bus?.filter(
                    (flight) => flight.status === status.status
                  ).length > 0 ||
                  tripData?.data?.otherBookings?.filter(
                    (flight) => flight.status === status.status
                  ).length > 0 ? (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        fontSize: 12,
                      }}
                    >
                      <Text style={{ marginTop: 5, marginBottom: 5 }}>
                        {tripData?.data?.flights?.filter(
                          (flight) => flight.status === status.status
                        ).length > 0 ? (
                          <>
                            {
                              tripData?.data?.flights?.filter(
                                (flight) => flight.status === status.status
                              ).length
                            }
                            -Flights,
                          </>
                        ) : null}
                        {tripData?.data?.hotels?.filter(
                          (flight) => flight.status === status.status
                        ).length > 0 ? (
                          <>
                            {
                              tripData?.data?.hotels?.filter(
                                (flight) => flight.status === status.status
                              ).length
                            }
                            -Hotels,
                          </>
                        ) : null}
                        {tripData?.data?.cabs?.filter(
                          (flight) => flight?.status === status?.status
                        ).length > 0 ? (
                          <>
                            {
                              tripData?.data?.cabs?.filter(
                                (flight) => flight?.status === status?.status
                              ).length
                            }
                            -Cab,
                          </>
                        ) : null}
                        {tripData?.data?.bus?.filter(
                          (flight) => flight?.status === status?.status
                        ).length > 0 ? (
                          <>
                            {
                              tripData?.data?.bus?.filter(
                                (flight) => flight?.status === status?.status
                              ).length
                            }
                            -Bus
                          </>
                        ) : null}
                        {tripData?.data?.otherBookings?.filter(
                          (flight) => flight?.status === status?.status
                        ).length > 0 ? (
                          <>
                            {
                              tripData?.data?.otherBookings?.filter(
                                (flight) => flight?.status === status?.status
                              ).length
                            }
                            -Others
                          </>
                        ) : null}
                      </Text>
                      <Text
                        style={{
                          backgroundColor: status.color,
                          borderRadius: 5,
                          padding: 3,
                          fontSize: 10,
                        }}
                      >
                        {status.status}
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
          <View>
            <Text style={{ color: "#BB3E03" }}>
              Total Price:{finalPrice()}/-
            </Text>
          </View>
        </View>
        {/* flights */}
        {tripData?.flights?.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: "15pt",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              Flights
            </Text>
            {tripData?.flights?.map((e) => {
              var flightStatus = tripData.data.flights.filter(
                (f) => f.id === e.id
              );
              var flightStatus = tripData?.data?.flights.filter(
                (f) => f.id === e.id
              );
              var hotelData = tripData?.data?.flights.filter(
                (hotels) => hotels.id === e.id
              );
              var timeStamp = new Date(hotelData[0]?.date?.seconds * 1000);
              var flightReq = tripData.data.flights.filter((hotelMain) => {
                return hotelMain.id === e.id;
              });
              var reqColor = reqStatuses.filter((status) => {
                return status?.status === flightReq[0]?.requestStatus;
              });
              var color = statuses.filter((status) => {
                return status?.status === flightStatus[0]?.status;
              });
              var approveColor = reqColor[0] ? reqColor[0].color : "#808080";
              var bgColor = color[0] ? color[0].color : "#808080";
              return (
                <View
                  style={{
                    padding: 5,
                    backgroundColor: "whitesmoke",
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                >
                  <View>
                    {e.data.flight.Segments?.map((f, i) => (
                      <View>
                        {f.map((flight, k) => (
                          <View>
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "extrabold",
                                  }}
                                >
                                  {flight.Airline.AirlineName}
                                </Text>
                                <Text style={{ fontSize: "8px" }}>
                                  ( {e.data.flight.AirlineCode}-
                                  {flight.Airline.FlightNumber}
                                  {flight.Airline.FareClass})
                                </Text>
                              </View>
                              {/* <View> */}
                              {/* <Text>
                              {new Date(
                                tripData?.data?.date?.seconds * 1000
                              ).toLocaleString("en-US")}
                            </Text> */}
                              {/* </View> */}
                            </View>
                            <View>
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginTop: 5,
                                  marginBottom: 5,
                                  fontSize: 17,
                                }}
                              >
                                <View>
                                  <Text>
                                    {flight.Origin.DepTime.toString()
                                      .split("T")[1]
                                      .slice(0, 5)}
                                  </Text>
                                  <Text>
                                    {flight.Origin.Airport.AirportCode}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: "rgb(150, 150, 150)",
                                    borderBottomStyle: "dashed",
                                    width: "60%",
                                    fontSize: 17,
                                    fontWeight: "bold",
                                    color: "rgb(160, 160, 160)",
                                  }}
                                ></View>
                                <View style={{ fontSize: 17 }}>
                                  <Text>
                                    {flight.Destination.ArrTime.toString()
                                      .split("T")[1]
                                      .slice(0, 5)}
                                  </Text>
                                  <Text>
                                    {flight.Destination.Airport.AirportCode}
                                  </Text>
                                  {/* <Text></Text> */}
                                </View>
                              </View>
                              <View></View>
                              <View></View>
                            </View>
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 5,
                                marginBottom: 5,
                              }}
                            >
                              <View>
                                <Text
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    marginBottom: "2px",
                                    color: "rgb(80, 80, 80)",
                                  }}
                                >
                                  {flight.Origin.Airport.CityName}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "9px",
                                    fontWeight: "bold",
                                    marginBottom: "2px",
                                    color: "rgb(80, 80, 80)",
                                  }}
                                >
                                  {flight.Origin.Airport.AirportName}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    marginBottom: "2px",
                                    color: "rgb(80, 80, 80)",
                                  }}
                                >
                                  {flight.Destination.Airport.CityName}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "9px",
                                    fontWeight: "bold",
                                    marginBottom: "2px",
                                    color: "rgb(80, 80, 80)",
                                  }}
                                >
                                  {flight.Destination.Airport.AirportName}
                                </Text>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Text style={{ fontSize: "12px" }}>
                      {e.data.flightNew.fareType}
                    </Text>
                    <Text style={{ fontSize: "12px" }}>
                      {e.data.adults} Adults
                    </Text>
                    <Text>
                      {e.data.flightNew.segments.map((s) => (
                        <Text style={{ fontSize: "12px" }}>{s.cabinClass}</Text>
                      ))}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      Added Date:{timeStamp.toString().slice(4, 25)}
                    </Text>
                    <Text
                      style={{
                        color: "#BB3E03",
                        fontSize: 17,
                        fontWeight: "bold",
                      }}
                    >
                      Total Price:
                      {Math.ceil(
                        e.data.totalFare +
                          e.data.finalFlightServiceCharge +
                          e.data.gstInFinalserviceCharge
                      )}
                      /-
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      fontSize: 9,
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: approveColor,
                        padding: 4,
                        paddingLeft: 8,
                        paddingRight: 8,
                        borderRadius: 8,
                      }}
                    >
                      Approval Status: {flightReq[0]?.requestStatus}
                    </Text>
                    <Text
                      style={{
                        backgroundColor: bgColor,
                        padding: 4,
                        paddingLeft: 8,
                        paddingRight: 8,
                        borderRadius: 8,
                      }}
                    >
                      Booking Status: {flightStatus[0]?.status}
                    </Text>
                  </View>
                  {tripData?.data?.travellerDetails && (
                    <View>
                      {tripData?.data?.travellerDetails[e.id] && (
                        <View>
                          {tripData?.data?.travellerDetails[e.id]?.adults?.map(
                            (details, k) => (
                              <View
                                style={{
                                  fontSize: 9,
                                  display: "flex",
                                  gap: 3,
                                  marginTop: 5,
                                }}
                              >
                                <Text>Traveller {k + 1}</Text>

                                <Text>First Name:{details.firstName} </Text>
                                <Text>Last Name:{details.lastName}</Text>
                              </View>
                            )
                          )}
                          {tripData?.data?.travellerDetails[
                            e.id
                          ]?.children?.map((details, k) => (
                            <View
                              style={{
                                fontSize: 9,
                                display: "flex",
                                gap: 3,
                                marginTop: 5,
                              }}
                            >
                              <Text>Traveller {k + 1}</Text>

                              <Text>First Name:{details.firstName} </Text>
                              <Text>Last Name:{details.lastName}</Text>
                            </View>
                          ))}
                          {tripData?.data?.travellerDetails[e.id]?.infants?.map(
                            (details, k) => (
                              <View
                                style={{
                                  fontSize: 9,
                                  display: "flex",
                                  gap: 3,
                                  marginTop: 5,
                                }}
                              >
                                <Text>Traveller {k + 1}</Text>

                                <Text>First Name:{details.firstName} </Text>
                                <Text>Last Name:{details.lastName}</Text>
                              </View>
                            )
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
        {/* hotels */}
        {tripData?.hotels?.length > 0 && (
          <View>
            <Text style={{ fontSize: 14 }}>Hotels</Text>
            {tripData?.hotels?.map((hotel, hotelindex) => {
              var hotelData = tripData?.data?.hotels.filter(
                (hotels) => hotels.id === hotel.id
              );
              var hotelTimeStamp = new Date(hotelData[0]?.date?.seconds * 1000);
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
              const adults = hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
                (acc, obj) => {
                  acc.adults += parseInt(obj.adults, 10);
                  acc.child += parseInt(obj.child, 10);
                  return acc;
                },
                { adults: 0, child: 0 }
              );
              var hotelReq = tripData.data.hotels.filter((hotelMain) => {
                return hotelMain.id === hotel.id;
              });
              var hotelStatus = tripData?.data?.hotels?.filter(
                (f) => f.id === hotel.id
              );
              var reqColor = reqStatuses.filter((status) => {
                return status?.status === hotelReq[0]?.requestStatus;
              });
              var color = statuses.filter((status) => {
                return status?.status === hotelStatus[0]?.status;
              });
              var approveColor = reqColor[0] ? reqColor[0].color : "#808080";
              var bgColor = color[0] ? color[0].color : "#808080";
              return (
                <View
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                    backgroundColor: "whitesmoke",
                    padding: 5,
                    borderRadius: 5,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      fontSize: 10,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ height: 50, width: 50 }}
                      src={{
                        uri: `${hotel.data.hotelImages}`,
                      }}
                    />
                    <View>
                      <Text>{hotel?.data?.hotelName}</Text>
                      <Text>
                        Adults-{adults?.adults} Children-{adults?.child}
                      </Text>
                    </View>
                    <Text
                      style={{
                        backgroundColor: "#94d2bd",
                        borderRadius: 5,
                        paddingTop: 4,
                        paddingBottom: 4,
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                    >
                      {formattedDate1}-{formattedDate2}(
                      {hotel.data.hotelSearchQuery.hotelNights} nights)
                    </Text>
                  </View>
                  <View>
                    {hotel?.data?.selectedRoomType.map((room) => (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>
                          {room.RoomTypeName}
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                          {room.Price.OfferedPriceRoundedOff
                            ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                                "en-IN"
                              )
                            : room.Price.PublishedPriceRoundedOff.toLocaleString(
                                "en-IN"
                              )}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>
                      Added:{hotelTimeStamp.toString().slice(4, 24)}
                    </Text>
                    <Text style={{ color: "#BB3E03" }}>
                      Total Price:
                      {Math.ceil(hotel.data.hotelTotalPrice).toLocaleString(
                        "en-IN"
                      )}
                      /-
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 5,
                      marginTop: 5,
                      fontSize: 9,
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: `${approveColor}`,
                        padding: 4,
                        paddingLeft: 8,
                        paddingRight: 8,
                        borderRadius: 8,
                      }}
                    >
                      Approval status:{hotelReq[0]?.requestStatus}
                    </Text>
                    <Text
                      style={{
                        backgroundColor: `${bgColor}`,
                        padding: 4,
                        paddingLeft: 8,
                        paddingRight: 8,
                        borderRadius: 8,
                      }}
                    >
                      Booking status:{hotelStatus[0]?.status}
                    </Text>
                  </View>
                  {tripData?.data?.travellerDetails && (
                    <View>
                      {tripData?.data?.travellerDetails[hotel.id]?.adults && (
                        <View>
                          {tripData?.data?.travellerDetails[
                            hotel.id
                          ]?.adults?.map((details, k) => (
                            <View
                              style={{
                                fontSize: 9,
                                display: "flex",
                                gap: 3,
                                marginTop: 5,
                              }}
                            >
                              <Text>Traveller {k + 1}</Text>
                              <Text>First Name:{details.firstName} </Text>
                              <Text>Last Name:{details.lastName}</Text>
                            </View>
                          ))}
                          {tripData?.data?.travellerDetails[
                            hotel.id
                          ]?.children?.map((details, k) => (
                            <View
                              style={{
                                fontSize: 9,
                                display: "flex",
                                gap: 3,
                                marginTop: 5,
                              }}
                            >
                              <Text>Traveller {k + 1}</Text>
                              <Text>First Name:{details.firstName} </Text>
                              <Text>Last Name:{details.lastName}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
        {/* buses */}
        {tripData?.bus?.length > 0 && (
          <View>
            <Text style={{ fontSize: 14 }}>Buses</Text>
            {tripData?.bus?.map((busData) => {
              var bus = busData?.data?.bus;
              var busDataa = tripData?.data?.bus?.filter((hotelMain) => {
                return hotelMain.id === busData.id;
              });
              const selectedSeatsPrice =
                busData?.data?.selectedSeat?.length > 0
                  ? busData?.data?.selectedSeat?.reduce(
                      (total, seat) =>
                        total + seat.Price.OfferedPriceRoundedOff,
                      0
                    )
                  : 0;
              const depdate = new Date(bus?.DepartureTime);
              const depformattedDate = depdate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              });
              const arrdate = new Date(bus?.ArrivalTime);
              const arrformattedDate = arrdate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              });
              var color = statuses.filter((status) => {
                return status?.status === busDataa[0]?.status;
              });

              var reqColor = reqStatuses.filter((status) => {
                return status?.status === busDataa[0]?.requestStatus;
              });
              var busColor = reqColor[0] ? reqColor[0]?.color : "#808080";
              var bgColor = color[0]?.color;

              return (
                <View
                  style={{
                    backgroundColor: "whitesmoke",
                    borderRadius: 5,
                    padding: 5,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <View>
                      <Text>{bus.TravelName}</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                        fontSize: 10,
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: "#94d2bd",
                          borderRadius: 5,
                          paddingTop: 4,
                          paddingBottom: 4,
                          fontSize: 10,
                          paddingRight: 10,
                          paddingLeft: 10,
                        }}
                      >
                        {depformattedDate} - {arrformattedDate}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 5,
                      marginBottom: 5,
                      fontSize: 12,
                    }}
                  >
                    <Text>{busData?.data?.origin?.cityName}</Text>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "rgb(150, 150, 150)",
                        borderBottomStyle: "dashed",
                        width: "60%",
                        fontSize: 17,
                        fontWeight: "bold",
                        color: "rgb(160, 160, 160)",
                      }}
                    ></View>
                    <Text>{busData?.data?.destination?.cityName}</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Text style={{ fontSize: 8, paddingTop: 5 }}>
                      {bus?.BusType}
                    </Text>

                    <Text
                      style={{
                        paddingLeft: 20,
                        color: "#bb3e03",
                        fontSize: 16,
                      }}
                    >
                      Rs.{busData?.data?.busTotalPrice}/-
                    </Text>
                  </View>
                  <View
                    style={{
                      fontSize: 9,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: busColor,
                        padding: 4,
                        paddingLeft: 8,
                        paddingRight: 8,
                        borderRadius: 8,
                      }}
                    >
                      Approval Status: {busDataa[0]?.requestStatus}
                    </Text>
                    <Text
                      style={{
                        backgroundColor: bgColor,
                        padding: 4,
                        paddingLeft: 8,
                        paddingRight: 8,
                        borderRadius: 8,
                      }}
                    >
                      Booking Status: {busDataa[0]?.status}
                    </Text>
                  </View>
                  {tripData?.data?.travellerDetails && (
                    <View>
                      {tripData?.data?.travellerDetails[busData.id] && (
                        <View>
                          {tripData?.data?.travellerDetails[
                            busData.id
                          ]?.adults?.map((details, k) => (
                            <View
                              style={{
                                fontSize: 9,
                                display: "flex",
                                gap: 3,
                                marginTop: 5,
                              }}
                            >
                              <Text>Traveller {k + 1}</Text>
                              <Text>First Name:{details.firstName} </Text>
                              <Text>Last Name:{details.lastName}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
        {/* cabs */}
        {tripData?.cabs?.length > 0 && (
          <View>
            <Text style={{ fontSize: 14 }}>Cabs</Text>
            {tripData.cabs.map((cab) => {
              var cabReq = tripData?.data?.cabs?.filter((hotelMain) => {
                return hotelMain.id === cab.id;
              });
              var imgs = [
                {
                  passenger: 4,
                  type: "Sedan",
                  image:
                    "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/hatchback_new.png",
                },
                {
                  passenger: 4,
                  type: "Indica or similar",
                  image:
                    "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/sedan_new.png",
                },
                {
                  passenger: 6,
                  type: "SUV (Innova/Ertiga)",
                  image:
                    "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
                },
                {
                  passenger: 6,
                  type: "Innova",
                  image:
                    "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
                },
                {
                  passenger: 6,
                  type: "Innova crysta",
                  image:
                    "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
                },
                {
                  passenger: 6,
                  type: "Innova Crysta",
                  image:
                    "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
                },
                {
                  passenger: 6,
                  type: "Ertiga",
                  image:
                    "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
                },
              ];
              var statuses = [
                { status: "Submitted", color: "#ffa500" },
                { status: "Need clarification", color: "#FFC107" },
                { status: "Price Revision", color: "#2196F3" },
                { status: "Booked", color: "#4CAF50" },
                { status: "Cancelled", color: "#FF0000" },
                { status: "Submitted,Payment Pending", color: "#ffa500" },
                { status: "Booked,Payment Pending", color: "#4CAF50" },
                { status: "Not Submitted", color: "#808080" },
              ];
              var reqStatuses = [
                { status: "Approved", color: "#008000" },
                { status: "Pending", color: "#ffa500" },
                { status: "Not Requested", color: "#808080" },
                { status: "Skipped", color: "#808080" },
              ];
              const cabs = [
                "Airport to City center Hotel",
                "City center hotel to airport",
              ];
              var color = statuses.filter((status) => {
                return status?.status === cabReq[0]?.status;
              });
              var reqColor = reqStatuses.filter((status) => {
                return status?.status === cabReq[0]?.requestStatus;
              });
              var cabColor = reqColor[0] ? reqColor[0]?.color : "#808080";
              var bgColor = color[0]?.color;
              var cabImg = imgs.filter(
                (img) => img.type.trim() === cab.data.cab.carType.trim()
              );
              console.log(cab);
              return (
                <View
                  style={{
                    padding: 5,
                    backgroundColor: "whitesmoke",
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                >
                  <View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{ height: 50, width: 50 }}
                        src={{ uri: cabImg[0]?.image }}
                        alt="Cab"
                      />
                      <View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: 13,
                            gap: 10,
                          }}
                        >
                          <Text>
                            {cab.data.cab.carType}({cab.data.cab.passenger}{" "}
                            Seater)
                          </Text>
                          {/* <Text>{cab.data.cabType}</Text> */}
                          <Text
                            style={{
                              backgroundColor: "#94d2bd",
                              borderRadius: 5,
                              paddingTop: 4,
                              paddingBottom: 4,
                              fontSize: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              textAlign: "center",
                              marginLeft: "65%",
                            }}
                          >
                            {new Date(cab.data.cabStartDate.seconds * 1000)
                              ?.toString()
                              .slice(4, 10)}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 10,
                          }}
                        >
                          <Text></Text>
                          <Text style={{ fontSize: 13 }}>
                            {cab.data.cabCity}
                          </Text>
                          <Text
                            style={{
                              textAlign: "right",
                              fontSize: 10,
                            }}
                          >
                            {Number(cab.data.cab.price).toLocaleString()}
                            {cabs.includes(cab.data.cabType)
                              ? "per trip"
                              : "per day"}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 8,
                        marginBottom: 5,
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>
                        Added:
                        {new Date(cabReq[0]?.date?.seconds * 1000)
                          .toString()
                          .slice(4, 15)}
                      </Text>
                      <Text style={{ color: "#BB3E03" }}>
                        Total Price:
                        {Math.ceil(cab.data.cabTotalPrice).toLocaleString(
                          "en-IN"
                        )}
                        /-
                      </Text>
                    </View>
                    <View
                      style={{
                        fontSize: 9,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 5,
                        marginBottom: 5,
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: `${cabColor}`,
                          padding: 4,
                          paddingLeft: 8,
                          paddingRight: 8,
                          borderRadius: 8,
                        }}
                      >
                        Approval Status:{cabReq[0]?.requestStatus}
                      </Text>
                      <Text
                        style={{
                          backgroundColor: `${bgColor}`,
                          padding: 4,
                          paddingLeft: 8,
                          paddingRight: 8,
                          borderRadius: 8,
                        }}
                      >
                        Booking Status:{cabReq[0]?.status}
                      </Text>
                    </View>
                  </View>
                  {tripData?.data?.travellerDetails && (
                    <View>
                      {tripData?.data?.travellerDetails[cab.id] && (
                        <View>
                          {tripData?.data?.travellerDetails[
                            cab.id
                          ]?.adults?.map((details, k) => (
                            <View
                              style={{
                                fontSize: 9,
                                display: "flex",
                                gap: 3,
                                marginTop: 5,
                              }}
                            >
                              <Text>Traveller {k + 1}</Text>
                              <Text>First Name:{details.firstName} </Text>
                              <Text>Last Name:{details.lastName}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* others */}

        {tripData?.otherBookings?.length > 0 && (
          <View>
            <Text style={{ fontSize: 14 }}>Others</Text>
            {tripData.otherBookings.map((cab) => {
              var otherReq = tripData?.data?.otherBookings?.filter(
                (hotelMain) => {
                  return hotelMain.id === cab.id;
                }
              );
              console.log(otherReq);
              var statuses = [
                { status: "Submitted", color: "#ffa500" },
                { status: "Need clarification", color: "#FFC107" },
                { status: "Price Revision", color: "#2196F3" },
                { status: "Booked", color: "#4CAF50" },
                { status: "Cancelled", color: "#FF0000" },
                { status: "Submitted,Payment Pending", color: "#ffa500" },
                { status: "Booked,Payment Pending", color: "#4CAF50" },
                { status: "Not Submitted", color: "#808080" },
              ];
              var reqStatuses = [
                { status: "Approved", color: "#008000" },
                { status: "Pending", color: "#ffa500" },
                { status: "Not Requested", color: "#808080" },
                { status: "Skipped", color: "#808080" },
              ];
              const cabs = [
                "Airport to City center Hotel",
                "City center hotel to airport",
              ];
              var color = statuses.filter((status) => {
                return status?.status === otherReq[0]?.status;
              });
              var reqColor = reqStatuses.filter((status) => {
                return status?.status === otherReq[0]?.requestStatus;
              });
              var cabColor = reqColor[0] ? reqColor[0]?.color : "#808080";
              var bgColor = color[0]?.color;

              console.log(cab);
              return (
                <View
                  style={{
                    padding: 5,
                    backgroundColor: "whitesmoke",
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                >
                  <View>
                    <View></View>
                    <View>
                      <View
                        style={{
                          fontSize: 16,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        <Text>{cab.data.bookingType}</Text>
                        <Text>{cab.data.bookingDate}</Text>
                      </View>
                      <View
                        style={{
                          fontSize: 9,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>
                          Added:
                          {new Date(otherReq[0]?.date?.seconds * 1000)
                            .toString()
                            .slice(4, 15)}
                        </Text>
                        <Text style={{ color: "#BB3E03", fontSize: 17 }}>
                          Total Price:{cab.data.overallBookingPrice}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      fontSize: 9,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: `${cabColor}`,
                        padding: 4,
                        paddingLeft: 8,
                        paddingRight: 8,
                        borderRadius: 8,
                      }}
                    >
                      Approval Status:{otherReq[0].requestStatus}
                    </Text>
                    <Text
                      style={{
                        backgroundColor: `${bgColor}`,
                        padding: 4,
                        paddingLeft: 8,
                        paddingRight: 8,
                        borderRadius: 8,
                      }}
                    >
                      Booking Status:{otherReq[0].status}
                    </Text>
                  </View>

                  <View>
                    <View>
                      {cab.data.bookingTravellers?.map((details, k) => (
                        <View
                          style={{
                            fontSize: 9,
                            display: "flex",
                            gap: 3,
                            marginTop: 5,
                          }}
                        >
                          <Text>Traveller {k + 1}</Text>
                          <Text>First Name:{details.firstName} </Text>
                          <Text>Last Name:{details.lastName}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* {tripData?.data?.travellerDetails && (
                    <View>
                      {tripData?.data?.travellerDetails[cab.id] && (
                        <View>
                          {tripData?.data?.travellerDetails[
                            cab.id
                          ]?.adults?.map((details, k) => (
                            <View
                              style={{
                                fontSize: 9,
                                display: "flex",
                                gap: 3,
                                marginTop: 5,
                              }}
                            >
                              <Text>Traveller {k + 1}</Text>
                              <Text>First Name:{details.firstName} </Text>
                              <Text>Last Name:{details.lastName}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )} */}
                </View>
              );
            })}
          </View>
        )}

        {/* expenses */}
        <View>
          {tripData?.expenses?.length > 0 && (
            <View style={{ marginTop: "10px" }}>
              <Text>Expenses</Text>
              <View
                style={{
                  backgroundColor: "whitesmoke",
                  borderRadius: 5,
                  padding: 5,
                }}
              >
                {tripData?.expenses?.map((expense, i) => (
                  <View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>
                        {expense?.data?.type}
                      </Text>
                      <View>
                        <Text
                          style={{
                            backgroundColor: "#94d2bd",
                            borderRadius: 5,
                            paddingTop: 4,
                            paddingBottom: 4,
                            fontSize: 10,
                            paddingRight: 10,
                            paddingLeft: 10,
                          }}
                        >
                          {new Date(expense?.data?.expenseDate?.seconds * 1000)
                            ?.toString()
                            .slice(4, 10)}
                        </Text>
                        <Text style={{ color: "#BB3E03", marginTop: 5 }}>
                          Rs.{expense?.data?.cost}/-
                        </Text>
                      </View>
                    </View>
                    <View style={{ width: "70%" }}>
                      <Text style={{ fontSize: 12 }}>
                        Description:{" "}
                        <Text style={{ fontSize: 10 }}>
                          {expense?.data?.description}
                        </Text>
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default TripDetailsPdf;
