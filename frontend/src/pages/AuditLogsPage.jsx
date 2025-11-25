import React, { useState, useEffect } from "react";
import { /* Link, useLocation */ } from "react-router-dom";
import "./auditlogs.css";
import logo from "../assets/salespoint-logo.png";

function AuditLogsPage() {
  
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
      {/* Sidebar is centralized in Layout */}
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
            className="search-box"
          />
          <div className="user-profile">John Doe</div>
        </header>

        <section className="audit-section">
          <h2>Audit Logs</h2>

          <div className="audit-table-wrapper">
            <div className="table-header">
              <div>Email</div>
              <div>Role</div>
              <div>Date</div>
              <div>Actions Taken</div>
            </div>

            {filteredLogs.length > 0 ? (
              <div className="audit-logs-scroll">
                {filteredLogs.map((log, index) => (
                  <div
                    key={log._id}
                    className={`audit-log-entry ${index % 2 === 0 ? "even" : "odd"}`}
                  >
                    <div>{log.email}</div>
                    <div>{log.role}</div>
                    <div>{new Date(log.date || log.createdAt).toLocaleString()}</div>
                    <div>{log.action}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-log">No audit logs match your search criteria.</p>
            )}
          </div>

          <div className="audit-overview-card">
            <h3>Audit Overview</h3>
            <p>
              All actions taken by employees are logged here for review. This helps maintain
              accountability and track system changes.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AuditLogsPage;
