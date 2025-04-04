import { Navigate } from "react-router-dom";
import useIsAdmin from "../hooks/useIsAdmin";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />; // o mostrar "Acceso denegado"

  return children;
};

export default AdminRoute;
