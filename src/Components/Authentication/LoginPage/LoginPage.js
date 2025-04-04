import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../Context";
import "./LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import Popup from "../../Popup";
import OtpInput from "react-otp-input";

const LoginPage = () => {
  const auth = getAuth();
  const { actions, userAccountDetails, loginError, userLoginStatus } =
    useContext(MyContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [logging, setLogging] = useState(false);
  const [forgotPopup, setForgotPopup] = useState(false);
  const [otpMode, setOtpMode] = useState(false); // new state to toggle OTP mode
  const [otpSent, setOtpSent] = useState(false); // new state to indicate OTP sent
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [emailForOtp, setEmailForOtp] = useState(""); // email for OTP

  const setData = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    validateInput(e.target.name, e.target.value);
  };

  const validateInput = (name, value) => {
    if (name === "email") {
      setErrors({
        ...errors,
        email: /^\S+@\S+\.\S+$/.test(value) ? "" : "Invalid email address",
      });
    } else if (name === "password") {
      setErrors({
        ...errors,
        password: value.trim() === "" ? "Password is required" : "",
      });
    }
  };

  const isValid = () => Object.values(errors).every((error) => error === "");

  const submitBtn = async () => {
    if (isValid() && userData.email && userData.password) {
      setLogging(true);
      const role = await actions.logIn(userData);
      setLogging(false);

      if (!role) {
        toast.error("Invalid Credentials", {
          position: "top-right",
          autoClose: 2000,
          transition: Bounce,
        });
      } else {
        navigate(role === "admin" ? "/bookings" : "/home/flights");
        if (role === "admin") await actions.getAllUserTrips();
      }
    } else {
      alert("All fields are required");
    }
  };

  const sendOtp = async () => {
    // Trigger OTP send logic (e.g., Firebase function)
    // actions.sendOtpToEmail(emailForOtp);
    const res = await fetch(
      "http://127.0.0.1:5001/trav-biz/us-central1/tripbizzApi/send-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "udaymamidisetti5@gmail.com" }),
      }
    );
    const data = await res.json();
    if (res.status === 200) {
      setOtpSent(true); // show OTP input once OTP is sent
      toast.success(data.message, {
        position: "top-right",
        autoClose: 2000,
        transition: Bounce,
      });
    } else {
      toast.error(data.message, {
        position: "top-right",
        autoClose: 2000,
        transition: Bounce,
      });
    }
  };

  const verifyOtp = () => {
    // Add OTP verification logic here
    console.log("OTP submitted:", otp);
  };

  useEffect(() => {
    if (state && state.shouldShowToast && !userAccountDetails) {
      setShowToast(true);
      const timeoutId = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [state, userAccountDetails]);

  return (
    <>
      <Popup condition={forgotPopup} close={() => setForgotPopup(false)}>
        <h1>Please send an email to support@tripbizz.com</h1>
        <p>OR</p>
        <h1>Contact +91 9949269044</h1>
      </Popup>
      <div className="loginPage-block">
        <ToastContainer />
        <div className="loginPage-container">
          <h1 className="loginPage-header">Login</h1>
          <div className="loginPage-body">
            <div className="loginPage-type">
              Email
              <div className="loginPage-type-input">
                <input
                  type="text"
                  placeholder="Enter your email"
                  name="email"
                  id="email"
                  value={userData.email}
                  onChange={setData}
                  className="focus:outline-none"
                />
                <span>
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              <div className="error-message">{errors.email}</div>
            </div>
            {/* Login via Password */}
            <div className="loginPage-type">
              <span>Password</span>
              <div className="loginPage-type-input">
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={userData.password}
                  onChange={setData}
                  className="focus:outline-none"
                />
                <span>
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
              <div className="error-message">{errors.password}</div>
            </div>
            {/* Login via OTP */}

            {/* Forgot password */}
            <div
              onClick={() => setForgotPopup(true)}
              className="loginPage-forgotPassword"
            >
              Forgot password?
            </div>

            {/* Submit Button */}
            <div className={`loginPage-submit ${logging ? "loading" : ""}`}>
              <button
                onClick={submitBtn}
                disabled={!isValid()}
                className="login"
                type="submit"
              >
                {logging ? <div className="spinner"></div> : "Login"}
              </button>
            </div>
            {/* <button
              onClick={() => {
                setOtpMode(!otpMode);
                setOtpSent(false);
              }}
              className="otp-login-btn"
            >
              {otpMode ? "Login via Password" : "Login with Email OTP"}
            </button> */}
            {otpMode && (
              <div className="otp-login-section">
                {!otpSent ? (
                  <>
                    <input
                      type="email"
                      placeholder="Enter your email for OTP"
                      value={emailForOtp}
                      onChange={(e) => setEmailForOtp(e.target.value)}
                      className="focus:outline-none border border-solid border-black rounded-md px-2 py-1 placeholder:text-sm"
                    />
                    <button
                      onClick={sendOtp}
                      className="bg-black rounded-md text-white text-[13px] ml-1 px-1 py-1"
                    >
                      Send OTP
                    </button>
                  </>
                ) : (
                  <>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={4}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => (
                        <input
                          {...props}
                          style={{
                            border: "1px solid black",
                            margin: "0 10px",
                            height: "6vh",
                            width: "6vh",
                            fontSize: "20px",
                            textAlign: "center",
                            borderRadius: "10%",
                            fontWeight: "normal",
                            maxHeight: "50px",
                            maxWidth: "50px",
                          }}
                        />
                      )}
                    />
                    <button onClick={verifyOtp} className="verify-otp-btn">
                      Verify OTP
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showToast && (
        <div className="alert-text">
          <span>Please login to continue to home page</span>
          <div className="alert-bar"></div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
