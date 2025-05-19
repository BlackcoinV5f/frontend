import React, { useState } from "react";
import "./Actions.css";

const images = import.meta.glob("../assets/icon*.png", { eager: true });

const icons = Object.entries(images).map(([path, module], index) => ({
  id: index + 1,
  imageUrl: module.default,
  title: `Action ${index + 1}`,
  description: "Description générique.",
}));

const Actions = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);

  return (
    <div className="actions-container">
      {icons.map((icon) => (
        <div key={icon.id} className="action-icon" onClick={() => setSelectedIcon(icon)}>
          <img src={icon.imageUrl} alt={icon.title} />
        </div>
      ))}

      {selectedIcon && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedIcon.title}</h2>
            <img src={selectedIcon.imageUrl} alt={selectedIcon.title} />
            <p>{selectedIcon.description}</p>
            <button onClick={() => alert("Contribute !")}>Contribute</button>
            <button onClick={() => setSelectedIcon(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Actions;