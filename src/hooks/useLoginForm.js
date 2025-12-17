import { useState } from "react";

import { validateEmail, validatePassword } from "../helpers";

export const useLoginForms = (handleLogin) => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const [error, setError] = useState(null);
  const handleCorreoChange = ({ target }) => {
    setCorreo(target.value);
  };

  const handleClaveChange = ({ target }) => {
    setClave((claveV) => (claveV = target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanCorreo = correo.trim();
    const cleanClave = clave.trim();
    try {
      if (!validateEmail(cleanCorreo)) {
        setError("El formato del correo es incorrecto ");
        return;
      }
      if (!validatePassword(cleanClave)) {
        setError(
          "La contraseña  debe llevar como mínimo una Mayúscula, minúscula, un número, caracter especial y 8 dígitos"
        );
        return;
      }
      await handleLogin({
        correo,
        clave,
      });
      setError(null);
      setCorreo("");
      setClave("");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return {
    correo,
    clave,
    error,
    handleCorreoChange,
    handleClaveChange,
    handleSubmit,
  };
};
