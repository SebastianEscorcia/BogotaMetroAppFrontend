
const API_BASE_URL = import.meta.env.VITE_API_URL ;

export const httpClient = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers,
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
