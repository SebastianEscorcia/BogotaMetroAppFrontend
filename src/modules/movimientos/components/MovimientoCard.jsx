import {
  getMovimientoLabelFecha,
  getTipoConfig,
} from "../helpers";
import { formatCurrencyMoneda } from "../../../global/utils/helpers/formatCurrencyMoneda";

export const MovimientoCard = ({ tx }) => {
  const transactionConfig = getTipoConfig(tx.tipo);
  const Icon = transactionConfig.icon;
  return (
    <div className={`mov-card ${transactionConfig.class}`}>
      <div className="mov-card-icon">
        <Icon />
      </div>
      <div className="mov-card-info">
            <div className="mov-card-top">
            <span className="mov-card-tipo">{tx.tipoLabel || transactionConfig.label}</span>
            <span className={`mov-card-valor ${transactionConfig.valueClass}`}>
                {transactionConfig.valuePrefix}
                {formatCurrencyMoneda(tx.valorPagado, tx.moneda)}
            </span>
            </div>
            <div className="mov-card-bottom">
            <span className="mov-card-fecha">
                {getMovimientoLabelFecha(tx.fechaPago)}
            </span>
            {tx.medioDePagoLabel && tx.tipo === "RECARGA" && (
                <span className="mov-card-medio">{tx.medioDePagoLabel}</span>
            )}
            {tx.medioDePagoLabel && tx.tipo === "TRANSFERENCIA" && (
                <span className="mov-card-medio">
                <Icon /> {tx.medioDePagoLabel}
                </span>
            )}
            {tx.idEstacion && (
                <span className="mov-card-estacion">Estación #{tx.idEstacion}</span>
            )}
            </div>
            {tx.descripcion && tx.descripcion !== "Sin descripción" && (
            <span className="mov-card-desc">{tx.descripcion}</span>
            )}
      </div>
    </div>
  );
};
