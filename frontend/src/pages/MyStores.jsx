import React, { useState, useEffect } from "react";
import "../pages-css/mystores.css";                 
import logo from "../assets/salespoint-logo.png";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function MyStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && u.email) setUserEmail(u.email);
      else setUserEmail("");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userEmail) {
      setStores([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/stores/mystores?email=${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Error fetching stores:", err))
      .finally(() => setLoading(false));
  }, [userEmail]);

  const handleLeave = async (storeId) => {
    try {
      const res = await fetch(`/api/stores/${storeId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
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

  const navigate = useNavigate();

  const handleManage = (store) => {
    // Save current store to localStorage so other app pages can read it
    try {
      localStorage.setItem("currentStore", JSON.stringify(store));
    } catch (e) {
      console.warn("Could not save store to localStorage", e);
    }
    // Navigate into the main app (dashboard) and pass store id as query param
    navigate(`/app?storeId=${store._id}`);
  };

  const handleDelete = async (storeId) => {
    if (!window.confirm("Are you sure you want to permanently delete this store?")) return;
    try {
      const res = await fetch(`/api/stores/${storeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete store");
      }

      // Remove from UI list
      setStores((prev) => prev.filter((s) => s._id !== storeId));
      alert("Store deleted");
    } catch (err) {
      console.error("Error deleting store:", err);
      alert("Failed to delete store. Ensure you are the owner and try again.");
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
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
        ) : stores.length > 0 ? (
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
                    {store.members.find((m) => m.email === userEmail)?.role || "Owner"}
                  </td>
                  <td>{new Date(store.createdAt).toLocaleDateString()}</td>
                  <td>
                    {store.ownerEmail === userEmail ? (
                      <>
                        <button className="manage-btn" onClick={() => handleManage(store)}>Manage</button>
                        <button className="delete-btn" onClick={() => handleDelete(store._id)} style={{marginLeft:8}}>Delete</button>
                      </>
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
