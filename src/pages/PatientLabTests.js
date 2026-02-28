import React, { useState, useEffect } from "react";
import { API } from "../config/api";
import PatientSidebar from "../components/PatientSidebar";
import "../styles/patientLabTests.css";

const PatientLabTests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(API.PATIENT_LAB_TEST_BOOKINGS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load lab test bookings");

        setBookings(data.bookings || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <PatientSidebar />
        <div className="lab-tests-container">
          <h2>My Lab Test Bookings</h2>

          {loading ? (
            <div className="loading-container">
              <p>Loading lab test bookings...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              No lab test bookings found.
            </div>
          ) : (
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reference Doctor</th>
                    <th>Status</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.test_name}</td>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
                      <td>{booking.referenceDoctor || '-'}</td>
                      <td className={`status status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </td>
                      <td>₹{booking.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientLabTests;
