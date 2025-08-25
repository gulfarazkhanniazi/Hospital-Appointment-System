import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Spinner,
  Modal,
  Alert,
} from "react-bootstrap";
import { getDoctorById, deleteDoctor } from "../../states/DoctorState";
import { toast } from "react-toastify";

// ---- Convert minutes to 12-hour format (e.g., 90 → 1:30 AM) ----
const formatTime = (minutes) => {
  if (minutes === undefined || minutes === null) return "";

  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

export default function DoctorDetails({ selectedDoctorId, setActive }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDoctor = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    const { success, data, message } = await getDoctorById(selectedDoctorId);
    if (success && data) {
      setDoctor(data);
    } else {
      setError(message || "Failed to load doctor details");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedDoctorId) fetchDoctor();
  }, [selectedDoctorId]);

  const handleDeleteDoctor = async () => {
    setDeleting(true);
    const { success, message } = await deleteDoctor(selectedDoctorId);
    setDeleting(false);
    setShowDeleteModal(false);

    if (success) {
      toast.success("Doctor deleted successfully.");
      setTimeout(() => setActive("Doctors"), 1500);
    } else {
      setError(message || "Failed to delete doctor.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading doctor details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" className="me-2" onClick={() => setActive("Doctors")}>
          Back to Doctors
        </Button>
        <Button variant="primary" onClick={fetchDoctor}>
          Retry
        </Button>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-5">
        <Alert variant="warning">Doctor details not available</Alert>
        <Button className="mt-3" onClick={() => setActive("Doctors")}>
          Back to Doctors
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in active">
      {success && (
        <Alert variant="success" className="text-center w-50 mx-auto">
          {success}
        </Alert>
      )}

      <Card className="shadow-sm border-0 rounded-3 overflow-hidden">
        <div className="bg-primary text-white p-4 d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-1">{doctor.name}</h3>
            <small>{doctor.specialization}</small>
          </div>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "#fff",
              color: "#0d6efd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {doctor.name?.charAt(0)}
          </div>
        </div>

        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <p><strong>Email:</strong> {doctor.email}</p>
              <p><strong>Phone:</strong> {doctor.phone}</p>
              <p><strong>Gender:</strong> {doctor.gender}</p>
              <p><strong>Experience:</strong> {doctor.experience} years</p>
            </Col>
            <Col md={6}>
              <p><strong>Age:</strong> {doctor.age}</p>
              <p>
                <strong>Available:</strong>{" "}
                <span className={doctor.available ? "text-success" : "text-danger"}>
                  {doctor.available ? "Yes" : "No"}
                </span>
              </p>
              <p><strong>Fees:</strong> Rs. {doctor.fees}</p>
            </Col>
          </Row>

          {doctor.schedule && Object.keys(doctor.schedule).length > 0 ? (
            <>
              <h5 className="mb-3">Schedule</h5>
              <Table bordered hover responsive className="shadow-sm">
                <thead className="table-primary">
                  <tr>
                    <th>Day</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(doctor.schedule).map(([day, time], index) => (
                    <tr key={index}>
                      <td>{day}</td>
                      <td>
                        {typeof time === "object"
                          ? `${formatTime(time.start)} - ${formatTime(time.end)}`
                          : time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <Alert variant="info">No schedule available</Alert>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={() => setActive("Doctors")}>
              Back
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Delete Doctor
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{doctor.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteDoctor} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .fade-in.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
