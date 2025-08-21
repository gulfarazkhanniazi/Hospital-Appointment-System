import { Link, useNavigate } from "react-router-dom";
import bgImg from "../assets/images/bg/07.jpg";
import logo from "../assets/images/logo-icon-80.png";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/UserSlice";
import { loginUser } from "../states/UserStates";
import { loginDoctor } from "../states/DoctorState";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    let response = isDoctor
      ? await loginDoctor({ email, password })
      : await loginUser(email, password);

    if (response.success) {
      const user = isDoctor
        ? { ...response.data?.doctor, role: "doctor" }
        : response.data.user;

      dispatch(login(user));
      navigate("/");
    } else {
      setError(response.message);
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
                <h5 className="mb-3">Please Log in</h5>

                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                <div className="form-floating mb-2">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label>Email address</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label>Password</label>
                </div>

                {/* Forgot Password Link */}
                <div className="text-end mb-3">
                  <Link to="/forgotpassword" className="small text-muted">
                    Forgot password?
                  </Link>
                </div>

                {/* Checkbox for Doctor Login */}
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="loginAsDoctor"
                      checked={isDoctor}
                      onChange={(e) => setIsDoctor(e.target.checked)}
                    />
                    <label
                      className="form-check-label text-muted"
                      htmlFor="loginAsDoctor"
                    >
                      Login as Doctor
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  Login
                </button>

                <div className="col-12 text-center mt-3">
                  <span>
                    <span className="text-muted me-2">
                      Don't have an account ?
                    </span>
                    <Link to="/signup" className="text-dark fw-medium">
                      Sign Up
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
