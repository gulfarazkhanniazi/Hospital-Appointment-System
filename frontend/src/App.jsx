import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "./redux/UserSlice";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import OurTeam from "./pages/OurTeam";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import Error from "./pages/Error";
import FAQs from "./pages/FAQs";
import BlogPage from "./pages/BlogsPage";
import ScrollTop from "./componants/ScrollTop";
import BlogPost from "./pages/BlogPost";
import DocotrDetail from "./pages/DoctorDetail";
import Profile from "./pages/Profile";
import MyAppointments from "./pages/MyAppointments";
import Dashboard from "./pages/Dashboard/DashboardLayout";
import ProtectedRoute from "./componants/ProtectedRoutes";
import ResetPassword from "./pages/ResetPassword";

// Import react-toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./assets/css/materialdesignicons.min.css";
import "./assets/scss/style.scss";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { getLoggedInUserProfile } from "./states/UserStates";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { success, data, message } = await getLoggedInUserProfile();
      if (success && data?.user) {
        dispatch(login(data.user)); // Save user to redux
      } else {
        console.warn("User not found or token expired:", message);
        dispatch(logout());
      }
      setLoading(false);
    };
    checkUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/team" element={<OurTeam />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgetPassword />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogpost/:id" element={<BlogPost />} />
        <Route path="/doctor/:id" element={<DocotrDetail />} />
        <Route path="/resetpassword/:type/:token" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookappointment"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
      {/* Toast container at the top-right */}
      <ToastContainer
        position="top-right"
        autoClose={3000} // Auto close after 5 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeButton={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;