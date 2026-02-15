import { MdAdd, MdDelete, MdEdit, MdFileDownload, MdTableChart } from "react-icons/md";

export const FaqCategoryTable = ({
  categories,
  loading,
  onCreateNew,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          Cargando categorías FAQ...
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">
          <span className="table-title-icon">
            <MdTableChart />
          </span>
          Categorías de Preguntas Frecuentes
        </h2>
        <div className="table-actions">
          <button className="btn btn-secondary">
            <MdFileDownload /> Exportar
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Nueva Categoría
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <MdTableChart />
          </div>
          <h3 className="empty-title">No hay categorías registradas</h3>
          <p className="empty-description">Crea una categoría para organizar las preguntas frecuentes.</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Crear Primera Categoría
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <strong>#{category.id}</strong>
                  </td>
                  <td>{category.name}</td>
                  <td>
                    <span className={`status-badge ${category.isActive ? "active" : "inactive"}`}>
                      <span className="status-dot"></span>
                      {category.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-icon btn-edit"
                        onClick={() => onEdit(category)}
                        title="Editar categoría"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => onDelete(category)}
                        title="Eliminar categoría"
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

export default FaqCategoryTable;