import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bgImg from "../assets/images/bg/07.jpg";
import logo from "../assets/images/logo-icon-80.png";
import { forgotPassword } from "../states/UserStates";
import { forgotPasswordDoctor } from "../states/DoctorState";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    let response;
    if (isDoctor) {
      response = await forgotPasswordDoctor(email); // { success, message, data }
      if (!response.success) {
        setError(response.message || "Failed to send reset link");
      } else {
        setMessage(
          response.data?.message || "Password reset link sent successfully."
        );
        setEmail("");
      }
    } else {
      response = await forgotPassword(email); // { data, error }
      if (response.error) {
        setError(response.error);
      } else {
        setMessage(
          response.data?.message || "Password reset link sent successfully."
        );
        setEmail("");
      }
    }

    setLoading(false);
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
                <h5 className="mb-3">Reset your password</h5>
                <p className="text-muted">
                  Please enter your email address. You will receive a link to
                  create a new password via email.
                </p>

                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                {message && (
                  <div className="alert alert-success py-2">{message}</div>
                )}

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label>Email address</label>
                </div>

                {/* Doctor checkbox */}
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isDoctor"
                      checked={isDoctor}
                      onChange={(e) => setIsDoctor(e.target.checked)}
                    />
                    <label
                      className="form-check-label text-muted"
                      htmlFor="isDoctor"
                    >
                      I am a Doctor
                    </label>
                  </div>
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </button>

                <div className="col-12 text-center mt-3">
                  <span>
                    <span className="text-muted me-2">
                      Remember your password?
                    </span>
                    <Link to="/login" className="text-dark fw-medium">
                      Sign in
                    </Link>
                  </span>
                </div>

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
