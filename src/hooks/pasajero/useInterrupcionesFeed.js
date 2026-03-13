import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getInterrupciones } from "../../services/operador/interrupciones.service";
import { useWebSocket } from "../web-socket/useWebSocket";
import { useNotificationContext } from "../../global/context/NotificationContext";

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

const mapInterrupcion = (item = {}) => ({
  ...item,
  id: Number(item.id ?? item.idInterrupcion),
  tipo: item.tipo ?? item.tipoInterrupcion,
  idEstacion: item.idEstacion ? Number(item.idEstacion) : null,
  idLinea: item.idLinea ? Number(item.idLinea) : null,
});

const upsertById = (list, entity) => {
  const id = Number(entity.id);
  const index = list.findIndex((it) => Number(it.id) === id);

  if (index === -1) {
    return [entity, ...list];
  }

  const next = [...list];
  next[index] = entity;
  return next;
};

const removeById = (list, id) => list.filter((it) => Number(it.id) !== Number(id));

const normalizeEvent = (message) => {
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

export const useInterrupcionesFeed = () => {
  const [interrupciones, setInterrupciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { pushNotification } = useNotificationContext();
  const { connect, subscribe, isConnected } = useWebSocket(false);
  const subscriptionRef = useRef(null);

  const fetchInterrupciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInterrupciones();
      setInterrupciones((data || []).map(mapInterrupcion));
    } catch (err) {
      setError(err.message || "Error al cargar interrupciones");
      setInterrupciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterrupciones();
  }, [fetchInterrupciones]);

  useEffect(() => {
    let mounted = true;

    const startWebSocket = async () => {
      try {
        await connect();
        if (!mounted || subscriptionRef.current) return;

        subscriptionRef.current = subscribe(TOPIC_INTERRUPCIONES, (message) => {
          const normalized = normalizeEvent(message);
          if (!normalized) return;

          const action = normalized.action;
          const payload = normalized.payload;

          if (action === "ELIMINAR") {
            const id = payload?.id ?? payload?.idInterrupcion ?? payload;
            if (!id) return;
            setInterrupciones((prev) => removeById(prev, id));
            pushNotification({
              title: "Interrupción eliminada",
              message: `Se eliminó una interrupción (ID: ${id}).`,
              type: "warning",
            });
            return;
          }

          const mapped = mapInterrupcion(payload);
          if (!mapped?.id) return;

          setInterrupciones((prev) => upsertById(prev, mapped));

          const toastTitle =
            action === "CREAR"
              ? "Nueva interrupción"
              : action === "SOLUCIONAR"
              ? "Interrupción solucionada"
              : "Interrupción actualizada";

          const toastType =
            action === "CREAR"
              ? "warning"
              : action === "SOLUCIONAR"
              ? "success"
              : "info";

          pushNotification({
            title: toastTitle,
            message: `${mapped.nombreEstacion || "Estación"}: ${mapped.descripcion || "Sin descripción"}`,
            type: toastType,
          });
        });
      } catch {
      }
    };

    startWebSocket();

    return () => {
      mounted = false;
      subscriptionRef.current = null;
    };
  }, [connect, subscribe, pushNotification]);

  const activas = useMemo(
    () => interrupciones.filter((item) => String(item.estado).toUpperCase() !== "SOLUCIONADA"),
    [interrupciones],
  );

  return {
    interrupciones,
    interrupcionesActivas: activas,
    loading,
    error,
    isWebSocketConnected: isConnected,
    refresh: fetchInterrupciones,
  };
};