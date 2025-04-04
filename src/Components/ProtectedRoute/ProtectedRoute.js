import { Navigate, Outlet, useParams } from "react-router-dom";
import { useContext } from "react";
import MyContext from "../Context";
import LoginPage from "../Authentication/LoginPage/LoginPage";
import SignUpPage from "../Authentication/SignUpPage/SignUpPage";

const ProtectedRoute = ({ element, signUp }) => {
  const { userLoginStatus } = useContext(MyContext);

  if (userLoginStatus.isLoading) {
    return <div>Loading</div>;
  } else if (userLoginStatus.loggedIn) {
    return element;
  }
  return (
    <>
      {signUp ? <SignUpPage /> : <LoginPage />}
      {/* <Navigate to="/login" state={{ shouldShowToast: true }} /> */}
    </>
  );
};

export default ProtectedRoute;
