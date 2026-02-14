import { useState, useCallback } from "react";
import { FondoPag } from "../../components/common";
import { getErrorMessage } from "../../helpers";
import { errorConstants } from "../../constants";
import {
  SoporteHeader,
  SoporteSidebar,
  SesionesPendientesList,
  SesionesActivasList,
  ChatWindow,
} from "../../components/soporte";
import { TransaccionesPanel } from "../../components/soporte/transacciones";
import { useSoporteChat } from "../../hooks/admin/soporte/useSoporteChat";
import { useChatRoom } from "../../hooks/chat/useChatRoom";
import { useTransacciones } from "../../hooks/soporte/useTransacciones";
import { useAuth } from "../../context/AuthUserContext";
import { MdPending, MdChat, MdMenu } from "react-icons/md";
import "../../assets/styles/dashboard.css";
import "./dashboardSoporte.css";

export const DashboardSoporte = () => {
  const { user } = useAuth();
  const idSoporte = user?.id || localStorage.getItem("soporteId");

  // — Navegación del dashboard —
  const [activeSection, setActiveSection] = useState("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // — Estado del chat —
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

  const { unirseASesion } = useChatRoom();

  // — Estado de transacciones —
  const {
    transacciones,
    stats: txStats,
    filtros,
    loading: txLoading,
    error: txError,
    selectedTransaccion,
    handleBuscar,
    updateFiltro,
    resetFiltros,
    setSelectedTransaccion,
    clearSelectedTransaccion,
    clearError: clearTxError,
  } = useTransacciones();

  // — Handlers de chat (sin cambios en lógica) —
  const handleTomarSesion = useCallback(
    async (sesion) => {
      if (!idSoporte || loadingTomar) return;

      try {
        setLoadingTomar(true);
        await unirseASesion(sesion.id, idSoporte);
        quitarDePendientes(sesion.id);
        agregarAActivas({ ...sesion, estado: "ACTIVO" });
        setSesionSeleccionada(sesion);
        setActiveTab("activas");
      } catch (err) {
        console.error("Error al tomar sesión:", err);
        const messageError = getErrorMessage(err, errorConstants);
        const esSesionTomada =
          messageError === errorConstants.CHAT_TOMADO_POR_SOPORTE;
        mostrarError(messageError);
        if (esSesionTomada) {
          quitarDePendientes(sesion.id);
          setTimeout(() => refrescar(), 2000);
        }
      } finally {
        setLoadingTomar(false);
      }
    },
    [
      idSoporte,
      loadingTomar,
      unirseASesion,
      quitarDePendientes,
      agregarAActivas,
      refrescar,
      mostrarError,
    ]
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

  // — Render de secciones —
  const renderChatSection = () => (
    <>
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

      <div className="soporte-chat-layout">
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
    </>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "chat":
        return renderChatSection();
      case "recargas":
        return (
          <TransaccionesPanel
            tipo="RECARGA"
            transacciones={transacciones}
            stats={txStats}
            filtros={filtros}
            loading={txLoading}
            error={txError}
            selectedTransaccion={selectedTransaccion}
            onUpdateFiltro={updateFiltro}
            onBuscar={handleBuscar}
            onResetFiltros={resetFiltros}
            onVerDetalle={setSelectedTransaccion}
            onCloseDetalle={clearSelectedTransaccion}
            onClearError={clearTxError}
          />
        );
      case "pagos-metro":
        return (
          <TransaccionesPanel
            tipo="PASAJE"
            transacciones={transacciones}
            stats={txStats}
            filtros={filtros}
            loading={txLoading}
            error={txError}
            selectedTransaccion={selectedTransaccion}
            onUpdateFiltro={updateFiltro}
            onBuscar={handleBuscar}
            onResetFiltros={resetFiltros}
            onVerDetalle={setSelectedTransaccion}
            onCloseDetalle={clearSelectedTransaccion}
            onClearError={clearTxError}
          />
        );
      default:
        return renderChatSection();
    }
  };

  return (
    <FondoPag>
      <div className="dashboard-container">
        <SoporteSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="dashboard-main">
          <div className="soporte-topbar">
            <button
              className="menu-toggle"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MdMenu />
            </button>
          </div>
          <div className="dashboard-content">{renderContent()}</div>
        </main>
      </div>
    </FondoPag>
  );
};
