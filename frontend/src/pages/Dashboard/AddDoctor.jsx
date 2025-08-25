import { useState } from "react";
import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import { addDoctor } from "../../states/DoctorState";
import { toast } from "react-toastify";

export default function AddDoctor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
    age: "",
    specialization: "",
    experience: "",
    schedule: {},
    fees: "",
    available: false,
  });

  const [days, setDays] = useState({
    monday: { checked: false, from: "", to: "" },
    tuesday: { checked: false, from: "", to: "" },
    wednesday: { checked: false, from: "", to: "" },
    thursday: { checked: false, from: "", to: "" },
    friday: { checked: false, from: "", to: "" },
    saturday: { checked: false, from: "", to: "" },
    sunday: { checked: false, from: "", to: "" },
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDayToggle = (day) =>
    setDays((prev) => ({
      ...prev,
      [day]: { ...prev[day], checked: !prev[day].checked },
    }));

  const handleTimeChange = (day, field, value) =>
    setDays((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));

  const validate = () => {
    const newErrors = {};

    if (!formData.name?.trim() || formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.gender) newErrors.gender = "Please select a gender";
    if (!formData.phone || !/^\+\d{10,15}$/.test(formData.phone))
      newErrors.phone = "Phone must start with country code (e.g. +92XXXXXXXXXX)";
    if (!formData.age || formData.age < 18)
      newErrors.age = "Age must be at least 18";
    if (!formData.specialization)
      newErrors.specialization = "Specialization is required";
    if (formData.experience === "" || formData.experience < 0)
      newErrors.experience = "Experience must be a positive number";
    if (!formData.fees || formData.fees < 0)
      newErrors.fees = "Fees must be a positive number";

    const selectedDays = Object.entries(days).filter(([_, d]) => d.checked);
    if (selectedDays.length === 0) {
      newErrors.schedule = "At least one day schedule is required";
    } else {
      const invalidDays = [];
      selectedDays.forEach(([day, d]) => {
        if (!d.from || !d.to) {
          invalidDays.push(`${day} (missing time)`);
        } else {
          const [fromHour, fromMin] = d.from.split(":").map(Number);
          const [toHour, toMin] = d.to.split(":").map(Number);

          const startMinutes = fromHour * 60 + fromMin;
          const endMinutes = toHour * 60 + toMin;

          if (endMinutes <= startMinutes) {
            invalidDays.push(`${day} (end time must be greater than start time)`);
          }
        }
      });

      if (invalidDays.length > 0) {
        newErrors.schedule =
          "Invalid schedule for: " +
          invalidDays
            .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
            .join(", ");
      }
    }

    return newErrors;
  };

  const buildScheduleJSON = () => {
    const formatted = {};
    Object.entries(days).forEach(([day, { checked, from, to }]) => {
      if (checked && from && to) {
        const [fromHour, fromMin] = from.split(":").map(Number);
        const [toHour, toMin] = to.split(":").map(Number);

        formatted[day.charAt(0).toUpperCase() + day.slice(1)] = {
          start: fromHour * 60 + fromMin, // store full minutes
          end: toHour * 60 + toMin,       // store full minutes
        };
      }
    });
    return formatted;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setApiError("");

    if (!Object.keys(newErrors).length) {
      const finalData = {
        ...formData,
        schedule: buildScheduleJSON(),
        fees: parseFloat(formData.fees),
        age: parseInt(formData.age),
        experience: parseInt(formData.experience),
      };

      const res = await addDoctor(finalData);
      if (res.success) {
        toast.success("Doctor added successfully.");
        resetForm();
      } else setApiError(res.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      gender: "",
      phone: "",
      age: "",
      specialization: "",
      experience: "",
      schedule: {},
      fees: "",
      available: false,
    });
    setDays({
      monday: { checked: false, from: "", to: "" },
      tuesday: { checked: false, from: "", to: "" },
      wednesday: { checked: false, from: "", to: "" },
      thursday: { checked: false, from: "", to: "" },
      friday: { checked: false, from: "", to: "" },
      saturday: { checked: false, from: "", to: "" },
      sunday: { checked: false, from: "", to: "" },
    });
  };

  return (
    <div style={{ paddingBottom: "50px" }}>
      <Card className="shadow-lg rounded-4 p-4 animate__animated animate__fadeIn">
        <h3 className="mb-4 fw-bold text-center">Add Doctor</h3>

        {apiError && <Alert variant="danger">{apiError}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            {/* Name */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Password */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Strong password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Gender */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  isInvalid={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Phone */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  placeholder="+92XXXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Age */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  placeholder="Age (min 18)"
                  value={formData.age}
                  onChange={handleChange}
                  isInvalid={!!errors.age}
                />
                <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Specialization */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Specialization</Form.Label>
                <Form.Select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  isInvalid={!!errors.specialization}
                >
                  <option value="">Select Specialization</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                  <option value="General Physician">General Physician</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.specialization}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Experience */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Experience (Years)</Form.Label>
                <Form.Control
                  type="number"
                  name="experience"
                  placeholder="Years of experience"
                  value={formData.experience}
                  onChange={handleChange}
                  isInvalid={!!errors.experience}
                />
                <Form.Control.Feedback type="invalid">{errors.experience}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Schedule */}
            <Col md={12}>
              <Form.Label className="fw-bold">Schedule</Form.Label>
              {Object.keys(days).map((day) => (
                <Row key={day} className="mb-2 align-items-center">
                  <Col xs={4} md={2}>
                    <Form.Check
                      type="checkbox"
                      label={day.charAt(0).toUpperCase() + day.slice(1)}
                      checked={days[day].checked}
                      onChange={() => handleDayToggle(day)}
                    />
                  </Col>
                  <Col xs={4} md={3}>
                    <Form.Control
                      type="time"
                      disabled={!days[day].checked}
                      value={days[day].from}
                      onChange={(e) => handleTimeChange(day, "from", e.target.value)}
                    />
                  </Col>
                  <Col xs={4} md={3}>
                    <Form.Control
                      type="time"
                      disabled={!days[day].checked}
                      value={days[day].to}
                      onChange={(e) => handleTimeChange(day, "to", e.target.value)}
                    />
                  </Col>
                </Row>
              ))}
              {errors.schedule && <div className="text-danger">{errors.schedule}</div>}
            </Col>

            {/* Fees */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fees</Form.Label>
                <Form.Control
                  type="number"
                  name="fees"
                  placeholder="e.g. 1000"
                  value={formData.fees}
                  onChange={handleChange}
                  isInvalid={!!errors.fees}
                />
                <Form.Control.Feedback type="invalid">{errors.fees}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Available */}
            <Col md={12}>
              <Form.Check
                type="checkbox"
                name="available"
                label="Available for Appointments"
                checked={formData.available}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Button type="submit" className="mt-4 px-4 py-2" variant="primary">
            Add Doctor
          </Button>
        </Form>
      </Card>
    </div>
  );
}
