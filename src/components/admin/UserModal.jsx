import { FiX, FiUser, FiMail, FiPhone, FiLock, FiSave, FiUserPlus, FiEdit2 } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";
import { useRegisterFormUser } from "../../hooks/admin";

/**
 * Componente de modal reutilizable para usuarios (Operadores, Soporte, etc.)
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para enviar el formulario
 * @param {Object} props.user - Usuario a editar (null para crear)
 * @param {string} props.mode - Modo del modal ("create" | "edit")
 * @param {string} props.userType - Tipo de usuario ("Operador" | "Soporte")
 */
export const UserModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user = null, 
  mode = "create",
  userType = "Usuario"
}) => {
  const {
    formData,
    errors,
    loading,
    setLoading,
    handleChange,
    validateForm,
    getSubmitData,
    resetForm,
  } = useRegisterFormUser(user, mode);

  // Configuración según tipo de usuario
  const config = {
    Operador: {
      createTitle: "Registrar Nuevo Operador",
      editTitle: "Editar Operador",
      createButton: "Registrar",
      editButton: "Actualizar",
    },
    Soporte: {
      createTitle: "Registrar Nuevo Soporte",
      editTitle: "Editar Soporte",
      createButton: "Registrar",
      editButton: "Actualizar",
    },
  };

  const currentConfig = config[userType] || config.Operador;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSubmit = getSubmitData();

      if (mode === "edit") {
        await onSubmit(user.id, dataToSubmit);
      } else {
        await onSubmit(dataToSubmit);
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === "edit" ? (
              <>
                <FiEdit2 style={{ marginRight: "0.5rem" }} /> 
                {currentConfig.editTitle}
              </>
            ) : (
              <>
                <FiUserPlus style={{ marginRight: "0.5rem" }} /> 
                {currentConfig.createTitle}
              </>
            )}
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Nombre */}
              <div className="form-group">
                <label className="form-label">
                  <FiUser style={{ marginRight: "0.375rem", verticalAlign: "middle" }} />
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  className="form-input"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  style={errors.nombre ? { borderColor: "#ef4444" } : {}}
                />
                {errors.nombre && (
                  <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.nombre}</span>
                )}
              </div>

              {/* Apellido */}
              <div className="form-group">
                <label className="form-label">
                  <FiUser style={{ marginRight: "0.375rem", verticalAlign: "middle" }} />
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  className="form-input"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  style={errors.apellido ? { borderColor: "#ef4444" } : {}}
                />
                {errors.apellido && (
                  <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.apellido}</span>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
              {/* Tipo Documento */}
              <div className="form-group">
                <label className="form-label">
                  <HiOutlineIdentification style={{ marginRight: "0.375rem", verticalAlign: "middle" }} />
                  Tipo Doc.
                </label>
                <select
                  name="tipoDocumento"
                  className="form-select"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                >
                  <option value="CC">CC</option>
                  <option value="CE">CE</option>
                  <option value="TI">TI</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>

              {/* Documento */}
              <div className="form-group">
                <label className="form-label">Número de Documento *</label>
                <input
                  type="text"
                  name="numDocumento"
                  className="form-input"
                  placeholder="Número de documento"
                  value={formData.numDocumento}
                  onChange={handleChange}
                  style={errors.documento ? { borderColor: "#ef4444" } : {}}
                />
                {errors.documento && (
                  <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.documento}</span>
                )}
              </div>
            </div>

            {/* Correo */}
            <div className="form-group">
              <label className="form-label">
                <FiMail style={{ marginRight: "0.375rem", verticalAlign: "middle" }} />
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                className="form-input"
                placeholder="correo@ejemplo.com"
                value={formData.correo}
                onChange={handleChange}
                style={errors.correo ? { borderColor: "#ef4444" } : {}}
              />
              {errors.correo && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.correo}</span>
              )}
            </div>

            {/* Teléfono */}
            <div className="form-group">
              <label className="form-label">
                <FiPhone style={{ marginRight: "0.375rem", verticalAlign: "middle" }} />
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                className="form-input"
                placeholder="Número de teléfono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label className="form-label">
                <FiLock style={{ marginRight: "0.375rem", verticalAlign: "middle" }} />
                Contraseña {mode === "create" ? "*" : "(dejar vacío para mantener)"}
              </label>
              <input
                type="password"
                name="clave"
                className="form-input"
                placeholder={mode === "edit" ? "Nueva contraseña (opcional)" : "Contraseña"}
                value={formData.clave}
                onChange={handleChange}
                style={errors.clave ? { borderColor: "#ef4444" } : {}}
              />
              {errors.clave && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.clave}</span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                "Guardando..."
              ) : mode === "edit" ? (
                <>
                  <FiSave style={{ marginRight: "0.375rem" }} /> 
                  {currentConfig.editButton}
                </>
              ) : (
                <>
                  <FiUserPlus style={{ marginRight: "0.375rem" }} /> 
                  {currentConfig.createButton}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
