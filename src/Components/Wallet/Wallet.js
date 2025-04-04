import React, { useContext, useState } from "react";
//import Razorpay from 'razorpay';
import Left from "./Left";
import Navbar from "../Flights/FlightSearch/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faFileInvoiceDollar,
  faIndianRupeeSign,
  faMinus,
  faPlus,
  faReceipt,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import MyContext from "../Context";
import ReactDatePicker from "react-datepicker";

const Wallet = () => {
  const [selectedTab, setSelectedTab] = useState("wallet");
  const [walletTab, setWalletTab] = useState("RazorUPI");
  const [paymentDate, setPaymentDate] = useState(false);
  const [paymentType, setPaymentType] = useState("Bank Transfer");
  const [paymentAmount, setPaymentAmount] = useState();
  const [paymentRefNo, setPaymentRefNo] = useState();
  const [paymentBankName, setPaymentBankName] = useState();
  const [amount, setAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);
  const { actions, userAccountDetails } = useContext(MyContext);

  const handlePaymentSuccess = async (payment) => {
    await actions.updateWalletBalance(payment, amount);
    console.log("Payment successful:", payment);

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
        name: userAccountDetails.firstName,
        email: userAccountDetails.email,
        contact: userAccountDetails.mobileNumber,
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
        name: userAccountDetails.firstName,
        email: userAccountDetails.email,
        contact: userAccountDetails.mobileNumber,
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
  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row">
        <Left selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <div className="wallet-container w-[100%] md:w-[75%] m-auto">
          {selectedTab === "wallet" && (
            <div className="wallet-block rounded-[0.8rem] border-[1px] border-solid border-[#001219] shadow-md w-[95%] m-auto">
              <div className="wallet-header md:text-[18pt] font-bold p-[10pt] border-b-[1px] border-b-solid border-b-[#d4d3d3] flex items-center justify-between">
                Load Wallet
                <div className="rounded-[0.8rem] p-[10pt] border-[1px] border-solid border-[#001219] text-[10pt] font-light">
                  Current Balance <FontAwesomeIcon icon={faIndianRupeeSign} />
                  <span className="font-bold">
                    {Math.ceil(userAccountDetails?.balance).toLocaleString()}
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
                            <span className="details">Quikprocess Pvt Ltd</span>
                          </span>
                          <span>
                            Bank Name:
                            <span className="details">Kotak Mahindra Bank</span>
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
                            <span className="details">Quikprocess Pvt Ltd</span>
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
                            <FontAwesomeIcon icon={faMinus} className="icon" />
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
    </>
  );
};

export default Wallet;
