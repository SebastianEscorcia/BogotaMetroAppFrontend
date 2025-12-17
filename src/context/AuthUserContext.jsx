import { createContext, useContext, useEffect, useState } from "react";
import { registerPasajero, getMe, loginPasajero } from "../services";

export const AuthUserContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const register = async (data) => {
    await registerPasajero(data);
  };

  const login = async (data) => {
    try {
      const response = await loginPasajero(data);

      localStorage.setItem("token", response.token);
      localStorage.setItem("rol", response.rol);

      setRol(response.rol);
      setIsAuthenticated(true);

      const me = await getMe();
      setUser(me);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setUser(null);
    setRol(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRol = localStorage.getItem("rol");

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((user) => {
        setUser(user);
        setRol(savedRol);
        setIsAuthenticated(true);
      })
      .catch(() => {
        logout();
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthUserContext.Provider
      value={{
        user,
        rol,
        error,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};
