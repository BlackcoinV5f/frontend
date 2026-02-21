// src/pages/BlackAI.jsx
import React from "react";
import BlackAiLogo from "../assets/BlackAiLogo.png"; // adapte le chemin si besoin
import "./BlackAI.css";

const BlackAI = () => {
  return (
    <div className="blackai-page">
      {/* Logo en haut */}
      <img src={BlackAiLogo} alt="BlackAi Logo" className="blackai-logo-top" />

      {/* Message */}
      <div className="blackai-message">
        <p>
          BlackAi est actuellement indisponible pour le moment.<br />
          L'équipe technique de BlackCoin met tout en œuvre pour qu'il soit opérationnel dès que possible.
        </p>
      </div>
    </div>
  );
};

export default BlackAI;