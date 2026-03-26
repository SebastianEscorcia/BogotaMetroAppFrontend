import { useMemo, useState } from "react";
import { MdAdd, MdDelete, MdFileDownload, MdSearch, MdTableChart } from "react-icons/md";

export const EstacionesLineasTable = ({
  relations,
  loading,
  onCreateNew,
  onDelete,
}) => {
  const [lineaFilter, setLineaFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const lineasDisponibles = useMemo(() => {
    const map = new Map();

    (relations || []).forEach((relation) => {
      const idLinea = Number(relation.idLinea);
      if (!map.has(idLinea)) {
        map.set(idLinea, {
          id: idLinea,
          nombre: relation.nombreLinea || `Línea ${idLinea}`,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.id - b.id);
  }, [relations]);

  const filteredRelations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return (relations || [])
      .filter((relation) => {
        const matchesLinea =
          lineaFilter === "all" || Number(relation.idLinea) === Number(lineaFilter);

        if (!matchesLinea) return false;
        if (!normalizedSearch) return true;

        const lineaName = (relation.nombreLinea || "").toLowerCase();
        const estacionName = (relation.nombreEstacion || "").toLowerCase();

        return lineaName.includes(normalizedSearch) || estacionName.includes(normalizedSearch);
      })
      .sort((a, b) => {
        const lineDiff = Number(a.idLinea) - Number(b.idLinea);
        if (lineDiff !== 0) return lineDiff;
        return Number(a.orden) - Number(b.orden);
      });
  }, [relations, lineaFilter, searchTerm]);

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          Cargando asignaciones...
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
          Asignación Estación - Línea
        </h2>
        <div className="table-actions">
          <button className="btn btn-secondary">
            <MdFileDownload /> Exportar
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Nueva Asignación
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 280px) 1fr",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        <select
          className="form-select"
          value={lineaFilter}
          onChange={(e) => setLineaFilter(e.target.value)}
        >
          <option value="all">Todas las líneas</option>
          {lineasDisponibles.map((linea) => (
            <option key={linea.id} value={linea.id}>
              {linea.nombre}
            </option>
          ))}
        </select>

        <div style={{ position: "relative" }}>
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
            placeholder="Buscar por línea o estación"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>
      </div>

      {relations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <MdTableChart />
          </div>
          <h3 className="empty-title">No hay asignaciones registradas</h3>
          <p className="empty-description">Relaciona estaciones con líneas y orden de recorrido.</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Crear Primera Asignación
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Línea</th>
                <th>Estación</th>
                <th>Orden</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRelations.map((relation) => (
                <tr key={`${relation.idLinea}-${relation.idEstacion}`}>
                  <td>{relation.nombreLinea || "-"}</td>
                  <td>{relation.nombreEstacion || "-"}</td>
                  <td>{relation.orden}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => onDelete(relation)}
                        title="Eliminar asignación"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRelations.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "1.25rem" }}>
                    No hay asignaciones para el filtro seleccionado.
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

export default EstacionesLineasTable;