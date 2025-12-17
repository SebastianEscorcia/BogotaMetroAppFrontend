import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthUserContext";

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};
