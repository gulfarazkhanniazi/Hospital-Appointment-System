import express from "express";
import pool from "../database/connection.js";
import {
  authenticateUser,
  authorizeAdmin,
  authorizeDoctor,
  authorizePatient,
} from "../middlewares/auth.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

// 📌 Add Appointment (Only Patient)
router.post("/add", authenticateUser, authorizePatient, async (req, res) => {
  try {
    const { doctor_id, appointment_time, disease } = req.body;

    // --- Validation ---
    if (!doctor_id || !appointment_time || !disease) {
      return res.status(400).json({
        error: "Doctor ID, appointment time, and disease are required",
      });
    }

    if (disease.length < 3 || disease.length > 100) {
      return res.status(400).json({
        error: "Disease must be between 3 to 100 characters",
      });
    }

    // --- Insert into DB ---
    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_time, disease)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, doctor_id, appointment_time, disease]
    );

    // --- Fetch doctor & patient info ---
    const doctorRes = await pool.query(
      `SELECT email, name FROM doctor WHERE id = $1`,
      [doctor_id]
    );
    const patientRes = await pool.query(
      `SELECT name FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (doctorRes.rowCount > 0 && patientRes.rowCount > 0) {
      const doctor = doctorRes.rows[0];
      const patient = patientRes.rows[0];

      // --- Format date & time separately ---
      const dateObj = new Date(appointment_time);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // --- Send Email ---
      await sendMail({
        to: doctor.email,
        subject: "New Appointment Request",
        text: `Patient: ${patient.name}\nDisease: ${disease}\nDate: ${formattedDate}\nTime: ${formattedTime}`,
        html: `
          <h3>Hello Dr. ${doctor.name},</h3>
          <p>You have received a new appointment request.</p>
          <p><strong>Patient Name:</strong> ${patient.name}</p>
          <p><strong>Disease:</strong> ${disease}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p>Please log in to confirm or cancel the appointment.</p>
        `,
      });
    }

    return res.status(201).json({
      message: "Appointment requested successfully",
      appointment: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating appointment:", err);
    return res.status(500).json({ error: "Failed to create appointment" });
  }
});

// 📌 Update Appointment Status (Doctor or Admin)
router.patch("/status/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["confirmed", "cancelled", "done"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    let result;

    // Doctor → only update their own appointments
    if (req.user.role === "doctor") {
      result = await pool.query(
        `UPDATE appointments
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND doctor_id = $3
         RETURNING *`,
        [status, id, req.user.id]
      );
    }
    // Admin → can update any appointment
    else if (req.user.role === "admin") {
      result = await pool.query(
        `UPDATE appointments
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized to change appointment status" });
    }

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Appointment not found or you are not allowed" });
    }

    const appointment = result.rows[0];

    // Send email only on confirmed or cancelled
    if (status === "confirmed" || status === "cancelled") {
      const userRes = await pool.query(
        `SELECT name, email FROM users WHERE id = $1`,
        [appointment.patient_id]
      );
      const doctorRes = await pool.query(
        `SELECT name FROM doctor WHERE id = $1`,
        [appointment.doctor_id]
      );

      if (userRes.rowCount > 0 && doctorRes.rowCount > 0) {
        const patient = userRes.rows[0];
        const doctor = doctorRes.rows[0];

        // Format date & time separately
        const dateObj = new Date(appointment.appointment_time);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const formattedTime = dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const subject =
          status === "confirmed"
            ? "Your Appointment is Confirmed"
            : "Your Appointment has been Cancelled";

        const html = `
          <h3>Hello ${patient.name},</h3>
          <p>Your appointment with Dr. ${doctor.name} has been <strong>${status}</strong>.</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
        `;

        sendMail({ to: patient.email, subject, html }).catch((err) =>
          console.error("Failed to send status email:", err)
        );
      }
    }

    res.json({ message: `Appointment marked as ${status}`, appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update appointment status" });
  }
});

// 📌 Get Appointments by Patient ID (Only Patient) with Pagination
router.get("/patient", authenticateUser, authorizePatient, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM appointments WHERE patient_id = $1",
      [req.user.id]
    );
    const totalAppointments = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalAppointments / limit);

    const result = await pool.query(
      `SELECT 
         a.id,
         a.appointment_time,
         a.disease,
         a.status,
         d.name AS doctor_name
       FROM appointments a
       JOIN doctor d ON a.doctor_id = d.id
       WHERE a.patient_id = $1
       ORDER BY a.appointment_time DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    res.json({
      appointments: result.rows,
      currentPage: page,
      totalPages,
      totalAppointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch patient appointments" });
  }
});

// 📌 Get Appointments by Doctor ID (Only Doctor) - Paginated
router.get("/doctor", authenticateUser, authorizeDoctor, async (req, res) => {
  try {
    // Get page & limit (default: page=1, limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Query for appointments with pagination
    const query = `
      SELECT 
        a.id, 
        a.appointment_time, 
        a.status, 
        a.disease,
        u.id AS patient_id,
        u.name AS patient_name
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      WHERE a.doctor_id = $1
      ORDER BY a.appointment_time DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [req.user.id, limit, offset]);

    // Query total count for pagination info
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM appointments WHERE doctor_id = $1`,
      [req.user.id]
    );
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      data: result.rows,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch doctor appointments" });
  }
});

// 📌 Get All Appointments (Admin Only) with Pagination
router.get(
  "/appointments",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      // --- Read page & limit from query params ---
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // --- Fetch paginated data ---
      const result = await pool.query(
        `SELECT 
          a.id,
          a.appointment_time,
          a.status,
          a.disease,
          u.id AS patient_id,
          u.name AS patient_name,
          d.name AS doctor_name
        FROM appointments a
        JOIN users u ON a.patient_id = u.id
        JOIN doctor d ON a.doctor_id = d.id
        ORDER BY a.appointment_time DESC
        LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      // --- Get total count ---
      const countResult = await pool.query(`SELECT COUNT(*) AS total FROM appointments`);
      const total = parseInt(countResult.rows[0].total, 10);

      res.json({
        success: true,
        data: result.rows,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Failed to fetch appointments" });
    }
  }
);

// 📌 Get Booked Slots for a Doctor on a Date
router.get("/booked-slots", authenticateUser, async (req, res) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    return res.status(400).json({ error: "Doctor ID and date are required" });
  }

  try {
    // Use PostgreSQL functions to extract only time part in HH:MM
    const result = await pool.query(
      `SELECT TO_CHAR(appointment_time, 'HH24:MI') AS time
       FROM appointments 
       WHERE doctor_id = $1 
         AND DATE(appointment_time) = $2
         AND status IN ('pending', 'confirmed')`,
      [doctorId, date]
    );

    const bookedTimes = result.rows.map((row) => row.time); // already HH:MM format

    res.json({ bookedSlots: bookedTimes });
  } catch (err) {
    console.error("Error fetching booked slots:", err);
    res.status(500).json({ error: "Failed to fetch booked slots" });
  }
});

// ✅ Admin: Get All Completed Appointments with Prescriptions by User ID
router.get(
  "/history/:uid",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { uid } = req.params;

      const query = `
      SELECT 
  a.id AS appointment_id,
  a.appointment_time AS appointment_date,
  a.status,
  d.id AS doctor_id,
  d.name AS doctor_name,
  u.id AS patient_id,
  u.name AS patient_name,
  pr.id AS prescription_id,
  pr.prescription,
  pr.notes,
  pr.disease
FROM appointments a
JOIN users u ON a.patient_id = u.id
JOIN doctor d ON a.doctor_id = d.id
LEFT JOIN prescription pr ON pr.appointment_id = a.id
WHERE a.patient_id = $1
  AND a.status = 'done'
ORDER BY a.appointment_time DESC;
    `;

      const { rows } = await pool.query(query, [uid]);

      res.json({
        success: true,
        message:
          "Completed appointments with prescriptions fetched successfully",
        appointments: rows,
      });
    } catch (err) {
      console.error("Admin Get Appointments Error:", err);
      res.status(500).json({ error: "Failed to fetch completed appointments" });
    }
  }
);

// 📌 Search Appointments by Patient Name (Admin Only) - Top 7
router.get(
  "/search",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { name } = req.query;
      if (!name || name.trim().length < 1) {
        return res.status(400).json({ success: false, error: "Name is required" });
      }

      const result = await pool.query(
        `
        SELECT 
          a.id,
          a.appointment_time,
          a.status,
          a.disease,
          u.id AS patient_id,
          u.name AS patient_name,
          d.name AS doctor_name
        FROM appointments a
        JOIN users u ON a.patient_id = u.id
        JOIN doctor d ON a.doctor_id = d.id
        WHERE LOWER(u.name) LIKE LOWER($1)
        ORDER BY a.appointment_time DESC
        LIMIT 7
        `,
        [`%${name}%`]
      );

      res.json({
        success: true,
        data: result.rows,
        count: result.rowCount,
      });
    } catch (err) {
      console.error("Search appointments error:", err);
      res.status(500).json({ success: false, error: "Failed to search appointments" });
    }
  }
);

export default router;
