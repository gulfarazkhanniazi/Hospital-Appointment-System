import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Collapse,
  Spinner,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import StartupNavbar from "../componants/Navbar";
import FooterFive from "../componants/SmallFooter";
import background from "../assets/images/bg/03.jpg";
import { Parallax } from "react-parallax";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, logoutUser } from "../states/UserStates";
import { login } from "../redux/UserSlice";
import { toast } from "react-toastify";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.dasuser.user);

  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Load Redux user data
  useEffect(() => {
    if (reduxUser) {
      setFormData((prev) => ({
        ...prev,
        name: reduxUser.name || "",
        email: reduxUser.email || "",
        phone: reduxUser.phone || "",
        gender: reduxUser.gender || "Male",
        age: reduxUser.age || "",
        password: "",
        confirmPassword: "",
      }));
    }
  }, [reduxUser]);

  // Validation
  useEffect(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      newErrors.email = "Invalid email format";

    if (!formData.phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!formData.phone.match(/^\+?[1-9]\d{1,14}$/))
      newErrors.phone = "Invalid phone number (must start with country code)";

    if (!formData.age)
      newErrors.age = "Age is required";
    else if (formData.age < 18 || formData.age > 120)
      newErrors.age = "Age must be between 18 and 120";

    // Password validation
    if (formData.password && formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";

    if (formData.password && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
  }, [formData]);

  const handleEditToggle = () => {
    setErrors({});
    setUpdateError("");
    setEditMode(!editMode);
  };

  const handleLogout = async () => {
    try {
      await logoutUser(dispatch);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    setUpdateError("");

    // Prepare payload (exclude password if empty)
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      age: formData.age,
      ...(formData.password ? { password: formData.password } : {}),
    };

    const { data, error } = await updateUser(reduxUser.id, payload);

    if (error) {
      setUpdateError(error);
    } else {
      dispatch(login(data.user)); // Update Redux user
      toast.success("Profile updated successfully");
      setEditMode(false);
    }
    setIsLoading(false);
  };

  const ProfileCard = useMemo(
    () => (
      <Card
        className="shadow-sm border-0 rounded-3"
        style={{
          width: "100%",
          maxWidth: "1000px",
          background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
          padding: "2rem",
        }}
        role="region"
        aria-label="User Profile"
      >
        <Row className="g-4 align-items-start">
          <Col md={4} className="text-center d-flex flex-column align-items-center">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="User Profile"
              className="rounded-circle"
              style={{ width: "140px", height: "140px", objectFit: "cover" }}
            />
            <h4 className="fw-bold mt-3 text-dark">{formData.name}</h4>
            <p className="text-muted small mb-0">Member since July 2025</p>
          </Col>

          <Col md={8}>
            <Collapse in={!editMode}>
              <div>
                <h4 className="fw-bold mb-4 text-dark">Profile Details</h4>
                <Row className="mb-3">
                  <Col md={6}>
                    <p className="mb-1 text-muted small fw-medium">Email</p>
                    <p className="mb-0 text-dark">{formData.email}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1 text-muted small fw-medium">Phone</p>
                    <p className="mb-0 text-dark">{formData.phone}</p>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col md={6}>
                    <p className="mb-1 text-muted small fw-medium">Gender</p>
                    <p className="mb-0 text-dark">{formData.gender}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1 text-muted small fw-medium">Age</p>
                    <p className="mb-0 text-dark">{formData.age}</p>
                  </Col>
                </Row>
                <div className="d-flex gap-3">
                  <Button variant="primary" onClick={handleEditToggle} className="px-4 py-2 rounded-3">
                    Edit Profile
                  </Button>
                  <Button variant="outline-danger" onClick={handleLogout} className="px-4 py-2 rounded-3">
                    Logout
                  </Button>
                </div>
              </div>
            </Collapse>

            <Collapse in={editMode}>
              <div>
                <Form>
                  <h4 className="fw-bold mb-4 text-dark">Edit Profile</h4>

                  {updateError && <Alert variant="danger" className="py-2">{updateError}</Alert>}

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name" required
                          placeholder="Enter full name"
                          value={formData.name}
                          onChange={handleChange}
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email" required
                          placeholder="example@mail.com"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone" required
                          placeholder="Must start with country code e.g. +92"
                          value={formData.phone}
                          onChange={handleChange}
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Gender</Form.Label>
                        <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      name="age" required
                      placeholder="Enter age (18 - 120)"
                      value={formData.age}
                      onChange={handleChange}
                      isInvalid={!!errors.age}
                    />
                    <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Password Fields */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Enter new password (optional)"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                        />
                        <Form.Text className="text-muted small">
                          Leave blank to keep your current password.
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm new password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-3">
                    <Button
                      variant="primary"
                      onClick={handleUpdate}
                      disabled={isLoading || Object.keys(errors).length > 0}
                      className="px-4 py-2 rounded-3"
                    >
                      {isLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={handleEditToggle}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-3"
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            </Collapse>
          </Col>
        </Row>
      </Card>
    ),
    [formData, editMode, errors, isLoading, updateError]
  );

  return (
    <>
      <StartupNavbar />
      <StartupNavbar
        navClass="defaultscroll sticky"
        manuClass="navigation-menu nav-right nav-light"
        logoLight={true}
      />
      <section className="position-relative overflow-hidden">
        <Parallax blur={{ min: 0, max: 0 }} bgImage={background}
          bgImageAlt="the dog"
          strength={500}
          bgportfolioImageize="100%"
          bgStyle={{ with: "auto", height: "100%" }}
          style={{ position: "absolute", width: "100%", height: "100%" }}></Parallax>
        <div className="bg-overlay bg-gradient-overlay-2"></div>
        <div className="bg-half-170 d-table w-100">
          <div className="container">
            <div className="row mt-5 justify-content-center">
              <div className="col-12 text-center">
                <p className="text-white-50">Manage your personal information</p>
                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                  My Profile
                </h5>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)" }}>
              <nav aria-label="breadcrumb" className="d-block">
                <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                  <li className="breadcrumb-item"><Link to="/">Fronter</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">My Profile</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "60vh",
          padding: "2.5rem",
          background: "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)",
        }}
      >
        {ProfileCard}
      </div>
      <FooterFive />
    </>
  );
}