import { 
  MdTableChart, 
  MdFileDownload, 
  MdAdd, 
  MdSecurity, 
  MdEdit, 
  MdDelete 
} from "react-icons/md";

export const RolesTable = ({
  roles,
  loading,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          Cargando roles...
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">
          <span className="table-title-icon"><MdTableChart /></span>
          Gestión de Roles del Sistema
        </h2>
        <div className="table-actions">
          <button className="btn btn-secondary">
            <MdFileDownload /> Exportar
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Nuevo Rol
          </button>
        </div>
      </div>

      {roles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><MdSecurity /></div>
          <h3 className="empty-title">No hay roles registrados</h3>
          <p className="empty-description">
            Comienza creando tu primer rol para gestionar los permisos del sistema.
          </p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Crear Primer Rol
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Rol</th>
                <th>Estado</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>
                    <strong>#{role.id}</strong>
                  </td>
                  <td>
                    <div className="role-cell">
                      <span className="role-icon-wrapper">
                        <MdSecurity />
                      </span>
                      <span className="role-name">{role.nombre}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${role.isActive ? "active" : "inactive"}`}>
                      <span className="status-dot"></span>
                      {role.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-icon btn-edit"
                        onClick={() => onEdit(role)}
                        title="Editar rol"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => onDelete(role)}
                        title="Eliminar rol"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RolesTable;
