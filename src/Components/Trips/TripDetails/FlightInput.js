import React, { useContext, useEffect, useState } from "react";
// import MyContext from "../../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import MyContext from "../../Context";
import { Button } from "react-bootstrap";

const FlightInput = ({
  flight,
  userDetails,
  s,
  travIndex,
  tripData,
  // travellerDetails,
  // handleInputChange,
  isEdit,
  travellerType,
  isInternational,
  travelId,
  paramId,
  travellerCount,
}) => {
  const { actions, userAccountDetails } = useContext(MyContext);
  const [travellerDetails, setTravellerDetails] = useState(userDetails);
  const [saveDetailsError, setSaveDetailsError] = useState([]);
  const [NoFormErrors, setNoformErrors] = useState();
  console.log(travellerDetails, travelId, paramId, tripData);
  useEffect(() => {
    // setTravellerDetails(tripData.data.travellerDetails[tripId]);
    setTravellerDetails(() => userDetails);
    // validateUser();
  }, [userDetails]);
  const validateUser = () => {
    const errors = travellerDetails.map((field) => ({
      firstName: !field.firstName ? "firstName is required" : "",
      lastName: !field.lastName ? "lastName is required" : "",
      passportIssueDate: !field.passportIssueDate
        ? "Passport issue date is required"
        : "",
      passportExpiryDate: !field.passportExpiryDate
        ? "Passport expiry date is required"
        : "",
      passportNumber: !field.passportNumber
        ? "Passport number date is required"
        : "",
      passportIssueCountry: !field.passportIssueCountry
        ? "Passport issue country date is required"
        : "",
    }));
    console.log(errors);
    setSaveDetailsError(errors);
    setNoformErrors(
      errors.every((error) => !error.firstName && !error.lastName)
    );
    return errors.every((error) => !error.firstName && !error.lastName);
  };
  const handleInputChange = (index, key, value) => {
    setTravellerDetails((prevUserDetails) => {
      const updatedUserDetails = [...prevUserDetails];
      const traveler = updatedUserDetails[index] || {};
      traveler[key] = value;
      updatedUserDetails[index] = traveler;
      return updatedUserDetails;
    });
  };

  const handleSubmitTravellerDetails = async () => {
    console.log(validateUser());
    console.log(travellerDetails);
    if (validateUser()) {
      await actions.updateTravDetails(
        {
          [travelId]: travellerDetails,
        },
        paramId
      );
    }
  };
  return (
    <>
      {tripData?.flights
        ?.filter((flight) => flight.id === travelId)
        ?.map((flight) => {
          const date1 = new Date(
            flight.data.flight.Segments[0][0].Origin.DepTime
          );

          const monthAbbreviation1 = date1.toLocaleString("default", {
            month: "short",
          });
          var flightReq = tripData.data.flights.filter((hotelMain) => {
            return hotelMain.id === flight.id;
          })[0];
          var flightStatus = tripData.data.flights.filter(
            (f) => f.id === flight.id
          )[0];

          const day1 = date1.getDate();
          let adultCount = 0;
          let childCount = 0;
          let infantCount = 0;
          return (
            <>
              <div className="tripDetails-trip-type">
                <span>Flight:&nbsp;</span>
                <span>
                  {flight.data.flightNew.segments[0].mainFlgtCode}
                  ,&nbsp;
                </span>
                <span>
                  {flight.data.flightNew.segments[0].originAirportCode}
                  &nbsp;
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="flightResults-nav-item-icon"
                  />{" "}
                  {flight.data.flightNew.segments[0].destAirportCode}
                  ,&nbsp;
                </span>
                <span className="tripDetails-trip-date">
                  &nbsp;{monthAbbreviation1} {day1}
                </span>
              </div>
              {travellerDetails &&
                travellerDetails.map((traveller, s) => {
                  let type;
                  let indexe;

                  if (adultCount < travellerCount.adults) {
                    type = "Adult";
                    indexe = adultCount++;
                  } else if (childCount < travellerCount.child) {
                    type = "Child";
                    indexe = childCount++;
                  } else if (infantCount < travellerCount.infant) {
                    type = "Infant";
                    indexe = infantCount++;
                  }

                  var isInternational =
                    flight.data.flightNew.segments[0].destCountryCode !==
                      "IN" ||
                    flight.data.flightNew.segments[0].originCountryCode !==
                      "IN";

                  return (
                    <>
                      <div className="tripDetails-traveller-box">
                        <span>
                          {type} {indexe + 1}{" "}
                        </span>
                        <div className="tripDetails-traveller-details">
                          <div>
                            <input
                              type="text"
                              placeholder="First name"
                              // value={
                              //   tripData?.data?.travellerDetails &&
                              //   tripData?.data?.travellerDetails[flight.id]
                              //     ? tripData?.data?.travellerDetails[flight.id][s].firstName
                              //     : travellerDetails[flight.id]
                              //     ? travellerDetails[flight.id][s]?.firstName
                              //     : userDetails[s]?.firstName
                              //     ? userDetails[s].firstName
                              //     : ""}
                              value={traveller.firstName}
                              // disabled={
                              //   tripData?.data?.travellerDetails &&
                              //   tripData?.data?.travellerDetails[flight.id]
                              //     ? tripData?.data?.travellerDetails[flight.id][s].firstName
                              //     : isEdit[flight.id]
                              // }
                              disabled={NoFormErrors}
                              onChange={(e) =>
                                handleInputChange(
                                  s,
                                  "firstName",
                                  e.target.value,
                                  traveller.type
                                )
                              }
                              // className={isEdit[flight.id] ? "active" : ""}
                              required
                            />
                            {saveDetailsError[s]?.firstName && (
                              <p className="text-red-500 text-[10px] pl-1">
                                {saveDetailsError[s]?.firstName}
                              </p>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Last name"
                              // value={
                              //   tripData?.data?.travellerDetails &&
                              //   tripData?.data?.travellerDetails[flight.id]
                              //     ? tripData?.data?.travellerDetails[flight.id][s].lastName
                              //     : travellerDetails[flight.id]
                              //     ? travellerDetails[flight.id][s]?.lastName
                              //     : userDetails[s]?.lastName
                              //     ? userDetails[s].lastName
                              //     : ""
                              // }
                              value={traveller.lastName}
                              // disabled={
                              //   tripData?.data?.travellerDetails &&
                              //   tripData?.data?.travellerDetails[flight.id]
                              //     ? tripData?.data?.travellerDetails[flight.id][s].lastName
                              //     : isEdit[flight.id]
                              // }
                              disabled={NoFormErrors}
                              onChange={(e) =>
                                handleInputChange(
                                  s,
                                  "lastName",
                                  e.target.value,
                                  traveller.type
                                )
                              }
                              // className={isEdit[flight.id] ? "active" : ""}
                              required
                            />
                            {saveDetailsError[s]?.lastName && (
                              <p className="text-red-500 text-[10px] pl-1">
                                {saveDetailsError[s]?.lastName}
                              </p>
                            )}
                          </div>

                          {s === 0 ? (
                            <>
                              <input
                                type="email"
                                placeholder="Email"
                                // value={
                                //   tripData?.data?.travellerDetails &&
                                //   tripData?.data?.travellerDetails[flight.id]
                                //     ? tripData?.data?.travellerDetails[flight.id][s].email
                                //     : userDetails[0]?.email
                                //     ? userDetails[0].email
                                //     : travellerDetails[flight.id]
                                //     ? travellerDetails[flight.id][s]?.email
                                //     : ""
                                // }
                                // disabled={
                                //   tripData?.data?.travellerDetails &&
                                //   tripData?.data?.travellerDetails[flight.id]
                                //     ? tripData?.data?.travellerDetails[flight.id][s].email
                                //     : isEdit[flight.id]
                                // }
                                value={traveller.email}
                                onChange={(e) =>
                                  handleInputChange(
                                    s,
                                    "email",
                                    e.target.value,
                                    traveller.type
                                  )
                                }
                                // className={isEdit[flight.id] ? "active" : ""}
                                required
                              />
                              <input
                                type="text"
                                placeholder="Mobile Number"
                                // value={
                                //   tripData?.data?.travellerDetails &&
                                //   tripData?.data?.travellerDetails[flight.id]
                                //     ? tripData?.data?.travellerDetails[flight.id][s]
                                //         .mobileNumber
                                //     : userDetails[0]?.mobileNumber
                                //     ? userDetails[0].mobileNumber
                                //     : travellerDetails[flight.id]
                                //     ? travellerDetails[flight.id][s]?.mobileNumber
                                //     : ""
                                // }
                                // disabled={
                                //   tripData?.data?.travellerDetails &&
                                //   tripData?.data?.travellerDetails[flight.id]
                                //     ? tripData?.data?.travellerDetails[flight.id][s]
                                //         .mobileNumber
                                //     : isEdit[flight.id]
                                // }
                                value={traveller.mobileNumber}
                                onChange={(e) =>
                                  handleInputChange(
                                    s,
                                    "mobileNumber",
                                    e.target.value,
                                    traveller.type
                                  )
                                }
                                // className={isEdit[flight.id] ? "active" : ""}
                                required
                              />
                              <div>
                                {s === 0 ? (
                                  <div className="tripDetails-traveller-box !w-[20vw]">
                                    <span className="company">
                                      Company Details{" "}
                                    </span>
                                    <div className="tripDetails-company-details">
                                      <div>
                                        Company Name:
                                        <span>
                                          {userAccountDetails?.companyName}
                                        </span>
                                      </div>
                                      <div>
                                        Company GST No:
                                        <span>{userAccountDetails?.GSTNo}</span>
                                      </div>
                                      <div>
                                        Company PAN No
                                        <span>{userAccountDetails?.PANNo}</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </>
                          ) : null}
                          {isInternational && (
                            <>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Passport Number"
                                  // value={
                                  //   tripData?.data?.travellerDetails &&
                                  //   tripData?.data?.travellerDetails[flight.id]
                                  //     ? tripData?.data?.travellerDetails[flight.id][s]
                                  //         .passportNumber
                                  //     : userDetails[s]?.passportNumber
                                  //     ? userDetails[s].passportNumber
                                  //     : travellerDetails[flight.id]
                                  //     ? travellerDetails[flight.id][s]?.passportNumber
                                  //     : ""
                                  // }
                                  // disabled={
                                  //   tripData?.data?.travellerDetails &&
                                  //   tripData?.data?.travellerDetails[flight.id]
                                  //     ? tripData?.data?.travellerDetails[flight.id][s]
                                  //         .passportNumber
                                  //     : isEdit[flight.id]
                                  // }
                                  onChange={(e) =>
                                    handleInputChange(
                                      s,
                                      "passportNumber",
                                      e.target.value,
                                      traveller.type
                                    )
                                  }
                                  // className={isEdit[flight.id] ? "active" : ""}
                                  required
                                />
                                {saveDetailsError[s]?.passportNumber && (
                                  <p className="text-red-500 text-[10px] pl-1">
                                    {saveDetailsError[s]?.passportNumber}
                                  </p>
                                )}
                              </div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Passport Issue Country"
                                  // value={
                                  //   tripData?.data?.travellerDetails &&
                                  //   tripData?.data?.travellerDetails[flight.id]
                                  //     ? tripData?.data?.travellerDetails[flight.id][s]
                                  //         .passportCountry
                                  //     : userDetails[s]?.passportCountry
                                  //     ? userDetails[s].passportCountry
                                  //     : travellerDetails[flight.id]
                                  //     ? travellerDetails[flight.id][s]?.passportCountry
                                  //     : ""
                                  // }
                                  // disabled={
                                  //   tripData?.data?.travellerDetails &&
                                  //   tripData?.data?.travellerDetails[flight.id]
                                  //     ? tripData?.data?.travellerDetails[flight.id][s]
                                  //         .passportCountry
                                  //     : isEdit[flight.id]
                                  // }
                                  onChange={(e) =>
                                    handleInputChange(
                                      s,
                                      "passportCountry",
                                      e.target.value,
                                      traveller.type
                                    )
                                  }
                                  // className={isEdit[flight.id] ? "active" : ""}
                                  required
                                />
                                {saveDetailsError[s]?.passportIssueCountry && (
                                  <p className="text-red-500 text-[10px] pl-1">
                                    {saveDetailsError[s]?.passportIssueCountry}
                                  </p>
                                )}
                              </div>
                              <div>
                                <input
                                  type="date"
                                  // value={
                                  //   tripData?.data?.travellerDetails &&
                                  //   tripData?.data?.travellerDetails[flight.id]
                                  //     ? new Date(
                                  //         tripData?.data?.travellerDetails[flight.id][
                                  //           s
                                  //         ].passportIssueDate
                                  //       )
                                  //         .toISOString()
                                  //         .split("T")[0]
                                  //     : userDetails[s]?.passportIssueDate
                                  //     ? new Date(userDetails[s].passportIssueDate)
                                  //         .toISOString()
                                  //         .split("T")[0]
                                  //     : travellerDetails[flight.id]
                                  //     ? new Date(
                                  //         travellerDetails[flight.id][s]?.passportIssueDate
                                  //       )
                                  //         .toISOString()
                                  //         .split("T")[0]
                                  //     : new Date().toISOString().split("T")[0]
                                  // }
                                  // disabled={
                                  //   tripData?.data?.travellerDetails &&
                                  //   tripData?.data?.travellerDetails[flight.id]
                                  //     ? tripData?.data?.travellerDetails[flight.id][s]
                                  //         .passportIssueDate
                                  //     : isEdit[flight.id]
                                  // }
                                  onChange={(e) =>
                                    handleInputChange(
                                      s,
                                      "passportIssueDate",
                                      e.target.valueAsNumber,
                                      traveller.type
                                    )
                                  }
                                  // className={isEdit[flight.id] ? "active" : ""}
                                  placeholder="Passport Issue Date"
                                  required
                                />
                                {saveDetailsError[s]?.passportIssueDate && (
                                  <p className="text-red-500 text-[10px] pl-1">
                                    {saveDetailsError[s]?.passportIssueDate}
                                  </p>
                                )}
                              </div>
                              <div>
                                <input
                                  type="date"
                                  // value={
                                  //   tripData?.data?.travellerDetails &&
                                  //   tripData?.data?.travellerDetails[flight.id]
                                  //     ? new Date(
                                  //         tripData?.data?.travellerDetails[flight.id][
                                  //           s
                                  //         ].passportExpiryDate
                                  //       )
                                  //         .toISOString()
                                  //         .split("T")[0]
                                  //     : userDetails[s]?.passportExpiryDate
                                  //     ? new Date(userDetails[s].passportExpiryDate)
                                  //         .toISOString()
                                  //         .split("T")[0]
                                  //     : travellerDetails[flight.id]
                                  //     ? new Date(
                                  //         travellerDetails[flight.id][s]?.passportExpiryDate
                                  //       )
                                  //         .toISOString()
                                  //         .split("T")[0]
                                  //     : new Date().toISOString().split("T")[0]
                                  // }
                                  // disabled={
                                  //   tripData?.data?.travellerDetails &&
                                  //   tripData?.data?.travellerDetails[flight.id]
                                  //     ? tripData?.data?.travellerDetails[flight.id][s]
                                  //         .passportExpiryDate
                                  //     : isEdit[flight.id]
                                  // }
                                  onChange={(e) =>
                                    handleInputChange(
                                      s,
                                      "passportExpiryDate",
                                      e.target.valueAsNumber,
                                      traveller.type
                                    )
                                  }
                                  // className={isEdit[flight.id] ? "active" : ""}
                                  placeholder="Passport Expiry Date"
                                  required
                                />
                                {saveDetailsError[s]?.passportExpiryDate && (
                                  <p className="text-red-500 text-[10px] pl-1">
                                    {saveDetailsError[s]?.passportExpiryDate}
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })}
              {/* {flightStatus?.requestStatus === "Not Requested" ||
              flightStatus?.status === "Not Submitted" ? (
                <div className="tripDetails-submit">
                  {isEdit[flight.id] ? (
                    <button
                      className="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEdit({
                          ...isEdit,
                          [flight.id]: !isEdit[flight.id],
                        });
                        setUserDetails(travellerDetails[flight.id]);
                      }}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        setIsEdit({
                          ...isEdit,
                          [flight.id]: true,
                        });
                        setFlightTravError(false);
                        await setFinalDetails(
                          flight.id,
                          travellerCount.adults +
                            travellerCount.child +
                            travellerCount.infant,
                          "flights"
                        );
                      }}
                    >
                      Save Details
                    </button>
                  )}
                </div>
              ) : null} */}
              {/* {flightTravError && (
                <div className="alerted">Please fill all the details</div>
              )} */}
              {NoFormErrors ? (
                <Button
                  onClick={() => setNoformErrors(false)}
                  size="sm"
                  className="bg-black mt-4"
                >
                  Edit
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitTravellerDetails}
                  size="sm"
                  className="bg-black mt-4"
                >
                  Save Details
                </Button>
              )}
            </>
          );
        })}
    </>
  );
};
export default FlightInput;
