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

export const FaqCategoryModal = ({ isOpen, onClose, onSubmit, category, mode }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && category) {
      setName(category.name || "");
      return;
    }
    setName("");
  }, [mode, category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      if (mode === "edit") {
        await onSubmit(category.id, { name: name.trim() });
      } else {
        await onSubmit(name.trim());
      }
      onClose();
    } catch (error) {
      console.error("Error guardando categoría FAQ:", error);
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
            {mode === "edit" ? "Editar Categoría FAQ" : "Crear Categoría FAQ"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nombre de categoría</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: Recargas, Tarjeta, Viajes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              <MdCancel /> Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
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
                  <MdCheckCircle /> Crear Categoría
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FaqCategoryModal;