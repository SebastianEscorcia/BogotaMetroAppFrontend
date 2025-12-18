import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthUserContext";

export const RoleGuard = ({ allowedRoles, children }) => {
  const { rol, loading } = useAuth();

  if (loading) return null;

  if (!allowedRoles.includes(rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

