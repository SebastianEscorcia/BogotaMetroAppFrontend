import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthUserContext";

export const RoleGuard = ({ allowedRoles, children }) => {
  const { rol, loading, isAuthenticated } = useAuth();
  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRol = String(rol || "").toUpperCase().replace("ROLE_", "");

  if (!normalizedRol || !allowedRoles.includes(normalizedRol)) {
    console.log("RoleGuard - RECHAZADO, redirigiendo a /unauthorized");1
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};
