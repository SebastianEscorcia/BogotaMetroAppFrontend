import { useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdCancel,
  MdCheckCircle,
  MdClose,
  MdHourglassEmpty,
} from "react-icons/md";

export const EstacionLineaModal = ({
  isOpen,
  onClose,
  onSubmit,
  lineas = [],
  estaciones = [],
}) => {
  const [idLinea, setIdLinea] = useState("");
  const [idEstacion, setIdEstacion] = useState("");
  const [orden, setOrden] = useState(1);
  const [loading, setLoading] = useState(false);

  const lineasOptions = useMemo(() => lineas || [], [lineas]);
  const estacionesOptions = useMemo(() => estaciones || [], [estaciones]);

  useEffect(() => {
    if (!isOpen) return;

    setIdLinea(lineasOptions[0]?.id ?? "");
    setIdEstacion(estacionesOptions[0]?.id ?? "");
    setOrden(1);
  }, [isOpen, lineasOptions, estacionesOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idLinea || !idEstacion || !orden) return;

    setLoading(true);
    try {
      await onSubmit({
        idLinea,
        idEstacion,
        orden,
      });
      onClose();
    } catch (error) {
      console.error("Error creando asignación:", error);
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
              <MdAdd />
            </span>
            Crear Asignación
          </h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Línea</label>
              <select
                className="form-select"
                value={idLinea}
                onChange={(e) => setIdLinea(Number(e.target.value))}
                required
              >
                {lineasOptions.map((linea) => (
                  <option key={linea.id} value={linea.id}>
                    #{linea.id} - {linea.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estación</label>
              <select
                className="form-select"
                value={idEstacion}
                onChange={(e) => setIdEstacion(Number(e.target.value))}
                required
              >
                {estacionesOptions.map((estacion) => (
                  <option key={estacion.id} value={estacion.id}>
                    #{estacion.id} - {estacion.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Orden en la línea</label>
              <input
                type="number"
                min={1}
                className="form-input"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
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
              disabled={loading || !idLinea || !idEstacion || !orden}
            >
              {loading ? (
                <>
                  <MdHourglassEmpty /> Guardando...
                </>
              ) : (
                <>
                  <MdCheckCircle /> Crear Asignación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstacionLineaModal;