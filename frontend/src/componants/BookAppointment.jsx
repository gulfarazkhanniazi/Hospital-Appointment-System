import React, { useState, useCallback } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';

const BookAppointment = ({ onBook }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctor: '',
  });
  const [status, setStatus] = useState({ success: false, error: '' });

  const doctors = [
    { name: 'Dr. John Smith, MD', fee: 100, specialty: 'General Practitioner' },
    { name: 'Dr. Sarah Johnson, MD', fee: 120, specialty: 'Cardiologist' },
    { name: 'Dr. Michael Brown, MD', fee: 90, specialty: 'Dermatologist' },
  ];

  const times = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus((prev) => ({ ...prev, error: '' }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!formData.date || !formData.time || !formData.doctor) {
        setStatus({ success: false, error: 'Please complete all fields.' });
        return;
      }

      if (selectedDate < today) {
        setStatus({ success: false, error: 'Please select a future date.' });
        return;
      }

      onBook(formData);
      setStatus({ success: true, error: '' });
      setTimeout(() => setStatus({ success: false, error: '' }), 3000);
      setFormData({ date: '', time: '', doctor: '' });
    },
    [formData, onBook]
  );

  return (
    <Card
      className="shadow-lg p-4 mb-4 animate__fadeInUp"
      style={{
        maxWidth: '500px',
        margin: '4rem auto',
        border: 'none',
        borderRadius: '15px',
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
      }}
    >
      <Card.Body>
        <h3 className="mb-4 text-center fw-bold" style={{ color: '#1a3c61' }}>
          Schedule Your Appointment
        </h3>
        {status.success && (
          <Alert variant="success" className="animate__fadeIn">
            Appointment booked successfully!
          </Alert>
        )}
        {status.error && (
          <Alert variant="danger" className="animate__fadeIn">
            {status.error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="formDoctor">
            <Form.Label className="fw-semibold" style={{ color: '#2c3e50' }}>
              Select Doctor
            </Form.Label>
            <Form.Select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              className="border rounded-3 shadow-sm"
              style={{ transition: 'all 0.3s ease' }}
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doc, index) => (
                <option key={index} value={doc.name}>
                  {doc.name} ({doc.specialty}) - ${doc.fee}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label className="fw-semibold" style={{ color: '#2c3e50' }}>
              Appointment Date
            </Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="border rounded-3 shadow-sm"
              style={{ transition: 'all 0.3s ease' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTime">
            <Form.Label className="fw-semibold" style={{ color: '#2c3e50' }}>
              Appointment Time
            </Form.Label>
            <Form.Select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="border rounded-3 shadow-sm"
              style={{ transition: 'all 0.3s ease' }}
            >
              <option value="">Select a time</option>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fw-semibold rounded-3 animate__pulse"
            style={{
              background: 'linear-gradient(90deg, #007bff, #0056b3)',
              border: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Book Appointment
          </Button>
        </Form>
      </Card.Body>
      <style>{`
        .animate__fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
        .animate__fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate__pulse {
          animation: pulse 2s infinite;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </Card>
  );
};

export default BookAppointment;