# ExamSphere — Online Examination System

ExamSphere is a web-based online examination platform built with **React**, **TypeScript**, **Tailwind CSS**, and **Firebase** (Authentication & Cloud Firestore). It supports end-to-end workflows for **Students**, **Faculty / Examiners**, and **Administrators**.

---

## Features

- **Pre-Entry Login Portal**: Sign in as a Student, Admin (`admin@123`), or via Google Sign-In before entering the platform.
- **Student Exam Dashboard**: Browse available, upcoming, and completed exams, view exam rules before starting, and inspect results.
- **Exam Engine**:
  - Countdown timer with auto-submit when time expires.
  - Supports MCQs (single/multiple choice, code analysis) and written descriptive questions.
  - Question palette with flag-for-review, scratchpad notes, and continuous auto-save.
- **Faculty & Admin Console (`admin@123`)**:
  - Create exams and add MCQ or descriptive questions.
  - Monitor active student sessions and grant extra time.
  - Grade written answers, compute final scores, and publish results.
  - Manage students, faculty, roles, activity logs, and stats.
- **Use Case Diagram & Cloud Sync**: View the system Use Case diagram and sync exams/submissions with Cloud Firestore.

---

## Demo Accounts

| Role | Username / ID | Password | Access |
| :--- | :--- | :--- | :--- |
| **Student** | `CS-2024-8841` | `student@123` | Take exams & view results |
| **Admin / Faculty** | `admin@123` | `admin@123` | Add questions, grade answers, view student performance |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend / Database**: Firebase Authentication & Cloud Firestore (`firebase-applet-config.json`, `firestore.rules`)

---

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server** (port `3000`):
   ```bash
   npm run dev
   ```

3. **Type-check and build**:
   ```bash
   npm run lint
   npm run build
   ```
