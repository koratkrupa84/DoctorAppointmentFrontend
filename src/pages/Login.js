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
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <AlphanumericCaptcha 
            onCaptchaChange={handleCaptchaValidate}
          />
        </div>

        <div className="form-links">
          <button
            type="button"
            className="forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="login-button">
          Login
        </button> 

        <div className="register-link">
          Don’t have an account? <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
