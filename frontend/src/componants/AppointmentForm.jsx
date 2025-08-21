import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { getDoctorsBySpecialization } from "../states/DoctorState";
import {
  addAppointment,
  getBookedSlots,
} from "../states/AppointmentStates";

const AppointmentForm = ({ onBook }) => {
  const [specialization, setSpecialization] = useState("");
  const [specializations] = useState([
    "Cardiologist",
    "Dermatologist",
    "Dentist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Gynecologist",
    "Psychiatrist",
    "General Physician",
  ]);

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState("");
  const [disease, setDisease] = useState("");
  const [error, setError] = useState("");

  // Fetch doctors by specialization
  useEffect(() => {
    if (!specialization) return;
    (async () => {
      const res = await getDoctorsBySpecialization(specialization);
      if (res.success) {
        setDoctors(res.data || []);
        setDoctorId("");
        setSlots([]);
        setSlot("");
        setError(res.data?.length ? "" : `No doctors available for ${specialization}`);
      } else {
        setError(res.message || "Failed to load doctors");
      }
    })();
  }, [specialization]);

  // Generate slots based on doctor schedule and booked slots
  // Generate slots based on doctor schedule and booked slots
useEffect(() => {
  if (!date || !doctorId) return;

  const doctor = doctors.find((d) => d.id === parseInt(doctorId));
  if (!doctor) return;

  const schedule = doctor.schedule || {};
  const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
  const daySchedule = schedule[dayName];

  // Validate schedule existence
  if (!daySchedule || daySchedule.start === undefined || daySchedule.end === undefined) {
    setSlots([]);
    setError(`${doctor.name} is not available on ${dayName}`);
    return;
  }
  setError("");

  const format12Hour = (hour, minute) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const adjHour = hour % 12 || 12;
    return `${adjHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
  };

  const now = new Date();
  const selectedDate = new Date(date);

  (async () => {
    const bookedRes = await getBookedSlots(doctorId, date);
    const bookedSlots = bookedRes.success ? bookedRes.data : [];

    const generatedSlots = [];
    // start and end are now minutes (e.g., 630 = 10:30)
    for (let t = daySchedule.start; t < daySchedule.end; t += 15) {
      const hour = Math.floor(t / 60);
      const minute = t % 60;

      const slotDateTime = new Date(date);
      slotDateTime.setHours(hour, minute, 0, 0);

      const slotValue = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      if (
        (selectedDate.toDateString() !== now.toDateString() || slotDateTime > now) &&
        !bookedSlots.includes(slotValue)
      ) {
        generatedSlots.push({
          display: format12Hour(hour, minute),
          value: slotValue,
        });
      }
    }

    setSlots(generatedSlots);
    if (!generatedSlots.length) {
      setError("No available slots for the selected date.");
    }
  })();
}, [date, doctorId, doctors]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !date || !slot || !disease) {
      setError("Please fill all fields");
      return;
    }
    setError("");

    const newAppointment = {
      doctor_id: parseInt(doctorId, 10),
      appointment_time: `${date}T${slot}`, // backend expects date + time
      disease,
    };

    const res = await addAppointment(newAppointment);
    if (res.success) {
      onBook(res.data.appointment);
      setSpecialization("");
      setDoctorId("");
      setDate("");
      setSlot("");
      setDisease("");
      setSlots([]);
    } else {
      setError(res.message || "Failed to book appointment");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Specialization */}
      <Form.Group className="mb-3">
        <Form.Label>Specialization</Form.Label>
        <Form.Select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        >
          <option value="">Select specialization</option>
          {specializations.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Doctor */}
      {doctors.length > 0 && (
        <Form.Group className="mb-3">
          <Form.Label>Doctor</Form.Label>
          <Form.Select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id} disabled={!d.available}>
                {d.name} - Rs {parseFloat(d.fees).toFixed(2)}{" "}
                {!d.available ? "(Unavailable)" : ""}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {/* Date */}
      {doctorId && (
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>
      )}

      {/* Slots */}
      {slots.length > 0 && (
        <Form.Group className="mb-3">
          <Form.Label>Available Time Slots</Form.Label>
          <Form.Select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
          >
            <option value="">Select time slot</option>
            {slots.map((s, i) => (
              <option key={i} value={s.value}>
                {s.display}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {/* Disease */}
      <Form.Group className="mb-3">
        <Form.Label>Disease / Symptoms</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter disease or symptoms"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
        />
      </Form.Group>

      <div className="d-flex justify-content-center mt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={!slot || !disease}
          className="px-5 py-2 fw-semibold animated-btn"
        >
          Book Appointment
        </Button>
      </div>
    </Form>
  );
};

export default AppointmentForm;
