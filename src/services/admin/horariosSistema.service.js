import { httpClient } from "../../global/utils/helpers";

export const getHorariosSistema = () => {
  return httpClient("/horarios-sistema");
};

export const getHorarioSistemaPorDia = (dia) => {
  return httpClient(`/horarios-sistema/dia/${encodeURIComponent(dia)}`);
};

export const createHorarioSistema = (horarioData) => {
  return httpClient("/horarios-sistema", {
    method: "POST",
    body: JSON.stringify(horarioData),
  });
};

export const updateHorarioSistema = (id, horarioData) => {
  return httpClient(`/horarios-sistema/${id}`, {
    method: "PUT",
    body: JSON.stringify(horarioData),
  });
};

export const deleteHorarioSistema = (id) => {
  return httpClient(`/horarios-sistema/${id}`, {
    method: "DELETE",
  });
};