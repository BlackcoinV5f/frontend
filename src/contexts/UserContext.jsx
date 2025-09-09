// src/contexts/UserContext.jsx
import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  /** ========================
   * AXIOS CONFIG
   * ======================== */
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      withCredentials: true, // 🔑 cookies envoyés automatiquement
      timeout: 10000,
    });
  }, [API_URL]);

  /** ========================
   * STATES
   * ======================== */
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** ========================
   * HELPERS
   * ======================== */
  const persistUserData = useCallback((userData) => {
    if (!userData) return;
    const normalizedUser = {
      ...userData,
      is_verified: Boolean(userData.is_verified),
      has_completed_welcome_tasks: Boolean(
        userData.has_completed_welcome_tasks
      ),
      id: Number(userData.id),
    };
    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  }, []);

  /** ========================
   * LOGOUT
   * ======================== */
  const logoutUser = useCallback(
    async (redirect = true) => {
      try {
        await axiosInstance.post("/auth/logout");
      } catch (err) {
        console.warn(
          "⚠ Erreur logout backend:",
          err.response?.data || err.message
        );
      }

      setUser(null);
      setError(null);
      localStorage.removeItem("user");
      localStorage.removeItem("pendingUser");

      if (redirect) {
        navigate("/login", { replace: true });
      }
    },
    [axiosInstance, navigate]
  );

  /** ========================
   * AUTH STATE MEMOIZED
   * ======================== */
  const authState = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isEmailVerified: Boolean(user?.is_verified),
      hasCompletedWelcomeTasks: Boolean(user?.has_completed_welcome_tasks),
      isProfileComplete: Boolean(
        user?.first_name &&
          user?.last_name &&
          user?.username &&
          user?.email &&
          user?.phone &&
          user?.avatar_url
      ),
    }),
    [user]
  );

  /** ========================
   * API CALLS
   * ======================== */
  const fetchUserProfile = useCallback(
    async (options = {}) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.get("/auth/me", {
          ...options, // ✅ permet d’ajouter { signal, headers, etc. }
        });

        if (!data?.user?.id) {
          console.error("❌ Profil utilisateur non trouvé dans la réponse");
          return null;
        }

        persistUserData(data.user);
        return data.user;
      } catch (err) {
        const msg =
          err.response?.data?.detail || "Impossible de récupérer le profil";
        console.error(
          "❌ Erreur fetchUserProfile :",
          err.response?.data || err.message
        );
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [axiosInstance, persistUserData]
  );

  const loginUser = useCallback(
    async (credentials) => {
      setLoading(true);
      setError(null);
      try {
        await axiosInstance.post("/auth/login", credentials);
        return await fetchUserProfile();
      } catch (err) {
        const msg = err.response?.data?.detail || "Échec de la connexion";
        console.error(
          "❌ Erreur loginUser :",
          err.response?.data || err.message
        );
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [axiosInstance, fetchUserProfile]
  );

  const registerUser = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.post("/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 15000,
        });
        localStorage.setItem("pendingUser", JSON.stringify(formData));
        return data;
      } catch (err) {
        const msg = err.response?.data?.detail || "Échec de l'inscription";
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [axiosInstance]
  );

  const verifyEmailCode = useCallback(
    async (code) => {
      setLoading(true);
      setError(null);
      try {
        const pendingUser = JSON.parse(
          localStorage.getItem("pendingUser") || "{}"
        );
        if (!pendingUser.email)
          throw new Error("Aucune vérification en attente");

        await axiosInstance.post("/auth/verify-email", {
          email: pendingUser.email,
          code,
        });

        localStorage.removeItem("pendingUser");
        return await fetchUserProfile();
      } catch (err) {
        const msg =
          err.response?.data?.detail ||
          "Échec de la vérification de l'email";
        console.error(
          "❌ Erreur verifyEmailCode :",
          err.response?.data || err.message
        );
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [axiosInstance, fetchUserProfile]
  );

  /** ========================
   * AUTRES ENDPOINTS (wallet, mining, balance)
   * ======================== */
  const fetchWallet = useCallback(
    async (userId) => {
      if (!userId) return 0;
      try {
        const { data } = await axiosInstance.get(`/wallet/${userId}`);
        return data?.balance || 0;
      } catch (err) {
        console.error(
          "❌ Erreur fetchWallet:",
          err.response?.data || err.message
        );
        return 0;
      }
    },
    [axiosInstance]
  );

  const fetchBalance = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/balance/");
      return data?.points || 0;
    } catch (err) {
      console.error(
        "❌ Erreur fetchBalance:",
        err.response?.data || err.message
      );
      return 0;
    }
  }, [axiosInstance]);

  const startMining = useCallback(
    async (userId) => {
      if (!userId) return false;
      try {
        await axiosInstance.post(`/mining/start/${userId}`, {});
        return true;
      } catch (err) {
        console.error(
          "❌ Erreur startMining:",
          err.response?.data || err.message
        );
        return false;
      }
    },
    [axiosInstance]
  );

  const claimMining = useCallback(
    async (userId, points = 1000) => {
      if (!userId) return false;
      try {
        await axiosInstance.post(`/mining/claim/${userId}`, { points });
        return true;
      } catch (err) {
        console.error(
          "❌ Erreur claimMining:",
          err.response?.data || err.message
        );
        return false;
      }
    },
    [axiosInstance]
  );

  const updateUser = useCallback(
    async (updates) => {
      setLoading(true);
      setError(null);
      try {
        const updated = { ...user, ...updates };
        persistUserData(updated);
        return updated;
      } catch (err) {
        const msg = err.message || "Impossible de mettre à jour l'utilisateur";
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [user, persistUserData]
  );

  /** ========================
   * CONTEXT VALUE
   * ======================== */
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      error,
      ...authState,
      updateUser,
      registerUser,
      verifyEmailCode,
      loginUser,
      logoutUser,
      persistUserData,
      fetchUserProfile,
      fetchWallet,
      fetchBalance,
      startMining,
      claimMining,
      setError,
    }),
    [
      user,
      loading,
      error,
      authState,
      updateUser,
      registerUser,
      verifyEmailCode,
      loginUser,
      logoutUser,
      persistUserData,
      fetchWallet,
      fetchBalance,
      fetchUserProfile,
      startMining,
      claimMining,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

/** Hook personnalisé */
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser doit être utilisé dans un UserProvider");
  return ctx;
};
