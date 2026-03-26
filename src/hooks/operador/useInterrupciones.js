import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createInterrupcion,
  deleteInterrupcion,
  getInterrupciones,
  solveInterrupcion,
  updateInterrupcion,
} from "../../services/operador";
import { useWebSocket } from "../web-socket/useWebSocket";
import { useNotificationContext } from "../../context/NotificationContext";

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
  const targetId = Number(entity.id);
  const index = list.findIndex((it) => Number(it.id) === targetId);

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

export const useInterrupciones = () => {
  const [interrupciones, setInterrupciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleCreateInterrupcion = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const created = await createInterrupcion(payload);
      const mapped = mapInterrupcion(created);
      setInterrupciones((prev) => upsertById(prev, mapped));
      setSuccess("Interrupción creada exitosamente");
      return created;
    } catch (err) {
      setError(err.message || "Error al crear interrupción");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInterrupcion = async (id, payload) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await updateInterrupcion(id, payload);
      const mapped = mapInterrupcion(updated);
      setInterrupciones((prev) => upsertById(prev, mapped));
      setSuccess("Interrupción actualizada exitosamente");
      return updated;
    } catch (err) {
      setError(err.message || "Error al actualizar interrupción");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterrupcion = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteInterrupcion(id);
      setInterrupciones((prev) => removeById(prev, id));
      setSuccess("Interrupción eliminada exitosamente");
    } catch (err) {
      setError(err.message || "Error al eliminar interrupción");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSolveInterrupcion = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await solveInterrupcion(id);
      setInterrupciones((prev) =>
        prev.map((item) =>
          Number(item.id) === Number(id) ? { ...item, estado: "SOLUCIONADA" } : item,
        ),
      );
      setSuccess("Interrupción marcada como solucionada");
    } catch (err) {
      setError(err.message || "Error al solucionar interrupción");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

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

          const type = action === "CREAR" || action === "SOLUCIONAR" ? "success" : "info";
          const title =
            action === "CREAR"
              ? "Nueva interrupción"
              : action === "SOLUCIONAR"
              ? "Interrupción solucionada"
              : "Interrupción actualizada";

          pushNotification({
            title,
            message: `${mapped.nombreEstacion || "Estación"} - ${mapped.descripcion || "Sin descripción"}`,
            type,
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

  const stats = useMemo(() => {
    const total = interrupciones.length;
    const solucionadas = interrupciones.filter((it) => String(it.estado).toUpperCase() === "SOLUCIONADA").length;
    const activas = total - solucionadas;
    return { total, activas, solucionadas };
  }, [interrupciones]);

  return {
    interrupciones,
    loading,
    error,
    success,
    isWebSocketConnected: isConnected,
    stats,
    fetchInterrupciones,
    handleCreateInterrupcion,
    handleUpdateInterrupcion,
    handleDeleteInterrupcion,
    handleSolveInterrupcion,
    clearMessages,
  };
};