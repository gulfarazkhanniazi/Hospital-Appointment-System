import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Alert, Spinner, Card, Button } from "react-bootstrap";
import { getDoctorPatientHistory } from "../../states/DoctorState";

export default function PatientHistoryDetails({ patientId, setActive }) {
  const doctor = useSelector((state) => state.dasuser.user);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!doctor?.id || !patientId) return;

      setLoading(true);
      setError("");

      const { success, history: apiHistory, message } =
        await getDoctorPatientHistory(doctor.id, patientId);

      if (success) {
        setHistory(apiHistory || []);
      } else {
        setError(message || "Failed to fetch history");
      }
      setLoading(false);
    };

    fetchHistory();
  }, [doctor, patientId]);

  const sortedHistory = useMemo(
    () =>
      [...history].sort(
        (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
      ),
    [history]
  );

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading patient history...</p>
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );

  if (sortedHistory.length < 1)
    return (
      <Alert variant="info" className="text-center">
        No previous history found for this patient.
      </Alert>
    );

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4 text-primary">
        Patient History
      </h3>

      <div className="d-flex flex-column gap-3">
        {sortedHistory.map((item, index) => (
          <Card
            key={index}
            className="shadow-sm border-0 rounded-3 history-card"
            style={{
              borderLeft: "5px solid #0d6efd",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0 fw-bold text-primary">
                  {item.disease || "No disease specified"}
                </h5>
                <small className="text-muted fw-semibold">
                  {new Date(item.appointment_date).toLocaleDateString()}{" "}
                  {new Date(item.appointment_date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </small>
              </div>
              <p className="mb-1 text-dark">
                <strong>Prescription:</strong>{" "}
                <span className="text-secondary">
                  {item.prescription || "No prescription provided"}
                </span>
              </p>
              <p className="mb-0 text-dark">
                <strong>Notes:</strong>{" "}
                <span className="text-secondary">
                  {item.notes || "No additional notes"}
                </span>
              </p>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Button
        variant="secondary"
        className="mt-4 px-4"
        onClick={() => setActive("DoctorAppointments")}
      >
        Back to Appointments
      </Button>
    </div>
  );
}
