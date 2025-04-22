                                                                                                                                                                                                                                                  // src/pages/VerifyEmail.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const email = localStorage.getItem("pendingEmail");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess("Adresse vérifiée avec succès !");
        localStorage.removeItem("pendingEmail");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(result.detail || "Code incorrect.");
      }
    } catch (err) {
      setError("Erreur lors de la vérification.");
    }
  };

  return (
    <form className="verify-form" onSubmit={handleSubmit}>
      <h2>Vérification Email</h2>
      <p>Un code à 6 chiffres vous a été envoyé par email.</p>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <input
        type="text"
        maxLength="6"
        placeholder="Code de vérification"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />

      <button type="submit">Valider</button>
    </form>
  );
};

export default VerifyEmail;
