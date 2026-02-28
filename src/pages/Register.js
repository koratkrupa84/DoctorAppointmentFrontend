import React, { useState } from "react";
import "../styles/register.css";
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
      if (res.ok) {
        alert(data.message); // ✅ backend se { message: "..."} aa raha hai
        
        if (formData.role === "Patient") {
          navigate("/patient/dashboard");
        } else if (formData.role === "Doctor") {
          navigate("/doctorsd", {state : {userId : data.user._id}});
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
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <div className="gender-options">
            <label>
              <input type="radio" name="gender" value="Male" onChange={handleChange} required /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" onChange={handleChange} /> Female
            </label>
            <label>
              <input type="radio" name="gender" value="Other" onChange={handleChange} /> Other
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea name="address" rows="3" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dob" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
          </select>
        </div>

        <div className="form-group">
          <AlphanumericCaptcha 
            onCaptchaChange={handleCaptchaValidate}
          />
        </div>

        <button type="submit" className="register-button">
          Register
        </button>

        <div className="login-redirect">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
