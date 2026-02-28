// src/pages/DoctorDashboard.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/DoctorSidebar";
import "../styles/doctorDashboard.css";
import { API } from "../config/api";

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [doctorName, setDoctorName] = useState("Doctor");
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(API.DOCTOR_DASHBOARD, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");

        setDoctorName(data?.doctor?.name || "Doctor");
        setTodayAppointments(data?.stats?.todayAppointments || 0);
        setTotalPatients(data?.stats?.totalPatients || 0);
        setUpcomingAppointments(data?.stats?.upcomingAppointments || 0);
        setEarnings(data?.stats?.earnings || 0);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          {loading ? (
            <>
              <h1>Loading dashboard…</h1>
              <p>Please wait</p>
            </>
          ) : error ? (
            <>
              <h1>Welcome</h1>
              <p style={{ opacity: 0.9 }}>{error}</p>
            </>
          ) : (
            <>
              <h1>Welcome Dr. {doctorName} 👋</h1>
              <p>You have {todayAppointments} appointments today.</p>
            </>
          )}
        </div>

        <div className="stats-cards">
          <div className="card">
            <h2>Total Users</h2>
            <p>{totalPatients}</p>
          </div>
          <div className="card">
            <h2>Upcoming Appointments</h2>
            <p>{upcomingAppointments}</p>
          </div>
          <div className="card">
            <h2>Earnings</h2>
            <p>₹{earnings}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;
