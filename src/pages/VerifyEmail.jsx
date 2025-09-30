// src/pages/VerifyEmail.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    verifyEmailCode,
    isAuthenticated,
    loading,
    setError,
    user,
  } = useUser();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingCode, setPendingCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState({ error: null, success: null });

  // Charger pendingUser depuis localStorage ou navigation state
  useEffect(() => {
    const raw = localStorage.getItem("pendingUser");
    const pending = raw ? JSON.parse(raw) : location.state?.email ? { email: location.state.email } : null;

    if (!isAuthenticated && !pending) {
      navigate("/register", { replace: true });
      return;
    }

    setEmail(pending?.email || user?.email || "");
    setPendingCode(pending?.verification_code || null);
    setTimeLeft(pending?.expires_in || 0);
  }, [isAuthenticated, user, navigate, location.state]);

  // Timer ⏳
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Formater le temps restant mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Vérification du code
  const handleVerification = useCallback(async () => {
    if (verificationCode.length !== 6 || loading) return;
    setFeedback({ error: null, success: null });
    setError(null);

    try {
      await verifyEmailCode(verificationCode);
      localStorage.removeItem("pendingUser");
      navigate("/welcome", { replace: true });
    } catch (err) {
      const msg = (err && err.message) || "Erreur lors de la vérification";
      setFeedback({ error: msg, success: null });
    }
  }, [verificationCode, verifyEmailCode, navigate, setError, loading]);

  return (
    <div className="verify-email-container">
      <div className="verify-card">
        <h1>Vérification d'email</h1>

        {email && (
          <p className="email-display">
            Vérifiez votre compte associé à <span>{email}</span>
          </p>
        )}

        {pendingCode && timeLeft > 0 && (
          <div className="code-box">
            <p>Votre code de vérification :</p>
            <div className="code">{pendingCode}</div>
            <p className="timer">
              ⏳ Expire dans <strong>{formatTime(timeLeft)}</strong>
            </p>
          </div>
        )}

        <div className="code-input-container">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Entrez le code à 6 chiffres"
            maxLength={6}
            disabled={loading || timeLeft <= 0}
            autoFocus
          />
        </div>

        <button
          onClick={handleVerification}
          disabled={loading || verificationCode.length !== 6 || timeLeft <= 0}
          className="verify-button"
        >
          Vérifier le code
        </button>

        {feedback.error && <div className="alert error">{feedback.error}</div>}
        {feedback.success && <div className="alert success">{feedback.success}</div>}

        {timeLeft <= 0 && <p className="expired">⏳ Le code a expiré. Veuillez demander un nouveau code.</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
