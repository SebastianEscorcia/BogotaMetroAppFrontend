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
  FaqCategoryTable,
  FaqCategoryModal,
  SupportFaqTable,
  SupportFaqModal,
} from "../../components/soporte";
import { ConfirmDialog } from "../../components/common";
import { AlertMessage } from "../../components/admin/AlertMessage";
import { TransaccionesPanel } from "../../components/soporte/transacciones";
import { useSoporteChat } from "../../hooks/admin/soporte/useSoporteChat";
import { useChatRoom } from "../../hooks/chat/useChatRoom";
import { useTransacciones } from "../../hooks/soporte/useTransacciones";
import { useFaqCategoryManagement } from "../../hooks/soporte/useFaqCategoryManagement";
import { useSupportFaqManagement } from "../../hooks/soporte/useSupportFaqManagement";
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

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    success: categoriesSuccess,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    clearMessages: clearCategoriesMessages,
  } = useFaqCategoryManagement();

  const {
    faqs,
    loading: faqsLoading,
    error: faqsError,
    success: faqsSuccess,
    handleCreateFaq,
    handleUpdateFaq,
    handleDeleteFaq,
    clearMessages: clearFaqsMessages,
  } = useSupportFaqManagement();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryConfirmOpen, setIsCategoryConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryDeleteLoading, setCategoryDeleteLoading] = useState(false);

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqModalMode, setFaqModalMode] = useState("create");
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isFaqConfirmOpen, setIsFaqConfirmOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [faqDeleteLoading, setFaqDeleteLoading] = useState(false);

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

  const handleOpenCreateCategoryModal = () => {
    setCategoryModalMode("create");
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (category) => {
    setCategoryModalMode("edit");
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmitCategory = async (idOrName, categoryData) => {
    if (categoryModalMode === "create") {
      await handleCreateCategory(idOrName);
    } else {
      await handleUpdateCategory(idOrName, categoryData);
    }
    handleCloseCategoryModal();
  };

  const handleOpenDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setIsCategoryConfirmOpen(true);
  };

  const handleCloseDeleteCategory = () => {
    setIsCategoryConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setCategoryDeleteLoading(true);
    try {
      await handleDeleteCategory(categoryToDelete.id);
      handleCloseDeleteCategory();
    } catch (err) {
      console.error("Error eliminando categoría FAQ:", err);
    } finally {
      setCategoryDeleteLoading(false);
    }
  };

  const handleOpenCreateFaqModal = () => {
    setFaqModalMode("create");
    setSelectedFaq(null);
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaqModal = (faq) => {
    setFaqModalMode("edit");
    setSelectedFaq(faq);
    setIsFaqModalOpen(true);
  };

  const handleCloseFaqModal = () => {
    setIsFaqModalOpen(false);
    setSelectedFaq(null);
  };

  const handleSubmitFaq = async (idOrData, faqData) => {
    if (faqModalMode === "create") {
      await handleCreateFaq(idOrData);
    } else {
      await handleUpdateFaq(idOrData, faqData);
    }
    handleCloseFaqModal();
  };

  const handleOpenDeleteFaq = (faq) => {
    setFaqToDelete(faq);
    setIsFaqConfirmOpen(true);
  };

  const handleCloseDeleteFaq = () => {
    setIsFaqConfirmOpen(false);
    setFaqToDelete(null);
  };

  const handleConfirmDeleteFaq = async () => {
    if (!faqToDelete) return;
    setFaqDeleteLoading(true);
    try {
      await handleDeleteFaq(faqToDelete.id);
      handleCloseDeleteFaq();
    } catch (err) {
      console.error("Error eliminando pregunta frecuente:", err);
    } finally {
      setFaqDeleteLoading(false);
    }
  };

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
      case "faq-categorias":
        return (
          <>
            <div className="content-header">
              <h1 className="content-title">Categorías FAQ</h1>
              <p className="content-subtitle">
                Gestiona las categorías de preguntas frecuentes para pasajeros
              </p>
            </div>

            <FaqCategoryTable
              categories={categories}
              loading={categoriesLoading}
              onCreateNew={handleOpenCreateCategoryModal}
              onEdit={handleOpenEditCategoryModal}
              onDelete={handleOpenDeleteCategory}
            />
          </>
        );
      case "faq-preguntas":
        return (
          <>
            <div className="content-header">
              <h1 className="content-title">Preguntas Frecuentes</h1>
              <p className="content-subtitle">
                Administra preguntas y respuestas visibles en el módulo de soporte
              </p>
            </div>

            <SupportFaqTable
              faqs={faqs}
              categories={categories}
              loading={faqsLoading}
              onCreateNew={handleOpenCreateFaqModal}
              onEdit={handleOpenEditFaqModal}
              onDelete={handleOpenDeleteFaq}
            />
          </>
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

        <AlertMessage
          type="success"
          message={categoriesSuccess}
          onClose={clearCategoriesMessages}
        />
        <AlertMessage
          type="error"
          message={categoriesError}
          onClose={clearCategoriesMessages}
        />

        <AlertMessage
          type="success"
          message={faqsSuccess}
          onClose={clearFaqsMessages}
        />
        <AlertMessage
          type="error"
          message={faqsError}
          onClose={clearFaqsMessages}
        />

        <FaqCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={handleCloseCategoryModal}
          onSubmit={handleSubmitCategory}
          category={selectedCategory}
          mode={categoryModalMode}
        />

        <ConfirmDialog
          isOpen={isCategoryConfirmOpen}
          onClose={handleCloseDeleteCategory}
          onConfirm={handleConfirmDeleteCategory}
          title="¿Eliminar esta categoría?"
          message={`Estás a punto de eliminar la categoría "${categoryToDelete?.name || ""}".`}
          loading={categoryDeleteLoading}
        />

        <SupportFaqModal
          isOpen={isFaqModalOpen}
          onClose={handleCloseFaqModal}
          onSubmit={handleSubmitFaq}
          faq={selectedFaq}
          mode={faqModalMode}
          categories={categories}
        />

        <ConfirmDialog
          isOpen={isFaqConfirmOpen}
          onClose={handleCloseDeleteFaq}
          onConfirm={handleConfirmDeleteFaq}
          title="¿Eliminar esta pregunta frecuente?"
          message={`Se eliminará la pregunta "${faqToDelete?.question || ""}".`}
          loading={faqDeleteLoading}
        />
      </div>
    </FondoPag>
  );
};
