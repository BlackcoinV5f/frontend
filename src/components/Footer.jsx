import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaHome, FaTasks, FaUserFriends, FaInfoCircle, FaWallet } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="bottom-bar">
      <Link to="/"><FaHome className="icon" /> Home</Link>
      <Link to="/tasks"><FaTasks className="icon" /> Tasks</Link>
      <Link to="/friends"><FaUserFriends className="icon" /> Friends</Link>
      <Link to="/info"><FaInfoCircle className="icon" /> Info</Link>
      <Link to="/wallet"><FaWallet className="icon" /> Wallet</Link>
    </div>
  );
};

export default Footer;