import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { FondoPag } from "../../components/common";
import { useAuth } from "../../context/AuthUserContext";
import { usePasajero } from "../../hooks/pasajero/usePasajero";
import "./updatePassengerData.css";

const initialForm = {
  primerNombre: "",
  segundoNombre: "",
  primerApellido: "",
  segundoApellido: "",
  direccion: "",
  fechaNacimiento: "",
};

export function UpdatePassengerData() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { updatePasajero, loading, error } = usePasajero();
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState("");

  const splitNombreCompleto = (nombreCompleto = "") => {
    const partes = nombreCompleto
      .split(" ")
      .map((parte) => parte.trim())
      .filter(Boolean);

    return {
      primerNombre: partes[0] || "",
      segundoNombre: partes[1] || "",
      primerApellido: partes[2] || "",
      segundoApellido: partes.slice(3).join(" ") || "",
    };
  };

  const normalizeDateInput = (value) => {
    if (!value) return "";
    if (typeof value === "string" && value.length >= 10) {
      return value.slice(0, 10);
    }
    return "";
  };

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!user) return;

    const nombres = splitNombreCompleto(user.nombreCompleto);

    setForm({
      ...initialForm,
      ...nombres,
      direccion: user.direccion || "",
      fechaNacimiento: normalizeDateInput(user.fechaNacimiento),
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    const nombreCompleto = [
      form.primerNombre,
      form.segundoNombre,
      form.primerApellido,
      form.segundoApellido,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const payload = {};

    if (nombreCompleto) {
      payload.nombreCompleto = nombreCompleto;
    }

    if (form.direccion?.trim()) {
      payload.direccion = form.direccion.trim();
    }

    if (form.fechaNacimiento) {
      payload.fechaNacimiento = form.fechaNacimiento;
    }

    if (!Object.keys(payload).length) {
      setSuccess("No hay cambios para actualizar.");
      return;
    }

    await updatePasajero(payload);
    await refreshUser();
    setSuccess("Tus datos fueron actualizados correctamente.");
  };

  return (
    <FondoPag>
      <div className="update-passenger-page">
        <header className="update-passenger-header">
          <button
            type="button"
            className="update-passenger-back"
            onClick={() => navigate("/home")}
          >
            <GoArrowLeft />
          </button>
          <h1>Actualizar datos</h1>
          <div className="update-passenger-spacer" />
        </header>

        <div className="update-passenger-content">
          <form className="update-passenger-form" onSubmit={handleSubmit}>
            {/* Nombres en fila */}
            <div className="update-passenger-row">
              <div className="update-passenger-field">
                <label className="update-passenger-label">Primer nombre</label>
                <input
                  type="text"
                  name="primerNombre"
                  placeholder="Ej: Juan"
                  value={form.primerNombre}
                  onChange={handleChange}
                />
              </div>
              <div className="update-passenger-field">
                <label className="update-passenger-label">Segundo nombre</label>
                <input
                  type="text"
                  name="segundoNombre"
                  placeholder="Opcional"
                  value={form.segundoNombre}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Apellidos en fila */}
            <div className="update-passenger-row">
              <div className="update-passenger-field">
                <label className="update-passenger-label">
                  Primer apellido
                </label>
                <input
                  type="text"
                  name="primerApellido"
                  placeholder="Ej: Pérez"
                  value={form.primerApellido}
                  onChange={handleChange}
                />
              </div>
              <div className="update-passenger-field">
                <label className="update-passenger-label">
                  Segundo apellido
                </label>
                <input
                  type="text"
                  name="segundoApellido"
                  placeholder="Opcional"
                  value={form.segundoApellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="update-passenger-divider" />

            {/* Dirección */}
            <div className="update-passenger-field">
              <label className="update-passenger-label">Dirección</label>
              <input
                type="text"
                name="direccion"
                placeholder="Ej: Cra 7 # 32-16"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>

            {/* Fecha */}
            <div className="update-passenger-field">
              <label className="update-passenger-label">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
              />
            </div>

            {/* Feedback */}
            {error && (
              <div className="update-passenger-feedback update-passenger-error">
                <span className="update-passenger-feedback-icon">✕</span>
                {error}
              </div>
            )}
            {success && (
              <div className="update-passenger-feedback update-passenger-success">
                <span className="update-passenger-feedback-icon">✓</span>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="update-passenger-submit"
            >
              {loading ? (
                <>
                  <span className="update-passenger-spinner" /> Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </form>
        </div>
      </div>
    </FondoPag>
  );
}

export default UpdatePassengerData;
