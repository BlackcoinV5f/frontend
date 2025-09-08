// src/components/Navbar.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaUserCircle, FaFire, FaCog } from "react-icons/fa"; // ⚡ Ajout FaCog
import UserProfile from "./UserProfile";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <nav className="navbar">
        {/* 👤 Profil utilisateur */}
        <span onClick={() => setShowProfile(true)} className="nav-item">
          <FaUserCircle className="nav-icon small-icon" />
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

      {/* 👤 Modal profil */}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
};

export default Navbar;
