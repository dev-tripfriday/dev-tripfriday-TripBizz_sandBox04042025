import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStarHalf,
  faStar,
  faIndianRupeeSign,
  faUtensils,
  faCheckCircle,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import MyContext from "../../Context";
import "./HDetailsCard.css";
import TravDetails from "../../Trips/TripDetails/TravellerDetails";
const HDetailsCard = ({ data,trav }) => {
  const { actions } = useContext(MyContext);
  var getDate = (seconds) => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const dayofyear = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });
    var dateString = `${month.slice(0, 3)} ${dayOfWeek} ${dayofyear}`;
    return dateString;
  };
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
  var rating = [];
  var starRating =data?.data?.hotelInfo?.HotelInfoResult?.HotelDetails?.StarRating;
  var starRatingFull = Math.floor(starRating);
  const startdate = new Date(data?.data?.hotelSearchQuery?.checkInDate.seconds * 1000
  );
  const formattedDate1 = `${
    monthNames[startdate.getMonth()]
  } ${startdate.getDate()}`;
  var endDate = getDate(data?.data?.hotelSearchQuery?.checkOutDate.seconds);
  var img = data?.data?.hotelInfo?.HotelInfoResult?.HotelDetails
    ? data?.data?.hotelInfo?.HotelInfoResult?.HotelDetails?.Images[0]
    : "";
  //   var color = tripstatuses.filter((status) => {
  //     return status?.status === hotel?.status;
  //   });
  //   var hotelStatus =
  //     adminTripDetails?.data?.hotels?.filter(
  //       (f) => f.id === hotel.id
  //     );
  var adults = data?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
    (acc, obj) => {
      acc.adults += parseInt(obj.adults, 10);
      acc.child += parseInt(obj.child, 10);
      return acc;
    },
    { adults: 0, child: 0 }
  );
  //   var reqColor = reqStatuses.filter((status) => {
  //     return status?.status === hotel?.requestStatus;
  //   });
  for (var i = 1; i <= Math.ceil(starRating); i++) {
    if (i > starRatingFull) {
      rating.push(<FontAwesomeIcon icon={faStarHalf} className="star" />);
    } else {
      rating.push(<FontAwesomeIcon icon={faStar} className="star" />);
    }
  }
  return (
   <>
    <div className="hcard-total">
      <div className="hcard">
        <div className="hcard-img">
          <img src={img} alt="Hotel" />
        </div>
        <div className="hotel-card-details">
          <div className="room_Title">
            {data.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName}
          </div>

          <span className="bg-[#94D2BD] float-right text-black font-semibold rounded-tl-[0.8rem] rounded-bl-[0.8rem] text-[13px] pl-[4px] py-[6px]">
            {formattedDate1}-{endDate}
            &nbsp;(
            {data.data.hotelSearchQuery.hotelNights} Nights)
          </span>

          <div className="hotel-card-details-row">
            <div
              className="hotel-card-rating"
              style={{ display: "flex", flexDirection: "row" }}
            >
              {rating.map((star, ind) => {
                return <div key={`st_${ind + 1}`}>{star}</div>;
              })}
            </div>
            <div className="room_sub_Titles">
              Adults-{adults?.adults}&nbsp;
              {/* <div>{hotel.data.hotelCode}</div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="room_Card_Main">
        {data.data?.selectedRoomType &&
          data.data?.selectedRoomType.map((room, f) => {
            return (
              <div className="room_Card" key={`i_${f + 1}`}>
                <div className="hotelInfo_roomDtls">
                  <div className="room_Title">{room.RoomTypeName}</div>
                  <div className="hotelInfo_Price">
                    <FontAwesomeIcon icon={faIndianRupeeSign} />

                    {`${
                      room.Price.OfferedPriceRoundedOff
                        ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                            "en-IN"
                          )
                        : room?.Price.PublishedPriceRoundedOff.toLocaleString(
                            "en-IN"
                          )
                    } `}
                  </div>
                </div>
                <div className="hotelInfo_OtherSection">
                  <div className="room_sub_Titles">
                    <FontAwesomeIcon
                      icon={faUtensils}
                      className="hotelInfo_Icon"
                    />
                    {room.Inclusion && room.Inclusion.length > 0
                      ? actions.checkForTboMeals(room.Inclusion)
                      : "No meals"}
                  </div>
                  <div className="room_sub_Titles">
                    {room.LastCancellationDate &&
                    actions.validCancelDate(room.LastCancellationDate) ? (
                      <>
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="hotelInfo_Icon"
                        />
                        {`Free cancellation upto ${new Date(
                          room.LastCancellationDate
                        )
                          .toString()
                          .slice(4, 10)}`}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faBan}
                          className="hotelInfo_Icon"
                        />
                        {"Non-refundable"}
                      </>
                    )}
                  </div>
                </div>
                <div className="hotelInfo_Inclusions">
                  {room.Inclusion.length > 0
                    ? room.Inclusion.map((inclusion, ind) => {
                        return <span key={`ind_${ind}`}>{inclusion}</span>;
                      })
                    : null}
                </div>
              </div>
            );
          })}
      </div>
      <div className="flightResults-price">
        Total Price: <FontAwesomeIcon icon={faIndianRupeeSign} />
        {`${Math.ceil(data.data.hotelTotalPrice).toLocaleString("en-IN")}`}
      </div>
    </div>
   { trav?.map((t, i) => {
                      return (
                        <TravDetails
                          type={"Adult"}
                          index={i + 1}
                          trav={t}
                          key={`i__${i + 1}`}
                        />
                      );
                    })}
   </>
  );
};

export default HDetailsCard;
