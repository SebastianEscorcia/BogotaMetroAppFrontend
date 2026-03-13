import { httpClient } from "../../global/utils/helpers";

/**
 * Obtener todos los roles del sistema
 * @returns {Promise<Array>} Lista de roles
 */
export const getRoles = () => {
  return httpClient("/roles");
};

/**
 * Crear un nuevo rol
 * @param {string} nombre - Nombre del rol
 * @returns {Promise<Object>} Rol creado
 */
export const createRole = (nombre) => {
  return httpClient(`/roles?nombre=${encodeURIComponent(nombre)}`, {
    method: "POST",
  });
};

/**
 * Actualizar un rol existente
 * @param {number} id - ID del rol
 * @param {Object} roleData - Datos del rol a actualizar
 * @returns {Promise<Object>} Rol actualizado
 */
export const updateRole = (id, roleData) => {
  return httpClient(`/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(roleData),
  });
};

/**
 * Eliminar un rol (soft delete - isActive = false)
 * @param {number} id - ID del rol
 * @returns {Promise<void>}
 */
export const deleteRole = (id) => {
  return httpClient(`/roles/${id}`, {
    method: "DELETE",
  });
};
