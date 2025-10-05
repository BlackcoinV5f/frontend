import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import './ActionsLogo.css';

const ActionsLogo = () => {
  return (
    <Link to="/actions" className="actions-logo-link">
      <div className="actions-logo-container">
        <div className="logo-main">
          <div className="sip-text">
            <span className="letter s">S</span>
            <span className="letter i">
              I
              <div className="growth-icon">
                <div className="bar bar-1"></div>
                <div className="bar bar-2"></div>
                <div className="bar bar-3"></div>
                <div className="arrow"></div>
              </div>
            </span>
            <span className="letter p">P</span>
          </div>

          <div className="subtitle">
            <span className="by">by</span>
            <span className="blckcoin">Blckcoin</span>
            <div className="coins">
              <div className="coin coin-1"></div>
              <div className="coin coin-2"></div>
              <div className="coin coin-3"></div>
            </div>
          </div>
        </div>

        {/* Effets d'ondulation */}
        <div className="ripple ripple-1"></div>
        <div className="ripple ripple-2"></div>
        <div className="ripple ripple-3"></div>
      </div>
    </Link>
  );
};

export default ActionsLogo;
