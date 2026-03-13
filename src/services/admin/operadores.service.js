import { httpClient } from "../../global/utils/helpers";

/**
 * Obtener todos los operadores del sistema
 * @param {string} busqueda - Término de búsqueda opcional
 * @returns {Promise<Array>} Lista de operadores
 */
export const getOperadores = (busqueda = "") => {
  const queryParam = busqueda ? `?busqueda=${encodeURIComponent(busqueda)}` : "";
  return httpClient(`/operador${queryParam}`);
};

/**
 * Obtener un operador por ID
 * @param {number} id - ID del operador
 * @returns {Promise<Object>} Datos del operador
 */
export const getOperadorById = (id) => {
  return httpClient(`/operador/${id}`);
};

/**
 * Registrar un nuevo operador
 * @param {Object} operadorData - Datos del operador
 * @returns {Promise<Object>} Operador creado
 */
export const createOperador = (operadorData) => {
  return httpClient("/operador/registro", {
    method: "POST",
    body: JSON.stringify(operadorData),
  });
};

/**
 * Actualizar un operador existente
 * @param {number} id - ID del operador
 * @param {Object} operadorData - Datos del operador a actualizar
 * @returns {Promise<Object>} Operador actualizado
 */
export const updateOperador = (id, operadorData) => {
  return httpClient(`/operador/${id}`, {
    method: "PUT",
    body: JSON.stringify(operadorData),
  });
};

/**
 * Eliminar un operador (soft delete)
 * @param {number} id - ID del operador
 * @returns {Promise<void>}
 */
export const deleteOperador = (id) => {
  return httpClient(`/operador/${id}`, {
    method: "DELETE",
  });
};

/**
 * Reactivar un operador eliminado
 * @param {number} id - ID del operador
 * @returns {Promise<void>}
 */
export const reactivarOperador = (id) => {
  return httpClient(`/operador/${id}/reactivar`, {
    method: "PATCH",
  });
};