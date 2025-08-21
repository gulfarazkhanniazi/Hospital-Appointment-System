import express from "express";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import pool from '../database/connection.js';
import { authenticateUser, authorizeAdmin } from "../middlewares/auth.js";

const route = express.Router();
dotenv.config();

// ✅ GET USER BY ID (Admin only)
route.get('/user/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "User ID required" });

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET ALL USERS (Admin only) with Pagination
route.get('/users', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    // Get page number from query (default = 1)
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    const limit = 2; // Show 2 users per page
    const offset = (page - 1) * limit;

    // Fetch users with pagination
    const result = await pool.query(
      `SELECT * FROM users ORDER BY id ASC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Get total count of users (for total pages)
    const countResult = await pool.query(`SELECT COUNT(*) FROM users`);
    const totalUsers = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      data: result.rows,
      currentPage: page,
      totalPages,
      totalUsers,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE USER (Logged-in user only)
route.patch('/update/:id', authenticateUser, async (req, res) => {
  try {
    const id = req.params.id;
    let { name, email, phone, age, gender, password } = req.body;

    if (!id) return res.status(400).json({ error: "User ID required" });

    if (req.user.id != id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: You can only update your own account" });
    }

    const existing = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    // Validation
    if (email && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (name && name.length < 3) {
      return res.status(400).json({ error: "Name must be at least 3 characters long" });
    }
    if (phone && !/^[0-9+()-]{7,20}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }
    if (age && (age < 1 || age >= 150)) {
      return res.status(400).json({ error: "Invalid age" });
    }
    if (gender && !["male", "female", "other"].includes(gender)) {
      return res.status(400).json({ error: "Invalid gender" });
    }

    // Check for duplicate email
    if (email) {
      const emailCheck = await pool.query(
        "SELECT id FROM users WHERE email = $1 AND id <> $2",
        [email, id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Password update
    let hashedPassword = null;
    let updatePassword = false;
    if (password !== undefined && password.trim() !== "") {
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
      updatePassword = true;
    }

    // Query
    let query, values;

    if (updatePassword) {
      query = `
        UPDATE users SET
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          age = COALESCE($4, age),
          gender = COALESCE($5, gender),
          password = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING id, name, email, phone, age, gender, role, updated_at
      `;
      values = [name, email, phone, age, gender, hashedPassword, id];
    } else {
      query = `
        UPDATE users SET
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          age = COALESCE($4, age),
          gender = COALESCE($5, gender),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING id, name, email, phone, age, gender, role, updated_at
      `;
      values = [name, email, phone, age, gender, id];
    }

    const updated = await pool.query(query, values);

    res.json({ message: "User updated successfully", user: updated.rows[0] });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE USER
route.delete('/delete/:id', authenticateUser, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "User ID required" });

    const deleted = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    if (deleted.rows.length === 0) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ CHANGE PASSWORD (Only for the logged-in user)
route.patch('/changepassword', authenticateUser, async (req, res) => {
  try {
    const id = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password required" });
    }

    const result = await pool.query("SELECT password FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedNewPassword, id]
    );

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


export default route;