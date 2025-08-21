import express from "express";
import { sendMail } from "../utils/mailer.js";
const router = express.Router();

router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // --- Validate input ---
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    // --- Send email to admin (SMTP_USER) ---
    await sendMail({
      to: process.env.SMTP_USER,
      subject: `New Contact Us Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f7f7f7; border-radius: 8px;">
          <div style="background: #0d6efd; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; color: #fff;">
            <h2 style="margin: 0;">New Contact Message</h2>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          <p style="text-align: center; font-size: 12px; color: #666; margin-top: 15px;">
            This message was sent from the Contact Us form on your website.
          </p>
        </div>
      `,
    });

    res.json({ message: "Your message has been sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
