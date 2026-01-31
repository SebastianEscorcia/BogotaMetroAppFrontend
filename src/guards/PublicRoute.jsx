import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthUserContext";

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, rol } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    switch (rol) {
      case "ADMIN":
        return <Navigate to="/admin/dashboard" replace />;
      case "PASAJERO":
        return <Navigate to="/home" replace />;
      case "OPERADOR":
        return <Navigate to="/operador/dashboard" replace />;
      case "SOPORTE":
        return <Navigate to="/soporte/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};
