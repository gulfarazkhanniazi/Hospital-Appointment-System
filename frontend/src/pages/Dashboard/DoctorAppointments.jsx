import { useEffect, useState, useMemo } from "react";
import { Table, Button, Badge, Spinner, Pagination } from "react-bootstrap";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../../states/AppointmentStates";
import { toast } from "react-toastify";

export default function DoctorAppointments({
  setActive,
  setSelectedPatientId,
  setSelectedAppointmentId,
}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchAppointments = async (p = page) => {
    setLoading(true);
    setError("");
    const { success, data, totalPages: tp, message } = await getDoctorAppointments(
      p,
      limit
    );
    if (success) {
      setAppointments(data);
      setTotalPages(tp || 1);
    } else {
      setError(message || "Failed to fetch appointments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments(page);
    // eslint-disable-next-line
  }, [page]);

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(id);
    const { success, message } = await updateAppointmentStatus(id, newStatus);
    setActionLoading(null);

    if (success) {
      toast.success("Appointment Successfully", newStatus);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: newStatus } : appt
        )
      );
    } else {
      setError(message || "Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <Badge bg="success">Confirmed</Badge>;
      case "cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      case "done":
        return <Badge bg="secondary">Done</Badge>;
      default:
        return <Badge bg="warning">Pending</Badge>;
    }
  };

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort(
      (a, b) => new Date(b.appointment_time) - new Date(a.appointment_time)
    );
  }, [appointments]);

  const formatDate = (datetime) =>
    new Date(datetime).toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (datetime) =>
    new Date(datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading doctor appointments...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-center mb-4">My Appointments</h2>

      {error && (
        <div className="alert alert-danger text-center w-50 mx-auto">{error}</div>
      )}

      <Table bordered hover responsive className="shadow-sm bg-white rounded">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Disease</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status / Actions</th>
            <th>History</th>
            <th>Prescription</th>
          </tr>
        </thead>
        <tbody>
          {sortedAppointments.length > 0 ? (
            sortedAppointments.map((appt, index) => (
              <tr key={appt.id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{appt.patient_name}</td>
                <td>{appt.disease}</td>
                <td>{formatDate(appt.appointment_time)}</td>
                <td>{formatTime(appt.appointment_time)}</td>
                <td>
                  {appt.status?.toLowerCase() === "pending" ? (
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        disabled={actionLoading === appt.id}
                        onClick={() => handleStatusChange(appt.id, "confirmed")}
                      >
                        {actionLoading === appt.id ? "..." : "Confirm"}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={actionLoading === appt.id}
                        onClick={() => handleStatusChange(appt.id, "cancelled")}
                      >
                        {actionLoading === appt.id ? "..." : "Cancel"}
                      </Button>
                    </div>
                  ) : (
                    getStatusBadge(appt.status)
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => {
                      setSelectedPatientId(appt.patient_id);
                      setActive("PatientHistory");
                    }}
                  >
                    View History
                  </Button>
                </td>
                <td>
                  {appt.status?.toLowerCase() === "confirmed" && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedAppointmentId(appt.id);
                        setActive("AddPrescription");
                      }}
                    >
                      Add Prescription
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted py-4">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
            <Pagination.Prev
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            />
            {[...Array(totalPages).keys()].map((num) => (
              <Pagination.Item
                key={num + 1}
                active={num + 1 === page}
                onClick={() => setPage(num + 1)}
              >
                {num + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            />
            <Pagination.Last
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
}
