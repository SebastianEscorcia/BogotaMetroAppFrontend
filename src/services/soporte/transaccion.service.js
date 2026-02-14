import { httpClient } from "../../helpers";

/**
 * Servicio de transacciones para el rol SOPORTE.
 * Mapea los endpoints del TransaccionController del backend.
 */

/**  Obtener transacción por ID (SOPORTE o dueño) */
export const getTransaccionPorId = (id) =>
  httpClient(`/pagos/${id}`);

/** Obtener transacciones por usuario */
export const getTransaccionesPorUsuario = (idUsuario) =>
  httpClient(`/pagos/usuario/${idUsuario}`);

/** Obtener transacciones globales por rango de fechas (SOPORTE) */
export const getTransaccionesGlobalesPorFechas = (fechaInicio, fechaFin) =>
  httpClient(`/pagos/fechas?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`);

/**  Búsqueda avanzada por usuario con filtros */
export const buscarTransaccionesAvanzado = (idUsuario, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params.fechaInicio) searchParams.append("fechaInicio", params.fechaInicio);
  if (params.fechaFin) searchParams.append("fechaFin", params.fechaFin);
  if (params.min != null) searchParams.append("min", params.min);
  if (params.max != null) searchParams.append("max", params.max);
  const query = searchParams.toString();
  return httpClient(`/pagos/usuario/${idUsuario}/buscar${query ? `?${query}` : ""}`);
};


/**  Obtener por usuario y rango de fechas */
export const getTransaccionesPorUsuarioYFechas = (idUsuario, fechaInicio, fechaFin) =>
  httpClient(
    `/pagos/usuario/${idUsuario}/fechas?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`
  );

/** Buscar transacciones por número de documento (SOPORTE) */
export const getTransaccionesPorDocumento = (numDocumento) =>
  httpClient(`/pagos/usuario/documento/${encodeURIComponent(numDocumento)}`);

/**  Buscar transacciones por nombre del pasajero (SOPORTE) */
export const getTransaccionesPorNombre = (nombre) =>
  httpClient(`/pagos/usuario/nombre/${encodeURIComponent(nombre)}`);

export const getTransaccionesPorMedioDePago = (medioPago) =>{
   return  httpClient(`/pagos/recarga/usuario/medio-pago/${encodeURIComponent(medioPago)}`)
}
