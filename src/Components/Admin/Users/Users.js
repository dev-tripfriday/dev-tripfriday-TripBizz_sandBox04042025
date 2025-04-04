import React, { useContext, useEffect, useState } from "react";
import SideNav from "../SideNav/SideNav";
import Popup from "../../Popup";
import MyContext from "../../Context";
import "./Users.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faPenToSquare,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { ClipLoader } from "react-spinners";
import { db } from "../../MyProvider";
import { Pagination } from "@mui/material";
import { map } from "jquery";

const Users = () => {
  var [createUser, setCreateUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [pageCursors, setPageCursors] = useState({ 1: null });
  const [usersLoading, setUsersLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState();
  const [userEmails, setUserEmails] = useState([]);
  // console.log(userEmails);
  const usersPerPage = 10;
  var { signUpLoader, actions } = useContext(MyContext);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  var [userData, setUserData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    passportNumber: "",
    countryCode: "+91",
    aadharCard: null,
    passport: null,
    GSTNo: "",
    PANNo: "",
    companyName: "",
    accountType: "PrePaid",
    gender: "",
    approvalType: "Mandatory",
    balance: 0,
  });
  const watchApprovalType = watch("approvalType");
  const submitBtn = async (data) => {
    const managerId = userEmails.find((obj) => obj.data === data.approvalEmail);
    data.companyId = companyId;
    data.managerId = managerId ? managerId.id : undefined;
    console.log(data);
    await actions.signUp(data);
    setCreateUser(false);
  };
  const searchUserByEmail = async (email) => {
    try {
      const usersRef = db.collection("Accounts");
      let query = usersRef
        .where("email", ">=", email.toLowerCase())
        .where("email", "<=", email.toLowerCase() + "\uf8ff");

      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, data: doc.data() });
      });

      setUsers(users);
      // setTotalPages(Math.ceil(totalCount / usersPerPage));
      // Update totalPages if you have a total count (requires a separate query)
      // setTotalPages(Math.ceil(totalCount / usersPerPage));
    } catch (error) {
      console.error("Error searching user by email:", error);
    }
  };
  const navigate = useNavigate();
  const getAllUsers = async () => {
    setUsersLoading(true);
    try {
      const accountDocRef = db.collection("Accounts");
      let query = accountDocRef
        .where("role", "!=", "admin")
        .limit(usersPerPage);

      if (pageCursors[page]) {
        query = query.startAfter(pageCursors[page]);
      }

      const querySnapshot = await query.get();
      const userArray = [];

      querySnapshot.forEach((doc) => {
        userArray.push({ id: doc.id, data: doc.data() });
      });

      setUsers(userArray);

      // Update cursors
      setPageCursors((prevCursors) => ({
        ...prevCursors,
        [page + 1]: querySnapshot.docs[querySnapshot.docs.length - 1],
      }));

      // Get total count of non-admin users (this might be inefficient for large collections)
      const totalCountSnapshot = await accountDocRef
        .where("role", "!=", "admin")
        .get();
      const totalCount = totalCountSnapshot.size;
      setTotalPages(Math.ceil(totalCount / usersPerPage));
      setUsersLoading(false);
    } catch (error) {
      setUsersLoading(false);

      console.log(error);
    }
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleAccountChange = async (e) => {
    setCompanyId(e.target.value);
    const companyRef = db.collection("companies").doc(e.target.value);
    const companyDoc = await companyRef.get();
    setValue("companyName", companyDoc.data().companyName);
    setValue(
      "companyAddress",
      companyDoc.data().companyaddress ?? "No Company Location"
    );
    setValue("companyLocation", companyDoc.data().state ?? "No company State");
    setValue("GSTNo", companyDoc.data().gst ?? "No Company GST Number");
    setValue("PANNo", companyDoc.data().companyPan ?? "No Company PAN Number");
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
  useEffect(() => {
    if (pageCursors[page] !== undefined) {
      getAllUsers();
    }
  }, [page]);
  useEffect(() => {
    fetchCompanies();
    getAllUserEmail();
  }, []);

  return (
    <>
      <Popup
        condition={createUser}
        close={() => {
          setCreateUser(false);
        }}
      >
        <div className="signUpPage-container">
          <h1 className="signUpPage-header">User Profile</h1>
          <form className="signUpPage-body" onSubmit={handleSubmit(submitBtn)}>
            <div className="signUpPage-header-details">Login Details</div>
            <div className="signUpPage-type">
              <div>
                Email*
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    placeholder="Enter your email"
                    // name="email"
                    // value={userData.email}
                    // onChange={(e) => setData(e)}
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Please enter email",
                      },
                    })}
                  />
                  <span>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                </div>
                {errors?.email?.message && (
                  <div className="error-message">{errors.email.message}</div>
                )}
              </div>
              <div>
                Password*
                <div className="signUpPage-type-input">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    // value={userData.password}
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Please enter password",
                      },
                    })}
                  />
                  <span>
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                </div>
                {errors?.password?.message && (
                  <div className="error-message">{errors.password.message}</div>
                )}
              </div>
            </div>
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
                {errors?.firstName?.message && (
                  <div className="error-message">
                    {errors.firstName.message}
                  </div>
                )}
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
                {errors?.lastName?.message && (
                  <div className="error-message">{errors.lastName.message}</div>
                )}
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
                {/* <div className="error-message">{errors.countryCode}</div> */}
                {errors?.mobileNumber?.message && (
                  <div className="error-message">
                    {errors.mobileNumber.message}
                  </div>
                )}
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
                <div className="error-message">
                  {errors.gender && errors.gender.message}
                </div>
              </div>
              {/* <div>
                Passport Number
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    placeholder="Enter your passport number"
                    name="passportNumber"
                    {...register("passportNumber", {
                      required: {
                        value: false,
                        message: "Please enter passport number",
                      },
                    })}
                  />
                </div>
                {errors?.passportNumber?.message && (
                  <div className="error-message">
                    {errors.passportNumber.message}
                  </div>
                )}
              </div> */}
            </div>
            {/* <div className="signUpPage-type">
              <div className="signUpPage-documents">
                Aadhar Card
                <div className="signUpPage-type-input">
                  <input
                    type="file"
                    name="aadharCard"
                    accept="image/*"
                    {...register("aadharCard", {
                      validate: {
                        required: (files) => {
                          if (files.length === 0) return true;
                        },
                      },
                    })}
                  />
                </div>
                <div className="error-message">
                  {errors.aadharCard && errors.aadharCard.message}
                </div>
              </div>
              <div className="signUpPage-documents">
                Passport
                <div className="signUpPage-type-input">
                  <input
                    type="file"
                    name="passport"
                    {...register("passport", {
                      required: false,
                      validate: {
                        required: (files) => {
                          if (files.length === 0) return true;
                        },
                      },
                    })}
                    accept="image/*"
                  />
                </div>
                <div className="error-message">
                  {" "}
                  {errors.passport && errors.passport.message}
                </div>
              </div>
            </div> */}
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
                    {/* <option value="">Select</option> */}
                    <option value="PrePaid">PrePaid</option>
                    <option value="PostPaid">PostPaid</option>
                  </select>
                </div>
                <div className="error-message">
                  {errors.accountType && errors.accountType.message}
                </div>
              </div>
            </div>
            <div className="signUpPage-type">
              <div>
                Approval Type
                <div className="signUpPage-type-input">
                  {/* <select
                    {...register("approvalType", {
                      required: "Approval type is required",
                    })}
                    name="approvalType"
                  >
                    <option value="">Select</option>
                    <option value="Mandatory">Mandatory</option>
                    <option value="Non Mandatory">Non Mandatory</option>
                  </select> */}
                  <input
                    type="text"
                    name="approvalType"
                    {...register("approvalType", {
                      value: "Mandatory",
                    })}
                    defaultValue="Mandatory" // Ensures default value
                    readOnly // Prevents editing while keeping it in form submission
                    disabled
                  />
                </div>
                <div className="error-message">
                  {" "}
                  {errors.approvalType && errors.approvalType.message}
                </div>
              </div>
              <div>
                Add Approval Email*
                <div className="signUpPage-type-input">
                  {/* <input
                    type="email"
                    placeholder="Enter approval email"
                    name="approvalEmail"
                    {...register("approvalEmail", {
                      required: {
                        value: true,
                        message: "Please enter approval email",
                      },
                    })}
                  /> */}
                  <input
                    type="email"
                    placeholder="Enter approval email"
                    {...register("approvalEmail", {
                      required: {
                        value: true,
                        message: "Please enter approval email",
                      },
                      validate: (value, formValues) => {
                        if (formValues.email === value) {
                          return true; // Skip validation if emails are the same
                        }
                        return (
                          userEmails.map((obj) => obj.data).includes(value) ||
                          "User is not allowed"
                        );
                      },
                    })}
                  />
                </div>
                <div className="error-message">
                  {errors.approvalEmail && errors.approvalEmail.message}
                </div>
              </div>

              {/* <div>
                Invoice ID*
                <div className="signUpPage-type-input">
                  <input
                    type="text"
                    placeholder="Enter your passport number"
                    name="InvoiceId"
                    {...register("InvoiceId", {
                      required: {
                        value: true,
                        message: "Please enter Invoice ID",
                      },
                    })}
                  />
                </div>
                {errors?.InvoiceId?.message && (
                  <div className="error-message">
                    {errors.InvoiceId.message}
                  </div>
                )}
              </div> */}
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
                    <option value="">Select a billing account</option>
                    {companies.map((items) => {
                      return (
                        <option value={items.id} key={items.companyName}>
                          {items.companyName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="error-message">
                  {errors.billingAccount && errors.billingAccount.message}
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
                <div className="error-message">
                  {errors.companyName && errors.companyName.message}
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
                <div className="error-message">
                  {errors.companyAddress && errors.companyAddress.message}
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
                <div className="error-message">
                  {errors.companyLocation && errors.companyLocation.message}
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
                <div className="error-message">
                  {errors.GSTNo && errors.GSTNo.message}
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
                <div className="error-message">
                  {errors.PANNo && errors.PANNo.message}
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
                  <button type="submit">Create User</button>
                </>
              )}
            </div>
          </form>
        </div>
      </Popup>
      <div className="users-block">
        <div className="child1">
          <SideNav />
        </div>
        <div className="child2">
          <div className="btncontainer">
            <button
              onClick={() => {
                setCreateUser(true);
                // getAllUserEmail();
              }}
              className="btn"
            >
              <FontAwesomeIcon icon={faPlus} />
              &nbsp;&nbsp;Create User
            </button>
          </div>
          {usersLoading ? (
            <div className="flex items-center justify-center w-[80vw] h-[100vh]">
              <ClipLoader />
            </div>
          ) : (
            <>
              <div className="users-main-tabs !flex !items-center">
                <div className="users-main-tabs-list">User emails</div>
                <input
                  placeholder="Search by email"
                  className="border flex-1 border-solid border-black rounded-[0.8rem] focus:outline-none py-1 px-2 placeholder:text-[10pt]"
                  onChange={(e) => searchUserByEmail(e.target.value)}
                />
              </div>
              <div className="users-main-content">
                <div className="users-main-content-header">
                  <div className="users-main-content-header-item">
                    User name
                  </div>
                  <div className="users-main-content-header-item">
                    User Email
                  </div>
                  <div className="users-main-content-header-item">
                    Company Name
                  </div>
                  <div className="users-main-content-header-item">
                    Approver Name
                  </div>
                </div>
                {users.length > 0 &&
                  users.map((user, ui) => {
                    return (
                      <div
                        className="users-main-content-items !text-center"
                        onClick={() => {
                          navigate(`${user.id}`);
                        }}
                        key={`u_${ui + 1}`}
                      >
                        <div className="users-main-content-item name">
                          <FontAwesomeIcon icon={faUser} />
                          &nbsp;
                          {user.data.userName
                            ? user.data.userName
                            : user.data.firstName}
                        </div>
                        <div className="users-main-content-item">
                          {user.data.email}
                        </div>
                        <div className="users-main-content-item !text-[13px]">
                          {user.data.companyName}
                        </div>
                        <div className="users-main-content-item name">
                          {
                            userEmails.find(
                              (obj) => obj.id === user?.data?.manager?.userId
                            )?.data
                          }
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex justify-center mt-2">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
