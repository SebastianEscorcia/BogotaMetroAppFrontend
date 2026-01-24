import { createContext, useContext, useEffect, useState } from "react";
import { registerPasajero, getMe, loginUser } from "../services";
import { sanitizeUser } from "../utils/sanitizeUser";
export const AuthUserContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const [rol, setRol] = useState(() => {
    return localStorage.getItem("rol");
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const register = async (data) => {
    await registerPasajero(data);
  };

  const login = async (data) => {
    try {
      const response = await loginUser(data);

      localStorage.setItem("token", response.token);
      localStorage.setItem("rol", response.rol);
      
      setRol(response.rol);
      setIsAuthenticated(true);

      switch (response.rol) {
        case "PASAJERO":
          const me = await getMe();
          setUser(me);
          const safeUser = sanitizeUser(me);
          localStorage.setItem("user", JSON.stringify(safeUser));
          break;
        case "ADMIN":
          break;
        default:
          break;
      }
      
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("user");
    setUser(null);
    setRol(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const me = await getMe();
      const safeUser = sanitizeUser(me);
      setUser(safeUser);
      localStorage.setItem("user", JSON.stringify(safeUser));
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRol = localStorage.getItem("rol");

    if (!token) {
      setLoading(false);
      return;
    }

    // Si ya hay usuario o el rol no necesita cargar datos de usuario, solo actualizar estado
    if (
      user ||
      savedRol === "ADMIN" ||
      savedRol === "OPERADOR" ||
      savedRol === "SOPORTE"
    ) {
      setRol(savedRol);
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    // Solo para PASAJERO: cargar datos del usuario
    if (savedRol === "PASAJERO") {
      getMe()
        .then((userData) => {
          const safeUser = sanitizeUser(userData);
          setUser(safeUser);
          localStorage.setItem("user", JSON.stringify(safeUser));
          setRol(savedRol);
          setIsAuthenticated(true);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

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
        refreshUser,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};
