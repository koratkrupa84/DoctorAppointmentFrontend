import React, { useState } from "react";
import "../styles/login.css";
import "../styles/variables.css";
import {useNavigate, Link} from "react-router-dom";
import { API } from "../config/api";
import AlphanumericCaptcha from "../components/Captcha";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
    address: "",
    dob: "",
    role: "",
  });

  const [captchaValue, setCaptchaValue] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    const { confirmPassword, ...submitData } = formData;

    console.log("Submitting form data:", submitData);

    try {
      const res = await fetch(API.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      console.log("Registration response:", data); // Debug log
      
      if (res.ok) {
        alert(data.message); // ✅ backend se { message: "..."} aa raha hai
        
        // Auto-login after registration to get token
        try {
          const loginRes = await fetch(API.LOGIN, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            }),
          });

          const loginData = await loginRes.json();
          console.log("Auto-login response:", loginData);
          
          if (loginRes.ok && loginData.token) {
            localStorage.setItem("token", loginData.token);
            localStorage.setItem("userRole", loginData.user?.role || data.user?.role);
            console.log("✅ Auto-login successful, token saved");
          } else {
            console.log("❌ Auto-login failed, but registration successful");
            alert("Registration successful! Please login manually.");
          }
        } catch (loginError) {
          console.error("❌ Auto-login error:", loginError);
          alert("Registration successful! Please login manually.");
        }
        
        if (formData.role === "Patient") {
          navigate("/patient/dashboard");
        } else if (formData.role === "Doctor") {
          navigate("/doctorsd", {state : {userId : data.user?._id || data._id}});
        }
      } else {
        alert(data.message || "❌ Registration failed");
      }
    } catch (error) {
      console.error("❌ API error:", error);
      alert("Server error, try again later!");
    }
  };

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
        <div className="brand-tagline">Join our healthcare community and start your wellness journey today</div>

        <ul className="feature-list">
          <li><i className="fas fa-user-plus"></i> Quick & easy registration</li>
          <li><i className="fas fa-shield-alt"></i> Secure medical records</li>
          <li><i className="fas fa-calendar-check"></i> Instant appointment booking</li>
          <li><i className="fas fa-user-md"></i> Access to expert doctors</li>
          <li><i className="fas fa-video"></i> Video consultation available</li>
          <li><i className="fas fa-clock"></i> 24/7 emergency support</li>
          <li><i className="fas fa-pills"></i> Prescription management</li>
          <li><i className="fas fa-file-medical-alt"></i> Health history tracking</li>
        </ul>

        <div className="appointment-badge">
          <i className="fas fa-heart"></i> Your health matters
        </div>

        <div className="brand-footer-note">
          —  Join thousands of healthy patients
        </div>
      </div>

      {/* RIGHT: REGISTER FORM */}
      <div className="form-panel">
        <div className="form-header">
          <h2>Create Account</h2>
          <p>Join MedCare and take control of your health</p>
        </div>

        {/* login/signup toggle */}
        <div className="switch-buttons">
          <a href="/login" className="signup-link">Login</a>
          <span className="login-active active">Sign Up</span>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* name field */}
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <i className="fas fa-user"></i>
              <input 
                type="text" 
                name="name" 
                placeholder="Enter your full name"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

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

          {/* gender field */}
          <div className="input-group">
            <label>Gender</label>
            <div className="gender-options">
              <label className="radio-label">
                <input type="radio" name="gender" value="Male" onChange={handleChange} required />
                <span className="radio-text">Male</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="Female" onChange={handleChange} />
                <span className="radio-text">Female</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="Other" onChange={handleChange} />
                <span className="radio-text">Other</span>
              </label>
            </div>
          </div>

          {/* phone field */}
          <div className="input-group">
            <label>Phone Number</label>
            <div className="input-wrapper">
              <i className="fas fa-phone"></i>
              <input 
                type="tel" 
                name="phone" 
                placeholder="Enter your phone number"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* address field */}
          <div className="input-group">
            <label>Address</label>
            <div className="input-wrapper">
              <i className="fas fa-home"></i>
              <textarea 
                name="address" 
                placeholder="Enter your address"
                rows="2"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* dob field */}
          <div className="input-group">
            <label>Date of Birth</label>
            <div className="input-wrapper">
              <i className="fas fa-birthday-cake"></i>
              <input 
                type="date" 
                name="dob" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* role field */}
          <div className="input-group">
            <label>Register As</label>
            <div className="input-wrapper">
              <i className="fas fa-user-tag"></i>
              <select name="role" onChange={handleChange} required className="role-select">
                <option value="">Select Role</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </select>
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
                placeholder="Create a password"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* confirm password field */}
          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* captcha */}
          <div className="captcha-container">
            <AlphanumericCaptcha 
              onCaptchaChange={handleCaptchaValidate}
            />
          </div>

          {/* register button */}
          <button type="submit" className="login-btn">
            <i className="fas fa-user-plus"></i> Create Account
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

          {/* existing user? */}
          <div className="new-patient">
            <span>Already have an account? </span>
            <a href="/login">Login here</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
