import { MdAdd, MdDelete, MdEdit, MdFileDownload, MdTableChart } from "react-icons/md";

const getCategoryName = (faq, categories = []) => {
  if (faq.categoryName) return faq.categoryName;
  if (faq.categoryFaq?.name) return faq.categoryFaq.name;

  const categoryId = faq.categoryFaqId ?? faq.categoryId ?? faq.categoryFaq?.id;
  const category = categories.find((item) => item.id === categoryId);
  return category?.name || "Sin categoría";
};

export const SupportFaqTable = ({
  faqs,
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
          Cargando preguntas frecuentes...
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
          Preguntas Frecuentes del Sistema
        </h2>
        <div className="table-actions">
          <button className="btn btn-secondary">
            <MdFileDownload /> Exportar
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Nueva Pregunta
          </button>
        </div>
      </div>

      {faqs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <MdTableChart />
          </div>
          <h3 className="empty-title">No hay preguntas frecuentes registradas</h3>
          <p className="empty-description">Crea una pregunta para alimentar el módulo de ayuda al pasajero.</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Crear Primera Pregunta
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pregunta</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td>
                    <strong>#{faq.id}</strong>
                  </td>
                  <td>
                    <div style={{ maxWidth: "480px" }}>
                      <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{faq.question}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{faq.answer}</div>
                    </div>
                  </td>
                  <td>{getCategoryName(faq, categories)}</td>
                  <td>
                    <span className={`status-badge ${faq.isActive ? "active" : "inactive"}`}>
                      <span className="status-dot"></span>
                      {faq.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-icon btn-edit"
                        onClick={() => onEdit(faq)}
                        title="Editar pregunta"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => onDelete(faq)}
                        title="Eliminar pregunta"
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

export default SupportFaqTable;