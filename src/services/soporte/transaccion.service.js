import { httpClient } from "../../helpers";

/**
 * Servicio de transacciones para el rol SOPORTE.
 * Mapea los endpoints del TransaccionController del backend.
 */

/** GET /api/pagos/{id} — Obtener transacción por ID (SOPORTE o dueño) */
export const getTransaccionPorId = (id) =>
  httpClient(`/pagos/${id}`);

/** GET /api/pagos/usuario/{idUsuario} — Obtener transacciones por usuario */
export const getTransaccionesPorUsuario = (idUsuario) =>
  httpClient(`/pagos/usuario/${idUsuario}`);

/** GET /api/pagos/fechas — Obtener transacciones globales por rango de fechas (SOPORTE) */
export const getTransaccionesGlobalesPorFechas = (fechaInicio, fechaFin) =>
  httpClient(`/pagos/fechas?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`);

/** GET /api/pagos/usuario/{idUsuario}/buscar — Búsqueda avanzada por usuario con filtros */
export const buscarTransaccionesAvanzado = (idUsuario, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params.fechaInicio) searchParams.append("fechaInicio", params.fechaInicio);
  if (params.fechaFin) searchParams.append("fechaFin", params.fechaFin);
  if (params.min != null) searchParams.append("min", params.min);
  if (params.max != null) searchParams.append("max", params.max);
  const query = searchParams.toString();
  return httpClient(`/pagos/usuario/${idUsuario}/buscar${query ? `?${query}` : ""}`);
};

/** GET /api/pagos/pasarela/{idPasarela} — Obtener transacciones por pasarela (SOPORTE) */
export const getTransaccionesPorPasarela = (idPasarela) =>
  httpClient(`/pagos/pasarela/${idPasarela}`);

/** GET /api/pagos/referencia/{referencia} — Obtener transacción por referencia (SOPORTE) */
export const getTransaccionPorReferencia = (referencia) =>
  httpClient(`/pagos/referencia/${encodeURIComponent(referencia)}`);

/** GET /api/pagos/usuario/{idUsuario}/fechas — Obtener por usuario y rango de fechas */
export const getTransaccionesPorUsuarioYFechas = (idUsuario, fechaInicio, fechaFin) =>
  httpClient(
    `/pagos/usuario/${idUsuario}/fechas?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`
  );

/** GET /api/pagos/usuario/documento/{numDocumento} — Buscar transacciones por número de documento (SOPORTE) */
export const getTransaccionesPorDocumento = (numDocumento) =>
  httpClient(`/pagos/usuario/documento/${encodeURIComponent(numDocumento)}`);

/** GET /api/pagos/usuario/nombre/{nombre} — Buscar transacciones por nombre del pasajero (SOPORTE) */
export const getTransaccionesPorNombre = (nombre) =>
  httpClient(`/pagos/usuario/nombre/${encodeURIComponent(nombre)}`);
