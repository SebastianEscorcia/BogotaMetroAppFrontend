import { httpClient } from "../../global/utils/helpers";

export const getInterrupciones = () => {
  return httpClient("/interrupciones");
};

export const createInterrupcion = (interrupcionData) => {
  return httpClient("/interrupciones", {
    method: "POST",
    body: JSON.stringify(interrupcionData),
  });
};

export const updateInterrupcion = (id, interrupcionData) => {
  return httpClient(`/interrupciones/${id}`, {
    method: "PUT",
    body: JSON.stringify(interrupcionData),
  });
};

export const deleteInterrupcion = (id) => {
  return httpClient(`/interrupciones/${id}`, {
    method: "DELETE",
  });
};

export const solveInterrupcion = (id) => {
  return httpClient(`/interrupciones/${id}/solucionar`, {
    method: "PATCH",
  });
};