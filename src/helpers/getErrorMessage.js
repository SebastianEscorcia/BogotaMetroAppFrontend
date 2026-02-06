export const getErrorMessage = ({code, message, status},errorMessages) => {
    if(code){
        return errorMessages[code] || message || "Error al procesar la solicitud";
    }
    if(status === undefined){
        return "Error de conexion. Verifique su conexion a internet";
    }
    if (status >=500){
        return "Error del servidor. Intente más tarde.";
    }
    return message || "Error al procesar la solicitud"
}