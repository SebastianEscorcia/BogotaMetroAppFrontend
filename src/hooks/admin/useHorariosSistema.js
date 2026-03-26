import { useCallback, useEffect, useState } from "react";
import {
  createHorarioSistema,
  deleteHorarioSistema,
  getHorarioSistemaPorDia,
  getHorariosSistema,
  updateHorarioSistema,
} from "../../services/admin";

const sortByDia = (items = []) => {
  const orden = [
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
    "DOMINGO",
    "FESTIVO",
  ];

  return [...items].sort(
    (a, b) => orden.indexOf(a.dia) - orden.indexOf(b.dia),
  );
};

export const useHorariosSistema = () => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchHorarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHorariosSistema();
      setHorarios(sortByDia(data || []));
    } catch (err) {
      setError(err.message || "Error al cargar los horarios del sistema");
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHorarioPorDia = async (dia) => {
    try {
      setLoading(true);
      setError(null);
      return await getHorarioSistemaPorDia(dia);
    } catch (err) {
      setError(err.message || "No se pudo consultar el horario por día");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHorario = async (horarioData) => {
    try {
      setLoading(true);
      setError(null);
      const newHorario = await createHorarioSistema(horarioData);
      setHorarios((prev) => sortByDia([...prev, newHorario]));
      setSuccess("Horario creado exitosamente");
      return newHorario;
    } catch (err) {
      setError(err.message || "Error al crear el horario");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHorario = async (id, horarioData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedHorario = await updateHorarioSistema(id, horarioData);
      setHorarios((prev) =>
        sortByDia(prev.map((horario) => (horario.id === id ? updatedHorario : horario))),
      );
      setSuccess("Horario actualizado exitosamente");
      return updatedHorario;
    } catch (err) {
      setError(err.message || "Error al actualizar el horario");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHorario = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteHorarioSistema(id);
      setHorarios((prev) => prev.filter((horario) => horario.id !== id));
      setSuccess("Horario eliminado exitosamente");
    } catch (err) {
      setError(err.message || "Error al eliminar el horario");
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
    fetchHorarios();
  }, [fetchHorarios]);

  const stats = {
    total: horarios.length,
    active: horarios.filter((horario) => horario.activo).length,
    inactive: horarios.filter((horario) => !horario.activo).length,
  };

  return {
    horarios,
    loading,
    error,
    success,
    stats,
    fetchHorarios,
    fetchHorarioPorDia,
    handleCreateHorario,
    handleUpdateHorario,
    handleDeleteHorario,
    clearMessages,
  };
};