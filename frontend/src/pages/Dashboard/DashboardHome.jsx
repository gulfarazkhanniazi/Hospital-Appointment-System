import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaUsers } from "react-icons/fa";

export default function DashboardHome({ setActive }) {
  const cardStyle = {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    height: "100%",
  };

  const hoverEffect = (e, scale) => {
    e.currentTarget.style.transform = `scale(${scale})`;
    e.currentTarget.style.boxShadow = scale > 1 ? "0 10px 20px rgba(0,0,0,0.2)" : "";
  };

  return (
    <>
      <h2 className="mb-4 fw-bold">Admin Dashboard</h2>
      <Row className="g-4 mb-4">
        {/* Patients -> Users Page */}
        <Col md={3} sm={6}>
          <Card
            className="text-white bg-primary text-center shadow-lg rounded-4 h-100"
            style={cardStyle}
            onMouseEnter={(e) => hoverEffect(e, 1.05)}
            onMouseLeave={(e) => hoverEffect(e, 1)}
            onClick={() => setActive("Users")}
          >
            <Card.Body>
              <FaUserInjured size={40} className="mb-2" />
              <Card.Title>Total Patients</Card.Title>
              <Card.Text className="fs-2 fw-bold">1,245</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Doctors Page */}
        <Col md={3} sm={6}>
          <Card
            className="text-white bg-success text-center shadow-lg rounded-4 h-100"
            style={cardStyle}
            onMouseEnter={(e) => hoverEffect(e, 1.05)}
            onMouseLeave={(e) => hoverEffect(e, 1)}
            onClick={() => setActive("Doctors")}
          >
            <Card.Body>
              <FaUserMd size={40} className="mb-2" />
              <Card.Title>Total Doctors</Card.Title>
              <Card.Text className="fs-2 fw-bold">56</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Appointments Page */}
        <Col md={3} sm={6}>
          <Card
            className="text-white bg-warning text-center shadow-lg rounded-4 h-100"
            style={cardStyle}
            onMouseEnter={(e) => hoverEffect(e, 1.05)}
            onMouseLeave={(e) => hoverEffect(e, 1)}
            onClick={() => setActive("Appointments")}
          >
            <Card.Body>
              <FaCalendarCheck size={40} className="mb-2" />
              <Card.Title>Appointments</Card.Title>
              <Card.Text className="fs-2 fw-bold">320</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Users Page (Active Users) */}
        <Col md={3} sm={6}>
          <Card
            className="text-white bg-danger text-center shadow-lg rounded-4 h-100"
            style={cardStyle}
            onMouseEnter={(e) => hoverEffect(e, 1.05)}
            onMouseLeave={(e) => hoverEffect(e, 1)}
            onClick={() => setActive("Users")}
          >
            <Card.Body>
              <FaUsers size={40} className="mb-2" />
              <Card.Title>Active Users</Card.Title>
              <Card.Text className="fs-2 fw-bold">85</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
