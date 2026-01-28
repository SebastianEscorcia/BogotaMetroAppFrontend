import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthUserContext";

export const RoleGuard = ({ allowedRoles, children }) => {
  const { rol, loading } = useAuth();
  console.log("RoleGuard - loading:", loading);
  console.log("RoleGuard - rol del contexto:", rol);
  console.log("RoleGuard - allowedRoles:", allowedRoles);
  console.log("RoleGuard - includes?:", allowedRoles.includes(rol));
  if (loading) return null;

  if (!allowedRoles.includes(rol)) {
     console.log("RoleGuard - RECHAZADO, redirigiendo a /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }
  console.log("RoleGuard - ACEPTADO");
  return children;
};

