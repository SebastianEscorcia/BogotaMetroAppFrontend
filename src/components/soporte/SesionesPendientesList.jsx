import { MdInbox } from "react-icons/md";
import { SesionPendienteCard } from "./SesionPendienteCard";

/**
 * Lista de sesiones pendientes (cola de espera)
 */
export const SesionesPendientesList = ({
  sesiones,
  onTomarSesion,
  loading,
  loadingTomar,
}) => {
  if (loading) {
    return (
      <div className="sesiones-list loading">
        <p>Cargando sesiones pendientes...</p>
      </div>
    );
  }

  if (!sesiones || sesiones.length === 0) {
    return (
      <div className="sesiones-list empty">
        <MdInbox className="empty-icon" />
        <h3>No hay sesiones pendientes</h3>
        <p>Las nuevas solicitudes de chat aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="sesiones-list">
      <div className="sesiones-grid">
        {sesiones.map((sesion) => (
          <SesionPendienteCard
            key={sesion.id}
            sesion={sesion}
            onTomarSesion={onTomarSesion}
            loading={loadingTomar}
          />
        ))}
      </div>
    </div>
  );
};
