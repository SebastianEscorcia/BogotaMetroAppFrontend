import { httpClient } from "../../helpers";

/**
 * Registra una nueva recarga de saldo para el pasajero autenticado.
 * POST /api/pagos/registrar
 * @param {{ valorPagado: number, moneda?: string, medioDePago: string }} data
 */
export const registrarRecarga = (data) =>
  httpClient("/pagos/registrar", {
    method: "POST",
    body: JSON.stringify(data),
  });

/**
 * Obtiene todas las transacciones de un usuario.
 * GET /api/pagos/usuario/{idUsuario}
 */
export const obtenerMisTransacciones = (idUsuario) =>
  httpClient(`/pagos/usuario/${idUsuario}`);

/**
 * Obtiene transacciones de un usuario filtradas por rango de fechas.
 * GET /api/pagos/usuario/{idUsuario}/fechas
 */
export const obtenerMisTransaccionesPorFechas = (idUsuario, fechaInicio, fechaFin) => {
  const params = new URLSearchParams({
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
  });
  return httpClient(`/pagos/usuario/${idUsuario}/fechas?${params}`);
};

/**
 * Búsqueda avanzada de transacciones propias con filtros opcionales.
 * GET /api/pagos/usuario/{idUsuario}/buscar
 */
export const buscarMisTransacciones = (idUsuario, { fechaInicio, fechaFin, min, max } = {}) => {
  const params = new URLSearchParams();
  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);
  if (min) params.append("min", min);
  if (max) params.append("max", max);
  const query = params.toString();
  return httpClient(`/pagos/usuario/${idUsuario}/buscar${query ? `?${query}` : ""}`);
};

/**
 * Obtiene el detalle de una transacción por ID.
 * GET /api/pagos/{id}
 */
export const obtenerTransaccionDetalle = (id) =>
  httpClient(`/pagos/${id}`);
