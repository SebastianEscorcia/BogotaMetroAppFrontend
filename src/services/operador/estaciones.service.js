import { httpClient } from "../../global/utils/helpers";

export const getEstaciones = () => {
  return httpClient("/estaciones");
};

export const getEstacionById = (id) => {
  return httpClient(`/estaciones/${id}`);
};

export const createEstacion = (estacionData) => {
  return httpClient("/estaciones", {
    method: "POST",
    body: JSON.stringify(estacionData),
  });
};

export const updateEstacion = (id, estacionData) => {
  return httpClient(`/estaciones/${id}`, {
    method: "PUT",
    body: JSON.stringify(estacionData),
  });
};

export const deleteEstacion = (id) => {
  return httpClient(`/estaciones/${id}`, {
    method: "DELETE",
  });
};