import { createContext, useContext, useEffect, useMemo } from "react";
import { useAuth } from "./AuthUserContext";
import { useNotificaciones } from "../hooks/pasajero/useNotificaciones";

const WebSocketNotificationsContext = createContext(null);

export const WebSocketNotificationsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const notificacionesApi = useNotificaciones();
  const { conectar } = notificacionesApi;

  useEffect(() => {
    if (isAuthenticated) {
      conectar();
    }
  }, [isAuthenticated, conectar]);

  const contextValue = useMemo(() => notificacionesApi, [notificacionesApi]);

  return (
    <WebSocketNotificationsContext.Provider value={contextValue}>
      {children}
    </WebSocketNotificationsContext.Provider>
  );
};

export const useWebSocketNotifications = () => {
  const context = useContext(WebSocketNotificationsContext);
  if (!context) {
    throw new Error("useWebSocketNotifications debe usarse dentro de WebSocketNotificationsProvider");
  }
  return context;
};
