import { useState, useRef, useEffect } from "react";
import { MdSend, MdClose, MdPerson } from "react-icons/md";
import { useChatRoom, TipoRemitente } from "../../hooks/chat/useChatRoom";

/**
 * Ventana de chat para el soporte
 */
export const ChatWindow = ({ sesion, idSoporte, onCerrar }) => {
  const [inputMensaje, setInputMensaje] = useState("");
  const mensajesEndRef = useRef(null);

  const {
    mensajes,
    loading,
    error,
    isConnected,
    reconectarASesion,
    enviarMensaje,
    cerrarChat,
    limpiarError,
  } = useChatRoom(sesion?.id);

  // Scroll automático al último mensaje
  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // Conectar a la sesión al montar (la asignación ya se hizo en el dashboard)
  useEffect(() => {
    if (sesion?.id) {
      reconectarASesion(sesion.id).catch((err) => {
        console.error("Error al conectar a sesión:", err);
      });
    }
  }, [sesion?.id, reconectarASesion]);

  // Obtener nombre del pasajero
  const obtenerNombrePasajero = () => {
    if (!sesion?.participantes || sesion.participantes.length === 0) {
      return "Pasajero";
    }
    const pasajero = sesion.participantes.find(
      (p) => p.rol === "PASAJERO" || p.tipoUsuario === "PASAJERO"
    );
    return pasajero?.nombreCompleto || pasajero?.nombre || "Pasajero";
  };

  // Enviar mensaje
  const handleEnviar = (e) => {
    e.preventDefault();
    if (!inputMensaje.trim() || !isConnected) return;

    enviarMensaje(inputMensaje.trim(), idSoporte, TipoRemitente.SOPORTE);
    setInputMensaje("");
  };

  // Cerrar chat
  const handleCerrarChat = async () => {
    try {
      await cerrarChat();
      onCerrar?.();
    } catch (err) {
      console.error("Error al cerrar chat:", err);
    }
  };

  return (
    <div className="chat-window">
      {/* Header del chat */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="avatar">
            <MdPerson />
          </div>
          <div className="info">
            <h3>{obtenerNombrePasajero()}</h3>
            <span className={`status ${isConnected ? "online" : "offline"}`}>
              {isConnected ? "En línea" : "Desconectado"}
            </span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button
            className="btn-cerrar-chat"
            onClick={handleCerrarChat}
            title="Cerrar chat"
          >
            <MdClose />
          </button>
        </div>
      </div>

      {/* Mensajes */}
      <div className="chat-messages">
        {loading && (
          <div className="loading-messages">
            <p>Cargando mensajes...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={limpiarError}>Cerrar</button>
          </div>
        )}

        {mensajes.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`message ${
              msg.tipoRemitente === TipoRemitente.SOPORTE
                ? "sent"
                : msg.tipoRemitente === TipoRemitente.SISTEMA
                ? "system"
                : "received"
            }`}
          >
            <div className="message-content">
              <p>{msg.contenido}</p>
              <span className="message-time">
                {msg.fechaEnvio
                  ? new Date(msg.fechaEnvio).toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>
          </div>
        ))}

        <div ref={mensajesEndRef} />
      </div>

      {/* Input de mensaje */}
      <form className="chat-input" onSubmit={handleEnviar}>
        <input
          type="text"
          value={inputMensaje}
          onChange={(e) => setInputMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={!isConnected}
        />
        <button
          type="submit"
          disabled={!isConnected || !inputMensaje.trim()}
          title="Enviar mensaje"
        >
          <MdSend />
        </button>
      </form>
    </div>
  );
};
