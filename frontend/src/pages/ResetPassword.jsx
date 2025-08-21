import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import bgImg from "../assets/images/bg/07.jpg";
import logo from "../assets/images/logo-icon-80.png";
import { resetPassword } from "../states/UserStates";
import { resetPasswordDoctor } from "../states/DoctorState";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { type, token } = useParams(); // type = 'doctor' or 'patient'

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token || !type) {
      setError("Invalid reset link");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    let response;
    if (type === "doctor") {
      response = await resetPasswordDoctor(token, newPassword);
    } else {
      response = await resetPassword(token, newPassword);
    }

    setLoading(false);

    if (!response.success) {
      setError(response.message || "Failed to reset password");
    } else {
      setSuccess("Password reset successfully. Redirecting to Home...");
      setTimeout(() => navigate("/"), 2000);
    }
  };

  return (
    <section
      className="bg-home d-flex align-items-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="bg-overlay bg-gradient-overlay"></div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="form-signin p-4 bg-white rounded shadow-md">
              <form onSubmit={handleSubmit}>
                <Link to="/">
                  <img src={logo} className="mb-4 d-block mx-auto" alt="" />
                </Link>
                <h5 className="mb-3">Reset Password</h5>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label>New Password</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label>Confirm Password</label>
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>

                <p className="mb-0 text-muted mt-3 text-center">
                  © {new Date().getFullYear()} Fronter.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
