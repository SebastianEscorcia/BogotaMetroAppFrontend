import {
  Login,
  Welcome,
  Register,
  RecoverPassword,
  HomeScreen,
  HomeBalance,
  ConfirmInfo,
  LineOne,
  PassBalance,
  QrTravel,
  Recharge,
  Travel,
  Soporte,
  Unauthorized,
} from "./views";

import "./assets/styles/layout.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthUserContext";
import { ROLES } from "./helpers";
import { ProtectedRoute, PublicRoute, RoleGuard } from "./guards";
import LineTwo from "./views/linetwo/LineTwo";
import LineThree from "./views/linethree/LineThree";
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
                  <HomeScreen />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/homebalance"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <HomeBalance />
                </RoleGuard>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/linea-uno"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <LineOne />
                </RoleGuard>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/linea-dos"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <LineTwo />
                </RoleGuard>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/linea-tres"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <LineThree />
                </RoleGuard>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/recharge"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <Recharge />
                </RoleGuard>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/passbalance"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <PassBalance />
                </RoleGuard>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/confirmar-info"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <ConfirmInfo />
                </RoleGuard>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/travel"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <Travel />
                </RoleGuard>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/qr-travel"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <QrTravel />
                </RoleGuard>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/soporte"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                  <Soporte />
                </RoleGuard>
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
