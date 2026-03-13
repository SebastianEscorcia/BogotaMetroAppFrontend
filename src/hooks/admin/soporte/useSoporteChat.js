import { useState, useEffect, useCallback } from "react";
import {
  obtenerSesionesPendientes,
  obtenerSesionesActivasSoporte,
} from "../../../services/chat/chatRoom.service";
import { useWebSocket } from "../../web-socket/useWebSocket";
import { useNotificationCenter } from "../../../global/context/NotificationContext";

/**
 * Hook para manejar el dashboard del soporte
 * - Lista de sesiones pendientes (cola de espera)
 * - Sesiones activas del soporte
 * - Suscripción a notificaciones de nuevas sesiones
 */
export const useSoporteChat = (idSoporte) => {
  const [sesionesPendientes, setSesionesPendientes] = useState([]);
  const [sesionesActivas, setSesionesActivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isConnected, subscribe, unsubscribe, connect } = useWebSocket(false);
  const { pushNotification } = useNotificationCenter();

  const cargarSesionesPendientes = useCallback(async () => {
    try {
      const pendientes = await obtenerSesionesPendientes();
      setSesionesPendientes(pendientes || []);
    } catch (err) {
      console.error("Error al cargar sesiones pendientes:", err);
      setError("Error al cargar sesiones pendientes");
    }
  }, []);

  const cargarSesionesActivas = useCallback(async () => {
    if (!idSoporte) return;

    try {
      const activas = await obtenerSesionesActivasSoporte(idSoporte);
      setSesionesActivas(activas || []);
    } catch (err) {
      console.error("Error al cargar sesiones activas:", err);
      setError("Error al cargar sesiones activas");
    }
  }, [idSoporte]);

  const cargarTodo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([cargarSesionesPendientes(), cargarSesionesActivas()]);
    } finally {
      setLoading(false);
    }
  }, [cargarSesionesPendientes, cargarSesionesActivas]);

  const refrescar = useCallback(() => {
    cargarTodo();
  }, [cargarTodo]);

  const quitarDePendientes = useCallback((idSesion) => {
    setSesionesPendientes((prev) =>
      prev.filter((sesion) => sesion.id !== idSesion)
    );
  }, []);

  const agregarAActivas = useCallback((sesion) => {
    setSesionesActivas((prev) => [...prev, sesion]);
  }, []);

  const quitarDeActivas = useCallback((idSesion) => {
    setSesionesActivas((prev) =>
      prev.filter((sesion) => sesion.id !== idSesion)
    );
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  const mostrarError = useCallback((mensaje) => {
    setError(mensaje);
  }, []);

  // Conectar WebSocket y suscribirse a notificaciones
  useEffect(() => {
    const inicializarWebSocket = async () => {
      try {
        await connect();
        console.log(" WebSocket conectado (soporte)");
      } catch (err) {
        console.error("Error al conectar WebSocket:", err);
      }
    };

    inicializarWebSocket();
  }, [connect]);

  // Suscribirse a notificaciones de nuevas sesiones pendientes
  useEffect(() => {
    if (!isConnected) return;

    // Suscripción a topic de nuevas sesiones pendientes
    // Tu backend publica el id de la sesión cuando un pasajero solicita chat
    const subscriptionId = subscribe(
      "/topic/sesiones-pendientes",
      (payload) => {
        console.log("📩 Nueva sesión pendiente:", payload);

        if (payload?.id) {
          setSesionesPendientes((prev) => {
            const existe = prev.some((s) => s.id === payload.id);
            if (existe) return prev;
            return [...prev, payload];
          });
        }

        pushNotification({
          title: "Nuevo chat pendiente",
          message: "Hay un pasajero esperando soporte.",
          type: "info",
        });
      }
    );
    if (!subscriptionId) {
      console.warn(" Suscripción fallida a /topic/sesiones-pendientes");
    } else {
      console.log(" Suscrito a /topic/sesiones-pendientes", subscriptionId);
    }

    /**
     *  Suscripción a topic de sesiones tomadas por otro soporte
     * Cuando un soporte toma una sesión, se notifica a todos los demás
     */
    
    const subscriptionTomadaId = subscribe(
      "/topic/sesion-tomada",
      (sesionTomada) => {
        console.log(" Sesión tomada por otro soporte:", sesionTomada);
        // Quitar la sesión de la lista de pendientes
        const idSesion = sesionTomada.id || sesionTomada.idSesion || sesionTomada;
        setSesionesPendientes((prev) => 
          prev.filter((s) => s.id !== idSesion)
        );
      }
    );
    if (!subscriptionTomadaId) {
      console.warn(" Suscripción fallida a /topic/sesion-tomada");
    } else {
      console.log(" Suscrito a /topic/sesion-tomada", subscriptionTomadaId);
    }

    return () => {
      if (subscriptionId) {
        unsubscribe(subscriptionId);
      }
      if (subscriptionTomadaId) {
        unsubscribe(subscriptionTomadaId);
      }
    };
  }, [isConnected, subscribe, unsubscribe, pushNotification]);

  // Cargar datos iniciales - sesiones pendientes siempre, activas solo si hay idSoporte
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true);
      setError(null);
      try {
        await cargarSesionesPendientes();
        
        if (idSoporte) {
          await cargarSesionesActivas();
        }
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, [idSoporte, cargarSesionesPendientes, cargarSesionesActivas]);

  return {
    // Estado
    sesionesPendientes,
    sesionesActivas,
    loading,
    error,
    isConnected,

    // Acciones
    cargarSesionesPendientes,
    cargarSesionesActivas,
    refrescar,
    quitarDePendientes,
    agregarAActivas,
    quitarDeActivas,
    limpiarError,
    mostrarError,
  };
};
