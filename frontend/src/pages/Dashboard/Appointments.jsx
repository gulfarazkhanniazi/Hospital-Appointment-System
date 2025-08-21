import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Spinner, Pagination, Form } from "react-bootstrap";
import {
  getAllAppointments,
  updateAppointmentStatus,
  searchAppointmentsByName,
} from "../../states/AppointmentStates";

export default function Appointments({ setActive, setSelectedPatientId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);       // main page loading
  const [searchLoading, setSearchLoading] = useState(false); // search-specific loading
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  // ---- Fetch all appointments (pagination) ----
  const fetchAppointments = async (pageNumber = 1) => {
    setLoading(true);
    setError("");
    const { success, data, totalPages: tp, message } = await getAllAppointments(pageNumber, 10);
    setLoading(false);

    if (success) {
      setAppointments(formatAppointments(data));
      setTotalPages(tp || 1);
    } else {
      setError(message || "Failed to load appointments");
    }
  };

  // ---- Format appointments ----
  const formatAppointments = (data) =>
    data.map((a) => {
      const dateObj = new Date(a.appointment_time);
      const time = dateObj.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      return {
        ...a,
        date: dateObj.toISOString().split("T")[0],
        time,
        userName: a.patient_name,
        doctorName: a.doctor_name,
        userId: a.patient_id,
      };
    });

  // ---- Search appointments ----
  const searchAppointments = async (name) => {
    if (!name) return fetchAppointments(page); // load default when cleared

    setSearchLoading(true);
    const { success, data, message } = await searchAppointmentsByName(name);
    setSearchLoading(false);

    if (success) {
      setAppointments(formatAppointments(data));
    } else {
      setError(message || "Failed to search appointments");
    }
  };

  // ---- Initial load ----
  useEffect(() => {
    fetchAppointments(page);
  }, [page]);

  // ---- Debounced search ----
  useEffect(() => {
    const timeout = setTimeout(() => {
      searchAppointments(searchTerm);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // ---- Update status ----
  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(id);
    const { success, message } = await updateAppointmentStatus(id, newStatus);
    setActionLoading(null);

    if (success) {
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-center mb-4">Appointments</h2>

      {error && (
        <div className="alert alert-danger text-center w-50 mx-auto">
          {error}
        </div>
      )}

      {/* ---- Search Bar ---- */}
      <Form className="mb-3 w-50 mx-auto position-relative">
        <Form.Control
          type="text"
          placeholder="Search by patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchLoading && (
          <Spinner
            animation="border"
            size="sm"
            variant="primary"
            style={{ position: "absolute", right: "10px", top: "8px" }}
          />
        )}
      </Form>

      <Table bordered hover responsive className="shadow-sm bg-white rounded">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>User Name</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Disease</th>
            <th>Status / Actions</th>
            <th>History</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appt, index) => (
              <tr key={appt.id}>
                <td>{index + 1}</td>
                <td>{appt.userName}</td>
                <td>{appt.doctorName}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>{appt.disease}</td>
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
                      setActive("PatientHistoryForAdmin");
                    }}
                  >
                    View History
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ---- Pagination (only if not searching) ---- */}
      {!searchTerm && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
            <Pagination.Prev disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} />
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
