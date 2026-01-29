import { createContext, useContext, useEffect, useState } from "react";
import { registerPasajero, obtenerDatosPasajero, loginUser, obtenerUserAuth } from "../services";
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
          const me = await obtenerDatosPasajero();
          setUser(me);
          const safeUser = sanitizeUser(me);
          localStorage.setItem("user", JSON.stringify(safeUser));
          break;
        case "ADMIN":
          break;
        case "SOPORTE":
        case "OPERADOR":
          // Para SOPORTE y OPERADOR, obtener datos básicos del usuario
          try {
            const userData = await obtenerUserAuth();
            const userInfo = {
              id: userData.idUsuario || userData.id,
              correo: userData.correo,
              rol: response.rol,
            };
            setUser(userInfo);
            localStorage.setItem("user", JSON.stringify(userInfo));
          } catch (err) {
            console.error("Error al obtener datos del usuario:", err);
          }
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
    const savedUser = localStorage.getItem("user");

    if (!token) {
      setLoading(false);
      return;
    }

    // Si ya hay usuario guardado en localStorage, usarlo
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Usar el rol del usuario guardado si existe, si no usar savedRol
        const userRol = parsedUser.rol || savedRol;
        setRol(userRol);
        // Sincronizar rol en localStorage si viene del user
        if (parsedUser.rol && !savedRol) {
          localStorage.setItem("rol", parsedUser.rol);
        }
        setIsAuthenticated(true);
        setLoading(false);
        return;
      } catch (e) {
        // Si hay error parseando, continuar con la carga normal
      }
    }

    // Si hay rol guardado pero no hay usuario, establecer el rol
    if (savedRol) {
      setRol(savedRol);
      setIsAuthenticated(true);
    }

    // Si el rol es ADMIN, no necesita cargar datos
    if (savedRol === "ADMIN") {
      setRol(savedRol);
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    // Para SOPORTE y OPERADOR: cargar datos básicos
    if (savedRol === "SOPORTE" || savedRol === "OPERADOR") {
      obtenerUserAuth()
        .then((userData) => {
          const userInfo = {
            id: userData.idUsuario || userData.id,
            correo: userData.correo,
            rol: savedRol,
          };
          setUser(userInfo);
          localStorage.setItem("user", JSON.stringify(userInfo));
          setRol(savedRol);
          setIsAuthenticated(true);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
      return;
    }

    // Para PASAJERO: cargar datos completos
    if (savedRol === "PASAJERO") {
      obtenerDatosPasajero()
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
      return;
    }

    setLoading(false);
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
        refreshUser,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};
