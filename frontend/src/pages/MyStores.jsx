import React, { useState, useEffect } from "react";
import Layout from "../Layout/layout.jsx";          // ✅ Sidebar wrapper
import "../pages-css/mystores.css";                 // ✅ Styles
import logo from "../assets/salespoint-logo.png";

function MyStores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Fetch stores from backend (created or joined)
    fetch("http://localhost:5000/api/stores/mystores")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Error fetching stores:", err));
  }, []);

  const handleLeave = async (storeId) => {
    try {
      await fetch(`http://localhost:5000/api/stores/${storeId}/leave`, {
        method: "POST"
      });
      setStores(stores.filter((s) => s._id !== storeId));
    } catch (err) {
      console.error("Error leaving store:", err);
    }
  };

  return (
    <Layout>
      {/* Top Bar */}
      <header className="top-bar">
        <div className="logo-container">
          <img src={logo} alt="Sales Point Logo" className="logo" />
        </div>
        <div className="user-profile">John Doe</div>
      </header>

      {/* Page Header */}
      <section className="page-header">
        <h2>My Stores</h2>
      </section>

      {/* Store List */}
      <section className="page-content">
        <table className="stores-table">
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Role</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store._id}>
                <td>{store.name}</td>
                <td>{store.owner}</td>
                <td>{store.email}</td>
                <td>{store.role}</td>
                <td>{new Date(store.createdAt).toLocaleDateString()}</td>
                <td>
                  {store.role === "Creator" ? (
                    <button className="manage-btn">Manage</button>
                  ) : (
                    <button
                      className="leave-btn"
                      onClick={() => handleLeave(store._id)}
                    >
                      Leave
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default MyStores;