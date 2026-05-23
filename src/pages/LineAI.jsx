// src/pages/LineAI.jsx

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import "./LineAI.css";

const LineAI = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="lineai-container">

      {/* =========================
          SECTION DU HAUT
      ========================== */}
      <div className="lineai-top">
        <h1>LineAI</h1>
        <p>Ton assistant intelligent nouvelle génération.</p>
      </div>

      {/* =========================
          SECTION DU BAS
      ========================== */}
      <div className="lineai-input-wrapper">

        <div className="lineai-input-container">

          <textarea
            className="lineai-input"
            placeholder="Écris ton message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
          />

          <button className="lineai-send-button">
            <Sparkles size={18} />
          </button>

        </div>

        <div className="lineai-hint">
          Entrée = envoyer · Shift+Entrée = ligne
        </div>

      </div>
    </div>
  );
};

export default LineAI;