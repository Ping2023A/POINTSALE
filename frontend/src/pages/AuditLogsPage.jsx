import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./auditlogs.css";
import logo from "../assets/salespoint-logo.png";

function AuditLogsPage() {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const auditLogs = [
    { email: "john.doe@gmail.com", role: "Owner", date: "June 30, 2025 - 02:21 PM", action: "Created new role" },
    { email: "maria.santos@gmail.com", role: "Staff", date: "July 1, 2025 - 07:45 AM", action: "Updated inventory" },
    { email: "john.reyes@gmail.com", role: "Staff", date: "July 2, 2025 - 08:30 PM", action: "Processed order #123" },
    { email: "liza.fernandez@gmail.com", role: "Staff", date: "July 2, 2025 - 08:10 PM", action: "Edited product details" },
    { email: "carlo.delacruz@gmail.com", role: "Staff", date: "July 2, 2025 - 07:52 PM", action: "Deleted product #56" },
    
    { email: "kevin.morales@gmail.com", role: "Staff", date: "July 3, 2025 - 09:12 AM", action: "Created new shift schedule" },
    { email: "ana.lim@gmail.com", role: "Staff", date: "July 3, 2025 - 10:05 AM", action: "Logged in" },
    { email: "paolo.gutierrez@gmail.com", role: "Staff", date: "July 3, 2025 - 11:42 AM", action: "Modified order #341" },
    { email: "nicole.bautista@gmail.com", role: "Staff", date: "July 4, 2025 - 03:25 PM", action: "Updated employee details" },
    { email: "admin@salespoint.com", role: "Owner", date: "July 4, 2025 - 05:50 PM", action: "Viewed audit logs" },
    { email: "staff@example.com", role: "Staff", date: "July 5, 2025 - 08:15 AM", action: "Adjusted product stocks" },
    { email: "manager@example.com", role: "Manager", date: "July 5, 2025 - 09:18 AM", action: "Reviewed sales summary" },
    { email: "cashier@sales.com", role: "Cashier", date: "July 5, 2025 - 12:30 PM", action: "Processed refund request" },
    { email: "support@company.com", role: "Support", date: "July 6, 2025 - 01:10 PM", action: "Assisted customer inquiry" },
    { email: "new.user@example.com", role: "Staff", date: "July 6, 2025 - 02:45 PM", action: "Logged out" },
  ];

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
        </div>
        <div>
          <Link to="/settings" className={`nav-icon ${location.pathname === "/settings" ? "active" : ""}`}>
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
            filteredLogs.map((log, index) => (
              <div key={index} className="audit-log-entry">
                <span>{log.email}</span>
                <span>{log.role}</span>
                <span>{log.date}</span>
                <span>{log.action}</span>
              </div>
            ))
          ) : (
            <div className="empty-cart">No audit logs match your search criteria.</div>
          )}
        </section>

        <section className="audit-overview">
          <h3>Audit Overview</h3>
          <p className="empty-cart">
            Once employees begin taking actions, logs will appear here for review.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AuditLogsPage;