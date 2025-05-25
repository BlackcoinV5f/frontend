                                                                                                                                                                                                                                                  import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminVerifyCode.css";

const AdminVerifyCode = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = localStorage.getItem("adminEmail");

    if (!email) {
      setError("Aucun email administrateur trouvé.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) throw new Error("Code invalide ou expiré.");

      const data = await res.json();
      localStorage.setItem("adminVerified", "true");
      localStorage.setItem("adminData", JSON.stringify(data));

      navigate("/admin-panel"); // redirection vers tableau de bord
    } catch (err) {
      setError("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-verify-container">
      <form className="admin-verify-form" onSubmit={handleVerify}>
        <h2>Vérification administrateur</h2>

        <label htmlFor="code">Code reçu par email</label>
        <input
          id="code"
          type="text"
          placeholder="123456"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Vérification..." : "Valider le code"}
        </button>
      </form>
    </div>
  );
};

export default AdminVerifyCode;
