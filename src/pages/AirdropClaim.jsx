import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import "./AirdropClaim.css";

// plateformes autorisées
const PLATFORMS = {
  binance: { type: "exchange", label: "Binance" },
  bitget: { type: "exchange", label: "Bitget" },
  bybit: { type: "exchange", label: "Bybit" },
  okx: { type: "exchange", label: "OKX" },
  gate: { type: "exchange", label: "Gate.io" },
  mexc: { type: "exchange", label: "MEXC" },
  "ton-wallet": { type: "wallet", label: "Ton Wallet" },
  metamask: { type: "wallet", label: "MetaMask" },
};

const AirdropClaim = () => {
  const { platformId } = useParams();

  // 🔐 Sécurité : plateforme inconnue
  if (!PLATFORMS[platformId]) {
    return <Navigate to="/airdrop" replace />;
  }

  const platform = PLATFORMS[platformId];

  const [form, setForm] = useState({
    identifier: "",
    bkcAddress: "",
    memo: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      platform: platformId,
      type: platform.type,
      ...form,
    };

    console.log("Airdrop claim:", payload);
    alert("Demande envoyée (mock)");
  };

  return (
    <div className="airdrop-claim-page">
      <h2>Airdrop – {platform.label}</h2>

      <form className="airdrop-form" onSubmit={handleSubmit}>
        {/* Exchange uniquement */}
        {platform.type === "exchange" && (
          <label>
            Identifiant / UID
            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="Votre UID / Email"
              required
            />
          </label>
        )}

        {/* Wallet uniquement */}
        {platform.type === "wallet" && (
          <label>
            Adresse du wallet
            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="Adresse du wallet"
              required
            />
          </label>
        )}

        <label>
          Adresse BKC
          <input
            type="text"
            name="bkcAddress"
            value={form.bkcAddress}
            onChange={handleChange}
            placeholder="Adresse BKC"
            required
          />
        </label>

        <label>
          Memo (optionnel)
          <input
            type="text"
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="Memo si nécessaire"
          />
        </label>

        <button type="submit">Envoyer la demande</button>
      </form>
    </div>
  );
};

export default AirdropClaim;
