import React, { useState, useEffect } from "react";
import "../pages-css/createstore.css";              
import logo from "../assets/salespoint-logo.png";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

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
      const ownerEmail = userEmail || storeData.email;

      // sanitize logo: backend expects a string (url/path). If user selected a file, skip it for now.
      const logoValue = storeData.logo && storeData.logo instanceof File ? "" : storeData.logo || "";

      const payload = {
        name: storeData.name,
        owner: storeData.owner,
        ownerEmail,
        phone: storeData.phone,
        address: storeData.address,
        currency: storeData.currency,
        tax: storeData.tax ? Number(storeData.tax) : 0,
        logo: logoValue,
        members: [{ email: ownerEmail, role: "Creator" }]
      };

      const res = await fetch(`/api/stores`, {
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
        navigate("/mystores");
      } else {
        alert(created.error || "Failed to create store.");
      }
    } catch (err) {
      console.error("Error creating store:", err);
      alert("Server error. Please try again later.");
    }
  };

  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && u.email) setUserEmail(u.email);
      else setUserEmail("");
    });
    return () => unsub();
  }, []);

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
