import { httpClient } from "../../global/utils/helpers";

export const getLineas = () => {
  return httpClient("/lineas");
};

export const getLineaById = (id) => {
  return httpClient(`/lineas/${id}`);
};

export const createLinea = (lineaData) => {
  return httpClient("/lineas", {
    method: "POST",
    body: JSON.stringify(lineaData),
  });
};

export const updateLinea = (id, lineaData) => {
  return httpClient(`/lineas/${id}`, {
    method: "PUT",
    body: JSON.stringify(lineaData),
  });
};

export const deleteLinea = (id) => {
  return httpClient(`/lineas/${id}`, {
    method: "DELETE",
  });
};