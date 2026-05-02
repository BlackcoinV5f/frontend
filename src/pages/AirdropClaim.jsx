import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t, ready } = useTranslation("profil");

  // ⛔ attendre que les traductions soient chargées
  if (!ready) {
    return <div className="loading">Chargement...</div>;
  }

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
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
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

    alert(t("airdropClaim.messages.success"));
  };

  return (
    <div className="airdrop-claim-page">
      <h2>
        {t("airdropClaim.title")} – {platform.label}
      </h2>

      <form className="airdrop-form" onSubmit={handleSubmit}>
        
        {/* Exchange */}
        {platform.type === "exchange" && (
          <label>
            {t("airdropClaim.fields.uid")}
            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder={t("airdropClaim.fields.uidPlaceholder")}
              required
            />
          </label>
        )}

        {/* Wallet */}
        {platform.type === "wallet" && (
          <label>
            {t("airdropClaim.fields.wallet")}
            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder={t("airdropClaim.fields.wallet")}
              required
            />
          </label>
        )}

        {/* BKC */}
        <label>
          {t("airdropClaim.fields.bkc")}
          <input
            type="text"
            name="bkcAddress"
            value={form.bkcAddress}
            onChange={handleChange}
            placeholder={t("airdropClaim.fields.bkc")}
            required
          />
        </label>

        {/* Memo */}
        <label>
          {t("airdropClaim.fields.memo")}
          <input
            type="text"
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder={t("airdropClaim.fields.memoPlaceholder")}
          />
        </label>

        <button type="submit">
          {t("airdropClaim.actions.submit")}
        </button>
      </form>
    </div>
  );
};

export default AirdropClaim;