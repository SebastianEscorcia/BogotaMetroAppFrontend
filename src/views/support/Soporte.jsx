import { Button, FondoPag } from "../../components/common";
import { SupportButton } from "../../components/supportfaq/SupportButton";
import { PasajeroChatWindow } from "../../components/pasajero";

import { routeMapFaq } from "../../global/utils/helpers";

import { AiFillCaretLeft } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

import { useAuth } from "../../global/context";
import { useChatRoom,useNavigateTo, useCategoryFaq } from "../../hooks";
import { useState } from "react";

import "./soporte.css";
export const Soporte = () => {
  const { faqCategorys, loading, error } = useCategoryFaq();
  const { user } = useAuth();
  const { goTo } = useNavigateTo();
  const [mostrarChat, setMostrarChat] = useState(false);

  const {
    idSesion,
    mensajes,
    sesionInfo,
    loading: loadingChat,
    error: errorChat,
    isConnected,
    sesionCerrada,
    iniciarChat,
    enviarMensaje,
    limpiarError,
    reiniciarChat,
  } = useChatRoom();

   const handleSolicitarSoporte = async () => {
    try {
      limpiarError();
      const sesionId = await iniciarChat(user.id);
      setMostrarChat(true);
    } catch (err) {
      console.error("Error al solicitar soporte:", err);
    }
  };

  const handleNuevoChat = async () => {
    reiniciarChat();
    await handleSolicitarSoporte();
  };
  
  if (loading) {
    return (
      <FondoPag>
        <div className="soporte-loading">
          <p>Cargando categorías...</p>
        </div>
      </FondoPag>
    );
  }

  if (error) {
    return (
      <FondoPag>
        <div className="soporte-error">
          <p>Error al cargar categorías</p>
        </div>
      </FondoPag>
    );
  }

  if (mostrarChat && idSesion) {
    return (
      <FondoPag>
        <div className="soporte">
          <header>
            <AiFillCaretLeft
              aria-label="Volver"
              onClick={() => setMostrarChat(false)}
              style={{ cursor: "pointer" }}
            />
            <h1>Chat de Soporte</h1>
            <span className="sesion-id">#{idSesion}</span>
          </header>

          <main className="chat-container">
            <PasajeroChatWindow
              mensajes={mensajes}
              isConnected={isConnected}
              loading={loadingChat}
              error={errorChat}
              enviarMensaje={enviarMensaje}
              idUsuario={user?.id}
              sesionInfo={sesionInfo}
              sesionCerrada={sesionCerrada}
              onNuevoChat={handleNuevoChat}
            />
          </main>
        </div>
      </FondoPag>
    );
  }

  return (
    <FondoPag>
      <div className="soporte">
        <header>
          <AiFillCaretLeft aria-label="Volver" onClick={()=> goTo('/home')}/>
          <h1>Soporte técnico</h1>
        </header>

        <main>
          <h2>¿Cómo podemos ayudarte?</h2>

          <div className="search-container">
            <CiSearch aria-hidden="true" />
            <input
              type="search"
              className="search-input"
              placeholder="Buscar en preguntas frecuentes..."
              aria-label="Buscar ayuda"
            />
          </div>

          <div className="faq-buttons">
            {faqCategorys.map((cat) => (
              <Button
                key={cat.id}
                className="faq-btn"
                aria-label={`Ver preguntas sobre ${cat.name}`}
                onClick={() => goTo(routeMapFaq[cat.name])}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <SupportButton onClick={handleSolicitarSoporte} loading={loadingChat}/>
        </main>
      </div>
    </FondoPag>
  );
};
