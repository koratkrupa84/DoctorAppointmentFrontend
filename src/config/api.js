// Backend base URL 
const BASE_URL = "http://localhost:5000";

export const API = {
  BASE_URL,
  REGISTER: `${BASE_URL}/user/register`,
  LOGIN: `${BASE_URL}/user/login`,
  FORGOT_PASSWORD: `${BASE_URL}/user/forgot-password`,
  DOCTORDETAIL : `${BASE_URL}/doctor/details`,
  DOCTOR_DASHBOARD: `${BASE_URL}/doctor/dashboard`,
  DOCTOR_PROFILE_UPDATE: `${BASE_URL}/doctor/profile`,
  DOCTOR_APPOINTMENTS: `${BASE_URL}/doctor/appointments`,
  ALL_DOCTORS: `${BASE_URL}/doctor/all`,
  BOOK_APPOINTMENT: `${BASE_URL}/doctor/book-appointment`,
  PATIENT_DASHBOARD: `${BASE_URL}/user/dashboard`,
  PATIENT_APPOINTMENTS: `${BASE_URL}/user/appointments`,
  PATIENT_PROFILE: `${BASE_URL}/user/profile`,
  PATIENT_PROFILE_UPDATE: `${BASE_URL}/user/profile`,
  // Feedback APIs
  SUBMIT_FEEDBACK: `${BASE_URL}/user/feedback`,
  GET_USER_FEEDBACK: `${BASE_URL}/user/feedback`,
  // Admin APIs
  ADMIN_DASHBOARD: `${BASE_URL}/admin/dashboard`,
  ADMIN_APPOINTMENTS: `${BASE_URL}/admin/appointments`,
  ADMIN_UPDATE_APPOINTMENT_STATUS: `${BASE_URL}/admin/appointments`,
  ADMIN_DELETE_APPOINTMENT: `${BASE_URL}/admin/appointments`,
  ADMIN_USERS: `${BASE_URL}/admin/users`,
  ADMIN_CREATE_USER: `${BASE_URL}/admin/users`,
  ADMIN_DELETE_USER: `${BASE_URL}/admin/users`,
  ADMIN_BOOK_APPOINTMENT: `${BASE_URL}/admin/appointments`,
  ADMIN_DOCTORS: `${BASE_URL}/admin/doctors`,
  ADMIN_CREATE: `${BASE_URL}/admin/create`,
  ADMIN_LIST: `${BASE_URL}/admin/list`,
  ADMIN_UPDATE_PERMISSIONS: `${BASE_URL}/admin/permissions`,
  ADMIN_DELETE: `${BASE_URL}/admin`,
  ADMIN_MARK_EXPIRED: `${BASE_URL}/admin/mark-expired`,
  // Admin Feedback APIs
  ADMIN_FEEDBACK: `${BASE_URL}/admin/feedback`,
  ADMIN_UPDATE_FEEDBACK_STATUS: `${BASE_URL}/admin/feedback`,
  ADMIN_RESPOND_FEEDBACK: `${BASE_URL}/admin/feedback`,
  ADMIN_DELETE_FEEDBACK: `${BASE_URL}/admin/feedback`,
  // Lab Test APIs
  ALL_LAB_TESTS: `${BASE_URL}/user/lab-tests`,
  BOOK_LAB_TEST: `${BASE_URL}/user/book-lab-test`,
  PATIENT_LAB_TEST_BOOKINGS: `${BASE_URL}/user/lab-test-bookings`,
  // Admin Lab Test APIs
  ADMIN_LAB_TESTS: `${BASE_URL}/admin/lab-tests`,
  ADMIN_CREATE_LAB_TEST: `${BASE_URL}/admin/lab-tests`,
  ADMIN_UPDATE_LAB_TEST: `${BASE_URL}/admin/lab-tests`,
  ADMIN_DELETE_LAB_TEST: `${BASE_URL}/admin/lab-tests`,
  // Admin Lab Test Bookings APIs
  ADMIN_LAB_TEST_BOOKINGS: `${BASE_URL}/admin/lab-test-bookings`,
  ADMIN_UPDATE_LAB_TEST_BOOKING_STATUS: `${BASE_URL}/admin/lab-test-bookings`,
  ADMIN_DELETE_LAB_TEST_BOOKING: `${BASE_URL}/admin/lab-test-bookings`,
  // Consultation APIs
  CONSULTATION_DOCTORS: `${BASE_URL}/user/consultation/doctors`,
  CREATE_CONSULTATION: `${BASE_URL}/user/consultation`,
  PATIENT_CONSULTATIONS: `${BASE_URL}/user/consultations`,
  CONSULTATION_MESSAGES: `${BASE_URL}/user/consultation`,
  SEND_CONSULTATION_MESSAGE: `${BASE_URL}/user/consultation`,
  DOCTOR_CONSULTATIONS: `${BASE_URL}/doctor/consultations`,
  DOCTOR_CONSULTATION_MESSAGES: `${BASE_URL}/doctor/consultation`,
  DOCTOR_SEND_CONSULTATION_MESSAGE: `${BASE_URL}/doctor/consultation`,
  // AI Advisor API
  AI_ADVICE: `${BASE_URL}/ai/advice`,
  // Admin Consultation APIs
  ADMIN_CONSULTATIONS: `${BASE_URL}/admin/consultations`,
  ADMIN_CONSULTATION_MESSAGES: `${BASE_URL}/admin/consultations`,
  ADMIN_REPLY_CONSULTATION: `${BASE_URL}/admin/consultations`
};
