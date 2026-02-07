import {
  MdClose,
  MdCreditCard,
  MdDirectionsSubway,
  MdPerson,
  MdCalendarMonth,
  MdAttachMoney,
  MdPayment,
  MdAccountBalance,
  MdDescription,
  MdTag,
} from "react-icons/md";
import { formatCurrency, formatFecha } from "../../../adapters/transaccionAdapter";
import "./transaccionDetailModal.css";

/**
 * Modal de detalle de una transacción.
 * Muestra toda la información relevante (no sensible) de forma organizada.
 */
export const TransaccionDetailModal = ({ transaccion, onClose }) => {
  if (!transaccion) return null;

  const isRecarga = transaccion.tipo === "RECARGA";

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-transaccion">
        <div className="modal-header">
          <div className="modal-header-info">
            <div className={`modal-tipo-badge ${isRecarga ? "recarga" : "pasaje"}`}>
              {isRecarga ? <MdCreditCard /> : <MdDirectionsSubway />}
              <span>{isRecarga ? "Recarga" : "Pago al Metro"}</span>
            </div>
            <h2>Transacción #{transaccion.id}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <div className="modal-body">
          {/* Valor destacado */}
          <div className="modal-valor-destacado">
            <span className="modal-valor-label">Valor de la transacción</span>
            <span className={`modal-valor-amount ${isRecarga ? "recarga" : "pasaje"}`}>
              {formatCurrency(transaccion.valorPagado, transaccion.moneda)}
            </span>
            <span className="modal-valor-moneda">{transaccion.moneda}</span>
          </div>

          {/* Detalles en grid */}
          <div className="modal-details-grid">
            <div className="modal-detail-item">
              <div className="detail-icon">
                <MdTag />
              </div>
              <div className="detail-content">
                <span className="detail-label">ID Transacción</span>
                <span className="detail-value">#{transaccion.id}</span>
              </div>
            </div>

            <div className="modal-detail-item">
              <div className="detail-icon">
                <MdPerson />
              </div>
              <div className="detail-content">
                <span className="detail-label">Pasajero</span>
                <span className="detail-value">{transaccion.nombreUsuario}</span>
              </div>
            </div>

            <div className="modal-detail-item">
              <div className="detail-icon">
                <MdCalendarMonth />
              </div>
              <div className="detail-content">
                <span className="detail-label">Fecha y Hora</span>
                <span className="detail-value">{formatFecha(transaccion.fechaPago)}</span>
              </div>
            </div>

            <div className="modal-detail-item">
              <div className="detail-icon">
                <MdAttachMoney />
              </div>
              <div className="detail-content">
                <span className="detail-label">Moneda</span>
                <span className="detail-value">{transaccion.moneda}</span>
              </div>
            </div>

            {isRecarga && transaccion.medioDePagoLabel && (
              <div className="modal-detail-item">
                <div className="detail-icon">
                  <MdPayment />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Medio de Pago</span>
                  <span className="detail-value">{transaccion.medioDePagoLabel}</span>
                </div>
              </div>
            )}

            {isRecarga && transaccion.nombrePasarela && (
              <div className="modal-detail-item">
                <div className="detail-icon">
                  <MdAccountBalance />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Pasarela de Pago</span>
                  <span className="detail-value">{transaccion.nombrePasarela}</span>
                </div>
              </div>
            )}

            {!isRecarga && transaccion.idEstacion && (
              <div className="modal-detail-item">
                <div className="detail-icon">
                  <MdDirectionsSubway />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Estación</span>
                  <span className="detail-value">Estación #{transaccion.idEstacion}</span>
                </div>
              </div>
            )}

            <div className="modal-detail-item full-width">
              <div className="detail-icon">
                <MdDescription />
              </div>
              <div className="detail-content">
                <span className="detail-label">Descripción</span>
                <span className="detail-value">{transaccion.descripcion}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-close" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
