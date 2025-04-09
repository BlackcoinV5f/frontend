// src/components/CryptoList.jsx
import React, { useEffect, useState } from 'react';
import './CryptoList.css';

const coinList = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'pepe', symbol: 'PEPE' },
  { id: 'dogecoin', symbol: 'DOGE' },
  { id: 'trump', symbol: 'TRUMP' },
  { id: 'pi-network', symbol: 'PI' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'toncoin', symbol: 'TON' },
  { id: 'gogolcoin', symbol: 'GOGS' },
  { id: 'ripple', symbol: 'XRP' },
  { id: 'cosmos', symbol: 'ATOM' },
  { id: 'tron', symbol: 'TRON' },
];

const CryptoList = () => {
  const [cryptoData, setCryptoData] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = coinList.map((c) => c.id).join(',');
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

        const res = await fetch(url);
        const data = await res.json();
        setCryptoData(data);
      } catch (error) {
        console.error('Erreur récupération crypto :', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // rafraîchit toutes les 10 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="crypto-list-container">
      {coinList.map((coin) => {
        const price = cryptoData[coin.id]?.usd;
        const change = cryptoData[coin.id]?.usd_24h_change;

        const isUp = change >= 0;

        return (
          <div key={coin.id} className="crypto-item">
            <span className="crypto-price">${price?.toFixed(2)}</span>
            <span className="crypto-symbol">{coin.symbol}</span>
            <span className={`crypto-change ${isUp ? 'up' : 'down'}`}>
              {change?.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CryptoList;