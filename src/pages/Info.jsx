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
        avec de nombreuses fonctionnalités majeures en préparation.
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
          Lancé le <strong>21 mars 2024</strong>, il est toujours en développement actif, 
          avec des améliorations continues.
        </p>
      </motion.div>

      {/* AVANCEMENT DU DÉVELOPPEMENT */}
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
          <motion.li whileHover={{ x: 5 }}>📈 Achats & ventes d’actions : <strong>50%</strong></motion.li>
          <motion.li whileHover={{ x: 5 }}>🎮 Jeux de loisirs pour gagner des points : <strong>65%</strong></motion.li>
        </ul>

        <p className="info-note">
          ⚠️ Les informations présentes ici peuvent évoluer à tout moment selon 
          l’avancée du développement.
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
          Le service <strong>SIP — Service d’Investissement Personnel</strong> propose 
          uniquement des actions réelles, validées en partenariat avec différentes 
          structures à travers le monde.
        </p>

        <p>
          Par exemple, dans la section <strong>Finance</strong>, nous avons conclu 
          des accords avec plusieurs banques privées et indépendantes dans 
          différents pays.
        </p>

        <p>
          Nous garantissons une totale transparence :  
          tous les accords, mécanismes et engagements sont expliqués sur nos 
          réseaux sociaux officiels.
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
