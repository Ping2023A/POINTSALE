import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/AuthPage";
import OrderPage from "./pages/OrderPage";
import Inventory from "./pages/InventoryPage";
import Dashboard from "./pages/Dashboard";
import ShiftSchedule from "./pages/ShiftPage";
import AuditLogsPage from "./pages/AuditPage";
import Roles from "./pages/RolesPage";
import SettingsPage from "./pages/SettingsPage";
import CreateStore from "./pages/CreateStore";
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
          {/* Redirect root to login page instead of dashboard */}
          <Route index element={<Navigate to="/login" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="shift" element={<ShiftSchedule />} />
          <Route path="audit" element={<AuditLogsPage />} />
          <Route path="roles" element={<Roles />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="/createstore" element={<CreateStore />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
