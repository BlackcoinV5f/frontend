import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAdm } from "../contexts/AdmContext";
import { useUser } from "../contexts/UserContext";
import "./Depots.css";

const Depots = () => {
  const { id } = useParams();
  const { axiosDeposit } = useAdm();
  const { user } = useUser();
  const navigate = useNavigate();

  const [method, setMethod] = useState(null);
  const [form, setForm] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    amount: "",
    transaction_id: "",
    currency: "FCFA",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const dropdownRef = useRef(null);

  const currencies = ["FCFA", "USDT", "PI", "EURO", "USD"];

  useEffect(() => {
    const fetchMethod = async () => {
      try {
        const res = await axiosDeposit.get(`/transaction-methods/${id}`);
        setMethod(res.data);
      } catch (err) {
        console.error("Erreur chargement méthode:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMethod();
  }, [axiosDeposit, id]);

  // Fermer le menu au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.username || !form.phone || !form.amount || !form.transaction_id) {
      setMessage("❌ Tous les champs sont obligatoires !");
      return;
    }

    const amountNumber = parseFloat(form.amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setMessage("❌ Montant invalide !");
      return;
    }

    if (!user?.id) {
      setMessage("❌ Impossible d'identifier l'utilisateur.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const payload = {
        user_id: user.id,
        username: form.username,
        phone: form.phone,
        amount: amountNumber,
        currency: form.currency,
        transaction_id: form.transaction_id,
        method_id: method.id,
        country: method.country,
      };

      console.log("Payload dépôt :", payload);

      await axiosDeposit.post("/deposits/", payload);

      setMessage("✅ Dépôt envoyé avec succès !");
      setForm({ ...form, amount: "", transaction_id: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Une erreur est survenue lors du dépôt.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!method) return <p>Méthode non trouvée</p>;

  return (
    <motion.div
      className="deposit-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="deposit-header">
        <img
          src={method.icon_url}
          alt={method.name}
          className="deposit-method-icon"
        />
        <h2>{method.name}</h2>
      </div>

      {method.country && <p>Pays : {method.country}</p>}
      <p className="deposit-account">
        📱 Compte / adresse : <strong>{method.account_number || "+2250123456789"}</strong>
      </p>

      <div className="deposit-form">
        <input
          name="username"
          placeholder="Nom d'utilisateur"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Numéro de téléphone"
          value={form.phone}
          onChange={handleChange}
        />

        {/* Montant + devise */}
        <div className="amount-container">
          <input
            name="amount"
            type="number"
            placeholder="Montant"
            value={form.amount}
            onChange={handleChange}
          />

          <div
            className="currency-dropdown"
            ref={dropdownRef}
            onClick={() => setCurrencyOpen(!currencyOpen)}
          >
            <div className="currency-selected">{form.currency}</div>
            {currencyOpen && (
              <div className="currency-list">
                {currencies.map((cur) => (
                  <div
                    key={cur}
                    className="currency-item"
                    onClick={() => {
                      setForm({ ...form, currency: cur });
                      setCurrencyOpen(false);
                    }}
                  >
                    {cur}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <input
          name="transaction_id"
          placeholder="ID de la transaction"
          value={form.transaction_id}
          onChange={handleChange}
        />

        <motion.button
          className="deposit-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Envoi..." : "Valider le dépôt"}
        </motion.button>
      </div>

      {message && <p className="deposit-message">{message}</p>}

      <motion.button
        className="back-button"
        onClick={() => navigate("/deposit-methods")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ⬅ Retour aux méthodes
      </motion.button>
    </motion.div>
  );
};

export default Depots;
