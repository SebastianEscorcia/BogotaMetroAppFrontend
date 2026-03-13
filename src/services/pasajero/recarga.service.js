import { httpClient } from "../../global/utils/helpers";

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

