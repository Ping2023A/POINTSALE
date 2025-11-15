// ShiftSchedule.jsx
import React from "react";
import "../pages/shift.css";
import { Link } from "react-router-dom";

export default function ShiftSchedule() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="logo">Sales Point</h2>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li>Roles</li>
            <li className="active"><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/order">Order Entries</Link></li>
            <li>Audit Logs</li>
            <li>Shift Board</li>
            <li>Sign Out</li>
          </ul>
        </nav>
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
                  <th>Mon<br/><span className="sub">20 Oct</span></th>
                  <th>Tue<br/><span className="sub">21 Oct</span></th>
                  <th>Wed<br/><span className="sub">22 Oct</span></th>
                  <th>Thu<br/><span className="sub">23 Oct</span></th>
                  <th>Fri<br/><span className="sub">24 Oct</span></th>
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
