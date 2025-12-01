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
      const res = await fetch("http://localhost:5000/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData)
      });
      const created = await res.json();
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
    } catch (err) {
      console.error("Error creating store:", err);
    }
  };

  return (
    <div className="page-container">
      {/* Top Bar */}
      <header className="top-bar">
        <div className="logo-container">
          <img src={logo} alt="Sales Point Logo" className="logo" />
        </div>
        <div className="user-profile">John Doe</div>
      </header>

      {/* Page Header */}
      <section className="page-header">
        <h2>Create Your Store</h2>
      </section>

      {/* Store Form */}
      <section className="page-content">
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
            placeholder="Email"
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
          <input type="number" name="tax" value={storeData.tax} onChange={handleChange} placeholder="Tax/VAT %" />
          <input type="file" name="logo" onChange={handleFileChange} />
          <button type="submit">Create Store</button>
        </form>
      </section>
    </div>
  );
}

export default CreateStore;
