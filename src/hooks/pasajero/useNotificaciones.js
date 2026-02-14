import { useState, useCallback, useEffect, useRef } from "react";
import { useWebSocket } from "../web-socket/useWebSocket";
import { useNotificationContext } from "../../context/NotificationContext";

/**
 * Hook para recibir notificaciones del backend vía WebSocket (STOMP).
 * Se suscribe a /user/queue/notificaciones (destino de Spring convertAndSendToUser).
 *
 * Cada notificación recibida se:
 * 1. Almacena en un historial local (persistido en sessionStorage).
 * 2. Dispara un toast global vía NotificationContext.
 */
export const useNotificaciones = () => {
  const { isConnected, subscribe, connect } = useWebSocket(false);
  const { pushNotification } = useNotificationContext();

  const [notificaciones, setNotificaciones] = useState(() => {
    try {
      const saved = sessionStorage.getItem("ws_notificaciones");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const subscribedRef = useRef(false);

  /** Persiste historial en sessionStorage */
  const persistir = useCallback((lista) => {
    try {
      sessionStorage.setItem("ws_notificaciones", JSON.stringify(lista.slice(-50)));
    } catch {

    }
  }, []);

  /** Procesa una notificación entrante del backend (RecargaNotificacionDTO) */
  const procesarNotificacion = useCallback(
    (payload) => {
      
      const esRecarga = payload.tipo === "RECARGA_EXITOSA";

      const nueva = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        titulo: esRecarga ? "Recarga exitosa" : (payload.titulo || "Notificación"),
        mensaje: payload.mensaje || "",
        tipo: payload.tipo || "info",
        fecha: payload.fechaTransaccion || new Date().toISOString(),
        leida: false,
        datos: {
          idRecarga: payload.idRecarga || null,
          monto: payload.monto || null,
          nuevoSaldo: payload.nuevoSaldo || null,
          medioPago: payload.medioPago || null,
        },
      };

      setNotificaciones((prev) => {
        const updated = [nueva, ...prev].slice(0, 50);
        persistir(updated);
        return updated;
      });

      // Mapeo de tipo backend → tipo toast
      const tipoToast =
        nueva.tipo === "RECARGA_EXITOSA" || nueva.tipo === "SUCCESS"
          ? "success"
          : nueva.tipo === "ERROR"
          ? "error"
          : nueva.tipo === "WARNING"
          ? "warning"
          : "info";

      pushNotification({
        title: nueva.titulo,
        message: nueva.mensaje,
        type: tipoToast,
        duration: 6000,
      });
    },
    [pushNotification, persistir]
  );

  /** Conectar y suscribirse */
  const conectar = useCallback(async () => {
    if (subscribedRef.current) return;

    try {
      await connect();
    } catch (err) {
      console.error("[Notificaciones] Error al conectar:", err);
    }
  }, [connect]);

  /** Suscribirse cuando la conexión esté lista */
  useEffect(() => {
    if (isConnected && !subscribedRef.current) {
      const subId = subscribe("/user/queue/notificaciones", (payload) => {
        procesarNotificacion(payload);
      });
      subscribedRef.current = true;
    }

  }, [isConnected, subscribe, procesarNotificacion]);

  /** Marcar una notificación como leída */
  const marcarLeida = useCallback(
    (id) => {
      setNotificaciones((prev) => {
        const updated = prev.map((n) =>
          n.id === id ? { ...n, leida: true } : n
        );
        persistir(updated);
        return updated;
      });
    },
    [persistir]
  );

  /** Marcar todas como leídas */
  const marcarTodasLeidas = useCallback(() => {
    setNotificaciones((prev) => {
      const updated = prev.map((n) => ({ ...n, leida: true }));
      persistir(updated);
      return updated;
    });
  }, [persistir]);

  /** Limpiar historial */
  const limpiarHistorial = useCallback(() => {
    setNotificaciones([]);
    sessionStorage.removeItem("ws_notificaciones");
  }, []);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return {
    notificaciones,
    noLeidas,
    isConnected,
    conectar,
    marcarLeida,
    marcarTodasLeidas,
    limpiarHistorial,
  };
};
