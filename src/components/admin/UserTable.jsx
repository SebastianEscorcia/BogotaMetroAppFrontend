import {
  FiSearch,
  FiDownload,
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";

/**
 * Componente de tabla reutilizable para usuarios (Operadores, Soporte, etc.)
 * @param {Object} props
 * @param {Array} props.users - Lista de usuarios a mostrar
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.searchTerm - Término de búsqueda actual
 * @param {Function} props.onSearch - Callback para búsqueda
 * @param {Function} props.onEdit - Callback para editar usuario
 * @param {Function} props.onDelete - Callback para eliminar usuario
 * @param {Function} props.onReactivar - Callback para reactivar usuario
 * @param {Function} props.onCreateNew - Callback para crear nuevo usuario
 * @param {string} props.userType - Tipo de usuario ("Operador" | "Soporte")
 * @param {string} props.userTypeIcon - Icono del tipo de usuario (opcional)
 */
export const UserTable = ({
  users = [],
  loading,
  searchTerm = "",
  onSearch,
  onEdit,
  onDelete,
  onReactivar,
  onCreateNew,
  userType = "Usuario",
}) => {
  // Configuración según tipo de usuario
  const config = {
    Operador: {
      title: "Gestión de Operadores",
      searchPlaceholder: "Buscar operador...",
      emptyTitle: "No hay operadores registrados",
      emptyDescription: "Comienza registrando tu primer operador para gestionar el sistema.",
      createButtonText: "Nuevo Operador",
      firstCreateText: "Registrar Primer Operador",
      activeColor: "#10b981",
      inactiveColor: "#ef4444",
    },
    Soporte: {
      title: "Gestión de Soporte",
      searchPlaceholder: "Buscar soporte...",
      emptyTitle: "No hay personal de soporte registrado",
      emptyDescription: "Comienza registrando tu primer miembro de soporte.",
      createButtonText: "Nuevo Soporte",
      firstCreateText: "Registrar Primer Soporte",
      activeColor: "#3b82f6",
      inactiveColor: "#ef4444",
    },
  };

  const currentConfig = config[userType] || config.Operador;

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          Cargando {userType.toLowerCase()}s...
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">
          <HiOutlineUserGroup style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
          {currentConfig.title}
        </h2>
        <div className="table-actions">
          <div className="header-search" style={{ marginRight: "0.75rem", position: "relative" }}>
            <FiSearch
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.4)",
              }}
            />
            <input
              type="text"
              className="search-input"
              placeholder={currentConfig.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              style={{ width: "200px", paddingLeft: "2.25rem" }}
            />
          </div>
          <button className="btn btn-secondary">
            <FiDownload /> Exportar
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <FiUserPlus /> {currentConfig.createButtonText}
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <HiOutlineUserGroup size={48} />
          </div>
          <h3 className="empty-title">{currentConfig.emptyTitle}</h3>
          <p className="empty-description">{currentConfig.emptyDescription}</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <FiUserPlus /> {currentConfig.firstCreateText}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
             
              <tr key={user.id}>
                <td>
                  <strong>#{user.id}</strong>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: user.activo
                          ? `linear-gradient(135deg, ${currentConfig.activeColor}26 0%, ${currentConfig.activeColor}0d 100%)`
                          : `linear-gradient(135deg, ${currentConfig.inactiveColor}26 0%, ${currentConfig.inactiveColor}0d 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: user.activo ? currentConfig.activeColor : currentConfig.inactiveColor,
                      }}
                    >
                      <HiOutlineUserGroup size={20} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {user.nombreCompleto || `${user.nombre || ""} ${user.apellido || ""}`.trim() || user.usuario.nombreCompleto}  
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(253, 13, 13, 0.81)" }}>
                        {user.tipoDocumento || user.usuario.tipoDocumento}: { user.usuario?.numDocumento || user.numDocumento } 
                      </div>
                    </div>
                  </div>
                </td>
                <td>{user.correo}</td>
                <td>{user.telefono || user.usuario.telefono  }  </td>
                <td>
                  <span className={`status-badge ${user.activo ? "active" : "inactive"}`}>
                    <span className="status-dot"></span>
                    {user.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                    <button
                      className="btn btn-icon btn-edit"
                      onClick={() => onEdit(user)}
                      title={`Editar ${userType.toLowerCase()}`}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    {user.activo ? (
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => onDelete(user)}
                        title={`Desactivar ${userType.toLowerCase()}`}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-icon"
                        onClick={() => onReactivar(user)}
                        title={`Reactivar ${userType.toLowerCase()}`}
                        style={{
                          background: "rgba(16, 185, 129, 0.1)",
                          color: "#10b981",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                        }}
                      >
                        <FiRefreshCw size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable;
