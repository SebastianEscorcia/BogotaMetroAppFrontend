import { MdRefresh, MdHeadsetMic, MdPending } from "react-icons/md";

/**
 * Header del dashboard de soporte
 */
export const SoporteHeader = ({
  pendientesCount,
  activasCount,
  isConnected,
  onRefresh,
  loading,
}) => {
  return (
    <header className="soporte-dashboard-header">
      <div className="header-left">
        <MdHeadsetMic className="header-icon" />
        <div className="header-info">
          <h1>Panel de Soporte</h1>
          <p>Gestiona las solicitudes de chat de los pasajeros</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-stats">
          <div className="stat-badge pendientes">
            <MdPending />
            <span>{pendientesCount} pendientes</span>
          </div>
          <div className="stat-badge activas">
            <MdHeadsetMic />
            <span>{activasCount} activas</span>
          </div>
          <div className={`connection-status ${isConnected ? "online" : "offline"}`}>
            <span className="status-dot"></span>
            <span>{isConnected ? "Conectado" : "Desconectado"}</span>
          </div>
        </div>

        <button
          className="btn-refresh"
          onClick={onRefresh}
          disabled={loading}
          title="Refrescar"
        >
          <MdRefresh className={loading ? "spinning" : ""} />
        </button>
      </div>
    </header>
  );
};
