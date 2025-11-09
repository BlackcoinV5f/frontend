// src/components/Navbar.jsx
import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaFire, FaCog } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile"); // redirection vers la page complète
  };

  return (
    <nav className="navbar">
      {/* 👤 Profil utilisateur */}
      <span onClick={handleProfileClick} className="nav-item cursor-pointer">
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
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
};

export default Navbar;
