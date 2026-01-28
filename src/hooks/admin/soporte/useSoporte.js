import { useState, useEffect, useCallback } from "react";
import {
  createSoporte,
  getAllSupports,
  getSupportById,
  updateSupport,
  deleteSoporte,
  reactivarSoporte,
} from "../../../services/admin";
import { useDebounce } from "../../useDebounce";
import { adaptUserFromBackend } from '../../../adapters/userAdapter'

export const useSoporte = () => {
  const [soportes, setSoportes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Debounce del término de búsqueda (500ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Obtener todos los soportes
  const fetchSoportes = useCallback(async (busqueda = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSupports(busqueda);
      setSoportes(data.map(adaptUserFromBackend));
    } catch (error) {
      setError(error.message || "Error al cargar los soportes");
      setSoportes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo soporte
  const handleCreateSoporte = async (soporteData) => {
    try {
      setLoading(true);
      setError(null);
      const newSoporte = await createSoporte(soporteData);
      console.log(newSoporte);
      setSoportes((prev) => [...prev, newSoporte]);
      setSuccess("Soporte registrado exitosamente");
      return newSoporte;
    } catch (error) {
      const errorMessage = error.message || "No se ha podido crear el soporte";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar soporte
  const handleUpdateSoporte = async (id, soporteData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedSoporte = await updateSupport(id, soporteData);
      setSoportes((prev) =>
        prev.map((sp) => (sp.id === id ? updatedSoporte : sp))
      );
      setSuccess("Soporte actualizado exitosamente");
      return updatedSoporte;
    } catch (err) {
      const errorMsg = err.message || "Error al actualizar el soporte";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar soporte (soft delete)
  const handleDeleteSoporte = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteSoporte(id);
      setSoportes((prev) =>
        prev.map((sp) => (sp.id === id ? { ...sp, activo: false } : sp))
      );
      setSuccess("Soporte eliminado exitosamente");
    } catch (err) {
      const errorMsg = err.message || "Error al eliminar el soporte";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reactivar soporte
  const handleReactivarSoporte = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await reactivarSoporte(id);
      setSoportes((prev) =>
        prev.map((sp) => (sp.id === id ? { ...sp, activo: true } : sp))
      );
      setSuccess("Soporte reactivado exitosamente");
    } catch (err) {
      const errorMsg = err.message || "Error al reactivar el soporte";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Efecto para búsqueda con el valor debounced
  useEffect(() => {
    // Ejecutar búsqueda cuando cambie el término debounced
    setSearching(true);
    fetchSoportes(debouncedSearchTerm).finally(() => setSearching(false));
  }, [debouncedSearchTerm, fetchSoportes]);

  // Buscar soportes
  const handleSearch = (term) => {
    setSearchTerm(term);
    // Mostrar indicador de búsqueda mientras espera el debounce
    if (term !== debouncedSearchTerm) {
      setSearching(true);
    }
  };

  // Limpiar mensajes
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Estadísticas
  const stats = {
    total: soportes.length,
    active: soportes.filter((sp) => sp.activo).length,
    inactive: soportes.filter((sp) => !sp.activo).length,
  };

  return {
    soportes,
    loading,
    searching,
    error,
    success,
    stats,
    searchTerm,
    fetchSoportes,
    handleCreateSoporte,
    handleUpdateSoporte,
    handleDeleteSoporte,
    handleReactivarSoporte,
    handleSearch,
    clearMessages,
  };
};
