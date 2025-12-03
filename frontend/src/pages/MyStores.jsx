import React, { useState, useEffect } from "react";
import "../pages-css/mystores.css";                 
import logo from "../assets/salespoint-logo.png";

function MyStores() {
  const [stores, setStores] = useState([]);
  const email = "user@example.com"; // Replace with logged-in user email

  useEffect(() => {
    // Fetch stores from backend (created or joined)
    fetch(`http://localhost:5000/api/stores/mystores?email=${email}`)
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Error fetching stores:", err));
  }, [email]);

  const handleLeave = async (storeId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/stores/${storeId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to leave the store");
      }

      // Remove store from state after leaving
      setStores(stores.filter((s) => s._id !== storeId));
    } catch (err) {
      console.error("Error leaving store:", err);
      alert("Failed to leave the store. Please try again.");
    }
  };

  return (
    <div className="landing-container">
      {/* Centered Logo */}
      <div className="landing-logo">
        <img src={logo} alt="SalesPoint Logo" className="logo" />
      </div>

      {/* Page Header */}
      <div className="landing-header">
        <h1>My Stores</h1>
        <p>View and manage the stores you created or joined.</p>
      </div>

      {/* Store List */}
      <div className="landing-options">
        {stores.length > 0 ? (
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
                  <td>{store.ownerEmail}</td>
                  <td>
                    {store.members.find((m) => m.email === email)?.role || "Owner"}
                  </td>
                  <td>{new Date(store.createdAt).toLocaleDateString()}</td>
                  <td>
                    {store.ownerEmail === email ? (
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
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>
            No stores found.
          </p>
        )}
      </div>
    </div>
  );
}

export default MyStores;
