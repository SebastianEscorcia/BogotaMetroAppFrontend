import { useEffect, useState } from "react";
import {
  MdAccessTime,
  MdCancel,
  MdCheckCircle,
  MdClose,
  MdEdit,
  MdHourglassEmpty,
  MdSave,
} from "react-icons/md";

const DIAS_SEMANA = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
  "FESTIVO",
];

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

const formatTimeForInput = (timeValue = "") => {
  if (!timeValue) return "";
  return timeValue.slice(0, 5);
};

export const HorarioSistemaModal = ({
  isOpen,
  onClose,
  onSubmit,
  horario,
  mode,
}) => {
  const [dia, setDia] = useState("LUNES");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && horario) {
      setDia(horario.dia || "LUNES");
      setHoraInicio(formatTimeForInput(horario.horaInicio));
      setHoraFin(formatTimeForInput(horario.horaFin));
      setActivo(horario.activo ?? true);
      return;
    }

    setDia("LUNES");
    setHoraInicio("");
    setHoraFin("");
    setActivo(true);
  }, [mode, horario, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dia || !horaInicio || !horaFin) return;

    setLoading(true);
    try {
      const payload = {
        dia,
        horaInicio,
        horaFin,
        activo,
      };

      if (mode === "edit") {
        await onSubmit(horario.id, payload);
      } else {
        await onSubmit(payload);
      }

      onClose();
    } catch (error) {
      console.error("Error guardando horario:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-title-icon">
              {mode === "edit" ? <MdEdit /> : <MdAccessTime />}
            </span>
            {mode === "edit" ? "Editar Horario" : "Crear Horario"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Día</label>
              <select
                className="form-select"
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                required
              >
                {DIAS_SEMANA.map((diaOption) => (
                  <option key={diaOption} value={diaOption}>
                    {formatDiaLabel(diaOption)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Hora de inicio</label>
              <input
                type="time"
                className="form-input"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hora de fin</label>
              <input
                type="time"
                className="form-input"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
              />
            </div>

            {mode === "edit" && (
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={activo ? "true" : "false"}
                  onChange={(e) => setActivo(e.target.value === "true")}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              <MdCancel /> Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !dia || !horaInicio || !horaFin}
            >
              {loading ? (
                <>
                  <MdHourglassEmpty /> Guardando...
                </>
              ) : mode === "edit" ? (
                <>
                  <MdSave /> Actualizar
                </>
              ) : (
                <>
                  <MdCheckCircle /> Crear Horario
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HorarioSistemaModal;