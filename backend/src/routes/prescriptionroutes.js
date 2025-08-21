import express from "express";
import pool from "../database/connection.js";
import {
  authenticateUser,
  authorizeDoctor,
  authorizeAdmin,
  authorizePatient,
} from "../middlewares/auth.js";

const router = express.Router();

// ➕ Add Prescription (Only Doctor, and only for confirmed appointments)
router.post("/add", authenticateUser, authorizeDoctor, async (req, res) => {
  try {
    const { appointment_id, prescription, notes, disease } = req.body;

    if (!appointment_id || !prescription || !disease)
      return res.status(400).json({ error: "prescription and disease are required" });

    if (disease.length < 3 || disease.length > 100)
      return res.status(400).json({ error: "Disease must be between 3 and 100 characters" });

    const check = await pool.query(
      `SELECT * FROM appointments WHERE id = $1 AND doctor_id = $2 AND status = 'confirmed'`,
      [appointment_id, req.user.id]
    );

    if (check.rowCount === 0)
      return res.status(403).json({ error: "Appointment not found or not accessible/confirmed" });

    const existing = await pool.query(`SELECT * FROM prescription WHERE appointment_id = $1`, [appointment_id]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "Prescription already exists for this appointment" });

    const result = await pool.query(
      `INSERT INTO prescription (appointment_id, prescription, notes, disease)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [appointment_id, prescription, notes, disease]
    );

    await pool.query(
      `UPDATE appointments SET status = 'done', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [appointment_id]
    );

    res.status(201).json({ message: "Prescription added", prescription: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while adding prescription" });
  }
});

// 👀 Get Prescription by Appointment ID (Doctor or Patient only if involved)
router.get("/prescription/:appointment_id", authenticateUser, async (req, res) => {
  const { appointment_id } = req.params;

  try {
    const appointment = await pool.query(
      `SELECT * FROM appointments WHERE id = $1`,
      [appointment_id]
    );

    if (appointment.rowCount === 0)
      return res.status(404).json({ error: "Appointment not found" });

    const a = appointment.rows[0];

    const isDoctor = req.user.role === "doctor" && req.user.id === a.doctor_id;
    const isPatient = req.user.role === "patient" && req.user.id === a.patient_id;

    if (!isDoctor && !isPatient && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const pres = await pool.query(`SELECT * FROM prescription WHERE appointment_id = $1`, [appointment_id]);

    if (pres.rowCount === 0)
      return res.status(404).json({ error: "Prescription not found" });

    res.json(pres.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching prescription" });
  }
});

// 🗂 Get All Prescriptions (Admin Only)
router.get("/prescriptions", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM prescription ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching all prescriptions" });
  }
});

export default router;
