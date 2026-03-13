export const formatCurrencyMoneda = (valor, moneda = "COP") => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: 0,
  }).format(valor);
};
