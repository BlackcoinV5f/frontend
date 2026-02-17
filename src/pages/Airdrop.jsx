import React from "react";
import { useNavigate } from "react-router-dom";
import "./Airdrop.css";

// Logos exchanges
import BinanceLogo from "../assets/airdrop/binance.png";
import BitgetLogo from "../assets/airdrop/bitget.png";
import BybitLogo from "../assets/airdrop/bybit.png";
import OkxLogo from "../assets/airdrop/okx.png";
import GateLogo from "../assets/airdrop/gate.png";
import MexcLogo from "../assets/airdrop/mexc.png";

// Logos on-chain
import TonWalletLogo from "../assets/airdrop/ton-wallet.png";
import MetamaskLogo from "../assets/airdrop/metamask.png";

const exchanges = [
  { id: "binance", name: "Binance", logo: BinanceLogo },
  { id: "bitget", name: "Bitget", logo: BitgetLogo },
  { id: "bybit", name: "Bybit", logo: BybitLogo },
  { id: "okx", name: "OKX", logo: OkxLogo },
  { id: "gate", name: "Gate.io", logo: GateLogo },
  { id: "mexc", name: "MEXC", logo: MexcLogo },
];

const wallets = [
  { id: "ton-wallet", name: "Ton Wallet", logo: TonWalletLogo },
  { id: "metamask", name: "MetaMask", logo: MetamaskLogo },
];

const Airdrop = () => {
  const navigate = useNavigate();

  const goToClaim = (platformId) => {
    navigate(`/airdrop/${platformId}`);
  };

  return (
    <div className="airdrop-page">
      <h2 className="airdrop-title">Airdrop Claim</h2>

      <section className="airdrop-section">
        <div className="section-header">
          <h3>Exchanges</h3>
        </div>
        <div className="airdrop-scroll-container">
          <div className="airdrop-grid">
            {exchanges.map((item) => (
              <div
                key={item.id}
                className="airdrop-card"
                onClick={() => goToClaim(item.id)}
              >
                <img src={item.logo} alt={item.name} className="platform-logo" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="airdrop-section">
        <div className="section-header">
          <h3>On-chain Wallets</h3>
        </div>
        <div className="airdrop-scroll-container">
          <div className="airdrop-grid">
            {wallets.map((item) => (
              <div
                key={item.id}
                className="airdrop-card"
                onClick={() => goToClaim(item.id)}
              >
                <img src={item.logo} alt={item.name} className="platform-logo" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Airdrop;