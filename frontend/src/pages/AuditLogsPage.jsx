import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./auditlogs.css";
import logo from "../assets/salespoint-logo.png";

function AuditLogsPage() {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [auditLogs, setAuditLogs] = useState([]);

  // Fetch logs from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/audit")
      .then((res) => res.json())
      .then((data) => setAuditLogs(data))
      .catch((err) => console.error("Failed to load audit logs:", err));
  }, []);

  const filteredLogs = auditLogs.filter((log) =>
    Object.values(log)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarExpanded ? "expanded" : ""}`}>
        <div>
          <div
            className="nav-toggle"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
          >
            ☰
          </div>
          <Link
            to="/dashboard"
            className={`nav-icon ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            🏠 {sidebarExpanded && <span>Dashboard</span>}
          </Link>
          <Link
            to="/roles"
            className={`nav-icon ${
              location.pathname === "/roles" ? "active" : ""
            }`}
          >
            👥 {sidebarExpanded && <span>Roles</span>}
          </Link>
          <Link
            to="/inventory"
            className={`nav-icon ${
              location.pathname === "/inventory" ? "active" : ""
            }`}
          >
            📦 {sidebarExpanded && <span>Inventory</span>}
          </Link>
          <Link
            to="/order"
            className={`nav-icon ${
              location.pathname === "/order" ? "active" : ""
            }`}
          >
            🧾 {sidebarExpanded && <span>Order Entries</span>}
          </Link>
          <Link
            to="/audit"
            className={`nav-icon ${
              location.pathname === "/audit" ? "active" : ""
            }`}
          >
            🕵️ {sidebarExpanded && <span>Audit Logs</span>}
          </Link>
          <Link
            to="/shift"
            className={`nav-icon ${
              location.pathname === "/shift" ? "active" : ""
            }`}
          >
            📅 {sidebarExpanded && <span>Shift Board</span>}
          </Link>
        </div>
        <div>
          <Link
            to="/settings"
            className={`nav-icon ${
              location.pathname === "/settings" ? "active" : ""
            }`}
          >
            ⚙️ {sidebarExpanded && <span>Settings</span>}
          </Link>
          <Link to="/login" className="nav-icon">
            🔓 {sidebarExpanded && <span>Sign Out</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="logo-container">
            <img src={logo} alt="Sales Point Logo" className="logo" />
          </div>
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="user-profile">John Doe</div>
        </header>

        <section className="audit-header">
          <h2>Audit Logs</h2>
        </section>

        <section className="audit-table">
          <div className="table-header">
            <span>Email</span>
            <span>Role</span>
            <span>Date</span>
            <span>Actions Taken</span>
          </div>

          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log._id} className="audit-log-entry">
                <span>{log.email}</span>
                <span>{log.role}</span>
                <span>
                  {new Date(log.date || log.createdAt).toLocaleString()}
                </span>
                <span>{log.action}</span>
              </div>
            ))
          ) : (
            <div className="empty-cart">
              No audit logs match your search criteria.
            </div>
          )}
        </section>

        <section className="audit-overview">
          <h3>Audit Overview</h3>
          <p className="empty-cart">
            Once employees begin taking actions, logs will appear here for
            review.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AuditLogsPage;