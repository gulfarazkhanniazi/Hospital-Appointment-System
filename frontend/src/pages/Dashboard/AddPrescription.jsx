import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { addPrescription } from "../../states/PrescriptionStates";

const AddPrescription = ({ appointmentId }) => {
  const [formData, setFormData] = useState({
    prescription: "",
    notes: "",
    disease: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Optimized handleChange with error clearing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.prescription.trim()) {
      newErrors.prescription = "Prescription is required";
    }
    if (!formData.disease.trim()) {
      newErrors.disease = "Disease name is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const { data, error } = await addPrescription({
      appointment_id: appointmentId,
      ...formData,
    });
    setLoading(false);

    if (error) {
      setMessage({ type: "danger", text: error });
    } else {
      setMessage({ type: "success", text: "Prescription added successfully" });
      setFormData({ prescription: "", notes: "", disease: "" });
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-4">
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6}>
          <Card className="shadow border-0 rounded-3">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold">Add Prescription</h3>
                <p className="text-muted small">
                  Fill in the details to create a new prescription
                </p>
              </div>

              {message && (
                <Alert
                  variant={message.type}
                  className="py-2 mb-4"
                  onClose={() => setMessage(null)}
                  dismissible
                >
                  {message.text}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="prescription">
                  <Form.Label className="fw-semibold">
                    Prescription *
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter prescription details"
                    name="prescription"
                    value={formData.prescription}
                    onChange={handleChange}
                    isInvalid={!!errors.prescription}
                  />
                  <Form.Control.Feedback type="invalid" className="mt-1">
                    {errors.prescription}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="notes">
                  <Form.Label className="fw-semibold">Notes for User</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add important notes (e.g., diet, precautions)"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="disease">
                  <Form.Label className="fw-semibold">Disease *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter disease name"
                    name="disease"
                    value={formData.disease}
                    onChange={handleChange}
                    isInvalid={!!errors.disease}
                  />
                  <Form.Control.Feedback type="invalid" className="mt-1">
                    {errors.disease}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="rounded-3 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" animation="border" /> : "Save Prescription"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddPrescription;
