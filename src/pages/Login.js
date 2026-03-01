// src/pages/Login.js
import React, { useState } from "react";
import "../styles/login.css"; // your existing CSS
import "../styles/variables.css";
import { API } from "../config/api";
import { useNavigate } from "react-router-dom";
import AlphanumericCaptcha from "../components/Captcha";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [captchaValue, setCaptchaValue] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCaptchaValidate = (isValid) => {
    setIsCaptchaValid(isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate captcha
    if (!isCaptchaValid) {
      alert("❌ Incorrect captcha! Please try again.");
      return;
    }

    try {
      const res = await fetch(API.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // token & role save
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // role wise navigation
      if (data.user.role === "Doctor") {
        navigate("/doctor/dashboard");
      } else if (data.user.role === "Patient") {
        navigate("/patient/dashboard");
      } else if (data.user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong");
    }
  };
  const [activeTab, setActiveTab] = useState("login");
  
  return (
    <div className="login-card">
      {/* LEFT: MEDCARE HOSPITAL branding */}
      <div className="brand-panel">
        {/* Back Button */}
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate("/")}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
        
        <div className="brand-title">
          <i className="fas fa-hospital"></i> MedCare
        </div>
        <div className="brand-tagline">Your trusted partner for hospital appointments and healthcare management</div>

        <ul className="feature-list">
          <li><i className="fas fa-user-md"></i> Expert doctors & specialists</li>
          <li><i className="fas fa-calendar-plus"></i> Easy appointment booking</li>
          <li><i className="fas fa-file-medical"></i> Digital health records</li>
          <li><i className="fas fa-clock"></i> 24/7 emergency support</li>
        </ul>

        <div className="appointment-badge">
          <i className="fas fa-video"></i> Video consultation available
        </div>

        <div className="brand-footer-note">
          —  Your health, our priority
        </div>
      </div>

      {/* RIGHT: LOGIN FORM */}
      <div className="form-panel">
        <div className="form-header">
          <h2>Welcome Back</h2>
          <p>Login to book appointments & manage your health</p>
        </div>

        {/* login/signup toggle */}
        <div className="switch-buttons">
          <span className={`login-active ${activeTab === "login" ? "active" : ""}`} onClick={() => setActiveTab("login")}>Login</span>
          <a href="#" className="signup-link" onClick={(e) => { e.preventDefault(); setActiveTab("signup"); }}>Sign Up</a>
        </div>

        {activeTab === "login" && (
          <form className="login-form" onSubmit={handleSubmit}>
            {/* email field */}
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <i className="far fa-envelope"></i>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email"
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {/* password field */}
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* forgot password */}
            <div className="forgot-row">
              <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}>Forgot Password?</a>
            </div>

            {/* captcha */}
            <div className="captcha-container">
              <AlphanumericCaptcha 
                onCaptchaChange={handleCaptchaValidate}
              />
            </div>

            {/* login button */}
            <button type="submit" className="login-btn">
              <i className="fas fa-sign-in-alt"></i> Login to MedCare
            </button>

            {/* OR divider */}
            <div className="or-divider">
              <span className="or-divider-line"></span>
              <span>Or continue with</span>
              <span className="or-divider-line"></span>
            </div>

            {/* social icons */}
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            </div>

            {/* new patient? */}
            <div className="new-patient">
              <span>New patient? </span>
              <a href="/register">Register here</a>
            </div>
          </form>
        )}

        {activeTab === "signup" && (
          <div className="signup-form">
            <p>Sign up form will be implemented here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;