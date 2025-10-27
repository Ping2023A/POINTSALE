import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/Signup";

import "./App.css";

function App() {
  console.log("App component is rendering");

  return (
    <Router>
      <div style={{ padding: 20 }}>
        <nav className="auth-links">
          <Link to="/login" style={{ marginRight: 10 }}>
            Login
          </Link>
          <Link to="/signup">Signup</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
