export const httpClient = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(`http://localhost:8080/api${endpoint}`, {
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
