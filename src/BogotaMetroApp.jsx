import {
  Login,
  Welcome,
  Register,
  RecoverPassword,
  ResetPassword,
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
  DashBoardAdmin,
  DashboardSoporte,
} from "./views";
import {
  MapFaq,
  MetroAppFaq,
  MetroCardFaq,
  MetroPayFaq,
  MoreServicesFaq,
  RatesFaq,
  RechargeFaq,
  RegisterFaq,
  ScheduleFaq,
  TransportFaq,
  UpdateDataFaq,
  TransferBalanceFaq,
} from "./views/questions-and-answer-faq";
import "./assets/styles/layout.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthUserContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ROLES } from "./helpers";
import { ProtectedRoute, PublicRoute, RoleGuard } from "./guards";
import LineTwo from "./views/linetwo/LineTwo";
import LineThree from "./views/linethree/LineThree";
import { SystemNotificationCenter } from "./components/common";
export const BogotaMetroApp = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
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
            <Route path="/reset-password" element={<ResetPassword />} />
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
            <Route
              path="/faq/registro"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <RegisterFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/recarga"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <RechargeFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/metroapp"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <MetroAppFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/pasarsaldo"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <TransferBalanceFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/metropay"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <MetroPayFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/masservicios"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <MoreServicesFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/transporte"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <TransportFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/tarifas"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <RatesFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/tarjetametro"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <MetroCardFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/horarios"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <ScheduleFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/mapa"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <MapFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/faq/actualizardatos"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.PASAJERO]}>
                    <UpdateDataFaq />
                  </RoleGuard>
                </ProtectedRoute>
              }
            ></Route>

            {/* Rutas de Administrador */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                    <DashBoardAdmin />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            {/* Rutas de Soporte */}
            <Route
              path="/soporte/dashboard"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={[ROLES.SOPORTE]}>
                    <DashboardSoporte />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <SystemNotificationCenter />
      </NotificationProvider>
    </AuthProvider>
  );
};
