# Healthcare Appointment System

## Overview
The **Healthcare Appointment System** is a web-based application designed to streamline appointment management for healthcare providers and patients. It supports secure user registration, appointment scheduling, doctor management, prescription handling, and email notifications. Built with **Node.js** (backend), **React** (frontend), and **PostgreSQL** (database), it implements role-based authentication and authorization for three user roles: **Patient**, **Doctor**, and **Admin**.

## Features
- **Patient**: Register, book appointments, manage profiles, reset passwords, view appointments and prescriptions, and receive email notifications.
- **Doctor**: Log in, manage appointments (confirm/cancel), add prescriptions, view patient histories, update profiles, and receive email notifications.
- **Admin**: Manage doctors, view system statistics, oversee appointments and patient records, and update profiles.
- **Security**: JWT-based authentication with HTTP-only cookies, bcrypt-hashed passwords, and role-based access control (RBAC).
- **Email Notifications**: Automated emails for appointment requests, confirmations, and cancellations.

## Prerequisites
- **Node.js**: Version 18.x or higher ([download](https://nodejs.org/)).
- **PostgreSQL**: Version 14.x or higher ([download](https://www.postgresql.org/)).
- **NPM**: Included with Node.js for package management.
- **SMTP Service**: A valid SMTP service (e.g., Gmail) for email notifications.

## Project Structure
```
healthcare-appointment-system/
├── frontend/          # React-based client-side application
├── backend/          # Node.js/Express server-side API
└── README.md         # Project documentation
```

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd healthcare-appointment-system
```

### 2. Install Dependencies
- **Frontend**:
  ```bash
  cd frontend
  npm install
  ```
- **Backend**:
  ```bash
  cd backend
  npm install
  ```

### 3. Configure Environment Variables
In the `backend` directory, create a `.env` file with the following:
```env
DB_USER=postgres
DB_PASS=your_postgres_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
RESET_TOKEN_EXPIRE=15m
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
FRONTEND_URL=http://localhost:5173
```
- Replace placeholders (`your_postgres_password`, `your_database_name`, `your_jwt_secret_key`, `your_email@gmail.com`, `your_email_app_password`) with appropriate values.
- Ensure valid SMTP credentials for email functionality.

### 4. Set Up PostgreSQL Database
- Create a database matching `DB_NAME` in the `.env` file.
- Execute the following SQL to create the required tables:

```sql
-- Users Table (Patients and Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('patient', 'admin')) DEFAULT 'patient',
    age INTEGER NOT NULL CHECK (age >= 1 AND age <= 150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors Table
CREATE TABLE doctor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    phone VARCHAR(20) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
    specialization VARCHAR(255) NOT NULL,
    experience INTEGER NOT NULL CHECK (experience >= 0 AND experience <= 80),
    schedule TEXT,
    fees DECIMAL(10, 2) NOT NULL CHECK (fees >= 0 AND fees <= 1000000),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctor(id) ON DELETE CASCADE,
    appointment_time TIMESTAMP NOT NULL,
    disease VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'done')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions Table
CREATE TABLE prescription (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    prescription TEXT NOT NULL,
    notes TEXT,
    disease VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Start the Application
- **Frontend and Backend** (if configured with `concurrently`):
  ```bash
  cd frontend
  npm start
  ```
- This starts the frontend (`http://localhost:5173`) and backend (`http://localhost:3000`).
- If not configured, start the backend separately:
  ```bash
  cd backend
  npm start
  ```

## Role-Based Access
- **Authentication**: JWT tokens (24-hour expiration) stored in HTTP-only cookies, passwords hashed with bcrypt (10 rounds).
- **Authorization**: Role-based middleware (`authenticateUser`, `authorizePatient`, `authorizeAdmin`, `authorizeDoctor`) restricts access based on roles (`patient`, `admin`, `doctor`).

## Role-Specific Features

### Patient
- **Sign Up**: Register with name, email, password, gender, phone, and age.
- **Book Appointment**: Request appointments (set to "pending") and receive doctor email notifications.
- **Profile Management**: View/update personal details.
- **Password Management**: Reset password via email-based link.
- **View Appointments**: Access appointment details and prescriptions.
- **Notifications**: Receive emails for appointment confirmation/cancellation.

### Admin
- **Setup**: Sign up as a patient, then manually set `role = 'admin'` in the `users` table:
  ```sql
  UPDATE users SET role = 'admin' WHERE id = <user_id>;
  ```
- **Dashboard**: View system-wide statistics.
- **Doctor Management**: Add, delete, or view doctors.
- **Appointment Management**: View, confirm, or cancel appointments.
- **Patient Management**: View/edit/delete patient records and histories.
- **Profile/Password**: Update profile and reset password.

### Doctor
- **Login**: Use admin-provided credentials.
- **Appointment Management**: View, confirm, or cancel appointments, notifying patients via email.
- **Prescription Management**: Add prescriptions/notes for confirmed appointments, marking them "done."
- **Patient History**: View appointment history of treated patients.
- **Profile/Password**: Update profile and reset password.
- **Notifications**: Receive emails for new appointment requests.

## Key Workflows
- **Appointment Process**:
  1. Patient books appointment ("pending"), triggering doctor email.
  2. Doctor confirms/cancels, updating status and notifying patient.
  3. For confirmed appointments, doctors add prescriptions, marking as "done."
- **Email Notifications**: Configured via SMTP settings in `.env`.
- **Security**: JWT tokens, bcrypt hashing, and role-based middleware ensure secure access.

## Database Schema
- **users**: Patient/admin data (name, email, password, gender, phone, role, age).
- **doctor**: Doctor details (name, email, password, gender, phone, age, specialization, experience, schedule, fees, availability).
- **appointments**: Appointment records (patient_id, doctor_id, appointment_time, disease, status).
- **prescription**: Prescription details (appointment_id, prescription, notes, disease).

## Additional Notes
- **Environment**: Ensure `.env` variables, especially SMTP credentials, are correctly set.
- **Frontend URL**: Update `FRONTEND_URL` in `.env` if the default port (`5173`) changes.
- **Admin Setup**: Manually update `role` in the `users` table for admin privileges.
- **Concurrent Start**: `npm start` in `frontend` assumes a script to launch both servers. Otherwise, start backend separately.
- **Security Practices**: Rotate `JWT_SECRET` and SMTP credentials regularly.

## Support
For issues, contact the development team or refer to [Node.js](https://nodejs.org/), [PostgreSQL](https://www.postgresql.org/), or SMTP service documentation.