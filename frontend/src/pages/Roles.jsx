import React, { useState, useEffect } from "react";
import { /* Link, useLocation */ } from "react-router-dom";
import "./roles.css";
import logo from "../assets/salespoint-logo.png";

const Roles = () => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "", date: "", phone: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", date: "", phone: "" });

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roles");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load roles:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    Object.values(user).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete user
  const handleDelete = async (index) => {
    const user = users[index];
    try {
      const res = await fetch(`http://localhost:5000/api/roles/${user._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setUsers(users.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  // Edit user
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(users[index]);
  };

  const handleSave = async () => {
    const user = users[editingIndex];
    try {
      const res = await fetch(`http://localhost:5000/api/roles/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });
      const updated = await res.json();
      const newUsers = [...users];
      newUsers[editingIndex] = updated;
      setUsers(newUsers);
      setEditingIndex(null);
      setEditData({ name: "", email: "", role: "", date: "", phone: "" });
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update user");
    }
  };

  // Add new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.date || !newUser.phone) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to add user");
        return;
      }

      const created = await res.json();
      setUsers((prev) => [created, ...prev]); // add new user at top
      setShowAddModal(false);
      setNewUser({ name: "", email: "", role: "", date: "", phone: "" });
    } catch (err) {
      console.error("Create failed:", err);
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar is centralized in Layout */}
      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="header-left">
            <img src={logo} alt="Sales Point Logo" className="header-logo" />
            <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="top-icons">
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-role">Owner</span>
            </div>
            <button onClick={() => setShowAddModal(true)} className="add-btn">+ Add User</button>
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
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.date}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(index)}>✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(index)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No users found.</td>
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

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New User</h3>
              <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Name" />
              <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" />
              <input type="text" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} placeholder="Role" />
              <input type="text" value={newUser.date} onChange={(e) => setNewUser({ ...newUser, date: e.target.value })} placeholder="Hiring Date" />
              <input type="text" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} placeholder="Phone" />
              <div className="modal-buttons">
                <button onClick={handleAddUser}>Add</button>
                <button onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Roles;
