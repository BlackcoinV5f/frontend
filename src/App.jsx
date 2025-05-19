// src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { UserProvider } from "./contexts/UserContext";

import backgroundImage from "./assets/background.png";
import logo from "./assets/actif-logo.png";

// Lazy loaded components
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const SplashScreen = lazy(() => import("./components/SplashScreen"));
const SidebarToggle = lazy(() => import("./components/SidebarToggle"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));
const LoadingSpinner = lazy(() => import("./components/LoadingSpinner"));

// Pages
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

const ProtectedRoute = ({ children, user, adminOnly = false }) => {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/auth-choice" state={{ from: location }} replace />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object,
  adminOnly: PropTypes.bool,
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null); // Sans Telegram
  const [splashFinished, setSplashFinished] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [points, setPoints] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const isRegistered = sessionStorage.getItem("isRegistered") === "true";
    const onAuthPages = ["/auth-choice", "/register", "/login", "/verify"].includes(location.pathname);

    if (!isRegistered && !onAuthPages) {
      navigate("/auth-choice");
    } else if (isRegistered && onAuthPages) {
      navigate("/");
    }
  }, [splashFinished, location.pathname, navigate]);

  if (showSplash || !splashFinished) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <SplashScreen onFinish={() => { setShowSplash(false); setSplashFinished(true); }} />
      </Suspense>
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
              {/* Ajoute d'autres routes ici */}
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

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
