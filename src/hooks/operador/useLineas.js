import { useCallback, useEffect, useState } from "react";
import {
  createLinea,
  deleteLinea,
  getLineas,
  updateLinea,
} from "../../services/operador";

const mapLinea = (linea = {}) => ({
  ...linea,
  activo: linea.activo ?? linea.isActive ?? true,
});

export const useLineas = () => {
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchLineas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLineas();
      setLineas((data || []).map(mapLinea));
    } catch (err) {
      setError(err.message || "Error al cargar líneas");
      setLineas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateLinea = async (lineaData) => {
    try {
      setLoading(true);
      setError(null);
      const newLinea = await createLinea(lineaData);
      setLineas((prev) => [...prev, mapLinea(newLinea)]);
      setSuccess("Línea creada exitosamente");
      return newLinea;
    } catch (err) {
      setError(err.message || "Error al crear línea");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLinea = async (id, lineaData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedLinea = await updateLinea(id, lineaData);
      setLineas((prev) =>
        prev.map((linea) => (linea.id === id ? mapLinea(updatedLinea) : linea)),
      );
      setSuccess("Línea actualizada exitosamente");
      return updatedLinea;
    } catch (err) {
      setError(err.message || "Error al actualizar línea");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLinea = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteLinea(id);
      setLineas((prev) => prev.filter((linea) => linea.id !== id));
      setSuccess("Línea eliminada exitosamente");
    } catch (err) {
      setError(err.message || "Error al eliminar línea");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    fetchLineas();
  }, [fetchLineas]);

  const stats = {
    total: lineas.length,
    active: lineas.filter((linea) => linea.activo).length,
    inactive: lineas.filter((linea) => !linea.activo).length,
  };

  return {
    lineas,
    loading,
    error,
    success,
    stats,
    fetchLineas,
    handleCreateLinea,
    handleUpdateLinea,
    handleDeleteLinea,
    clearMessages,
  };
};