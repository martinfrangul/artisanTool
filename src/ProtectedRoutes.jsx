/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

const ProtectedRoutes = ({ children }) => {
  const context = useContext(AuthContext);

  const { user } = context;

  if (user === null) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
