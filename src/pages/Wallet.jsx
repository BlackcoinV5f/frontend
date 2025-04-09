import React, { useState, useEffect } from "react";
import "./Wallet.css"; // Assure-toi d'avoir un fichier de style pour le Wallet

const Wallet = () => {
  // 🔄 Chargement du solde du Wallet depuis `localStorage`
  const [walletPoints, setWalletPoints] = useState(() => {
    return JSON.parse(localStorage.getItem("wallet")) || 0;
  });

  // ✅ Met à jour automatiquement le wallet quand `localStorage` change
  useEffect(() => {
    const updateWallet = () => {
      setWalletPoints(JSON.parse(localStorage.getItem("wallet")) || 0);
    };
    
    window.addEventListener("storage", updateWallet);
    return () => window.removeEventListener("storage", updateWallet);
  }, []);

  return (
    <div className="wallet-container">
      <h2>💰 Mon Wallet</h2>
      <div className="wallet-balance">
        <p>Solde actuel : <span>{walletPoints} pts</span></p>
      </div>
      <p>🔹 20% des points gagnés via Tasks vont ici.</p>
      <p>🔹 15% des points de parrainage vont ici.</p>
    </div>
  );
};

export default Wallet;
