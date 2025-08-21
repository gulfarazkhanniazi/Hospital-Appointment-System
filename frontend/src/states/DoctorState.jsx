import axios from "axios";

const API_URL = "http://localhost:3000/api/doctor";

const handleError = (err, defaultMessage) => ({
  success: false,
  message: err?.response?.data?.error || defaultMessage,
  data: null
});

export const addDoctor = async (doctorData) => {
  try {
    const { data } = await axios.post(`${API_URL}/add`, doctorData, { withCredentials: true });
    return { success: true, data };
  } catch (err) {
    return handleError(err, "Failed to add doctor");
  }
};

export const deleteDoctor = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/delete/${id}`, { withCredentials: true });
    return { success: true, data };
  } catch (err) {
    return handleError(err, "Failed to delete doctor");
  }
};

export const getAllDoctors = async (page = 1) => {
  try {
    const { data } = await axios.get(`${API_URL}/doctors?page=${page}`, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.response?.data?.error || "Failed to fetch doctors" };
  }
};

export const getDoctorById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/doctor/${id}`, { withCredentials: true });
    return { success: true, data };
  } catch (err) {
    return handleError(err, "Failed to fetch doctor");
  }
};

export const updateDoctor = async (id, updateData) => {
  try {
    const { data } = await axios.patch(`${API_URL}/update/${id}`, updateData, { withCredentials: true });
    return { success: true, data };
  } catch (err) {
    return handleError(err, "Failed to update doctor");
  }
};

export const getDoctorsBySpecialization = async (specialization) => {
  try {
    const { data } = await axios.get(`${API_URL}/doctors/specialization/${specialization}`, { withCredentials: true });
    return { success: true, data };
  } catch (err) {
    return handleError(err, "Failed to fetch doctors by specialization");
  }
};

export const loginDoctor = async (credentials) => {
  try {
    const { data } = await axios.post(`${API_URL}auth/login`, credentials, { withCredentials: true });
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.response?.data?.error || "Failed to login doctor" };
  }
};

// ✅ Doctor-Patient History
export const getDoctorPatientHistory = async (doctorId, patientId) => {
  try {
    const response = await axios.get(
      `${API_URL}/history/${doctorId}/${patientId}`,
      { withCredentials: true }
    );

    // response.data already has { success, message, history }
    return {
      success: true,
      message: response.data.message,
      history: response.data.history
    };
  } catch (err) {
    return handleError(err, "Failed to fetch doctor-patient history");
  }
};

// -------------------- Doctor Forgot Password --------------------
export const forgotPasswordDoctor = async (email) => {
  try {
    const { data } = await axios.post(`${API_URL}auth/forgotpassword`, { email });
    return { success: true, data };
  } catch (err) {
    return handleError(err, "Failed to send reset link");
  }
};

// -------------------- Doctor Reset Password --------------------
export const resetPasswordDoctor = async (token, newPassword) => {
  try {
    const { data } = await axios.post(`${API_URL}auth/resetpassword/${token}`, { newPassword });
    return { success: true, data };
  } catch (err) {
    return handleError(err, "Failed to reset password");
  }
};