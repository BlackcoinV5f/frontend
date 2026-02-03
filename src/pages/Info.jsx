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
      <h2>📢 Informations Officielles — BLACKCOIN</h2>

      {/* INTRODUCTION */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="highlight"
      >
        L’équipe <strong>BLACKCOIN</strong> poursuit activement le développement du projet,
        avec de nombreuses fonctionnalités majeures actuellement en préparation.
      </motion.p>

      {/* SOCIALS */}
      <div className="social-grid">
        <SocialIcon href="https://t.me/blackcoin" icon="📢" label="Telegram" />
        <SocialIcon href="https://x.com/blackcoin" icon="𝕏" label="X (Twitter)" />
        <SocialIcon href="https://facebook.com/blackcoin" icon="📘" label="Facebook" />
        <SocialIcon href="https://youtube.com/blackcoin" icon="▶️" label="YouTube" />
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
          Le projet <strong>BLACKCOIN</strong> est une initiative collaborative réunissant
          plusieurs membres issus de différents pays.
          Lancé le <strong>21 mars 2024</strong>, le projet est en développement continu,
          avec pour objectif de bâtir un écosystème solide et durable.
        </p>
      </motion.div>

      {/* AVANCEMENT */}
      <motion.div
        className="roadmap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3>🚀 État d’avancement du développement</h3>
        <ul>
          <motion.li whileHover={{ x: 5 }}>🔧 Système de minage : <strong>85%</strong></motion.li>
          <motion.li whileHover={{ x: 5 }}>🤝 Système de parrainage : <strong>90%</strong></motion.li>
          <motion.li whileHover={{ x: 5 }}>👛 Intégration du wallet : <strong>70%</strong></motion.li>
          <motion.li whileHover={{ x: 5 }}>💳 Dépôts & retraits : <strong>70%</strong></motion.li>
          <motion.li whileHover={{ x: 5 }}>📈 Investissement & parts du projet : <strong>50%</strong></motion.li>
          <motion.li whileHover={{ x: 5 }}>🎮 Jeux de loisirs pour gagner des points : <strong>65%</strong></motion.li>
        </ul>

        <p className="info-note">
          ⚠️ Les informations affichées peuvent évoluer en fonction de l’avancement du projet.
        </p>
      </motion.div>

      {/* CLARIFICATIONS IMPORTANTES */}
      <motion.div
        className="section important"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
      >
        <h3>📌 IMPORTANT — Clarifications</h3>

        <p>
          Le service <strong>SIP — Système d’Investissement Participatif</strong> permet aux
          utilisateurs de contribuer financièrement au développement du projet
          <strong> BLACKCOIN</strong>.
        </p>

        <p>
          Ces contributions sont considérées comme des <strong>investissements dans le projet</strong>
          et donnent droit à des <strong>parts proportionnelles</strong>, selon les conditions
          définies par l’équipe.
        </p>

        <p>
          BLACKCOIN ne fonctionne pas comme une banque et ne propose aucun service bancaire.
          Il s’agit d’un <strong>modèle de financement participatif</strong> destiné à soutenir
          le lancement, la maintenance et l’évolution du projet.
        </p>

        <p>
          Par souci de transparence, toutes les règles, mécanismes et informations liées à
          l’investissement sont communiquées via nos canaux officiels.
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
