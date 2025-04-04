import {
  faBan,
  faCheckCircle,
  faIndianRupeeSign,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import MyContext from "../../Context";
import "./TripDetails.css";

const HotelCard = (props) => {
  const { hotel, formattedDate1, endDate, adults } = props;
  const { actions } = useContext(MyContext);

  return (
    <div className="tripDetails-hotel-card">
      <div className="tripDetails-hotel-details">
        <div className="tripDetails-hotel-name">
          {hotel.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName}
        </div>
        <div className="tripDetails-hotel-people">
          Adults-{adults.adults} Child-{adults.child}
        </div>
        <div className="tripDetails-hotel-date">
          <span>
            {formattedDate1}-{endDate}
          </span>{" "}
          ({hotel.data.hotelSearchQuery.hotelNights} Nights)
        </div>
      </div>
      {hotel?.data?.selectedRoomType &&
        hotel?.data?.selectedRoomType.map((room, f) => {
          return (
            <div className="tripDetails-roomDtls-room">
              <div className="tripDetails-roomDtls-room-titleSection">
                <div className="tripDetails-roomDtls-room-type">
                  {room.RoomTypeName}
                </div>
              </div>
              <div className="tripDetails-roomDtls-room-otherSection">
                <div className="tripDetails-roomDtls-room-meals">
                  <FontAwesomeIcon
                    icon={faUtensils}
                    className="tripDetails-roomDtls-room-meals-icon"
                  />
                  {room.Inclusion && room.Inclusion.length > 0
                    ? actions.checkForTboMeals(room.Inclusion)
                    : "No meals"}
                </div>
                <div className="tripDetails-roomDtls-room-cancel">
                  {room.LastCancellationDate &&
                  actions.validCancelDate(room.LastCancellationDate) ? (
                    <>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="tripDetails-roomDtls-room-cancel-icon"
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
                        className="tripDetails-roomDtls-room-cancel-icon"
                      />
                      {"Non-refundable"}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      <div className="tripDetails-total-price">
        &nbsp;
        <FontAwesomeIcon
          icon={faIndianRupeeSign}
          className="tripDetails-flight-flightCard-price-icon"
        />
        {`${Math.ceil(hotel?.data?.hotelTotalPrice)?.toLocaleString("en-IN")}`}
      </div>
    </div>
  );
};

export default HotelCard;
