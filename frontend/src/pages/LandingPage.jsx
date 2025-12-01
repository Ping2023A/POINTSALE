import React from "react";
import "../pages-css/LandingPage.css";
import logo from "../assets/salespoint-logo.png";

const LandingPage = () => {
  return (
    <div className="landing-container">

      <div className="landing-header">

        {/* LOGO ABOVE TITLE */}
        <img src={logo} alt="SalesPoint Logo" className="landing-logo" />

        <h1>Welcome to SalesPoint</h1>
        <p>Select an option to continue</p>
      </div>

      <div className="landing-options">

        <div className="landing-card" onClick={() => window.location.href = "/create-store"}>
          <h3>Create Store</h3>
          <p>Start a new store and manage everything from scratch.</p>
        </div>

        <div className="landing-card" onClick={() => window.location.href = "/join-store"}>
          <h3>Join Store</h3>
          <p>Join an existing store using a store code.</p>
        </div>

        <div className="landing-card" onClick={() => window.location.href = "/view-store"}>
          <h3>View Store</h3>
          <p>View stores you created or joined.</p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
