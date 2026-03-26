import { useState, useEffect, useCallback } from "react";
import { validateEmail, validatePassword } from "../../helpers";
import { adaptUserToBackend } from "../../adapters/userAdapter";
const initialFormData = {
  nombre: "",
  apellido: "",
  tipoDocumento: "CC",
  numDocumento: "",
  correo: "",
  telefono: "",
  clave: "",
};

/**
 * Hook para manejar el formulario de usuario al sistema por el admin
 * Reutilizable para crear y editar usuario al sistema por el admin
 */
export const useRegisterFormUser = (userRol = null, mode = "create") => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Resetear o cargar datos cuando cambia el usuario  o el modo
  useEffect(() => {
    if (userRol && mode === "edit") {
      
      let nombre = userRol.nombre || "";
      let apellido = userRol.apellido || "";

      if (userRol.nombreCompleto && !userRol.nombre) {
        const partes = userRol.nombreCompleto.trim().split(" ");
        nombre = partes[0] || "";
        apellido = partes.slice(1).join(" ") || "";
      }
      console.log( "objeto desde el USE EFFECT DEl userRegisterForm", {
        nombre,
        apellido,
        tipoDocumento: userRol.tipoDocumento || "CC",
        numDocumento: userRol.numDocumento || "",
        correo: userRol.correo || "",
        telefono: userRol.telefono || "",
        activo: userRol.activo,
      });

      setFormData({
        nombre,
        apellido,
        tipoDocumento: userRol.tipoDocumento || "CC",
        numDocumento: userRol.numDocumento || "",
        correo: userRol.correo || "",
        telefono: userRol.telefono || "",
        clave: "",
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [userRol, mode]);

  // Manejar cambios en los campos
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    setErrors((prev) => {
      if (prev[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  // Validar formulario
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }

    if (!formData.numDocumento.trim()) {
      newErrors.documento = "El documento es requerido";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = "El correo no es válido";
    }

    // La contraseña solo es requerida al crear
    if (mode === "create") {
      if (!formData.clave.trim()) {
        newErrors.clave = "La contraseña es requerida";
      } else if (!validatePassword(formData.clave)) {
        newErrors.clave =
          "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo";
      }
    } else if (formData.clave && !validatePassword(formData.clave)) {
      // En edición, solo validar si se proporciona una nueva contraseña
      newErrors.clave =
        "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, mode]);

  const getSubmitData = useCallback(() => {
    if (mode === "edit" && !dataToSubmit.clave) {
      delete dataToSubmit.clave;
    }
    console.log("Creación del usuario desde el useRegisterFormUser");
    console.log(formData);
    
    return adaptUserToBackend(formData);
  }, [formData, mode]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setLoading(false);
  }, []);

  // Setear un error específico
  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  return {
    formData,
    errors,
    loading,
    setLoading,
    handleChange,
    validateForm,
    getSubmitData,
    resetForm,
    setFieldError,
    setFormData,
  };
};
