import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // ========================
  // 🔥 AXIOS INSTANCE SAFE
  // ========================
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      timeout: 10000,
    });

    let isRefreshing = false;
    let queue = [];

    const processQueue = (error) => {
      queue.forEach((p) => {
        error ? p.reject(error) : p.resolve();
      });
      queue = [];
    };

    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/auth/refresh")
        ) {
          originalRequest._retry = true;

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              queue.push({
                resolve: () => resolve(instance(originalRequest)),
                reject,
              });
            });
          }

          isRefreshing = true;

          try {
            await instance.post("/auth/refresh");
            processQueue();
            return instance(originalRequest);
          } catch (err) {
            processQueue(err);
            logoutUser();
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [API_URL]);

  // ========================
  // STATE
  // ========================
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [error, setError] = useState(null);

  // ========================
  // HELPERS
  // ========================
  const persistUserData = useCallback((userData) => {
    if (!userData) return;

    const normalizedUser = {
      ...userData,
      id: Number(userData.id),
      is_verified: Boolean(userData.is_verified),
      has_completed_welcome_tasks: Boolean(
        userData.has_completed_welcome_tasks
      ),
    };

    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  }, []);

  // ========================
  // LOGOUT
  // ========================
  const logoutUser = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {}

    setUser(null);
    setError(null);

    localStorage.removeItem("user");
    localStorage.removeItem("pendingUser");

    navigate("/login", { replace: true });
  }, [axiosInstance, navigate]);

  // ========================
  // AUTH STATE
  // ========================
  const authState = useMemo(
    () => ({
      isAuthenticated: !!user,
      isEmailVerified: !!user?.is_verified,
      hasCompletedWelcomeTasks: !!user?.has_completed_welcome_tasks,
      isProfileComplete: !!(
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

  // ========================
  // AUTH API
  // ========================
  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/auth/me");

      if (!data?.user?.id) return null;

      persistUserData(data.user);
      return data.user;
    } catch {
      return null;
    }
  }, [axiosInstance, persistUserData]);

  const loginUser = useCallback(
    async ({ email, username, password }) => {
      try {
        setError(null);

        await axiosInstance.post("/auth/login", {
          email,
          username,
          password,
        });

        return await fetchUserProfile();
      } catch (err) {
        const msg = err.response?.data?.detail || "Login failed";
        setError(msg);
        throw new Error(msg);
      }
    },
    [axiosInstance, fetchUserProfile]
  );

  const registerUser = useCallback(
    async (formData) => {
      try {
        const { data } = await axiosInstance.post("/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const email = formData.get("email");

        if (email) {
          localStorage.setItem(
            "pendingUser",
            JSON.stringify({
              email,
              verification_code: data?.verification_code || null,
            })
          );
        }

        return data;
      } catch (err) {
        const msg = err.response?.data?.detail || "Register failed";
        setError(msg);
        throw new Error(msg);
      }
    },
    [axiosInstance]
  );

  const verifyEmailCode = useCallback(
  async ({ email, code }) => {
    try {
      setError(null);

      await axiosInstance.post("/auth/verify-email", {
        email,
        code,
      });

      localStorage.removeItem("pendingUser");

      // 🔥 IMPORTANT : ne casse pas si fetch échoue
      try {
        await fetchUserProfile();
      } catch {}

      return true;

    } catch (err) {
      const msg = err.response?.data?.detail || "Verification failed";
      setError(msg);
      throw new Error(msg);
    }
  },
  [axiosInstance, fetchUserProfile]
);

const resendCode = useCallback(
  async (email) => {
    try {
      setError(null);

      const { data } = await axiosInstance.post("/auth/resend-code", {
        email,
      });

      // 🔥 MAJ localStorage
      localStorage.setItem(
        "pendingUser",
        JSON.stringify({
          email,
          verification_code: data?.verification_code || null,
          expires_in: data?.expires_in || 300,
        })
      );

      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Resend failed";
      setError(msg);
      throw new Error(msg);
    }
  },
  [axiosInstance]
);

  // ========================
  // INIT SESSION (SAFE)
  // ========================
  useEffect(() => {
    if (!user) return;
    fetchUserProfile();
  }, []); // volontaire

  // ========================
  // CONTEXT
  // ========================
  const value = useMemo(
    () => ({
      user,
      error,
      ...authState,
      axiosInstance,

      loginUser,
      logoutUser,
      registerUser,
      verifyEmailCode,
      fetchUserProfile,
      persistUserData,
      resendCode, // ✅ AJOUT ICI

      setError,
    }),
    [
      user,
      error,
      authState,
      loginUser,
      logoutUser,
      registerUser,
      verifyEmailCode,
      fetchUserProfile,
      resendCode, // ✅ AJOUT ICI
      persistUserData,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// ========================
// HOOK
// ========================
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};