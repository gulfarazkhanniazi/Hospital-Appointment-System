import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../database/connection.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Authenticate User Middleware
export const authenticateUser = async (req, res, next) => {
  const token = req.cookies["das-token"];
  if (!token) return res.status(401).json({ error: "Unauthorized: No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    let user;
    if (decoded.role === "doctor") {
      // Doctor login
      const doctorQuery = await pool.query(
        "SELECT id, name, email, phone, specialization FROM doctor WHERE id = $1",
        [decoded.id]
      );
      if (doctorQuery.rows.length === 0)
        return res.status(401).json({ error: "Doctor not found" });
      user = doctorQuery.rows[0];
      user.role = "doctor";
    } else {
      // Normal user (admin/patient)
      const userQuery = await pool.query(
        "SELECT id, name, email, gender, phone, role, age FROM users WHERE id = $1",
        [decoded.id]
      );
      if (userQuery.rows.length === 0)
        return res.status(401).json({ error: "User not found" });
      user = userQuery.rows[0];
    }

    req.user = user; // Attach user object to request
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ✅ Authorize Admin Middleware
export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ error: "Forbidden: Admins only" });
  next();
};

// ✅ Authorize Doctor Middleware
export const authorizeDoctor = (req, res, next) => {
  if (req.user?.role !== "doctor")
    return res.status(403).json({ error: "Forbidden: Doctors only" });
  next();
};

// ✅ Authorize Patient Middleware
export const authorizePatient = (req, res, next) => {
  if (!["patient", "admin"].includes(req.user?.role))
    return res.status(403).json({ error: "Forbidden: Patients or Admin only" });
  next();
};