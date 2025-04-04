import React, { useContext, useEffect } from "react";
// import seatImage from "../../Home/assets/busSeatingI (1).png";
import seatImage from "../../Home/assets/busSeatingI (1).png";
import sleeperBed from "../../Home/assets/sleeperbed.png";
import { PiDeviceMobileSpeaker } from "react-icons/pi";
import sitterSelected from "../../Home/assets/sitterSelected.png";
import seatImageSelected from "../../Home/assets/selectedSeat.png";
import sleeperBedBooked from "../../Home/assets/sleeperselected.png";
import sleeperBedSelected from "../../Home/assets/sleeperBedSelected.png";
import MyContext from "../../Context";
const BusSeatLayout = ({ deck }) => {
  const {
    bookingBus,
    fetchingBusSeat,
    actions,
    adminUserId,
    selectedTripId,
    selectedTrip,
    userTripStatus,
    userId,
    adminUserTrips,
    busDate,
    destDetails,
    NoofBusPassengers,
    BusOperatorName,
    busService,
    selectedSeats,
  } = useContext(MyContext);
  const getIconDetails = (seat, isSelected) => {
    if (!seat.SeatStatus) {
      return seat.SeatType === 1 ? (
        <img
          src={sitterSelected}
          style={{
            width: 30 * seat.Width,
            height: 45 * seat.Height,
            objectFit: "contain",
          }}
        />
      ) : (
        <img
          src={sleeperBedBooked}
          style={{
            width: 20 * seat.Width,
            height: 30 * seat.Height,
            objectFit: "contain",
          }}
        />
      );
    }
    //   else if (seat.IsLadiesSeat && seat.SeatType === 2) {
    //     return { iconName: "female", componentName: "FontAwesome", color: "purple" };
    //   }
    //    else if (seat.IsLadiesSeat) {
    //     return { iconName: "female", componentName: "FontAwesome", color: "pink" };
    //   }
    //   else if (seat.IsMalesSeat) {
    //     return { iconName: "male", componentName: "FontAwesome", color: "blue" };
    //   }
    else if (seat.SeatType === 2) {
      return (
        <img
          src={isSelected ? sleeperBedSelected : sleeperBed}
          style={{
            width: 20 * seat.Width,
            height: 30 * seat.Height,
            objectFit: "contain",
          }}
        />
      );
    } else if (seat.Width === 2) {
      return (
        <img
          src={isSelected ? sleeperBedSelected : sleeperBed}
          style={{
            width: 20 * seat.Width,
            height: 30 * seat.Height,
            objectFit: "contain",
          }}
        />
      );
    } else {
      return (
        <img
          src={isSelected ? seatImageSelected : seatImage}
          style={{
            width: 30 * seat.Width,
            height: 45 * seat.Height,
            objectFit: "contain",
          }}
        />
      );
    }
  };
  const columnCount = Math.max(...deck.map((o) => parseInt(o.RowNo, 20)));
  useEffect(() => {
    actions.setBusBookDetails(selectedSeats, "seat");
  }, [selectedSeats]);
  return (
    <div style={{ backgroundColor: "whitesmoke" }}>
      {deck.map((item) => {
        const isSelected = selectedSeats.some(
          (s) =>
            s.RowNo === item.RowNo &&
            s.ColumnNo === item.ColumnNo &&
            s.IsUpper === item.IsUpper
        );
        console.log((columnCount - parseInt(item.RowNo, 10)) * 20.5);
        return (
          <div
            style={{
              // width: 35 * item.Width,
              // height: 35 * item.Height,
              // margin: 13,
              margin: 2,
              position: "absolute",
              left: (columnCount - parseInt(item.RowNo, 10)) * 30,
              top: parseInt(item.ColumnNo, 10) * 32,
            }}
            key={item.SeatName}
            onClick={() => actions.toggleSeatSelection(item)}
            disabled={!item.SeatStatus}
          >
            {getIconDetails(item, isSelected)}
          </div>
        );
      })}
    </div>
  );
};

export default BusSeatLayout;
