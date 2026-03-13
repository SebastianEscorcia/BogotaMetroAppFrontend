import { useState, useCallback, useEffect, useRef } from "react";
import { useWebSocket } from "../web-socket/useWebSocket";
import { useNotificationContext } from "../../global/context/NotificationContext";

const TOPIC_NOTIFICACIONES_USUARIO = "/user/queue/notificaciones";
const TOPIC_INTERRUPCIONES = "/topic/interrupciones";

const ACTION_ALIASES = {
  CREAR: "CREAR",
  CREATE: "CREAR",
  ACTUALIZAR: "ACTUALIZAR",
  UPDATE: "ACTUALIZAR",
  UPDATED: "ACTUALIZAR",
  ELIMINAR: "ELIMINAR",
  DELETE: "ELIMINAR",
  REMOVER: "ELIMINAR",
  REMOVE: "ELIMINAR",
  SOLUCIONAR: "SOLUCIONAR",
  SOLVE: "SOLUCIONAR",
  SOLVED: "SOLUCIONAR",
};

const normalizeAction = (value) => {
  if (!value) return null;
  const key = String(value).toUpperCase();
  return ACTION_ALIASES[key] ?? key;
};
const TIPO_NOTIFICACION_TITULOS = {
  RECARGA_EXITOSA:           "Recarga exitosa",
  RECARGA_FALLIDA:           "Recarga fallida",
  COBRO_PASAJE_EXITOSO:      "Pago de pasaje exitoso",
  COBRO_PASAJE_FALLIDO:      "Pago de pasaje fallido",
  DEVOLUCION_PASAJE_EXITOSA: "Devolución de pasaje",
  DEVOLUCION_PASAJE_FALLIDA: "Devolución fallida",
  SALDO_ENVIADO:             "Saldo enviado",
  SALDO_RECIBIDO:            "Saldo recibido",
};

// Función pura a nivel de módulo
const determinarTipoTransaccion = (tipo) => {
   return TIPO_NOTIFICACION_TITULOS[tipo] || "Notificación";
};

const normalizeInterrupcionEvent = (message) => {
  if (typeof message === "number" || typeof message === "string") {
    return { action: "ELIMINAR", payload: { id: Number(message) } };
  }

  if (!message || typeof message !== "object") {
    return null;
  }

  const action = normalizeAction(message.accion ?? message.action ?? message.event ?? message.tipoAccion);

  if (action) {
    return {
      action,
      payload:
        message.payload ??
        message.data ??
        message.interrupcion ??
        message.interruption ??
        message.interrupcionResponse ??
        message,
    };
  }

  if (message.id || message.idInterrupcion) {
    return { action: "ACTUALIZAR", payload: message };
  }

  return null;
};

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

  const userNotificationsSubscribedRef = useRef(false);
  const interruptionsSubscribedRef = useRef(false);

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
      
      const tipoTransaccion = determinarTipoTransaccion(payload.tipo);
      
      
      const nueva = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        titulo: tipoTransaccion,
        mensaje: payload.mensaje || "",
        tipo: payload.tipo || "info",
        fecha: payload.fechaTransaccion || new Date().toISOString(),
        leida: false,
        datos: {
          idRecarga: payload.idRecarga || null,
          monto: payload.monto || null,
          nuevoSaldo: payload.nuevoSaldo || null,
          medioDePago: payload.medioPago || null,
        },
      };

      setNotificaciones((prev) => {
        const updated = [nueva, ...prev].slice(0, 50);
        persistir(updated);
        return updated;
      });

      // Mapeo de tipo backend → tipo toast
      const tipoToast =
        nueva.tipo === "RECARGA_EXITOSA" || nueva.tipo === "SUCCESS" || nueva.tipo === "SALDO_RECIBIDO"
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

  const procesarInterrupcion = useCallback(
    (message) => {
      const normalized = normalizeInterrupcionEvent(message);
      if (!normalized) return;

      const action = normalized.action;
      const payload = normalized.payload ?? {};

      const estadoNormalizado = String(
        payload?.estado ?? payload?.estadoInterrupcion ?? ""
      ).toUpperCase();

      const effectiveAction =
        action === "ACTUALIZAR" && estadoNormalizado === "SOLUCIONADA"
          ? "SOLUCIONAR"
          : action;

      const idInterrupcion = payload?.id ? Number(payload.id) : payload?.idInterrupcion ? Number(payload.idInterrupcion) : null;
      const tipoInterrupcion =
        payload?.tipoInterrupcion || payload?.tipo || "INTERRUPCION";
      const descripcion = payload?.descripcion || "Se actualizó una interrupción del sistema.";
      const nombreLinea = payload?.nombreLinea;
      const nombreEstacion = payload?.nombreEstacion;

      const ubicacion = [nombreLinea, nombreEstacion].filter(Boolean).join(" · ");

      const titulo =
        effectiveAction === "CREAR"
          ? "Nueva interrupción reportada"
          : effectiveAction === "SOLUCIONAR"
          ? "Interrupción solucionada"
          : effectiveAction === "ELIMINAR"
          ? "Interrupción eliminada"
          : "Interrupción actualizada";

      const mensajeBase =
        effectiveAction === "ELIMINAR"
          ? `Se eliminó la interrupción${idInterrupcion ? ` #${idInterrupcion}` : ""}.`
          : effectiveAction === "SOLUCIONAR"
          ? `Se marcó como solucionada la interrupción${idInterrupcion ? ` #${idInterrupcion}` : ""}.`
          : `${tipoInterrupcion}: ${descripcion}`;

      const mensaje = ubicacion ? `${mensajeBase} (${ubicacion})` : mensajeBase;

      const nueva = {
        id: `interrupcion-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        titulo,
        mensaje,
        tipo: effectiveAction === "SOLUCIONAR" ? "SOLUCIONAR" : "INTERRUPCION",
        fecha: payload?.inicio || payload?.fecha || new Date().toISOString(),
        leida: false,
        datos: {
          idInterrupcion,
          accion: effectiveAction,
          tipoInterrupcion,
        },
      };

      setNotificaciones((prev) => {
        const updated = [nueva, ...prev].slice(0, 50);
        persistir(updated);
        return updated;
      });
    },
    [persistir]
  );

  /** Conectar y suscribirse */
  const conectar = useCallback(async () => {
    if (userNotificationsSubscribedRef.current && interruptionsSubscribedRef.current) return;

    try {
      await connect();
    } catch (err) {
      console.error("[Notificaciones] Error al conectar:", err);
    }
  }, [connect]);

  /** Suscribirse cuando la conexión esté lista */
  useEffect(() => {
    if (isConnected && !userNotificationsSubscribedRef.current) {
      subscribe(TOPIC_NOTIFICACIONES_USUARIO, (payload) => {
        procesarNotificacion(payload);
      });
      userNotificationsSubscribedRef.current = true;
    }

    if (isConnected && !interruptionsSubscribedRef.current) {
      subscribe(TOPIC_INTERRUPCIONES, (payload) => {
        procesarInterrupcion(payload);
      });
      interruptionsSubscribedRef.current = true;
    }

  }, [isConnected, subscribe, procesarNotificacion, procesarInterrupcion]);

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
