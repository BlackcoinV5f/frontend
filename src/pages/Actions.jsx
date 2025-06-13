import React, { useState, useEffect } from "react";
import "./Actions.css";
import { useUser } from "../contexts/UserContext";

// 🔄 Import dynamique des icônes (../assets/icon1.png, icon2.png, etc.)
const images = import.meta.glob("../assets/icon*.png", { eager: true });

// Construction d’un tableau d’actions à partir des fichiers d’icônes
const icons = Object.entries(images).map(([path, module], index) => ({
  id: index + 1,
  imageUrl: module.default,
  title: `Action ${index + 1}`,
  description: `Participe à l'action numéro ${index + 1} pour contribuer à la communauté !`,
}));

const Actions = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const { user, fetchBalance } = useUser();

  // 🔄 Rafraîchissement du solde
  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id).catch((err) =>
        console.error("Erreur lors du fetch du solde :", err)
      );
    }
  }, [user, fetchBalance]);

  // 🔐 Fermer la modal avec la touche ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedIcon(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ✨ Simulation de contribution (à remplacer par un appel backend)
  const handleContribute = () => {
    alert(`Merci pour ta contribution à ${selectedIcon.title} !`);
    setSelectedIcon(null);
    // TODO: envoyer vers backend pour enregistrer la participation
  };

  return (
    <div className="actions-container">
      <h2>⚡ Actions communautaires</h2>
      <p>Choisis une action pour contribuer :</p>

      <div className="actions-grid">
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="action-icon"
            onClick={() => setSelectedIcon(icon)}
          >
            <img src={icon.imageUrl} alt={icon.title} />
            <span>{icon.title}</span>
          </div>
        ))}
      </div>

      {selectedIcon && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedIcon.title}</h2>
            <img src={selectedIcon.imageUrl} alt={selectedIcon.title} />
            <p>{selectedIcon.description}</p>
            <div className="modal-buttons">
              <button onClick={handleContribute}>Contribuer</button>
              <button onClick={() => setSelectedIcon(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Actions;
