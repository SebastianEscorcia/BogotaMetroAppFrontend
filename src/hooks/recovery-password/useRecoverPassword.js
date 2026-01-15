import { useState } from "react";
import { requestPasswordChange } from "../../services";
import { getErrorMessage } from "../../helpers";
import { errorMessagesRecoverPassword } from "../../constants";
export const useRecoverPassword = () => {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCorreoChange = (e) => {
    setCorreo(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await requestPasswordChange({ correo });
      setSuccess(
        response.mensaje ||
          "Si el correo existe, recibirás un enlace de recuperación."
      );
      setCorreo("");
    } catch (err) {
      const errorMessage = getErrorMessage(err, errorMessagesRecoverPassword);

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    correo,
    error,
    success,
    loading,
    handleCorreoChange,
    handleSubmit,
  };
};
