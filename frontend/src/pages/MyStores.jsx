import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages-css/mystores.css";
import logo from "../assets/salespoint-logo.png";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function MyStores() {
  const [stores, setStores] = useState([]);
  const email = localStorage.getItem("userEmail") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/stores/mystores?email=${email}`);
        if (!res.ok) throw new Error("Failed to fetch stores");
        const data = await res.json();

        // ✅ Restrict access: only staff or owner can continue
        if (!data || data.length === 0) {
          alert("Access denied. You are not a staff or owner of any store.");
          navigate("/"); // back to landing page
          return;
        }

        setStores(data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };

    if (email) fetchStores();
    else {
      // If no email in localStorage, force login
      navigate("/login");
    }
  }, [email, navigate]);
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
    if (!window.confirm("Are you sure you want to leave this store?")) return;

    try {
      const res = await fetch(`/api/stores/${storeId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        body: JSON.stringify({ email: userEmail })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to leave the store");

      setStores((prevStores) => prevStores.filter((s) => s._id !== storeId));
    } catch (err) {
      console.error("Error leaving store:", err);
      alert("Failed to leave the store. Please try again.");
    }
  };

  const handleDelete = async (storeId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this store? This action cannot be undone.")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/stores/${storeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // send email for owner verification
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to delete the store");

      setStores((prevStores) => prevStores.filter((s) => s._id !== storeId));
    } catch (err) {
      console.error("Error deleting store:", err);
      alert("Failed to delete the store. Please try again.");
    }
  };

  const handleDashboard = (storeId) => {
    localStorage.setItem("currentStoreId", storeId);
    navigate(`/app/dashboard/${storeId}`);
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
      <div className="landing-logo">
        <img src={logo} alt="SalesPoint Logo" className="logo" />
      </div>
      <div className="landing-header">
        <h1>My Stores</h1>
        <p>View and manage the stores you created or joined.</p>
      </div>
      <div className="landing-options">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
        ) : stores.length > 0 ? (
          <table className="stores-table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Owner</th>
                <th>Owner Email</th>
                <th>Role</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => {
                const role = store.members.find((m) => m.email === email)?.role || "Owner";
                return (
                  <tr key={store._id}>
                    <td>{store.name}</td>
                    <td>{store.owner}</td>
                    <td>{store.ownerEmail}</td>
                    <td>{role}</td>
                    <td>{new Date(store.createdAt).toLocaleDateString()}</td>
                    <td>
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
                        className="dashboard-btn"
                        onClick={() => handleDashboard(store._id)}
                      >
                        Dashboard
                      </button>
                      {store.ownerEmail === email ? (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(store._id)}
                        >
                          Delete
                        </button>
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
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>No stores found.</p>
        )}
      </div>
    </div>
  );
}

export default MyStores;