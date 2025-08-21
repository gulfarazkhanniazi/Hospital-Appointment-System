import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './src/database/connection.js';
import cookieParser from 'cookie-parser';

import userAuth from './src/routes/UserAuth.js'
import userRoutes from './src/routes/UserRoutes.js'

import doctorAuth from './src/routes/doctorAuth.js'
import doctorRoutes from './src/routes/doctorRoutes.js'

import appointmentRoutes from './src/routes/appointmentRoutes.js'
import prescriptionRoutes from './src/routes/prescriptionroutes.js'

import ContactMail from "./src/routes/ContactMail.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());

app.use('/api/userauth', userAuth);
app.use('/api/user', userRoutes);

app.use('/api/doctorauth', doctorAuth);
app.use('/api/doctor', doctorRoutes);

app.use('/api/appointment', appointmentRoutes);
app.use('/api/prescription', prescriptionRoutes);

app.use('/api/email', ContactMail);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});