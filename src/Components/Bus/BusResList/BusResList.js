import React, { useContext } from "react";
import "./BusResList.css";
import MyContext from "../../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../Flights/FlightSearch/Navbar";
import Bus from "../Bus/Bus";
import LoadingProg from "../../Loading/LoadingProg";
import BusInfo from "../BusInfo/BusInfo";
import { TextField } from "@mui/material";

const BusResList = ({ userAdmin, addedFromAdmin }) => {
  const {
    actions,
    busResList,
    originDetails,
    destDetails,
    busDate,
    searchingBus,
    fetchingBusSeat,
    bookingBus,
    NoofBusPassengers,
    busDuration,
    busCost,
    resetBusDetails,
  } = useContext(MyContext);
  if (searchingBus) {
    return (
      <LoadingProg
        condition={searchingBus}
        loadingText={"Searching buses"}
        progEnd={searchingBus}
        progTime={25}
      />
      //<>Loading...</>
    );
  } else if (fetchingBusSeat || bookingBus) {
    return <BusInfo userAdmin={userAdmin} addedFromAdmin={addedFromAdmin} />;
  } else {
    return (
      <>
        <Navbar />
        <div className="busRes-header">
          <div className="busRes-header-destName">
            {originDetails.cityName} to {destDetails.cityName}
            <div className="busRes-header-destName-edit">
              <FontAwesomeIcon
                icon={faPencil}
                onClick={() => actions.backToBusSearchPage()}
              />
            </div>
          </div>
          <div className="busRes-header-destName">
            {new Date(busDate).toString().slice(4, 10)}
          </div>
          <div className="busRes-header-destName">
            {NoofBusPassengers} | Adults
          </div>
        </div>

        <div className="w-[95%] m-auto flex flex-col md:flex-row gap-[15px] h-[100%]">
          <div className="md:w-[25vw] w-[100%] shadow-lg rounded-[20px] mt-1 h-[100%]">
            <div className="flex justify-between mt-5 items-center w-[90%] m-auto">
              <h1 className="font-bold">Sort</h1>
              <h1
                className="font-bold cursor-pointer"
                onClick={() => actions.resetBusFilter()}
              >
                RESET
              </h1>
            </div>
            <div className="mt-[40px] pl-4">
              <div
                className="w-[90%] cursor-pointer"
                onClick={() => {
                  actions.setBusDuration(false);
                  actions.setBusCost(true);

                  actions.filterByPrice(resetBusDetails);
                  // actions.busFilter(busResList);
                }}
              >
                <p
                  className={
                    busCost
                      ? "border-[1.5px] border-solid border-[#001219] rounded-md pl-2 py-2 font-bold  text-[#fff] bg-black"
                      : "bg-white text-black border-[1.5px] pl-2 py-2  border-[#001219] rounded-md border-solid"
                  }
                >
                  Price
                  <span className="text-[10px] text-[#999797]">
                    (Low to Highest)
                  </span>
                </p>
              </div>

              <div
                className={"w-[90%] mt-2 cursor-pointer"}
                onClick={() => {
                  actions.setBusDuration(true);
                  actions.setBusCost(false);

                  actions.filterByDuration(resetBusDetails);
                  // actions.setBusCost(false);

                  // actions.busFilter(busResList);
                }}
              >
                <p
                  className={
                    busDuration
                      ? "border-[1.5px] border-solid border-[#001219] rounded-md pl-2 py-2 font-bold bg-black  text-[#fff]"
                      : "bg-white text-black border-[1.5px] pl-2 py-2  border-[#001219] rounded-md border-solid"
                  }
                >
                  Duration
                  <span className="text-[10px] text-[#999797]">
                    (Shortest to Longest)
                  </span>
                </p>
              </div>
              <h1 className="font-bold mt-[40px]">Operator</h1>
              <div className="flex items-center gap-2">
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Operator"
                  className="mt-1 w-[90%]"
                  onChange={(e) => {
                    try {
                      actions.busSearchbyName(e.target.value, resetBusDetails);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-[100%] md:[65%] h-[100%]">
            {resetBusDetails?.length > 0 ? (
              <>
                {resetBusDetails?.map((bus) => {
                  return <Bus bus={bus} addedFromAdmin={addedFromAdmin} />;
                })}
              </>
            ) : (
              <div>No results</div>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default BusResList;
