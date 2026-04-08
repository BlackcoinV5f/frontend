// src/pages/RetraitMethode.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdm } from "../contexts/AdmContext";
import { useQuery } from "@tanstack/react-query";
import "./RetraitMethode.css";

export default function RetraitMethode() {
  const { axiosDeposit } = useAdm();
  const navigate = useNavigate();

  // ✅ React Query pour récupérer les méthodes de retrait
  const {
    data: methods,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["withdrawMethods"],
    queryFn: async () => {
      const res = await axiosDeposit.get("/withdraw-methods");
      return res.data || [];
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const handleSelectMethod = (method) => {
    navigate("/retrait", { state: { selectedMethod: method } });
  };

  if (isLoading) return <p className="withdraw-loading">Chargement des méthodes...</p>;
  if (isError) return <p className="withdraw-error">❌ Impossible de charger les méthodes de retrait</p>;
  if (!methods || methods.length === 0) return <p className="withdraw-empty">Aucune méthode de retrait disponible.</p>;

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
}