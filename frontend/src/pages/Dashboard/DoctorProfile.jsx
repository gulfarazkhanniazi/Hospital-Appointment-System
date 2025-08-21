import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getDoctorById, updateDoctor } from "../../states/DoctorState";
import { login } from "../../redux/UserSlice";

// ---- Convert minutes to HH:MM (for <input type="time">) ----
const minutesToTimeString = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// ---- Convert "HH:MM" to minutes ----
const timeStringToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

export default function DoctorProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.dasuser.user); // Logged-in doctor info
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [days, setDays] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // ---- Fetch doctor details ----
  const fetchDoctor = async () => {
    setLoading(true);
    setError("");
    const res = await getDoctorById(user.id);
    if (res.success) {
      setDoctor(res.data);
      setFormData({ ...res.data, password: "" });
      setDays(parseSchedule(res.data.schedule || {}));
    } else {
      setError(res.message || "Failed to load doctor details");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) fetchDoctor();
  }, [user]);

  // ---- Parse schedule from backend (minutes -> time input) ----
  const parseSchedule = (schedule) => {
    const week = {
      monday: { checked: false, from: "", to: "" },
      tuesday: { checked: false, from: "", to: "" },
      wednesday: { checked: false, from: "", to: "" },
      thursday: { checked: false, from: "", to: "" },
      friday: { checked: false, from: "", to: "" },
      saturday: { checked: false, from: "", to: "" },
      sunday: { checked: false, from: "", to: "" },
    };

    Object.entries(schedule).forEach(([day, time]) => {
      const key = day.toLowerCase();
      week[key] = {
        checked: true,
        from: minutesToTimeString(time.start),
        to: minutesToTimeString(time.end),
      };
    });
    return week;
  };

  const handleDayToggle = (day) =>
    setDays((prev) => ({
      ...prev,
      [day]: { ...prev[day], checked: !prev[day].checked },
    }));

  const handleTimeChange = (day, field, value) =>
    setDays((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));

  // ---- Build schedule for backend (time -> minutes) ----
  const buildScheduleJSON = () => {
    const formatted = {};
    Object.entries(days).forEach(([day, { checked, from, to }]) => {
      if (checked && from && to) {
        const capitalized = day.charAt(0).toUpperCase() + day.slice(1);
        formatted[capitalized] = {
          start: timeStringToMinutes(from),
          end: timeStringToMinutes(to),
        };
      }
    });
    return formatted;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---- Update doctor profile ----
  const handleUpdate = async () => {
    setUpdating(true);
    setError("");
    setSuccess("");

    if (formData.password && formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setUpdating(false);
      return;
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
      age: formData.age,
      specialization: formData.specialization,
      experience: formData.experience,
      fees: formData.fees,
      available: formData.available,
      schedule: buildScheduleJSON(),
    };

    // Only send password if not empty
    if (formData.password && formData.password.trim() !== "") {
      payload.password = formData.password;
    }

    const res = await updateDoctor(user.id, payload);
    setUpdating(false);

    if (res.success) {
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      setDoctor(res.data.doctor);
      dispatch(login({ ...user, ...res.data.doctor }));
    } else {
      setError(res.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return <Alert variant="danger">Doctor details not found.</Alert>;
  }

  return (
    <div className="container py-4">
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow border-0 rounded-3">
        <div className="bg-primary text-white p-4 d-flex justify-content-between align-items-center">
          <h3 className="mb-0">{doctor.name}</h3>
          {!editMode && (
            <Button variant="light" size="sm" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control value={formData.email || ""} disabled readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  name="specialization"
                  value={formData.specialization || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Experience (years)</Form.Label>
                <Form.Control
                  type="number"
                  name="experience"
                  value={formData.experience || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fees</Form.Label>
                <Form.Control
                  type="number"
                  name="fees"
                  value={formData.fees || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Available</Form.Label>
                <Form.Select
                  name="available"
                  value={formData.available ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      available: e.target.value === "true",
                    }))
                  }
                  disabled={!editMode}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {editMode && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    placeholder="Leave empty to keep current"
                  />
                </Form.Group>
              </Col>
            )}

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
                      disabled={!editMode}
                      onChange={() => handleDayToggle(day)}
                    />
                  </Col>
                  <Col xs={4} md={3}>
                    <Form.Control
                      type="time"
                      disabled={!days[day].checked || !editMode}
                      value={days[day].from}
                      onChange={(e) => handleTimeChange(day, "from", e.target.value)}
                    />
                  </Col>
                  <Col xs={4} md={3}>
                    <Form.Control
                      type="time"
                      disabled={!days[day].checked || !editMode}
                      value={days[day].to}
                      onChange={(e) => handleTimeChange(day, "to", e.target.value)}
                    />
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>

          {editMode && (
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdate} disabled={updating}>
                {updating ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
