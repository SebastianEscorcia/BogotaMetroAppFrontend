import {
  MdWarning,
  MdClose,
  MdDelete,
  MdHourglassEmpty,
  MdCancel,
} from "react-icons/md";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading,
  icon = <MdDelete />,
  confirmText = "Eliminar",
  loadingText = "Eliminando...",
  confirmVariant = "btn-danger",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-title-icon">
              <MdWarning />
            </span>
            Confirmar Acción
          </h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <div className="modal-body">
          <div className="confirm-dialog">
            <div className="confirm-icon">{icon}</div>
            <h3 className="confirm-title">{title}</h3>
            <p className="confirm-message">{message}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            <MdCancel /> Cancelar
          </button>
          <button
            className={`btn ${confirmVariant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <MdHourglassEmpty /> {loadingText}
              </>
            ) : (
              <>
                {icon} {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
