import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import "./otp.css";
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(true);
  useEffect(() => {
    if (time <= 0) {
      setIsTimerActive(false);
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval); 
  }, [time]);

  const handleResend = useCallback(() => {
    setTime(300); 
    setIsTimerActive(true);
  }, []);
  console.log("first")
  return (
    <div className="otp-main-container">
      <div className="otp-child-container">
        <div className="lock-icon-container">
          <FontAwesomeIcon icon={faLock} />
        </div>
        <h1 className="otp-title">Verification Code</h1>
        <p className="otp-description">
          Please enter the verification code sent to your email
        </p>
        <OtpInput
          containerStyle={{ alignSelf: "center" }}
          inputStyle="otp-input"
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
        <button className="verify-btn">Verify</button>
      {isTimerActive ?<p className="resent-title">Resend OTP in <span className="otp-timer">{formatTime(time)}</span></p>:null}
       {!isTimerActive&&<p className="title" onClick={handleResend}>Resend OTP</p>}
      </div>
    </div>
  );
};

export default OtpPage;
