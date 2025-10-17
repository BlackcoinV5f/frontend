import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdm } from "../contexts/AdmContext"; // ✅ utiliser AdmContext maintenant
import { FaMoneyBillWave } from "react-icons/fa";
import "./DepositMethods.css";

const DepositMethods = () => {
  const { axiosDeposit } = useAdm(); // ✅ serveur dépôt/retrait
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await axiosDeposit.get("/transaction-methods/"); // ✅ serveur dépôt
        setMethods(res.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des méthodes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, [axiosDeposit]);

  if (loading) {
    return (
      <div className="methods-loading">
        <div className="spinner" />
        <p>Chargement des méthodes de dépôt...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="methods-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="methods-header">
        <FaMoneyBillWave className="methods-header-icon" />
        <h2>Choisissez une méthode de dépôt</h2>
      </div>

      <div className="methods-grid">
        {methods.map((method) => (
          <motion.div
            key={method.id}
            className="method-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/deposits/${method.id}`)}
          >
            <div className="method-image-wrapper">
              <img
                src={method.icon_url}
                alt={method.name}
                className="method-icon"
              />
              {method.flag_url && (
                <img
                  src={method.flag_url}
                  alt={method.country}
                  className="country-flag"
                />
              )}
            </div>
            <p className="method-name">{method.name}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="back-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/wallet")}
      >
        ⬅ Retour au Wallet
      </motion.button>
    </motion.div>
  );
};

export default DepositMethods;
