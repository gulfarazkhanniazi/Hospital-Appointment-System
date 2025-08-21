import axios from "axios";

const API_URL = "http://localhost:3000/api/email";

// -------- SEND CONTACT MESSAGE --------
export const sendContactMessage = async (contactData) => {
  try {
    const { data } = await axios.post(`${API_URL}/contact`, contactData, {
      withCredentials: false,
    });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.error || "Failed to send message" };
  }
};
