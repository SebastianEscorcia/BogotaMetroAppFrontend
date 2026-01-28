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
  UserTable,
  UserModal,
} from "../../components/admin";
import { useRoles, useOperadores, useSoporte } from "../../hooks/admin";

import { MdPeople, MdBarChart, MdSettings } from "react-icons/md";
import "../../assets/styles/dashboard.css";

export const DashBoardAdmin = () => {
  // ==================== HOOKS ====================
  const {
    roles,
    loading,
    error,
    success,
    stats,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    clearMessages: clearRolesMessages,
  } = useRoles();

  const {
    operadores,
    loading: operadoresLoading,
    error: operadoresError,
    success: operadoresSuccess,
    stats: operadoresStats,
    searchTerm: operadoresSearchTerm,
    handleCreateOperador,
    handleUpdateOperador,
    handleDeleteOperador,
    handleReactivarOperador,
    handleSearch: handleOperadoresSearch,
    clearMessages: clearOperadoresMessages,
  } = useOperadores();

  const {
    soportes,
    loading: soporteLoading,
    error: soporteError,
    success: soporteSuccess,
    stats: soporteStats,
    searchTerm: soporteSearchTerm,
    handleCreateSoporte,
    handleUpdateSoporte,
    handleDeleteSoporte,
    handleReactivarSoporte,
    handleSearch: handleSoporteSearch,
    clearMessages: clearSoporteMessages,
  } = useSoporte();

  // ==================== ESTADO DEL SIDEBAR ====================
  const [activeSection, setActiveSection] = useState("roles");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ==================== ESTADOS PARA ROLES ====================
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleModalMode, setRoleModalMode] = useState("create");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRoleConfirmOpen, setIsRoleConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [roleDeleteLoading, setRoleDeleteLoading] = useState(false);

  // ==================== ESTADOS PARA USUARIOS (Operadores/Soporte) ====================
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserType, setCurrentUserType] = useState("Operador");

  // Estado para diálogo de confirmación de usuarios
  const [isUserConfirmOpen, setIsUserConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userDeleteLoading, setUserDeleteLoading] = useState(false);

  // Mapas de acciones
  const userActions = {
    Operador: {
      create: handleCreateOperador,
      update: handleUpdateOperador,
      delete: handleDeleteOperador,
      reactivate: handleReactivarOperador,
    },
    Soporte: {
      create: handleCreateSoporte,
      update: handleUpdateSoporte,
      delete: handleDeleteSoporte,
      reactivate: handleReactivarSoporte,
    },
  };

  // ==================== HANDLERS DE ROLES ====================
  const handleOpenCreateRoleModal = () => {
    setRoleModalMode("create");
    setSelectedRole(null);
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRoleModal = (role) => {
    setRoleModalMode("edit");
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRole(null);
  };

  const handleSubmitRole = async (idOrNombre, roleData) => {
    if (roleModalMode === "create") {
      await handleCreateRole(idOrNombre);
    } else {
      await handleUpdateRole(idOrNombre, roleData);
    }
    handleCloseRoleModal();
  };

  const handleOpenRoleDeleteConfirm = (role) => {
    setRoleToDelete(role);
    setIsRoleConfirmOpen(true);
  };

  const handleCloseRoleDeleteConfirm = () => {
    setIsRoleConfirmOpen(false);
    setRoleToDelete(null);
  };

  const handleConfirmRoleDelete = async () => {
    if (!roleToDelete) return;
    setRoleDeleteLoading(true);
    try {
      await handleDeleteRole(roleToDelete.id);
      handleCloseRoleDeleteConfirm();
    } catch (err) {
      console.error("Error deleting role:", err);
    } finally {
      setRoleDeleteLoading(false);
    }
  };

  // ==================== HANDLERS DE USUARIOS (Reutilizables) ====================
  const handleOpenCreateUserModal = (userType) => {
    setCurrentUserType(userType);
    setUserModalMode("create");
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUserModal = (user, userType) => {
    setCurrentUserType(userType);
    setUserModalMode("edit");
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };
  const validateUserTypeAndMondalMode = () => {
    if (!currentUserType || !userModalMode) return;
  };
  const handleSubmitUser = async (idOrData, userData) => {
    try {
      validateUserTypeAndMondalMode();
      const action = userActions[currentUserType]?.[userModalMode];
      if (!action) return;
      await action(idOrData, userData);
      handleCloseUserModal();
    } catch (err) {
      console.error("Error submitting user:", err);
    }
  };

  const handleOpenUserDeleteConfirm = (user, userType) => {
    setCurrentUserType(userType);
    setUserToDelete(user);
    setIsUserConfirmOpen(true);
  };

  const handleCloseUserDeleteConfirm = () => {
    setIsUserConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmUserDelete = async () => {
    if (!userToDelete) return;
    setUserDeleteLoading(true);
    try {
      const userAction = userActions[currentUserType];
      if (!userAction) {
        throw new Error("Tipo de usuario no soportado");
      }
      await userAction.delete(userToDelete.id);

      handleCloseUserDeleteConfirm();
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setUserDeleteLoading(false);
    }
  };

  const handleReactivarUser = async (user, userType) => {
    const reactivateUser = userActions[userType];
    if (!reactivateAction) {
      console.warn("Tipo de usuario no válido");
      return;
    }
    await reactivateUser.reactivate(user.id);
  };

  // ==================== RENDERIZAR CONTENIDO ====================
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
              onEdit={handleOpenEditRoleModal}
              onDelete={handleOpenRoleDeleteConfirm}
              onCreateNew={handleOpenCreateRoleModal}
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
              onEdit={handleOpenEditRoleModal}
              onDelete={handleOpenRoleDeleteConfirm}
              onCreateNew={handleOpenCreateRoleModal}
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
              <div className="empty-icon">
                <MdPeople />
              </div>
              <h3 className="empty-title">Próximamente</h3>
              <p className="empty-description">
                La gestión de pasajeros estará disponible en futuras
                actualizaciones.
              </p>
            </div>
          </div>
        );

      case "operators":
        return (
          <>
            <div className="content-header">
              <h1 className="content-title">Gestión de Operadores</h1>
              <p className="content-subtitle">
                Administra los operadores del sistema de transporte
              </p>
            </div>
            <StatsCards stats={operadoresStats} />
            <UserTable
              users={operadores}
              loading={operadoresLoading}
              searchTerm={operadoresSearchTerm}
              onSearch={handleOperadoresSearch}
              onEdit={(user) => handleOpenEditUserModal(user, "Operador")}
              onDelete={(user) => handleOpenUserDeleteConfirm(user, "Operador")}
              onReactivar={(user) => handleReactivarUser(user, "Operador")}
              onCreateNew={() => handleOpenCreateUserModal("Operador")}
              userType="Operador"
            />
          </>
        );

      case "support":
        return (
          <>
            <div className="content-header">
              <h1 className="content-title">Equipo de Soporte</h1>
              <p className="content-subtitle">
                Administra el personal de soporte del sistema
              </p>
            </div>
            <StatsCards stats={soporteStats} />
            <UserTable
              users={soportes}
              loading={soporteLoading}
              searchTerm={soporteSearchTerm}
              onSearch={handleSoporteSearch}
              onEdit={(user) => handleOpenEditUserModal(user, "Soporte")}
              onDelete={(user) => handleOpenUserDeleteConfirm(user, "Soporte")}
              onReactivar={(user) => handleReactivarUser(user, "Soporte")}
              onCreateNew={() => handleOpenCreateUserModal("Soporte")}
              userType="Soporte"
            />
          </>
        );

      case "reports":
        return (
          <div className="content-header">
            <h1 className="content-title">Reportes y Estadísticas</h1>
            <p className="content-subtitle">
              Esta sección estará disponible próximamente
            </p>
            <div className="empty-state" style={{ marginTop: "2rem" }}>
              <div className="empty-icon">
                <MdBarChart />
              </div>
              <h3 className="empty-title">Próximamente</h3>
              <p className="empty-description">
                Los reportes y estadísticas estarán disponibles en futuras
                actualizaciones.
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
              <div className="empty-icon">
                <MdSettings />
              </div>
              <h3 className="empty-title">Próximamente</h3>
              <p className="empty-description">
                La configuración del sistema estará disponible en futuras
                actualizaciones.
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

  // Obtener nombre del usuario a eliminar
  const getUserDeleteName = () => {
    if (!userToDelete) return "";
    return (
      userToDelete.nombreCompleto ||
      `${userToDelete.nombre || ""} ${userToDelete.apellido || ""}`.trim()
    );
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
            {/* Mensajes de alerta de Roles */}
            <AlertMessage
              type="success"
              message={success}
              onClose={clearRolesMessages}
            />
            <AlertMessage
              type="error"
              message={error}
              onClose={clearRolesMessages}
            />

            {/* Mensajes de alerta de Operadores */}
            <AlertMessage
              type="success"
              message={operadoresSuccess}
              onClose={clearOperadoresMessages}
            />
            <AlertMessage
              type="error"
              message={operadoresError}
              onClose={clearOperadoresMessages}
            />

            {/* Mensajes de alerta de Soporte */}
            <AlertMessage
              type="success"
              message={soporteSuccess}
              onClose={clearSoporteMessages}
            />
            <AlertMessage
              type="error"
              message={soporteError}
              onClose={clearSoporteMessages}
            />

            {renderContent()}
          </div>
        </main>

        {/* Modal para crear/editar roles */}
        <RoleModal
          isOpen={isRoleModalOpen}
          onClose={handleCloseRoleModal}
          onSubmit={handleSubmitRole}
          role={selectedRole}
          mode={roleModalMode}
        />

        {/* Diálogo de confirmación para eliminar rol */}
        <ConfirmDialog
          isOpen={isRoleConfirmOpen}
          onClose={handleCloseRoleDeleteConfirm}
          onConfirm={handleConfirmRoleDelete}
          title="¿Eliminar este rol?"
          message={`Estás a punto de eliminar el rol "${roleToDelete?.nombre}". Esta acción no se puede deshacer.`}
          loading={roleDeleteLoading}
        />

        {/* Modal reutilizable para crear/editar usuarios (Operadores/Soporte) */}
        <UserModal
          isOpen={isUserModalOpen}
          onClose={handleCloseUserModal}
          onSubmit={handleSubmitUser}
          user={selectedUser}
          mode={userModalMode}
          userType={currentUserType}
        />

        {/* Diálogo de confirmación para eliminar usuario */}
        <ConfirmDialog
          isOpen={isUserConfirmOpen}
          onClose={handleCloseUserDeleteConfirm}
          onConfirm={handleConfirmUserDelete}
          title={`¿Eliminar este ${currentUserType.toLowerCase()}?`}
          message={`Estás a punto de eliminar a "${getUserDeleteName()}". Esta acción desactivará su cuenta.`}
          loading={userDeleteLoading}
        />
      </div>
    </FondoPag>
  );
};
