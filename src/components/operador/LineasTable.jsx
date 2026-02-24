import { useMemo, useState } from "react";
import { MdAdd, MdDelete, MdEdit, MdFileDownload, MdSearch, MdTableChart } from "react-icons/md";

export const LineasTable = ({
  lineas,
  loading,
  onCreateNew,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLineas = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return (lineas || []).filter((linea) => {
      if (!normalizedSearch) return true;

      const nombre = (linea.nombre || "").toLowerCase();
      const color = (linea.color || "").toLowerCase();

      return nombre.includes(normalizedSearch) || color.includes(normalizedSearch);
    });
  }, [lineas, searchTerm]);

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          Cargando líneas...
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
          Gestión de Líneas
        </h2>
        <div className="table-actions">
          <button className="btn btn-secondary">
            <MdFileDownload /> Exportar
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Nueva Línea
          </button>
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <MdSearch
          style={{
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.7,
          }}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Filtrar por nombre o color"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: "2.25rem" }}
        />
      </div>

      {lineas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <MdTableChart />
          </div>
          <h3 className="empty-title">No hay líneas registradas</h3>
          <p className="empty-description">Crea una línea para iniciar la operación del sistema.</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Crear Primera Línea
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Color</th>
                <th>Frecuencia (min)</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLineas.map((linea) => (
                <tr key={linea.id}>
                  <td>{linea.nombre}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          border: "1px solid rgba(0,0,0,0.2)",
                          background: linea.color || "#cccccc",
                        }}
                      ></span>
                      <span>{linea.color || "-"}</span>
                    </div>
                  </td>
                  <td>{linea.frecuenciaMinutos ?? "-"}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-icon btn-edit"
                        onClick={() => onEdit(linea)}
                        title="Editar línea"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => onDelete(linea)}
                        title="Eliminar línea"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLineas.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "1.25rem" }}>
                    No hay líneas para el filtro seleccionado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LineasTable;