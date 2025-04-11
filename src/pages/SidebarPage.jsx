import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import MyActions from "./MyActions";
import Status from "./Status";
import Actions from "./Actions";
import "./SidebarPage.css";

const SidebarPage = () => {
  return (
    <div className="sidebar-container">
      {/* Barre de navigation */}
      <nav className="sidebar-nav">
        <Link to="/sidebar" className="nav-item">Actions</Link>
        <Link to="/sidebar/my-actions" className="nav-item">My Actions</Link>
        <Link to="/sidebar/status" className="nav-item">Status</Link>
      </nav>

      {/* Contenu qui change selon la route */}
      <div className="sidebar-content">
        <Routes>
          <Route path="/" element={<Actions />} />
          <Route path="/my-actions" element={<MyActions />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </div>
    </div>
  );
};

export default SidebarPage;