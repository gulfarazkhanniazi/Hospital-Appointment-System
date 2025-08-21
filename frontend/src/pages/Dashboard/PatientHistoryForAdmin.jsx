import React, { useEffect, useState, useMemo } from "react";
import { Alert, Spinner, Card, Button } from "react-bootstrap";
import { getCompletedAppointmentsByUser } from "../../states/AppointmentStates";

export default function PatientHistoryForAdmin({
  selectedPatientId,
  setActive,
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedPatientId) return;

      setLoading(true);
      setError("");

      const { success, data, message } = await getCompletedAppointmentsByUser(
        selectedPatientId
      );

      if (success) {
        setHistory(data || []);
      } else {
        setError(message || "Failed to fetch patient history");
      }
      setLoading(false);
    };

    fetchHistory();
  }, [selectedPatientId]);

  const sortedHistory = useMemo(
    () =>
      [...history].sort(
        (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
      ),
    [history]
  );

  const patientName =
    sortedHistory.length > 0 ? sortedHistory[0].patient_name : "";

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
        No completed appointments found for this patient.
      </Alert>
    );

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4 text-primary">
        Patient History (Admin View)
      </h3>

      {/* --- Patient Info Section --- */}
      <Card
        className="mb-4 shadow-sm border-0"
        style={{ borderLeft: "5px solid #198754" }}
      >
        <Card.Body>
          <h4 className="fw-bold mb-1">{patientName}</h4>
        </Card.Body>
      </Card>

      <div className="d-flex flex-column gap-3">
        {sortedHistory.map((item, index) => (
          <Card
            key={index}
            className="shadow-sm border-0 rounded-3 history-card"
            style={{
              borderLeft: "5px solid #0d6efd",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
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
                <strong>Doctor:</strong>{" "}
                <span className="text-secondary">
                  {item.doctor_name || "N/A"}
                </span>
              </p>
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
        onClick={() => setActive("AdminAppointments")}
      >
        Back to Appointments
      </Button>
    </div>
  );
}
