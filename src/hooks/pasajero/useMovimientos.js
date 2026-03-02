import { useState, useCallback, useMemo } from "react";
import {
  obtenerMisTransacciones,
  buscarMisTransacciones,
} from "../../services/pasajero/recarga.service";
import { adaptTransaccionFromBackend } from "../../adapters/transaccionAdapter";

/**
 * Hook para gestionar los movimientos (historial de transacciones) del pasajero.
 */
export const useMovimientos = (idUsuario) => {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);

  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    montoMin: "",
    montoMax: "",
    tipo: "TODOS", 
  });

  /** Obtener todas las transacciones del pasajero */
  const fetchTransacciones = useCallback(async () => {
    if (!idUsuario) return;
    setLoading(true);
    setError(null);

    try {
      const data = await obtenerMisTransacciones(idUsuario);
      const adaptadas = Array.isArray(data)
        ? data.map(adaptTransaccionFromBackend)
        : [];
      setTransacciones(adaptadas);
      console.table(
        adaptadas.map((tx) => ({
          id: tx.id,
          tipo: tx.tipo,
          medioDePago: tx.medioDePago,
          medioDePagoLabel: tx.medioDePagoLabel,
        })),
      );
    } catch (err) {
      setError(err?.message || "Error al cargar los movimientos");
    } finally {
      setLoading(false);
    }
  }, [idUsuario]);

  /** Buscar con filtros avanzados */
  const buscarConFiltros = useCallback(async () => {
    if (!idUsuario) return;
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
      if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;
      if (filtros.montoMin) params.min = filtros.montoMin;
      if (filtros.montoMax) params.max = filtros.montoMax;

      const hayFiltros = Object.keys(params).length > 0;
      const data = hayFiltros
        ? await buscarMisTransacciones(idUsuario, params)
        : await obtenerMisTransacciones(idUsuario);

      const adaptadas = Array.isArray(data)
        ? data.map(adaptTransaccionFromBackend)
        : [];
      setTransacciones((prev) => [adaptadas, ...prev]);
    } catch (err) {
      setError(err?.message || "Error al buscar movimientos");
    } finally {
      setLoading(false);
    }
  }, [idUsuario, filtros]);

  /** Actualiza un campo de filtro */
  const updateFiltro = useCallback((field, value) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  }, []);

  /** Limpia todos los filtros */
  const limpiarFiltros = useCallback(() => {
    setFiltros({
      fechaInicio: "",
      fechaFin: "",
      montoMin: "",
      montoMax: "",
      tipo: "TODOS",
    });
  }, []);

  /** Transacciones filtradas por tipo (front-end) */
  const transaccionesFiltradas = useMemo(() => {
    if (filtros.tipo === "TODOS") return transacciones;
    return transacciones.filter((tx) => tx.tipo === filtros.tipo);
  }, [transacciones, filtros.tipo]);

  /** Estadísticas rápidas */
  const stats = useMemo(() => {
    const recargas = transacciones.filter((tx) => tx.tipo === "RECARGA");
    const pasajes = transacciones.filter((tx) => tx.tipo === "PASAJE");
    const transferencias = transacciones.filter(
      (tx) => tx.tipo === "TRANSFERENCIA",
    );

    const totalRecargas = recargas.reduce(
      (sum, tx) => sum + Number(tx.valorPagado || 0),
      0,
    );
    const totalPasajes = pasajes.reduce(
      (sum, tx) => sum + Number(tx.valorPagado || 0),
      0,
    );
    const totalTransferencias = transferencias.reduce(
      (sum, tx) => sum + Number(tx.valorPagado || 0),
      0,
    );

    return {
      totalTransacciones: transacciones.length,
      cantRecargas: recargas.length,
      cantPasajes: pasajes.length,
      cantTransFerencias: transferencias.length,
      totalRecargas,
      totalPasajes,
      totalTransferencias,
    };
  }, [transacciones]);

  return {
    transacciones: transaccionesFiltradas,
    allTransacciones: transacciones,
    loading,
    error,
    selectedTx,
    setSelectedTx,
    filtros,
    updateFiltro,
    limpiarFiltros,
    fetchTransacciones,
    buscarConFiltros,
    stats,
  };
};
