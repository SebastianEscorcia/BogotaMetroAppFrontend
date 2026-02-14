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

const getRolFromUser = (userData) => {
  if (!userData) return null;
  return userData.rol?.nombre || userData.rol || userData.role || null;
};

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

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("user"));
  const [rol, setRol] = useState(() => getRolFromUser(user));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const saveUserSession = (role, userData) => {
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
        saveUserSession(currentRol, userData);
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
      const currentRol = response?.rol || response?.role || null;

      if (currentRol) {
        setRol(currentRol);
      }
      setIsAuthenticated(true);

      if (currentRol) {
        await fetchUserProfile(currentRol);
      } else {
        const userData = await obtenerUserAuth();
        const roleFromUser = getRolFromUser(userData);
        if (userData) {
          saveUserSession(roleFromUser, userData);
        }
      }

      return currentRol;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setRol(null);
    setIsAuthenticated(false);
  };

  /**
   * Refresca los datos del usuario autenticado (ej. tras una recarga de saldo).
   */
  const refreshUser = useCallback(async () => {
    if (rol) {
      await fetchUserProfile(rol);
    }
  }, [rol, fetchUserProfile]);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRol(getRolFromUser(parsed));
        setIsAuthenticated(true);
      }

      try {
        const userData = await obtenerUserAuth();
        const currentRol = getRolFromUser(userData);
        if (userData) {
          saveUserSession(currentRol, userData);
        }
      } catch {
        if (!savedUser) {
          setIsAuthenticated(false);
          setRol(null);
          setUser(null);
        }
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
        refreshUser,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};
