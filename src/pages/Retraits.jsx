import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdm } from "../contexts/AdmContext";
import { useUser } from "../contexts/UserContext";
import "./Retraits.css";

const Retraits = () => {
  const { axiosDeposit } = useAdm();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Méthode reçue depuis la page précédente
  const method = location.state?.selectedMethod;

  const [form, setForm] = useState({
    address: "",
    amount: "",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.address || !form.amount) {
      setMessage("❌ Tous les champs sont obligatoires !");
      return;
    }

    const amountNumber = parseFloat(form.amount);
    if (isNaN(amountNumber) || amountNumber < 1.2) {
      setMessage("❌ Le montant minimal de retrait est de 1.2 BKC !");
      return;
    }

    if (!user?.id) {
      setMessage("❌ Utilisateur non identifié.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const payload = {
        user_id: user.id,
        username: user.username,
        method_id: method.id,
        method_name: method.name,
        address: form.address,
        amount: amountNumber,
      };

      console.log("Payload retrait :", payload);

      await axiosDeposit.post("/withdrawals/", payload);

      setMessage("✅ Demande de retrait envoyée avec succès !");
      setForm({ address: "", amount: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Une erreur est survenue lors du retrait.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!method) {
    return (
      <div className="withdraw-container">
        <p>Aucune méthode sélectionnée. Retournez en arrière pour en choisir une.</p>
        <motion.button
          className="back-button"
          onClick={() => navigate("/withdraw-methods")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Retour
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      className="withdraw-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="withdraw-header">
        <img src={method.icon_url} alt={method.name} className="withdraw-method-icon" />
        <h2>{method.name}</h2>
        <p className="withdraw-country">Pays : {method.country}</p>
      </div>

      <div className="withdraw-form">
        <input
          name="address"
          placeholder="Adresse / numéro de compte"
          value={form.address}
          onChange={handleChange}
        />

        <input
          name="amount"
          type="number"
          placeholder="Montant à retirer (min 1.2 BKC)"
          value={form.amount}
          onChange={handleChange}
        />

        <motion.button
          className="withdraw-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Envoi..." : "Valider le retrait"}
        </motion.button>
      </div>

      {message && <p className="withdraw-message">{message}</p>}

      <motion.button
        className="back-button"
        onClick={() => navigate("/withdraw-methods")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ⬅ Retour aux méthodes
      </motion.button>
    </motion.div>
  );
};

export default Retraits;
