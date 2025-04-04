import React, { useContext } from "react";
import MyContext from "../../Context";

const InputBox = ({
  flight,
  userDetails,
  s,
  travIndex,
  tripData,
  travellerDetails,
  handleInputChange,
  isEdit,
  travellerType,
  isInternational,
  flightStatus,
  status,
}) => {
  const { userAccountDetails } = useContext(MyContext);

  return (
    <>
      {/* <p>{status?.status}</p> */}
      <div className="tripDetails-traveller-box">
        <span>
          {travellerType} {travIndex + 1}{" "}
        </span>
        <div className="tripDetails-traveller-details">
          <select
            name="Gender"
            className="rounded-[5px] shadow-lg"
            value={
              tripData?.data?.travellerDetails &&
              tripData?.data?.travellerDetails[flight.id]
                ? tripData?.data?.travellerDetails[flight.id][s]?.gender
                : travellerDetails[flight.id]
                ? travellerDetails[flight.id][s]?.gender
                : userDetails[s]?.gender
                ? userDetails[s].gender
                : ""
            }
            disabled={
              tripData?.data?.travellerDetails &&
              tripData?.data?.travellerDetails[flight.id]
                ? tripData?.data?.travellerDetails[flight.id][s]?.gender
                : isEdit[flight.id]
            }
            onChange={(e) =>
              handleInputChange(s, "gender", e.target.value, travellerType)
            }
          >
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
            <option value="Mrs">Mrs</option>
          </select>
          <input
            type="text"
            placeholder="First name"
            value={
              tripData?.data?.travellerDetails &&
              tripData?.data?.travellerDetails[flight.id]
                ? tripData?.data?.travellerDetails[flight.id][s]?.firstName
                : travellerDetails[flight.id]
                ? travellerDetails[flight.id][s]?.firstName
                : userDetails[s]?.firstName
                ? userDetails[s].firstName
                : ""
            }
            // disabled={
            //   tripData?.data?.travellerDetails &&
            //   tripData?.data?.travellerDetails[flight.id]
            //     ? tripData?.data?.travellerDetails[flight.id][s]?.firstName
            //     : isEdit[flight.id]
            // }
            onChange={(e) =>
              handleInputChange(s, "firstName", e.target.value, travellerType)
            }
            className={isEdit[flight.id] ? "active" : ""}
            required
          />
          <input
            type="text"
            placeholder="Last name"
            value={
              tripData?.data?.travellerDetails &&
              tripData?.data?.travellerDetails[flight.id]
                ? tripData?.data?.travellerDetails[flight.id][s]?.lastName
                : travellerDetails[flight.id]
                ? travellerDetails[flight.id][s]?.lastName
                : userDetails[s]?.lastName
                ? userDetails[s].lastName
                : ""
            }
            // disabled={
            //   tripData?.data?.travellerDetails &&
            //   tripData?.data?.travellerDetails[flight.id]
            //     ? tripData?.data?.travellerDetails[flight.id][s]?.lastName
            //     : isEdit[flight.id]
            // }
            onChange={(e) =>
              handleInputChange(s, "lastName", e.target.value, travellerType)
            }
            className={isEdit[flight.id] ? "active" : ""}
            required
          />
          {s === 0 ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? tripData?.data?.travellerDetails[flight.id][s]?.email
                    : userDetails[0]?.email
                    ? userDetails[0].email
                    : travellerDetails[flight.id]
                    ? travellerDetails[flight.id][s]?.email
                    : ""
                }
                disabled={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? tripData?.data?.travellerDetails[flight.id][s]?.email
                    : isEdit[flight.id]
                }
                onChange={(e) =>
                  handleInputChange(s, "email", e.target.value, travellerType)
                }
                className={isEdit[flight.id] ? "active" : ""}
                required
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? tripData?.data?.travellerDetails[flight.id][s]
                        ?.mobileNumber
                    : userDetails[0]?.mobileNumber
                    ? userDetails[0].mobileNumber
                    : travellerDetails[flight.id]
                    ? travellerDetails[flight.id][s]?.mobileNumber
                    : ""
                }
                disabled={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? tripData?.data?.travellerDetails[flight.id][s]
                        ?.mobileNumber
                    : isEdit[flight.id]
                }
                onChange={(e) =>
                  handleInputChange(
                    s,
                    "mobileNumber",
                    e.target.value,
                    travellerType
                  )
                }
                className={isEdit[flight.id] ? "active" : ""}
                required
              />
            </>
          ) : null}
          {isInternational && (
            <>
              <input
                type="text"
                placeholder="Passport Number"
                value={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? tripData?.data?.travellerDetails[flight.id][s]
                        ?.passportNumber
                    : userDetails[s]?.passportNumber
                    ? userDetails[s].passportNumber
                    : travellerDetails[flight.id]
                    ? travellerDetails[flight.id][s]?.passportNumber
                    : ""
                }
                disabled={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? tripData?.data?.travellerDetails[flight.id][s]
                        ?.passportNumber
                    : isEdit[flight.id]
                }
                onChange={(e) =>
                  handleInputChange(
                    s,
                    "passportNumber",
                    e.target.value,
                    travellerType
                  )
                }
                className={isEdit[flight.id] ? "active" : ""}
                required
              />
              <input
                type="text"
                placeholder="Passport Issue Country"
                value={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? tripData?.data?.travellerDetails[flight.id][s]
                        ?.passportCountry
                    : userDetails[s]?.passportCountry
                    ? userDetails[s].passportCountry
                    : travellerDetails[flight.id]
                    ? travellerDetails[flight.id][s]?.passportCountry
                    : ""
                }
                disabled={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? tripData?.data?.travellerDetails[flight.id][s]
                        ?.passportCountry
                    : isEdit[flight.id]
                }
                onChange={(e) =>
                  handleInputChange(
                    s,
                    "passportCountry",
                    e.target.value,
                    travellerType
                  )
                }
                className={isEdit[flight.id] ? "active" : ""}
                required
              />
              <input
                type="date"
                value={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? new Date(
                        tripData?.data?.travellerDetails[flight.id][
                          s
                        ]?.passportIssueDate
                      )
                        .toISOString()
                        .split("T")[0]
                    : userDetails[s]?.passportIssueDate
                    ? new Date(userDetails[s]?.passportIssueDate)
                        .toISOString()
                        .split("T")[0]
                    : travellerDetails[flight.id]
                    ? new Date(
                        travellerDetails[flight.id][s]?.passportIssueDate
                      )
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                disabled={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? tripData?.data?.travellerDetails[flight.id][s]
                        ?.passportIssueDate
                    : isEdit[flight.id]
                }
                onChange={(e) =>
                  handleInputChange(
                    s,
                    "passportIssueDate",
                    e.target.valueAsNumber,
                    travellerType
                  )
                }
                className={isEdit[flight.id] ? "active" : ""}
                placeholder="Passport Issue Date"
                required
              />

              <input
                type="date"
                value={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? new Date(
                        tripData?.data?.travellerDetails[flight.id][
                          s
                        ]?.passportExpiryDate
                      )
                        .toISOString()
                        .split("T")[0]
                    : userDetails[s]?.passportExpiryDate
                    ? new Date(userDetails[s]?.passportExpiryDate)
                        .toISOString()
                        .split("T")[0]
                    : travellerDetails[flight.id]
                    ? new Date(
                        travellerDetails[flight.id][s]?.passportExpiryDate
                      )
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                disabled={
                  tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[flight.id]
                    ? tripData?.data?.travellerDetails[flight.id][s]
                        ?.passportExpiryDate
                    : isEdit[flight.id]
                }
                onChange={(e) =>
                  handleInputChange(
                    s,
                    "passportExpiryDate",
                    e.target.valueAsNumber,
                    travellerType
                  )
                }
                className={isEdit[flight.id] ? "active" : ""}
                placeholder="Passport Expiry Date"
                required
              />
            </>
          )}
        </div>
      </div>
      {s === 0 && travellerType === "Adult" ? (
        <div className="tripDetails-traveller-box">
          <span className="company">Company Details </span>
          <div className="tripDetails-company-details">
            <div>
              Company Name:<span>{userAccountDetails?.companyName}</span>
            </div>
            <div>
              Company GST No:<span>{userAccountDetails?.GSTNo}</span>
            </div>
            <div>
              Company PAN No<span>{userAccountDetails?.PANNo}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default InputBox;
