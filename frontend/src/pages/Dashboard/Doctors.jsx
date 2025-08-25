import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Pagination } from "react-bootstrap";
import { getAllDoctors } from "../../states/DoctorState";

export default function Doctors({ setActive, setSelectedDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDoctors = async (pageNumber = 1) => {
    setLoading(true);
    setError("");
    const { success, data, message } = await getAllDoctors(pageNumber);
    if (success && data?.data) {
      setDoctors(data.data);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || pageNumber);
    } else {
      setError(message || "Failed to load doctors");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors(1);
  }, []);

  const handleDetails = (doctorId) => {
    setSelectedDoctor(doctorId);
    setActive("DoctorDetails");
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">Doctors List</h2>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading doctors...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={() => fetchDoctors(page)}>
            Retry
          </Button>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center text-muted">No doctors found.</div>
      ) : (
        <>
          <Table bordered hover responsive className="shadow-sm rounded bg-white">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th className="text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{(page - 1) * 1 + index + 1}</td>
                  <td>{doc.name}</td>
                  <td>{doc.email}</td>
                  <td>{doc.specialization}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => handleDetails(doc.id)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  disabled={page === 1}
                  onClick={() => fetchDoctors(1)}
                />
                <Pagination.Prev
                  disabled={page === 1}
                  onClick={() => fetchDoctors(page - 1)}
                />
                {[...Array(totalPages).keys()].map((num) => (
                  <Pagination.Item
                    key={num + 1}
                    active={num + 1 === page}
                    onClick={() => fetchDoctors(num + 1)}
                  >
                    {num + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={page === totalPages}
                  onClick={() => fetchDoctors(page + 1)}
                />
                <Pagination.Last
                  disabled={page === totalPages}
                  onClick={() => fetchDoctors(totalPages)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}