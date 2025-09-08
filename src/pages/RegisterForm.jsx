import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useUser } from "../contexts/UserContext";
import "./RegisterForm.css";

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { registerUser } = useUser();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    promoCode: "", 
  });

  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n.language]);

  useEffect(() => {
    const { password } = formData;
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
    setFeedback({ error: "", success: "" });
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleAvatarChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const validateForm = () => {
    const { firstName, lastName, birthDate, phoneNumber, email, username, password, confirmPassword } = formData;

    if ([firstName, lastName, birthDate, phoneNumber, email, username, password, confirmPassword].some(v => !v.trim())) {
      return t("register.errors.missingFields");
    }
    if (!/\S+@\S+\.\S+/.test(email)) return t("register.errors.invalidEmail");
    if (!isValidPhoneNumber(phoneNumber || "")) return t("register.errors.invalidPhoneNumber");
    if (!/^[a-zA-Z_][a-zA-Z0-9_]{4,31}$/.test(username)) return t("register.errors.invalidUsername");
    if (password !== confirmPassword) return t("register.errors.passwordMismatch");
    if (!Object.values(passwordCriteria).every(Boolean)) return t("register.errors.passwordWeak");
    if (new Date(birthDate) > new Date()) return t("register.errors.invalidBirthDate");

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFeedback({ error, success: "" });
      return;
    }

    setIsLoading(true);
    setFeedback({ error: "", success: "" });

    const payload = new FormData();
    Object.entries({
      first_name: formData.firstName,
      last_name: formData.lastName,
      birth_date: formData.birthDate,
      phone: formData.phoneNumber,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      promo_code: formData.promoCode || "",
    }).forEach(([key, value]) => payload.append(key, value));

    if (formData.avatar) payload.append("avatar", formData.avatar);

    try {
      const response = await registerUser(payload);

      if (response?.status === "verification_sent") {
        localStorage.setItem("pendingUser", JSON.stringify({ email: formData.email }));
        setFeedback({ error: "", success: t("register.successEmailSent") });
        navigate("/verify-email");
      } else {
        throw new Error(response?.detail || t("register.errors.generic"));
      }
    } catch (err) {
      console.error("Registration error:", err);
      setFeedback({ error: err?.message || t("register.errors.generic"), success: "" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <div className="language-switcher">
          <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} aria-label="Language">
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="ar">🇸🇦 العربية</option>
          </select>
        </div>

        <h2>{t("register.title")}</h2>

        {feedback.error && <div className="error-message">⚠️ {feedback.error}</div>}
        {feedback.success && <div className="success-message">✅ {feedback.success}</div>}

        {/* Personal Info */}
        <div className="form-section">
          <p className="section-title">{t("register.personalInfo")}</p>
          <div className="input-group">
            <input type="text" name="firstName" placeholder={t("register.firstName")} value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder={t("register.lastName")} value={formData.lastName} onChange={handleChange} required />
          </div>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
        </div>

        {/* Contact Info */}
        <div className="form-section">
          <p className="section-title">{t("register.contactInfo")}</p>
          <PhoneInput international defaultCountry="BJ" value={formData.phoneNumber} onChange={handlePhoneChange} placeholder={t("register.phoneNumber")} required />
          <input type="email" name="email" placeholder={t("register.email")} value={formData.email} onChange={handleChange} required />
          <input type="text" name="username" placeholder={t("register.username")} value={formData.username} onChange={handleChange} required />
          <input type="file" accept="image/*" name="avatar" onChange={handleAvatarChange} />
        </div>

        {/* Promo Code */}
        <div className="form-section">
          <p className="section-title">Code promo (facultatif)</p>
          <input 
            type="text" 
            name="promoCode" 
            placeholder="Entrez le nom d'utilisateur de votre parrain" 
            value={formData.promoCode} 
            onChange={handleChange} 
          />
        </div>

        {/* Security */}
        <div className="form-section">
          <p className="section-title">{t("register.security")}</p>
          <input type="password" name="password" placeholder={t("register.password")} value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder={t("register.confirmPassword")} value={formData.confirmPassword} onChange={handleChange} required />
          <ul className="password-criteria">
            <li className={passwordCriteria.length ? "valid" : "invalid"}>{t("register.criteria.length")}</li>
            <li className={passwordCriteria.uppercase ? "valid" : "invalid"}>{t("register.criteria.uppercase")}</li>
            <li className={passwordCriteria.number ? "valid" : "invalid"}>{t("register.criteria.number")}</li>
            <li className={passwordCriteria.specialChar ? "valid" : "invalid"}>{t("register.criteria.specialChar")}</li>
          </ul>
        </div>

        <button type="submit" disabled={isLoading} className={isLoading ? "loading" : ""}>
          {isLoading ? t("register.loading") : t("register.submit")}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
