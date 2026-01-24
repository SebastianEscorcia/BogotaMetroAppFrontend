import { useState, useEffect, useCallback } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "../../services/admin/roles.service";

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Obtener todos los roles
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      setError("Error al cargar los roles");
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo rol
  const handleCreateRole = async (nombre) => {
    try {
      setLoading(true);
      setError(null);
      const newRole = await createRole(nombre);
      setRoles((prev) => [...prev, newRole]);
      setSuccess("Rol creado exitosamente");
      return newRole;
    } catch (err) {
      setError(err.message || "Error al crear el rol");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar rol existente
  const handleUpdateRole = async (id, roleData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRole = await updateRole(id, roleData);
      setRoles((prev) =>
        prev.map((role) => (role.id === id ? updatedRole : role))
      );
      setSuccess("Rol actualizado exitosamente");
      return updatedRole;
    } catch (err) {
      setError(err.message || "Error al actualizar el rol");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar rol
  const handleDeleteRole = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteRole(id);
      setRoles((prev) => prev.filter((role) => role.id !== id));
      setSuccess("Rol eliminado exitosamente");
    } catch (err) {
      setError(err.message || "Error al eliminar el rol");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar mensajes
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Cargar roles al montar el componente
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Estadísticas de roles
  const stats = {
    total: roles.length,
    active: roles.filter((r) => r.isActive).length,
    inactive: roles.filter((r) => !r.isActive).length,
  };

  return {
    roles,
    loading,
    error,
    success,
    stats,
    fetchRoles,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    clearMessages,
  };
};
