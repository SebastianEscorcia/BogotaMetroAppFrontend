import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { FondoPag } from "../../components/common";
import { useAuth } from "../../global/context";
import { pasarSaldo } from "../../services";
import "./passBalance.css";

const MONTOS_RAPIDOS = [5000, 10000, 50000, 100000];

const formatCOP = (value) =>
  Number(value ?? 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

export function PassBalance() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [telefono, setTelefono] = useState("");
  const [valor, setValor] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorValor, setErrorValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'exito'|'error', texto }

  // El número se guarda como "+57 3XXXXXXXXX" en BD
  // El usuario sólo digita los 10 dígitos (3XXXXXXXXX) y nosotros agregamos el prefijo
  const validarTelefono = (tel) => {
    if (!tel) return "El número es requerido.";
    if (!/^3[0-9]{9}$/.test(tel)) return "Debe iniciar en 3 y tener exactamente 10 dígitos.";
    return "";
  };

  const validarValor = (val) => {
    const num = Number(val);
    if (!val) return "El valor es requerido.";
    if (isNaN(num) || num < 1) return "El valor mínimo es $1.";
    if (num > 10_000_000) return "El valor máximo es $10.000.000.";
    if (num > Number(user?.saldo ?? 0)) return "Saldo insuficiente.";
    return "";
  };

  const handleTelefonoChange = (e) => {
    // Solo permitir dígitos
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setTelefono(raw);
    setErrorTelefono(validarTelefono(raw));
  };

  const handleMontoRapido = (monto) => {
    setValor(String(monto));
    setErrorValor(validarValor(monto));
  };

  const handleSubmit = async () => {
    const errTel = validarTelefono(telefono);
    const errVal = validarValor(valor);
    setErrorTelefono(errTel);
    setErrorValor(errVal);
    if (errTel || errVal) return;

    // Construir número en formato guardado en BD: "+57 3XXXXXXXXX"
    const telefonoCompleto = `+57 ${telefono}`;

    setLoading(true);
    setMensaje(null);
    try {
      await pasarSaldo(telefonoCompleto, Number(valor));
      await refreshUser();
      setMensaje({
        tipo: "exito",
        texto: `Transferencia de ${formatCOP(valor)} realizada con éxito.`,
      });
      setTelefono("");
      setValor("");
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: err?.message || "Error al realizar la transferencia. Intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const saldoInsuficiente = Number(valor) > Number(user?.saldo ?? 0);

  return (
    <FondoPag>
      <div className="pass-wrapper">
        {/* HEADER */}
        <header className="pass-header">
          <button className="pass-back-btn" onClick={() => navigate("/homeBalance")}>
            <GoChevronLeft />
          </button>
          <h1 className="pass-title">Pasar saldo</h1>
          <div className="pass-header-spacer" />
        </header>

        <div className="pass-content">

          {/* BANNER SALDO */}
          <div className="pass-saldo-banner">
            <span className="pass-saldo-label">Saldo disponible</span>
            <span className="pass-saldo-value">{formatCOP(user?.saldo)}</span>
          </div>

          {/* FEEDBACK */}
          {mensaje && (
            <div className={`pass-mensaje pass-mensaje--${mensaje.tipo}`}>
              <span className="pass-mensaje-icon">
                {mensaje.tipo === "exito" ? "✓" : "✕"}
              </span>
              {mensaje.texto}
            </div>
          )}

          {/* SECCIÓN: DESTINATARIO */}
          <section className="pass-section">
            <h2 className="pass-section-title">¿A quién le vas a pasar saldo?</h2>

            <div className="pass-field">
              <label className="pass-label" htmlFor="telefono">
                Número de celular
              </label>
              <div className={`pass-tel-input-wrap ${errorTelefono ? "pass-tel-input-wrap--error" : ""}`}>
                <span className="pass-tel-prefix">+57</span>
                <input
                  id="telefono"
                  className="pass-tel-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={telefono}
                  onChange={handleTelefonoChange}
                  placeholder="3XX XXX XXXX"
                  autoComplete="tel"
                />
              </div>
              <p className={`pass-hint ${errorTelefono ? "pass-hint--error" : ""}`}>
                {errorTelefono || "Debe iniciar en 3 y tener 10 dígitosss."}
              </p>
            </div>
          </section>

          {/* SECCIÓN: MONTO */}
          <section className="pass-section">
            <h2 className="pass-section-title">¿Cuánto quieres pasar?</h2>

            {/* Montos rápidos */}
            <div className="pass-quick-amounts">
              {MONTOS_RAPIDOS.map((monto) => (
                <button
                  key={monto}
                  className={`pass-quick-btn ${Number(valor) === monto ? "pass-quick-btn--active" : ""}`}
                  onClick={() => handleMontoRapido(monto)}
                  type="button"
                >
                  {formatCOP(monto)}
                </button>
              ))}
            </div>

            {/* Valor personalizado */}
            <div className="pass-field">
              <label className="pass-label" htmlFor="valor">
                Otro valor
              </label>
              <div className={`pass-amount-input-wrap ${errorValor ? "pass-amount-input-wrap--error" : ""}`}>
                <span className="pass-amount-prefix">$</span>
                <input
                  id="valor"
                  className="pass-amount-input"
                  type="number"
                  min={1000}
                  max={10_000_000}
                  value={valor}
                  onChange={(e) => {
                    setValor(e.target.value);
                    setErrorValor(validarValor(e.target.value));
                  }}
                  placeholder="0"
                />
              </div>
              <p className={`pass-hint ${errorValor ? "pass-hint--error" : ""}`}>
                {errorValor || "Entre $1 y $10.000.000"}
              </p>
            </div>
          </section>

          {/* BOTÓN CONFIRMAR */}
          <button
            className="pass-confirm-btn"
            onClick={handleSubmit}
            disabled={loading || saldoInsuficiente}
            type="button"
          >
            {loading ? (
              <span className="pass-spinner" />
            ) : (
              "Confirmar transferencia"
            )}
          </button>

        </div>
      </div>
    </FondoPag>
  );
}

export default PassBalance;