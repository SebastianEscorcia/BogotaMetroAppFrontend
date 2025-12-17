const BASE_URL = "http://localhost:8080/api";

export const httpClient = async (
  endpoint,
  { method = "GET", body, headers = {} } = {}
) => {
  const token = localStorage.getItem("token");

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // ejemplo: token inválido o expirado
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error en la petición");
  }

  return response.json();
};
