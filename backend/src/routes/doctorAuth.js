import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../database/connection.js";
import { sendMail } from "../utils/mailer.js";

dotenv.config();

const route = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ REGISTER Doctor
route.post("/register", async (req, res) => {
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
    } = req.body;

    // Validations
    if (!name || name.length < 3)
      return res.status(400).json({ error: "Name must be at least 3 characters" });

    if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/))
      return res.status(400).json({ error: "Invalid email" });

    if (!password || password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const normalizedGender = gender.toLowerCase();
    if (!["male", "female", "other"].includes(normalizedGender))
      return res.status(400).json({ error: "Invalid gender" });

    if (!phone.match(/^[0-9]{10,15}$/))
      return res.status(400).json({ error: "Invalid phone number" });

    if (age < 18 || age > 100)
      return res.status(400).json({ error: "Invalid age" });

    if (!specialization || specialization.length < 3)
      return res.status(400).json({ error: "Invalid specialization" });

    if (experience < 0 || experience > 80)
      return res.status(400).json({ error: "Invalid experience" });

    if (typeof schedule !== "object")
      return res.status(400).json({ error: "Schedule must be a JSON object" });

    const feeNumber = parseFloat(fees);
    if (isNaN(feeNumber) || feeNumber < 0 || feeNumber > 1000000)
      return res.status(400).json({ error: "Invalid fees amount" });

    // Check if email already exists
    const existingDoctor = await pool.query(
      "SELECT * FROM doctor WHERE email = $1",
      [email]
    );
    if (existingDoctor.rows.length > 0)
      return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO doctor (name, email, password, gender, phone, age, specialization, experience, schedule, fees)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, name, email, gender, phone, age, specialization, experience, schedule, fees, created_at`,
      [
        name,
        email,
        hashedPassword,
        normalizedGender,
        phone,
        age,
        specialization,
        experience,
        schedule,
        feeNumber,
      ]
    );

    const doctor = result.rows[0];
    delete doctor.password;

    const token = jwt.sign(
      { id: doctor.id, email: doctor.email, role: 'doctor' },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("das-token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Doctor registered", doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// ✅ LOGIN Doctor
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const doctorRes = await pool.query(
      "SELECT * FROM doctor WHERE email = $1",
      [email]
    );
    const doctor = doctorRes.rows[0];
    if (!doctor)
      return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, doctor.password);
    if (!valid)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: doctor.id, email: doctor.email, role: 'doctor' },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("das-token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    delete doctor.password;

    res.json({ message: "Login successful", doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ✅ LOGOUT Doctor
route.post("/logout", (req, res) => {
  res.clearCookie("das-token");
  res.json({ message: "Logged out successfully" });
});

// 📌 Doctor Forgot Password
route.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const doctorRes = await pool.query(
      `SELECT id, name, email FROM doctor WHERE email = $1`,
      [email]
    );

    if (doctorRes.rowCount === 0) {
      return res.status(404).json({ error: "Email is not registered yet." });
    }

    const doctor = doctorRes.rows[0];

    // Generate JWT reset token (expires in 15 minutes)
    const resetToken = jwt.sign({ id: doctor.id, email: doctor.email }, JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `${process.env.FRONTEND_URL}/resetpassword/doctor/${resetToken}`;

    // Send email
    await sendMail({
      to: doctor.email,
      subject: "Doctor Password Reset",
      html: `
        <h3>Hello Dr. ${doctor.name},</h3>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link is valid for 15 minutes. If you did not request this, please ignore this email.</p>
      `,
    });

    res.json({ message: "Password reset link sent successfully" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to send reset link" });
  }
});

// Reset Doctor Password
route.post("/resetpassword/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Validate inputs
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }

    // Password length validation
    if (newPassword.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const doctorId = decoded.id;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update doctor password
    await pool.query(`UPDATE doctor SET password = $1 WHERE id = $2`, [
      hashedPassword,
      doctorId,
    ]);

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});


export default route;
