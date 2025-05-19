import React, { useEffect } from "react";
import "./SplashScreen.css"; // Vérifie que le fichier est bien importé

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    console.log("SplashScreen affiché !"); // ✅ Vérifier si le composant s'affiche

    if (!onFinish) {
      console.error("⚠️ ERREUR : onFinish n'est pas défini !");
      return;
    }

    const timer = setTimeout(() => {
      console.log("SplashScreen terminé !");
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-container">
      <img src="/logo.png" alt="Logo" className="splash-logo" />
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
