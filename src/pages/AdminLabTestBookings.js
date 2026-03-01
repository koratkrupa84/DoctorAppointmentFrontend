import React, { useState, useEffect, useCallback } from 'react';
import { API } from '../config/api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/adminLabTestBookings.css';

const AdminLabTestBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    updating: null,
    deleting: null,
    creating: false
  });
  const [bookingSearch, setBookingSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [formData, setFormData] = useState({
    patient_id: '',
    test_id: '',
    date: '',
    time: '',
    reference_doctor: ''
  });

  const token = localStorage.getItem('token');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API.ADMIN_LAB_TEST_BOOKINGS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings || []);
      } else {
        setMessage(data.message || 'Error fetching lab test bookings');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchLabTests = useCallback(async () => {
    console.log('Fetching lab tests...');
    if (!token) {
      console.error('No token available');
      return;
    }
    try {
      const response = await fetch(API.ADMIN_LAB_TESTS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Lab tests response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lab tests error response:', errorText);
        setMessage(`Error: ${response.status} - ${errorText}`);
        return;
      }
      
      const data = await response.json();
      console.log('Lab tests response:', data);
      if (data.labTests) {
        setLabTests(data.labTests);
        console.log('Lab tests loaded:', data.labTests.length);
      } else {
        console.warn('No lab tests in response');
        setLabTests([]);
      }
    } catch (error) {
      console.error('Error fetching lab tests:', error);
      setMessage('Failed to fetch lab tests. Check console for details.');
    }
  }, [token]);

  const fetchPatients = useCallback(async () => {
    console.log('=== FETCHING PATIENTS ===');
    console.log('Token available:', !!token);
    console.log('API endpoint:', API.ADMIN_USERS);
    
    if (!token) {
      console.error('No token available for fetching patients');
      setMessage('Authentication token missing');
      return;
    }
    
    try {
      const response = await fetch(API.ADMIN_USERS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Patients response status:', response.status);
      console.log('Patients response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Patients fetch error:', errorText);
        setMessage(`Error fetching patients: ${response.status} - ${errorText}`);
        return;
      }
      
      const data = await response.json();
      console.log('Raw patients response data:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', Object.keys(data));
      
      if (data.users) {
        console.log('Users found:', data.users.length);
        const allUsers = data.users;
        console.log('All users:', allUsers);
        
        const filteredPatients = allUsers.filter(user => {
          console.log(`User ${user.name} role: ${user.role}`);
          return user.role === 'patient';
        });
        
        console.log('Filtered patients:', filteredPatients);
        setPatients(filteredPatients);
        
        if (filteredPatients.length === 0) {
          console.warn('No patients found in users list');
          setMessage('No patients found in the system');
        }
      } else if (data.patients) {
        console.log('Direct patients array found:', data.patients.length);
        setPatients(data.patients);
      } else {
        console.warn('No users or patients array in response');
        setPatients([]);
      }
    } catch (error) {
      console.error('Network error fetching patients:', error);
      setMessage('Failed to connect to server for patients');
    }
  }, [token]);

  const fetchDoctors = useCallback(async () => {
    console.log('Fetching doctors...');
    try {
      const response = await fetch(API.ALL_DOCTORS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Doctors response:', data);
      if (response.ok) {
        setDoctors(data.doctors || []);
        console.log('Doctors loaded:', data.doctors);
      } else {
        console.error('Error fetching doctors:', data.message);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  }, [token]);

  // Check if token exists and fetch data
  useEffect(() => {
    if (!token) {
      setMessage('No authentication token found. Please login again.');
      return;
    }
    console.log('Token found:', token.substring(0, 20) + '...');
    fetchBookings();
    fetchLabTests();
    fetchPatients();
    fetchDoctors();
  }, [fetchBookings, fetchLabTests, fetchPatients, fetchDoctors]);

  const handleBookingSearch = (e) => {
    const value = e.target.value;
    setBookingSearch(value);
  };

  // Patient search handlers
  const handlePatientSearch = (e) => {
    const value = e.target.value;
    console.log('Patient search input:', value);
    setPatientSearch(value);
    setShowPatientDropdown(true);
    
    // If user is typing manually, allow custom name
    if (value) {
      const existingPatient = patients.find(p => p.name.toLowerCase() === value.toLowerCase());
      if (!existingPatient) {
        setSelectedPatientName(value);
        setFormData(prev => ({ ...prev, patient_id: '' }));
      } else {
        // If exact match found, update the form data
        setSelectedPatientName(existingPatient.name);
        setFormData(prev => ({ ...prev, patient_id: existingPatient.id }));
      }
    } else {
      setSelectedPatientName('');
      setFormData(prev => ({ ...prev, patient_id: '' }));
    }
  };

  const handlePatientSelect = (patient) => {
    console.log('Patient selected:', patient);
    setFormData(prev => ({ ...prev, patient_id: patient.id }));
    setSelectedPatientName(patient.name);
    setPatientSearch(patient.name);
    setShowPatientDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPatientDropdown && !event.target.closest('.patient-search-container')) {
        setShowPatientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPatientDropdown]);

  // Filter patients for dropdown
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.email.toLowerCase().includes(patientSearch.toLowerCase())
  );

  // Debug patients data
  useEffect(() => {
    console.log('Patients state updated:', patients);
    console.log('Filtered patients:', filteredPatients);
    console.log('Patient search term:', patientSearch);
  }, [patients, filteredPatients, patientSearch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    
    if (!formData.patient_id || !formData.test_id || !formData.date || !formData.time) {
      setMessage('Patient, test, date, and time are required');
      return;
    }

    setActionLoading(prev => ({ ...prev, creating: true }));
    try {
      const response = await fetch(API.ADMIN_CREATE_LAB_TEST_BOOKING, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('Lab test booking created successfully');
        setShowAddModal(false);
        setFormData({
          patient_id: '',
          test_id: '',
          date: '',
          time: '',
          reference_doctor: ''
        });
        fetchBookings();
      } else {
        setMessage(data.message || 'Error creating lab test booking');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setActionLoading(prev => ({ ...prev, creating: false }));
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      patient_id: '',
      test_id: '',
      date: '',
      time: '',
      reference_doctor: ''
    });
    setPatientSearch('');
    setSelectedPatientName('');
    setShowPatientDropdown(false);
  };

  const filteredBookings = bookings.filter(booking =>
    (booking.patient && booking.patient.name && booking.patient.name.toLowerCase().includes(bookingSearch.toLowerCase())) ||
    (booking.test && booking.test.test_name && booking.test.test_name.toLowerCase().includes(bookingSearch.toLowerCase())) ||
    (booking.date && booking.date.includes(bookingSearch)) ||
    (booking.time && booking.time.includes(bookingSearch)) ||
    (booking.status && booking.status.toLowerCase().includes(bookingSearch.toLowerCase()))
  );

  const updateBookingStatus = async (bookingId, newStatus) => {
    setActionLoading(prev => ({ ...prev, updating: bookingId }));
    try {
      const response = await fetch(`${API.ADMIN_UPDATE_LAB_TEST_BOOKING_STATUS}/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Lab test booking status updated successfully');
        fetchBookings(); // Refresh the list
      } else {
        setMessage(data.message || 'Error updating lab test booking status');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setActionLoading(prev => ({ ...prev, updating: null }));
    }
  };

  const deleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this lab test booking?')) {
      setActionLoading(prev => ({ ...prev, deleting: bookingId }));
      try {
        const response = await fetch(`${API.ADMIN_DELETE_LAB_TEST_BOOKING}/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (response.ok) {
          setMessage('Lab test booking deleted successfully');
          fetchBookings(); // Refresh the list
        } else {
          setMessage(data.message || 'Error deleting lab test booking');
        }
      } catch (error) {
        setMessage('Error connecting to server');
      } finally {
        setActionLoading(prev => ({ ...prev, deleting: null }));
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ffc107';
      case 'Confirmed': return '#28a745';
      case 'Completed': return '#007bff';
      case 'Cancelled': return '#dc3545';
      case 'Expired': return '#6c757d';
      default: return '#6c757d';
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <AdminSidebar />
        <div className="dashboard-content">
          {message && (
            <div className={`lab-test-message ${message.includes('successfully') ? 'success' : message.includes('Error') ? 'error' : 'info'}`}>
              {message}
              <button onClick={() => setMessage('')}>×</button>
            </div>
          )}

          {loading && <div className="loading">Please wait, loading lab test bookings...</div>}

          <div className="admin-lab-test-bookings">
            <div className="bookings-header">
              <h2>Lab Test Bookings</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary"
              >
                + Add Lab Test Booking
              </button>
            </div>

            {/* Lab Test Booking Search Bar */}
            <div className="booking-search-container">
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
                  value={bookingSearch}
                  onChange={handleBookingSearch}
                  placeholder="Search bookings by patient name, test name, date, time, status, or reference doctor..."
                  className="booking-search-input"
                />
                {bookingSearch && (
                  <button
                    className="clear-btn"
                    onClick={() => setBookingSearch('')}
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

            <div className="admin-bookings-table">
              <table>
                <thead className="admin-bookings-table-head">
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Test Name</th>
                    <th>Price</th>
                    <th>Reference Doctor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings && filteredBookings.length > 0 ? filteredBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
                      <td>
                        <div className="patient-info">
                          <strong>{booking.patient.name}</strong>
                          <br />
                          <small>{booking.patient.email}</small>
                          <br />
                          <small>{booking.patient.phone}</small>
                        </div>
                      </td>
                      <td>
                        <div className="test-info">
                          <strong>{booking.test.test_name}</strong>
                        </div>
                      </td>
                      <td>₹{booking.test.price}</td>
                      <td>{booking.referenceDoctor || '-'}</td>
                      <td>
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          className="status-select"
                          style={{
                            backgroundColor: getStatusColor(booking.status),
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          disabled={actionLoading.updating === booking.id}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Expired">Expired</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="delete-btn"
                          disabled={actionLoading.deleting === booking.id}
                        >
                          {actionLoading.deleting === booking.id ? 'Please wait...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" className="no-bookings">
                        {bookingSearch ? `No lab test bookings found matching "${bookingSearch}"` : 'No lab test bookings found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Booking Modal */}
          {showAddModal && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Add Lab Test Booking</h3>
                  <button className="modal-close" onClick={handleCloseModal}>×</button>
                </div>
                <form onSubmit={handleAddBooking}>
                  <div className="form-group">
                    <label htmlFor="patient_id">Patient *</label>
                    <div className="patient-search-container">
                      <input
                        type="text"
                        name="patient_search"
                        value={patientSearch}
                        onChange={handlePatientSearch}
                        onFocus={() => setShowPatientDropdown(true)}
                        placeholder="Search patient or type name..."
                        className="patient-search-input"
                        required
                      />
                      {showPatientDropdown && patientSearch && filteredPatients.length > 0 && (
                        <div className="patient-dropdown">
                          {filteredPatients.map(patient => (
                            <div
                              key={patient.id}
                              className="patient-option"
                              onClick={() => handlePatientSelect(patient)}
                            >
                              <div className="patient-option-name">{patient.name}</div>
                              <div className="patient-option-email">{patient.email}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {showPatientDropdown && patientSearch && filteredPatients.length === 0 && (
                        <div className="patient-dropdown">
                          <div className="patient-option no-results">
                            No patient found. You can use "{patientSearch}" as patient name.
                          </div>
                        </div>
                      )}
                    </div>
                    {selectedPatientName && !formData.patient_id && (
                      <small className="custom-patient-note">
                        Using custom patient name: <strong>{selectedPatientName}</strong>
                      </small>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="test_id">Lab Test *</label>
                    <select
                      id="test_id"
                      name="test_id"
                      value={formData.test_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Lab Test</option>
                      {labTests.map(test => (
                        <option key={test.id} value={test.id}>
                          {test.test_name} - ₹{test.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Time *</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reference_doctor">Reference Doctor</label>
                    <select
                      id="reference_doctor"
                      name="reference_doctor"
                      value={formData.reference_doctor}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Doctor (Optional)</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.name}>
                          Dr. {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="btn btn-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={actionLoading.creating}
                    >
                      {actionLoading.creating ? 'Creating...' : 'Create Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLabTestBookings;
