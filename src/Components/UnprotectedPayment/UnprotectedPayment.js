import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faCreditCard,
  faFileInvoiceDollar,
  faIndianRupeeSign,
  faMinus,
  faPlus,
  faReceipt,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import MyContext from "../Context";
import ReactDatePicker from "react-datepicker";
import Left from "../Wallet/Left";
import { useParams } from "react-router-dom";
import { db } from "../MyProvider";
import { ScaleLoader } from "react-spinners";
const UnProtectedPayment = () => {
  const { userId } = useParams();
  const [selectedTab, setSelectedTab] = useState("wallet");
  const [walletTab, setWalletTab] = useState("RazorUPI");
  const [paymentDate, setPaymentDate] = useState(false);
  const [paymentType, setPaymentType] = useState("Bank Transfer");
  const [paymentAmount, setPaymentAmount] = useState();
  const [paymentRefNo, setPaymentRefNo] = useState();
  const [paymentBankName, setPaymentBankName] = useState();
  const [amount, setAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);
  const [userData, setUserData] = useState();
  const { actions, userAccountDetails } = useContext(MyContext);
  const [Loading, setLoading] = useState(false);
  const [paymenLoading, setPaymentLoading] = useState(false);
  const handlePaymentSuccess = async (payment) => {
    setPaymentLoading(true);
    await actions.updateWalletBalanceOutside(payment, amount, userId);
    console.log("Payment successful:", payment);
    setPaymentLoading(false);
    // Handle successful payment here
  };
  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
    // Handle payment failure here
  };
  const openUPIPaymentModal = async () => {
    var order = await actions.createOrder(amount * 100);
    const options = {
      key: "rzp_live_EtmEgWrkUdJez0",
      amount: amount * 100,
      currency: "INR",
      name: "Tripbizz",
      description: "Test Transaction",
      image: "/logo/tripbizz-logo.png",
      order_id: order.id,
      prefill: {
        name: userData.firstName,
        email: userData.email,
        contact: userData.mobileNumber,
      },
      notes: {
        address: "Tripbizz payment integration",
      },
      config: {
        display: {
          hide: [
            {
              method: "cardless_emi",
            },
            {
              method: "wallet",
            },
            {
              method: "netbanking",
            },
            {
              method: "card",
            },
          ],
        },
      },
      theme: {
        color: "#94d2bd",
      },
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      modal: {
        ondismiss: function () {
          handlePaymentFailure({ code: "USER_CANCELLED" });
        },
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  const openBankPaymentModal = async () => {
    var order = await actions.createOrder(
      bankAmount * 100 + bankAmount * 100 * 0.03
    );
    const options = {
      key: "rzp_live_EtmEgWrkUdJez0",
      amount: bankAmount * 100 + bankAmount * 100 * 0.03,
      currency: "INR",
      name: "Tripbizz",
      description: "Test Transaction",
      image: "/logo/tripbizz-logo.png",
      order_id: order.id,
      prefill: {
        name: userData.firstName,
        email: userData.email,
        contact: userData.mobileNumber,
      },
      notes: {
        address: "Tripbizz payment integration",
      },
      config: {
        display: {
          hide: [
            {
              method: "upi",
            },
          ],
        },
      },
      theme: {
        color: "#94d2bd",
      },
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      modal: {
        ondismiss: function () {
          handlePaymentFailure({ code: "USER_CANCELLED" });
        },
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const submitForm = async () => {
    setPaymentAmount();
    setPaymentBankName();
    setPaymentDate();
    setPaymentRefNo();
    setPaymentType();
  };
  const getUserData = async () => {
    try {
      setLoading(true);
      var userCollectionRef = db.collection("Accounts").doc(userId);
      var doc = await userCollectionRef.get();
      var userData = await doc.data();
      console.log(userData);
      setUserData(userData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserData();
  }, [paymenLoading]);

  return (
    <div>
      {Loading ? (
        <div className="flex items-center justify-center h-[100vh">
          {" "}
          <ScaleLoader />{" "}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          <div className="left-block !w-[100%] lg:!w-[25%]">
            <div className="left-logo">
              <span>
                <FontAwesomeIcon icon={faUser} />
              </span>
              <div className="left-logo-details">
                <span>{userData?.firstName}</span>
                <span>{userData?.email}</span>
              </div>
            </div>
            <div className="left-content">
              <div className="left-links flex gap-2 md:flex-col p-[10px]">
                <div
                  onClick={() => {
                    setSelectedTab("wallet");
                  }}
                  className={`${
                    selectedTab === "wallet" ? "active" : ""
                  } p-[7px] px-3 flex items-center gap-2 cursor-pointer`}
                >
                  <FontAwesomeIcon icon={faWallet} className="left-icon" />
                  &nbsp;&nbsp;Load Wallet
                </div>
                <div
                  onClick={() => {
                    setSelectedTab("transactions");
                  }}
                  className={`${
                    selectedTab === "transactions" ? "active" : ""
                  } p-[7px] px-3 flex items-center gap-2 cursor-pointer pointer-events-none`}
                >
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    style={{ "--fa-secondary-opacity": "1" }}
                    className="left-icon"
                  />
                  &nbsp;&nbsp;Transactions
                </div>
              </div>
            </div>
          </div>
          <div className="wallet-container w-[100%] md:w-[75%] m-auto">
            {selectedTab === "wallet" && (
              <div className="wallet-block rounded-[0.8rem] border-[1px] border-solid border-[#001219] shadow-md w-[95%] m-auto">
                <div className="wallet-header md:text-[18pt] font-bold p-[10pt] border-b-[1px] border-b-solid border-b-[#d4d3d3] flex items-center justify-between">
                  Load Wallet
                  <div className="rounded-[0.8rem] p-[10pt] border-[1px] border-solid border-[#001219] text-[10pt] font-light">
                    Current Balance <FontAwesomeIcon icon={faIndianRupeeSign} />
                    <span className="font-bold">
                      {Math.ceil(userData?.balance).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="wallet-content mt-[10pt]">
                  <div className="wallet-content-tabs w-[100%] flex items-center">
                    <span
                      className={
                        walletTab === "RazorUPI"
                          ? "border-b-[4px] border-b-solid border-b-[#94D2BD] text-[12px] md:text-[16px]"
                          : " text-[12px] md:text-[16px]"
                      }
                      onClick={() => setWalletTab("RazorUPI")}
                    >
                      <FontAwesomeIcon icon={faReceipt} />
                      &nbsp;
                      <br />
                      Razorpay UPI
                    </span>
                    <span
                      className={
                        walletTab === "RazorBank"
                          ? "border-b-[4px] border-b-solid border-b-[#94D2BD] text-[12px] md:text-[16px]"
                          : " text-[12px] md:text-[16px]"
                      }
                      onClick={() => setWalletTab("RazorBank")}
                    >
                      <FontAwesomeIcon icon={faReceipt} />
                      &nbsp;
                      <br />
                      Razorpay NetBanking/Cards
                    </span>
                    <span
                      className={
                        walletTab === "Bank"
                          ? "border-b-[4px] border-b-solid border-b-[#94D2BD] text-[12px] md:text-[16px] w-[100%]"
                          : " text-[12px] md:text-[16px]"
                      }
                      onClick={() => setWalletTab("Bank")}
                    >
                      <FontAwesomeIcon icon={faBuildingColumns} />
                      &nbsp;
                      <br />
                      Direct UPI/Bank Transfer
                    </span>
                  </div>
                  {walletTab === "RazorUPI" ? (
                    <div className="wallet-razorUPI">
                      <span>
                        Initiate a secure transaction with Razorpay, a trusted
                        payment gateway. Our platform supports RazorPay UPI,
                        ensuring a seamless and secure payment experience
                      </span>
                      <div className="razorUPI-input">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <button onClick={openUPIPaymentModal}>
                          <FontAwesomeIcon icon={faFileInvoiceDollar} />
                          &nbsp;Pay with Razorpay UPI
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {walletTab === "RazorBank" ? (
                    <div className="wallet-razorUPI">
                      <span>
                        Initiate a secure transaction with Razorpay, a trusted
                        payment gateway. Our platform supports RazorPay Bank
                        Transfer, ensuring a seamless and secure payment
                        experience(3% fee)
                      </span>
                      <div className="razorUPI-input">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={bankAmount}
                          onChange={(e) => setBankAmount(e.target.value)}
                        />
                        <button onClick={openBankPaymentModal}>
                          <FontAwesomeIcon icon={faFileInvoiceDollar} />
                          &nbsp;Pay with Razorpay Bank Transfer
                        </button>
                      </div>
                      <div className="wallet-fees">
                        <span>3% transaction fees</span> will be applicable on
                        this trasnsactions
                      </div>
                    </div>
                  ) : null}
                  {walletTab === "Bank" ? (
                    <div className="bank-container">
                      <div className="wallet-bank-form">
                        <span className="wallet-form-header">
                          Submit Transaction Details
                        </span>
                        <div className="wallet-form">
                          <input
                            type="number"
                            placeholder="Enter the amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Enter the reference number"
                            value={paymentRefNo}
                            onChange={(e) => setPaymentRefNo(e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Enter the Bank name"
                            value={paymentBankName}
                            onChange={(e) => setPaymentBankName(e.target.value)}
                          />
                          <ReactDatePicker
                            minDate={new Date()}
                            selectsStart
                            popperPlacement="auto-start"
                            showPopperArrow={false}
                            onChange={(e) => setPaymentDate(e)}
                            showMonthYearDropdown
                            dateFormat="EEE, MMM d"
                            fixedHeight
                            withPortal
                            placeholderText="Payment date"
                            className="flightSearch-dates-input"
                            id="flightSearch-departureDate"
                          />
                          <div>
                            <select
                              value={paymentType}
                              onChange={(e) => setPaymentType(e.target.value)}
                            >
                              <option>Bank Transfer</option>
                              <option>UPI</option>
                            </select>
                          </div>
                        </div>
                        <div className="wallet-form-btn">
                          <button onClick={submitForm}>Submit</button>
                        </div>
                      </div>
                      <div className="wallet-Bank">
                        <div className="bankTransfer">
                          <span>Transfer to TripBizz Bank Account</span>
                          <div className="bankTransfer-details">
                            <span>
                              Account Number:
                              <span className="details">9511969684</span>
                            </span>
                            <span>
                              {" "}
                              Account Name:
                              <span className="details">
                                Quikprocess Pvt Ltd
                              </span>
                            </span>
                            <span>
                              Bank Name:
                              <span className="details">
                                Kotak Mahindra Bank
                              </span>
                            </span>
                            <span>
                              IFSC Code:
                              <span className="details">KKBK0000564</span>
                            </span>
                          </div>
                        </div>
                        <div className="UPITransfer">
                          <span>Transfer to TripBizz UPI </span>
                          <div className="UPITransfer-details">
                            <span>
                              UPI Id:
                              <span className="details">tripfriday@ybl</span>
                            </span>
                            <span>
                              Name:
                              <span className="details">
                                Quikprocess Pvt Ltd
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            {selectedTab === "transactions" && (
              <div className="transactions-block">
                <div className="transactions-header">
                  Transactions
                  <div>
                    Current Balance <FontAwesomeIcon icon={faIndianRupeeSign} />
                    <span>
                      {Math.ceil(userAccountDetails?.balance).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="transactions-content">
                  <div className="transactions-content-header">
                    <span>Date/Time</span>
                    <span>Application</span>
                    <span>Type</span>
                    <span>Amount</span>
                    <span>Balance</span>
                  </div>
                  {userAccountDetails?.transactions
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
                              <FontAwesomeIcon
                                icon={faMinus}
                                className="icon"
                              />
                            ) : (
                              <FontAwesomeIcon icon={faPlus} className="icon" />
                            )}
                            &nbsp;
                            <FontAwesomeIcon
                              icon={faIndianRupeeSign}
                              className="icon"
                            />
                            {Math.ceil(payment.amount).toLocaleString()}
                          </span>
                          <span>
                            <FontAwesomeIcon
                              icon={faIndianRupeeSign}
                              className="icon"
                            />
                            {Math.ceil(payment.balance).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnProtectedPayment;
