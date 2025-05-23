import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useUser } from '../contexts/UserContext';
import DateInput from "../components/DateInput"; // 👈 Importation du composant date
import './RegisterForm.css';

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { registerUser } = useUser();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    phoneNumber: '',
    email: '',
    telegramUsername: '',
    password: '',
    confirmPassword: '',
  });

  const [feedback, setFeedback] = useState({ error: '', success: '' });
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
    setFormData((prev) => {
      const updated = { ...prev, [name]: value.trimStart() };

      if ((name === 'password' || name === 'confirmPassword') && updated.password !== updated.confirmPassword) {
        setFeedback({ error: t('register.errors.passwordMismatch'), success: '' });
      } else {
        setFeedback({ error: '', success: '' });
      }

      return updated;
    });
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, birthDate: date }));
  };

  const isFormValid = () => {
    const {
      firstName, lastName, birthDate, phoneNumber,
      email, telegramUsername, password, confirmPassword,
    } = formData;

    if ([firstName, lastName, birthDate, phoneNumber, email, telegramUsername, password, confirmPassword].some(v => !v.trim())) {
      setFeedback({ error: t('register.errors.missingFields'), success: '' });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setFeedback({ error: t('register.errors.invalidEmail'), success: '' });
      return false;
    }

    if (!isValidPhoneNumber(phoneNumber || '')) {
      setFeedback({ error: t('register.errors.invalidPhoneNumber'), success: '' });
      return false;
    }

    if (!/^[a-zA-Z0-9_]{5,32}$/.test(telegramUsername)) {
      setFeedback({ error: t('register.errors.invalidTelegramUsername'), success: '' });
      return false;
    }

    if (password !== confirmPassword) {
      setFeedback({ error: t('register.errors.passwordMismatch'), success: '' });
      return false;
    }

    if (!Object.values(passwordCriteria).every(Boolean)) {
      setFeedback({ error: t('register.errors.passwordWeak'), success: '' });
      return false;
    }

    const birthDateObj = new Date(birthDate);
    const now = new Date();
    const age = (now - birthDateObj) / (1000 * 60 * 60 * 24 * 365.25);

    if (birthDateObj > now || age < 13) {
      setFeedback({ error: t('register.errors.invalidBirthDate'), success: '' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ error: '', success: '' });

    if (!isFormValid()) return;
    setIsLoading(true);

    const userPayload = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      birth_date: formData.birthDate, // format ISO à envoyer: 1988-01-01
      email: formData.email.trim(),
      telegram_username: formData.telegramUsername.trim().replace(/^@/, ''),
      phone: formData.phoneNumber,
      password: formData.password,
      confirm_password: formData.confirmPassword
    };

    try {
      await registerUser(userPayload, navigate);
      setFeedback({ error: '', success: t('register.success') });
    } catch (err) {
      const errorMsg = err?.response?.data?.detail || err?.message || t('register.errors.generic');
      setFeedback({ error: errorMsg, success: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <div className="language-switcher">
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            aria-label="Language"
          >
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="ar">🇸🇦 العربية</option>
          </select>
        </div>

        <h2>{t('register.title')}</h2>

        {feedback.error && <div className="error-message" role="alert">⚠️ {feedback.error}</div>}
        {feedback.success && <div className="success-message" role="status">✅ {feedback.success}</div>}

        {/* Informations personnelles */}
        <div className="form-section">
          <p className="section-title">{t('register.personalInfo')}</p>
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              placeholder={t('register.firstName')}
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder={t('register.lastName')}
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Composant Date de Naissance */}
          <DateInput
            value={formData.birthDate}
            onChange={handleDateChange}
          />
        </div>

        {/* Coordonnées */}
        <div className="form-section">
          <p className="section-title">{t('register.contactInfo')}</p>
          <PhoneInput
            international
            defaultCountry="BJ"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            placeholder={t('register.phoneNumber')}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t('register.email')}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="telegramUsername"
            placeholder={t('register.telegramUsername')}
            value={formData.telegramUsername}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sécurité */}
        <div className="form-section">
          <p className="section-title">{t('register.security')}</p>
          <input
            type="password"
            name="password"
            placeholder={t('register.password')}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder={t('register.confirmPassword')}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <ul className="password-criteria">
            <li className={passwordCriteria.length ? 'valid' : 'invalid'}>{t('register.criteria.length')}</li>
            <li className={passwordCriteria.uppercase ? 'valid' : 'invalid'}>{t('register.criteria.uppercase')}</li>
            <li className={passwordCriteria.number ? 'valid' : 'invalid'}>{t('register.criteria.number')}</li>
            <li className={passwordCriteria.specialChar ? 'valid' : 'invalid'}>{t('register.criteria.specialChar')}</li>
          </ul>
        </div>

        <button type="submit" disabled={isLoading} aria-busy={isLoading} className={isLoading ? 'loading' : ''}>
          {isLoading ? t('register.loading') : t('register.submit')}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
