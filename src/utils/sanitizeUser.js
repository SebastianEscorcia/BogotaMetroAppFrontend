export const sanitizeUser = (userData) => {
    if(!userData) return null;
    return {
        nombreCompleto:userData.nombreCompleto,
        correo:userData.correo,
        saldo:userData.saldo,
        numTarjeta:userData.numTarjetaVirtual,
        id: userData.idUsuario,
    }
}