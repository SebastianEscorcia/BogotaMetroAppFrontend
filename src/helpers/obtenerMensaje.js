export const esCierreSesion = (contenioMensaje=[]) =>{

    ["cerrada", "finalizada", "expira", "inactividad", "timeout"].some(p=>{
        contenioMensaje.includes(p);
    })
}

export const esAsignacionSoporte = (contenido = "") =>
  ["unido", "asignado"].some(p => contenido.includes(p));

export const limpiarSoporte = (setSesionInfo = Function) => {
  setSesionInfo(prev =>
    prev
      ? {
          ...prev,
          participantes: prev.participantes?.filter(
            p => p.rol !== "SOPORTE"
          ),
        }
      : null
  );
};