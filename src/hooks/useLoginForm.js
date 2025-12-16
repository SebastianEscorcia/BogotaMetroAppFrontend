import { useState } from "react";

import { validateEmail, validatePassword } from "../helpers";

export const useLoginForms = (onSubmit) => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const [error, SetError] = useState(null);
  const handleCorreoChange = ({ target }) => {
    setCorreo(target.value);
  };

  const handleClaveChange = ({ target }) => {
    setClave((claveV) => (claveV = target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanCorreo = correo.trim();
    const cleanClave = clave.trim();

    if (!validateEmail(cleanCorreo)) {
      SetError("El formato del correo es incorrecto ");
      return;
    }
    if (!validatePassword(cleanClave)) {
      SetError("La contraseña  debe llevar como mínimo una Mayúscula, minúscula, un número, caracter especial y 8 dígitos");
      return;
    }

    SetError(null);
    onSubmit(cleanCorreo, cleanClave);
    setCorreo("");
    setClave("");
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
