import axios from "axios";
import { logout } from "../redux/UserSlice"; // Redux action

const API_URL = "http://localhost:3000/api/user";

// -------- REGISTER --------
export const registerUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}auth/register`, userData, {
      withCredentials: true,
    });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.error || "Registration failed" };
  }
};

// -------- SEND OTP --------
export const sendOTP = async (email) => {
  try {
    const { data } = await axios.post(`${API_URL}auth/send-otp`, { email }, {withCredentials: true});
    // backend should return { success: true, message: "OTP sent" }
    return { success: true, message: data.message };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.error || "Failed to send OTP",
    };
  }
};

// -------- LOGIN --------
export const loginUser = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}auth/login`, { email, password }, { withCredentials: true });
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.response?.data?.error || "Login failed" };
  }
};

// -------- LOGOUT --------
export const logoutUser = async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}auth/logout`, {}, { withCredentials: true });
    dispatch(logout()); // Clear Redux state
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.error || "Logout failed" };
  }
};

// -------- FORGOT PASSWORD --------
export const forgotPassword = async (email) => {
  try {
    const { data } = await axios.post(`${API_URL}auth/forgotpassword`, { email });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.error || "Failed to send reset link" };
  }
};

// -------- RESET PASSWORD --------
export const resetPassword = async (token, newPassword) => {
  try {
    const { data } = await axios.post(`${API_URL}auth/resetpassword/${token}`, { newPassword });
    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: err.response?.data?.error || "Failed to reset password" };
  }
};

// -------- UPDATE USER --------
export const updateUser = async (id, userData) => {
  try {
    const { data } = await axios.patch(`${API_URL}/update/${id}`, userData, {
      withCredentials: true,
    });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.error || "Update failed" };
  }
};

// -------- CHANGE PASSWORD --------
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const { data } = await axios.patch(
      `${API_URL}/changepassword`,
      { currentPassword, newPassword },
      { withCredentials: true }
    );
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.error || "Password change failed" };
  }
};

// -------- DELETE USER --------
export const deleteUser = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/delete/${id}`, {
      withCredentials: true,
    });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.error || "Delete failed" };
  }
};

// -------- GET USER BY ID (Admin Only) --------
export const getUserById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/user/${id}`, {
      withCredentials: true,
    });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.error || "Failed to fetch user" };
  }
};

// -------- GET ALL USERS (Admin Only) WITH PAGINATION --------
export const getAllUsers = async (page = 1) => {
  try {
    const { data } = await axios.get(`${API_URL}/users?page=${page}`, {
      withCredentials: true,
    });

    // Response structure:
    // {
    //   data: [...users],
    //   currentPage: 1,
    //   totalPages: 5,
    //   totalUsers: 10,
    //   limit: 2
    // }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err.response?.data?.error || "Failed to fetch users",
    };
  }
};

// -------- GET LOGGED-IN USER PROFILE --------
export const getLoggedInUserProfile = async () => {
  try {
    const { data } = await axios.get(`${API_URL}auth/profile`, { withCredentials: true });
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.response?.data?.error || "Failed to fetch profile" };
  }
};