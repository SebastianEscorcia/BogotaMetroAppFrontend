import { MdChatBubble } from "react-icons/md";
import { SesionActivaCard } from "./SesionActivaCard";

/**
 * Lista de sesiones activas del soporte
 */
export const SesionesActivasList = ({
  sesiones,
  onAbrirChat,
  sesionSeleccionada,
  loading,
}) => {
  if (loading) {
    return (
      <div className="sesiones-list loading">
        <p>Cargando sesiones activas...</p>
      </div>
    );
  }

  if (!sesiones || sesiones.length === 0) {
    return (
      <div className="sesiones-list empty">
        <MdChatBubble className="empty-icon" />
        <h3>No tienes chats activos</h3>
        <p>Toma una sesión pendiente para comenzar</p>
      </div>
    );
  }

  return (
    <div className="sesiones-list">
      <div className="sesiones-grid">
        {sesiones.map((sesion) => (
          <SesionActivaCard
            key={sesion.id}
            sesion={sesion}
            onAbrirChat={onAbrirChat}
            isSelected={sesionSeleccionada?.id === sesion.id}
          />
        ))}
      </div>
    </div>
  );
};
