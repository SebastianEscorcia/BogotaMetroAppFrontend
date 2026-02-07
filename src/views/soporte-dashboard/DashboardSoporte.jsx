import { useState, useCallback } from "react";
import { FondoPag } from "../../components/common";
import {getErrorMessage} from '../../helpers';
import {errorConstants} from '../../constants';
import {
  SoporteHeader,
  SesionesPendientesList,
  SesionesActivasList,
  ChatWindow,
} from "../../components/soporte";
import { useSoporteChat } from "../../hooks/admin/soporte/useSoporteChat";
import { useChatRoom } from "../../hooks/chat/useChatRoom";
import { useAuth } from "../../context/AuthUserContext";
import { MdPending, MdChat } from "react-icons/md";
import "./dashboardSoporte.css";

export const DashboardSoporte = () => {
  const { user } = useAuth();
  const idSoporte = user?.id || localStorage.getItem("soporteId");

  const [activeTab, setActiveTab] = useState("pendientes");
  const [sesionSeleccionada, setSesionSeleccionada] = useState(null);
  const [loadingTomar, setLoadingTomar] = useState(false);

  const {
    sesionesPendientes,
    sesionesActivas,
    loading,
    error,
    isConnected,
    refrescar,
    quitarDePendientes,
    agregarAActivas,
    quitarDeActivas,
    limpiarError,
    mostrarError,
  } = useSoporteChat(idSoporte);

  const {
    unirseASesion,
    loading: loadingChat,
  } = useChatRoom();

  const handleTomarSesion = useCallback(
    async (sesion) => {
      if (!idSoporte || loadingTomar)return;

      try {
        setLoadingTomar(true);

        await unirseASesion(sesion.id, idSoporte);

        quitarDePendientes(sesion.id);
        agregarAActivas({ ...sesion, estado: "ACTIVO" });

        setSesionSeleccionada(sesion);
        setActiveTab("activas");
      } catch (err) {
        console.error("Error al tomar sesión:", err);
        
        const messageError = getErrorMessage(err, errorConstants)
     
        const esSesionTomada = messageError === errorConstants.CHAT_TOMADO_POR_SOPORTE;
         
        mostrarError(messageError);
        
        if (esSesionTomada) {
          quitarDePendientes(sesion.id);
          // No llamar refrescar inmediatamente para no sobrescribir el error
          setTimeout(() => refrescar(), 2000);
        }
      } finally {
        setLoadingTomar(false);
      }
    },
    [idSoporte, unirseASesion, quitarDePendientes, agregarAActivas, refrescar, mostrarError]
  );

  const handleAbrirChat = useCallback((sesion) => {
    setSesionSeleccionada(sesion);
  }, []);

  const handleCerrarChat = useCallback(() => {
    if (sesionSeleccionada) {
      quitarDeActivas(sesionSeleccionada.id);
    }
    setSesionSeleccionada(null);
  }, [sesionSeleccionada, quitarDeActivas]);

  return (
    <FondoPag>
      <div className="dashboard-soporte">
        <SoporteHeader
          pendientesCount={sesionesPendientes.length}
          activasCount={sesionesActivas.length}
          isConnected={isConnected}
          onRefresh={refrescar}
          loading={loading}
        />

        {error && (
          <div className="error-banner">
            <p>❌ {error}</p>
            <button onClick={limpiarError}>Cerrar</button>
          </div>
        )}

        <div className="dashboard-content">
          <div className="sesiones-panel">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "pendientes" ? "active" : ""}`}
                onClick={() => setActiveTab("pendientes")}
              >
                <MdPending />
                <span>Pendientes</span>
                {sesionesPendientes.length > 0 && (
                  <span className="badge">{sesionesPendientes.length}</span>
                )}
              </button>
              <button
                className={`tab ${activeTab === "activas" ? "active" : ""}`}
                onClick={() => setActiveTab("activas")}
              >
                <MdChat />
                <span>Mis Chats</span>
                {sesionesActivas.length > 0 && (
                  <span className="badge">{sesionesActivas.length}</span>
                )}
              </button>
            </div>

            <div className="sesiones-content">
              {activeTab === "pendientes" ? (
                <SesionesPendientesList
                  sesiones={sesionesPendientes}
                  onTomarSesion={handleTomarSesion}
                  loading={loading}
                  loadingTomar={loadingTomar}
                />
              ) : (
                <SesionesActivasList
                  sesiones={sesionesActivas}
                  onAbrirChat={handleAbrirChat}
                  sesionSeleccionada={sesionSeleccionada}
                  loading={loading}
                />
              )}
            </div>
          </div>

          <div className="chat-panel">
            {sesionSeleccionada ? (
              <ChatWindow
                sesion={sesionSeleccionada}
                idSoporte={idSoporte}
                onCerrar={handleCerrarChat}
              />
            ) : (
              <div className="chat-placeholder">
                <MdChat className="placeholder-icon" />
                <h3>Selecciona un chat</h3>
                <p>Elige una sesión para comenzar a chatear</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </FondoPag>
  );
};
