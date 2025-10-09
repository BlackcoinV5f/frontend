                                                                                                                                                                                                                                                  import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GiTakeMyMoney } from "react-icons/gi";
import "./Retraits.css";

const Retraits = () => {
  const navigate = useNavigate();
  const [montant, setMontant] = useState("");
  const [iban, setIban] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRetrait = async (e) => {
    e.preventDefault();

    if (!montant || !iban) {
      setMessage("Veuillez renseigner tous les champs.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Simulation d’un appel API (tu pourras le remplacer par ton backend)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessage(`✅ Retrait de ${montant} € vers ${iban} effectué avec succès !`);
      setMontant("");
      setIban("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Une erreur est survenue lors du retrait.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdraw-container">
      <div className="withdraw-header">
        <GiTakeMyMoney className="withdraw-icon" />
        <h2>Effectuer un Retrait</h2>
      </div>

      <form className="withdraw-form" onSubmit={handleRetrait}>
        <label htmlFor="iban">IBAN ou numéro de compte</label>
        <input
          id="iban"
          type="text"
          value={iban}
          onChange={(e) => setIban(e.target.value)}
          placeholder="Ex: FR76 1234 5678 9012 3456 7890 123"
        />

        <label htmlFor="montant">Montant (€)</label>
        <input
          id="montant"
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          placeholder="Entrez le montant à retirer"
        />

        <motion.button
          type="submit"
          className="withdraw-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Traitement..." : "Confirmer le Retrait"}
        </motion.button>
      </form>

      {message && <p className="withdraw-message">{message}</p>}

      <motion.button
        className="back-button"
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Retour
      </motion.button>
    </div>
  );
};

export default Retraits;
