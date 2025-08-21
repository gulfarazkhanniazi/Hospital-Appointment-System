import axios from "axios";

// Base API URL (Adjust to your backend)
const API_URL = "http://localhost:3000/api/appointment";

// Helper to handle errors properly
const handleError = (error) => {
  if (error.response && error.response.data) {
    return error.response.data.error || "Something went wrong!";
  }
  return "Network error. Please try again!";
};

// ================== Appointment Functions ================== //

// Add new appointment (Patient only)
export const addAppointment = async (appointmentData) => {
  try {
    const res = await axios.post(`${API_URL}/add`, appointmentData, { withCredentials: true });
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
};

// Single function to update appointment status (confirm/cancel/done)
export const updateAppointmentStatus = async (id, status) => {
  try {
    const res = await axios.patch(
      `${API_URL}/status/${id}`,
      { status },   // status can be: "Confirmed", "Cancelled", "Done"
      { withCredentials: true }
    );
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
};

// Get all appointments of logged-in patient
export const getPatientAppointments = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/patient?page=${page}&limit=${limit}`, {
      withCredentials: true,
    });
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, message: handleError(error, "Failed to fetch appointments") };
  }
};

// ✅ Get all appointments of logged-in doctor (Paginated)
export const getDoctorAppointments = async (page = 1, limit = 10) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/doctor?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );

    return {
      success: true,
      data: data.data,             // appointments array
      totalPages: data.totalPages, // total pages
      totalCount: data.totalCount, // total count
      currentPage: data.currentPage,
      message: "Appointments fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      totalPages: 0,
      totalCount: 0,
      currentPage: page,
      message: handleError(error, "Failed to load doctor appointments"),
    };
  }
};

// Get all appointments (Admin only) with pagination
export const getAllAppointments = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/appointments`, {
      params: { page, limit },
      withCredentials: true,
    });

    return {
      success: true,
      data: res.data.data,      // actual appointment records
      total: res.data.total,    // total number of appointments
      page: res.data.page,      // current page
      totalPages: res.data.totalPages // total number of pages
    };
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
};

// Get booked slots for doctor and date
export const getBookedSlots = async (doctorId, date) => {
  try {
    const res = await axios.get(
      `${API_URL}/booked-slots?doctorId=${doctorId}&date=${date}`,
      { withCredentials: true }
    );
    return { success: true, data: res.data.bookedSlots };
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
};

// ✅ Get all completed appointments (with prescription) for a specific user (Admin only)
export const getCompletedAppointmentsByUser = async (userId) => {
  try {
    const res = await axios.get(
      `${API_URL}/history/${userId}`, 
      { withCredentials: true }
    );
    return { success: true, data: res.data.appointments };
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
};

// Search appointments by patient name (Admin only, max 7)
export const searchAppointmentsByName = async (name) => {
  try {
    const res = await axios.get(
      `${API_URL}/search`,
      {
        params: { name },
        withCredentials: true,
      }
    );
    return {
      success: true,
      data: res.data.data || [],
      count: res.data.count || 0,
      message: "Appointments fetched successfully",
    };
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
};