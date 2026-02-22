import React, { useEffect, useState } from "react";
import BlackAiLogo from "../assets/BlackAiLogo.png";
import "./BlackAI.css";

const BlackAI = () => {
  const [particles, setParticles] = useState([]);

  // Générer des particules pour l'effet d'arrière-plan
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${3 + Math.random() * 4}s`
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="blackai-page">
      {/* Particules d'arrière-plan */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration
            }}
          />
        ))}
      </div>

      {/* Logo avec animation */}
      <img 
        src={BlackAiLogo} 
        alt="BlackAi Logo" 
        className="blackai-logo-top"
        onClick={() => {
          // Animation supplémentaire au clic
          const logo = document.querySelector('.blackai-logo-top');
          logo.style.animation = 'none';
          logo.offsetHeight; // Force reflow
          logo.style.animation = 'logoFloat 3s ease-in-out infinite, logoGlow 2s ease-in-out infinite, logoRotate 10s linear infinite';
        }}
      />

      {/* Message */}
      <div className="blackai-message">
        <p>
          BlackAi est actuellement indisponible pour le moment.
          <br />
          L'équipe technique de BlackCoin met tout en œuvre pour qu'il soit opérationnel dès que possible.
        </p>
      </div>
    </div>
  );
};

export default BlackAI;