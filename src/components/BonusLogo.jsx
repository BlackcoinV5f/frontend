// src/components/BonusLogo.jsx
import React from "react";
import { FaGift } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./BonusLogo.css";

const BonusLogo = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/bonus"); // ✅ Ouvre simplement la page Bonus
  };

  return (
    <div className="bonus-logo-container" onClick={handleClick}>
      <div className="bonus-logo">
        <FaGift />
      </div>
    </div>
  );
};

export default BonusLogo;
