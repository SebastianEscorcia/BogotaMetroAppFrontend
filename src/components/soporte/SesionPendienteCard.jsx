import { MdAccessTime, MdPerson, MdPlayArrow } from "react-icons/md";

/**
 * Tarjeta de sesión pendiente en la cola de espera
 */
export const SesionPendienteCard = ({ sesion, onTomarSesion, loading }) => {
  // Formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Sin fecha";
    const fecha = new Date(fechaString);
    return fecha.toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calcular tiempo de espera
  const calcularTiempoEspera = (fechaAsignacion) => {
    if (!fechaAsignacion) return "Recién llegado";
    const ahora = new Date();
    const fecha = new Date(fechaAsignacion);
    const diffMs = ahora - fecha;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    return `Hace ${diffHours}h ${diffMins % 60}min`;
  };

  // Obtener nombre del pasajero de los participantes
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
    <div className="sesion-card pendiente">
      <div className="sesion-card-header">
        <div className="sesion-id">
          <span className="label">Sesión</span>
          <span className="value">#{sesion.id}</span>
        </div>
        <div className="sesion-estado">
          <span className="badge pendiente">{sesion.estado || "PENDIENTE"}</span>
        </div>
      </div>

      <div className="sesion-card-body">
        <div className="sesion-info-row">
          <MdPerson className="icon" />
          <span>{obtenerNombrePasajero()}</span>
        </div>
        <div className="sesion-info-row">
          <MdAccessTime className="icon" />
          <span>{calcularTiempoEspera(sesion.fechaAsignacion)}</span>
        </div>
      </div>

      <div className="sesion-card-footer">
        <button
          className="btn-tomar-sesion"
          onClick={() => onTomarSesion(sesion)}
          disabled={loading}
        >
          <MdPlayArrow />
          <span>{loading ? "Conectando..." : "Tomar chat"}</span>
        </button>
      </div>
    </div>
  );
};
