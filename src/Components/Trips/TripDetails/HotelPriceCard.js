import {
  faBan,
  faCheckCircle,
  faIndianRupeeSign,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import MyContext from "../../Context";

const HotelPriceCard = ({
  selectedRoom,
  hotelFinalPrice,
  hotelTotalPrice,
  hotelData,
}) => {
  const { actions } = useContext(MyContext);
  return (
    <div className="tripsPage-totalPrice-Desktop">
      <div className="tripsPage-totalPrice-section">
        {selectedRoom?.map((room, r) => {
          return (
            <div
              className={
                selectedRoom[selectedRoom] &&
                selectedRoom[selectedRoom].RoomTypeCode === room?.RoomTypeCode
                  ? "tripsPage-roomDtls-room tripsPage-roomDtls-room-selected"
                  : "tripsPage-roomDtls-room"
              }
              onClick={() => actions.selectHotelRoomType(room, selectedRoom, r)}
              key={`r_${r+1}`}
            >
              <div className="tripsPage-roomDtls-room-titleSection">
                <div className="tripsPage-roomDtls-room-type">
                  {room.RoomTypeName}
                </div>

                <div className="tripsPage-roomDtls-room-price">
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="tripsPage-roomDtls-room-price-icon"
                  />

                  {`${
                    room.Price.OfferedPriceRoundedOff
                      ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                          "en-IN"
                        )
                      : room.Price.PublishedPriceRoundedOff.toLocaleString(
                          "en-IN"
                        )
                  }`}
                </div>
              </div>
              <div className="tripsPage-roomDtls-room-otherSection">
                <div className="tripsPage-roomDtls-room-meals">
                  <FontAwesomeIcon
                    icon={faUtensils}
                    className="tripsPage-roomDtls-room-meals-icon"
                  />
                  {room.Inclusion && room.Inclusion.length > 0
                    ? actions.checkForTboMeals(room.Inclusion)
                    : "No meals"}
                </div>
                <div className="tripsPage-roomDtls-room-cancel">
                  {room.LastCancellationDate &&
                  actions.validCancelDate(room.LastCancellationDate) ? (
                    <>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="tripsPage-roomDtls-room-cancel-icon"
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
                        className="tripsPage-roomDtls-room-cancel-icon"
                      />
                      {"Non-refundable"}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="tripsPage-totalPrice">
          <div className="tripsPage-totalPrice-title">Room price:</div>
          <div className="tripsPage-totalPrice-price">
            <FontAwesomeIcon
              icon={faIndianRupeeSign}
              className="tripsPage-totalPrice-price-icon"
            />
            {`${Math.ceil(hotelData?.data?.hotelFinalPrice)} `}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center my-1">
        <div className="flightBook-fare-fareItem-title">Service Charges</div>
        <div className="flightBook-fare-fareItem-value">
          {"+ "}
          <FontAwesomeIcon
            icon={faIndianRupeeSign}
            className="flightBook-fare-fareItem-value-icon"
          />
          {Math.ceil(hotelData?.data?.hotelServiceCharge)}
        </div>
      </div>
      <div className="flex justify-between items-center my-1">
        <div className="flightBook-fare-fareItem-title !text-[13px]">GST</div>
        <div className="flightBook-fare-fareItem-value !text-[13px]">
          {"+ "}
          <FontAwesomeIcon
            icon={faIndianRupeeSign}
            className="flightBook-fare-fareItem-value-icon"
          />
          {Math.ceil(hotelData?.data?.calculateGstFromService)}
        </div>
      </div>
      <div className="tripsPage-totalPrice-sections">
        <div className="tripsPage-totalPrice-title">Total price:</div>
        <div className="tripsPage-totalPrice-price">
          <FontAwesomeIcon
            icon={faIndianRupeeSign}
            className="tripsPage-totalPrice-price-icon"
          />
          {`${Math.ceil(hotelData?.data?.hotelTotalPrice).toLocaleString(
            "en-IN"
          )} `}
        </div>
      </div>
    </div>
  );
};

export default HotelPriceCard;
