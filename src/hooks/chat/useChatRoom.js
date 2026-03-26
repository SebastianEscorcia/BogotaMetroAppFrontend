import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../web-socket/useWebSocket";
import { useNotificationContext } from "../../context/NotificationContext";

import {esAsignacionSoporte,esCierreSesion,limpiarSoporte} from '../../helpers'
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
// Estados posibles de la sesión
export const EstadoSesion = {
  PENDIENTE: "PENDIENTE",
  ACTIVO: "ACTIVO",
  CERRADO: "CERRADO",
};

export const useChatRoom = (idSesionInicial = null) => {
  const [idSesion, setIdSesion] = useState(idSesionInicial);
  const [mensajes, setMensajes] = useState([]);
  const [sesionInfo, setSesionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sesionCerrada, setSesionCerrada] = useState(false);

  const { isConnected, subscribe, send, connect, unsubscribe  } = useWebSocket(false);
  const { pushNotification } = useNotificationContext();

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

  const cargarSesionInfo = useCallback(async (sesionId) => {
    try {
      const info = await obtenerSesionPorId(sesionId);
      
      setSesionInfo(info);
    } catch (err) {
      console.error("Error al cargar info de sesión:", err);
      
    }
  }, []);

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

  const conectarASesion = useCallback(
  async (sesionId, asignarSoporte = false, idSoporte = null) => {
    try {
      setLoading(true);
      setError(null);

      if (asignarSoporte) {
        await asignarSoporteASesion(sesionId, idSoporte);
      }

      setIdSesion(sesionId);
      await connect();

      await Promise.all([
        cargarHistorial(sesionId),
        cargarSesionInfo(sesionId),
      ]);

      return sesionId;
    } catch (err) {
      setError("Error al conectar a la sesión");
      throw err;
    } finally {
      setLoading(false);
    }
  },
  [connect, cargarHistorial, cargarSesionInfo]
);


  const unirseASesion = (id, soporteId) =>  conectarASesion(id, true, soporteId);

  const reconectarASesion = id => conectarASesion(id);
  

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
      if (!contenido?.trim()) return;

      if (!isConnected) {
        console.error("No hay conexión WebSocket");
        return;
      }

      const mensajeDTO = {
        contenido,
        remitenteId,
        tipoRemitente,
      };

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

  const procesarMensajeSistema = useCallback((mensaje = {}) =>{
    const contenido = mensaje.contenido?.toLowerCase() || "";

    if(contenido.startsWith("error:")){
      setError(mensaje.contenido.replace("ERROR: " , ""));
      return;
    }
    if (esCierreSesion(contenido)){
      setSesionCerrada(true);
      limpiarSoporte(setSesionInfo);
      return;
    }
    if(esAsignacionSoporte (contenido)){
      setSesionCerrada(false);
      cargarSesionInfo(idSesion)
      pushNotification({
        title: "Soporte conectado",
        message: "Un agente se ha unido a tu chat de soporte.",
        type: "success",
      });
    }
  }, [cargarSesionInfo, idSesion, pushNotification, setSesionInfo])

  // Suscribirse a mensajes cuando hay sesión y conexión
  useEffect(() => {
    if (!idSesion || !isConnected) return;

    const subscriptionId = subscribe(`/topic/sala/${idSesion}`, (nuevoMensaje) => {
      
      if(nuevoMensaje.tipoRemitente === TipoRemitente.SISTEMA){
        procesarMensajeSistema(nuevoMensaje);
      }
      setMensajes(prev => [... prev, nuevoMensaje]);
     
    });

    cargarHistorial(idSesion);

    return () => unsubscribe(subscriptionId);
  }, [idSesion, isConnected, subscribe, cargarHistorial, cargarSesionInfo, unsubscribe]);

  // Reiniciar chat para iniciar una nueva conversación
  const reiniciarChat = useCallback(() => {
    setIdSesion(null);
    setMensajes([]);
    setSesionInfo(null);
    setSesionCerrada(false);
    setError(null);
  }, []);

  return {
    idSesion,
    mensajes,
    sesionInfo,
    loading,
    error,
    isConnected,
    sesionCerrada,
    iniciarChat,
    unirseASesion,
    reconectarASesion,
    enviarMensaje,
    cerrarChat,
    cargarHistorial,
    limpiarError,
    reiniciarChat,
  };
};