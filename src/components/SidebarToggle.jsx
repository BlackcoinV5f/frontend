import React from "react";
import { useNavigate } from "react-router-dom";
import "./SidebarToggle.css";

const SidebarToggle = ({ logo }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-toggle" onClick={() => navigate("/sidebar")}>
      <img src={logo} alt="Icône Sidebar" />
    </div>
  );
};

export default SidebarToggle;