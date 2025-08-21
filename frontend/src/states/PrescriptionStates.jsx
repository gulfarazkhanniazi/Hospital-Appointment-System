import axios from "axios";

const API_URL = "http://localhost:3000/api/prescription";

// -------- ADD PRESCRIPTION (Doctor only) --------
export const addPrescription = async (prescriptionData) => {
  try {
    const { data } = await axios.post(`${API_URL}/add`, prescriptionData, {
      withCredentials: true,
    });
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err.response?.data?.error || "Failed to add prescription",
    };
  }
};

// -------- GET PRESCRIPTION BY APPOINTMENT (Doctor/Patient/Admin) --------
export const getPrescriptionByAppointment = async (appointmentId) => {
  try {
    const { data } = await axios.get(`${API_URL}/prescription/${appointmentId}`, {
      withCredentials: true,
    });
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err.response?.data?.error || "Failed to fetch prescription",
    };
  }
};

// -------- GET ALL PRESCRIPTIONS (Admin only) --------
export const getAllPrescriptions = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/prescriptions`, {
      withCredentials: true,
    });
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err.response?.data?.error || "Failed to fetch prescriptions",
    };
  }
};
