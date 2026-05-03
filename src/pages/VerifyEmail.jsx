// src/pages/VerifyEmail.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const { t } = useTranslation("login");

  const navigate = useNavigate();
  const location = useLocation();

  const {
    verifyEmailCode,
    resendCode,
    isAuthenticated,
    loading,
    setError,
    user,
  } = useUser();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingCode, setPendingCode] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null); // 🔥 timestamp réel
  const [timeLeft, setTimeLeft] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState({ error: null, success: null });

  // 🔥 INIT ROBUSTE
  useEffect(() => {
    let pending = null;

    try {
      const raw = localStorage.getItem("pendingUser");
      if (raw) pending = JSON.parse(raw);
    } catch {
      pending = null;
    }

    if (!pending && location.state?.email) {
      pending = {
        email: location.state.email,
        expires_at: Date.now() + 5 * 60 * 1000,
      };
    }

    if (!isAuthenticated && !pending) {
      navigate("/register", { replace: true });
      return;
    }

    const finalEmail = pending?.email || user?.email || "";
    setEmail(finalEmail);

    setPendingCode(pending?.verification_code || null);

    const exp = pending?.expires_at || Date.now() + 5 * 60 * 1000;
    setExpiresAt(exp);

  }, [isAuthenticated, user, navigate, location.state]);

  // 🔥 TIMER FIABLE
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAt - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // 🔥 COOLDOWN
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // 🔥 VERIFY
  const handleVerification = useCallback(async () => {
  if (verificationCode.length !== 6 || loading) return;

  setFeedback({ error: null, success: null });
  setError(null);

  try {
    const ok = await verifyEmailCode({
      email,
      code: verificationCode,
    });

    // 🔥 même si fetch échoue, on avance
    localStorage.removeItem("pendingUser");

    // 🔥 sécuriser redirection
    if (ok !== false) {
      navigate("/welcome", { replace: true });
    }

  } catch (err) {
    const msg =
      typeof err?.message === "string"
        ? err.message
        : t("verifyEmail.error");

    // 🔥 cas spécial : déjà vérifié
    if (msg.toLowerCase().includes("déjà vérifié")) {
      navigate("/login", { replace: true });
      return;
    }

    setFeedback({ error: msg, success: null });
  }
}, [verificationCode, email, verifyEmailCode, navigate, setError, loading, t]);

  // 🔥 RESEND PROPRE
  const handleResend = async () => {
    if (cooldown > 0) return;

    setFeedback({ error: null, success: null });

    try {
      const res = await resendCode(email);

      const newExpiresAt = Date.now() + (res.expires_in || 300) * 1000;

      localStorage.setItem(
        "pendingUser",
        JSON.stringify({
          email,
          verification_code: res.verification_code,
          expires_at: newExpiresAt,
        })
      );

      setPendingCode(res.verification_code);
      setExpiresAt(newExpiresAt);
      setCooldown(60);

      setFeedback({ success: "Code renvoyé", error: null });

    } catch (err) {
      setFeedback({
        error: err?.message || "Erreur lors du renvoi",
        success: null,
      });
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-card">

        <h1>{t("verifyEmail.title")}</h1>

        {email && (
          <p className="email-display">
            {t("verifyEmail.checkAccount")} <span>{email}</span>
          </p>
        )}

        {pendingCode && (
          <div className="code-box">
            <p>{t("verifyEmail.codeLabel")}</p>
            <div className="code">{pendingCode}</div>
          </div>
        )}

        <p className="timer">
          {t("verifyEmail.expiresIn")}{" "}
          <strong>{formatTime(timeLeft)}</strong>
        </p>

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

        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className="resend-button"
        >
          {cooldown > 0
            ? `Renvoyer dans ${cooldown}s`
            : "Renvoyer le code"}
        </button>

        {feedback.error && (
          <div className="alert error">{feedback.error}</div>
        )}

        {feedback.success && (
          <div className="alert success">{feedback.success}</div>
        )}

        {timeLeft <= 0 && (
          <p className="expired">{t("verifyEmail.expired")}</p>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;