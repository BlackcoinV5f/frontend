import React, { useState } from 'react';
import './RegisterForm.css';

const countries = [
  'Côte d’Ivoire', 'France', 'Sénégal', 'Cameroun', 'Mali', 'Togo', 'Bénin', 'Burkina Faso',
  'Maroc', 'Algérie', 'Tunisie', 'Guinée', 'Congo', 'Gabon', 'RDC', 'Autre'
];

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    phoneNumber: '',
    telegramUsername: '',
    email: '',
    country: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess("Un code de validation a été envoyé à votre email.");
      } else {
        setError(result.detail || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      setError("Une erreur est survenue.");
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      <input type="text" name="firstName" placeholder="Prénom" onChange={handleChange} required />
      <input type="text" name="lastName" placeholder="Nom" onChange={handleChange} required />
      <input type="date" name="birthDate" onChange={handleChange} required />
      <input type="tel" name="phoneNumber" placeholder="Numéro de téléphone" onChange={handleChange} required />
      <input type="text" name="telegramUsername" placeholder="Nom d'utilisateur Telegram" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      
      <select name="country" onChange={handleChange} required>
        <option value="">-- Choisissez votre pays --</option>
        {countries.map((c, i) => (
          <option key={i} value={c}>{c}</option>
        ))}
      </select>
      
      <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
      <input type="password" name="confirmPassword" placeholder="Confirmer mot de passe" onChange={handleChange} required />
      
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default RegisterForm;
