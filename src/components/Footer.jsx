import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaUserFriends,
  FaInfoCircle,
  FaWallet,
} from "react-icons/fa";
import { useUser } from "../contexts/UserContext";

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // 🔥 blocage onboarding
  const isBlocked = user && !user.has_completed_welcome_tasks;

  const handleNavigation = (path) => {
    if (isBlocked) {
      navigate("/welcome");
      return;
    }
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="bottom-bar">

        <span
          onClick={() => handleNavigation("/home")}
          className={`nav-item ${isBlocked ? "disabled" : ""}`}
        >
          <FaHome className="icon" />
          <span className="nav-text">Home</span>
        </span>

        <span
          onClick={() => handleNavigation("/tasks")}
          className={`nav-item ${isBlocked ? "disabled" : ""}`}
        >
          <FaTasks className="icon" />
          <span className="nav-text">Tasks</span>
        </span>

        <span
          onClick={() => handleNavigation("/friends")}
          className={`nav-item ${isBlocked ? "disabled" : ""}`}
        >
          <FaUserFriends className="icon" />
          <span className="nav-text">Friends</span>
        </span>

        <span
          onClick={() => handleNavigation("/info")}
          className={`nav-item ${isBlocked ? "disabled" : ""}`}
        >
          <FaInfoCircle className="icon" />
          <span className="nav-text">Info</span>
        </span>

        <span
          onClick={() => handleNavigation("/wallet")}
          className={`nav-item ${isBlocked ? "disabled" : ""}`}
        >
          <FaWallet className="icon" />
          <span className="nav-text">Wallet</span>
        </span>

      </div>
    </footer>
  );
};

export default Footer;