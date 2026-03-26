import { useState } from "react";
import { actualizarPasajero } from "../../services/pasajero/pasajero.service";

export const usePasajero = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getErrorMessage = (err) => {
    if (!err) return "No fue posible actualizar los datos";
    if (typeof err === "string") return err;
    return err.message || err.error || err.detalle || "No fue posible actualizar los datos";
  };

  const updatePasajero = async (datos) => {
    try {
      setLoading(true);
      setError(null);

      const data = await actualizarPasajero(datos);
      return data;

    } catch (err) {
      setError(getErrorMessage(err));
      throw err;

    } finally {
      setLoading(false);
    }
  };

  return { updatePasajero, loading, error };
};
