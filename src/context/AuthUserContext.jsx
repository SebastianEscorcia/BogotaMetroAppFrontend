import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  registerPasajero,
  obtenerDatosPasajero,
  loginUser,
  obtenerUserAuth,
} from "../services";
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

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token"),
  );
  const [rol, setRol] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const saveUserSession = (token, role, userData) => {
    if (token) localStorage.setItem("token", token);
    if (role) {
      setRol(role);
    }

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   *  Función Centralizada: Obtener perfil según el rol
   * Usamos useCallback para poder usarla en el useEffect sin warnings
   *  */
  const fetchUserProfile = useCallback(async (currentRol) => {
    try {
      let userData = null;

      switch (currentRol) {
        case "PASAJERO":
          userData = sanitizeUser(await obtenerDatosPasajero());
          break;
        case "SOPORTE":
        case "OPERADOR":
          userData = await obtenerUserAuth();
          break;
        case "ADMIN":
          break;
        default:
          break;
      }

      if (userData) {
        saveUserSession(null, currentRol, userData);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      logout();
    }
  }, []);

  const register = async (data) => {
    await registerPasajero(data);
  };

  const login = async (data) => {
    try {
      const response = await loginUser(data);

      localStorage.setItem("token", response.token);
      setRol(response.rol);
      setIsAuthenticated(true);

      await fetchUserProfile(response.rol);

      return response.rol;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setRol(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }


      setLoading(false);
    };

    initAuth();
  }, [fetchUserProfile]);

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
