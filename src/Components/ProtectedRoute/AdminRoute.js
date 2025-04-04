import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import MyContext from "../Context";
import SignUpPage from "../Authentication/SignUpPage/SignUpPage";
import LoginPage from "../Authentication/LoginPage/LoginPage";

const AdminRoute = ({ element, signUp }) => {
  const { actions, userLoginStatus } = useContext(MyContext);

  if (userLoginStatus.isLoading) {
    return <div>Loading</div>;
  } else if (userLoginStatus.loggedIn) {
    if (userLoginStatus.role === "admin") {
      <Navigate to="/admin" state={{ shouldShowToast: true }} />;
      return element;
    } else {
      actions.signOut();
      return <Navigate to="/login" state={{ shouldShowToast: true }} />;
    }
  }
  return (
    <>
      {signUp ? <SignUpPage /> : <LoginPage />}

      {/* <Navigate to="/login" state={{ shouldShowToast: true }} /> */}
    </>
  );
};

export default AdminRoute;
