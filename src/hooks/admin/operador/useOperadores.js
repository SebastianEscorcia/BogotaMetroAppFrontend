import { useState, useEffect, useCallback } from "react";
import {
  getOperadores,
  getOperadorById,
  createOperador,
  deleteOperador,
  updateOperador,
  reactivarOperador,
} from "../../../services/admin";
import { useDebounce } from "../../useDebounce";
import { adaptUserFromBackend } from '../../../adapters/userAdapter'

export const useOperadores = () => {
  const [operadores, setOperadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
 
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const fetchOperadores = useCallback(async (busqueda = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOperadores(busqueda);
      if(!data) return;
      setOperadores(data.map(adaptUserFromBackend));
    } catch (error) {
      setError(error.message || "Error al cargar los operadores");
      setOperadores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  
  const handleCreateOperador = async (operadorData) => {
    try {
      setLoading(true);
      setError(null);
      const newOperador = await createOperador(operadorData);
      console.log("CreateOperador del hoook useOperador");
      console.log(newOperador);
      setOperadores((prev) => [...prev, newOperador]);
      setSuccess("Operador registrado exitosamente");
      return newOperador;
    } catch (err) {
      const errorMsg = err.message || "Error al registrar el operador";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOperador = async (id, operadorData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedOperador = await updateOperador(id, operadorData);
      setOperadores((prev) =>
        prev.map((op) => (op.id === id ? updatedOperador : op)),
      );
      setSuccess("Operador actualizado exitosamente");
      return updatedOperador;
    } catch (err) {
      const errorMsg = err.message || "Error al actualizar el operador";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOperador = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteOperador(id);
      setOperadores((prev) =>
        prev.map((op) => (op.id === id ? { ...op, activo: false } : op))
      );
      setSuccess("Operador eliminado exitosamente");
    } catch (err) {
      const errorMsg = err.message || "Error al eliminar el operador";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleReactivarOperador = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await reactivarOperador(id);
      setOperadores((prev) =>
        prev.map((op) => (op.id === id ? { ...op, activo: true } : op))
      );
      setSuccess("Operador reactivado exitosamente");
    } catch (err) {
      const errorMsg = err.message || "Error al reactivar el operador";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    setSearching(true);
    fetchOperadores(debouncedSearchTerm).finally(() => setSearching(false));
  }, [debouncedSearchTerm, fetchOperadores]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term !== debouncedSearchTerm) {
      setSearching(true);
    }
  };
   const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };
  const stats = {
    total: operadores.length,
    active: operadores.filter((op) => op.activo).length,
    inactive: operadores.filter((op) => !op.activo).length,
  };

  return{
    operadores,
    loading,
    searching,
    error,
    success,
    stats,
    searchTerm,
    fetchOperadores,
    handleCreateOperador,
    handleUpdateOperador,
    handleDeleteOperador,
    handleReactivarOperador,
    handleSearch,
    clearMessages,
  };
};
