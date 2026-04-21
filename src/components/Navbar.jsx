import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { FaFire, FaCog } from "react-icons/fa";
import { useBalance } from "../hooks/useBalance";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useBalance();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

  const getColorFromName = (name) => {
    const colors = ["#4a90e2", "#e67e22", "#2ecc71", "#9b59b6", "#e74c3c"];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarSrc = user?.avatar_url || null;
  const avatarColor = getColorFromName(user?.first_name || user?.username);

  const rawPoints = Number(data ?? 0);

  const formatPoints = (value) => {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(".0", "") + "M";
    }
    if (value >= 1_000) {
      return Math.floor(value / 1_000) + "K";
    }
    return value.toString();
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">

        {/* 👤 Profil */}
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
          <span className="small-text">
            {user?.username || "Guest"}
          </span>
        </span>

        {/* 🔥 Points */}
        <Link to="/balance" className="nav-item">
          <FaFire className="nav-icon small-icon" />
          <span className="small-text">
            {isLoading ? "..." : `${formatPoints(rawPoints)} pts`}
          </span>
        </Link>

        {/* ⚙️ Settings */}
        <Link to="/settings" className="nav-item">
          <FaCog className="nav-icon small-icon" />
          <span className="small-text">Settings</span>
        </Link>

      </nav>
    </header>
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