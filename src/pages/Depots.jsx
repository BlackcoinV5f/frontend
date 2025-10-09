import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { GiReceiveMoney } from "react-icons/gi";
import "./Depots.css"; // tu pourras créer ce fichier plus tard si besoin

const Depots = () => {
  const { user, axiosInstance } = useUser();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  /** ⚡ Fonction de dépôt simulée */
  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage("❌ Montant invalide");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      // 🔗 Appel API (à adapter selon ton backend)
      const res = await axiosInstance.post("/wallet/deposit/", {
        amount: Number(amount),
      });

      if (res.data?.success) {
        setMessage(`✅ Dépôt de ${amount} $BKC effectué avec succès !`);
        setAmount("");
      } else {
        setMessage("⚠️ Échec du dépôt, réessaie plus tard.");
      }
    } catch (err) {
      console.error("Erreur dépôt:", err);
      setMessage("❌ Une erreur est survenue lors du dépôt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="deposit-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="deposit-header">
        <GiReceiveMoney className="deposit-icon" />
        <h2>Faire un dépôt</h2>
      </div>

      <div className="deposit-form">
        <label htmlFor="amount">Montant ($BKC)</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Entrez le montant à déposer"
        />

        <motion.button
          className="deposit-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          onClick={handleDeposit}
        >
          {isLoading ? "Traitement..." : "Valider le dépôt"}
        </motion.button>
      </div>

      {message && <p className="deposit-message">{message}</p>}

      <motion.button
        className="back-button"
        onClick={() => navigate("/wallet")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ⬅ Retour au Wallet
      </motion.button>
    </motion.div>
  );
};

export default Depots;
