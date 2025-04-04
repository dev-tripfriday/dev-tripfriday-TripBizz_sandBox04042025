import React, { useContext } from "react";
import MyContext from "../../Context";
import Navbar from "../../Flights/FlightSearch/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import "./CabResList.css";
import Cab from "../Cab/Cab";

const CabResList = () => {

  const { cabResList, actions, cabCity, cabType, cabStartDate, cabEndDate, cabCount, selectedTime } = useContext(MyContext);


  return (
    <>
      {cabResList.length > 0 ? (
        <>
          <Navbar />
          <div className="cabRes-header">
            <div className="cabRes-header-destName">
              {cabCity}
              <div
                className="cabRes-header-destName-edit"
                onClick={async () => {
                  await actions.backToCabSearchPage();
                }}
              >
                <FontAwesomeIcon icon={faPencil} />
              </div>
            </div>
            <div className="cabRes-header-othrDtls">{`${cabStartDate
              .toString()
              .slice(4, 10)} ${cabEndDate ? '-' : ''} ${cabEndDate ? cabEndDate.toString().slice(4, 10) : ''} | Time: ${selectedTime ? selectedTime : ''} | ${cabType} | ${cabCount} ${cabCount > 1 ? "Cabs" : "Cab"
              }`}</div>
          </div>
          {
            cabResList.length > 0 ? (
              <>
                {
                  cabResList.map((cab) => {
                    return (
                      <Cab cab={cab} />
                    )
                  })
                }
              </>
            ) : (<div>
              No cabs found
            </div>)
          }
        </>
      ) : (
        <div>No cabs found</div>
      )}
    </>
  );
};

export default CabResList;
