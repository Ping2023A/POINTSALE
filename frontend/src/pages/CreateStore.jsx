import React, { useState } from "react";
import "../pages-css/createstore.css";              
import logo from "../assets/salespoint-logo.png";

function CreateStore() {
  const [storeData, setStoreData] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    currency: "₱",
    tax: "",
    logo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({ ...storeData, [name]: value });
  };

  const handleFileChange = (e) => {
    setStoreData({ ...storeData, logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map frontend 'email' to backend 'ownerEmail' and initialize members
      const payload = {
        ...storeData,
        ownerEmail: storeData.email,
        members: [{ email: storeData.email, role: "Creator" }]
      };
      delete payload.email; // remove frontend email key

      const res = await fetch("http://localhost:5000/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const created = await res.json();

      if (res.ok) {
        alert(`Store "${created.name}" created successfully!`);
        setStoreData({
          name: "",
          owner: "",
          email: "",
          phone: "",
          address: "",
          currency: "₱",
          tax: "",
          logo: null
        });
      } else {
        alert(created.error || "Failed to create store.");
      }
    } catch (err) {
      console.error("Error creating store:", err);
      alert("Server error. Please try again later.");
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
        <h1>Create Your Store</h1>
        <p>Fill in the details below to start a new store.</p>
      </div>

      {/* Store Form */}
      <div className="landing-options">
        <form className="store-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={storeData.name}
            onChange={handleChange}
            placeholder="Store Name"
            required
          />
          <input
            type="text"
            name="owner"
            value={storeData.owner}
            onChange={handleChange}
            placeholder="Owner Name"
            required
          />
          <input
            type="email"
            name="email"
            value={storeData.email}
            onChange={handleChange}
            placeholder="Owner Email"
            required
          />
          <input
            type="text"
            name="phone"
            value={storeData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <input
            type="text"
            name="address"
            value={storeData.address}
            onChange={handleChange}
            placeholder="Address"
          />
          <select
            name="currency"
            value={storeData.currency}
            onChange={handleChange}
          >
            <option value="₱">Philippine Peso (₱)</option>
            <option value="$">US Dollar ($)</option>
            <option value="€">Euro (€)</option>
          </select>
          <input
            type="number"
            name="tax"
            value={storeData.tax}
            onChange={handleChange}
            placeholder="Tax/VAT %"
          />
          <input type="file" name="logo" onChange={handleFileChange} />
          <button type="submit">Create Store</button>
        </form>
      </div>
    </div>
  );
}

export default CreateStore;
