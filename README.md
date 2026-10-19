<div align="center">

# 🏥 SehatSetu

### Connecting Patients with Better Healthcare

<p>
A modern digital healthcare platform designed to make healthcare discovery,
appointment booking, and healthcare management simple, accessible, and connected.
</p>

<p>
  <a href="#-features">Features</a> •
  <a href="#-user-roles">User Roles</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

</div>

---

## 🩺 About SehatSetu

**SehatSetu** is a digital healthcare platform that connects patients with doctors and healthcare service providers through a single, easy-to-use platform.

The platform is designed around different user roles so that each user gets access to the features relevant to them.

Patients can discover doctors, view their profiles, check availability, and book appointments, while doctors, assistants, clinics, hospitals, laboratories, and administrators have dedicated management features.

---

## ✨ Features

### 👤 Patients

* 📱 Mobile number login with OTP verification
* 🔎 Search and discover doctors
* 🩺 Browse doctors by specialty
* 👨‍⚕️ View doctor profiles and qualifications
* 📅 Check availability and book appointments
* 📋 Manage upcoming and previous appointments
* 🏥 Discover healthcare facilities and services
* 🪪 ABHA integration support
* 📄 Digital healthcare information and records
* 👨‍👩‍👧 Family member profiles

### 👨‍⚕️ Doctors & Assistants

* Secure login
* Doctor profile management
* Availability and schedule management
* Appointment management
* Patient appointment information
* Accept, reschedule, or cancel appointments
* Consultation schedule management

### 🏥 Clinics & Hospitals

* Organization profile management
* Doctor and staff management
* Appointment management
* Schedule management
* Healthcare service management

### 🧪 Diagnostic Laboratories

* Laboratory profile management
* Diagnostic service management
* Booking management
* Patient request tracking

### 🛡️ Administrators

* Complete platform management
* User management
* Doctor/provider verification
* Clinic, hospital and laboratory management
* Appointment monitoring
* Healthcare category management
* Reports and analytics
* Role and permission management

---

## 👥 User Roles

| User            | Main Access                                                              |
| --------------- | ------------------------------------------------------------------------ |
| 👤 Patient      | Doctors, appointments, healthcare services & personal health information |
| 👨‍⚕️ Doctor    | Profile, availability, appointments & relevant patient information       |
| 👩‍💼 Assistant | Doctor schedule and appointment management                               |
| 🏥 Clinic       | Doctors, staff, appointments & clinic management                         |
| 🏨 Hospital     | Doctors, services & appointment management                               |
| 🧪 Laboratory   | Diagnostic services & bookings                                           |
| 🛡️ Admin       | Complete platform administration                                         |

> Each user role has a dedicated experience and only accesses the features and information appropriate to that role.

---

## 🔐 Authentication

SehatSetu uses role-based authentication to provide different experiences for different types of users.

### Patient Authentication

```text
Mobile Number
      ↓
OTP Verification
      ↓
Patient Account
      ↓
Healthcare Services
```

Patients can optionally link their **ABHA** where supported by the platform.

---

## 📱 Patient Experience

```text
Login
  ↓
Home
  ↓
Search Doctor
  ↓
Choose Specialty
  ↓
View Doctor
  ↓
Check Availability
  ↓
Book Appointment
  ↓
Appointment Confirmation
  ↓
Consultation
```

---

## 🏗️ Platform Architecture

```text
                         SEHATSETU
                            │
              ┌─────────────┼─────────────┐
              │             │             │
           Patients     Healthcare      Admin
                         Providers
              │             │             │
        ┌─────┴─────┐   ┌───┴────┐    ┌───┴────┐
        │           │   │        │    │        │
     Doctors    Services Doctors Assistants Users
        │           │
        └─────┬─────┘
              │
        Appointments
              │
      Healthcare Services
              │
       Health Information
```

---

## 🛠️ Technology Stack

> Update this section whenever your actual implementation changes.

### Frontend

* React
* JavaScript / TypeScript
* Tailwind CSS

### Backend

* Not yet implemented in the repository; this is a front-end-only prototype.
* Planned: FastAPI or equivalent server-side API with strict role checks.

### Database

* No production database connected in the current build.
* Planned: MongoDB or PostgreSQL with migration and backup controls.

### Authentication

* Current prototype: UI-only mock flow.
* Planned: secure OTP, session, and role-based authorization system.

### Development & Deployment

* GitHub repository and Vite-based front-end build
* Runtime config validation for safe public URLs
* Production deployment controls to be added before use with real patient data

---

## 📂 Project Structure

```text
SehatSetu/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── assets/
│
├── .env
├── package.json
├── README.md
└── ...
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

### Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

### Navigate to the Project

```bash
cd SehatSetu
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application will then be available through the local development URL provided by your development server.

---

## 🚀 Deploy to GitHub Pages

This repository is configured to deploy the Vite frontend to GitHub Pages whenever changes are pushed to `main`.

1. Push the project to the `main` branch of `uttamdasud/SehatSetuApp`.
2. On GitHub, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
3. Open the repository's **Actions** tab and wait for the **Deploy to GitHub Pages** workflow to finish.
4. Visit [https://uttamdasud.github.io/SehatSetuApp/](https://uttamdasud.github.io/SehatSetuApp/).

You can also start a deployment manually from **Actions → Deploy to GitHub Pages → Run workflow**.

> GitHub Pages hosts static frontend files only. Authentication in this demo is not backed by a production server, and app data is not securely persisted. Do not use real patient information or production credentials.

---

## 🔑 Environment Variables

Create a `.env` file in the project root.

Example:

```env
VITE_API_URL=
VITE_AUTH_API=
VITE_ABHA_API=
```

> Never commit API keys, passwords, database credentials, OTP credentials, or other sensitive information to GitHub.

---

## 🗺️ Roadmap

* [ ] Patient authentication with mobile OTP
* [ ] Doctor discovery
* [ ] Doctor specialty categories
* [ ] Appointment booking
* [ ] Doctor availability management
* [ ] Clinic management
* [ ] Hospital management
* [ ] Laboratory management
* [ ] Admin dashboard
* [ ] ABHA integration
* [ ] Digital prescriptions
* [ ] Digital health records
* [ ] Online payments
* [ ] Video consultations
* [ ] Diagnostic test booking
* [ ] Medicine delivery integration
* [ ] Family health profiles
* [ ] Multi-language support
* [ ] Dedicated Android & iOS applications
* [ ] AI-powered healthcare assistance

---

## 🎯 Vision

SehatSetu aims to build a connected digital healthcare ecosystem where patients can easily find the right healthcare provider and manage their healthcare journey from a single platform.

### **Connecting People. Simplifying Healthcare.**

---

## ⚠️ Disclaimer

SehatSetu is a healthcare technology platform and does not replace professional medical advice, diagnosis, or treatment.

Always consult a qualified healthcare professional for medical decisions.

---

## 📄 License

This project is currently under development.

The licensing terms will be added when the project is ready for public release.

---

<div align="center">

### 🏥 SehatSetu

**Connecting People. Simplifying Healthcare.**

Built with ❤️ for better digital healthcare.

</div>
