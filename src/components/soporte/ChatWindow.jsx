import { useState, useRef, useEffect, useMemo } from "react";
import { MdSend, MdClose, MdPerson } from "react-icons/md";
import { useChatRoom, TipoRemitente } from "../../hooks/chat/useChatRoom";
import { ConfirmDialog } from "../common";

export const ChatWindow = ({ sesion, idSoporte, onCerrar }) => {
  const [inputMensaje, setInputMensaje] = useState("");
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [closingChat, setClosingChat] = useState(false);
  const mensajesEndRef = useRef(null);

  const {
    mensajes,
    sesionInfo,
    loading,
    error,
    isConnected,
    sesionCerrada,
    reconectarASesion,
    enviarMensaje,
    cerrarChat,
    limpiarError,
  } = useChatRoom(sesion?.id);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  useEffect(() => {
    if (sesion?.id) {
      reconectarASesion(sesion.id).catch(console.error);
    }
  }, [sesion?.id]);

  const nombrePasajero = useMemo(() => {
    const pasajero = sesionInfo?.participantes?.find(
      (p) => p.rol === "PASAJERO" || p.tipoUsuario === "PASAJERO"
    );
    return pasajero?.nombreUsuario || pasajero?.nombre || "Pasajero";
  }, [sesionInfo]);

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!inputMensaje.trim() || !isConnected || sesionCerrada) return;

    enviarMensaje(inputMensaje.trim(), idSoporte, TipoRemitente.SOPORTE);
    setInputMensaje("");
  };

  const handleCerrarChat = async () => {
    setClosingChat(true);
    try {
      await cerrarChat();
      onCerrar?.();
    } finally {
      setClosingChat(false);
      setShowConfirmClose(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="avatar">
            <MdPerson />
          </div>
          <div className="info">
            <h3>{nombrePasajero}</h3>
            <span
              className={`status ${
                sesionCerrada
                  ? "cerrada"
                  : isConnected
                  ? "online"
                  : "offline"
              }`}
            >
              {sesionCerrada
                ? "Sesión cerrada"
                : isConnected
                ? "En línea"
                : "Desconectado"}
            </span>
          </div>
        </div>

        <button
          className="btn-cerrar-chat"
          onClick={() => setShowConfirmClose(true)}
          title="Cerrar chat"
        >
          <MdClose />
        </button>
      </div>

      <div className="chat-messages">
        {loading && <p className="loading">Cargando mensajes…</p>}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={limpiarError}>Cerrar</button>
          </div>
        )}

        {mensajes.map((msg, index) => (
          <div
            key={msg.id ?? index}
            className={`message ${
              msg.tipoRemitente === TipoRemitente.SOPORTE
                ? "sent"
                : msg.tipoRemitente === TipoRemitente.SISTEMA
                ? "system"
                : "received"
            }`}
          >
            <p>{msg.contenido}</p>
            {msg.fechaEnvio && (
              <span className="time">
                {new Date(msg.fechaEnvio).toLocaleTimeString("es-CO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        ))}

        <div ref={mensajesEndRef} />
      </div>

      {sesionCerrada ? (
        <div className="chat-cerrado">
          <p>Esta sesión ha sido cerrada</p>
          <button onClick={onCerrar}>Volver al panel</button>
        </div>
      ) : (
        <form className="chat-input" onSubmit={handleEnviar}>
          <input
            value={inputMensaje}
            onChange={(e) => setInputMensaje(e.target.value)}
            placeholder="Escribe un mensaje…"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMensaje.trim()}
          >
            <MdSend />
          </button>
        </form>
      )}

      <ConfirmDialog
        isOpen={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        onConfirm={handleCerrarChat}
        title="Cerrar sesión de chat"
        message="¿Estás seguro de que deseas cerrar esta sesión de chat? Esta acción no se puede deshacer."
        loading={closingChat}
        icon={<MdClose />}
        confirmText="Cerrar chat"
        loadingText="Cerrando..."
        confirmVariant="btn-danger"
      />
    </div>
  );
};
