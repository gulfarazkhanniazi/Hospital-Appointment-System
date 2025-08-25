import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card, Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { login } from "../redux/UserSlice";
import { registerUser } from "../states/UserStates";
import bgImg from "../assets/images/bg/07.jpg";
import { toast } from "react-toastify";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
    age: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [checkboxError, setCheckboxError] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    setAcceptTerms(e.target.checked);
    setCheckboxError("");
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value || value.length < 3) return "Name must be at least 3 characters long";
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email address";
        break;
      case "password":
        if (!value || value.length < 8) return "Password must be at least 8 characters long";
        break;
      case "confirmPassword":
        if (value !== formData.password) return "Passwords do not match";
        break;
      case "gender":
        if (!value) return "Please select gender";
        break;
      case "phone":
        if (!/^\+\d{10,15}$/.test(value)) return "Phone must start with country code (e.g. +92XXXXXXXXXX)";
        break;
      case "age":
        if (!value || isNaN(value) || value < 18) return "Age must be at least 18";
        break;
      default:
        return "";
    }
    return "";
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    if (!acceptTerms) {
      setCheckboxError("You must accept the Terms and Conditions");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0 && acceptTerms;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    const { data, error } = await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      phone: formData.phone,
      age: parseInt(formData.age),
    });

    if (error) {
      setApiError(error);
    } else if (data) {
      dispatch(login(data.user));
      toast.success("Registration successful!");
      navigate("/");
    } else {
      setApiError("Unexpected error occurred, please try again later.");
    }
  };

  return (
    <section
      className="d-flex align-items-center"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <div className="bg-overlay bg-gradient-overlay"></div>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <Card className="p-4 shadow rounded">
              <Form noValidate onSubmit={handleSubmit}>
                <div className="text-center mb-3">
                  <h5>Register your account</h5>
                </div>

                {apiError && <Alert variant="danger">{apiError}</Alert>}

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={(e) =>
                          setFieldErrors((prev) => ({ ...prev, name: validateField("name", e.target.value) }))
                        }
                        isInvalid={!!fieldErrors.name}
                      />
                      <Form.Control.Feedback type="invalid">{fieldErrors.name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={(e) =>
                          setFieldErrors((prev) => ({ ...prev, email: validateField("email", e.target.value) }))
                        }
                        isInvalid={!!fieldErrors.email}
                      />
                      <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={(e) =>
                          setFieldErrors((prev) => ({ ...prev, password: validateField("password", e.target.value) }))
                        }
                        isInvalid={!!fieldErrors.password}
                      />
                      <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={(e) =>
                          setFieldErrors((prev) => ({
                            ...prev,
                            confirmPassword: validateField("confirmPassword", e.target.value),
                          }))
                        }
                        isInvalid={!!fieldErrors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">{fieldErrors.confirmPassword}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        onBlur={(e) =>
                          setFieldErrors((prev) => ({ ...prev, gender: validateField("gender", e.target.value) }))
                        }
                        isInvalid={!!fieldErrors.gender}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{fieldErrors.gender}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        placeholder="+92XXXXXXXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={(e) =>
                          setFieldErrors((prev) => ({ ...prev, phone: validateField("phone", e.target.value) }))
                        }
                        isInvalid={!!fieldErrors.phone}
                      />
                      <Form.Control.Feedback type="invalid">{fieldErrors.phone}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        onBlur={(e) =>
                          setFieldErrors((prev) => ({ ...prev, age: validateField("age", e.target.value) }))
                        }
                        isInvalid={!!fieldErrors.age}
                      />
                      <Form.Control.Feedback type="invalid">{fieldErrors.age}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Checkbox full-width above button */}
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label={
                      <>
                        I Accept <Link to="#">Terms And Condition</Link>
                      </>
                    }
                    checked={acceptTerms}
                    onChange={handleCheckboxChange}
                    isInvalid={!!checkboxError}
                  />
                  {checkboxError && <div className="text-danger">{checkboxError}</div>}
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Register
                </Button>

                <div className="text-center mt-3">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="fw-medium">
                    Sign in
                  </Link>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}