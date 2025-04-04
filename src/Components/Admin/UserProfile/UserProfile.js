import React, { useContext, useEffect, useState } from "react";
import SideNav from "../SideNav/SideNav";
import { useNavigate, useParams } from "react-router-dom";
import MyContext from "../../Context";
import "./UserProfile.css";
import "../Users/Users.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faIndianRupeeSign,
  faMinus,
  faPlus,
  faEnvelope,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import LoadingProg from "../../Loading/LoadingProg";
import Popup from "../../Popup";
import { Pagination, Tab } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import BookedTrips from "../../Trips/MyTrips/BookedTrips";
import EmailandManual from "../EmailandManual/EmailandManual";
import { useForm } from "react-hook-form";
import { db } from "../../MyProvider";
import { ClipLoader } from "react-spinners";
const UserProfile = () => {
  const [mounted, setMounted] = useState(true);
  const [openBalance, setOpenBalance] = useState(false);
  const [details, setDetails] = useState(null);
  const [price, setPrice] = useState(0);
  const [openTransactions, setOpenTransactions] = useState(false);
  const [newTripPopup, setNewTripPopup] = useState(false);
  const [tripname, settripname] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [value, setValue] = React.useState(0);
  const [createUser, setCreateUser] = useState(false);
  const [signUpLoader, setSignUpLoader] = useState(false);
  const [userEmails, setUserEmails] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState();
  const {
    register,
    handleSubmit,
    setValue: setData,
    formState: { errors },
  } = useForm();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { actions, adminUserLoading, adminUserData } = useContext(MyContext);
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const TRIPS_PER_PAGE = 10;

  const getData = async (pageNum = 1) => {
    const result = await actions.getUserByIdAdmin(id, pageNum);
    setTotalPages(Math.ceil(result.totalTrips / TRIPS_PER_PAGE));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    getData(value);
  };

  const handleSubmitTrip = async () => {
    if (tripname === "") return;
    var newtripId = await actions.createTripFromAdmin(tripname, id);
    navigate(`trips/${newtripId}`);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const getAllUserEmail = async () => {
    try {
      const accountDocRef = db.collection("Accounts");
      let query = accountDocRef.where("role", "!=", "admin");
      const querySnapshot = await query.get();
      const userArray = [];

      querySnapshot.forEach((doc) => {
        userArray.push({ id: doc.id, data: doc.data().email });
      });
      setUserEmails(userArray);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCompanies = () => {
    const companiesCollection = db.collection("companies");
    companiesCollection.onSnapshot(
      (snapshot) => {
        const companiesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompanies(companiesList);
      },
      (error) => {
        console.error("Error fetching companies: ", error);
      }
    );
  };
  const handleAccountChange = async (e) => {
    setCompanyId(e.target.value);
    const companyRef = db.collection("companies").doc(e.target.value);
    const companyDoc = await companyRef.get();
    setData("companyName", companyDoc.data().companyName);
    setData(
      "companyAddress",
      companyDoc.data().companyaddress ?? "No Company Location"
    );
    setData("companyLocation", companyDoc.data().state ?? "No company State");
    setData("GSTNo", companyDoc.data().gst ?? "No Company GST Number");
    setData("PANNo", companyDoc.data().companyPan ?? "No Company PAN Number");
  };
  const fetchUserData = async () => {
    const userDocRef = db.collection("Accounts").doc(id);
    const userDoc = await userDocRef.get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      setData("firstName", userData.firstName);
      setData("lastName", userData.lastName);
      setData("mobileNumber", userData.mobileNumber);
      setData("countryCode", userData.countryCode);
      setData("gender", userData.gender);
      setData("accountType", userData.accountType);
      setData("approvalType", userData.approvalType);
      setData("companyName", userData.companyName);
      setData("companyAddress", userData.companyAddress);
      setData("companyLocation", userData.companyLocation);
      setData("GSTNo", userData.GSTNo);
      setData("PANNo", userData.PANNo);
      setData("approvalEmail", userData.email);
      setData("billingAccount", userData.billingAccount);
    }
  };
  useEffect(() => {
    if (mounted) {
      getData();
      getAllUserEmail();
      fetchCompanies();
      fetchUserData();
    }
    return () => {
      setMounted(false);
    };
  }, []);

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <div sx={{ p: 3 }}>{children}</div>}
      </div>
    );
  }

  const submitBtn = async (data) => {
    try {
      setSignUpLoader(true);
      await db.collection("Accounts").doc(id).update(data);
      setSignUpLoader(false);
      setCreateUser(false);
    } catch (error) {
      setSignUpLoader(false);
      console.log(error);
    }
  };
  if (adminUserLoading) {
    return (
      <LoadingProg
        condition={adminUserLoading}
        loadingText="Getting User Details..."
        progEnd={adminUserLoading}
        progTime={4}
      />
      // <>Loading..</>
    );
  }

  return (
    <>
      <Popup
        condition={openBalance}
        close={() => {
          setOpenBalance(false);
        }}
      >
        <div className="update-balance">
          <label>
            Add Money
            <input
              name="balance"
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </label>
          <label>
            Details
            <input
              name="balance"
              type="text"
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
              }}
            />
          </label>
          <button
            onClick={async () => {
              setOpenBalance(0);
              setOpenBalance(false);
              await actions.updateAdminBalance(id, price, details);
            }}
          >
            Add Money
          </button>
        </div>
      </Popup>
      <Popup
        condition={openTransactions}
        close={() => {
          setOpenTransactions(false);
        }}
      >
        <div className="transactions-block">
          <div className="transactions-header">Transactions</div>
          <div className="transactions-content">
            <div className="transactions-content-header">
              <span>Date/Time</span>
              <span>Application</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Balance</span>
            </div>
            {adminUserData?.transactions
              ?.sort((a, b) => {
                var aDate = new Date(a.Date);
                var bDate = new Date(b.Date);
                return bDate - aDate;
              })
              ?.map((payment, index) => {
                return (
                  <div
                    className={`transactions-content-body ${
                      index % 2 === 0 ? "even" : "odd"
                    }`}
                  >
                    <span>
                      {new Date(payment.Date).toLocaleString("en-In")}
                    </span>
                    <span>{payment.application}</span>
                    <span>{payment.type}</span>
                    <span>
                      {payment.type === "Debit" ? (
                        <FontAwesomeIcon icon={faMinus} className="icon" />
                      ) : (
                        <FontAwesomeIcon icon={faPlus} className="icon" />
                      )}
                      &nbsp;
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="icon"
                      />
                      {Math.ceil(payment.amount)}
                    </span>
                    <span>
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="icon"
                      />
                      {Math.ceil(payment.balance)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </Popup>
      <Popup condition={newTripPopup} close={() => setNewTripPopup(false)}>
        <h1 className="font-bold text-[20px]">Enter Trip name</h1>

        <textarea
          required={true}
          cols={40}
          rows={3}
          className="border border-solid border-black rounded-md py-1 px-1 placeholder:text-[17px]"
          placeholder="Enter trip name"
          value={tripname}
          onChange={(e) => settripname(e.target.value)}
        />
        <br />
        <button
          className="bg-black text-white rounded-lg  px-3 py-1 block m-auto"
          onClick={handleSubmitTrip}
        >
          Create
        </button>
      </Popup>
      <Popup
        condition={createUser}
        close={() => {
          setCreateUser(false);
        }}
      >
        <div className="signUpPage-container">
          <h1 className="signUpPage-header">User Profile</h1>
          <form className="signUpPage-body" onSubmit={handleSubmit(submitBtn)}>
            <div className="signUpPage-header-details">Personal Info</div>
            <div className="signUpPage-type">
              <div>
                First Name*
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    placeholder="Enter your FirstName"
                    name="firstName"
                    {...register("firstName", {
                      required: {
                        value: true,
                        message: "Please enter firstname",
                      },
                    })}
                  />
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </div>
              </div>
              <div>
                Last Name*
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    placeholder="Enter your Lastname"
                    name="lastName"
                    {...register("lastName", {
                      required: {
                        value: true,
                        message: "Please enter lastname",
                      },
                    })}
                  />
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </div>
              </div>
            </div>
            <div className="signUpPage-type">
              <div>
                Mobile Number*
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    name="countryCode"
                    placeholder="+91"
                    {...register("countryCode", {
                      required: {
                        value: true,
                        message: "Please enter country code",
                      },
                    })}
                    className="countryCode"
                  />
                  <input
                    type="number"
                    placeholder="Enter your number"
                    name="mobileNumber"
                    {...register("mobileNumber", {
                      required: {
                        value: true,
                        message: "Please enter mobile number",
                      },
                    })}
                  />
                </div>
              </div>
              <div>
                Gender*
                <div className="signUpPage-type-input">
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    name="gender"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="signUpPage-type">
              <div>
                Account Type*
                <div className="signUpPage-type-input">
                  <select
                    {...register("accountType", {
                      required: "Account type is required",
                    })}
                    name="accountType"
                    defaultValue={"PostPaid"}
                  >
                    <option value="PrePaid">PrePaid</option>
                    <option value="PostPaid">PostPaid</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="signUpPage-type">
              <div>
                Approval Type
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    name="approvalType"
                    {...register("approvalType", {
                      value: "Mandatory",
                    })}
                    defaultValue="Mandatory"
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div>
                Add Approval Email*
                <div className="signUpPage-type-input">
                  <input
                    type="email"
                    placeholder="Enter approval email"
                    {...register("approvalEmail", {
                      required: {
                        value: true,
                        message: "User is not allowed",
                      },
                      validate: (value) => {
                        return (
                          userEmails.map((obj) => obj.data).includes(value) ||
                          "User is not allowed"
                        );
                      },
                    })}
                  />
                  <div className="error-message">
                    {errors.approvalEmail && errors.approvalEmail.message}
                  </div>
                </div>
              </div>
            </div>
            <div className="signUpPage-header-details">Company Info</div>
            <div className="signUpPage-type">
              <div>
                Add Billing Account*
                <div className="signUpPage-type-input">
                  <select
                    {...register("billingAccount", {
                      required: "Billing Account is required",
                    })}
                    onChange={handleAccountChange}
                    name="billingAccount"
                  >
                    {/* <option value="">Select a billing account</option> */}
                    {companies.map((items) => {
                      return (
                        <option value={items.id} key={items.companyName}>
                          {items.companyName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div>
                Company Name*
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    placeholder="Enter your Company Name"
                    name="companyName"
                    {...register("companyName", {
                      required: {
                        value: true,
                        message: "Please enter company name",
                      },
                    })}
                    disabled
                  />
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </div>
              </div>
              <div>
                Company Address*
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    placeholder="Enter your Company Name"
                    name="companyAddress"
                    {...register("companyAddress", {
                      required: {
                        value: true,
                        message: "Please enter company address",
                      },
                    })}
                    disabled
                  />
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </div>
              </div>
              <div>
                Company location*
                <div className="signUpPage-type-input">
                  <input
                    {...register("companyLocation", {
                      required: "Company location is required",
                    })}
                    name="companyLocation"
                    disabled
                  />
                </div>
              </div>
              <div>
                Company GST Number
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    placeholder="Enter company GST Number"
                    name="GSTNo"
                    {...register("GSTNo", {
                      required: {
                        value: false,
                        message: "Please enter passport number",
                      },
                    })}
                    disabled
                  />
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </div>
              </div>
              <div>
                Company PAN Number
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    placeholder="Enter company PAN Number"
                    name="PANNo"
                    {...register("PANNo", {
                      required: {
                        value: false,
                        message: "Please enter passport number",
                      },
                    })}
                    disabled
                  />
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </div>
              </div>
            </div>

            <div className="signUpPage-submit">
              {signUpLoader ? (
                <button className="flex items-center justify-center">
                  <ClipLoader color="#fff" size={20} />
                </button>
              ) : (
                <>
                  <button type="submit">Update User</button>
                </>
              )}
            </div>
          </form>
        </div>
      </Popup>
      <div className="userProfile-admin-container !flex">
        <SideNav />
        <div className="userProfile-admin-block !overflow-y-scroll w-[100vw]">
          <div className="userProfile-header-back">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="userProfile-header-back-icon"
              onClick={async () => {
                navigate(`/users`);
              }}
            />
          </div>
          <div className="userProfile-admin-balance">
            <div className="userProfile-admin-balance-details">
              <span>
                {adminUserData.firstName}&nbsp;{adminUserData.lastName}
              </span>
              <span>{adminUserData.email}</span>
              <span>{adminUserData.mobileNumber}</span>
              <span>Account Type: {adminUserData.accountType}</span>
              <span>Approval Type: {adminUserData.approvalType}</span>
              <span>Company Name: {adminUserData.companyName}</span>
            </div>
            <div className="userProfile-admin-balance-content">
              <div className="balance-header">
                Wallet Balance:{" "}
                <span>
                  <FontAwesomeIcon icon={faIndianRupeeSign} />
                  &nbsp;{Math.ceil(adminUserData.balance).toLocaleString()}
                </span>
              </div>
              <div className="balance-button">
                <button
                  onClick={() => {
                    setOpenBalance(true);
                  }}
                >
                  Add Money
                </button>
                <button
                  onClick={() => {
                    setOpenTransactions(true);
                  }}
                >
                  Show Transactions
                </button>
                <button
                  onClick={async () => {
                    navigate(`logs`);
                  }}
                >
                  Logs
                </button>
                <button
                  onClick={() => {
                    setCreateUser(true);
                  }}
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
          {/* <div className='d-flex gap-10 px-[10pt] py-[20pt] m-[20pt] rounded-[0.8rem] userProfile-admin-type '>
                        <div className='d-flex flex-col w-1/2'>
                            <span className='font-bold text-[15pt]'>Account Type </span>
                            <select class="custom-select custom-select-lg mb-3 bg-[rgb(246,246,246)] p-3 rounded-[0.8rem]" onChange={(e) => actions.changeAccountType("payment", e.target.value, adminUserData.userid)}>
                                <option selected={adminUserData.accountType === "PrePaid"}>PrePaid</option>
                                <option selected={adminUserData.accountType === "PostPaid"}>PostPaid</option>
                            </select>
                        </div>
                        <div className='d-flex flex-col w-1/2'>
                            <span className='font-bold text-[15pt]'>Approval Type </span>
                            <select class="custom-select custom-select-lg mb-3 bg-[rgb(246,246,246)] p-3 rounded-[0.8rem]" onChange={(e) => actions.changeAccountType("approval", e.target.value, adminUserData.userid)}>
                                <option selected={adminUserData.approvalType === "Mandatory"}>Mandatory</option>
                                <option selected={adminUserData.approvalType === "Non Mandatory"}>Non Mandatory</option>
                            </select>
                        </div>
                    </div> */}
          <div className="userProfile-admin-trips">
            <div className="userProfile-admin-trips-header">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Offline Trips" {...a11yProps(1)} />
                <Tab label="Bookings" {...a11yProps(0)} />
              </Tabs>
              <div className="userProfile-admin-trips-header">
                <button
                  onClick={async () => {
                    // actions.setAdminUserId(id);
                    // navigate("/home/flights");
                    // await actions.getUserTripsById(id);
                    setNewTripPopup(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  &nbsp; Create Trip
                </button>
              </div>
            </div>
          </div>
          <CustomTabPanel
            value={value}
            index={0}
            className="userProfile-admin-trips"
          >
            <div className="userProfile-admin-trips-content">
              <div className="userProfile-admin-trips-header">
                <span>Name</span>
                <span>Created At</span>
                <span>Flights</span>
                <span>Hotels</span>
                <span>Bus</span>
                <span>Cabs</span>
                <span>Other</span>
              </div>
              {adminUserData?.trips.length > 0 ? (
                <>
                  {adminUserData?.trips
                    ?.sort((a, b) => {
                      var aDate = new Date(a?.data?.date?.seconds * 1000);
                      var bDate = new Date(b?.data?.date?.seconds * 1000);

                      return bDate - aDate;
                    })
                    ?.map((trip, i) => {
                      var createdAt = new Date(trip?.data?.date?.seconds * 1000)
                        .toString()
                        .slice(4, 16);
                      return (
                        <div
                          className="userProfile-admin-trips-items"
                          onClick={async () => {
                            navigate(`trips/${trip.id}`);
                          }}
                          key={i}
                        >
                          <span>{trip?.data?.name}</span>
                          <span>{createdAt}</span>
                          <span>{trip?.data?.flights?.length}</span>
                          <span>{trip?.data?.hotels?.length}</span>
                          <span>{trip?.data?.bus?.length}</span>
                          <span>{trip?.data?.cabs?.length}</span>
                          <span>{trip?.data?.otherBookings?.length}</span>
                        </div>
                      );
                    })}
                  <div className="flex justify-center mt-[20px]">
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </div>
                </>
              ) : null}
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {/* <BookedTrips adminPage={true} userId={id} /> */}
            <EmailandManual userPage={true} userId={id} />
          </CustomTabPanel>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
