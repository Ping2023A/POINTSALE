import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./settings.css";
import logo from "../assets/salespoint-logo.png";

const SettingsPage = () => {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

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
          <div className="user-profile">John Doe Owner</div>
        </header>

        <section className="settings-section">
          <h2>Settings</h2>

          {/* Business Info */}
          <div className="settings-card">
            <h3>Business Information</h3>
            <input type="text" placeholder="Store Name" />
            <input type="text" placeholder="Contact Email" />
            <input type="text" placeholder="Phone Number" />
            <input type="text" placeholder="Tax/VAT %" />
            <input type="text" placeholder="Currency (₱, $, €)" />
            <button>Save Business Info</button>
          </div>

          {/* Payment Methods */}
          <div className="settings-card">
            <h3>Payment Methods</h3>
            <label><input type="checkbox" /> Cash</label>
            <label><input type="checkbox" /> GCash</label>
            <label><input type="checkbox" /> Card</label>
            <button>Save Payment Settings</button>
          </div>

          {/* User & Role Management */}
          <div className="settings-card">
            <h3>User & Role Management</h3>
            <button>Manage Users</button>
            <button>Manage Roles</button>
          </div>

          {/* Inventory Settings */}
          <div className="settings-card">
            <h3>Inventory Settings</h3>
            <input type="number" placeholder="Low Stock Alert Threshold" />
            <label><input type="checkbox" /> Enable Product Variants</label>
            <button>Save Inventory Settings</button>
          </div>

          {/* Shift Settings */}
          <div className="settings-card">
            <h3>Shift & Employee Settings</h3>
            <input type="number" placeholder="Default Shift Length (hours)" />
            <input type="number" placeholder="Overtime Threshold (hours)" />
            <button>Save Shift Settings</button>
          </div>

          {/* Audit & Security */}
          <div className="settings-card">
            <h3>Audit & Security</h3>
            <label><input type="checkbox" /> Enable Audit Logging</label>
            <input type="number" placeholder="Log Retention (days)" />
            <button>Export Logs</button>
          </div>

          {/* System Preferences */}
          <div className="settings-card">
            <h3>System Preferences</h3>
            <label><input type="checkbox" /> Dark Mode</label>
            <select>
              <option>English</option>
              <option>Filipino</option>
            </select>
            <input type="text" placeholder="Timezone" />
            <button>Save Preferences</button>
          </div>

          {/* Integrations */}
          <div className="settings-card">
            <h3>Integrations</h3>
            <input type="text" placeholder="Accounting API Key" />
            <input type="text" placeholder="Payroll API Key" />
            <button>Save Integrations</button>
          </div>

          {/* Backup & Restore */}
          <div className="settings-card">
            <h3>Backup & Restore</h3>
            <button>Backup Database</button>
            <button>Restore Database</button>
            <input type="number" placeholder="Auto-backup Interval (days)" />
          </div>

          {/* Notifications */}
          <div className="settings-card">
            <h3>Notifications</h3>
            <label><input type="checkbox" /> Email Alerts</label>
            <label><input type="checkbox" /> SMS Alerts</label>
            <input type="number" placeholder="Sales Alert Threshold (₱)" />
            <button>Save Notifications</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;