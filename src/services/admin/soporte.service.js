import { httpClient } from "../../global/utils/helpers";
/**
 * Método que permite crear el rol de soporte
 * @param {Object} soporteData - Objeto con los datos requeridos del soporte
 * @returns {Promise<Object>} - Soporte creado
 */
export const createSoporte = (soporteData) => {
  return httpClient("/soporte", {
    method: "POST",
    body: JSON.stringify(soporteData),
  });
};

/**
 * Método que permite buscar un soporte por su id
 * @param {number} id - parámetro para obtener el soporte específico
 * @returns {Promise<Object>} - Datos del soporte
 */
export const getSupportById = (id) => {
  return httpClient(`/soporte/${id}`);
};

/**
 * Método que permite obtener todos los soportes
 * @param {string} busqueda - Término de búsqueda opcional
 * @returns {Promise<Array>} - Lista de soportes
 */
export const getAllSupports = (busqueda = "") => {
  const queryParam = busqueda
    ? `?busqueda=${encodeURIComponent(busqueda)}`
    : "";
  return httpClient(`/soporte${queryParam}`);
};

/**
 * Método para actualizar un soporte
 * @param {number} id - id del soporte actualizar
 * @param {Object} soporteData - datos de actulización del soporte
 * @returns {Promise<Object>} soporte actualizado
 */

export const updateSupport = (id, soporteData = {}) => {
  return httpClient(`/soporte/${id}`, {
    method: "PUT",
    body: JSON.stringify(soporteData),
  });
};


/**
 * Eliminar un soporte (soft delete)
 * @param {number} id - ID del soporte
 * @returns {Promise<void>}
 */
export const deleteSoporte = (id) => {
  return httpClient(`/soporte/${id}`, {
    method: "DELETE",
  });
};

/**
 * Reactivar un soporte eliminado
 * @param {number} id - ID del soporte
 * @returns {Promise<void>}
 */
export const reactivarSoporte = (id) => {
  return httpClient(`/soporte/${id}/reactivar`, {
    method: "PATCH",
  });
};