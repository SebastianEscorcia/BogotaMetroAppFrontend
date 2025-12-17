export const httpClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:8080/api${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");

  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw {
      status: response.status,
      ...data,
    };
  }

  return data;
};
