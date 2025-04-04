import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../MyProvider";
import "./eachCompanyBillingAccount.css";
import SideNav from "../../SideNav/SideNav";
import { format, set } from "date-fns";
import { Dialog, DialogContent } from "@mui/material";
import { FaSpinner } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import MyContext from "../../../Context";
import { WindmillSpinner } from "react-spinner-overlay";
import Popup from "../../../Popup";
import { MdModeEdit } from "react-icons/md";
import { doc, getDoc } from "firebase/firestore";
import { id } from "date-fns/locale";
const EachCompanyBillingAccount = () => {
  const { actions } = useContext(MyContext);
  const [invoiceData, setInvoiceData] = useState([]);
  const [editPopup, setEditPopup] = useState(false);
  const [editCreditPopup, setEditCreditPopup] = useState(false);
  const [creditStatus, setCreditStatus] = useState("Not sent to Client");
  const [creditId, setCreditId] = useState("");
  const [status, setStatus] = useState("Invoice");
  const [submitLoader, setSubmitLoader] = useState(false);
  const [docId, setDocId] = useState("");
  const [companyData, setCompanyData] = useState({});
  const [tabs, setTabs] = useState("invoices");
  const [creditNote, setCreditNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creditNotesData, setCreditNotesData] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [creditdateOpen, setCreditDateOpen] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [successMsg, setSuccessMsg] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [companyStatus, setCompanyStatus] = useState("");
  const [pdfDetails, setPdfDetails] = useState({});
  const [invoiceLoader, setInvoiceLoader] = useState(false);
  const [editBillingAccount, setEditBillingAccount] = useState(false);
  const [editAcloader, setEditAcloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register: registerInvoice,
    handleSubmit: handleInvoiceSubmit,
    formState: { errors: invoiceErrors },
    reset: invoiceReset,
    watch: watchInvoice,
    setValue: invoiceSetValue,
  } = useForm({
    invoiceStatus: "Not Sent",
    invoiceDate: "",
  });
  const {
    register: registerReceipt,
    handleSubmit: handleReceiptSubmit,
    formState: { errors: receiptErrors },
    reset: receiptReset,
    watch: watchReceipt,
    setValue: registerSetValue,
  } = useForm({
    receiptStatus: "Pending",
    receiptDate: "",
    paidReceipt: "",
    pendingReceipt: "",
    partlyReceivedDate: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { name } = useParams();
  const updateCompanyStatus = async () => {
    try {
      if (!name || !companyStatus) {
        throw new Error("Both companyName and companyStatus are required.");
      }

      const companyRef = db.collection("companies").doc(name);
      const companySnapshot = await companyRef.get();

      if (!companySnapshot.exists) {
        throw new Error(`Company with name "${name}" does not exist.`);
      }

      await companyRef.update({ status: companyStatus });
      const companyA = await companySnapshot.data();
      const userQuerySnapshot = await db
        .collection("Accounts")
        .where("companyName", "==", companyA.companyName)
        .get();

      if (userQuerySnapshot.empty) {
        console.warn(
          `No users found associated with the company "${companyA.companyName}".`
        );
      } else {
        const batch = db.batch();
        // Update each user's status
        userQuerySnapshot.forEach((doc) => {
          const userRef = db.collection("Accounts").doc(doc.id);
          batch.update(userRef, { status: companyStatus });
        });

        // Commit the batch update
        await batch.commit();
        setEditStatus(false);
      }
    } catch (error) {
      console.error("Error updating company status:");
    }
  };
  const getBillingAccountDocuments = () => {
    const last40DocumentsRef = db
      .collection("companies")
      .doc(name)
      .collection("Invoices")
      .orderBy("bookedAt", "desc")
      .limit(40);
    const unsubscribe = last40DocumentsRef.onSnapshot((querySnapshot) => {
      const last40Documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoiceData(last40Documents);
    });

    return unsubscribe;
  };
  const {
    register: registerBillingAccount,
    handleSubmit: handleBillingAccountSubmit,
    setValue: billingAccountSetValue,
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
  const handleEditBillingAccount = (data) => {
    billingAccountSetValue("companyName", data.companyName || "");
    billingAccountSetValue("contactName", data.contactName || "");
    billingAccountSetValue("mobileNo", data.mobileNo || "");
    billingAccountSetValue("email", data.email || "");
    billingAccountSetValue("state", data.state || "Within State");
    billingAccountSetValue("country", data.country || "");
    billingAccountSetValue("billingInvoiceId", data.billingInvoiceId || "");
    billingAccountSetValue("companyPan", data.companyPan || "");
    billingAccountSetValue("companyaddress", data.companyaddress || "");
    billingAccountSetValue("gst", data.gst || "");
    billingAccountSetValue("billingInvoiceId", data.billingInvoiceId || "");
  };
  const handleBillingAccountForm = async (data) => {
    setEditAcloader(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const companiesCollection = db.collection("companies").doc(name);

      await companiesCollection.update(data); // Only updates provided fields
      setTimeout(() => {
        setEditAcloader(false);
        setErrorMessage("");
        setSuccessMessage("Company updated successfully!");
        setEditBillingAccount(false);
      }, 5000);

      console.log("Company updated successfully!");
    } catch (error) {
      setErrorMessage(error.message);
      setEditAcloader(false);
      console.error("Error updating company:", error);
    }
  };
  useEffect(() => {
    getBillingAccountDocuments();
    const fetch = async () => {
      const companyDoc = await db.collection("companies").doc(name).get();
      if (companyDoc.exists) {
        setCompanyData({ ...companyDoc.data(), id: companyDoc.id });
        const querySnapshot = await db
          .collection("Accounts")
          .where("billingAccount", "==", `${companyDoc.data().companyName}`)
          .limit(1)
          .get();

        if (!querySnapshot.empty) {
          const document = querySnapshot.docs[0]; // Access the first document
          const data = document.data();
          setPdfDetails(data);
          console.log("Document Data:", data);
        } else {
          console.log("No matching document found");
        }
      }
    };
    fetch();
  }, [editStatus]);

  useEffect(() => {
    db.collection("creditNote")
      .where("id", "==", name)
      .onSnapshot(
        (snapshot) => {
          if (!snapshot.empty) {
            const documents = snapshot.docs.map((doc) => ({
              uid: doc.id,
              ...doc.data(),
            }));
            setCreditNotesData(documents);
          } else {
            console.log("No matching documents found.");
          }
        },
        (error) => {
          console.error("Error listening to documents:", error);
        }
      );
  }, []);
  // useEffect(() => {
  //   const fetchDocument = async () => {
  //     try {
  //       const querySnapshot = await db
  //         .collection("Accounts")
  //         .where("billingAccount", "==", `${companyData?.companyName}`)
  //         .limit(1) // Limit the results to one document
  //         .get();

  //       if (!querySnapshot.empty) {
  //         const document = querySnapshot.docs[0]; // Access the first document
  //         const data = document.data();
  //         console.log("Document Data:", data);
  //       } else {
  //         console.log("No matching document found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching document:", error);
  //     }
  //   };

  //   fetchDocument();
  // }, []);
  const handleClose = () => {
    setEditPopup(false);
    setStatus("Invoice");
    setSuccessMsg("");
    invoiceReset({
      invoiceStatus: "Not Sent",
      invoiceDate: "",
    });
    receiptReset({
      receiptStatus: "Pending",
      receiptDate: "",
      paidReceipt: "",
      pendingReceipt: "",
      partlyReceivedDate: "",
    });
  };

  const handleEdit = (items) => {
    setEditPopup(true);
    settingFeildValues(items);
    setDocId(items.id);
  };
  const handleEditCreditStatus = (items) => {
    setCreditStatus(items.status);
    setCreditId(items.uid);
    setEditCreditPopup(true);
  };
  const updateCreditNoteStatus = async () => {
    try {
      await db.collection("creditNote").doc(creditId).update({
        status: creditStatus,
      });
      setEditCreditPopup(false);
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const generateCsv = () => {
    setDateOpen(true);
    // const flattenedData = invoiceData.map((entry) => ({
    //   details: entry.details,
    //   invoiceNo: entry.invoiceNo,
    //   invoiceStatus: entry.invoiceStatus,
    //   price: entry.price,
    //   receiptStatus: entry.receiptStatus,
    //   userName: entry.userName,
    //   type: entry.type,
    //   bookedAt: new Date(entry.bookedAt.seconds * 1000).toISOString(),
    // }));
    // const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // const excelBuffer = XLSX.write(workbook, {
    //   bookType: "xlsx",
    //   type: "array",
    // });
    // const blob = new Blob([excelBuffer], {
    //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    // });
    // saveAs(blob, "data.xlsx");
  };
  const onInvoiceSubmit = async (data) => {
    try {
      setSubmitLoader(true);
      const invoiceRef = db
        .collection("companies")
        .doc(name)
        .collection("Invoices")
        .doc(docId);
      await invoiceRef.update({
        invoiceStatus: data.invoiceStatus,
        sentDate: data.invoiceDate,
      });
      setTimeout(() => {
        setSubmitLoader(false);
      }, 4000);
      // invoiceReset({
      //   invoiceStatus: "Not Sent",
      //   invoiceDate: "",
      // });
      setSuccessMsg("Added successfully!");
    } catch (error) {
      console.log(error);
      setSubmitLoader(false);
      setSuccessMsg("");
      invoiceReset({
        invoiceStatus: "Not Sent",
        invoiceDate: "",
      });
    }
  };

  const onReceiptSubmit = async (data) => {
    try {
      setSubmitLoader(true);
      const invoiceRef = db
        .collection("companies")
        .doc(name)
        .collection("Invoices")
        .doc(docId);

      if (data.receiptStatus === "Received") {
        await invoiceRef.update({
          receiptStatus: data.receiptStatus,
          receivedDate: data.receiptDate,
        });
      } else if (data.receiptStatus === "Partly Received") {
        await invoiceRef.update({
          receiptStatus: data.receiptStatus,
          paid: data.paidReceipt,
          pending: data.pendingReceipt,
          partlyReceivedDate: data.partlyReceivedDate,
        });
      }
      setTimeout(() => {
        setSubmitLoader(false);
      }, 4000);
      setSuccessMsg("Added successfully!");
      // receiptReset({
      //   receiptStatus: "Pending",
      //   receiptDate: "",
      //   paidReceipt: "",
      //   pendingReceipt: "",
      // });
    } catch (error) {
      console.log(error);
      setSubmitLoader(false);
      setSuccessMsg("");
      receiptReset({
        receiptStatus: "Pending",
        receiptDate: "",
        paidReceipt: "",
        pendingReceipt: "",
        partlyReceivedDate: "",
      });
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Not Sent":
        return "status-not-sent";
      case "Sent":
        return "status-sent";
      default:
        return "";
    }
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Received":
        return "status-received";
      case "Partly Received":
        return "status-partly";
      default:
        return ""; // Fallback in case of an unexpected status
    }
  };
  const handleCreditNoteForm = async (data) => {
    try {
      setLoading(true);
      const mainData = { ...data, id: name, status: "Not sent to Client" };
      await db.collection("creditNote").add(mainData);
      reset();
      setTimeout(() => {
        setLoading(false);
      }, 5000);
      setCreditNote(false);
      console.log("Credit Note added successfully");
    } catch (error) {
      setLoading(false);
      reset();
      console.error("Error adding Credit Note:", error);
    }
  };

  const settingFeildValues = (ele) => {
    invoiceSetValue("invoiceStatus", ele?.invoiceStatus);
    invoiceSetValue("invoiceDate", ele?.sentDate);
    registerSetValue("receiptStatus", ele?.receiptStatus);
    registerSetValue("receiptDate", ele?.receivedDate);
    registerSetValue("paidReceipt", ele?.paid);
    registerSetValue("pendingReceipt", ele?.pending);
    registerSetValue("partlyReceivedDate", ele?.partlyReceivedDate);
  };

  const invoiceStatus = watchInvoice("invoiceStatus");
  const receiptStatus = watchReceipt("receiptStatus");
  const Form1 = () => {
    return (
      <form onSubmit={handleInvoiceSubmit(onInvoiceSubmit)}>
        <div className="flex flex-col gap-2">
          <span className="status-sent">{successMsg}</span>
          <div className="flex gap-3 items-center">
            <span>Invoice Status :</span>
            <select
              className="border rounded-md p-2"
              {...registerInvoice("invoiceStatus", {
                required: "This field is required",
              })}
            >
              <option value="Not Sent">Not Sent</option>
              <option value="Sent">Sent</option>
            </select>
          </div>

          {invoiceStatus === "Sent" && (
            <>
              <div className="flex gap-3 items-center">
                <span>Invoice Sent Date :</span>
                <input
                  type="date"
                  className="border rounded-md p-2"
                  {...registerInvoice("invoiceDate", {
                    required: "This field is required",
                  })}
                />
              </div>
              {invoiceErrors.invoiceDate && (
                <p className="text-red-400">
                  * {invoiceErrors.invoiceDate.message}
                </p>
              )}

              <button
                className="bg-black rounded-lg py-1 px-4 text-white text-[20px] mb-2 font-semibold m-auto"
                disabled={submitLoader}
              >
                {submitLoader ? (
                  <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
                ) : (
                  "Save"
                )}
              </button>
            </>
          )}
        </div>
      </form>
    );
  };
  const Form2 = () => {
    return (
      <form onSubmit={handleReceiptSubmit(onReceiptSubmit)}>
        <div className="flex flex-col gap-2">
          <span className="status-sent">{successMsg}</span>
          <div className="flex gap-3 items-center">
            <span>Receipt Status :</span>
            <select
              className="border rounded-md p-2"
              {...registerReceipt("receiptStatus", {
                required: "This field is required",
              })}
            >
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
              <option value="Partly Received">Partly Received</option>
            </select>
          </div>

          {receiptStatus === "Received" && (
            <>
              <div className="flex gap-3 items-center">
                <span>Receipt Date :</span>
                <input
                  type="date"
                  className="border rounded-md p-2"
                  {...registerReceipt("receiptDate", {
                    required: "This field is required",
                  })}
                />
              </div>
              {receiptErrors.receiptDate && (
                <p className="text-red-400">
                  * {receiptErrors.receiptDate.message}
                </p>
              )}
            </>
          )}

          {receiptStatus === "Partly Received" && (
            <>
              <div className="flex gap-3 items-center justify-between">
                <span>PartlyReceivedDate : </span>
                <input
                  type="date"
                  className="border rounded-md p-2"
                  {...registerReceipt("partlyReceivedDate", {
                    required: "This paid field is required",
                  })}
                />
              </div>
              {receiptErrors.partlyReceivedDate && (
                <p className="text-red-400">
                  * {receiptErrors.partlyReceivedDate.message}
                </p>
              )}
              <div className="flex gap-3 items-center justify-between">
                <span>Paid : </span>
                <input
                  type="text"
                  className="border rounded-md p-2"
                  {...registerReceipt("paidReceipt", {
                    required: "This paid field is required",
                  })}
                />
              </div>
              {receiptErrors.paidReceipt && (
                <p className="text-red-400">
                  * {receiptErrors.paidReceipt.message}
                </p>
              )}

              <div className="flex gap-3 items-center justify-between">
                <span>Pending : </span>
                <input
                  type="text"
                  className="border rounded-md p-2"
                  {...registerReceipt("pendingReceipt", {
                    required: "This pending field is required",
                  })}
                />
              </div>
              {receiptErrors.pendingReceipt && (
                <p className="text-red-400">
                  * {receiptErrors.pendingReceipt.message}
                </p>
              )}
            </>
          )}
          {receiptStatus !== "Pending" && (
            <button className="bg-black rounded-lg py-1 px-4 text-white text-[20px] mb-2 font-semibold m-auto">
              {submitLoader ? (
                <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
              ) : (
                "Save"
              )}
            </button>
          )}
        </div>
      </form>
    );
  };
  const Form3 = () => {
    return (
      <form onSubmit={handleSubmit(handleCreditNoteForm)}>
        <div className="form-container">
          <input
            className="input"
            type="date"
            {...register("date", { required: "Date field is required" })}
          />
          {errors.date && (
            <span className="error-text">{errors.date.message}</span>
          )}
          <textarea
            className="input mutiText "
            placeholder="Details"
            {...register("details", {
              required: "Details  field is required",
            })}
          />
          {errors.details && (
            <span className="error-text">{errors.details.message}</span>
          )}
          <input
            className="input"
            placeholder="Against Invoice Number"
            {...register("invoiceNumber", {
              required: "This field is required",
            })}
          />
          {errors.invoiceNumber && (
            <span className="error-text">{errors.invoiceNumber.message}</span>
          )}
          <input
            type="number"
            className="input"
            placeholder="Cost"
            {...register("cost", { required: "Cost field is required" })}
          />
          {errors.cost && (
            <span className="error-text">{errors.cost.message}</span>
          )}
          <input
            type="number"
            className="input"
            placeholder="Service Fee"
            {...register("servicefee", {
              required: "Service Fee field is required",
            })}
          />
          {errors.servicefee && (
            <span className="error-text">{errors.servicefee.message}</span>
          )}
          {companyData?.state === "Within state" ? (
            <>
              <input
                type="number"
                className="input"
                placeholder="CGST"
                {...register("cgst", {
                  required: "CGST field is required",
                })}
              />
              {errors.cgst && (
                <span className="error-text">{errors.cgst.message}</span>
              )}
              <input
                type="number"
                className="input"
                placeholder="SGST"
                {...register("sgst", {
                  required: "SGST field is required",
                })}
              />
              {errors.sgst && (
                <span className="error-text">{errors.sgst.message}</span>
              )}
            </>
          ) : (
            <>
              <input
                type="number"
                className="input"
                placeholder="IGST"
                {...register("igst", {
                  required: "IGST field is required",
                })}
              />
              {errors.igst && (
                <span className="error-text">{errors.igst.message}</span>
              )}
            </>
          )}
          <input
            type="number"
            className="input"
            placeholder="Total Amount"
            {...register("total", {
              required: "Total amount field is required",
            })}
          />
          {errors.total && (
            <span className="error-text">{errors.total.message}</span>
          )}
          <input
            className="input"
            placeholder="Credit Note Number"
            {...register("creditNumber", {
              required: "This field is required",
            })}
          />
          {errors.creditNumber && (
            <span className="error-text">{errors.creditNumber.message}</span>
          )}
          {/* <select
            className="input"
            {...register("status", {
              required: "This status field is required",
            })}
          >
            <option value="Not sent to Client">Not sent to Client</option>
            <option value="Sent to Client">Sent to Client</option>
            <option value="Adjusted and Closed">Adjusted and Closed</option>
          </select>
          {errors.status && (
            <span className="error-text">{errors.status.message}</span>
          )} */}
        </div>
        <div className="submitBtn-container">
          <button type="submit" className="submitBtn" disabled={loading}>
            {loading ? (
              <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    );
  };
  const handleCreditNotePdf = async (data) => {
    setInvoiceLoading(true);
    try {
      const companyDtls = {
        companyName: pdfDetails.billingAccount,
        companyAddress: pdfDetails.companyAddress,
        GSTIN: pdfDetails.GSTNo,
        state: pdfDetails.companyLocation,
      };
      const mainData = { ...companyDtls, ...data };
      const res = await fetch(
        "https://us-central1-trav-biz.cloudfunctions.net/generateCreditNoteInvoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mainData),
        }
      );
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Invoice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setInvoiceLoading(false);
    } catch (error) {
      setInvoiceLoading(false);
      console.log(error);
    }
  };
  const getInvoiceNumber = async (userId, bookingId, companyId, bookType) => {
    console.log(bookingId);
    try {
      const invoiceRef = await db
        .collection("companies")
        .doc(companyId)
        .collection("Invoices")
        .where(bookType === "other" ? "bookingId" : "cardId", "==", bookingId)
        .get();
      const invoices = invoiceRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return {
        invoiceNumber: invoices[0].BillingInvoiceId,
      };
    } catch (error) {
      console.log(error);
    }
  };
  const downloadInvoice = async (
    type,
    data,
    id,
    userId,
    booktype,
    threadId,
    overallData,
    fileName
  ) => {
    setInvoiceLoader(true);
    const userDetailRef = await db.collection("Accounts").doc(userId).get();
    const userDetails = await userDetailRef.data();
    const companyDetailRef = await db
      .collection("companies")
      .doc(userDetails.companyId)
      .get();
    const companyDetails = await companyDetailRef.data();
    const invoiceNumber = await getInvoiceNumber(
      userId,
      id,
      userDetails.billingAccount,
      booktype
    );
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const financialYear = month >= 4 ? year : year - 1;
    var yrString = `${financialYear % 100}-${(financialYear % 100) + 1}`;
    var options = { day: "numeric", month: "short", year: "numeric" };
    var formattedDate = today.toLocaleDateString("en-US", options);
    var finalString = `${companyDetails?.billingInvoiceId}/${yrString}/${invoiceNumber.invoiceNumber}`;
    let flightBookData;
    if (booktype === "flight") {
      // const bookingData = await getBookingData(threadId);
      if (type === "onward") {
        flightBookData = data.onwardTicketResponce;
      } else if (type === "return") {
        flightBookData = data.returnTicketResponce;
      } else if (type === "oneway" || type === "international") {
        flightBookData = data.ticketResponce;
      }
      try {
        const priceDetails = {
          price: overallData.price,
          finalTotalPrice: overallData.finalTotalPrice,
          serviceCharge: overallData.serviceCharge,
          gst: overallData.gst,
        };
        const pdfData = {
          flightData: flightBookData.Response.Response.FlightItinerary,
          bookingId: id,
          finalString: finalString,
          type: booktype,
          companyDetails: companyDetails,
          userData: userDetails,
          bookingData: overallData,
          priceDetails: priceDetails,
        };
        const res = await fetch(
          "https://us-central1-trav-biz.cloudfunctions.net/generateInvoicePdf",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pdfData),
          }
        );
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setInvoiceLoader(false);
      } catch (error) {
        setInvoiceLoader(false);
        console.log(error);
      }
    } else if (booktype === "hotel") {
      // const bookingData = await getBookingData(threadId);
      // console.log(bookingData.hotelTicketData, finalString, id, booktype);

      const priceDetails = {
        price: overallData.price,
        finalTotalPrice: overallData.finalTotalPrice,
        serviceCharge: overallData.serviceCharge,
        gst: overallData.gst,
      };
      const pdfData = {
        hotelTicketData: data.hotelTicketData,
        bookingId: id,
        finalString: finalString,
        type: booktype,
        companyDetails: companyDetails,
        userData: userDetails,
        priceDetails: priceDetails,
      };
      const res = await fetch(
        "https://us-central1-trav-biz.cloudfunctions.net/generateInvoicePdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pdfData),
        }
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setInvoiceLoader(false);
    } else if (booktype === "other") {
      const priceDetails = {
        price: overallData.price,
        finalTotalPrice: overallData.finalTotalPrice,
        serviceCharge: overallData.serviceCharge,
        gst: overallData.gst,
      };
      const pdfData = {
        bookingData: overallData,
        finalString: finalString,
        bookingId: id,
        type: booktype,
        companyDetails: companyDetails,
        userData: userDetails,
        priceDetails: priceDetails,
      };
      const res = await fetch(
        "https://us-central1-trav-biz.cloudfunctions.net/generateInvoicePdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pdfData),
        }
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setInvoiceLoader(false);
    }
  };
  const getBookingData = async (id) => {
    try {
      const bookingRef = doc(db, "emailQueries", id);
      const bookingSnap = await getDoc(bookingRef);

      if (bookingSnap.exists()) {
        const bookingData = bookingSnap.data();
        // setFlightData(bookingData.ticketResponce);
        return bookingData;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };
  const totalInvoice = invoiceData?.reduce(
    (acc, item) =>
      item.receiptStatus === "Pending" ? acc + item.finalTotalPrice : acc,
    0
  );
  const totalCredit = creditNotesData?.reduce(
    (acc, item) =>
      item.status === "Sent to Client" || item.status === "Not sent to Client"
        ? acc + item.total
        : acc,
    0
  );
  return (
    <>
      <Popup condition={dateOpen} close={() => setDateOpen(false)}>
        <div>
          <div className="flex space-x-4 gap-2">
            <div className="flex flex-col">
              <label
                for="fromDate"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Select From Date
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label
                for="toDate"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Select To Date
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            className="bg-black text-white px-2 py-1 rounded-md block m-auto mt-2"
            onClick={async () => {
              const startOfDay = new Date(fromDate);
              startOfDay.setHours(0, 0, 0, 0);
              const endOfDay = new Date(toDate);
              endOfDay.setHours(23, 59, 59, 999);

              const last40DocumentsRef = db
                .collection("companies")
                .doc(name)
                .collection("Invoices")
                .where("bookedAt", ">=", startOfDay)
                .where("bookedAt", "<=", endOfDay)
                .orderBy("bookedAt", "desc");

              try {
                const querySnapshot = await last40DocumentsRef.get();
                const last40Documents = querySnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));

                const flattenedData = last40Documents.map((entry) => ({
                  Details: entry.details,
                  InvoiceNo: entry.BillingInvoiceId,
                  InvoiceStatus: `${entry.invoiceStatus}${
                    entry.sentDate ? ` (${entry?.sentDate})` : ""
                  }`,
                  Cost: entry.cost,
                  ServiceCharge: entry.serviceCharge,
                  Gst: entry.gst,
                  Total: entry.price,
                  ReceiptStatus: `${entry.receiptStatus}${
                    entry.receiptStatus === "Received"
                      ? ` (${entry.receivedDate})`
                      : entry.receiptStatus === "Partly Received"
                      ? ` (${entry.partlyReceivedDate}) Pending: ${entry.pending}`
                      : ""
                  }`,
                  UserName: entry.userName,
                  Type: entry.type,
                  BookedAt: format(
                    new Date(entry.bookedAt.seconds * 1000),
                    "MMMM d, h:mm a"
                  ),
                }));

                const worksheet = XLSX.utils.json_to_sheet(flattenedData);

                // Calculate and set column widths
                const columnWidths = Object.keys(flattenedData[0] || {}).map(
                  (key) => {
                    const maxLength = Math.max(
                      key.length,
                      ...flattenedData.map((entry) =>
                        entry[key] ? entry[key].toString().length : 0
                      ) // Data length
                    );
                    return { width: maxLength + 2 };
                  }
                );

                worksheet["!cols"] = columnWidths;

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

                const excelBuffer = XLSX.write(workbook, {
                  bookType: "xlsx",
                  type: "array",
                });

                const blob = new Blob([excelBuffer], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
                });

                saveAs(
                  blob,
                  `${companyData?.companyName}_${fromDate}_${toDate}.xlsx`
                );
                setDateOpen(false);
              } catch (error) {
                console.error("Error fetching documents: ", error);
                setDateOpen(false);
              }
            }}
          >
            Download
          </button>
        </div>
      </Popup>
      <Popup
        condition={creditdateOpen}
        close={() => {
          setCreditDateOpen(false);
        }}
      >
        <div>
          <div className="flex space-x-4 gap-2">
            <div className="flex flex-col">
              <label
                for="fromDate"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Select From Date
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label
                for="toDate"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Select To Date
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            className="bg-black text-white px-2 py-1 rounded-md block m-auto mt-2"
            onClick={async () => {
              // const startOfDay = new Date(fromDate);
              // const endOfDay = new Date(toDate);
              console.log(fromDate, toDate);
              const last40DocumentsRef = db
                .collection("creditNote")
                .where("date", ">=", fromDate)
                .where("date", "<=", toDate)
                .orderBy("date", "desc");

              try {
                const querySnapshot = await last40DocumentsRef.get();
                const last40Documents = querySnapshot.docs.map((doc) => ({
                  uid: doc.id,
                  ...doc.data(),
                }));

                const flattenedData = last40Documents.map((entry) => ({
                  Date: entry.date,
                  InvoiceNo: entry.invoiceNumber,
                  creditNoteNo: entry.creditNumber,
                  Status: entry.status,
                  Cost: entry.cost,
                  IGST: entry.igst ? entry.igst : "-",
                  CGST: entry.cgst ? entry.cgst : "-",
                  SGST: entry.sgst ? entry.sgst : "-",
                  Total: entry.total,
                }));

                const worksheet = XLSX.utils.json_to_sheet(flattenedData);

                // Calculate and set column widths
                const columnWidths = Object.keys(flattenedData[0] || {}).map(
                  (key) => {
                    const maxLength = Math.max(
                      key.length,
                      ...flattenedData.map((entry) =>
                        entry[key] ? entry[key].toString().length : 0
                      ) // Data length
                    );
                    return { width: maxLength + 2 };
                  }
                );

                worksheet["!cols"] = columnWidths;

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

                const excelBuffer = XLSX.write(workbook, {
                  bookType: "xlsx",
                  type: "array",
                });

                const blob = new Blob([excelBuffer], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
                });

                saveAs(
                  blob,
                  `${companyData?.companyName}_CreditNote_${fromDate}_${toDate}.xlsx`
                );
                setCreditDateOpen(false);
              } catch (error) {
                console.error("Error fetching documents: ", error);
                setCreditDateOpen(false);
              }
            }}
          >
            Download
          </button>
        </div>
      </Popup>
      <Dialog
        open={editStatus}
        onClose={() => setEditStatus(false)}
        PaperProps={{
          style: { width: "600px" },
        }}
      >
        <DialogContent>
          <div className="flex items-center justify-center flex-col">
            <div className="flex gap-2 items-center">
              <p className="font-bold text-lg">Account Status </p>
              <select
                onChange={(e) => setCompanyStatus(e.target.value)}
                className="block px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={companyData?.status}
              >
                {/* <option value="" disabled selected hidden>
                  Select Status
                </option> */}
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button
              onClick={updateCompanyStatus}
              className="mt-4 bg-black text-white px-3 py-1 rounded-md"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={editCreditPopup}
        onClose={() => {
          setEditCreditPopup(false);
        }}
        PaperProps={{
          style: { width: "600px" },
        }}
      >
        <DialogContent>
          <div className="flex items-center justify-center flex-col">
            <div className="flex gap-2 items-center">
              <p className="font-bold text-lg">Status </p>
              <select
                onChange={(e) => {
                  setCreditStatus(e.target.value);
                }}
                className="block px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={creditStatus}
              >
                <option value="Not sent to Client">Not sent to Client</option>
                <option value="Sent to Client">Sent to Client</option>
                <option value="Adjusted and Closed">Adjusted and Closed</option>
              </select>
            </div>
            <button
              onClick={updateCreditNoteStatus}
              className="mt-4 bg-black text-white px-3 py-1 rounded-md"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Popup
        condition={editBillingAccount}
        close={() => {
          setEditBillingAccount(false);
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
          <form onSubmit={handleBillingAccountSubmit(handleBillingAccountForm)}>
            <div className="form-main-container">
              <div className="input-main-container">
                <span className="input-title">Company Name </span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Enter companyName"
                    {...registerBillingAccount("companyName", {
                      required: {
                        value: true,
                      },
                    })}
                  />
                </div>
              </div>

              <div className="input-main-container">
                <span className="input-title">Contact Person Name </span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Enter Contact Person Name"
                    {...registerBillingAccount("contactName", {
                      required: {
                        value: true,
                      },
                    })}
                  />
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Mobile </span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Enter MobileNo"
                    {...registerBillingAccount("mobileNo", {
                      required: {
                        value: true,
                      },
                    })}
                  />
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Email </span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Enter Email"
                    {...registerBillingAccount("email", {
                      required: {
                        value: true,
                      },
                    })}
                  />
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">State </span> :
                <div>
                  <select
                    {...registerBillingAccount("state", {})}
                    className="input-container"
                  >
                    <option value="Within state">Within state</option>
                    <option value="Outside state">Outside state</option>
                  </select>
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Country </span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Country"
                    {...registerBillingAccount("country", {
                      required: {
                        value: true,
                      },
                    })}
                  />
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Company PAN </span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="company address"
                    {...registerBillingAccount("companyPan", {
                      required: {
                        value: true,
                      },
                    })}
                  />
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Company Address </span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="company address"
                    {...registerBillingAccount("companyaddress", {
                      required: {
                        value: true,
                      },
                    })}
                  />
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">GST </span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="GST"
                    {...registerBillingAccount("gst", {
                      required: {
                        value: true,
                      },
                    })}
                  />
                </div>
              </div>
              <div className="input-main-container">
                <span className="input-title">Billing Invoice Id </span> :
                <div>
                  <input
                    className="input-container"
                    placeholder="Billing invoice Id"
                    {...registerBillingAccount("billingInvoiceId", {
                      required: {
                        value: true,
                      },
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="submit-btn-container">
              <button
                type="submit"
                className="submit-btn"
                disabled={editAcloader}
              >
                {" "}
                {editAcloader ? (
                  <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </>
      </Popup>
      {invoiceLoader && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-100 h-[100vh]">
          <WindmillSpinner color="black" />
        </div>
      )}
      <div className="main-container">
        <SideNav />
        <div
          // className={`secondary-container ${
          //   invoiceLoading ? "!h-[100vh]" : ""
          // }`}
          className={`secondary-container`}
        >
          <div className="bg-white mb-3 px-3 py-3  shadow-md rounded-md flex justify-between">
            <div>
              <p className="font-bold">
                Company Name :{" "}
                <span className="font-medium capitalize">
                  {companyData?.companyName?.charAt(0)?.toUpperCase() +
                    companyData?.companyName?.slice(1)}
                </span>
              </p>
              <p className="font-bold">
                Contact Name :{" "}
                <span className="font-medium capitalize">
                  {" "}
                  {companyData?.contactName?.charAt(0)?.toUpperCase() +
                    companyData?.contactName?.slice(1)}
                </span>
              </p>
              <p className="font-bold">
                Email :{" "}
                <span className="font-medium capitalize">
                  {companyData?.email?.charAt(0)?.toUpperCase() +
                    companyData?.email?.slice(1)}
                </span>
              </p>
              <p className="font-bold">
                Mobile No:{" "}
                <span className="font-medium capitalize">
                  {companyData?.mobileNo}
                </span>
              </p>
            </div>
            <div>
              <p className="font-bold">
                Company Pan :{" "}
                <span className="font-medium capitalize">
                  {companyData?.companyPan}
                </span>
              </p>
              <p className="font-bold">
                Gst :{" "}
                <span className="font-medium capitalize">
                  {" "}
                  {companyData?.gst}
                </span>
              </p>
              <p className="font-bold">
                Invoice Id :{" "}
                <span className="font-medium capitalize">
                  {companyData?.billingInvoiceId}
                </span>
              </p>
              <p className="font-bold">
                Country:{" "}
                <span className="font-medium capitalize">
                  {companyData?.country}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setEditStatus(true)}
                className="flex items-center gap-2"
              >
                <p className="font-bold text-sm">
                  Account Status:
                  <span
                    className={
                      companyData?.status === "Inactive"
                        ? "text-red-400"
                        : "text-green-500"
                    }
                  >
                    {companyData?.status}
                  </span>
                </p>
                <MdModeEdit
                  className=" border px-1 py-1 rounded-md"
                  size={30}
                />
              </button>
              <span className="font-bold text-sm">
                {`Pending Invoice Amount:`}
                <span style={{ color: "#bb3e03" }}>
                  {Math.round(totalInvoice).toLocaleString()}
                </span>
              </span>
              <span className="font-bold text-sm">
                {`Pending Credit Note Amount:`}
                <span style={{ color: "#bb3e03" }}>
                  {Math.round(totalCredit).toLocaleString()}
                </span>
              </span>
            </div>
            <div>
              <button
                className="bg-black text-white px-2 py-1 rounded-md cursor-pointer"
                onClick={() => {
                  handleEditBillingAccount(companyData);
                  setEditBillingAccount(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="flex justify-between bg-[#94D2BD] rounded-md overflow-hidden mb-4">
            <button
              className={`flex w-100 justify-center items-center py-[10px] font-medium text-black ${
                tabs === "invoices" ? "bg-black text-white" : ""
              }`}
              onClick={() => {
                setTabs("invoices");
              }}
            >
              Invoices
            </button>
            <button
              className={`flex w-100 justify-center items-center py-[10px] font-medium text-black ${
                tabs === "creditNote" ? "bg-black text-white" : ""
              }`}
              onClick={() => {
                setTabs("creditNote");
              }}
            >
              Credit Note
            </button>
          </div>

          {tabs === "invoices" ? (
            <>
              <button
                className="bg-black text-white px-2 py-1 rounded-md block ml-auto mb-2"
                onClick={generateCsv}
              >
                Download Reports
              </button>
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Details</th>
                    <th>InvoiceId</th>
                    <th>Invoice Status</th>
                    <th>Receipt Status</th>
                    <th>Amount</th>
                    <th>Download</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.length > 0 ? (
                    invoiceData
                      .toSorted((a, b) => b.bookedAt - a.bookedAt)
                      .map((ele, ind) => (
                        <tr key={ele.userName + ind}>
                          <td>
                            {format(new Date(ele.bookedAt * 1000), "MMM d")}
                          </td>
                          <td>
                            {ele.userName}
                            <br />
                            {ele?.email ? "(" + ele?.email + ")" : ""}
                          </td>
                          <td>{ele.type}</td>
                          <td>{ele.details}</td>
                          <td>{`${companyData.billingInvoiceId}/${ele?.BillingInvoiceId}`}</td>
                          <td className={getStatusColor(ele.invoiceStatus)}>
                            {`${ele.invoiceStatus}${
                              ele.sentDate ? ` (${ele.sentDate})` : ""
                            }`}
                          </td>
                          <td className={getStatusClass(ele.receiptStatus)}>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: `${ele.receiptStatus}${
                                  ele.receiptStatus === "Received"
                                    ? ` (${ele.receivedDate})`
                                    : ele.receiptStatus === "Partly Received"
                                    ? ` (${ele.partlyReceivedDate})<br />Pending: ${ele.pending}`
                                    : ""
                                }`,
                              }}
                            ></span>
                          </td>
                          <td className="price">
                            &#8377; {Math.round(ele?.finalTotalPrice)}
                          </td>
                          <td className="text-[25px] text-center">
                            <button
                              onClick={async () => {
                                console.log("dsfsdf", ele);
                                if (ele.type === "otherbookings") {
                                  console.log("came to other bookigns");
                                  await downloadInvoice(
                                    "other",
                                    ele,
                                    ele.bookingId,
                                    ele.userId,
                                    "other",
                                    ele?.threadId,
                                    ele,
                                    `${companyData.billingInvoiceId}-${ele?.BillingInvoiceId}`
                                  );
                                } else {
                                  const threadData = await db
                                    .collection("bookingId")
                                    .doc(ele.cardId)
                                    .get();
                                  const t = await threadData.data();
                                  console.log("sfDF", t);
                                  const bookingData = await getBookingData(
                                    t.threadId
                                  );
                                  console.log("boking", bookingData);
                                  await downloadInvoice(
                                    t?.flightType,
                                    bookingData,
                                    t.bookingId,
                                    ele.userId,
                                    ele.type,
                                    ele.threadId,
                                    ele,
                                    `${companyData.billingInvoiceId}-${ele?.BillingInvoiceId}`
                                  );
                                }
                              }}
                            >
                              <FontAwesomeIcon icon={faDownload} />
                            </button>
                          </td>
                          <td className="text-[20px] text-center">
                            <button onClick={() => handleEdit(ele)}>
                              <FontAwesomeIcon
                                icon={faEdit}
                                // className="flightStopDtls-popup-card-layover-icon"
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="10" style={{ textAlign: "center" }}>
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <div>
              <div className="credit-note-container">
                <button
                  className="bg-black text-white px-2 py-1 rounded-md block ml-auto mb-2"
                  onClick={() => {
                    setCreditDateOpen(true);
                  }}
                >
                  Download Reports
                </button>
                <button
                  className="addBtn credit-note-container"
                  onClick={() => setCreditNote(true)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add Credit Note
                </button>
              </div>
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>InvoiceNum</th>
                    <th>CreditNoteNum</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Download</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {creditNotesData.length > 0 ? (
                    creditNotesData
                      .toSorted((a, b) => new Date(b.date) - new Date(a.date))
                      .map((ele, ind) => (
                        <tr key={`${ele.userName}_${ind}`}>
                          <td>{ele.date}</td>
                          <td>{ele.invoiceNumber}</td>
                          <td>{ele.creditNumber}</td>
                          <td>{`${ele.status}`}</td>
                          <td className="price">&#8377; {ele.total}</td>
                          <td className="text-[25px] text-center">
                            <button onClick={() => handleCreditNotePdf(ele)}>
                              <FontAwesomeIcon icon={faDownload} />
                            </button>
                          </td>
                          <td className="text-[20px] text-center">
                            <button onClick={() => handleEditCreditStatus(ele)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={editPopup}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: { width: "600px" },
        }}
      >
        <DialogContent>
          <div className="flex justify-between bg-[#94D2BD] rounded-md overflow-hidden">
            <button
              className={`flex w-100 justify-center items-center py-[10px] font-medium text-black ${
                status === "Invoice" ? "bg-black text-white" : ""
              }`}
              onClick={() => {
                setStatus("Invoice");
                setSuccessMsg("");
                // invoiceReset({
                //   invoiceStatus: "Not Sent",
                //   invoiceDate: "",
                // });
              }}
            >
              Invoice Sending Status
            </button>
            <button
              className={`flex w-100 justify-center items-center py-[10px] font-medium text-black ${
                status === "Receipt" ? "bg-black text-white" : ""
              }`}
              onClick={() => {
                setStatus("Receipt");
                setSuccessMsg("");
                // receiptReset({
                //   receiptStatus: "Pending",
                //   receiptDate: "",
                //   paidReceipt: "",
                //   pendingReceipt: "",
                // });
              }}
            >
              Receipt Status
            </button>
          </div>

          <div className="mt-[20px] flex flex-col items-center">
            {status === "Invoice" ? <Form1 /> : <Form2 />}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={creditNote}
        onClose={() => {
          setCreditNote(false);
          reset();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: { width: "600px" },
        }}
      >
        <DialogContent>
          <Form3 />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EachCompanyBillingAccount;
