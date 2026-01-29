import { httpClient } from "../../helpers";
export const loginUser = (data) => {
  return httpClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const obtenerUserAuth  = () => httpClient("/auth/usuario/me");