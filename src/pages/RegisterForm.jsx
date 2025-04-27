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
    const validatePassword = (password) => {
      setPasswordCriteria({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        specialChar: /[!@#$%^&*]/.test(password)
      });
    };
    validatePassword(formData.password);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phoneNumber' ? value.replace(/\D/g, '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const fullPhone = `${formData.phoneCode}${formData.phoneNumber}`;
      const payload = {
        ...formData,
        phoneNumber: fullPhone,
        countryCode: getCode(formData.country)
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tempToken')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t('register.errors.generic'));

      localStorage.setItem('pendingVerification', JSON.stringify({
        email: formData.email,
        expires: Date.now() + 900000
      }));

      navigate('/verify', { state: { email: formData.email, resendCooldown: 60 } });

    } catch (err) {
      console.error('Registration error:', err);
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

        <div className="form-section">
          <p className="section-title">{t('register.personalInfo')}</p>
          <div className="input-group">
            <input type="text" name="firstName" placeholder={`${t('register.firstName')} *`} value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder={`${t('register.lastName')} *`} value={formData.lastName} onChange={handleChange} required />
          </div>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
        </div>

        <div className="form-section">
          <p className="section-title">{t('register.contactInfo')}</p>
          <div className="phone-input">
            <select name="phoneCode" value={formData.phoneCode} onChange={handleChange} required>
              {allCountries.map((country) => (
                <option key={country} value={`+${getCode(country)}`}>{country} (+{getCode(country)})</option>
              ))}
            </select>
            <input type="tel" name="phoneNumber" placeholder={`${t('register.phoneNumber')} *`} value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <input type="email" name="email" placeholder={`${t('register.email')} *`} value={formData.email} onChange={handleChange} required />
          <input type="text" name="telegramUsername" placeholder={`${t('register.telegram')} (${t('register.optional')})`} value={formData.telegramUsername} onChange={handleChange} />
        </div>

        <div className="form-section">
          <p className="section-title">{t('register.security')}</p>
          <select name="country" value={formData.country} onChange={handleChange} required>
            {allCountries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <div className="password-section">
            <input type="password" name="password" placeholder={`${t('register.password')} *`} value={formData.password} onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder={`${t('register.confirmPassword')} *`} value={formData.confirmPassword} onChange={handleChange} required />
            <div className="password-criteria">
              <span className={passwordCriteria.length ? 'valid' : ''}>{t('register.passwordCriteria.length')}</span>
              <span className={passwordCriteria.uppercase ? 'valid' : ''}>{t('register.passwordCriteria.uppercase')}</span>
              <span className={passwordCriteria.number ? 'valid' : ''}>{t('register.passwordCriteria.number')}</span>
              <span className={passwordCriteria.specialChar ? 'valid' : ''}>{t('register.passwordCriteria.specialChar')}</span>
            </div>
          </div>
        </div>

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
