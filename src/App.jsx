// src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import PropTypes from "prop-types";

import backgroundImage from "./assets/background.png";
import logo from "./assets/actif-logo.png";

const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const SplashScreen = lazy(() => import("./components/SplashScreen"));
const SidebarToggle = lazy(() => import("./components/SidebarToggle"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));
const LoadingSpinner = lazy(() => import("./components/LoadingSpinner"));

const Home = lazy(() => import("./pages/Home"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Friends = lazy(() => import("./pages/Friends"));
const Info = lazy(() => import("./pages/Info"));
const Wallet = lazy(() => import("./pages/Wallet"));
const LevelPage = lazy(() => import("./pages/LevelPage"));
const BalancePage = lazy(() => import("./pages/BalancePage"));
const RankingPage = lazy(() => import("./pages/RankingPage"));
const ValidateTask = lazy(() => import("./pages/ValidateTask"));
const SidebarPage = lazy(() => import("./pages/SidebarPage"));
const MyActions = lazy(() => import("./pages/MyActions"));
const Status = lazy(() => import("./pages/Status"));
const DinoGame = lazy(() => import("./pages/DinoGame"));
const RegisterForm = lazy(() => import("./pages/RegisterForm"));
const Login = lazy(() => import("./pages/Login"));
const AuthChoice = lazy(() => import("./pages/AuthChoice"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const TON_ID_ADMIN = import.meta.env.VITE_TON_ID_ADMIN;

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = (userData) => {
    sessionStorage.setItem("telegramUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("telegramUser");
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const telegram = window.Telegram?.WebApp;
      const localData = sessionStorage.getItem("telegramUser");

      if (!telegram?.initDataUnsafe?.user && !localData) {
        setLoading(false);
        return;
      }

      if (localData) {
        setUser(JSON.parse(localData));
        setLoading(false);
        return;
      }

      const initData = telegram.initData;
      const userId = telegram.initDataUnsafe.user?.id;

      if (!userId) throw new Error("Utilisateur Telegram non identifié");

      const authRes = await fetch(`${API_URL}/auth/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      });

      if (!authRes.ok) throw new Error("Échec de l'authentification");

      const authData = await authRes.json();
      login(authData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, logout, checkAuth };
};

const ProtectedRoute = ({ children, user, adminOnly = false }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth-choice" state={{ from: location }} replace />;
  }

  if (adminOnly && user.id !== TON_ID_ADMIN) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object,
  adminOnly: PropTypes.bool,
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error, checkAuth } = useAuth();

  const [splashFinished, setSplashFinished] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [points, setPoints] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [level, setLevel] = useState(1);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [debouncedPoints] = useDebounce(points, 1000);
  const [debouncedWallet] = useDebounce(wallet, 1000);
  const [debouncedLevel] = useDebounce(level, 1000);

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => res.json())
      .then((data) => console.log("✅ Connexion au backend :", data.message))
      .catch((err) => console.error("❌ Erreur de connexion au backend :", err));
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const ref = new URLSearchParams(location.search).get("ref");
    const referralKey = `referredBy_${user.id}`;

    if (ref && ref !== String(user.id) && !sessionStorage.getItem(referralKey)) {
      sessionStorage.setItem(referralKey, ref);

      const handleReferral = async () => {
        try {
          const res = await fetch(`${API_URL}/handle-referral`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ referrerId: ref, refereeId: user.id }),
          });

          const result = await res.json();
          if (result.success) {
            setPoints((prev) => prev + (result.pointsBonus || 0));
            setWallet((prev) => prev + (result.walletBonus || 0));
          }
        } catch (err) {
          console.error("Erreur parrainage:", err);
        }
      };

      handleReferral();
    }
  }, [user?.id, location.search]);

  useEffect(() => {
    if (!user?.id) return;

    const saveUserData = async () => {
      try {
        await fetch(`${API_URL}/update-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            points: debouncedPoints,
            wallet: debouncedWallet,
            level: debouncedLevel,
            pointsHistory,
          }),
        });
      } catch (err) {
        console.error("Sauvegarde échouée:", err);
      }
    };

    saveUserData();
  }, [debouncedPoints, debouncedWallet, debouncedLevel, pointsHistory, user?.id]);

  useEffect(() => {
    if (!splashFinished) return;

    const isRegistered = sessionStorage.getItem("isRegistered") === "true";
    const onAuthPages = ["/auth-choice", "/register", "/login", "/verify"].includes(location.pathname);

    if (!isRegistered && !onAuthPages) {
      navigate("/auth-choice");
    } else if (isRegistered && onAuthPages) {
      navigate("/");
    } else {
      checkAuth();
    }
  }, [splashFinished, location.pathname, navigate, checkAuth]);

  if (showSplash || !splashFinished) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <SplashScreen onFinish={() => { setShowSplash(false); setSplashFinished(true); }} />
      </Suspense>
    );
  }

  if (loading) {
    return <div className="app-container"><LoadingSpinner fullScreen /></div>;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="error-container">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar user={user} points={points} wallet={wallet} />
        </Suspense>
      </ErrorBoundary>

      <div className="content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <SidebarToggle logo={logo} user={user} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home user={user} points={points} setPoints={setPoints} level={level} setLevel={setLevel} />} />
              <Route path="/auth-choice" element={<AuthChoice />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<VerifyEmail />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
