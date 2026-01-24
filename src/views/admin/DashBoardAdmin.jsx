
import { useState } from "react";
import { FondoPag } from "../../components/common/FondoPage";
import {
  DashboardSidebar,
  DashboardHeader,
  StatsCards,
  RolesTable,
  RoleModal,
  ConfirmDialog,
  AlertMessage,
} from "../../components/admin";
import { useRoles } from "../../hooks/admin/useRoles";
import { 
  MdPeople, 
  MdBuild, 
  MdHeadsetMic, 
  MdBarChart, 
  MdSettings 
} from "react-icons/md";
import "../../assets/styles/dashboard.css";

export const DashBoardAdmin = () => {
  const {
    roles,
    loading,
    error,
    success,
    stats,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    clearMessages,
  } = useRoles();

  // Estado del sidebar
  const [activeSection, setActiveSection] = useState("roles");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedRole, setSelectedRole] = useState(null);

  // Estado para diálogo de confirmación
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handlers para modales
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (role) => {
    setModalMode("edit");
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  // Handler para crear/editar
  const handleSubmitRole = async (idOrNombre, roleData) => {
    if (modalMode === "create") {
      await handleCreateRole(idOrNombre);
    } else {
      await handleUpdateRole(idOrNombre, roleData);
    }
  };

  // Handlers para eliminar
  const handleOpenDeleteConfirm = (role) => {
    setRoleToDelete(role);
    setIsConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsConfirmOpen(false);
    setRoleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    setDeleteLoading(true);
    try {
      await handleDeleteRole(roleToDelete.id);
      handleCloseDeleteConfirm();
    } catch (err) {
      console.error("Error deleting role:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <div className="content-header">
              <h1 className="content-title">Dashboard Principal</h1>
              <p className="content-subtitle">
                Bienvenido al panel de administración de Bogotá Metro
              </p>
            </div>
            <StatsCards stats={stats} />
            <RolesTable
              roles={roles}
              loading={loading}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteConfirm}
              onCreateNew={handleOpenCreateModal}
            />
          </>
        );

      case "roles":
        return (
          <>
            <div className="content-header">
              <h1 className="content-title">Gestión de Roles</h1>
              <p className="content-subtitle">
                Administra los roles y permisos del sistema
              </p>
            </div>
            <StatsCards stats={stats} />
            <RolesTable
              roles={roles}
              loading={loading}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteConfirm}
              onCreateNew={handleOpenCreateModal}
            />
          </>
        );

      case "passengers":
        return (
          <div className="content-header">
            <h1 className="content-title">Gestión de Pasajeros</h1>
            <p className="content-subtitle">
              Esta sección estará disponible próximamente
            </p>
            <div className="empty-state" style={{ marginTop: "2rem" }}>
              <div className="empty-icon"><MdPeople /></div>
              <h3 className="empty-title">Próximamente</h3>
              <p className="empty-description">
                La gestión de pasajeros estará disponible en futuras actualizaciones.
              </p>
            </div>
          </div>
        );

      case "operators":
        return (
          <div className="content-header">
            <h1 className="content-title">Gestión de Operadores</h1>
            <p className="content-subtitle">
              Esta sección estará disponible próximamente
            </p>
            <div className="empty-state" style={{ marginTop: "2rem" }}>
              <div className="empty-icon"><MdBuild /></div>
              <h3 className="empty-title">Próximamente</h3>
              <p className="empty-description">
                La gestión de operadores estará disponible en futuras actualizaciones.
              </p>
            </div>
          </div>
        );

      case "support":
        return (
          <div className="content-header">
            <h1 className="content-title">Equipo de Soporte</h1>
            <p className="content-subtitle">
              Esta sección estará disponible próximamente
            </p>
            <div className="empty-state" style={{ marginTop: "2rem" }}>
              <div className="empty-icon"><MdHeadsetMic /></div>
              <h3 className="empty-title">Próximamente</h3>
              <p className="empty-description">
                La gestión del equipo de soporte estará disponible en futuras actualizaciones.
              </p>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="content-header">
            <h1 className="content-title">Reportes y Estadísticas</h1>
            <p className="content-subtitle">
              Esta sección estará disponible próximamente
            </p>
            <div className="empty-state" style={{ marginTop: "2rem" }}>
              <div className="empty-icon"><MdBarChart /></div>
              <h3 className="empty-title">Próximamente</h3>
              <p className="empty-description">
                Los reportes y estadísticas estarán disponibles en futuras actualizaciones.
              </p>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="content-header">
            <h1 className="content-title">Configuración del Sistema</h1>
            <p className="content-subtitle">
              Esta sección estará disponible próximamente
            </p>
            <div className="empty-state" style={{ marginTop: "2rem" }}>
              <div className="empty-icon"><MdSettings /></div>
              <h3 className="empty-title">Próximamente</h3>
              <p className="empty-description">
                La configuración del sistema estará disponible en futuras actualizaciones.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Breadcrumb dinámico
  const getBreadcrumb = () => {
    const breadcrumbs = {
      dashboard: ["Dashboard"],
      roles: ["Gestión", "Roles"],
      passengers: ["Usuarios", "Pasajeros"],
      operators: ["Usuarios", "Operadores"],
      support: ["Usuarios", "Soporte"],
      reports: ["Sistema", "Reportes"],
      settings: ["Sistema", "Configuración"],
    };
    return breadcrumbs[activeSection] || ["Dashboard"];
  };

  return (
    <FondoPag>
      <div className="dashboard-container">
        <DashboardSidebar
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
            {/* Mensajes de alerta */}
            <AlertMessage
              type="success"
              message={success}
              onClose={clearMessages}
            />
            <AlertMessage
              type="error"
              message={error}
              onClose={clearMessages}
            />

            {renderContent()}
          </div>
        </main>

        {/* Modal para crear/editar roles */}
        <RoleModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitRole}
          role={selectedRole}
          mode={modalMode}
        />

        {/* Diálogo de confirmación para eliminar */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={handleCloseDeleteConfirm}
          onConfirm={handleConfirmDelete}
          title="¿Eliminar este rol?"
          message={`Estás a punto de eliminar el rol "${roleToDelete?.nombre}". Esta acción no se puede deshacer.`}
          loading={deleteLoading}
        />
      </div>
    </FondoPag>
  );
};
