import React, { useEffect } from "react";
import "./Wallet.css";
import { useUser } from "../contexts/UserContext";

const Wallet = () => {
  const { user, wallet, fetchWallet } = useUser();

  useEffect(() => {
    if (user?.telegram_id) {
      fetchWallet(user.telegram_id);
    }
  }, [user]);

  return (
    <div className="wallet-container">
      <h2>💰 Mon Wallet</h2>
      <div className="wallet-balance">
        <p>
          Solde actuel :{" "}
          <span>{wallet?.balance !== undefined ? wallet.balance : "Chargement..."} pts</span>
        </p>
      </div>
      <p>🔹 20% des points gagnés via les tâches vont ici.</p>
      <p>🔹 15% des points issus du parrainage vont ici.</p>
    </div>
  );
};

export default Wallet;
