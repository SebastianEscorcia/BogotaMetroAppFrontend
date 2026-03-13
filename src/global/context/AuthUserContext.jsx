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
  logoutUser,
} from "../../services";
import { sanitizeUser } from "../utils/helpers/sanitizeUser";

const getRolFromUser = (userData) => {
  if (!userData) return null;
  return userData.rol?.nombre || userData.rol || userData.role || null;
};

const normalizeRole = (value) => {
  if (!value) return null;
  const role = String(value).toUpperCase().trim();
  return role.startsWith("ROLE_") ? role.replace("ROLE_", "") : role;
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
  const [rol, setRol] = useState(() => normalizeRole(getRolFromUser(user)));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const clearUserSession = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    setRol(null);
    setIsAuthenticated(false);
  }, []);

  const saveUserSession = (role, userData) => {
    const normalizedRole = normalizeRole(role);
    if (normalizedRole) {
      setRol(normalizedRole);
    }
    const currentRole = normalizedRole;
    const userWithRole = currentRole ? { ...userData, rol: currentRole } : userData;
    localStorage.setItem("user", JSON.stringify(userWithRole));
    setUser(userWithRole);
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
      clearUserSession();
    }
  }, [clearUserSession]);

  const register = async (data) => {
    await registerPasajero(data);
  };

  const login = async (data) => {
    try {
      const response = await loginUser(data);
      const currentRol = normalizeRole(response?.rol || response?.role || null);

      if (currentRol) {
        setRol(currentRol);
      }
      setIsAuthenticated(true);

      if (currentRol) {
        await fetchUserProfile(currentRol);
      } else {
        const userData = await obtenerUserAuth();
        const roleFromUser = normalizeRole(getRolFromUser(userData) || localStorage.getItem("rol"));
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

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("No se pudo invalidar sesión en backend:", err);
    } finally {
      clearUserSession();
    }
  }, [clearUserSession]);

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
      let roleFromSavedUser = null;

      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          roleFromSavedUser = normalizeRole(getRolFromUser(parsed));
          setUser(parsed);
          setRol(roleFromSavedUser);
          setIsAuthenticated(true);
        } catch {
          clearUserSession();
          setLoading(false);
          return;
        }
      }

      const currentRol = roleFromSavedUser;

      if (currentRol) {
        await fetchUserProfile(currentRol);
      } else {
        try {
          const userData = await obtenerUserAuth();
          const roleFromUserData = normalizeRole(getRolFromUser(userData));
          if (userData) {
            saveUserSession(roleFromUserData, userData);
          }
        } catch {
          clearUserSession();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [clearUserSession, fetchUserProfile]);

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
