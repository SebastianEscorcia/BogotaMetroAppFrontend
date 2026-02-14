import {
  MdAccessTime,
  MdAdd,
  MdDelete,
  MdEdit,
  MdFileDownload,
  MdTableChart,
} from "react-icons/md";

const formatDiaLabel = (dia = "") => {
  const labels = {
    LUNES: "Lunes",
    MARTES: "Martes",
    MIERCOLES: "Miércoles",
    JUEVES: "Jueves",
    VIERNES: "Viernes",
    SABADO: "Sábado",
    DOMINGO: "Domingo",
    FESTIVO: "Festivo",
  };

  return labels[dia] || dia;
};

const formatHora = (hora = "") => {
  if (!hora) return "--:--";
  return hora.slice(0, 5);
};

export const HorariosSistemaTable = ({
  horarios,
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
          Cargando horarios del sistema...
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
          Horarios de Operación
        </h2>
        <div className="table-actions">
          <button className="btn btn-secondary">
            <MdFileDownload /> Exportar
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Nuevo Horario
          </button>
        </div>
      </div>

      {horarios.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <MdAccessTime />
          </div>
          <h3 className="empty-title">No hay horarios registrados</h3>
          <p className="empty-description">
            Crea el primer horario del sistema para controlar la operación por día.
          </p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <MdAdd /> Crear Primer Horario
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Día</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Estado</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario) => (
                <tr key={horario.id}>
                  <td>
                    <strong>#{horario.id}</strong>
                  </td>
                  <td>{formatDiaLabel(horario.dia)}</td>
                  <td>{formatHora(horario.horaInicio)}</td>
                  <td>{formatHora(horario.horaFin)}</td>
                  <td>
                    <span className={`status-badge ${horario.activo ? "active" : "inactive"}`}>
                      <span className="status-dot"></span>
                      {horario.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-icon btn-edit"
                        onClick={() => onEdit(horario)}
                        title="Editar horario"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => onDelete(horario)}
                        title="Eliminar horario"
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

export default HorariosSistemaTable;