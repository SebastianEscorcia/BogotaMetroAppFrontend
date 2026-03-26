import { useMemo, useState } from "react";
import { MdAdd, MdDelete, MdEdit, MdFileDownload, MdSearch, MdTableChart } from "react-icons/md";

export const EstacionesTable = ({
  estaciones,
  loading,
  onCreateNew,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [accesibleFilter, setAccesibleFilter] = useState("all");

  const tiposDisponibles = useMemo(() => {
    const tipos = new Set(
      (estaciones || [])
        .map((estacion) => (estacion.tipo || "").trim())
        .filter(Boolean)
    );

    return Array.from(tipos).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [estaciones]);

  const filteredEstaciones = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return (estaciones || []).filter((estacion) => {
      const matchesTipo = tipoFilter === "all" || (estacion.tipo || "") === tipoFilter;

      const matchesAccesible =
        accesibleFilter === "all" ||
        (accesibleFilter === "si" && estacion.esAccesible) ||
        (accesibleFilter === "no" && !estacion.esAccesible);

      if (!matchesTipo || !matchesAccesible) return false;
      if (!normalizedSearch) return true;

      const nombre = (estacion.nombre || "").toLowerCase();
      const tipo = (estacion.tipo || "").toLowerCase();

      return nombre.includes(normalizedSearch) || tipo.includes(normalizedSearch);
    });
  }, [estaciones, searchTerm, tipoFilter, accesibleFilter]);

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          Cargando estaciones...
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
          Gestión de Estaciones
        </h2>
        <div className="table-actions">
          <button className="btn btn-secondary">
            <MdFileDownload /> Exportar
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Nueva Estación
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr minmax(180px, 220px) minmax(180px, 220px)",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
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
            placeholder="Filtrar por nombre o tipo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>

        <select
          className="form-select"
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
        >
          <option value="all">Todos los tipos</option>
          {tiposDisponibles.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={accesibleFilter}
          onChange={(e) => setAccesibleFilter(e.target.value)}
        >
          <option value="all">Accesible: todos</option>
          <option value="si">Accesible: sí</option>
          <option value="no">Accesible: no</option>
        </select>
      </div>

      {estaciones.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <MdTableChart />
          </div>
          <h3 className="empty-title">No hay estaciones registradas</h3>
          <p className="empty-description">Crea una estación para comenzar la configuración de líneas.</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Crear Primera Estación
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Accesible</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstaciones.map((estacion) => (
                <tr key={estacion.id}>
                  <td>{estacion.nombre}</td>
                  <td>{estacion.tipo || "-"}</td>
                  <td>{estacion.latitud ?? "-"}</td>
                  <td>{estacion.longitud ?? "-"}</td>
                  <td>
                    <span className={`status-badge ${estacion.esAccesible ? "active" : "inactive"}`}>
                      <span className="status-dot"></span>
                      {estacion.esAccesible ? "Sí" : "No"}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-icon btn-edit"
                        onClick={() => onEdit(estacion)}
                        title="Editar estación"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => onDelete(estacion)}
                        title="Eliminar estación"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEstaciones.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "1.25rem" }}>
                    No hay estaciones para el filtro seleccionado.
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

export default EstacionesTable;