import { useMemo, useState } from "react";
import {
  MdAdd,
  MdBuild,
  MdDelete,
  MdEdit,
  MdFilterList,
  MdFileDownload,
  MdTableChart,
} from "react-icons/md";

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const statusClass = (estado = "") => {
  const status = String(estado).toUpperCase();
  if (status === "SOLUCIONADA") return "active";
  return "inactive";
};

export const InterrupcionesTable = ({
  interrupciones,
  loading,
  onCreateNew,
  onEdit,
  onDelete,
  onSolve,
}) => {
  const [statusFilter, setStatusFilter] = useState("ACTIVAS");

  const filteredInterrupciones = useMemo(() => {
    const sorted = [...(interrupciones || [])].sort((a, b) => Number(b.id || 0) - Number(a.id || 0));

    if (statusFilter === "SOLUCIONADAS") {
      return sorted.filter((item) => String(item.estado).toUpperCase() === "SOLUCIONADA");
    }

    if (statusFilter === "TODAS") {
      return sorted;
    }

    return sorted.filter((item) => String(item.estado).toUpperCase() !== "SOLUCIONADA");
  }, [interrupciones, statusFilter]);

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          Cargando interrupciones...
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
          Gestión de Interrupciones
        </h2>
        <div className="table-actions">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              marginRight: "0.25rem",
            }}
          >
            <MdFilterList style={{ color: "#6b7280" }} />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: "170px" }}
            >
              <option value="ACTIVAS">Activas</option>
              <option value="SOLUCIONADAS">Solucionadas</option>
              <option value="TODAS">Todas</option>
            </select>
          </div>

          <button className="btn btn-secondary">
            <MdFileDownload /> Exportar
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Nueva Interrupción
          </button>
        </div>
      </div>

      {interrupciones.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <MdTableChart />
          </div>
          <h3 className="empty-title">No hay interrupciones registradas</h3>
          <p className="empty-description">Registra una interrupción para informar al sistema en tiempo real.</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Crear Primera Interrupción
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Estación</th>
                <th>Línea</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterrupciones.map((item) => {
                const isSolved = String(item.estado).toUpperCase() === "SOLUCIONADA";
                return (
                  <tr key={item.id}>
                    <td>
                      <strong>#{item.id}</strong>
                    </td>
                    <td>{item.nombreEstacion || `#${item.idEstacion || "-"}`}</td>
                    <td>{item.nombreLinea || `#${item.idLinea || "-"}`}</td>
                    <td>{item.tipo || "-"}</td>
                    <td>{item.descripcion || "-"}</td>
                    <td>{formatDate(item.inicio)}</td>
                    <td>{formatDate(item.fin)}</td>
                    <td>
                      <span className={`status-badge ${statusClass(item.estado)}`}>
                        <span className="status-dot"></span>
                        {item.estado || "-"}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn btn-icon btn-edit"
                          onClick={() => onEdit(item)}
                          title="Editar interrupción"
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="btn btn-icon"
                          style={{
                            background: "rgba(16, 185, 129, 0.1)",
                            color: "#10b981",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            opacity: isSolved ? 0.45 : 1,
                          }}
                          onClick={() => onSolve(item)}
                          title="Marcar como solucionada"
                          disabled={isSolved}
                        >
                          <MdBuild />
                        </button>
                        <button
                          className="btn btn-icon btn-delete"
                          onClick={() => onDelete(item)}
                          title="Eliminar interrupción"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInterrupciones.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "1.25rem" }}>
                    No hay interrupciones para el filtro seleccionado.
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

export default InterrupcionesTable;