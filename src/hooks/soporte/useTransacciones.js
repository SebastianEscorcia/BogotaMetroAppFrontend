import { useState, useCallback, useMemo } from "react";
import {
  getTransaccionesGlobalesPorFechas,
  getTransaccionesPorUsuario,
  buscarTransaccionesAvanzado,
  getTransaccionPorId,
  getTransaccionPorReferencia,
  getTransaccionesPorDocumento,
  getTransaccionesPorNombre,
} from "../../services/soporte";
import { adaptTransaccionFromBackend } from "../../adapters/transaccionAdapter";

/**
 * Genera fechas ISO por defecto: últimos 7 días.
 */
const getDefaultDateRange = () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const toISO = (d) => d.toISOString().slice(0, 16);
  return { fechaInicio: toISO(sevenDaysAgo), fechaFin: toISO(now) };
};

/**
 * Hook para gestionar el estado de transacciones en el módulo de soporte.
 * Soporta filtrado por tipo (RECARGA / PASAJE), fechas, montos y usuario.
 */
export const useTransacciones = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedTransaccion, setSelectedTransaccion] = useState(null);

  const defaultRange = getDefaultDateRange();
  const [filtros, setFiltros] = useState({
    fechaInicio: defaultRange.fechaInicio,
    fechaFin: defaultRange.fechaFin,
    montoMin: "",
    montoMax: "",
    numDocumento: "",
    nombre: "",
  });

  // — Cargar transacciones globales por fechas (SOPORTE) —
  const fetchPorFechas = useCallback(async (fechaInicio, fechaFin) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransaccionesGlobalesPorFechas(fechaInicio, fechaFin);
      if (!data) return;
      setTransacciones(data.map(adaptTransaccionFromBackend));
    } catch (err) {
      setError(err.message || "Error al cargar las transacciones");
      setTransacciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // — Cargar transacciones por usuario —
  const fetchPorUsuario = useCallback(async (idUsuario) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransaccionesPorUsuario(idUsuario);
      if (!data) return;
      setTransacciones(data.map(adaptTransaccionFromBackend));
    } catch (err) {
      setError(err.message || "Error al cargar transacciones del usuario");
      setTransacciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // — Búsqueda avanzada por usuario con filtros combinados —
  const fetchAvanzado = useCallback(async (idUsuario, params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await buscarTransaccionesAvanzado(idUsuario, params);
      if (!data) return;
      setTransacciones(data.map(adaptTransaccionFromBackend));
    } catch (err) {
      setError(err.message || "Error en la búsqueda avanzada");
      setTransacciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // — Buscar transacción individual por ID —
  const fetchPorId = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransaccionPorId(id);
      if (data) {
        setSelectedTransaccion(adaptTransaccionFromBackend(data));
      }
    } catch (err) {
      setError(err.message || "Transacción no encontrada");
    } finally {
      setLoading(false);
    }
  }, []);

  // — Buscar transacción por referencia de pasarela —
  const fetchPorReferencia = useCallback(async (referencia) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransaccionPorReferencia(referencia);
      if (data) {
        setSelectedTransaccion(adaptTransaccionFromBackend(data));
      }
    } catch (err) {
      setError(err.message || "Transacción no encontrada por referencia");
    } finally {
      setLoading(false);
    }
  }, []);

  // — Buscar transacciones por número de documento —
  const fetchPorDocumento = useCallback(async (numDocumento) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransaccionesPorDocumento(numDocumento);
      if (!data) return;
      setTransacciones(data.map(adaptTransaccionFromBackend));
    } catch (err) {
      setError(err.message || "No se encontraron transacciones para ese documento");
      setTransacciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // — Buscar transacciones por nombre del pasajero —
  const fetchPorNombre = useCallback(async (nombre) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransaccionesPorNombre(nombre);
      if (!data) return;
      setTransacciones(data.map(adaptTransaccionFromBackend));
    } catch (err) {
      setError(err.message || "No se encontraron transacciones para ese nombre");
      setTransacciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // — Aplicar filtros —
  const handleBuscar = useCallback(async () => {
    const { fechaInicio, fechaFin, numDocumento, nombre } = filtros;

    // Prioridad: documento > nombre > fechas globales
    if (numDocumento.trim()) {
      await fetchPorDocumento(numDocumento.trim());
    } else if (nombre.trim()) {
      await fetchPorNombre(nombre.trim());
    } else {
      if (!fechaInicio || !fechaFin) {
        setError("Debes seleccionar un rango de fechas o buscar por documento/nombre");
        return;
      }
      await fetchPorFechas(fechaInicio, fechaFin);
    }
    setSuccess(null);
  }, [filtros, fetchPorDocumento, fetchPorNombre, fetchPorFechas]);

  // — Actualizar filtros —
  const updateFiltro = useCallback((campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  // — Resetear filtros —
  const resetFiltros = useCallback(() => {
    const range = getDefaultDateRange();
    setFiltros({
      fechaInicio: range.fechaInicio,
      fechaFin: range.fechaFin,
      montoMin: "",
      montoMax: "",
      numDocumento: "",
      nombre: "",
    });
    setTransacciones([]);
    setError(null);
    setSuccess(null);
  }, []);

  // — Datos derivados filtrados por tipo —
  const recargas = useMemo(
    () => transacciones.filter((tx) => tx.tipo === "RECARGA"),
    [transacciones]
  );

  const pasajes = useMemo(
    () => transacciones.filter((tx) => tx.tipo === "PASAJE"),
    [transacciones]
  );

  // — Estadísticas —
  const stats = useMemo(() => {
    const totalRecargas = recargas.reduce((sum, tx) => sum + Number(tx.valorPagado || 0), 0);
    const totalPasajes = pasajes.reduce((sum, tx) => sum + Number(tx.valorPagado || 0), 0);
    return {
      totalTransacciones: transacciones.length,
      cantidadRecargas: recargas.length,
      cantidadPasajes: pasajes.length,
      montoRecargas: totalRecargas,
      montoPasajes: totalPasajes,
      montoTotal: totalRecargas + totalPasajes,
    };
  }, [transacciones, recargas, pasajes]);

  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccess(null), []);
  const clearSelectedTransaccion = useCallback(() => setSelectedTransaccion(null), []);

  return {
    transacciones,
    recargas,
    pasajes,
    loading,
    error,
    success,
    stats,
    filtros,
    selectedTransaccion,

    fetchPorFechas,
    fetchPorUsuario,
    fetchAvanzado,
    fetchPorId,
    fetchPorReferencia,
    handleBuscar,
    updateFiltro,
    resetFiltros,
    setSelectedTransaccion,
    clearSelectedTransaccion,
    clearError,
    clearSuccess,
  };
};
