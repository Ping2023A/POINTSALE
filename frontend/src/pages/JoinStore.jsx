import React, { useState } from "react";
import "../pages-css/joinstore.css";                
import logo from "../assets/salespoint-logo.png";

function JoinStore() {
  const [formData, setFormData] = useState({
    storeCode: "",
    email: "",
    role: "Staff"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Payload matches backend expectations
      const payload = {
        storeCode: formData.storeCode,
        email: formData.email,
        role: formData.role
      };

      const res = await fetch("http://localhost:5000/api/stores/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(`Successfully joined store: ${result.storeName}`);
        setFormData({ storeCode: "", email: "", role: "Staff" });
      } else {
        setMessage(result.error || "Failed to join store.");
      }
    } catch (err) {
      console.error("Error joining store:", err);
      setMessage("Server error. Please try again later.");
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
        <h1>Join a Store</h1>
        <p>Enter the store code to join an existing store.</p>
      </div>

      {/* Join Store Form */}
      <div className="landing-options">
        <form className="join-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="storeCode"
            value={formData.storeCode}
            onChange={handleChange}
            placeholder="Enter Store Code"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option>
          </select>
          <button type="submit">Join Store</button>
        </form>

        {message && <p className="feedback">{message}</p>}
      </div>
    </div>
  );
}

export default JoinStore;
