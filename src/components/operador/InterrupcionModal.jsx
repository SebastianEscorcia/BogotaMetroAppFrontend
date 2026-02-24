import { useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdCancel,
  MdCheckCircle,
  MdClose,
  MdEdit,
  MdHourglassEmpty,
  MdSave,
} from "react-icons/md";

const toInputDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toIsoDateTime = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    if (value.length === 16) {
      return `${value}:00`;
    }
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const INTERRUPTION_TYPE_OPTIONS = [
  "FALLA_TECNICA",
  "ACCIDENTE",
  "MANTENIMIENTO",
  "EVENTO_CLIMATICO",
  "OTRO",
];

export const InterrupcionModal = ({
  isOpen,
  onClose,
  onSubmit,
  interrupcion,
  mode,
  lineas = [],
  estaciones = [],
  estacionesLineas = [],
}) => {
  const [idEstacion, setIdEstacion] = useState("");
  const [idLinea, setIdLinea] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [loading, setLoading] = useState(false);

  const lineasOptions = useMemo(() => lineas || [], [lineas]);
  const estacionesOptions = useMemo(() => estaciones || [], [estaciones]);
  const estacionesLineasOptions = useMemo(() => estacionesLineas || [], [estacionesLineas]);

  const estacionesFiltradasPorLinea = useMemo(() => {
    if (!idLinea) return [];

    const estacionesPermitidas = new Set(
      estacionesLineasOptions
        .filter((relation) => Number(relation.idLinea) === Number(idLinea))
        .map((relation) => Number(relation.idEstacion))
    );

    return estacionesOptions.filter((estacion) => estacionesPermitidas.has(Number(estacion.id)));
  }, [idLinea, estacionesLineasOptions, estacionesOptions]);

  useEffect(() => {
    if (mode === "edit" && interrupcion) {
      setIdEstacion(interrupcion.idEstacion || "");
      setIdLinea(interrupcion.idLinea || "");
      setTipo(interrupcion.tipo || "");
      setDescripcion(interrupcion.descripcion || "");
      setInicio(toInputDateTime(interrupcion.inicio));
      setFin(toInputDateTime(interrupcion.fin));
      return;
    }

    setIdEstacion(estacionesOptions[0]?.id ?? "");
    setIdLinea(lineasOptions[0]?.id ?? "");
    setTipo("");
    setDescripcion("");
    setInicio("");
    setFin("");
  }, [mode, interrupcion, isOpen, lineasOptions, estacionesOptions]);

  useEffect(() => {
    if (!isOpen) return;

    if (!idLinea || estacionesFiltradasPorLinea.length === 0) {
      if (idEstacion !== "") {
        setIdEstacion("");
      }
      return;
    }

    const estacionActualValida = estacionesFiltradasPorLinea.some(
      (estacion) => Number(estacion.id) === Number(idEstacion)
    );

    if (!estacionActualValida) {
      setIdEstacion(estacionesFiltradasPorLinea[0].id);
    }
  }, [idLinea, idEstacion, estacionesFiltradasPorLinea, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idEstacion || !idLinea || !tipo.trim() || !descripcion.trim() || !inicio) return;

    setLoading(true);
    try {
      const basePayload = {
        idEstacion: Number(idEstacion),
        idLinea: Number(idLinea),
        tipo: tipo.trim().toUpperCase(),
        descripcion: descripcion.trim(),
        inicio: toIsoDateTime(inicio),
        fin: toIsoDateTime(fin),
      };

      if (mode === "edit") {
        await onSubmit(interrupcion.id, basePayload);
      } else {
        await onSubmit(basePayload);
      }

      onClose();
    } catch (error) {
      console.error("Error guardando interrupción:", error);
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
            {mode === "edit" ? "Editar Interrupción" : "Crear Interrupción"}
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
                disabled={!idLinea || estacionesFiltradasPorLinea.length === 0}
                required
              >
                {estacionesFiltradasPorLinea.length === 0 ? (
                  <option value="">No hay estaciones asociadas para esta línea</option>
                ) : (
                  estacionesFiltradasPorLinea.map((estacion) => (
                    <option key={estacion.id} value={estacion.id}>
                      #{estacion.id} - {estacion.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de interrupción</label>
              <select
                className="form-select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecciona un tipo
                </option>
                {INTERRUPTION_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-input"
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Inicio</label>
              <input
                type="datetime-local"
                className="form-input"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fin (opcional)</label>
              <input
                type="datetime-local"
                className="form-input"
                value={fin}
                onChange={(e) => setFin(e.target.value)}
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
              disabled={loading || !idEstacion || !idLinea || !tipo.trim() || !descripcion.trim() || !inicio}
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
                  <MdCheckCircle /> Crear Interrupción
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterrupcionModal;