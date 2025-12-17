import {httpClient} from '../../helpers'
export const registerPasajero = async (data) => {
  const response = await fetch(`${API_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if(!response.ok){
    const error = await response.text();
    throw new Error(error || "Error al registrar el pasajero");
    
  }
  return response.json();
};

export const getMe = async (token) => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No autorizado");
  }

  return response.json();
};
