/**
 * Normaliza datos de usuario para la UI
 * Backend → Frontend
 */
export const adaptUserFromBackend = (user) => {
  if (!user) return null;

  const usuario = user.usuario ?? user;

  return {
    id: user.id ?? usuario.idUsuario,
    correo: user.correo ?? usuario.correo,

    nombreCompleto: usuario.nombreCompleto ?? "",
    telefono: usuario.telefono ?? "",
    tipoDocumento: usuario.tipoDocumento ?? "",
    numDocumento: usuario.numDocumento ?? "",

    activo: user.activo,
  };
};

/**
 * Normaliza datos del formulario
 * Prepara datos para enviar (combina nombre + apellido en nombreCompleto)
 * @param {Object} formData - datos enviados desde el frontend
 * Frontend → Backend
 */
export const adaptUserToBackend = (formData) => {
  const {
    nombre,
    apellido,
    //documento,
    ...rest
  } = formData;

  return {
    ...rest,
    nombreCompleto: [nombre, apellido].filter(Boolean).join(" ").trim(),
    //numDocumento: documento, 
  };
};
