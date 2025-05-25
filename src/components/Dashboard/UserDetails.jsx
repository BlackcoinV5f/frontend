// src/components/Dashboard/UserDetails.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = state?.user;

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">⚠️ Aucun utilisateur sélectionné.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Détails de l'utilisateur</h2>
      <div className="bg-white rounded shadow p-4 space-y-2 border">
        <p><strong>ID :</strong> {user.id}</p>
        <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Vérifié :</strong> {user.isVerified ? "✔️ Oui" : "❌ Non"}</p>
        <p><strong>Date de création :</strong> {user.createdAt}</p>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        ⬅️ Retour au tableau
      </button>
    </div>
  );
};

export default UserDetails;
