import React, { useEffect, useState } from "react";
import "./AdminPanel.css";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const dummyUsers = [
      {
        id: 1,
        username: "dokpoadele",
        email: "bkcblackcoin@gmail.com",
        isVerified: true,
        isActive: true,
        createdAt: "2025-05-22",
      },
      {
        id: 2,
        username: "john_doe",
        email: "john@example.com",
        isVerified: false,
        isActive: true,
        createdAt: "2025-05-20",
      },
    ];
    setUsers(dummyUsers);
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Confirmer la suppression ?");
    if (confirmDelete) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleVerify = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isVerified: true } : user
      )
    );
  };

  const handleToggleActive = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const handleDetails = (user) => {
    navigate("/admin/user-details", { state: { user } });
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Tableau Administratif</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Vérifié</th>
            <th>Statut</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isVerified ? "✔️" : "❌"}</td>
              <td>{user.isActive ? "✅ Actif" : "🚫 Inactif"}</td>
              <td>{user.createdAt}</td>
              <td>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="action-btn delete"
                >
                  Supprimer
                </button>

                {!user.isVerified && (
                  <button
                    onClick={() => handleVerify(user.id)}
                    className="action-btn verify"
                  >
                    Vérifier
                  </button>
                )}

                <button
                  onClick={() => handleToggleActive(user.id)}
                  className="action-btn toggle"
                >
                  {user.isActive ? "Désactiver" : "Réactiver"}
                </button>

                <button
                  onClick={() => handleDetails(user)}
                  className="action-btn details"
                >
                  Détails
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
