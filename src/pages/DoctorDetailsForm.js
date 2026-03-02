import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/login.css";
import "../styles/variables.css";
import { API } from "../config/api";
import AlphanumericCaptcha from "../components/Captcha";

const DoctorDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || "";  //  yaha userId milega

  const [formData, setFormData] = useState({
    userId,
    specialization: "",
    qualification: "",
    experience: "",
    fees: "",
    profile_pic: ""
  });
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
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

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      
      const res = await fetch(API.DOCTORDETAIL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ Doctor details submitted successfully!");
        console.log(result);
        
        // Save token if returned
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        
        navigate("/doctor/dashboard")
      } else {
        alert(result.message || "❌ Failed to submit details");
      }
    } catch (error) {
      console.error("❌ Error:", error);
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
        <div className="brand-tagline">Complete your doctor profile and start serving patients</div>

        <ul className="feature-list">
          <li><i className="fas fa-user-md"></i> Professional profile setup</li>
          <li><i className="fas fa-stethoscope"></i> Specialization details</li>
          <li><i className="fas fa-graduation-cap"></i> Qualification verification</li>
          <li><i className="fas fa-clock"></i> Experience tracking</li>
          <li><i className="fas fa-money-bill-wave"></i> Flexible consultation fees</li>
          <li><i className="fas fa-user-circle"></i> Profile picture upload</li>
          <li><i className="fas fa-calendar-check"></i> Appointment management</li>
          <li><i className="fas fa-shield-alt"></i> Verified doctor badge</li>
        </ul>

        <div className="appointment-badge">
          <i className="fas fa-heartbeat"></i> Join our medical team
        </div>

        <div className="brand-footer-note">
          —  Trusted by thousands of patients
        </div>
      </div>

      {/* RIGHT: DOCTOR FORM */}
      <div className="form-panel">
        <div className="form-header">
          <h2>Doctor Profile</h2>
          <p>Complete your professional details to start consultations</p>
        </div>

        <form className="doctor-form" onSubmit={handleSubmit}>
          {/* specialization field */}
          <div className="input-group">
            <label>Specialization</label>
            <div className="input-wrapper">
              <i className="fas fa-stethoscope"></i>
              <input 
                type="text" 
                name="specialization" 
                placeholder="Enter your specialization"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* qualification field */}
          <div className="input-group">
            <label>Qualification</label>
            <div className="input-wrapper">
              <i className="fas fa-graduation-cap"></i>
              <input 
                type="text" 
                name="qualification" 
                placeholder="Enter your qualification"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* experience field */}
          <div className="input-group">
            <label>Experience (years)</label>
            <div className="input-wrapper">
              <i className="fas fa-clock"></i>
              <input 
                type="number" 
                name="experience" 
                placeholder="Years of experience"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* fees field */}
          <div className="input-group">
            <label>Consultation Fees (₹)</label>
            <div className="input-wrapper">
              <i className="fas fa-money-bill-wave"></i>
              <input 
                type="number" 
                name="fees" 
                placeholder="Consultation fees"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* profile picture field */}
          <div className="input-group">
            <label>Profile Picture</label>
            <div className="input-wrapper">
              <i className="fas fa-user-circle"></i>
              <input 
                type="file" 
                name="profile_pic" 
                accept="image/*" 
                onChange={handleChange} 
                className="file-input"
              />
              <label className="file-input-label">
                <i className="fas fa-upload"></i>
                Choose File
              </label>
            </div>
          </div>

          {/* captcha */}
          <div className="captcha-container">
            <AlphanumericCaptcha 
              onCaptchaChange={handleCaptchaValidate}
            />
          </div>

          {/* submit button */}
          <button type="submit" className="login-btn">
            <i className="fas fa-check-circle"></i> Submit Profile
          </button>

          {/* OR divider */}
          <div className="or-divider">
            <span className="or-divider-line"></span>
            <span>Need help?</span>
            <span className="or-divider-line"></span>
          </div>

          {/* help section */}
          <div className="new-patient">
            <span>Contact support at </span>
            <a href="#">help@medcare.com</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorDetailsForm;
