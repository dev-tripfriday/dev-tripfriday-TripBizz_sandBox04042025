import React, { useContext, useState } from "react";
import "./Profile.css";
import Navbar from "../../Flights/FlightSearch/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import MyContext from "../../Context";

const Profile = () => {
  var { actions, userAccountDetails } = useContext(MyContext);
  var [edit, setEdit] = useState(true);
  var [userData, setUserData] = useState({
    firstName: userAccountDetails?.firstName,
    lastName: userAccountDetails?.lastName,
    mobileNumber: userAccountDetails?.mobileNumber,
    passportNumber: userAccountDetails?.passportNumber,
    aadharCard: userAccountDetails?.aadharCard,
    passport: userAccountDetails?.passport,
    GSTNo: userAccountDetails?.GSTNo,
    PANNo: userAccountDetails?.PANNo,
    companyName: userAccountDetails?.companyName,
  });
  const setData = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };
  var handleDownloadUrl = async (downloadUrl, name) => {
    var downloadName = name;
    const response = await fetch(downloadUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  var updateData = async () => {
    var data = await actions.updateUserProfile(
      userAccountDetails.userid,
      userData
    );
    setUserData({
      firstName: data?.firstName,
      lastName: data?.lastName,
      mobileNumber: data?.mobileNumber,
      passportNumber: data?.passportNumber,
      aadharCard: data?.aadharCard,
      passport: data?.passport,
      GSTNo: data?.GSTNo,
      PANNo: data?.PANNo,
      companyName: data?.companyName,
    });
    setEdit(!edit);
  };

  return (
    <>
      <Navbar />
      <div className="userProfile-container">
        <div className="userProfile-header">Profile</div>
        <div className="userProfile-body">
          <div className="flex justify-end items-center gap-2 md:gap-5 flex-wrap">
            <div className="userProfile-edit d-flex gap-10">
              <div className="userProfile-approval">
                <span
                  className={`font-bold p-2 rounded-[0.8rem] text-white ${
                    userAccountDetails.accountType === "PrePaid"
                      ? "bg-[#4CAF50]"
                      : "bg-[#9C27B0]"
                  }`}
                >
                  {userAccountDetails.accountType}
                </span>
              </div>
              <div className="userProfile-account !text-[12px] md:!text-[16px]">
                Approval Type:{" "}
                <span className="font-bold py-2 rounded-[0.8rem]">
                  {userAccountDetails.approvalType}
                </span>{" "}
                for booking
              </div>
            </div>
            <div className="userProfile-edit">
              <button
                onClick={() => {
                  setEdit(!edit);
                }}
              >
                Update &nbsp;
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            </div>
          </div>
          <div className="userProfile-header-details">Login Details</div>
          <div className="userProfile-data">
            <div className="userProfile-data-section-email">
              Email:&nbsp;&nbsp;
              <div className="userProfile-type-input">
                {userAccountDetails?.email}
              </div>
            </div>
          </div>
          <div className="userProfile-header-details">Personal Info</div>
          <div className="userProfile-data">
            <div className="userProfile-data-section">
              First Name :
              <div className="userProfile-type-input">
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  name="firstName"
                  value={userData.firstName}
                  onChange={(e) => setData(e)}
                  readOnly={edit}
                  style={{ padding: edit ? "3pt" : "" }}
                />
              </div>
            </div>
            <div className="userProfile-data-section">
              Last Name :
              <div className="userProfile-type-input">
                <input
                  type="text"
                  placeholder="Enter your last name"
                  name="lastName"
                  value={userData.lastName}
                  onChange={(e) => setData(e)}
                  readOnly={edit}
                  style={{ padding: edit ? "3pt" : "" }}
                />
              </div>
            </div>
          </div>
          <div className="userProfile-data">
            <div className="userProfile-data-section">
              Mobile :
              <div className="userProfile-type-input">
                <input
                  type="text"
                  placeholder="Enter your mobile number"
                  name="mobileNumber"
                  value={userData.mobileNumber}
                  onChange={(e) => setData(e)}
                  readOnly={edit}
                  style={{ padding: edit ? "3pt" : "" }}
                />
              </div>
            </div>
            <div className="userProfile-data-section">
              Passport Number :
              <div className="userProfile-type-input">
                <input
                  type="text"
                  placeholder="Enter your passport number"
                  name="passportNumber"
                  value={userData.passportNumber}
                  onChange={(e) => setData(e)}
                  readOnly={edit}
                  style={{ padding: edit ? "3pt" : "" }}
                />
              </div>
            </div>
          </div>
          <div className="userProfile-data">
            <div className="userProfile-data-section">
              Passport
              {!userAccountDetails.passport ? (
                <>
                  {!edit ? (
                    <div className="userProfile-type-input">
                      <input
                        type="file"
                        name="passport"
                        readOnly={edit}
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            [e.target.name]: e.target.files[0],
                          });
                        }}
                        style={{ padding: edit ? "3pt" : "" }}
                      />
                    </div>
                  ) : (
                    <div className="userProfile-type-input">
                      No passport Added
                    </div>
                  )}
                </>
              ) : (
                <>
                  {!edit ? (
                    <div className="userProfile-type-input">
                      <input
                        type="file"
                        name="passport"
                        readOnly={edit}
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            [e.target.name]: e.target.files[0],
                          });
                        }}
                      />
                    </div>
                  ) : (
                    <div className="userProfile-type-link">
                      <span
                        onClick={() => {
                          handleDownloadUrl(userData.passport, "passport");
                        }}
                      >
                        {userData.passport.slice(
                          120,
                          userAccountDetails?.passport?.indexOf("?")
                        )}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="userProfile-data-section">
              Aadhar Card
              {!userAccountDetails.aadharCard ? (
                <>
                  {!edit ? (
                    <div className="userProfile-type-input">
                      <input
                        type="file"
                        name="aadharCard"
                        readOnly={edit}
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            [e.target.name]: e.target.files[0],
                          });
                        }}
                        style={{ padding: edit ? "3pt" : "" }}
                      />
                    </div>
                  ) : (
                    <div className="userProfile-type-input">
                      No AadharCard Added
                    </div>
                  )}
                </>
              ) : (
                <>
                  {!edit ? (
                    <div className="userProfile-type-input">
                      <input
                        type="file"
                        name="aadharCard"
                        readOnly={edit}
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            [e.target.name]: e.target.files[0],
                          });
                        }}
                        style={{ padding: edit ? "3pt" : "" }}
                      />
                    </div>
                  ) : (
                    <div className="userProfile-type-link">
                      <span
                        onClick={() => {
                          handleDownloadUrl(userData.aadharCard, "aadharCard");
                        }}
                      >
                        {userData.aadharCard.slice(
                          118,
                          userAccountDetails?.aadharCard?.indexOf("?")
                        )}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="userProfile-header-details">Company Info</div>
          <div className="userProfile-data">
            <div className="userProfile-data-section">
              Company GST No :
              <div className="userProfile-type-input">
                <input
                  type="text"
                  placeholder="Enter your company GST no"
                  name="GSTNo"
                  value={userData.GSTNo}
                  onChange={(e) => setData(e)}
                  readOnly={edit}
                  style={{ padding: edit ? "3pt" : "" }}
                />
              </div>
            </div>
            <div className="userProfile-data-section">
              Company PAN Number :
              <div className="userProfile-type-input">
                <input
                  type="text"
                  placeholder="Enter your compant PAN number"
                  name="PANNo"
                  value={userData.PANNo}
                  onChange={(e) => setData(e)}
                  readOnly={edit}
                  style={{ padding: edit ? "3pt" : "" }}
                />
              </div>
            </div>
          </div>
          <div className="userProfile-data">
            <div className="userProfile-data-section">
              Company Name :
              <div className="userProfile-type-input">
                <input
                  type="text"
                  placeholder="Enter your company name"
                  name="companyName"
                  value={userData.companyName}
                  onChange={(e) => {
                    setData(e);
                    console.log("callued");
                  }}
                  readOnly={edit}
                  style={{ padding: edit ? "3pt" : "" }}
                />
              </div>
            </div>
          </div>
          <div className="userProfile-submit">
            {!edit ? (
              <div className="userProfile-submit-btns">
                <button onClick={updateData}>Update</button>
                <button
                  onClick={() => {
                    setEdit(!edit);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
