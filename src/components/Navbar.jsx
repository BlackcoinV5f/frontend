// src/components/Navbar.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaUserCircle, FaStar, FaFire, FaChartBar } from "react-icons/fa";
import UserProfile from "./UserProfile";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <nav className="navbar">
        <span onClick={() => setShowProfile(true)} className="nav-item">
          <FaUserCircle className="nav-icon small-icon" />
          <span className="small-text">{user?.username || "Guest"}</span>
        </span>
        <Link to="/level" className="nav-item">
          <FaStar className="nav-icon small-icon" />
          <span className="small-text">Level</span>
        </Link>
        <Link to="/balance" className="nav-item">
          <FaFire className="nav-icon small-icon" />
          <span className="small-text">Points</span>
        </Link>
        <Link to="/ranking" className="nav-item">
          <FaChartBar className="nav-icon small-icon" />
          <span className="small-text">Ranking</span>
        </Link>
      </nav>
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
