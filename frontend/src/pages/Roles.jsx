import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./roles.css";
import logo from "../assets/salespoint-logo.png";

const Roles = () => {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([
    { name: "John Doe", email: "john.doe@gmail.com", role: "Owner", date: "June 30, 2025 - 02:21 PM", phone: "0917-125-5245" },
    { name: "Maria Santos", email: "maria.santos@gmail.com", role: "Staff", date: "July 1, 2025 - 07:45 AM", phone: "0917-123-4567" },
    { name: "John Reyes", email: "john.reyes@gmail.com", role: "Staff", date: "July 2, 2025 - 08:30 PM", phone: "0917-234-5678" },
    { name: "Liza Fernandez", email: "liza.fernandez@gmail.com", role: "Staff", date: "July 2, 2025 - 08:10 PM", phone: "0917-345-6789" },
    { name: "Carlo Dela Cruz", email: "carlo.delacruz@gmail.com", role: "Staff", date: "July 2, 2025 - 07:52 PM", phone: "0917-456-7890" },
    { name: "Jenny Robles", email: "jenny.robles@gmail.com", role: "Staff", date: "July 2, 2025 - 07:44 PM", phone: "0917-567-8901" },
    { name: "Kevin Morales", email: "kevin.morales@gmail.com", role: "Staff", date: "July 2, 2025 - 07:11 PM", phone: "0917-678-9012" },
    { name: "Ana Lim", email: "ana.lim@gmail.com", role: "Staff", date: "July 2, 2025 - 06:49 PM", phone: "0917-789-0123" },
    { name: "Paolo Gutierrez", email: "paolo.gutierrez@gmail.com", role: "Staff", date: "July 2, 2025 - 06:23 PM", phone: "0917-890-1234" },
    { name: "Nicole Bautista", email: "nicole.bautista@gmail.com", role: "Staff", date: "July 2, 2025 - 06:00 PM", phone: "0917-901-2345" },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "", date: "", phone: "" });

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = (index) => {
    const updated = [...users];
    updated.splice(index, 1);
    setUsers(updated);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(users[index]);
  };

  const handleSave = () => {
    const updated = [...users];
    updated[editingIndex] = editData;
    setUsers(updated);
    setEditingIndex(null);
    setEditData({ name: "", email: "", role: "", date: "", phone: "" });
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarExpanded ? "expanded" : ""}`}>
        <div>
          <div className="nav-toggle" onClick={() => setSidebarExpanded(!sidebarExpanded)}>☰</div>
          <Link to="/dashboard" className={`nav-icon ${location.pathname === "/dashboard" ? "active" : ""}`}>🏠 {sidebarExpanded && <span>Dashboard</span>}</Link>
          <Link to="/roles" className={`nav-icon ${location.pathname === "/roles" ? "active" : ""}`}>👥 {sidebarExpanded && <span>Roles</span>}</Link>
          <Link to="/inventory" className={`nav-icon ${location.pathname === "/inventory" ? "active" : ""}`}>📦 {sidebarExpanded && <span>Inventory</span>}</Link>
          <Link to="/order" className={`nav-icon ${location.pathname === "/order" ? "active" : ""}`}>🧾 {sidebarExpanded && <span>Order Entries</span>}</Link>
          <Link to="/audit" className={`nav-icon ${location.pathname === "/audit" ? "active" : ""}`}>🕵️ {sidebarExpanded && <span>Audit Logs</span>}</Link>
          <Link to="/shift" className={`nav-icon ${location.pathname === "/shift" ? "active" : ""}`}>📅 {sidebarExpanded && <span>Shift Board</span>}</Link>
        </div>
        <div>
          <Link to="/settings" className={`nav-icon ${location.pathname === "/settings" ? "active" : ""}`}>⚙️ {sidebarExpanded && <span>Settings</span>}</Link>
          <Link to="/login" className="nav-icon">🔓 {sidebarExpanded && <span>Sign Out</span>}</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="header-left">
            <img src={logo} alt="Sales Point Logo" className="header-logo" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="top-icons">
            <span className="user">John Doe Owner</span>
          </div>
        </header>

        <section className="roles-section">
          <h2>User Roles</h2>
          <table className="roles-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Hiring Date</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const globalIndex = users.findIndex(u => u.email === user.email);
                return (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.date}</td>
                    <td>{user.phone}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(globalIndex)}>✏️</button>
                      <button className="delete-btn" onClick={() => handleDelete(globalIndex)}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Edit Modal */}
        {editingIndex !== null && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit User</h3>
              <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder="Name" />
              <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="Email" />
              <input type="text" value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })} placeholder="Role" />
              <input type="text" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} placeholder="Hiring Date" />
              <input type="text" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} placeholder="Phone" />
              <div className="modal-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Roles;