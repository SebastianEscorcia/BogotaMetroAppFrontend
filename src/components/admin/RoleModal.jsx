import { useState, useEffect } from "react";
import { 
  MdEdit, 
  MdAdd, 
  MdClose, 
  MdSave, 
  MdCheckCircle,
  MdCancel,
  MdHourglassEmpty 
} from "react-icons/md";

export const RoleModal = ({ isOpen, onClose, onSubmit, role, mode }) => {
  const [nombre, setNombre] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role && mode === "edit") {
      setNombre(role.nombre || "");
      setIsActive(role.isActive ?? true);
    } else {
      setNombre("");
      setIsActive(true);
    }
  }, [role, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setLoading(true);
    try {
      if (mode === "edit") {
        await onSubmit(role.id, { nombre: nombre.trim(), isActive });
      } else {
        await onSubmit(nombre.trim());
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
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
              {mode === "edit" ? <MdEdit /> : <MdAdd />}
            </span>
            {mode === "edit" ? "Editar Rol" : "Crear Nuevo Rol"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nombre del Rol</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: ADMINISTRADOR, OPERADOR, etc."
                value={nombre}
                onChange={(e) => setNombre(e.target.value.toUpperCase())}
                required
                autoFocus
              />
            </div>

            {mode === "edit" && (
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
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
              disabled={loading || !nombre.trim()}
            >
              {loading ? (
                <><MdHourglassEmpty /> Guardando...</>
              ) : mode === "edit" ? (
                <><MdSave /> Actualizar</>
              ) : (
                <><MdCheckCircle /> Crear Rol</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
