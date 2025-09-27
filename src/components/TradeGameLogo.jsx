// src/components/TradeGameLogo.jsx
import React from "react";
import { Link } from "react-router-dom";   // ✅ importer Link
import styles from "./TradeGameLogo.module.css";

export default function TradeGameLogo() {
  return (
    <div className={styles.tradeLogoContainer}>
      {/* Le clic sur le logo entier redirige vers /tradegame */}
      <Link to="/tradegame" className={styles.tradeLogoLink}>
        <div className={`${styles.tradeCoin} ${styles.tradeBitcoin}`}>₿</div>
        <div className={`${styles.tradeCoin} ${styles.tradePi}`}>π</div>
        <div className={`${styles.tradeCoin} ${styles.tradeToncoin}`}>TON</div>

        <div className={`${styles.tradeTrail} ${styles.tradeTrail1}`}></div>
        <div className={`${styles.tradeTrail} ${styles.tradeTrail2}`}></div>
        <div className={`${styles.tradeTrail} ${styles.tradeTrail3}`}></div>

        <div className={styles.tradeTitle}>Vers de nouveaux sommets</div>
      </Link>
    </div>
  );
}
