import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthUserContext";

export const RoleGuard = ({ allowedRoles, children }) => {
  const { rol, loading, isAuthenticated } = useAuth();
  if (loading) return null;

  if (!isAuthenticated ) {
    return <Navigate to="/login" replace />;
  }

  if (!rol) {
    return <Navigate to="/login" replace />;
  };

  if (!allowedRoles.includes(rol)) {
    console.log("RoleGuard - RECHAZADO, redirigiendo a /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};
