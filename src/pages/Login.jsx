// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";
import "./Login.css";

const Login = () => {
  // ✅ namespace ajouté
  const { t } = useTranslation("login");

  const navigate = useNavigate();
  const { loginUser } = useUser();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const value = emailOrUsername.trim();
    const pwd = password.trim();

    setLoading(true);
    setError("");

    try {
      // ✅ validation
      if (!value) {
        throw new Error(t("login.errors.missingEmail"));
      }

      if (!pwd) {
        throw new Error(t("login.errors.missingPassword"));
      }

      const isEmail = value.includes("@");

      await loginUser({
        email: isEmail ? value : undefined,
        username: !isEmail ? value : undefined,
        password: pwd,
      });

      navigate("/home", { replace: true });

    } catch (err) {
      console.error("Login error:", err);

      // ✅ message sécurisé + propre
      const backendMessage = err?.response?.data?.detail;

      const msg =
        typeof backendMessage === "string"
          ? backendMessage
          : t("login.errors.generic");

      setError(msg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>

        <h2>{t("login.title")}</h2>

        {/* EMAIL / USERNAME */}
        <label htmlFor="emailOrUsername">
          {t("login.emailOrUsername")}
        </label>

        <input
          id="emailOrUsername"
          type="text"
          placeholder={t("login.placeholder.emailOrUsername")}
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          autoComplete="username"
          disabled={loading}
        />

        {/* PASSWORD */}
        <label htmlFor="password">
          {t("login.password")}
        </label>

        <input
          id="password"
          type="password"
          placeholder={t("login.placeholder.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={loading}
        />

        {/* ERROR */}
        {error && <p className="error-message">{error}</p>}

        {/* BUTTON */}
        <button type="submit" disabled={loading}>
          {loading
            ? t("login.button.loading")
            : t("login.button.login")}
        </button>

        {/* REGISTER */}
        <p className="register-link">
          {t("login.register.text")}{" "}
          <span
            className="link"
            onClick={() => navigate("/register")}
          >
            {t("login.register.link")}
          </span>
        </p>

      </form>
    </div>
  );
};

export default Login;