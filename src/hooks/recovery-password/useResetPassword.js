import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { passwordChange } from "../../services";
import { useNavigateTo } from "../useNavigateTo";
import { errorMessagesRecoverPassword } from "../../constants";
import { getErrorMessage } from "../../helpers";
export const useResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { goTo } = useNavigateTo();

  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNuevaClaveChange = (e) => {
    setNuevaClave(e.target.value);
    setError("");
  };

  const handleConfirmarClaveChange = (e) => {
    setConfirmarClave(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (nuevaClave !== confirmarClave) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (nuevaClave.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await passwordChange({ token, nuevaClave });
      setSuccess(response.mensaje);
      setTimeout(() => goTo("/login"), 2000);
    } catch (err) {
      const errorMessage = getErrorMessage(err, errorMessagesRecoverPassword);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    nuevaClave,
    confirmarClave,
    error,
    success,
    loading,
    handleNuevaClaveChange,
    handleConfirmarClaveChange,
    handleSubmit,
  };
};
