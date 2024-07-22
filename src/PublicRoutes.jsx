/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);



  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PublicRoute;
