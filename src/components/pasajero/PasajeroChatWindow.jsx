import { useState, useRef, useEffect } from "react";
import { MdSend, MdSupportAgent } from "react-icons/md";
import { TipoRemitente } from "../../hooks/chat/useChatRoom";
import "./pasajero-chat.css";

/**
 * Ventana de chat para el pasajero
 * @param {Object} props
 * @param {Array} props.mensajes - Lista de mensajes
 * @param {boolean} props.isConnected - Estado de conexión WebSocket
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.error - Mensaje de error
 * @param {Function} props.enviarMensaje - Función para enviar mensaje
 * @param {number} props.idUsuario - ID del pasajero
 * @param {Object} props.sesionInfo - Información de la sesión
 */
export const PasajeroChatWindow = ({
  mensajes,
  isConnected,
  loading,
  error,
  enviarMensaje,
  idUsuario,
  sesionInfo,
}) => {
  const [inputMensaje, setInputMensaje] = useState("");
  const mensajesEndRef = useRef(null);

  // Scroll automático al último mensaje
  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // Verificar si hay un agente de soporte conectado
  const hayAgenteConectado = () => {
    if (!sesionInfo?.participantes) return false;
    return sesionInfo.participantes.some(
      (p) => p.rol === "SOPORTE" || p.tipoUsuario === "SOPORTE"
    );
  };

  // Obtener nombre del agente de soporte
  const obtenerNombreAgente = () => {
    if (!sesionInfo?.participantes) return "Agente de Soporte";
    const agente = sesionInfo.participantes.find(
      (p) => p.rol === "SOPORTE" || p.tipoUsuario === "SOPORTE"
    );
    return agente?.nombreCompleto || agente?.nombre || "Agente de Soporte";
  };

  // Enviar mensaje
  const handleEnviar = (e) => {
    e.preventDefault();
    if (!inputMensaje.trim() || !isConnected) return;

    enviarMensaje(inputMensaje.trim(), idUsuario, TipoRemitente.PASAJERO);
    setInputMensaje("");
  };

  // Manejar Enter para enviar
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleEnviar(e);
    }
  };

  return (
    <div className="pasajero-chat-window">
      {/* Header del chat */}
      <div className="pasajero-chat-header">
        <div className="pasajero-chat-header-info">
          <div className="avatar-agente">
            <MdSupportAgent />
          </div>
          <div className="info">
            <h3>{hayAgenteConectado() ? obtenerNombreAgente() : "Esperando agente..."}</h3>
            <span className={`status ${isConnected ? "online" : "offline"}`}>
              {isConnected ? "Conectado" : "Desconectado"}
            </span>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="pasajero-chat-messages">
        {loading && (
          <div className="chat-loading">
            <p>Cargando mensajes...</p>
          </div>
        )}

        {error && (
          <div className="chat-error">
            <p>❌ {error}</p>
          </div>
        )}

        {!hayAgenteConectado() && mensajes.length === 0 && (
          <div className="esperando-agente">
            <div className="esperando-icon">⏳</div>
            <p>Tu solicitud ha sido registrada.</p>
            <p>Un agente se conectará contigo pronto.</p>
          </div>
        )}

        {mensajes.map((mensaje, index) => (
          <div
            key={mensaje.id || index}
            className={`mensaje ${
              mensaje.tipoRemitente === TipoRemitente.PASAJERO
                ? "mensaje-propio"
                : mensaje.tipoRemitente === TipoRemitente.SISTEMA
                ? "mensaje-sistema"
                : "mensaje-agente"
            }`}
          >
            {mensaje.tipoRemitente === TipoRemitente.SISTEMA ? (
              <div className="mensaje-sistema-contenido">
                <span>{mensaje.contenido}</span>
              </div>
            ) : (
              <>
                <div className="mensaje-contenido">
                  <p>{mensaje.contenido}</p>
                </div>
                <span className="mensaje-hora">
                  {mensaje.fechaEnvio
                    ? new Date(mensaje.fechaEnvio).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </>
            )}
          </div>
        ))}
        <div ref={mensajesEndRef} />
      </div>

      {/* Input de mensaje */}
      <form className="pasajero-chat-input" onSubmit={handleEnviar}>
        <input
          type="text"
          value={inputMensaje}
          onChange={(e) => setInputMensaje(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isConnected
              ? "Escribe tu mensaje..."
              : "Conectando..."
          }
          disabled={!isConnected}
        />
        <button
          type="submit"
          disabled={!inputMensaje.trim() || !isConnected}
          className="btn-enviar"
        >
          <MdSend />
        </button>
      </form>
    </div>
  );
};
