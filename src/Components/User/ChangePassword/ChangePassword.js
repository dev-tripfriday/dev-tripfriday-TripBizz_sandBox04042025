import React, { useContext, useState } from "react";
import "./ChangePassword.css";
import { useNavigate } from "react-router-dom";
import MyContext from "../../Context";
import Navbar from "../../Flights/FlightSearch/Navbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import { SiTicktick } from "react-icons/si";
const ChangePassword = () => {
  var { actions, userAccountDetails, changePasswordError } =
    useContext(MyContext);
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });
  var [confirmError, setConfirmError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [open, setOpen] = useState(false);
  var handleSubmit = async () => {
    if (oldPassword === "") {
      setConfirmError("Please enter old password");
      return false;
    }
    if (newPassword === "") {
      setConfirmError("Please enter new password");
      return false;
    }
    if (confirmPassword === "") {
      setConfirmError("Please enter confirm password");
      return false;
    }
    setErrors({
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
    });
    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords does not match");
      return;
    }
    await actions.changeUserPassword(
      userAccountDetails.email,
      oldPassword,
      newPassword
    );
    setOpen(true);
    setRedirecting(true);
    let countdownTimer = 3;
    const intervalId = setInterval(async () => {
      setCountdown(countdownTimer);
      if (countdownTimer === 0) {
        clearInterval(intervalId);
        await actions.signOut();
      }
      countdownTimer -= 1;
    }, 1000);
  };
  const validateInput = (name, value) => {
    if (name === "oldpassword") {
      setErrors({
        ...errors,
        oldpassword: value.trim() === "" ? "Old password is required" : "",
      });
    } else if (name === "newpassword") {
      setErrors({
        ...errors,
        newpassword: value.trim() === "" ? "New password is required" : "",
      });
    } else if (name === "confirmpassword") {
      setErrors({
        ...errors,
        confirmpassword:
          value.trim() === "" ? "Confirm password is required" : "",
      });
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Navbar />
      <div className="changepassword-block">
        <div className="changepassword-main">
          <div className="changepassword-main-header">Change Password</div>
          <div className="changepassword-body">
            <div className="changepassword-feild">
              Old Password
              <div className="changepassword-type-input">
                <input
                  type="text"
                  placeholder="Enter old password"
                  name="oldpassword"
                  value={oldPassword}
                  onChange={(e) => {
                    validateInput(e.target.name, e.target.value);
                    setOldPassword(e.target.value);
                  }}
                  onBlur={(e) => validateInput(e.target.name, e.target.value)}
                />
              </div>
              <div className="error-message">{errors.oldpassword}</div>
            </div>
            <div className="changepassword-feild">
              New Password
              <div className="changepassword-type-input">
                <input
                  type="text"
                  placeholder="Enter new password"
                  name="newpassword"
                  value={newPassword}
                  onChange={(e) => {
                    validateInput(e.target.name, e.target.value);
                    setNewPassword(e.target.value);
                  }}
                  onBlur={(e) => validateInput(e.target.name, e.target.value)}
                />
              </div>
              <div className="error-message">{errors.newpassword}</div>
            </div>
            <div className="changepassword-feild">
              Confirm new Password
              <div className="changepassword-type-input">
                <input
                  type="text"
                  placeholder="Confirm new password"
                  name="confirmpassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    validateInput(e.target.name, e.target.value);
                    setConfirmPassword(e.target.value);
                  }}
                  onBlur={(e) => validateInput(e.target.name, e.target.value)}
                />
              </div>
              <div className="error-message">{errors.confirmpassword}</div>
            </div>
            <div className="error-message">{confirmError}</div>
            <div className="changepassword-submit">
              <button onClick={handleSubmit}>Change Password</button>
            </div>
            <div className="error-message">{changePasswordError}</div>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContentText
          id="alert-dialog-description"
          sx={{ visibility: "hidden" }}
        >
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText>
        <DialogTitle id="alert-dialog-title" sx={{ margin: "auto" }}>
          {"Password reset Successfull"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SiTicktick size={100} color="green" className="m-auto" />
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            <p className="text-center py-4">
              Redirecting to Login in {countdown} seconds....
            </p>
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default ChangePassword;
