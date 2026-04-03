import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const { t } = useTranslation();
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

  useEffect(() => {
    const raw = localStorage.getItem("pendingUser");
    const pending = raw
      ? JSON.parse(raw)
      : location.state?.email
      ? { email: location.state.email }
      : null;

    if (!isAuthenticated && !pending) {
      navigate("/register", { replace: true });
      return;
    }

    setEmail(pending?.email || user?.email || "");
    setPendingCode(pending?.verification_code || null);
    setTimeLeft(pending?.expires_in || 0);
  }, [isAuthenticated, user, navigate, location.state]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleVerification = useCallback(async () => {
    if (verificationCode.length !== 6 || loading) return;

    setFeedback({ error: null, success: null });
    setError(null);

    try {
      await verifyEmailCode(verificationCode);
      localStorage.removeItem("pendingUser");
      navigate("/welcome", { replace: true });
    } catch (err) {
      const msg = err?.message || t("verifyEmail.error");
      setFeedback({ error: msg, success: null });
    }
  }, [verificationCode, verifyEmailCode, navigate, setError, loading, t]);

  return (
    <div className="verify-email-container">
      <div className="verify-card">
        <h1>{t("verifyEmail.title")}</h1>

        {email && (
          <p className="email-display">
            {t("verifyEmail.checkAccount")} <span>{email}</span>
          </p>
        )}

        {pendingCode && timeLeft > 0 && (
          <div className="code-box">
            <p>{t("verifyEmail.codeLabel")}</p>
            <div className="code">{pendingCode}</div>
            <p className="timer">
              ⏳ {t("verifyEmail.expiresIn")}{" "}
              <strong>{formatTime(timeLeft)}</strong>
            </p>
          </div>
        )}

        <div className="code-input-container">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(
                e.target.value.replace(/\D/g, "").slice(0, 6)
              )
            }
            placeholder={t("verifyEmail.placeholder")}
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
          {t("verifyEmail.verifyButton")}
        </button>

        {feedback.error && <div className="alert error">{feedback.error}</div>}
        {feedback.success && <div className="alert success">{feedback.success}</div>}

        {timeLeft <= 0 && (
          <p className="expired">{t("verifyEmail.expired")}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;