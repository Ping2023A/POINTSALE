import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import OrderPage from "./pages/OrderPage";
import Inventory from "./pages/Inventory";
import Dashboard from "./pages/Dashboard";
import ShiftSchedule from "./pages/shift";
import "./App.css";

function App() {
  console.log('Rendering App');

  return (
    <Router>
      <Routes>
        {/* Default route redirects to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Auth routes */}
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* Main pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/shift" element={<ShiftSchedule />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;