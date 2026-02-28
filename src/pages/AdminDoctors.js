import React, { useState, useEffect, useCallback } from 'react';
import { API } from '../config/api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/adminDoctors.css';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API.ADMIN_DOCTORS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setDoctors(data.doctors || []);
      } else {
        setMessage(data.message || 'Error fetching doctors');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleDoctorSearch = (e) => {
    const value = e.target.value;
    setDoctorSearch(value);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doctor.email.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doctor.qualification.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <AdminSidebar />
      <div className="dashboard-content">
        {message && (
          <div className="message">
            {message}
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        {loading && <div className="loading">Please wait, loading doctors...</div>}

        <div className="admin-doctors">
          <h2>All Doctors</h2>

          {/* Doctor Search Bar */}
          <div className="doctor-search-container">
            <div className="search-input-wrapper">
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-2.35"></path>
              </svg>
              <input
                type="text"
                value={doctorSearch}
                onChange={handleDoctorSearch}
                placeholder="Search doctors by name, email, specialization, qualification..."
                className="doctor-search-input"
              />
              {doctorSearch && (
                <button
                  className="clear-btn"
                  onClick={() => setDoctorSearch('')}
                  title="Clear search"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="doctors-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Fees</th>
                  <th>Experience</th>
                  <th>Qualification</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors && filteredDoctors.length > 0 ? filteredDoctors.map(doctor => (
                  <tr key={doctor.id}>
                    <td>{doctor.name}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.phone}</td>
                    <td>{doctor.specialization}</td>
                    <td>₹{doctor.fees}</td>
                    <td>{doctor.experience} years</td>
                    <td>{doctor.qualification}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7">No doctors found {doctorSearch && `matching "${doctorSearch}"`}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;
