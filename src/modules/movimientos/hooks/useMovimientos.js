import { useState, useCallback, useMemo } from "react";
import {
  obtenerTransacciones,
  buscarTransacciones,
  obtenerTransaccionesPasadas,
} from "../services/movimientos.service";
import { convertirTransaccionArray } from "../helpers";

/**
 * Hook para gestionar los movimientos (historial de transacciones) del pasajero.
 */
export const useMovimientos = (idUsuario) => {
  const [transacciones, setTransacciones] = useState([]);
  const [mostrarBoton, setmostrarBoton] = useState(true)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);
  const [transaccionesPasadas, setTransaccionesPasadas] = useState([]);
  const [page, setPage] = useState(0);
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
      const data = await obtenerTransacciones(idUsuario);
      const adaptedTransactions = convertirTransaccionArray(data);
      setTransacciones(adaptedTransactions);
      console.table(
        adaptedTransactions.map((tx) => ({
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

  const fetchMasTransacciones = useCallback(async () => {
    if (!idUsuario) return;
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTransaccionesPasadas(idUsuario, page);
      console.log(data);

      console.log(data.content);
      const adaptedTransactionsPasadas = convertirTransaccionArray(
        data.content,
      );
      console.log(adaptedTransactionsPasadas);

      setTransaccionesPasadas((prev) => [
        ...prev,
        ...adaptedTransactionsPasadas,
      ]);
      setPage((prev) => prev + 1);
      setmostrarBoton(false);
    } catch (error) {
      setError(error?.message || "Error al cargar los movimientos");
    } finally {
      setLoading(false);
    }
  }, [idUsuario, page]);

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
        ? await buscarTransacciones(idUsuario, params)
        : await obtenerTransacciones(idUsuario);

      const adaptadas = convertirTransaccionArray(data);
      setTransacciones(adaptadas);
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
    const todasLasTransacciones = [...transacciones, ...transaccionesPasadas];
    const recargas = todasLasTransacciones.filter(
      (tx) => tx.tipo === "RECARGA",
    );
    const pasajes = todasLasTransacciones.filter((tx) => tx.tipo === "PASAJE");
    const transferencias = todasLasTransacciones.filter(
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
      totalTransacciones: todasLasTransacciones.length,
      cantRecargas: recargas.length,
      cantPasajes: pasajes.length,
      cantTransFerencias: transferencias.length,
      totalRecargas,
      totalPasajes,
      totalTransferencias,
    };
  }, [transacciones, transaccionesPasadas]);

  return {
    transacciones: transaccionesFiltradas,
    allTransacciones: transacciones,
    transaccionesPasadas,
    loading,
    error,
    selectedTx,
    setSelectedTx,
    filtros,
    updateFiltro,
    limpiarFiltros,
    fetchTransacciones,
    buscarConFiltros,
    fetchMasTransacciones,
    mostrarBoton,
    stats,
  };
};
