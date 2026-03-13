import { httpClient } from "../../modules/shared/helpers/httpClient";

/**
 * Servicio para manejar las sesiones de chat (chat rooms)
 * Consume los endpoints de /api/chat-rooms
 */

/**
 * Solicita una nueva sesión de chat con soporte (para pasajeros)
 * @param {number} idUsuario - ID del usuario pasajero que solicita el chat
 * @returns {Promise<number>} ID de la sesión de chat creada
 */
export const solicitarChat = async (idUsuario) => {
  const idSesion = await httpClient("/chat-rooms/solicitar", {
    method: "POST",
    body: JSON.stringify({ idUsuario }),
  });
  return idSesion;
};

/**
 * Asigna un soporte a una sesión de chat pendiente
 * @param {number} idSesion - ID de la sesión de chat
 * @param {number} idUsuarioSoporte - ID del usuario soporte
 * @returns {Promise<string>} Mensaje de confirmación
 */
export const asignarSoporteASesion = async (idSesion, idUsuarioSoporte) => {
  const response = await httpClient(`/chat-rooms/${idSesion}/asignar`, {
    method: "PUT",
    body: JSON.stringify({ idUsuarioSoporte }),
  });
  return response;
};

/**
 * Cierra una sesión de chat
 * @param {number} idSesion - ID de la sesión de chat a cerrar
 * @returns {Promise<string>} Mensaje de confirmación
 */
export const cerrarSesionChat = async (idSesion) => {
  const response = await httpClient(`/chat-rooms/${idSesion}/cerrar`, {
    method: "PUT",
  });
  return response;
};

/**
 * Obtiene todas las sesiones pendientes (cola de espera)
 * Solo para usuarios con rol SOPORTE
 * @returns {Promise<Array>} Lista de sesiones pendientes
 */
export const obtenerSesionesPendientes = async () => {
  const sesiones = await httpClient("/chat-rooms/pendientes", {
    method: "GET",
  });
  return sesiones;
};

/**
 * Obtiene las sesiones activas de un soporte específico
 * @param {number} idSoporte - ID del usuario soporte
 * @returns {Promise<Array>} Lista de sesiones activas del soporte
 */
export const obtenerSesionesActivasSoporte = async (idSoporte) => {
  const sesiones = await httpClient(`/chat-rooms/soporte/${idSoporte}/activas`, {
    method: "GET",
  });
  return sesiones;
};

/**
 * Obtiene los detalles de una sesión específica
 * @param {number} idSesion - ID de la sesión de chat
 * @returns {Promise<Object>} Detalles de la sesión
 */
export const obtenerSesionPorId = async (idSesion) => {
  const sesion = await httpClient(`/chat-rooms/${idSesion}`, {
    method: "GET",
  });
  return sesion;
};

/**
 * Obtiene el historial de mensajes de una sesión
 * @param {number} idSesion - ID de la sesión de chat
 * @returns {Promise<Array>} Lista de mensajes de la sesión
 */
export const obtenerHistorialMensajes = async (idSesion) => {
  const mensajes = await httpClient(`/chat-rooms/${idSesion}/mensajes`, {
    method: "GET",
  });
  return mensajes;
};