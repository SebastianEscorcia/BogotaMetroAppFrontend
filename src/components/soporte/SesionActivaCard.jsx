import { MdChat, MdPerson, MdAccessTime } from "react-icons/md";

/**
 * Tarjeta de sesión activa del soporte
 */
export const SesionActivaCard = ({ sesion, onAbrirChat, isSelected }) => {
  // Formatear última actividad
  const formatearUltimaActividad = (fechaString) => {
    if (!fechaString) return "Sin actividad";
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    return fecha.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obtener nombre del pasajero
  const obtenerNombrePasajero = () => {
    if (!sesion.participantes || sesion.participantes.length === 0) {
      return "Pasajero";
    }
    const pasajero = sesion.participantes.find(
      (p) => p.rol === "PASAJERO" || p.tipoUsuario === "PASAJERO"
    );
    return pasajero?.nombreCompleto || pasajero?.nombre || "Pasajero";
  };

  return (
    <div
      className={`sesion-card activa ${isSelected ? "selected" : ""}`}
      onClick={() => onAbrirChat(sesion)}
    >
      <div className="sesion-card-header">
        <div className="sesion-id">
          <span className="label">Sesión</span>
          <span className="value">#{sesion.id}</span>
        </div>
        <div className="sesion-estado">
          <span className="badge activa">{sesion.estado || "ACTIVO"}</span>
        </div>
      </div>

      <div className="sesion-card-body">
        <div className="sesion-info-row">
          <MdPerson className="icon" />
          <span>{obtenerNombrePasajero()}</span>
        </div>
        <div className="sesion-info-row">
          <MdAccessTime className="icon" />
          <span>{formatearUltimaActividad(sesion.fechaUltimaActividad)}</span>
        </div>
      </div>

      <div className="sesion-card-footer">
        <button className="btn-abrir-chat">
          <MdChat />
          <span>Abrir chat</span>
        </button>
      </div>
    </div>
  );
};
