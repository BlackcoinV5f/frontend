import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaStar, FaFire, FaChartBar } from "react-icons/fa";
import UserProfile from "./UserProfile";
import "./Navbar.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/user-data`);
        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <nav className="navbar">
        <span onClick={() => setShowProfile(true)} className="nav-item">
          <FaUserCircle className="nav-icon small-icon" /> 
          <span className="small-text">{user && user.username ? user.username : "Guest"}</span>
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

export default Navbar;
