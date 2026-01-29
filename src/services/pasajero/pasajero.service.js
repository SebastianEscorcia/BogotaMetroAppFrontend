import { httpClient } from "../../helpers";
export const registerPasajero = (data) => {
  return httpClient("/pasajero/registro", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const obtenerDatosPasajero =  () => {
  return httpClient("/pasajero/me");
};

