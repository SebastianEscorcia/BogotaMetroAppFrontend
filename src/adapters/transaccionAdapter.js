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
  TRANSFERENCIA_ENVIADA: "Transferencia enviada",
  TRANSFERENCIA_RECIBIDA: "Transferencia recibida",
  PSE: "PSE",
  NEQUI: "Nequi",
  DAVIPLATA: "Daviplata",
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
  SALDO_VIRTUAL: "Saldo virtual",
};

const MONEDA_SYMBOLS = {
  COP: "$",
  USD: "US$",
};
const TIPO_TRANSACCION_MAP = {
  RECARGA_EXITOSA: { tipo: "RECARGA", label: "Recarga exitosa" },
  RECARGA_FALLIDA: { tipo: "RECARGA", label: "Recarga fallida" },
  COBRO_PASAJE_EXITOSO: { tipo: "PASAJE", label: "Pago pasaje" },
  COBRO_PASAJE_FALLIDO: { tipo: "PASAJE", label: "Pago pasaje fallido" },
  DEVOLUCION_PASAJE_EXITOSA: { tipo: "PASAJE", label: "Devolución pasaje" },
  DEVOLUCION_PASAJE_FALLIDA: { tipo: "PASAJE", label: "Devolución fallida" },
  SALDO_ENVIADO: { tipo: "TRANSFERENCIA", label: "Saldo enviado" },
  SALDO_RECIBIDO: { tipo: "TRANSFERENCIA", label: "Saldo recibido" },
};

/**
 * Determina el tipo de transacción a partir del DTO del backend.
 * - Si tiene medioDePago o nombrePasarela → RECARGA
 * - Si tiene idEstacion → PASAJE
 */
const determinarTipoTransaccion = (tx, medioPagoRaw) => {
  if (tx.tipoTransaccion && TIPO_TRANSACCION_MAP[tx.tipoTransaccion]) {
    return TIPO_TRANSACCION_MAP[tx.tipoTransaccion].tipo;
  }

  if (tx.idEstacion != null) return "PASAJE";
  if (
    medioPagoRaw === "TRANSFERENCIA_ENVIADA" ||
    medioPagoRaw === "TRANSFERENCIA_RECIBIDA"
  )
    return "TRANSFERENCIA";
  if (tx.descripcion?.startsWith("Transferencia")) return "TRANSFERENCIA";

  return "RECARGA";
};

/**
 * Adapta una transacción del backend eliminando datos sensibles
 * y enriqueciendo con tipo y formatos legibles.
 */
export const adaptTransaccionFromBackend = (tx) => {
  const medioPagoRaw = tx.medioDePago;
  
  const tipoInfo = TIPO_TRANSACCION_MAP[tx.tipoTransaccion];

  return {
    id: tx.id,
    valorPagado: tx.valorPagado ?? tx.valor,
    fechaPago: tx.fechaPago ?? tx.fecha,
    descripcion: tx.descripcion || "Sin descripción",
    moneda: tx.moneda || "COP",
    medioDePago: medioPagoRaw,
    medioDePagoLabel: MEDIO_PAGO_LABELS[medioPagoRaw] || medioPagoRaw,
    nombreUsuario: tx.nombreUsuario || "Usuario desconocido",
    nombrePasarela: tx.nombrePasarela || null,
    idEstacion: tx.idEstacion || null,
    tipo: determinarTipoTransaccion(tx, medioPagoRaw),
    tipoLabel: tipoInfo?.label || null,
    tipoTransaccionRaw: tx.tipoTransaccion || null,
    _idUsuario: tx.idUsuario,
  };
};

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
