import {
  MdCreditCard,
  MdDirectionsSubway,
  MdReceipt,
  MdTrendingUp,
} from "react-icons/md";
import { formatCurrency } from "../../../adapters/transaccionAdapter";
import { TransaccionFilters } from "./TransaccionFilters";
import { TransaccionesTable } from "./TransaccionesTable";
import { TransaccionDetailModal } from "./TransaccionDetailModal";
import "./transaccionesPanel.css";

/**
 * Panel principal de transacciones.
 * Recibe el tipo ("RECARGA" o "PASAJE") y renderiza
 * filtros, estadísticas, tabla y modal de detalle.
 */
export const TransaccionesPanel = ({
  tipo,
  transacciones,
  stats,
  filtros,
  loading,
  error,
  selectedTransaccion,
  onUpdateFiltro,
  onBuscar,
  onResetFiltros,
  onVerDetalle,
  onCloseDetalle,
  onClearError,
}) => {
  const isRecarga = tipo === "RECARGA";
  const data = isRecarga
    ? transacciones.filter((tx) => tx.tipo === "RECARGA")
    : transacciones.filter((tx) => tx.tipo === "PASAJE");

  const sectionTitle = isRecarga ? "Recargas" : "Pagos al Metro";
  const sectionDesc = isRecarga
    ? "Consulta las recargas de saldo realizadas por los pasajeros"
    : "Consulta los cobros de pasaje en las estaciones del metro";

  const sectionStats = isRecarga
    ? { cantidad: stats.cantidadRecargas, monto: stats.montoRecargas }
    : { cantidad: stats.cantidadPasajes, monto: stats.montoPasajes };

  return (
    <div className="transacciones-panel">
      {/* Header de la sección */}
      <div className="section-header">
        <div className="section-header-info">
          <div className="section-header-icon">
            {isRecarga ? <MdCreditCard /> : <MdDirectionsSubway />}
          </div>
          <div>
            <h2 className="section-title">{sectionTitle}</h2>
            <p className="section-subtitle">{sectionDesc}</p>
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      {data.length > 0 && (
        <div className="transaccion-stats-row">
          <div className="transaccion-stat-card">
            <div className="stat-card-icon primary">
              <MdReceipt />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{sectionStats.cantidad}</span>
              <span className="stat-card-label">
                {isRecarga ? "Recargas" : "Pagos"} encontrados
              </span>
            </div>
          </div>

          <div className="transaccion-stat-card">
            <div className="stat-card-icon success">
              <MdTrendingUp />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">
                {formatCurrency(sectionStats.monto)}
              </span>
              <span className="stat-card-label">Monto total</span>
            </div>
          </div>

          <div className="transaccion-stat-card">
            <div className="stat-card-icon info">
              {isRecarga ? <MdCreditCard /> : <MdDirectionsSubway />}
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{stats.totalTransacciones}</span>
              <span className="stat-card-label">Total consultado</span>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <TransaccionFilters
        filtros={filtros}
        onUpdateFiltro={onUpdateFiltro}
        onBuscar={onBuscar}
        onReset={onResetFiltros}
        loading={loading}
      />

      {/* Error */}
      {error && (
        <div className="transaccion-error">
          <p>❌ {error}</p>
          <button onClick={onClearError}>Cerrar</button>
        </div>
      )}

      {/* Tabla */}
      <TransaccionesTable
        transacciones={data}
        tipo={tipo}
        onVerDetalle={onVerDetalle}
        loading={loading}
      />

      {/* Modal de detalle */}
      {selectedTransaccion && (
        <TransaccionDetailModal
          transaccion={selectedTransaccion}
          onClose={onCloseDetalle}
        />
      )}
    </div>
  );
};
