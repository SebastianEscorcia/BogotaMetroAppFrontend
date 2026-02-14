import { useState, useCallback } from "react";
import { registrarRecarga } from "../../services/pasajero/recarga.service";

const STEPS = { FORM: "FORM", CONFIRM: "CONFIRM", SUCCESS: "SUCCESS" };

/**
 * Hook para gestionar el flujo de recarga del pasajero.
 * Maneja 3 pasos: formulario → confirmación → éxito.
 */
export const useRecarga = (refreshUser) => {
  const [step, setStep] = useState(STEPS.FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);

  const [formData, setFormData] = useState({
    valorPagado: "",
    medioDePago: "",
    moneda: "COP",
  });

  /** Actualiza un campo del formulario */
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  /** Selecciona un monto rápido */
  const selectQuickAmount = useCallback((amount) => {
    setFormData((prev) => ({ ...prev, valorPagado: amount }));
    setError(null);
  }, []);

  /** Valida el formulario antes de pasar a confirmación */
  const validarFormulario = useCallback(() => {
    const valor = Number(formData.valorPagado);
    if (!formData.valorPagado || isNaN(valor) || valor < 1000) {
      return "La recarga mínima es de $1.000";
    }
    if (valor > 500000) {
      return "La recarga máxima es de $500.000";
    }
    if (!formData.medioDePago) {
      return "Selecciona un medio de pago";
    }
    return null;
  }, [formData]);

  /** Pasa al paso de confirmación */
  const irAConfirmar = useCallback(() => {
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return false;
    }
    setStep(STEPS.CONFIRM);
    return true;
  }, [validarFormulario]);

  /** Vuelve al formulario desde confirmación */
  const volverAFormulario = useCallback(() => {
    setStep(STEPS.FORM);
    setError(null);
  }, []);

  /** Ejecuta la recarga contra el backend */
  const confirmarRecarga = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        valorPagado: Number(formData.valorPagado),
        moneda: formData.moneda,
        medioDePago: formData.medioDePago,
      };

      const response = await registrarRecarga(payload);
      setResultado(response);
      setStep(STEPS.SUCCESS);

      // Refrescar datos del usuario para actualizar saldo
      if (refreshUser) {
        try {
          await refreshUser();
        } catch {
          // Silenciar error de refresh, la recarga ya fue exitosa
        }
      }
    } catch (err) {
      const mensaje =
        err?.message || err?.error || "Error al procesar la recarga. Intenta de nuevo.";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }, [formData, refreshUser]);

  /** Reinicia todo el flujo */
  const nuevaRecarga = useCallback(() => {
    setStep(STEPS.FORM);
    setFormData({ valorPagado: "", medioDePago: "", moneda: "COP" });
    setResultado(null);
    setError(null);
  }, []);

  return {
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
  };
};
