import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./auditlogs.css";
import logo from "../assets/salespoint-logo.png";

function AuditLogsPage() {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="pos-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarExpanded ? "expanded" : ""}`}>
        <div className="nav-toggle" onClick={() => setSidebarExpanded(!sidebarExpanded)}>☰</div>
        <Link to="/dashboard" className={`nav-icon ${location.pathname === "/dashboard" ? "active" : ""}`}>
          🏠 {sidebarExpanded && <span>Dashboard</span>}
        </Link>
        <Link to="/roles" className={`nav-icon ${location.pathname === "/roles" ? "active" : ""}`}>
          👥 {sidebarExpanded && <span>Roles</span>}
        </Link>
        <Link to="/inventory" className={`nav-icon ${location.pathname === "/inventory" ? "active" : ""}`}>
          📦 {sidebarExpanded && <span>Inventory</span>}
        </Link>
        <Link to="/order" className={`nav-icon ${location.pathname === "/order" ? "active" : ""}`}>
          🧾 {sidebarExpanded && <span>Order Entries</span>}
        </Link>
        <Link to="/audit" className={`nav-icon ${location.pathname === "/audit" ? "active" : ""}`}>
          🕵️ {sidebarExpanded && <span>Audit Logs</span>}
        </Link>
        <Link to="/shift" className={`nav-icon ${location.pathname === "/shift" ? "active" : ""}`}>
          📅 {sidebarExpanded && <span>Shift Board</span>}
        </Link>
        <Link to="/settings" className={`nav-icon ${location.pathname === "/settings" ? "active" : ""}`}>
          ⚙️ {sidebarExpanded && <span>Settings</span>}
        </Link>
        <Link to="/login" className="nav-icon">
          🔓 {sidebarExpanded && <span>Sign Out</span>}
        </Link> 
      </div>

      {/* Main Panel */}
      <div className="left-panel">
        <div className="top-bar">
          <div className="logo-container">
            <img src={logo} alt="Sales Point Logo" className="logo" />
          </div>
          <input type="text" placeholder="Search audit logs..." />
          <div className="user-profile">John Doe </div>
        </div>

        <h2>Audit Logs</h2>
        <div className="audit-table">
          <div className="table-header">
            <span>Email</span>
            <span>Role</span>
            <span>Date</span>
            <span>Actions Taken</span>
          </div>

          <div className="empty-cart" style={{ textAlign: "center", marginTop: "40px" }}>
            No audit logs available yet.
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <h3>Audit Overview</h3>
        <p className="empty-cart">Once employees begin taking actions, logs will appear here for review.</p>
      </div>
    </div>
  );
}

export default AuditLogsPage;