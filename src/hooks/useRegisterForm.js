import { useState } from "react";
import { validateEmail, validatePassword } from "../helpers";

export const useRegisterForm = (onSubmit) => {
  const [nombres, setNombres] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
  });

  const [telefonoData, setTelefonoData] = useState({
    indicativo: "+57",
    numero: "",
  });

  // Estados simples
  const [formData, setFormData] = useState({
    correo: "",
    clave: "",
    tipoDocumento: "CC",
    numDocumento: "",
    fechaNacimiento: "",
    direccion: "",
  });

  const [error, setError] = useState(null);

  const handleNombresChange = (e) => {
    const { name, value } = e.target;
    
    setNombres((prev) => ({ ...prev, [name]: value }));
  };

  const handleTelefonoChange = (e) => {
    const { name, value } = e.target;
    setTelefonoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.correo)) {
      setError("El formato del correo es incorrecto");
      return;
    }
    if (!validatePassword(formData.clave)) {
      setError("La contraseña debe ser segura (min 8 caracteres, mayúscula, minúscula, número, símbolo)");
      return;
    }
    if (!nombres.primerNombre || !nombres.primerApellido) {
      setError("El primer nombre y primer apellido son obligatorios");
      return;
    }
    if (!telefonoData.numero) {
      setError("El número de teléfono es obligatorio");
      return;
    }

    const nombreCompleto = [
      nombres.primerNombre,
      nombres.segundoNombre,
      nombres.primerApellido,
      nombres.segundoApellido
    ].filter(Boolean).join(" ");

    const telefonoFinal = `${telefonoData.indicativo} ${telefonoData.numero}`;

    const dataToSend = {
      ...formData,
      nombreCompleto,
      telefono: telefonoFinal,
    };

    setError(null);
    onSubmit(dataToSend);
  };

  return {
    ...formData,
    nombres,
    telefonoData,
    error,
    handleNombresChange,
    handleTelefonoChange,
    handleChange,
    handleSubmit,
  };
};
