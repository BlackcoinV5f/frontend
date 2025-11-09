// src/pages/RetraitMethode.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdm } from "../contexts/AdmContext";
import "./RetraitMethode.css";

const RetraitMethode = () => {
  const { axiosDeposit } = useAdm();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await axiosDeposit.get("/withdraw-methods");
        setMethods(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des méthodes de retrait :", err);
        setError("Impossible de charger les méthodes de retrait pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, [axiosDeposit]);

  const handleSelectMethod = (method) => {
    navigate("/retrait", { state: { selectedMethod: method } });
  };

  if (loading) return <p className="withdraw-loading">Chargement des méthodes...</p>;
  if (error) return <p className="withdraw-error">{error}</p>;
  if (methods.length === 0) return <p className="withdraw-empty">Aucune méthode de retrait disponible.</p>;

  return (
    <div className="withdraw-container">
      <h2 className="withdraw-title">💸 Choisissez votre méthode de retrait</h2>

      <div className="withdraw-list">
        {methods.map((method, index) => (
          <motion.div
            key={index}
            className="withdraw-card"
            onClick={() => handleSelectMethod(method)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={method.icon_url}
              alt={method.name}
              className="withdraw-icon"
            />
            <div className="withdraw-info">
              <h3>{method.name}</h3>
              <p>{method.country || "Pays non spécifié"}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RetraitMethode;
