#  FinVoice – SHG Accounting App

FinVoice is a **digital accounting and management platform for Women Self Help Groups (SHGs)**, designed to simplify savings, loans, and meeting tracking with **regional language support** and **voice input**.

Built for accessibility, FinVoice helps SHGs transition from manual bookkeeping to a secure, modern, and easy-to-use system.

---

## Features

### Authentication
- Firebase Authentication (Email & Password)
- Secure user access

### Regional Language Support
- English
- Tamil
- Hindi
- Malayalam
- Language selection on first login

### Voice Input (Speech-to-Text)
- Voice-based data entry using Web Speech API
- Supports Indian regional languages
- Ideal for non-technical users

### Group Management
- Create and manage SHG group details
- Meeting frequency & contribution setup

### Member Management
- Register multiple SHG members
- Member-wise balance and loan tracking
- Data stored securely in Firestore

### Financial Tracking
- Monthly contributions
- Loan issuance and repayments
- Automatic balance calculations

### Dashboard & Summary
- Total savings
- Active loans
- Member summaries

### Reset & Data Control
- Reset application
- Deletes all group and member data from Firestore

---

## Tech Stack

| Layer | Technology |
|-----|-----------|
| Frontend | React + TypeScript |
| State Management | Zustand |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Firebase |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Voice Input | Web Speech API |
| Build Tool | Vite |

---

