import React from "react";
import { motion } from "framer-motion";
import "./Info.css";

// Icônes (remplace par tes propres icônes ou librairie comme react-icons)
const SocialIcon = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, y: -5 }}
    whileTap={{ scale: 0.9 }}
    className="social-icon"
  >
    <span role="img" aria-label={label}>{icon}</span>
  </motion.a>
);

const Info = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="info-container"
    >
      <h2>📢 Informations BLACKCOIN</h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="highlight"
      >
        L'équipe <strong>BLACKCOIN</strong> continue activement le développement avec de nouvelles fonctionnalités excitantes à venir !
      </motion.p>

      <div className="social-grid">
        <SocialIcon href="https://t.me/blackcoin" icon="📢" label="Telegram" />
        <SocialIcon href="https://x.com/blackcoin" icon="𝕏" label="X (Twitter)" />
        <SocialIcon href="https://facebook.com/blackcoin" icon="📘" label="Facebook" />
        <SocialIcon href="https://youtube.com/blackcoin" icon="▶️" label="YouTube" />
      </div>

      <motion.div 
        className="roadmap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3>🚀 Feuille de route</h3>
        <ul>
          <motion.li whileHover={{ x: 5 }}>✓ Système de tâches avec récompenses</motion.li>
          <motion.li whileHover={{ x: 5 }}>✓ Portefeuille crypto intégré</motion.li>
          <motion.li whileHover={{ x: 5 }}>✓ Marketplace NFT (en développement)</motion.li>
          <motion.li whileHover={{ x: 5 }}>✓ IA de recommandation (2024)</motion.li>
        </ul>
      </motion.div>

      <motion.p
        className="footer-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Rejoignez-nous pour construire l'avenir de la finance décentralisée !
      </motion.p>
    </motion.div>
  );
};

export default Info;