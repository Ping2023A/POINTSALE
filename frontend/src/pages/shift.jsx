import React, { useState } from "react";
import "../pages/shift.css";
import { Link, useLocation } from "react-router-dom";

export default function ShiftSchedule() {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="dashboard-layout">
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

      {/* Main content */}
      <main className="shift-page-wrapper">
        <div className="schedule-wrapper">
          {/* Top Section */}
          <div className="top-section">
            <input className="search-bar" placeholder="Search employee..." />
            <div className="date-nav">
              <button>{"<"}</button>
              <span>20 Oct – 24 Oct</span>
              <button>{">"}</button>
            </div>
            <button className="add-employee-btn">+ Add Employee</button>
          </div>

          {/* Schedule Table */}
          <div className="schedule-card">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mon<br /><span className="sub">20 Oct</span></th>
                  <th>Tue<br /><span className="sub">21 Oct</span></th>
                  <th>Wed<br /><span className="sub">22 Oct</span></th>
                  <th>Thu<br /><span className="sub">23 Oct</span></th>
                  <th>Fri<br /><span className="sub">24 Oct</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td><div className="shift red">9:00 – 6:00</div></td>
                  <td><div className="shift red">9:00 – 6:00</div></td>
                  <td><div className="shift blue">6:00 – 11:00</div></td>
                  <td><div className="shift green">Flexible</div></td>
                  <td><div className="shift blue">6:00 – 11:00</div></td>
                </tr>
                <tr>
                  <td>Maria Santos</td>
                  <td><div className="shift red">9:00 – 6:00</div></td>
                  <td><div className="shift red">9:00 – 6:00</div></td>
                  <td><div className="empty">+</div></td>
                  <td><div className="empty">+</div></td>
                  <td><div className="shift green">Flexible</div></td>
                </tr>
                <tr>
                  <td>John Reyes</td>
                  <td><div className="shift yellow">On Leave</div></td>
                  <td><div className="shift green">Flexible</div></td>
                  <td><div className="shift blue">6:00 – 11:00</div></td>
                  <td><div className="shift green">Flexible</div></td>
                  <td><div className="shift red">9:00 – 6:00</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}