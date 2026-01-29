import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../web-socket/useWebSocket";
import {
  solicitarChat,
  asignarSoporteASesion,
  cerrarSesionChat,
  obtenerHistorialMensajes,
  obtenerSesionPorId,
} from "../../services/chat/chatRoom.service";

/**
 * Enum de tipos de remitente (debe coincidir con TipoRemitenteEnum del backend)
 */
export const TipoRemitente = {
  PASAJERO: "PASAJERO",
  SOPORTE: "SOPORTE",
  SISTEMA: "SISTEMA",
};

/**
 * Hook para manejar una sala de chat con WebSocket
 * @param {number|null} idSesionInicial - ID de sesión existente (opcional)
 */
export const useChatRoom = (idSesionInicial = null) => {
  const [idSesion, setIdSesion] = useState(idSesionInicial);
  const [mensajes, setMensajes] = useState([]);
  const [sesionInfo, setSesionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isConnected, subscribe, send, connect, unsubscribe  } = useWebSocket(false);

  // Cargar historial de mensajes
  const cargarHistorial = useCallback(async (sesionId) => {
    try {
      setLoading(true);
      const historial = await obtenerHistorialMensajes(sesionId);
      setMensajes(historial || []);
    } catch (err) {
      setError("Error al cargar historial");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar información de la sesión
  const cargarSesionInfo = useCallback(async (sesionId) => {
    try {
      const info = await obtenerSesionPorId(sesionId);
      setSesionInfo(info);
    } catch (err) {
      console.error("Error al cargar info de sesión:", err);
    }
  }, []);

  // Solicitar nuevo chat (para pasajeros)
  const iniciarChat = useCallback(
    async (idUsuario) => {
      try {
        setLoading(true);
        setError(null);

        const nuevoIdSesion = await solicitarChat(idUsuario);
        setIdSesion(nuevoIdSesion);

        await connect();

        await cargarSesionInfo(nuevoIdSesion);

        return nuevoIdSesion;
      } catch (err) {
        setError(err.message || "Error al iniciar chat");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [connect, cargarSesionInfo]
  );

  // Unirse a sesión existente (para soporte)
  const unirseASesion = useCallback(
    async (sesionId, idSoporte) => {
      try {
        setLoading(true);
        setError(null);

        await asignarSoporteASesion(sesionId, idSoporte);
        setIdSesion(sesionId);

        await connect();

        await Promise.all([cargarHistorial(sesionId), cargarSesionInfo(sesionId)]);

        return sesionId;
      } catch (err) {
        setError(err.message || "Error al unirse a la sesión");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [connect, cargarHistorial, cargarSesionInfo]
  );

  /**
   * Enviar mensaje al chat
   * Backend: @MessageMapping("/chat/{idSesion}")
   * Destino: /app/chat/{idSesion}
   *
   * @param {string} contenido - Contenido del mensaje
   * @param {number} remitenteId - ID del usuario que envía
   * @param {string} tipoRemitente - "PASAJERO" | "SOPORTE"
   */
  const enviarMensaje = useCallback(
    (contenido, remitenteId, tipoRemitente) => {
      if (!idSesion) {
        console.error("No hay sesión activa");
        return;
      }

      if (!isConnected) {
        console.error("No hay conexión WebSocket");
        return;
      }

      const mensajeDTO = {
        contenido,
        remitenteId,
        tipoRemitente,
      };

      // Destino: /app/chat/{idSesion}
      send(`/app/chat/${idSesion}`, mensajeDTO);
    },
    [idSesion, isConnected, send]
  );

  // Cerrar chat
  const cerrarChat = useCallback(async () => {
    if (!idSesion) return;

    try {
      await cerrarSesionChat(idSesion);
      setIdSesion(null);
      setMensajes([]);
      setSesionInfo(null);
    } catch (err) {
      setError("Error al cerrar chat");
    }
  }, [idSesion]);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  // Suscribirse a mensajes cuando hay sesión y conexión
  useEffect(() => {
    if (!idSesion || !isConnected) return;

   
    const subscriptionId = subscribe(`/topic/sala/${idSesion}`, (nuevoMensaje) => {
      console.log("📩 Mensaje recibido:", nuevoMensaje);

      if (
        nuevoMensaje.tipoRemitente === TipoRemitente.SISTEMA &&
        nuevoMensaje.contenido?.startsWith("ERROR:")
      ) {
        setError(nuevoMensaje.contenido.replace("ERROR: ", ""));
      }

      setMensajes((prev) => [...prev, nuevoMensaje]);
    });

    cargarHistorial(idSesion);

    return () => {
        if(subscriptionId) {
            unsubscribe(subscriptionId)
        }
    };
  }, [idSesion, isConnected, subscribe, cargarHistorial]);

  return {
    idSesion,
    mensajes,
    sesionInfo,
    loading,
    error,
    isConnected,
    iniciarChat,
    unirseASesion,
    enviarMensaje,
    cerrarChat,
    cargarHistorial,
    limpiarError,
  };
};