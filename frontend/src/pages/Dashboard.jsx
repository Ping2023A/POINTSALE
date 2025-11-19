import React, { useState } from "react";
import "./dashboard.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/salespoint-logo.png"; 

const Dashboard = () => {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarExpanded ? "expanded" : ""}`}>
        <div>
          <div className="nav-toggle" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
            ☰
          </div>
          <Link
            to="/dashboard"
            className={`nav-icon ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            🏠 {sidebarExpanded && <span>Dashboard</span>}
          </Link>
          <Link
            to="/roles"
            className={`nav-icon ${location.pathname === "/roles" ? "active" : ""}`}
          >
            👥 {sidebarExpanded && <span>Roles</span>}
          </Link>
          <Link
            to="/inventory"
            className={`nav-icon ${location.pathname === "/inventory" ? "active" : ""}`}
          >
            📦 {sidebarExpanded && <span>Inventory</span>}
          </Link>
          <Link
            to="/order"
            className={`nav-icon ${location.pathname === "/order" ? "active" : ""}`}
          >
            🧾 {sidebarExpanded && <span>Order Entries</span>}
          </Link>
          <Link
            to="/audit"
            className={`nav-icon ${location.pathname === "/audit" ? "active" : ""}`}
          >
            🕵️ {sidebarExpanded && <span>Audit Logs</span>}
          </Link>
          <Link
            to="/shift"
            className={`nav-icon ${location.pathname === "/shift" ? "active" : ""}`}
          >
            📅 {sidebarExpanded && <span>Shift Board</span>}
          </Link>
        </div>

        <div>
          <Link
            to="/settings"
            className={`nav-icon ${location.pathname === "/settings" ? "active" : ""}`}
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
        {/* Top Bar */}
        <header className="top-bar">
          <div className="logo-container">
            <img src={logo} alt="SalesPoint Logo" className="topbar-logo" />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="top-icons">
            <span className="notification">🔔</span>
            <span className="user">Hello, User</span>
          </div>
        </header>

        {/* Today's Sales */}
        <section className="sales-summary">
          <h3>Today's Sales</h3>
          <div className="summary-cards">
            <div className="card">Total Sales: ₱3,420</div>
            <div className="card">Total Customers: 25</div>
            <div className="card">Total Orders: 27</div>
            <div className="card">Average Sale: ₱120</div>
          </div>
        </section>

        {/* Sales Record */}
        <section className="sales-record">
          <h3>Sales Record</h3>
          <div className="record-details">
            <div className="record-amount">₱5,412</div>
            <div className="chart-placeholder">[Chart Placeholder]</div>
          </div>
        </section>

        {/* Popular Products */}
        <section className="popular-products">
          <h3>Popular Products</h3>
          <div className="product-list">
            <div className="product-card">
              <p>Cappuccino - ₱120</p>
            </div>
            <div className="product-card">
              <p>Americano - ₱135</p>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="recent-orders">
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Payment Method</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cappuccino</td>
                <td>1</td>
                <td>₱120</td>
                <td>Cash</td>
                <td>12:45 AM</td>
              </tr>
              <tr>
                <td>Americano</td>
                <td>2</td>
                <td>₱135</td>
                <td>Cash</td>
                <td>12:45 AM</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;