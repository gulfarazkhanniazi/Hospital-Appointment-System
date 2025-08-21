import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col, Alert, Pagination, Spinner } from "react-bootstrap";
import { getAllUsers, updateUser, deleteUser } from "../../states/UserStates";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", age: "", gender: "", phone: "" });
  const [error, setError] = useState("");

  // Fetch Users
  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);
    const res = await getAllUsers(pageNumber);
    if (res.error) {
      setError(res.error);
    } else {
      setUsers(res.data.data); // server returns: { data: [...users], totalPages, currentPage }
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  // Delete User
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setDeletingId(selectedUser.id);
    const res = await deleteUser(selectedUser.id);
    if (res.error) {
      setError(res.error);
    } else {
      // Refresh current page after deletion
      fetchUsers(page);
    }
    setDeletingId(null);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Edit User
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm(user); // preload form
    setShowEditModal(true);
    setError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateEditForm = () => {
    if (!editForm.name || editForm.name.length < 3) return "Name must be at least 3 characters";
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(editForm.email)) return "Invalid email format";
    if (!/^\+92\d{10}$/.test(editForm.phone))
      return "Phone must be in +92XXXXXXXXXX format (12 digits)";
    if (!editForm.age || editForm.age < 1 || editForm.age > 150) return "Invalid age";
    return null;
  };

  const saveEdit = async () => {
    const validationError = validateEditForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    const res = await updateUser(selectedUser.id, {
      name: editForm.name,
      email: editForm.email,
      age: Number(editForm.age),
      gender: editForm.gender,
      phone: editForm.phone,
    });
    if (res.error) {
      setError(res.error);
    } else {
      fetchUsers(page);
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold">Patients List</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table bordered hover responsive className="shadow-sm rounded bg-white">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Gender</th>
            <th className="text-center">Edit</th>
            <th className="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr
                key={user.id}
                style={{
                  opacity: deletingId === user.id ? 0 : 1,
                  transform: deletingId === user.id ? "translateX(-20px)" : "translateX(0)",
                  transition: "all 0.3s ease",
                }}
              >
                <td>{(page - 1) * 2 + index + 1}</td> {/* serial no with pagination */}
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </Button>
                </td>
                <td className="text-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="rounded-pill"
                    onClick={() => handleDeleteClick(user)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted py-4">
                No users available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.First onClick={() => fetchUsers(1)} disabled={page === 1} />
          <Pagination.Prev onClick={() => fetchUsers(page - 1)} disabled={page === 1} />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={page === idx + 1}
              onClick={() => fetchUsers(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => fetchUsers(page + 1)} disabled={page === totalPages} />
          <Pagination.Last onClick={() => fetchUsers(totalPages)} disabled={page === totalPages} />
        </Pagination>
      )}

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <b>{selectedUser?.name}</b>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={editForm.age}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select name="gender" value={editForm.gender} onChange={handleEditChange}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
