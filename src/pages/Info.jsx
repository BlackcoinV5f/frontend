import React from "react";
import { motion } from "framer-motion";
import "./Info.css";

const SocialIcon = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, y: -5 }}
    whileTap={{ scale: 0.9 }}
    className="social-icon"
    title={label}
  >
    <span role="img" aria-label={label}>
      {icon}
    </span>
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
      <h2>📢 Informations Officielles — BLACKCOIN</h2>

      {/* INTRODUCTION */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="highlight"
      >
        L’équipe <strong>BLACKCOIN</strong> poursuit activement le développement
        du projet avec de nombreuses fonctionnalités majeures en préparation.
      </motion.p>

      {/* SOCIALS */}
      <div className="social-grid">
        <SocialIcon
          href="https://t.me/+VXuf93TxzKxlMzE0"
          icon="📢"
          label="Telegram"
        />

        <SocialIcon
          href="https://x.com/BlackcoinON"
          icon="𝕏"
          label="X (Twitter)"
        />

        <SocialIcon
          href="https://www.facebook.com/share/1CjsWSj1P3/"
          icon="📘"
          label="Facebook"
        />

        <SocialIcon
          href="https://www.youtube.com/@Blackcoinchaine"
          icon="▶️"
          label="YouTube"
        />

        <SocialIcon
          href="https://www.instagram.com/blackcoin_bkc"
          icon="📸"
          label="Instagram"
        />

        <SocialIcon
          href="https://www.tiktok.com/@blackcoin_official"
          icon="🎵"
          label="TikTok"
        />
      </div>

      {/* DESCRIPTION DU PROJET */}
      <motion.div
        className="section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <h3>🌍 À propos du projet</h3>
        <p>
          BLACKCOIN est une initiative collaborative internationale lancée le
          <strong> 21 mars 2024</strong>, avec pour objectif de construire un
          écosystème numérique solide, transparent et durable.
        </p>

        <p>
          Pour consulter le <strong>Livre Blanc</strong>, la
          <strong> Feuille de route</strong> ainsi que la
          <strong> Politique de confidentialité</strong>,
          veuillez visiter notre site officiel :
        </p>

        <motion.a
          href="https://blackcoinweb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="official-link"
          whileHover={{ scale: 1.05 }}
        >
          🌐 www.blackcoinweb.com
        </motion.a>
      </motion.div>

      {/* NOTE IMPORTANTE */}
      <motion.div
        className="section important"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3>📌 Communication Officielle</h3>
        <p>
          Toutes les informations officielles, mises à jour et annonces
          importantes concernant le projet BLACKCOIN sont publiées
          exclusivement via notre site officiel et nos réseaux sociaux.
        </p>

        <p>
          Nous vous invitons à toujours vérifier les informations via nos
          canaux officiels afin d’éviter toute confusion.
        </p>
      </motion.div>

      {/* FOOTER */}
      <motion.p
        className="footer-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Merci de faire partie de l’évolution de BLACKCOIN.
      </motion.p>
    </motion.div>
  );
};

export default Info;
