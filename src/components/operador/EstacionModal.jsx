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

const TIPOS_ESTACION = ["ELEVADA", "SUBTERRANEA", "SUPERFICIE"];

export const EstacionModal = ({ isOpen, onClose, onSubmit, estacion, mode }) => {
  const [nombre, setNombre] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [tipo, setTipo] = useState("ELEVADA");
  const [esAccesible, setEsAccesible] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && estacion) {
      setNombre(estacion.nombre || "");
      setLatitud(estacion.latitud ?? "");
      setLongitud(estacion.longitud ?? "");
      setTipo(estacion.tipo || "ELEVADA");
      setEsAccesible(estacion.esAccesible ?? true);
      return;
    }

    setNombre("");
    setLatitud("");
    setLongitud("");
    setTipo("ELEVADA");
    setEsAccesible(true);
  }, [mode, estacion, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || latitud === "" || longitud === "") return;

    setLoading(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        latitud: Number(latitud),
        longitud: Number(longitud),
        tipo,
        esAccesible,
      };

      if (mode === "edit") {
        await onSubmit(estacion.id, payload);
      } else {
        await onSubmit(payload);
      }

      onClose();
    } catch (error) {
      console.error("Error guardando estación:", error);
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
            {mode === "edit" ? "Editar Estación" : "Crear Estación"}
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
                placeholder="Nombre de estación"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                {TIPOS_ESTACION.map((tipoOption) => (
                  <option key={tipoOption} value={tipoOption}>
                    {tipoOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Latitud</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={latitud}
                onChange={(e) => setLatitud(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Longitud</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={longitud}
                onChange={(e) => setLongitud(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Accesible</label>
              <select
                className="form-select"
                value={esAccesible ? "true" : "false"}
                onChange={(e) => setEsAccesible(e.target.value === "true")}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              <MdCancel /> Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !nombre.trim() || latitud === "" || longitud === ""}
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
                  <MdCheckCircle /> Crear Estación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstacionModal;