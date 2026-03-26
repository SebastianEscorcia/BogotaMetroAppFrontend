import { useCallback, useEffect, useState } from "react";
import {
  createEstacionLinea,
  deleteEstacionLinea,
  getEstacionesLineas,
} from "../../services/operador";

const mapRelation = (relation = {}) => {
  const idLinea = relation.idLinea ?? relation.id?.idLinea ?? relation.linea?.id;
  const idEstacion =
    relation.idEstacion ?? relation.id?.idEstacion ?? relation.estacion?.id;

  return {
    ...relation,
    idLinea,
    idEstacion,
    orden: relation.orden ?? 0,
    nombreLinea: relation.nombreLinea ?? relation.linea?.nombre,
    nombreEstacion: relation.nombreEstacion ?? relation.estacion?.nombre,
  };
};

export const useEstacionesLineas = () => {
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchRelations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEstacionesLineas();
      setRelations((data || []).map(mapRelation));
    } catch (err) {
      setError(err.message || "Error al cargar relaciones de línea/estación");
      setRelations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateRelation = async (relationData) => {
    try {
      setLoading(true);
      setError(null);
      const payload = {
        idLinea: Number(relationData.idLinea),
        idEstacion: Number(relationData.idEstacion),
        orden: Number(relationData.orden),
      };
      const newRelation = await createEstacionLinea(payload);
      setRelations((prev) => [...prev, mapRelation(newRelation)]);
      setSuccess("Relación creada exitosamente");
      return newRelation;
    } catch (err) {
      setError(err.message || "Error al crear la relación");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRelation = async (idLinea, idEstacion) => {
    try {
      setLoading(true);
      setError(null);
      await deleteEstacionLinea(idLinea, idEstacion);
      setRelations((prev) =>
        prev.filter(
          (relation) =>
            !(Number(relation.idLinea) === Number(idLinea) && Number(relation.idEstacion) === Number(idEstacion)),
        ),
      );
      setSuccess("Relación eliminada exitosamente");
    } catch (err) {
      setError(err.message || "Error al eliminar la relación");
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
    fetchRelations();
  }, [fetchRelations]);

  const stats = {
    total: relations.length,
    uniqueLineas: new Set(relations.map((relation) => relation.idLinea)).size,
    uniqueEstaciones: new Set(relations.map((relation) => relation.idEstacion)).size,
  };

  return {
    relations,
    loading,
    error,
    success,
    stats,
    fetchRelations,
    handleCreateRelation,
    handleDeleteRelation,
    clearMessages,
  };
};