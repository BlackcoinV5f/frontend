// src/components/Navbar.jsx
import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { FaFire, FaCog } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // 🧩 Génération d'un avatar dynamique si pas de photo
  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";
  const getColorFromName = (name) => {
    const colors = ["#4a90e2", "#e67e22", "#2ecc71", "#9b59b6", "#e74c3c"];
    let hash = 0;
    for (let i = 0; i < name?.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarSrc = user?.avatar_url || null;
  const avatarColor = getColorFromName(user?.first_name || user?.username);

  return (
    <nav className="navbar">
      {/* 👤 Profil utilisateur */}
      <span onClick={handleProfileClick} className="nav-item cursor-pointer">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="Avatar"
            className="nav-avatar"
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <div
            className="nav-avatar-placeholder"
            style={{
              backgroundColor: avatarColor,
              color: "white",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {getInitial(user?.first_name || user?.username)}
          </div>
        )}
        <span className="small-text">{user?.username || "Guest"}</span>
      </span>

      {/* 🔥 Points */}
      <Link to="/balance" className="nav-item">
        <FaFire className="nav-icon small-icon" />
        <span className="small-text">Points</span>
      </Link>

      {/* ⚙️ Paramètres */}
      <Link to="/settings" className="nav-item">
        <FaCog className="nav-icon small-icon" />
        <span className="small-text">Settings</span>
      </Link>
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    first_name: PropTypes.string,
    avatar_url: PropTypes.string,
  }),
};

export default Navbar;
