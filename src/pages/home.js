import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/doctors');
    }
  };

  const handleSpecialtyClick = (specialty) => {
    navigate(`/doctors?specialization=${encodeURIComponent(specialty)}`);
  };

  const handleSymptomClick = (symptom) => {
    navigate(`/doctors?search=${encodeURIComponent(symptom)}`);
  };

  const handleBookNow = (service) => {
    console.log("Service clicked:", service);
    
    // Try direct navigation
    if (service === "appointment") {
      window.location.href = "/doctors";
    } else if (service === "consultation") {
      window.location.href = "/patient/consultation";
    } else if (service === "labtest") {
      window.location.href = "/lab-tests";
    }
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your Health, Our Priority</h1>
          <p className="hero-subtitle">Connect with top doctors, get expert advice, and manage your healthcare journey with confidence</p>
          <div className="hero-buttons">
            <button className="hero-btn hero-btn-primary" onClick={() => navigate("/doctors")}>
              Find Doctors
            </button>
            <button className="hero-btn hero-btn-secondary" onClick={() => navigate("/ai-advisor")}>
              AI Health Advisor
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search doctors by name, specialization, or symptoms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} className="search-btn">Search</button>
      </div>

      {/* Banner Slider */}
      <div className="banner-slider">
        <Slider {...sliderSettings}>
          <div><img src="/images/banner/banner-3.jpeg" alt="Hospital 1" /></div>
          <div><img src="/images/banner/Banner-1.png" alt="Hospital 2" /></div>
          <div><img src="/images/banner/banner-2.jpeg" alt="Hospital 3" /></div>
        </Slider>
      </div>

      {/* Quick Actions */}
      <div className="home-cards">
        <div className="card" onClick={() => window.location.href = "/doctors"}>
          <div className="card-icon">🏥</div>
          <p>Book Appointment</p>
          <button className="book-btn" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = "/doctors";
          }}>Book Now</button>
        </div>

        <div className="card" onClick={() => window.location.href = "/patient/consultation"}>
          <div className="card-icon">💻</div>
          <p>Online Doctor Consultation</p>
          <button className="book-btn" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = "/patient/consultation";
          }}>Book Now</button>
        </div>

        <div className="card" onClick={() => window.location.href = "/lab-tests"}>
          <div className="card-icon">🔬</div>
          <p>Book Lab Test</p>
          <button className="book-btn" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = "/lab-tests";
          }}>Book Now</button>
        </div>

        <div className="card ai-card" onClick={() => window.location.href = "/ai-advisor"}>
          <div className="ai-icon">🤖</div>
          <p>AI Health Advisor</p>
          <button className="book-btn">Chat Now</button>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍⚕️</div>
            <h3 className="feature-title">Expert Doctors</h3>
            <p className="feature-description">Connect with verified and experienced healthcare professionals across all specialties</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Easy Booking</h3>
            <p className="feature-description">Book appointments instantly with our simple and intuitive booking system</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <h3 className="feature-title">Virtual Consultations</h3>
            <p className="feature-description">Get medical advice from the comfort of your home through video consultations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI Health Assistant</h3>
            <p className="feature-description">Get instant health advice and symptom analysis with our advanced AI system</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3 className="feature-title">Medical Records</h3>
            <p className="feature-description">Keep all your medical records and prescriptions organized in one place</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💊</div>
            <h3 className="feature-title">Lab Tests</h3>
            <p className="feature-description">Book lab tests online and get reports delivered digitally</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <h2>Trusted by Millions</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Expert Doctors</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5M+</div>
            <div className="stat-label">Happy Patients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2M+</div>
            <div className="stat-label">Consultations</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Cities Covered</div>
          </div>
        </div>
      </div>

      {/* Specialities */}
      <h2>Select a Speciality</h2>
      <div className="specialities">
        <div className="speciality" onClick={() => handleSpecialtyClick("General Doctor")}>
          <img src="/images/specialities/generaldoctor.png" alt="General Doctor" />
          <span>General Doctor</span>
          <button className="book-btn">Find Doctors</button>
        </div>
        <div className="speciality" onClick={() => handleSpecialtyClick("Dentist")}>
          <img src="/images/specialities/dentist.png" alt="Dentist" />
          <span>Dentist</span>
          <button className="book-btn">Find Doctors</button>
        </div>
        <div className="speciality" onClick={() => handleSpecialtyClick("Cardiology")}>
          <img src="/images/specialities/heart.png" alt="Cardiology" />
          <span>Cardiology</span>
          <button className="book-btn">Find Doctors</button>
        </div>
        <div className="speciality" onClick={() => handleSpecialtyClick("Orthopedics")}>
          <img src="/images/specialities/orthopedics.png" alt="Orthopedics" />
          <span>Orthopedics</span>
          <button className="book-btn">Find Doctors</button>
        </div>
      </div>

      {/* Symptoms */}
      <h2>Common Symptoms</h2>
      <div className="symptoms">
        <div className="symptom" onClick={() => handleSymptomClick("Fever")}>
          <img src="/images/symptoms/fever.png" alt="Fever" />
          <span>Fever</span>
          <button className="book-btn">Find Doctors</button>
        </div>
        <div className="symptom" onClick={() => handleSymptomClick("Cough")}>
          <img src="/images/symptoms/cough.png" alt="Cough" />
          <span>Cough</span>
          <button className="book-btn">Find Doctors</button>
        </div>
        <div className="symptom" onClick={() => handleSymptomClick("Headache")}>
          <img src="/images/symptoms/Headache.png" alt="Headache" />
          <span>Headache</span>
          <button className="book-btn">Find Doctors</button>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2>What Our Patients Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">"The platform made it so easy to find a specialist and book an appointment. The doctor was very professional and the consultation was thorough."</p>
            <div className="testimonial-author">Sarah Johnson</div>
            <div className="testimonial-role">Patient</div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">"I love the AI health advisor feature! It helped me understand my symptoms better before I even spoke to a doctor. Very helpful!"</p>
            <div className="testimonial-author">Michael Chen</div>
            <div className="testimonial-role">Patient</div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">"The virtual consultation saved me so much time. I got expert medical advice without leaving my home. Highly recommend!"</p>
            <div className="testimonial-author">Emily Davis</div>
            <div className="testimonial-role">Patient</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Take Control of Your Health?</h2>
          <p className="cta-description">Join millions of patients who trust us with their healthcare journey. Start today!</p>
          <button className="cta-button" onClick={() => navigate("/register")}>
            Get Started Now
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
