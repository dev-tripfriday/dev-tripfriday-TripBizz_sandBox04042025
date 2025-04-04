import React, { useState, useContext } from "react";
import "./SignUpPage.css";
import MyContext from "../../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const { actions } = useContext(MyContext);
  var [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const setData = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    validateInput(e.target.name, e.target.value);
  };

  const validateInput = (name, value) => {
    if (name === "userName") {
      setErrors({
        ...errors,
        userName: value.trim() === "" ? "Username is required" : "",
      });
    } else if (name === "email") {
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

  var isValid = () => {
    return Object.values(errors).every((error) => error === "");
  };

  var navigate = useNavigate();
  const submitBtn = async () => {
    if (isValid()) {
      await actions.signUp(userData);
      navigate("/login");
    } else {
      alert("All feilds are required");
    }
  };
  const handleFacebookClick = () => {
    console.log("Facebook icon is clicked");
    //actions.signInWithFacebook();
  };
  const handleGoogleClick = () => {
    console.log("Google icon is clicked");
    //actions.signInWithGoogle();
  };
  return (
    <div className="signUpPage-block">
      <div className="signUpPage-container">
        <h1 className="signUpPage-header">Sign Up</h1>
        <div className="signUpPage-body">
          <div className="signUpPage-type">
            Username
            <div className="signUpPage-type-input">
              <input
                type="text"
                placeholder="Enter your Username"
                name="userName"
                value={userData.userName}
                onChange={(e) => setData(e)}
              />
              <span>
                <FontAwesomeIcon icon={faUser} />
              </span>
            </div>
            <div className="error-message">{errors.userName}</div>
          </div>
          <div className="signUpPage-type">
            Email
            <div className="signUpPage-type-input">
              <input
                type="text"
                placeholder="Enter your email"
                name="email"
                value={userData.email}
                onChange={(e) => setData(e)}
              />
              <span>
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
            </div>
            <div className="error-message">{errors.email}</div>
          </div>
          <div className="signUpPage-type">
            Password
            <div className="signUpPage-type-input">
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={userData.password}
                onChange={(e) => setData(e)}
              />
              <span>
                <FontAwesomeIcon icon={faLock} />
              </span>
            </div>
            <div className="error-message">{errors.password}</div>
          </div>
          <div className="signUpPage-submit">
            <button onClick={submitBtn} disabled={!isValid()}>
              SIGN UP
            </button>
          </div>
          <div className="signUpPage-methods">
            Or SignUp with
            <div className="signUpPage-methods-type">
              <span className="facebook" onClick={handleFacebookClick}>
                <FontAwesomeIcon
                  icon={faFacebookF}
                  style={{ color: "#f9fafa" }}
                />
              </span>
              <span className="google" onClick={handleGoogleClick}>
                <FontAwesomeIcon icon={faGoogle} style={{ color: "#f9fafa" }} />
              </span>
            </div>
          </div>
          <div className="signUpPage-switch">
            Already a memeber?{" "}
            <Link to="/login">
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
