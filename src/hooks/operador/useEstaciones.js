import { useCallback, useEffect, useState } from "react";
import {
  createEstacion,
  deleteEstacion,
  getEstaciones,
  updateEstacion,
} from "../../services/operador";

const mapEstacion = (estacion = {}) => ({
  ...estacion,
  esAccesible: estacion.esAccesible ?? true,
});

export const useEstaciones = () => {
  const [estaciones, setEstaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchEstaciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEstaciones();
      setEstaciones((data || []).map(mapEstacion));
    } catch (err) {
      setError(err.message || "Error al cargar estaciones");
      setEstaciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateEstacion = async (estacionData) => {
    try {
      setLoading(true);
      setError(null);
      const newEstacion = await createEstacion(estacionData);
      setEstaciones((prev) => [...prev, mapEstacion(newEstacion)]);
      setSuccess("Estación creada exitosamente");
      return newEstacion;
    } catch (err) {
      setError(err.message || "Error al crear estación");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstacion = async (id, estacionData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEstacion = await updateEstacion(id, estacionData);
      setEstaciones((prev) =>
        prev.map((estacion) =>
          estacion.id === id ? mapEstacion(updatedEstacion) : estacion,
        ),
      );
      setSuccess("Estación actualizada exitosamente");
      return updatedEstacion;
    } catch (err) {
      setError(err.message || "Error al actualizar estación");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEstacion = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteEstacion(id);
      setEstaciones((prev) => prev.filter((estacion) => estacion.id !== id));
      setSuccess("Estación eliminada exitosamente");
    } catch (err) {
      setError(err.message || "Error al eliminar estación");
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
    fetchEstaciones();
  }, [fetchEstaciones]);

  const stats = {
    total: estaciones.length,
    accesibles: estaciones.filter((estacion) => estacion.esAccesible).length,
    noAccesibles: estaciones.filter((estacion) => !estacion.esAccesible).length,
  };

  return {
    estaciones,
    loading,
    error,
    success,
    stats,
    fetchEstaciones,
    handleCreateEstacion,
    handleUpdateEstacion,
    handleDeleteEstacion,
    clearMessages,
  };
};