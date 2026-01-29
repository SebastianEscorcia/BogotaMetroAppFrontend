import { useState, useEffect, useCallback } from "react";
import {
  obtenerSesionesPendientes,
  obtenerSesionesActivasSoporte,
} from "../../../services/chat/chatRoom.service";
import { useWebSocket } from "../../web-socket/useWebSocket";

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

  // Cargar sesiones pendientes
  const cargarSesionesPendientes = useCallback(async () => {
    try {
      const pendientes = await obtenerSesionesPendientes();
      setSesionesPendientes(pendientes || []);
    } catch (err) {
      console.error("Error al cargar sesiones pendientes:", err);
      setError("Error al cargar sesiones pendientes");
    }
  }, []);

  // Cargar sesiones activas del soporte
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

  // Cargar todas las sesiones
  const cargarTodo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([cargarSesionesPendientes(), cargarSesionesActivas()]);
    } finally {
      setLoading(false);
    }
  }, [cargarSesionesPendientes, cargarSesionesActivas]);

  // Refrescar lista de sesiones
  const refrescar = useCallback(() => {
    cargarTodo();
  }, [cargarTodo]);

  // Quitar sesión de pendientes (cuando el soporte la toma)
  const quitarDePendientes = useCallback((idSesion) => {
    setSesionesPendientes((prev) =>
      prev.filter((sesion) => sesion.id !== idSesion)
    );
  }, []);

  // Agregar sesión a activas
  const agregarAActivas = useCallback((sesion) => {
    setSesionesActivas((prev) => [...prev, sesion]);
  }, []);

  // Quitar sesión de activas (cuando se cierra)
  const quitarDeActivas = useCallback((idSesion) => {
    setSesionesActivas((prev) =>
      prev.filter((sesion) => sesion.id !== idSesion)
    );
  }, []);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  // Conectar WebSocket y suscribirse a notificaciones
  useEffect(() => {
    const inicializarWebSocket = async () => {
      try {
        await connect();
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
    // Tu backend debería publicar aquí cuando un pasajero solicita chat
    const subscriptionId = subscribe(
      "/topic/sesiones-pendientes",
      (nuevaSesion) => {
        console.log("📩 Nueva sesión pendiente:", nuevaSesion);
        setSesionesPendientes((prev) => {
          // Evitar duplicados
          const existe = prev.some((s) => s.id === nuevaSesion.id);
          if (existe) return prev;
          return [...prev, nuevaSesion];
        });
      }
    );

    return () => {
      if (subscriptionId) {
        unsubscribe(subscriptionId);
      }
    };
  }, [isConnected, subscribe, unsubscribe]);

  // Cargar datos iniciales - sesiones pendientes siempre, activas solo si hay idSoporte
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true);
      setError(null);
      try {
        // Siempre cargar sesiones pendientes
        await cargarSesionesPendientes();
        
        // Solo cargar sesiones activas si hay idSoporte
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
  };
};
