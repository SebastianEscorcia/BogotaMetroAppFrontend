import {
  Login,
  Welcome,
  Register,
  RecoverPassword,
  Home,
  Unauthorized,
} from "./views";
import "./assets/styles/layout.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthUserContext";
import {ROLES} from './helpers'
import { ProtectedRoute, PublicRoute, RoleGuard } from "./guards";
export const BogotaMetroApp = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <Home />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
