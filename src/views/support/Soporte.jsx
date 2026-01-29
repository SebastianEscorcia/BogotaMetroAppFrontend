import { Button, FondoPag } from "../../components/common";
import { SupportButton } from "../../components/supportfaq/SupportButton";
import { useCategoryFaq, useNavigateTo } from "../../hooks";
import { routeMapFaq } from "../../helpers";
import { AiFillCaretLeft } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import "./soporte.css";
import { useAuth } from "../../context/AuthUserContext";
import { useChatRoom } from "../../hooks";
import {useState} from 'react'
export const Soporte = () => {
  const { faqCategorys, loading, error } = useCategoryFaq();
  const { user } = useAuth();
  const { goTo } = useNavigateTo();
  const [mostrarChat, setMostrarChat] = useState(false);

  const {
    idSesion,
    loading: loadingChat,
    error: errorChat,
    isConnected,
    iniciarChat,
    limpiarError,
  } = useChatRoom();

   const handleSolicitarSoporte = async () => {
    try {
      limpiarError();
      const sesionId = await iniciarChat(user.id);
      console.log("✅ Sesión creada:", sesionId);
      setMostrarChat(true);
    } catch (err) {
      console.error("Error al solicitar soporte:", err);
    }
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

   // Si ya inició el chat, mostrar pantalla de espera
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
          </header>

          <main className="chat-espera">
            <div className="espera-container">
              <div className="espera-icon">⏳</div>
              <h2>Esperando a un agente...</h2>
              <p>Tu solicitud ha sido registrada.</p>
              <p>Un agente de soporte se conectará contigo pronto.</p>

              <div className="espera-info">
                <p>
                  <strong>Sesión:</strong> #{idSesion}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {isConnected ? "🟢 Conectado" : "🔴 Desconectado"}
                </p>
              </div>

              {errorChat && (
                <div className="error-message">
                  <p>❌ {errorChat}</p>
                  <Button onClick={limpiarError}>Cerrar</Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </FondoPag>
    );
  }

  return (
    <FondoPag>
      <div className="soporte">
        <header>
          <AiFillCaretLeft aria-label="Volver" />
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
