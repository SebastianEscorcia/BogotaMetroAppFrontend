import { httpClient } from "../../helpers";

export const requestPasswordChange = (data) => {
  return httpClient("/auth/recuperar-clave", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const passwordChange = (data) => {
  return httpClient("/auth/cambiar-clave", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
