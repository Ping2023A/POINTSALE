import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../assets/salespoint-logo.png";
import "./dashboard.css";

/* Chart.js imports */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";

/* Register ChartJS components */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

const DashboardChart = ({ weeklySales }) => {
  if (!weeklySales || weeklySales.length === 0)
    return <div style={{ textAlign: "center" }}>Loading chart...</div>;

  const labels = weeklySales.map((s) => s._id);
  const data = weeklySales.map((s) => s.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Weekly Sales",
        data,
        borderColor: "#1abc9c",
        backgroundColor: "rgba(26,188,156,0.25)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Weekly Sales Chart" },
    },
    maintainAspectRatio: false,
  };

  return <Line data={chartData} options={options} />;
};

const Dashboard = () => {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [weeklySales, setWeeklySales] = useState([]);
  const [summary, setSummary] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard")
      .then((res) => {
        setWeeklySales(res.data.weeklySales || []);
        setSummary(res.data.summary || {});
        setRecentOrders(res.data.recentOrders || []);
        setPopularProducts(res.data.popularProducts || []);
      })
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

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

        {/* Sales Summary */}
        <section className="sales-summary">
          <h3>Today's Sales</h3>
          <div className="summary-cards">
            <div className="card">Total Sales: ₱{summary.totalSales || 0}</div>
            <div className="card">
              Total Customers: {summary.totalCustomers || 0}
            </div>
            <div className="card">Total Orders: {summary.totalOrders || 0}</div>
            <div className="card">
              Average Sale: ₱{summary.avgSale?.toFixed(2) || 0}
            </div>
          </div>
        </section>

        {/* Sales Record */}
        <section className="sales-record">
          <h3>Sales Record</h3>
          <div className="record-details">
            <div className="record-amount">₱{summary.totalSales || 0}</div>
            <div className="chart-container">
              <DashboardChart weeklySales={weeklySales} />
            </div>
          </div>
        </section>

        {/* Popular Products */}
        <section className="popular-products">
          <h3>Popular Products</h3>
          <div className="product-list">
            {popularProducts.map((p) => (
              <div key={p._id} className="product-card">
                <p>
                  {p.name} - ₱{p.price} ({p.sold} sold)
                </p>
              </div>
            ))}
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
              {recentOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.itemName}</td>
                  <td>{o.quantity}</td>
                  <td>₱{o.totalAmount}</td>
                  <td>{o.paymentMethod}</td>
                  <td>{new Date(o.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
