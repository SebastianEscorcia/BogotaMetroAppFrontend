import { useState } from "react";
import { FondoPag, ConfirmDialog } from "../../components/common";
import { DashboardHeader, AlertMessage } from "../../components/admin";
import {
  OperadorSidebar,
  LineasTable,
  LineaModal,
  EstacionesTable,
  EstacionModal,
  EstacionesLineasTable,
  EstacionLineaModal,
  InterrupcionesTable,
  InterrupcionModal,
} from "../../components/operador";
import {
  useLineas,
  useEstaciones,
  useEstacionesLineas,
  useInterrupciones,
} from "../../hooks/operador";
import "../../assets/styles/dashboard.css";

export const DashboardOperador = () => {
  const [activeSection, setActiveSection] = useState("lineas");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    lineas,
    loading: lineasLoading,
    error: lineasError,
    success: lineasSuccess,
    handleCreateLinea,
    handleUpdateLinea,
    handleDeleteLinea,
    clearMessages: clearLineasMessages,
  } = useLineas();

  const {
    estaciones,
    loading: estacionesLoading,
    error: estacionesError,
    success: estacionesSuccess,
    handleCreateEstacion,
    handleUpdateEstacion,
    handleDeleteEstacion,
    clearMessages: clearEstacionesMessages,
  } = useEstaciones();

  const {
    relations,
    loading: relationsLoading,
    error: relationsError,
    success: relationsSuccess,
    handleCreateRelation,
    handleDeleteRelation,
    clearMessages: clearRelationsMessages,
  } = useEstacionesLineas();

  const {
    interrupciones,
    loading: interrupcionesLoading,
    error: interrupcionesError,
    success: interrupcionesSuccess,
    isWebSocketConnected,
    handleCreateInterrupcion,
    handleUpdateInterrupcion,
    handleDeleteInterrupcion,
    handleSolveInterrupcion,
    clearMessages: clearInterrupcionesMessages,
  } = useInterrupciones();

  const [isLineaModalOpen, setIsLineaModalOpen] = useState(false);
  const [lineaModalMode, setLineaModalMode] = useState("create");
  const [selectedLinea, setSelectedLinea] = useState(null);
  const [isLineaConfirmOpen, setIsLineaConfirmOpen] = useState(false);
  const [lineaToDelete, setLineaToDelete] = useState(null);
  const [lineaDeleteLoading, setLineaDeleteLoading] = useState(false);

  const [isEstacionModalOpen, setIsEstacionModalOpen] = useState(false);
  const [estacionModalMode, setEstacionModalMode] = useState("create");
  const [selectedEstacion, setSelectedEstacion] = useState(null);
  const [isEstacionConfirmOpen, setIsEstacionConfirmOpen] = useState(false);
  const [estacionToDelete, setEstacionToDelete] = useState(null);
  const [estacionDeleteLoading, setEstacionDeleteLoading] = useState(false);

  const [isRelationModalOpen, setIsRelationModalOpen] = useState(false);
  const [isRelationConfirmOpen, setIsRelationConfirmOpen] = useState(false);
  const [relationToDelete, setRelationToDelete] = useState(null);
  const [relationDeleteLoading, setRelationDeleteLoading] = useState(false);

  const [isInterrupcionModalOpen, setIsInterrupcionModalOpen] = useState(false);
  const [interrupcionModalMode, setInterrupcionModalMode] = useState("create");
  const [selectedInterrupcion, setSelectedInterrupcion] = useState(null);
  const [isInterrupcionConfirmOpen, setIsInterrupcionConfirmOpen] = useState(false);
  const [interrupcionToDelete, setInterrupcionToDelete] = useState(null);
  const [interrupcionDeleteLoading, setInterrupcionDeleteLoading] = useState(false);
  const [isInterrupcionSolveConfirmOpen, setIsInterrupcionSolveConfirmOpen] = useState(false);
  const [interrupcionToSolve, setInterrupcionToSolve] = useState(null);
  const [interrupcionSolveLoading, setInterrupcionSolveLoading] = useState(false);

  const getBreadcrumb = () => {
    const breadcrumbs = {
      lineas: ["Operación", "Líneas"],
      estaciones: ["Operación", "Estaciones"],
      "estaciones-lineas": ["Operación", "Asignaciones"],
      interrupciones: ["Operación", "Interrupciones"],
    };

    return breadcrumbs[activeSection] || ["Operación"];
  };

  const handleOpenCreateLineaModal = () => {
    setLineaModalMode("create");
    setSelectedLinea(null);
    setIsLineaModalOpen(true);
  };

  const handleOpenEditLineaModal = (linea) => {
    setLineaModalMode("edit");
    setSelectedLinea(linea);
    setIsLineaModalOpen(true);
  };

  const handleSubmitLinea = async (idOrData, lineaData) => {
    if (lineaModalMode === "create") {
      await handleCreateLinea(idOrData);
    } else {
      await handleUpdateLinea(idOrData, lineaData);
    }
    setIsLineaModalOpen(false);
    setSelectedLinea(null);
  };

  const handleOpenDeleteLinea = (linea) => {
    setLineaToDelete(linea);
    setIsLineaConfirmOpen(true);
  };

  const handleConfirmDeleteLinea = async () => {
    if (!lineaToDelete) return;
    setLineaDeleteLoading(true);
    try {
      await handleDeleteLinea(lineaToDelete.id);
      setIsLineaConfirmOpen(false);
      setLineaToDelete(null);
    } finally {
      setLineaDeleteLoading(false);
    }
  };

  const handleOpenCreateEstacionModal = () => {
    setEstacionModalMode("create");
    setSelectedEstacion(null);
    setIsEstacionModalOpen(true);
  };

  const handleOpenEditEstacionModal = (estacion) => {
    setEstacionModalMode("edit");
    setSelectedEstacion(estacion);
    setIsEstacionModalOpen(true);
  };

  const handleSubmitEstacion = async (idOrData, estacionData) => {
    if (estacionModalMode === "create") {
      await handleCreateEstacion(idOrData);
    } else {
      await handleUpdateEstacion(idOrData, estacionData);
    }
    setIsEstacionModalOpen(false);
    setSelectedEstacion(null);
  };

  const handleOpenDeleteEstacion = (estacion) => {
    setEstacionToDelete(estacion);
    setIsEstacionConfirmOpen(true);
  };

  const handleConfirmDeleteEstacion = async () => {
    if (!estacionToDelete) return;
    setEstacionDeleteLoading(true);
    try {
      await handleDeleteEstacion(estacionToDelete.id);
      setIsEstacionConfirmOpen(false);
      setEstacionToDelete(null);
    } finally {
      setEstacionDeleteLoading(false);
    }
  };

  const handleSubmitRelation = async (relationData) => {
    await handleCreateRelation(relationData);
    setIsRelationModalOpen(false);
  };

  const handleOpenDeleteRelation = (relation) => {
    setRelationToDelete(relation);
    setIsRelationConfirmOpen(true);
  };

  const handleConfirmDeleteRelation = async () => {
    if (!relationToDelete) return;
    setRelationDeleteLoading(true);
    try {
      await handleDeleteRelation(relationToDelete.idLinea, relationToDelete.idEstacion);
      setIsRelationConfirmOpen(false);
      setRelationToDelete(null);
    } finally {
      setRelationDeleteLoading(false);
    }
  };

  const handleOpenCreateInterrupcionModal = () => {
    setInterrupcionModalMode("create");
    setSelectedInterrupcion(null);
    setIsInterrupcionModalOpen(true);
  };

  const handleOpenEditInterrupcionModal = (interrupcion) => {
    setInterrupcionModalMode("edit");
    setSelectedInterrupcion(interrupcion);
    setIsInterrupcionModalOpen(true);
  };

  const handleSubmitInterrupcion = async (idOrData, payloadData) => {
    if (interrupcionModalMode === "create") {
      await handleCreateInterrupcion(idOrData);
    } else {
      await handleUpdateInterrupcion(idOrData, payloadData);
    }

    setIsInterrupcionModalOpen(false);
    setSelectedInterrupcion(null);
  };

  const handleOpenDeleteInterrupcion = (interrupcion) => {
    setInterrupcionToDelete(interrupcion);
    setIsInterrupcionConfirmOpen(true);
  };

  const handleConfirmDeleteInterrupcion = async () => {
    if (!interrupcionToDelete) return;
    setInterrupcionDeleteLoading(true);
    try {
      await handleDeleteInterrupcion(interrupcionToDelete.id);
      setIsInterrupcionConfirmOpen(false);
      setInterrupcionToDelete(null);
    } finally {
      setInterrupcionDeleteLoading(false);
    }
  };

  const handleOpenSolveInterrupcion = (interrupcion) => {
    setInterrupcionToSolve(interrupcion);
    setIsInterrupcionSolveConfirmOpen(true);
  };

  const handleConfirmSolveInterrupcion = async () => {
    if (!interrupcionToSolve) return;
    setInterrupcionSolveLoading(true);
    try {
      await handleSolveInterrupcion(interrupcionToSolve.id);
      setIsInterrupcionSolveConfirmOpen(false);
      setInterrupcionToSolve(null);
    } finally {
      setInterrupcionSolveLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "lineas":
        return (
          <>
            <div className="content-header">
              <h1 className="content-title">Líneas del Sistema</h1>
              <p className="content-subtitle">Gestiona las líneas activas del metro</p>
            </div>
            <LineasTable
              lineas={lineas}
              loading={lineasLoading}
              onCreateNew={handleOpenCreateLineaModal}
              onEdit={handleOpenEditLineaModal}
              onDelete={handleOpenDeleteLinea}
            />
          </>
        );

      case "estaciones":
        return (
          <>
            <div className="content-header">
              <h1 className="content-title">Estaciones del Sistema</h1>
              <p className="content-subtitle">Gestiona nombre, ubicación y tipo de estaciones</p>
            </div>
            <EstacionesTable
              estaciones={estaciones}
              loading={estacionesLoading}
              onCreateNew={handleOpenCreateEstacionModal}
              onEdit={handleOpenEditEstacionModal}
              onDelete={handleOpenDeleteEstacion}
            />
          </>
        );

      case "estaciones-lineas":
        return (
          <>
            <div className="content-header">
              <h1 className="content-title">Asignación Estación - Línea</h1>
              <p className="content-subtitle">Configura el orden de estaciones por cada línea</p>
            </div>
            <EstacionesLineasTable
              relations={relations}
              loading={relationsLoading}
              onCreateNew={() => setIsRelationModalOpen(true)}
              onDelete={handleOpenDeleteRelation}
            />
          </>
        );

      case "interrupciones":
        return (
          <>
            <div className="content-header">
              <h1 className="content-title">Interrupciones del Sistema</h1>
              <p className="content-subtitle">
                Gestiona bloqueos y notifica  
              </p>
            </div>
            <InterrupcionesTable
              interrupciones={interrupciones}
              loading={interrupcionesLoading}
              onCreateNew={handleOpenCreateInterrupcionModal}
              onEdit={handleOpenEditInterrupcionModal}
              onDelete={handleOpenDeleteInterrupcion}
              onSolve={handleOpenSolveInterrupcion}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <FondoPag>
      <div className="dashboard-container">
        <OperadorSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="dashboard-main">
          <DashboardHeader
            title={activeSection}
            breadcrumb={getBreadcrumb()}
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <div className="dashboard-content">
            <AlertMessage type="success" message={lineasSuccess} onClose={clearLineasMessages} />
            <AlertMessage type="error" message={lineasError} onClose={clearLineasMessages} />

            <AlertMessage
              type="success"
              message={estacionesSuccess}
              onClose={clearEstacionesMessages}
            />
            <AlertMessage
              type="error"
              message={estacionesError}
              onClose={clearEstacionesMessages}
            />

            <AlertMessage
              type="success"
              message={relationsSuccess}
              onClose={clearRelationsMessages}
            />
            <AlertMessage
              type="error"
              message={relationsError}
              onClose={clearRelationsMessages}
            />

            <AlertMessage
              type="success"
              message={interrupcionesSuccess}
              onClose={clearInterrupcionesMessages}
            />
            <AlertMessage
              type="error"
              message={interrupcionesError}
              onClose={clearInterrupcionesMessages}
            />

            {renderContent()}
          </div>
        </main>

        <LineaModal
          isOpen={isLineaModalOpen}
          onClose={() => {
            setIsLineaModalOpen(false);
            setSelectedLinea(null);
          }}
          onSubmit={handleSubmitLinea}
          linea={selectedLinea}
          mode={lineaModalMode}
        />

        <ConfirmDialog
          isOpen={isLineaConfirmOpen}
          onClose={() => {
            setIsLineaConfirmOpen(false);
            setLineaToDelete(null);
          }}
          onConfirm={handleConfirmDeleteLinea}
          title="¿Eliminar esta línea?"
          message={`Estás a punto de eliminar la línea "${lineaToDelete?.nombre || ""}".`}
          loading={lineaDeleteLoading}
        />

        <EstacionModal
          isOpen={isEstacionModalOpen}
          onClose={() => {
            setIsEstacionModalOpen(false);
            setSelectedEstacion(null);
          }}
          onSubmit={handleSubmitEstacion}
          estacion={selectedEstacion}
          mode={estacionModalMode}
        />

        <ConfirmDialog
          isOpen={isEstacionConfirmOpen}
          onClose={() => {
            setIsEstacionConfirmOpen(false);
            setEstacionToDelete(null);
          }}
          onConfirm={handleConfirmDeleteEstacion}
          title="¿Eliminar esta estación?"
          message={`Estás a punto de eliminar la estación "${estacionToDelete?.nombre || ""}".`}
          loading={estacionDeleteLoading}
        />

        <EstacionLineaModal
          isOpen={isRelationModalOpen}
          onClose={() => setIsRelationModalOpen(false)}
          onSubmit={handleSubmitRelation}
          lineas={lineas}
          estaciones={estaciones}
        />

        <ConfirmDialog
          isOpen={isRelationConfirmOpen}
          onClose={() => {
            setIsRelationConfirmOpen(false);
            setRelationToDelete(null);
          }}
          onConfirm={handleConfirmDeleteRelation}
          title="¿Eliminar esta asignación?"
          message={`Se eliminará la asignación línea #${relationToDelete?.idLinea || ""} con estación #${relationToDelete?.idEstacion || ""}.`}
          loading={relationDeleteLoading}
        />

        <InterrupcionModal
          isOpen={isInterrupcionModalOpen}
          onClose={() => {
            setIsInterrupcionModalOpen(false);
            setSelectedInterrupcion(null);
          }}
          onSubmit={handleSubmitInterrupcion}
          interrupcion={selectedInterrupcion}
          mode={interrupcionModalMode}
          lineas={lineas}
          estaciones={estaciones}
          estacionesLineas={relations}
        />

        <ConfirmDialog
          isOpen={isInterrupcionConfirmOpen}
          onClose={() => {
            setIsInterrupcionConfirmOpen(false);
            setInterrupcionToDelete(null);
          }}
          onConfirm={handleConfirmDeleteInterrupcion}
          title="¿Eliminar esta interrupción?"
          message={`Se eliminará la interrupción "${interrupcionToDelete?.descripcion || ""}".`}
          loading={interrupcionDeleteLoading}
        />

        <ConfirmDialog
          isOpen={isInterrupcionSolveConfirmOpen}
          onClose={() => {
            setIsInterrupcionSolveConfirmOpen(false);
            setInterrupcionToSolve(null);
          }}
          onConfirm={handleConfirmSolveInterrupcion}
          title="¿Marcar interrupción como solucionada?"
          message={`Se marcará como solucionada la interrupción "${interrupcionToSolve?.descripcion || ""}".`}
          loading={interrupcionSolveLoading}
          confirmText="Solucionar"
          loadingText="Solucionando..."
        />
      </div>
    </FondoPag>
  );
};

export default DashboardOperador;