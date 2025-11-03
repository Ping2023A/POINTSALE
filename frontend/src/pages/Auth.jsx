import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./auth.css";
import logo from "../assets/salespoint-logo.png";
import googleIcon from "../assets/google-icon.png";
import facebookIcon from "../assets/facebook-icon.png";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();

  try {
    if (isLogin) {
      // Log in existing user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", userCredential.user);
    } else {
      // Sign up new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up:", userCredential.user);
      // Optional: update profile with first/last name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
    }

    // Redirect to POS system
    navigate("/order");
  } catch (error) {
    console.error("Auth error:", error.message);
    alert(error.message);
  }
}

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="logo-section">
          <img src={logo} alt="Sales Point Logo" className="logo" />
          <h1>Sales Point</h1>
        </div>

        <div className="tab-header">
          <button
            type="button"
            className={`tab ${!isLogin ? "active" : "inactive"}`}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
          <button
            type="button"
            className={`tab ${isLogin ? "active" : "inactive"}`}
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>

        <h2>Welcome!</h2>
        <p className="subtitle">
          {isLogin ? "Please log in to continue" : "Please sign up to continue"}
        </p>

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            👁️
          </span>
        </div>

        {isLogin && (
          <div className="forgot-password">
            <button type="button" className="link-button">
              Forgot Password?
            </button>
          </div>
        )}

        <button type="submit" className="login-btn">
          {isLogin ? "Log In" : "Sign Up"}
        </button>

        <div className="divider">
          {isLogin ? "Or log in with" : "Or sign up with"}
        </div>

        <div className="social-buttons">
          <button type="button" className="social-btn google">
            <img src={googleIcon} alt="Google" />
            Google
          </button>
          <button type="button" className="social-btn facebook">
            <img src={facebookIcon} alt="Facebook" />
            Facebook
          </button>
        </div>
      </form>
    </div>
  );
}

export default Auth;