import React, { useEffect, useState } from "react";
import "./billingAccountHome.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SideNav from "../../SideNav/SideNav";
import { db } from "../../../MyProvider";
import Popup from "../../../Popup";
import { Pagination } from "@mui/material";
const BillingAccountHome = () => {
  const [createAc, setAc] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: "",
      contactName: "",
      mobileNo: "",
      email: "",
      state: "Within State",
      country: "",
      billingInvoiceId: "",
    },
  });
  const navigate = useNavigate();
  const addCompany = async (company) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const companiesCollection = db.collection("companies");
      const allCompanies = await companiesCollection.get();

      const companyNameToCheck = company.companyName
        .replace(/\s+/g, "")
        .toLowerCase();
      const existingCompany = allCompanies.docs.find(
        (doc) =>
          doc.data().companyName.replace(/\s+/g, "").toLowerCase() ===
          companyNameToCheck
      );
      if (existingCompany) {
        throw new Error(
          `Company with name "${company.companyName}" already exists.`
        );
      }
      company.InvoiceCount = 0;
      await companiesCollection.add({
        ...company,
        createdAt: new Date(),
        status: "Active",
      });
      setErrorMessage("");
      setLoading(false);
      reset({
        companyName: "",
        contactName: "",
        mobileNo: "",
        email: "",
        state: "Within State",
        country: "",
      });
      console.log("Company added successfully!");
      setSuccessMessage("Company added successfully!");
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
      console.log(error.message);
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
  const handleNavigation = (name) => {
    navigate(`eachCompany/${name}`);
  };
  useEffect(() => {
    fetchCompanies();
  }, []);
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(companies.length / itemsPerPage);

  // Get companies for the current page
  const currentCompanies = companies.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <>
      <Popup
        condition={createAc}
        close={() => {
          setAc(false);
          reset({
            companyName: "",
            contactName: "",
            mobileNo: "",
            email: "",
            state: "Within State",
            country: "",
          });
          setErrorMessage("");
          setSuccessMessage("");
        }}
      >
        <>
          <h1 className="form-title">Company Details</h1>
          {errorMessage && (
            <span className="error-message">{errorMessage}</span>
          )}
          {successMessage && (
            <span className="success-message">{successMessage}</span>
          )}
          <form onSubmit={handleSubmit(addCompany)}>
            <div className="form-main-container">
              <div className="input-main-container">
                <span className="input-title">Company Name *</span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Enter companyName"
                    {...register("companyName", {
                      required: {
                        value: true,
                        message: "Please enter Company Name",
                      },
                    })}
                  />
                  {errors?.companyName?.message && (
                    <div className="error-message">
                      {errors.companyName.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="input-main-container">
                <span className="input-title">Contact Person Name *</span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Enter Contact Person Name"
                    {...register("contactName", {
                      required: {
                        value: true,
                        message: "Please enter Contact Person Name ",
                      },
                    })}
                  />
                  {errors?.contactName?.message && (
                    <div className="error-message">
                      {errors.contactName.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Mobile *</span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Enter MobileNo"
                    {...register("mobileNo", {
                      required: {
                        value: true,
                        message: "Please enter mobileNo",
                      },
                    })}
                  />
                  {errors?.mobileNo?.message && (
                    <div className="error-message">
                      {errors.mobileNo.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Email *</span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Enter Email"
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Please enter email",
                      },
                    })}
                  />
                  {errors?.email?.message && (
                    <div className="error-message">{errors.email.message}</div>
                  )}
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">State *</span> :
                <div>
                  <select
                    {...register("state", {
                      required: "This status field is required",
                    })}
                    className="input-container"
                  >
                    <option value="Within state">Within state</option>
                    <option value="Outside state">Outside state</option>
                  </select>
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Country *</span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Country"
                    {...register("country", {
                      required: {
                        value: true,
                        message: "Please enter country",
                      },
                    })}
                  />
                  {errors?.country?.message && (
                    <div className="error-message">
                      {errors.country.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Company PAN *</span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="company address"
                    {...register("companyPan", {
                      required: {
                        value: true,
                        message: "Please enter company PAN",
                      },
                    })}
                  />
                  {errors?.companyPan?.message && (
                    <div className="error-message">
                      {errors.companyPan.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Company Address *</span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="company address"
                    {...register("companyaddress", {
                      required: {
                        value: true,
                        message: "Please enter company address",
                      },
                    })}
                  />
                  {errors?.companyaddress?.message && (
                    <div className="error-message">
                      {errors.companyaddress.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">GST *</span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="GST"
                    {...register("gst", {
                      required: {
                        value: true,
                        message: "Please enter Gst",
                      },
                    })}
                  />
                  {errors?.gst?.message && (
                    <div className="error-message">{errors.gst.message}</div>
                  )}
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Billing Invoice Id *</span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Billing invoice Id"
                    {...register("billingInvoiceId", {
                      required: {
                        value: true,
                        message: "Please enter billing invoice ID",
                      },
                    })}
                  />
                  {errors?.billingInvoiceId?.message && (
                    <div className="error-message">
                      {errors.billingInvoiceId.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="submit-btn-container">
              <button type="submit" className="submit-btn" disabled={loading}>
                {" "}
                {loading ? (
                  <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </>
      </Popup>
      <div className="main-block">
        <SideNav />

        <div className="secondary-block">
          <div className="header">
            <span className="header-title">Billing Accounts</span>
          </div>
          <div className="createUser">
            <button onClick={() => setAc(true)}>
              <FontAwesomeIcon icon={faPlus} />
              &nbsp;&nbsp;Create
            </button>
          </div>

          {/* Display Companies */}

          <div className="w-[80vw]">
            <div
              className="grid font-bold px-[10pt] text-center"
              style={{
                gridTemplateColumns: "repeat(4, 1fr)",
              }}
            >
              <div>Company Name</div>
              <div>Mobile No</div>
              <div>Email</div>
              <div>Status</div>
            </div>
          </div>
          <div className="w-[80vw] flex flex-col gap-2">
            {currentCompanies.map((items) => (
              <button
                className="companies-data-items font-bold px-[10pt] m-auto grid"
                key={items.id}
                onClick={() => handleNavigation(items.id)}
                style={{
                  gridTemplateColumns: "repeat(4, 1fr)",
                }}
              >
                <p>{items.companyName}</p>
                <p>{items.mobileNo}</p>
                <p>{items.email}</p>
                <p>{items.status}</p>
              </button>
            ))}
          </div>

          {/* Pagination Component */}
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              className="bg-white p-2 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingAccountHome;
