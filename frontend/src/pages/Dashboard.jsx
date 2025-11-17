import React from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Sales Point</h2>
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li>Roles</li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/order">Order Entries</Link></li>
            <li><Link to="/audit">Audit Logs</Link></li>
            <li>Shift Board</li>
            <li>Sign Out</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <input type="text" placeholder="Search..." />
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
              <img src="/assets/salespoint-logo.png" alt="Cappuccino" />
              <p>Cappuccino - ₱120</p>
            </div>
            <div className="product-card">
              <img src="/assets/salespoint-logo.png" alt="Americano" />
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