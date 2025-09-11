import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaHome, FaTasks, FaUserFriends, FaInfoCircle, FaWallet } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bottom-bar">
      <Link to="/" className="nav-item">
        <FaHome className="icon" />
        <span className="nav-text">Home</span>
      </Link>
      <Link to="/tasks" className="nav-item">
        <FaTasks className="icon" />
        <span className="nav-text">Tasks</span>
      </Link>
      <Link to="/friends" className="nav-item">
        <FaUserFriends className="icon" />
        <span className="nav-text">Friends</span>
      </Link>
      <Link to="/info" className="nav-item">
        <FaInfoCircle className="icon" />
        <span className="nav-text">Info</span>
      </Link>
      <Link to="/wallet" className="nav-item">
        <FaWallet className="icon" />
        <span className="nav-text">Wallet</span>
      </Link>
    </div>
  );
};

export default Footer;