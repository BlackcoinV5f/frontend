import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getNames, getCode } from 'country-list';
import './RegisterForm.css';

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const allCountries = getNames().sort();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    phoneCode: '+225',
    phoneNumber: '',
    telegramUsername: '',
    email: '',
    country: 'Côte d’Ivoire',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false
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
      specialChar: /[!@#$%^&*]/.test(password)
    });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = name === 'phoneNumber' ? value.replace(/\D/g, '') : value;

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue
    }));

    if (name === 'telegramUsername' && !cleanedValue.startsWith('@')) {
      setError(t('register.errors.telegramFormat'));
    } else if (name === 'confirmPassword' && cleanedValue !== formData.password) {
      setError(t('register.errors.passwordMismatch'));
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const fullPhone = `${formData.phoneCode}${formData.phoneNumber}`;
    const payload = {
      ...formData,
      phoneNumber: fullPhone,
      countryCode: getCode(formData.country),
      telegramUsername: formData.telegramUsername.trim(),
      email: formData.email.trim()
    };

    if (formData.password !== formData.confirmPassword) {
      setError(t('register.errors.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tempToken')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === 'Telegram username invalid') {
          setError(t('register.errors.invalidTelegram'));
        } else if (data.message === 'Email already exists') {
          setError(t('register.errors.emailExists'));
        } else {
          setError(data.message || t('register.errors.generic'));
        }
        return;
      }

      localStorage.setItem(
        'pendingVerification',
        JSON.stringify({
          email: formData.email,
          expires: Date.now() + 15 * 60 * 1000 // 15 minutes
        })
      );

      navigate('/verify', { state: { email: formData.email, resendCooldown: 60 } });

    } catch (err) {
      setError(err.message || t('register.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="language-switcher">
          <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="ar">🇸🇦 العربية</option>
          </select>
        </div>

        <h2>{t('register.title')}</h2>

        {error && <div className="error-message">⚠️ {error}</div>}
        {success && <div className="success-message">✅ {success}</div>}

        {/* Informations personnelles */}
        <div className="form-section">
          <p className="section-title">{t('register.personalInfo')}</p>
          <div className="input-group">
            <input type="text" name="firstName" placeholder={t('register.firstName')} value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder={t('register.lastName')} value={formData.lastName} onChange={handleChange} required />
          </div>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
        </div>

        {/* Informations de contact */}
        <div className="form-section">
          <p className="section-title">{t('register.contactInfo')}</p>
          <div className="phone-input">
            <select name="phoneCode" value={formData.phoneCode} onChange={handleChange} required>
              {allCountries.map((country) => (
                <option key={country} value={`+${getCode(country)}`}>
                  {country} (+{getCode(country)})
                </option>
              ))}
            </select>
            <input type="tel" name="phoneNumber" placeholder={t('register.phoneNumber')} value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <input type="email" name="email" placeholder={t('register.email')} value={formData.email} onChange={handleChange} required />
          <input type="text" name="telegramUsername" placeholder={`${t('register.telegram')} (${t('register.optional')})`} value={formData.telegramUsername} onChange={handleChange} />
        </div>

        {/* Sécurité */}
        <div className="form-section">
          <p className="section-title">{t('register.security')}</p>
          <select name="country" value={formData.country} onChange={handleChange} required>
            {allCountries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <div className="password-section">
            <input type="password" name="password" placeholder={t('register.password')} value={formData.password} onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder={t('register.confirmPassword')} value={formData.confirmPassword} onChange={handleChange} required />
            <div className="password-criteria">
              <span className={passwordCriteria.length ? 'valid' : ''}>{t('register.passwordCriteria.length')}</span>
              <span className={passwordCriteria.uppercase ? 'valid' : ''}>{t('register.passwordCriteria.uppercase')}</span>
              <span className={passwordCriteria.number ? 'valid' : ''}>{t('register.passwordCriteria.number')}</span>
              <span className={passwordCriteria.specialChar ? 'valid' : ''}>{t('register.passwordCriteria.specialChar')}</span>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="form-footer">
          <button type="submit" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : t('register.submit')}
          </button>
          <p className="legal-text">
            {t('register.termsText')}
            <a href="/terms">{t('register.terms')}</a> {t('register.and')} <a href="/privacy">{t('register.privacy')}</a>.
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
