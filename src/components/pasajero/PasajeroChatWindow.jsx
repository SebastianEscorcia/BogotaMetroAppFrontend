import { useState, useRef, useEffect, useMemo } from "react";
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
 * @param {boolean} props.sesionCerrada - Indica si la sesión fue cerrada
 * @param {Function} props.onNuevoChat - Función para iniciar un nuevo chat
 */
export const PasajeroChatWindow = ({
  mensajes,
  isConnected,
  loading,
  error,
  enviarMensaje,
  idUsuario,
  sesionInfo,
  sesionCerrada = false,
  onNuevoChat,
}) => {
  const [inputMensaje, setInputMensaje] = useState("");
  const mensajesEndRef = useRef(null);

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);
  
  // Memoizar la verificación del agente para mejor rendimiento
  const agenteConectado = useMemo(() => {
    if (!sesionInfo?.participantes) return null;
    return sesionInfo.participantes.find(
      (p) => p.rol === "SOPORTE" || p.tipoUsuario === "SOPORTE"
    );
  }, [sesionInfo?.participantes]);

  // Verificar si hay un agente conectado
  const hayAgenteConectado = useMemo(() => !!agenteConectado, [agenteConectado]);

  const obtenerNombreAgente = () => {
    if (!agenteConectado) return "Agente de Soporte";
    return agenteConectado.nombreUsuario || agenteConectado.nombre || "Agente de Soporte";
  };

  // Determinar el estado actual del chat
  const estadoChat = useMemo(() => {
    if (sesionCerrada) {
      return { texto: "Sesión cerrada", clase: "cerrada", puedeEnviar: false };
    }
    if (!isConnected) {
      return { texto: "Sin conexión", clase: "offline", puedeEnviar: false };
    }
    if (!hayAgenteConectado) {
      return { texto: "Esperando agente", clase: "offline", puedeEnviar: false };
    }
    return { texto: "En línea", clase: "online", puedeEnviar: true };
  }, [isConnected, hayAgenteConectado, sesionCerrada]);

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!inputMensaje.trim() || !estadoChat.puedeEnviar) return;

    enviarMensaje(inputMensaje.trim(), idUsuario, TipoRemitente.PASAJERO);
    setInputMensaje("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleEnviar(e);
    }
  };

  return (
    <div className="pasajero-chat-window">
      <div className="pasajero-chat-header">
        <div className="pasajero-chat-header-info">
          <div className={`avatar-agente ${sesionCerrada ? "avatar-cerrado" : !estadoChat.puedeEnviar ? "avatar-esperando" : ""}`}>
            <MdSupportAgent />
          </div>
          <div className="info">
            <h3>
              {sesionCerrada 
                ? "Sesión finalizada" 
                : hayAgenteConectado 
                  ? obtenerNombreAgente() 
                  : "Esperando agente..."}
            </h3>
            <span className={`status ${estadoChat.clase}`}>
              {estadoChat.texto}
            </span>
          </div>
        </div>
      </div>

      <div className="pasajero-chat-messages">
        {loading && (
          <div className="chat-loading">
            <p>Cargando mensajes...</p>
          </div>
        )}

        {error && (
          <div className="chat-error">
            <p> {error}</p>
          </div>
        )}

        {!hayAgenteConectado && !sesionCerrada && mensajes.length === 0 && (
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

      {sesionCerrada ? (
        <div className="pasajero-chat-cerrado">
          <p>La sesión ha finalizado</p>
          {onNuevoChat && (
            <button 
              type="button" 
              className="btn-nuevo-chat"
              onClick={onNuevoChat}
            >
              Iniciar nuevo chat
            </button>
          )}
        </div>
      ) : (
        <form className="pasajero-chat-input" onSubmit={handleEnviar}>
          <input
            type="text"
            value={inputMensaje}
            onChange={(e) => setInputMensaje(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              !isConnected
                ? "Conectando..."
                : !hayAgenteConectado
                ? "Esperando a que un agente se conecte..."
                : "Escribe tu mensaje..."
            }
            disabled={!estadoChat.puedeEnviar}
          />
          <button
            type="submit"
            disabled={!inputMensaje.trim() || !estadoChat.puedeEnviar}
            className="btn-enviar"
          >
            <MdSend />
          </button>
        </form>
      )}
    </div>
  );
};
