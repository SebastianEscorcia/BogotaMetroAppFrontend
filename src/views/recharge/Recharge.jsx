import { useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import {
  MdPayment,
  MdCheckCircle,
  MdArrowForward,
  MdArrowBack,
  MdAccountBalanceWallet,
  MdReceipt,
  MdCreditCard,
  MdAccountBalance,
  MdPhoneAndroid,
  MdAttachMoney,
  MdSwapHoriz,
} from "react-icons/md";
import { FondoPag } from "../../components/common";
import { useAuth } from "../../context/AuthUserContext";
import { useRecarga } from "../../hooks/pasajero/useRecarga";
import { formatCurrency, formatFecha } from "../../adapters/transaccionAdapter";

import "./recharge.css";

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000];

const MEDIOS_PAGO = [
  { value: "TARJETA_CREDITO", label: "Tarjeta de Crédito", icon: <MdCreditCard color="#1565c0" /> },
  { value: "TARJETA_DEBITO", label: "Tarjeta de Débito", icon: <MdCreditCard color="#e65100" /> },
  { value: "PSE", label: "PSE", icon: <MdAccountBalance color="#00695c" /> },
  { value: "NEQUI", label: "Nequi", icon: <MdPhoneAndroid color="#e91e63" /> },
  { value: "DAVIPLATA", label: "Daviplata", icon: <MdPhoneAndroid color="#d32f2f" /> },
  { value: "EFECTIVO", label: "Efectivo", icon: <MdAttachMoney color="#2e7d32" /> },
  { value: "TRANSFERENCIA", label: "Transferencia", icon: <MdSwapHoriz color="#6a1b9a" /> },
];

export function Recharge() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const {
    step,
    formData,
    loading,
    error,
    resultado,
    updateField,
    selectQuickAmount,
    irAConfirmar,
    volverAFormulario,
    confirmarRecarga,
    nuevaRecarga,
    STEPS,
  } = useRecarga(refreshUser);

  const medioPagoSeleccionado = MEDIOS_PAGO.find(
    (m) => m.value === formData.medioDePago
  );

  return (
    <FondoPag>
      <div className="recharge-page">
        {/* ─── HEADER ─── */}
        <header className="recharge-header">
          <button
            className="recharge-btn-back"
            onClick={() =>
              step === STEPS.CONFIRM ? volverAFormulario() : navigate("/homeBalance")
            }
          >
            <GoChevronLeft />
          </button>
          <h2>
            {step === STEPS.SUCCESS ? "¡Recarga exitosa!" : "Recarga tu saldo"}
          </h2>
          <div className="recharge-header-spacer" />
        </header>

        {/* ─── PROGRESS STEPS ─── */}
        {step !== STEPS.SUCCESS && (
          <div className="recharge-steps">
            <div className={`step-dot ${step === STEPS.FORM ? "active" : "done"}`}>
              <span>1</span>
            </div>
            <div className={`step-line ${step === STEPS.CONFIRM ? "active" : ""}`} />
            <div className={`step-dot ${step === STEPS.CONFIRM ? "active" : ""}`}>
              <span>2</span>
            </div>
          </div>
        )}

        <main className="recharge-contenido">
          {/* ═══════════════ PASO 1: FORMULARIO ═══════════════ */}
          {step === STEPS.FORM && (
            <div className="recharge-card fade-in">
              {/* Saldo actual */}
              <div className="recharge-saldo-card">
                <MdAccountBalanceWallet className="saldo-icon" />
                <div>
                  <span className="saldo-label">Saldo actual</span>
                  <p className="saldo-valor">
                    {formatCurrency(user?.saldo || 0)}
                  </p>
                </div>
              </div>

              {/* Monto */}
              <div className="recharge-field">
                <label>¿Cuánto deseas recargar?</label>
                <div className="recharge-input-wrapper">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    placeholder="1.000"
                    min="1000"
                    max="500000"
                    value={formData.valorPagado}
                    onChange={(e) => updateField("valorPagado", e.target.value)}
                  />
                </div>
                <span className="recharge-hint">Mínimo $1.000 — Máximo $500.000</span>
              </div>

              {/* Montos rápidos */}
              <div className="quick-amounts">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`quick-amount-btn ${
                      Number(formData.valorPagado) === amount ? "selected" : ""
                    }`}
                    onClick={() => selectQuickAmount(amount)}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>

              {/* Medio de pago */}
              <div className="recharge-field">
                <label>
                  <MdPayment style={{ verticalAlign: "middle", marginRight: 6 }} />
                  Medio de pago
                </label>
                <div className="medios-pago-grid">
                  {MEDIOS_PAGO.map((medio) => (
                    <button
                      key={medio.value}
                      type="button"
                      className={`medio-pago-btn ${
                        formData.medioDePago === medio.value ? "selected" : ""
                      }`}
                      onClick={() => updateField("medioDePago", medio.value)}
                    >
                      <span className="medio-icon">{medio.icon}</span>
                      <span className="medio-label">{medio.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && <div className="recharge-error">{error}</div>}

              {/* Botón continuar */}
              <button
                type="button"
                className="recharge-btn-primary"
                onClick={irAConfirmar}
              >
                Continuar
                <MdArrowForward />
              </button>
            </div>
          )}

          {/* ═══════════════ PASO 2: CONFIRMACIÓN ═══════════════ */}
          {step === STEPS.CONFIRM && (
            <div className="recharge-card fade-in">
              <h3 className="confirm-title">Confirma tu recarga</h3>

              <div className="confirm-summary">
                <div className="confirm-amount">
                  {formatCurrency(formData.valorPagado)}
                </div>

                <div className="confirm-details">
                  <div className="confirm-row">
                    <span>Medio de pago</span>
                    <strong>
                      {medioPagoSeleccionado?.icon}{" "}
                      {medioPagoSeleccionado?.label}
                    </strong>
                  </div>
                  <div className="confirm-row">
                    <span>Moneda</span>
                    <strong>{formData.moneda}</strong>
                  </div>
                  <div className="confirm-row">
                    <span>Saldo actual</span>
                    <strong>{formatCurrency(user?.saldo || 0)}</strong>
                  </div>
                  <div className="confirm-row highlight">
                    <span>Nuevo saldo estimado</span>
                    <strong>
                      {formatCurrency(
                        (Number(user?.saldo) || 0) +
                          Number(formData.valorPagado)
                      )}
                    </strong>
                  </div>
                </div>
              </div>

              {error && <div className="recharge-error">{error}</div>}

              <div className="confirm-actions">
                <button
                  type="button"
                  className="recharge-btn-secondary"
                  onClick={volverAFormulario}
                  disabled={loading}
                >
                  <MdArrowBack />
                  Editar
                </button>
                <button
                  type="button"
                  className="recharge-btn-primary"
                  onClick={confirmarRecarga}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-spinner" />
                  ) : (
                    <>
                      Confirmar Recarga
                      <MdCheckCircle />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════ PASO 3: ÉXITO ═══════════════ */}
          {step === STEPS.SUCCESS && (
            <div className="recharge-card recharge-success fade-in">
              <div className="success-icon-wrapper">
                <MdCheckCircle className="success-icon" />
              </div>

              <h3 className="success-title">¡Recarga realizada!</h3>
              <p className="success-amount">
                {formatCurrency(resultado?.valorPagado || formData.valorPagado)}
              </p>

              {resultado && (
                <div className="success-details">
                  <div className="success-row">
                    <MdReceipt />
                    <span>ID Transacción: #{resultado.id}</span>
                  </div>
                  <div className="success-row">
                    <MdPayment />
                    <span>
                      {medioPagoSeleccionado?.label || resultado.medioDePago}
                    </span>
                  </div>
                  {resultado.fechaPago && (
                    <div className="success-row">
                      <span>📅 {formatFecha(resultado.fechaPago)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="success-saldo-nuevo">
                <span>Tu nuevo saldo</span>
                <p>{formatCurrency(user?.saldo || 0)}</p>
              </div>

              <div className="success-actions">
                <button
                  type="button"
                  className="recharge-btn-primary"
                  onClick={nuevaRecarga}
                >
                  Nueva recarga
                </button>
                <button
                  type="button"
                  className="recharge-btn-secondary"
                  onClick={() => navigate("/homeBalance")}
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </FondoPag>
  );
}

export default Recharge;
