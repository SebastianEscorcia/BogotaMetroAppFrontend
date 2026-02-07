/**
 * Adaptador de transacciones - Filtra campos sensibles y normaliza
 * para la UI del módulo de soporte.
 *
 * Campos ocultos (sensibles / no relevantes para soporte):
 *  - referenciaPasarela (referencia interna de pasarela)
 *  - idUsuario (ID interno)
 *  - numDocumentoUsuario (dato personal sensible)
 *  - idPasarela (ID interno)
 */

const MEDIO_PAGO_LABELS = {
  TARJETA_CREDITO: "Tarjeta de Crédito",
  TARJETA_DEBITO: "Tarjeta de Débito",
  PSE: "PSE",
  NEQUI: "Nequi",
  DAVIPLATA: "Daviplata",
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
  SALDO_VIRTUAL: "Saldo virtual"
};

const MONEDA_SYMBOLS = {
  COP: "$",
  USD: "US$",
};

/**
 * Determina el tipo de transacción a partir del DTO del backend.
 * - Si tiene medioDePago o nombrePasarela → RECARGA
 * - Si tiene idEstacion → PASAJE
 */
const determinarTipoTransaccion = (tx) => {
  if (tx.idEstacion != null) return "PASAJE";
  return "RECARGA";
};

/**
 * Adapta una transacción del backend eliminando datos sensibles
 * y enriqueciendo con tipo y formatos legibles.
 */
export const adaptTransaccionFromBackend = (tx) => ({
  id: tx.id,
  valorPagado: tx.valorPagado,
  fechaPago: tx.fechaPago,
  descripcion: tx.descripcion || "Sin descripción",
  moneda: tx.moneda || "COP",
  medioDePago: tx.medioDePago,
  medioDePagoLabel: MEDIO_PAGO_LABELS[tx.medioDePago] || tx.medioDePago || "—",
  nombreUsuario: tx.nombreUsuario || "Usuario desconocido",
  nombrePasarela: tx.nombrePasarela || null,
  idEstacion: tx.idEstacion || null,
  tipo: determinarTipoTransaccion(tx),
  // Campo auxiliar para guardar el idUsuario (necesario para búsquedas internas, NO se muestra)
  _idUsuario: tx.idUsuario,
});

/**
 * Formatea un valor monetario con el símbolo de moneda.
 */
export const formatCurrency = (valor, moneda = "COP") => {
  const symbol = MONEDA_SYMBOLS[moneda] || "$";
  const num = Number(valor);
  if (isNaN(num)) return `${symbol} 0`;
  return `${symbol} ${num.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

/**
 * Formatea una fecha ISO a formato legible en español.
 */
export const formatFecha = (fechaISO) => {
  if (!fechaISO) return "—";
  const date = new Date(fechaISO);
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formatea solo la fecha sin hora.
 */
export const formatFechaCorta = (fechaISO) => {
  if (!fechaISO) return "—";
  const date = new Date(fechaISO);
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
