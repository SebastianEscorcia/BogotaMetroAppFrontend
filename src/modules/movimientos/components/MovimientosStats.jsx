import {
  MdReceipt,
  MdArrowDownward,
  MdDirectionsTransit,
  MdSyncAlt,
} from "react-icons/md";

export const MovimientosStats = ({ stats }) => {
  return (
    <div className="mov-stats">
      <div className="mov-stat-card">
        <MdReceipt className="stat-icon" />
        <div>
          <span className="stat-number">{stats.totalTransacciones}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>
      <div className="mov-stat-card recargas">
        <MdArrowDownward className="stat-icon" />
        <div>
          <span className="stat-number">{stats.cantRecargas}</span>
          <span className="stat-label">Recargas</span>
        </div>
      </div>
      <div className="mov-stat-card pasajes">
        <MdDirectionsTransit className="stat-icon" />
        <div>
          <span className="stat-number">{stats.cantPasajes}</span>
          <span className="stat-label">Pasajes</span>
        </div>
      </div>
      <div className="mov-stat-card transferencias">
        <MdSyncAlt className="stat-icon" />
        <div>
          <span className="stat-number">{stats.cantTransFerencias}</span>
          <span className="stat-label">Transferencias</span>
        </div>
      </div>
    </div>
  );
};
