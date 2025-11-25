import React, { useState, useEffect } from "react";
import axios from "axios";
import "./settings.css";
import logo from "../assets/salespoint-logo.png";

const API_URL = "http://localhost:5000/api/settings";

const SettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(API_URL);
        const obj = {};
        res.data.forEach((s) => (obj[s.key] = s.value));
        setSettings(obj);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSetting = async (key, value) => {
    try {
      setSaving(true);
      await axios.post(API_URL, { key, value });
      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (err) {
      console.error("Failed to save setting:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="top-bar">
          <div className="logo-container">
            <img src={logo} alt="Sales Point Logo" className="logo" />
          </div>
          <div className="user-profile">John Doe Owner</div>
        </header>

        <section className="settings-section">
          <h2>Settings</h2>

          {/* User Accounts */}
          <div className="settings-card">
            <h3>User Accounts</h3>
            <input
              type="password"
              placeholder="Set Login PIN/Password"
              value={settings.userPin || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, userPin: e.target.value }))
              }
            />
            <button
              disabled={saving}
              onClick={() => saveSetting("userPin", settings.userPin)}
            >
              Save User Settings
            </button>
          </div>

          {/* Payment Summary */}
          <div className="settings-card">
            <h3>Payment Summary</h3>
            <p>Cash: {settings.cashPayments || 0}</p>
            <p>Card: {settings.cardPayments || 0}</p>
            <p>Mobile: {settings.mobilePayments || 0}</p>
          </div>

          {/* Receipt Settings */}
          <div className="settings-card">
            <h3>Receipt Settings</h3>
            <input
              type="text"
              placeholder="Business Name"
              value={settings.businessName || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, businessName: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Receipt Footer"
              value={settings.receiptFooter || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, receiptFooter: e.target.value }))
              }
            />
            <button
              disabled={saving}
              onClick={async () => {
                await saveSetting("businessName", settings.businessName);
                await saveSetting("receiptFooter", settings.receiptFooter);
              }}
            >
              Save Receipt Settings
            </button>
          </div>

          {/* Printer and Drawer */}
          <div className="settings-card">
            <h3>Printer and Drawer</h3>
            <label>
              <input
                type="checkbox"
                checked={settings.enableCashDrawer || false}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    enableCashDrawer: e.target.checked,
                  }))
                }
              />{" "}
              Enable Cash Drawer
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={settings.enablePrinterReceipt || false}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    enablePrinterReceipt: e.target.checked,
                  }))
                }
              />{" "}
              Enable Printer Receipt
            </label>
            <br />
            <button
              disabled={saving}
              onClick={async () => {
                await saveSetting("enableCashDrawer", settings.enableCashDrawer);
                await saveSetting(
                  "enablePrinterReceipt",
                  settings.enablePrinterReceipt
                );
              }}
            >
              Save Printer & Drawer Settings
            </button>
          </div>

          {/* Tax Settings */}
          <div className="settings-card">
            <h3>Tax Settings</h3>
            <input
              type="number"
              placeholder="Tax Rate 1 (%)"
              value={settings.taxRate1 || 0}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, taxRate1: Number(e.target.value) }))
              }
            />
            <input
              type="number"
              placeholder="Tax Rate 2 (%)"
              value={settings.taxRate2 || 0}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, taxRate2: Number(e.target.value) }))
              }
            />
            <button
              disabled={saving}
              onClick={async () => {
                await saveSetting("taxRate1", settings.taxRate1);
                await saveSetting("taxRate2", settings.taxRate2);
              }}
            >
              Save Tax Settings
            </button>
          </div>

          {/* Store Info */}
          <div className="settings-card">
            <h3>Store Information</h3>
            <input
              type="text"
              placeholder="Store Name"
              value={settings.storeName || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, storeName: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Address"
              value={settings.storeAddress || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, storeAddress: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Currency"
              value={settings.storeCurrency || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, storeCurrency: e.target.value }))
              }
            />
            <button
              disabled={saving}
              onClick={async () => {
                await saveSetting("storeName", settings.storeName);
                await saveSetting("storeAddress", settings.storeAddress);
                await saveSetting("storeCurrency", settings.storeCurrency);
              }}
            >
              Save Store Info
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;
