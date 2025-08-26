  import express from "express";
  import bcrypt from "bcrypt";
  import jwt from "jsonwebtoken";
  import dotenv from "dotenv";
  import pool from "../database/connection.js";
  import { sendMail } from '../utils/mailer.js'
  import { authenticateUser } from "../middlewares/auth.js";

  const route = express.Router();
  dotenv.config();
  const JWT_SECRET = process.env.JWT_SECRET;

  // 📌 SEND OTP
route.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // check email exists or not
    const userCheck = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // send otp via email
    await sendMail({
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP is: <b>${otp}</b></h3><p>It will expire in 5 minutes.</p>`
    });

    // store otp in cookie for 5 minutes
    res.cookie("das-otp", otp, {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 60 * 1000
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error.message);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ✅ REGISTER
route.post("/register", async (req, res) => {
  try {
    const { email, password, gender, phone, role, age, name, otp } = req.body;

    if (!email || !password || !gender || !phone || !age || !name)
      return res.status(400).json({ error: "All fields are required" });

    // validate otp
    console.log(req.cookies['das-otp'], otp);
    
    if (!req.cookies["das-otp"]) {
      return res.status(400).json({ error: "OTP expired or not requested" });
    }
    if (req.cookies["das-otp"] !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email))
      return res.status(400).json({ error: "Invalid email" });

    if (password.length < 8)
      return res.status(400).json({ error: "Password must be at least 8 characters" });

    if (!["male", "female", "other"].includes(gender))
      return res.status(400).json({ error: "Invalid gender" });

    if (!/^[0-9+()-]{7,20}$/.test(phone))
      return res.status(400).json({ error: "Invalid phone number" });

    if (age < 1 || age >= 150)
      return res.status(400).json({ error: "Invalid age" });

    if (name.length < 3)
      return res.status(400).json({ error: "Name must be at least 3 characters" });

    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = ["patient", "admin"].includes(role) ? role : "patient";

    const result = await pool.query(
      `INSERT INTO users (name, email, password, gender, phone, role, age)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, gender, phone, role, age, created_at`,
      [name, email, hashedPassword, gender, phone, userRole, age]
    );

    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: "24h" });
    res.clearCookie("das-otp");

    res
      .cookie("das-token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: "User registered", user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ LOGIN
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ error: "Invalid credentials" });

    delete user.password;
    // Include role (from DB or default)
    const userRole = user.role || "patient";

    const token = jwt.sign({ id: user.id, email, role: userRole }, JWT_SECRET, { expiresIn: "24h" });

    res
      .cookie("das-token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ LOGOUT
route.post("/logout", (req, res) => {
  res
    .clearCookie("das-token", { httpOnly: true, secure: false })
    .json({ message: "Logout successful" });
});

// 📌 Send Password Reset Email
route.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const userRes = await pool.query(`SELECT id, email FROM users WHERE email = $1`, [email]);

    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: "Email is not registered yet." });
    }

    const user = userRes.rows[0];

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.RESET_TOKEN_EXPIRE || "15m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/resetpassword/patient/${token}`;

    await sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Hello,</h3>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it. This link is valid for 15 minutes.</p>
        <a href="${resetLink}" target="_blank">Reset Password</a>
        <br/><br/>
        <small>If you didn’t request this, ignore this email.</small>
      `,
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

// 📌 Reset Password
route.post("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING id",
      [hashedPassword, decoded.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
});

// ✅ Get Logged-in User Profile
route.get("/profile", authenticateUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with user details (already sanitized by middleware)
    res.status(200).json({
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).json({ error: "Server error while fetching profile" });
  }
});

export default route;