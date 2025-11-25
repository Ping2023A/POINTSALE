import React, { useState } from "react";
import { /* Link, useLocation */ } from "react-router-dom";
import "./settings.css";
import logo from "../assets/salespoint-logo.png";

const SettingsPage = () => {
  

  return (
    <div className="dashboard">
      {/* Sidebar is centralized in Layout */}
      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="logo-container">
            <img src={logo} alt="Sales Point Logo" className="logo" />
          </div>
          <div className="user-profile">John Doe Owner</div>
        </header>

        <section className="settings-section">
          <h2>Settings</h2>

          {/* 1. User Accounts */}
          <div className="settings-card">
            <h3>User Accounts</h3>
            <button>Add Cashier</button>
            <button>Add Admin</button>
            <input type="password" placeholder="Set Login PIN/Password" />
            <button>Save User Settings</button>
          </div>

          {/* 2. Payment Settings (Updated) */}
          <div className="settings-card">
            <h3>Payment Summary</h3>

            <div className="payment-summary">
              <p><strong>Cash Payments:</strong> 120</p>
              <p><strong>Card Payments:</strong> 85</p>
              <p><strong>Mobile Wallet Payments:</strong> 64</p>
            </div>

            <button>Save Payment Settings</button>
          </div>

          {/* 4. Receipt Settings */}
          <div className="settings-card">
            <h3>Receipt Settings</h3>
            <input type="text" placeholder="Business Name" />
            <input type="file" />
            <input type="text" placeholder="Receipt Footer Message" />
            <button>Save Receipt Settings</button>
          </div>

          {/* 5. Printer & Hardware */}
          <div className="settings-card">
            <h3>Printer & Hardware</h3>
            <button>Connect Printer</button>
            <label><input type="checkbox" /> Enable Cash Drawer</label>
            <button>Test Drawer</button>
          </div>

          {/* 6. Basic Taxes */}
          <div className="settings-card">
            <h3>Tax Settings</h3>
            <input type="number" placeholder="Tax Rate 1 (%)" />
            <input type="number" placeholder="Tax Rate 2 (%)" />
            <button>Save Tax Settings</button>
          </div>

          {/* 7. Store Info */}
          <div className="settings-card">
            <h3>Store Information</h3>
            <input type="text" placeholder="Store Name" />
            <input type="text" placeholder="Address" />
            <input type="text" placeholder="Currency (₱, $, €)" />
            <button>Save Store Info</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;
