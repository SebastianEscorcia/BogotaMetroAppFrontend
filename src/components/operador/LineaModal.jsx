import { useEffect, useState } from "react";
import {
  MdAdd,
  MdCancel,
  MdCheckCircle,
  MdClose,
  MdEdit,
  MdHourglassEmpty,
  MdSave,
} from "react-icons/md";

export const LineaModal = ({ isOpen, onClose, onSubmit, linea, mode }) => {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("#FF0000");
  const [frecuenciaMinutos, setFrecuenciaMinutos] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && linea) {
      setNombre(linea.nombre || "");
      setColor(linea.color || "#FF0000");
      setFrecuenciaMinutos(linea.frecuenciaMinutos ?? 3);
      return;
    }

    setNombre("");
    setColor("#FF0000");
    setFrecuenciaMinutos(3);
  }, [mode, linea, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setLoading(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        color,
        frecuenciaMinutos: Number(frecuenciaMinutos),
      };

      if (mode === "edit") {
        await onSubmit(linea.id, payload);
      } else {
        await onSubmit(payload);
      }

      onClose();
    } catch (error) {
      console.error("Error guardando línea:", error);
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
            <span className="modal-title-icon">{mode === "edit" ? <MdEdit /> : <MdAdd />}</span>
            {mode === "edit" ? "Editar Línea" : "Crear Línea"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: Línea 1"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <input
                type="color"
                className="form-input"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Frecuencia (minutos)</label>
              <input
                type="number"
                min={1}
                className="form-input"
                value={frecuenciaMinutos}
                onChange={(e) => setFrecuenciaMinutos(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              <MdCancel /> Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !nombre.trim()}
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
                  <MdCheckCircle /> Crear Línea
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LineaModal;