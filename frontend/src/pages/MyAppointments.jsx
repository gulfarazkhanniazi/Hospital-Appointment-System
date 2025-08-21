import { useState, useEffect, useCallback } from "react";
import { Table, Container, Row, Col, Button, Modal, Spinner, Pagination } from "react-bootstrap";
import AppointmentForm from "../componants/AppointmentForm";
import StartupNavbar from "../componants/Navbar";
import FooterFive from "../componants/SmallFooter";
import background from "../assets/images/bg/03.jpg";
import { Parallax } from "react-parallax";
import { Link } from "react-router-dom";
import { getPatientAppointments } from "../states/AppointmentStates";
import { getPrescriptionByAppointment } from "../states/PrescriptionStates";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all appointments (with pagination)
  const fetchAppointments = async (currentPage = 1) => {
    setLoading(true);
    const res = await getPatientAppointments(currentPage, 10);
    if (res.success) {
      setAppointments(res.data.appointments || []);
      setTotalPages(res.data.totalPages || 1);
      setError("");
    } else {
      setError(res.message || "Failed to fetch appointments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments(page);
  }, [page]);

  const handleBook = useCallback((newAppointment) => {
    const doctorName = newAppointment.doctor_name || newAppointment.doctor;
    const appointmentWithDoctor = { ...newAppointment, doctor_name: doctorName };
    setAppointments((prev) => [appointmentWithDoctor, ...prev]);
    setSuccessMessage("Appointment booked successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  }, []);

  // Fetch prescription for selected appointment
  const handleShow = async (appointmentId) => {
    setShowModal(true);
    setPrescriptionLoading(true);
    setPrescriptionError("");
    setSelectedPrescription(null);

    const { data, error } = await getPrescriptionByAppointment(appointmentId);
    setPrescriptionLoading(false);

    if (error) {
      setPrescriptionError(error);
    } else {
      setSelectedPrescription(data);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPrescription(null);
    setPrescriptionError("");
  };

  const capitalizeStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "text-warning fw-bold";
      case "confirmed": return "text-success fw-bold";
      case "cancelled": return "text-danger fw-bold";
      case "done": return "text-primary fw-bold";
      default: return "text-muted";
    }
  };

  return (
    <>
      <StartupNavbar
        navClass="defaultscroll sticky"
        manuClass="navigation-menu nav-right nav-light"
        logoLight={true}
      />
      {/* Page Header */}
      <section className="position-relative overflow-hidden">
        <Parallax
          blur={{ min: 0, max: 0 }}
          bgImage={background}
          bgImageAlt="background"
          strength={500}
          bgStyle={{ width: "auto", height: "100%" }}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        ></Parallax>
        <div className="bg-overlay bg-gradient-overlay-2"></div>
        <div className="bg-half-170 d-table w-100">
          <div className="container">
            <div className="row mt-5 justify-content-center">
              <div className="col-12">
                <div className="title-heading text-center">
                  <p className="text-white-50 para-desc mx-auto mb-0">
                    View & manage your bookings
                  </p>
                  <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                    My Appointments
                  </h5>
                </div>
              </div>
            </div>
            <div
              style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)" }}
            >
              <nav aria-label="breadcrumb" className="d-block">
                <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                  <li className="breadcrumb-item"><Link to="/">Fronter</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">My Appointments</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <Container className="py-5" id="myappointments">
        <Row className="justify-content-center animate__fadeInUp">
          <Col md={8} lg={6}>
            <AppointmentForm onBook={handleBook} />
            {successMessage && <div className="alert alert-success mt-3 text-center">{successMessage}</div>}
            {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
          </Col>
        </Row>

        <Row className="mt-5 animate__fadeInUp">
          <Col>
            {loading ? (
              <h5 className="text-center text-muted">Loading appointments...</h5>
            ) : appointments.length < 1 ? (
              <div className="text-center py-5">
                <h4 className="fw-bold mb-3" style={{ color: "#1a3c61" }}>You have no appointments yet.</h4>
                <p className="text-muted mb-4">Book your first appointment to get started.</p>
              </div>
            ) : (
              <>
                <h3 className="mb-4 text-center fw-bold" style={{ color: "#1a3c61" }}>My Appointments</h3>
                <div style={{ overflowX: "auto" }}>
                  <Table striped hover responsive className="shadow-lg rounded-3"
                    style={{ background: "linear-gradient(145deg, #ffffff, #f8f9fa)", tableLayout: "fixed", width: "100%" }}
                  >
                    <thead style={{ background: "#1a3c61", color: "#ffffff" }}>
                      <tr>
                        <th className="py-3">Date</th>
                        <th className="py-3">Doctor</th>
                        <th className="py-3">Time</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Prescription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="py-3">{appointment.appointment_time?.split("T")[0] || appointment.date}</td>
                          <td className="py-3">{appointment.doctor_name || appointment.doctor}</td>
                          <td className="py-3">
                            {new Date(appointment.appointment_time).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td className={getStatusColor(appointment.status)}>
                            {capitalizeStatus(appointment.status)}
                          </td>
                          <td className="py-3">
                            {appointment.status?.toLowerCase() === "done" ? (
                              <Button variant="link" className="text-primary p-0 fw-semibold"
                                onClick={() => handleShow(appointment.id)}>
                                Show Prescription
                              </Button>
                            ) : ("-")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
                      <Pagination.Prev disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} />
                      {[...Array(totalPages).keys()].map((num) => (
                        <Pagination.Item key={num + 1} active={num + 1 === page} onClick={() => setPage(num + 1)}>
                          {num + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)} />
                      <Pagination.Last disabled={page === totalPages} onClick={() => setPage(totalPages)} />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* Prescription Modal */}
      <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton className="border-0 bg-primary text-white">
          <Modal.Title>Prescription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          {prescriptionLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading prescription...</p>
            </div>
          ) : prescriptionError ? (
            <p className="text-danger text-center">{prescriptionError}</p>
          ) : selectedPrescription ? (
            <div className="prescription-content">
              <p className="mb-0 text-muted"><strong>Prescription: </strong>{selectedPrescription.prescription}</p>
              {selectedPrescription.notes && (
                <p className="text-muted mt-2"><strong>Notes:</strong> {selectedPrescription.notes}</p>
              )}
              <p className="text-secondary mt-2"><strong>Disease:</strong> {selectedPrescription.disease}</p>
            </div>
          ) : (
            <p className="text-muted text-center">No prescription details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleClose} className="rounded-pill px-4">Close</Button>
        </Modal.Footer>
      </Modal>

      <FooterFive />
    </>
  );
};

export default MyAppointments;