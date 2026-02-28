import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="#0f766e"/>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand-logo">
              <div className="logo-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <span className="brand-name">MEDCARE</span>
            </div>
            <p className="brand-description">
              Your trusted healthcare platform for quality medical services and compassionate care.
            </p>
            <div className="brand-contact">
              <div className="contact-item">
                <i className="fas fa-phone-alt"></i>
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>care@doctorcare.com</span>
              </div>
            </div>
          </div>

          <div className="footer-links-section">
            <div className="links-column">
              <h5>Quick Links</h5>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/doctors">Find Doctors</Link></li>
                <li><Link to="/lab-tests">Lab Tests</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="links-column">
              <h5>Services</h5>
              <ul>
                <li><Link to="/patient/appointments">Book Appointment</Link></li>
                <li><Link to="/patient/consultation">Online Consultation</Link></li>
                <li><Link to="/ai-advisor">AI Health Advisor</Link></li>
                <li><Link to="/patient/lab-tests">Lab Test Booking</Link></li>
                <li><Link to="/patient/feedback">Give Feedback</Link></li>
              </ul>
            </div>

            <div className="links-column">
              <h5>Support</h5>
              <ul>
                <li><Link to="#">Help Center</Link></li>
                <li><Link to="#">FAQs</Link></li>
                <li><Link to="#">Privacy Policy</Link></li>
                <li><Link to="#">Terms of Service</Link></li>
                <li><Link to="#">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 MEDCARE. All rights reserved. Made with ❤️ for better healthcare.</p>
            </div>
            
            <div className="footer-social">
              <div className="social-title">Follow Us</div>
              <div className="social-icons">
                <a href="#" className="social-icon facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-icon linkedin">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="social-icon youtube">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>

            <div className="footer-apps">
              <div className="app-title">Download App</div>
              <div className="app-buttons">
                <a href="#" className="app-button">
                  <i className="fab fa-apple"></i>
                  <div className="app-text">
                    <span className="app-small">Download on</span>
                    <span className="app-large">App Store</span>
                  </div>
                </a>
                <a href="#" className="app-button">
                  <i className="fab fa-google-play"></i>
                  <div className="app-text">
                    <span className="app-small">Get it on</span>
                    <span className="app-large">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
