import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import OrderPage from "./pages/OrderPage";
import Inventory from "./pages/Inventory";
import Dashboard from "./pages/Dashboard";
import ShiftSchedule from "./pages/shift";
import AuditLogsPage from "./pages/AuditLogsPage";
import Roles from "./pages/Roles";
import SettingsPage from "./pages/SettingsPage";   // ✅ Import SettingsPage
import Layout from "./Layout/layout";
import "./App.css";

function App() {
  console.log("Rendering App");

  return (
    <Router>
      <Routes>
        {/* Auth routes (no sidebar) */}
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* Main app wrapped with shared Layout (contains sidebar) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="shift" element={<ShiftSchedule />} />
          <Route path="audit" element={<AuditLogsPage />} />
          <Route path="roles" element={<Roles />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;