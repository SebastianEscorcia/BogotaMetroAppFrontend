import { httpClient } from "../../global/utils/helpers";

export const getEstacionesLineas = () => {
  return httpClient("/estaciones-lineas");
};

export const createEstacionLinea = (relationData) => {
  return httpClient("/estaciones-lineas", {
    method: "POST",
    body: JSON.stringify(relationData),
  });
};

export const deleteEstacionLinea = (idLinea, idEstacion) => {
  return httpClient(`/estaciones-lineas/${idLinea}/${idEstacion}`, {
    method: "DELETE",
  });
};