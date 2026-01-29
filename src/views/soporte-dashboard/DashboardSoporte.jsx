import { useState, useCallback } from "react";
import { FondoPag } from "../../components/common";
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
  // Obtener ID del soporte desde el contexto (ajustar según tu implementación)
  const { user } = useAuth();
  // Nota: Como el rol SOPORTE no carga el user completo, 
  // necesitarás obtener el ID de otra manera o modificar el AuthContext
  const idSoporte = user?.id || localStorage.getItem("soporteId");

  // Estado del dashboard
  const [activeTab, setActiveTab] = useState("pendientes");
  const [sesionSeleccionada, setSesionSeleccionada] = useState(null);
  const [loadingTomar, setLoadingTomar] = useState(false);

  // Hook del dashboard de soporte
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
  } = useSoporteChat(idSoporte);

  // Hook para manejar el chat activo
  const {
    unirseASesion,
    loading: loadingChat,
  } = useChatRoom();

  // Tomar una sesión pendiente
  const handleTomarSesion = useCallback(
    async (sesion) => {
      if (!idSoporte) {
        console.error("No hay ID de soporte");
        return;
      }

      try {
        setLoadingTomar(true);

        // Unirse a la sesión
        await unirseASesion(sesion.id, idSoporte);

        // Actualizar listas
        quitarDePendientes(sesion.id);
        agregarAActivas({ ...sesion, estado: "ACTIVO" });

        // Seleccionar la sesión y abrir el chat
        setSesionSeleccionada(sesion);
        setActiveTab("activas");
      } catch (err) {
        console.error("Error al tomar sesión:", err);
      } finally {
        setLoadingTomar(false);
      }
    },
    [idSoporte, unirseASesion, quitarDePendientes, agregarAActivas]
  );

  // Abrir chat de una sesión activa
  const handleAbrirChat = useCallback((sesion) => {
    setSesionSeleccionada(sesion);
  }, []);

  // Cerrar ventana de chat
  const handleCerrarChat = useCallback(() => {
    if (sesionSeleccionada) {
      quitarDeActivas(sesionSeleccionada.id);
    }
    setSesionSeleccionada(null);
  }, [sesionSeleccionada, quitarDeActivas]);

  return (
    <FondoPag>
      <div className="dashboard-soporte">
        {/* Header */}
        <SoporteHeader
          pendientesCount={sesionesPendientes.length}
          activasCount={sesionesActivas.length}
          isConnected={isConnected}
          onRefresh={refrescar}
          loading={loading}
        />

        {/* Error global */}
        {error && (
          <div className="error-banner">
            <p>❌ {error}</p>
            <button onClick={limpiarError}>Cerrar</button>
          </div>
        )}

        {/* Contenido principal */}
        <div className="dashboard-content">
          {/* Panel de sesiones */}
          <div className="sesiones-panel">
            {/* Tabs */}
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

            {/* Lista de sesiones */}
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

          {/* Panel de chat */}
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
