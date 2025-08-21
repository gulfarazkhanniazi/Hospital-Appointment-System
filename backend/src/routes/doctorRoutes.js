import express from "express";
import bcrypt from "bcrypt";
import pool from "../database/connection.js";
import {
  authenticateUser,
  authorizeAdmin,
  authorizeDoctor,
} from "../middlewares/auth.js";

const router = express.Router();

// ✅ Admin: Add New Doctor
router.post("/add", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      phone,
      age,
      specialization,
      experience,
      schedule,
      fees,
      available = true,
    } = req.body;

    if (!name || typeof name !== "string" || name.length < 3)
      return res.status(400).json({ error: "Name must be at least 3 characters" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email))
      return res.status(400).json({ error: "Invalid email address" });

    const exists = await pool.query("SELECT * FROM doctor WHERE email = $1", [email]);
    if (exists.rows.length > 0)
      return res.status(400).json({ error: "Email already exists" });

    if (!password || typeof password !== "string" || password.length < 8)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const genderLower = gender?.toLowerCase();
    if (!genderLower || !["male", "female", "other"].includes(genderLower))
      return res.status(400).json({ error: "Gender must be 'Male' or 'Female'" });

    const phoneRegex = /^\+\d{10,15}$/;
    if (!phone || !phoneRegex.test(phone))
      return res.status(400).json({ error: "Invalid phone number format" });

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100)
      return res.status(400).json({ error: "Age must be between 18 and 100" });

    if (!specialization || typeof specialization !== "string" || specialization.length < 3)
      return res.status(400).json({ error: "Specialization is required" });

    const expNum = parseInt(experience);
    if (isNaN(expNum) || expNum < 0 || expNum > 80)
      return res.status(400).json({ error: "Experience must be between 0 and 80" });

    const feesNum = parseFloat(fees);
    if (isNaN(feesNum) || feesNum < 0 || feesNum > 1000000)
      return res.status(400).json({ error: "Fees must be between 0 and 1,000,000" });

    if (typeof available !== "boolean")
      return res.status(400).json({ error: "Available must be true or false" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO doctor 
        (name, email, password, gender, phone, age, specialization, experience, schedule, fees, available)
       VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING 
        id, name, email, gender, phone, age, specialization, experience, schedule, fees, available, created_at`,
      [
        name,
        email,
        hashedPassword,
        genderLower,
        phone,
        ageNum,
        specialization,
        expNum,
        schedule,
        feesNum,
        available,
      ]
    );

    const doctor = result.rows[0];
    delete doctor.password;

    res.status(201).json({ message: "Doctor added", doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add doctor" });
  }
});

// ✅ Admin: Delete Doctor by ID
router.delete("/delete/:id", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM doctor WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Doctor not found" });

    res.json({ message: "Doctor deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete doctor" });
  }
});

// ✅ Admin: Get All Doctors (Only Admin) with Pagination
router.get("/doctors", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // default page = 1
    const limit = 1; // show 1 doctor per page
    const offset = (page - 1) * limit;

    // Get paginated doctors
    const doctorQuery = `
      SELECT id, name, email, gender, phone, age, specialization, experience, schedule, fees, available, created_at
      FROM doctor
      ORDER BY id ASC
      LIMIT $1 OFFSET $2
    `;
    const doctors = await pool.query(doctorQuery, [limit, offset]);

    // Get total count for pagination
    const countResult = await pool.query(`SELECT COUNT(*) FROM doctor`);
    const totalDoctors = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalDoctors / limit);

    res.json({
      data: doctors.rows,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// ✅ Authorized Users: Get Doctors by Specialization
router.get("/doctors/specialization/:specialization", authenticateUser, async (req, res) => {
  try {
    const { specialization } = req.params;
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        email, 
        gender, 
        phone, 
        age, 
        specialization, 
        experience, 
        schedule, 
        fees, 
        available, 
        created_at 
       FROM doctor 
       WHERE LOWER(specialization) = LOWER($1)`,
      [specialization]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "No doctors found for this specialization" });

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch doctors by specialization" });
  }
});

// ✅ Doctor: Update Own Profile
router.patch("/update/:id", authenticateUser, authorizeDoctor, async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) !== req.user.id)
      return res.status(403).json({ error: "Forbidden: Cannot update other doctor" });

    const fields = [
      "name",
      "phone",
      "age",
      "specialization",
      "experience",
      "schedule",
      "fees",
      "available"
    ];

    const updates = [];
    const values = [];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "fees") {
          const feeValue = parseFloat(req.body[field]);
          if (isNaN(feeValue) || feeValue < 0 || feeValue > 1000000) {
            return res.status(400).json({ error: "Invalid fees value" });
          }
          values.push(feeValue);
        } else {
          values.push(req.body[field]);
        }
        updates.push(`${field} = $${values.length}`);
      }
    });

    // Password update
    let hashedPassword = null;
    if (req.body.password !== undefined && req.body.password.trim() !== "") {
      const password = req.body.password.trim();
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
      values.push(hashedPassword);
      updates.push(`password = $${values.length}`);
    }

    if (updates.length === 0)
      return res.status(400).json({ error: "No fields to update" });

    values.push(id);

    const query = `
      UPDATE doctor
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING id, name, email, gender, phone, age, specialization, experience, schedule, fees, available, updated_at
    `;

    const result = await pool.query(query, values);
    res.json({ message: "Doctor updated", doctor: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update doctor" });
  }
});

// ✅ Doctor or Admin: Get Doctor By Id
router.get("/doctor/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Check access
    if (req.user.role === "doctor" && parseInt(id) !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: Cannot access other doctor's details" });
    }
    if (!(req.user.role === "doctor" || req.user.role === "admin")) {
      return res.status(403).json({ error: "Forbidden: Only admin or doctor can access" });
    }

    const result = await pool.query(
      "SELECT id, name, email, gender, phone, age, specialization, experience, schedule, fees, available, created_at FROM doctor WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
});

// ✅ Doctor: Get Doctor Patient History By Id (Only For Doctor)
router.get("/history/:did/:pid", authenticateUser, authorizeDoctor, async (req, res) => {
  try {
    const { did, pid } = req.params;

    // Ensure doctor can only view their own history
    if (req.user.role === "doctor" && req.user.id !== parseInt(did)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Cannot access other doctor's history" });
    }

    const query = `
      SELECT 
        a.id AS appointment_id,
        a.appointment_time AS appointment_date,
        a.status,
        u.name AS patient_name,
        u.email AS patient_email,
        pr.id AS prescription_id,
        pr.prescription,
        pr.notes,
        pr.disease
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      LEFT JOIN prescription pr ON pr.appointment_id = a.id
      WHERE a.doctor_id = $1 
        AND a.patient_id = $2
        AND a.status = 'done'
      ORDER BY a.appointment_time DESC;
    `;

    const { rows } = await pool.query(query, [did, pid]);

    res.json({
      success: true,
      message: "Doctor-Patient completed appointment history fetched successfully",
      history: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;