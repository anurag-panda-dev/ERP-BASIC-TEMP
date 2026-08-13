# CampusFlow — User Sign-Up & Role Onboarding Guide

This guide explains how **Students**, **Faculty**, and **Administrators** create accounts, sign in, and obtain their respective role permissions in CampusFlow.

---

## 🔑 Authentication Architecture Overview

CampusFlow uses **Clerk** for user authentication paired with **MongoDB** for Role-Based Access Control (RBAC).

```
1. User Signs Up via Clerk (Email/Password)
2. Frontend Syncs User to MongoDB via POST /api/auth/register
3. Default Role Assigned: 'student'
4. Role Upgraded to 'faculty' or 'admin' by Administrator (or via seed script)
```

---

## 🎓 1. How to Sign Up as a Student

### Step 1: Create an Account
1. Open the application (e.g. `http://localhost:5173`).
2. Click **Get Started** or **Sign In** on the top navigation bar.
3. On the Clerk Sign-In/Up form:
   - Enter your **Email Address** and **Password**.
   - Click **Continue** / **Sign Up**.

### Step 2: Automatic Profile Creation
- Upon signing up, CampusFlow automatically registers your account in the system database with the **Student** role by default.
- You will be redirected to the **Student Dashboard** (`/student/dashboard`).

### Step 3: Course & Department Assignment
- Initially, your dashboard will display an *"Awaiting course assignment"* or empty state until an Administrator assigns you to a Department and Semester.
- Once enrolled, your **Academic Risk Detector** hero card, subject attendance %, and marks breakdown will automatically populate.

---

## 👩‍🏫 2. How to Sign Up / Onboard as Faculty

There are **two ways** to onboard a Faculty member:

### Option A: Self-Registration + Admin Upgrade (Recommended)
1. **Faculty Member:** Signs up via the standard login page (`/login`) using their official university email.
2. **Account Created:** Account is created with default `student` role.
3. **Admin Action:** 
   - An Administrator logs into `/admin/users`.
   - Admin finds the faculty member's name/email in the table.
   - Admin clicks **Edit** and changes the **Role** from `Student` to `Faculty`.
   - Admin selects their **Department** and clicks **Save Changes**.
4. **Faculty Access Granted:** Next time the faculty member logs in or refreshes, they are routed directly to the **Faculty Dashboard** (`/faculty/dashboard`).

### Option B: Pre-Creation by Administrator
1. Admin opens **User Management** (`/admin/users`).
2. Admin clicks **Add User**.
3. Admin fills in:
   - **Name**: e.g., *Prof. John Doe*
   - **Email**: `john.doe@university.edu`
   - **Role**: `Faculty`
   - **Department**: e.g., *Computer Science*
4. Admin assigns subjects to the faculty member via `/admin/subjects`.

---

## 🛡️ 3. How to Set Up an Administrator Account

### Option A: Using Database Seeding (Development & Setup)
Run the backend seed script to populate default admin, faculty, and student accounts:

```bash
cd server
npm run seed
```

This creates demo accounts including an **Admin user**.

### Option B: Upgrading an Existing Account via Admin Panel
1. Log in with an existing Admin account.
2. Navigate to **Admin Dashboard** → **User Management** (`/admin/users`).
3. Click **Add User** or **Edit** an existing user.
4. Set **Role** to `Admin`.
5. Click **Save Changes**.

---

## 📊 Summary of Role Access & Dashboards

| Role | Landing Route | Key Capabilities |
| text | ------------- | ---------------- |
| **Student** | `/student/dashboard` | View Academic Risk Status, Subject Attendance %, Marks Transcript, Weekly Timetable, Notices |
| **Faculty** | `/faculty/dashboard` | Daily Attendance Roster, Create Assessments, Enter & Publish Marks, Post Class Notices |
| **Admin** | `/admin/dashboard` | Full User CRUD, Manage Departments, Manage Subjects, Assign Faculty, System Notices |

---

## 🧪 Demo Credentials (Seeded Data)

If you ran `npm run seed` on the backend, you can test with pre-populated dummy accounts or log in via Clerk to create a fresh account.
