// src/contexts/AdmContext.jsx
import React, { createContext, useContext, useState, useMemo } from "react";
import axios from "axios";
import { useUser } from "./UserContext"; // ✅ on importe le contexte utilisateur

// 🟢 Création du contexte Admin (second serveur)
const AdmContext = createContext(null);

export const AdmProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  // ✅ On récupère le user et axiosInstance du UserContext
  const { user } = useUser();

  // 🧩 Chargement des URLs depuis le .env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // secondaire
  const DEPOSIT_API_URL = import.meta.env.VITE_DEPOSIT_API_URL; // secondaire aussi

  if (!API_BASE_URL || !DEPOSIT_API_URL) {
    console.error(
      "❌ Erreur de configuration : VITE_API_BASE_URL ou VITE_DEPOSIT_API_URL est manquant dans le fichier .env"
    );
  }

  // ⚙️ Axios principal (serveur secondaire)
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }, [API_BASE_URL]);

  // 💰 Axios dépôts / retraits (second serveur)
  const axiosDeposit = useMemo(() => {
    return axios.create({
      baseURL: DEPOSIT_API_URL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }, [DEPOSIT_API_URL]);

  // 🧠 Valeur du contexte : inclut maintenant le `user` du UserContext
  const value = useMemo(
    () => ({
      admin,
      setAdmin,
      user,            // ✅ injecté depuis le UserContext
      axiosInstance,
      axiosDeposit,
    }),
    [admin, user, axiosInstance, axiosDeposit]
  );

  return <AdmContext.Provider value={value}>{children}</AdmContext.Provider>;
};

// 🔒 Hook sécurisé
export const useAdm = () => {
  const context = useContext(AdmContext);
  if (!context) {
    throw new Error("❌ useAdm() doit être utilisé à l'intérieur d'un <AdmProvider>");
  }
  return context;
};
