# Product Requirements Document (PRD): CampusFlow

## 1. Problem Statement
Many colleges still rely on fragmented systems, spreadsheets, or even paper-based processes to manage student data, attendance, and grades. This disjointed approach leads to:
*   **Students** lacking real-time visibility into their academic standing, attendance shortages, or missing assignments until it's too late.
*   **Faculty** wasting hours on manual administrative tasks (taking roll, calculating grades) instead of focusing on teaching.
*   **Administrators** struggling to get a unified view of institutional health, making it difficult to identify students at risk or enforce academic policies efficiently.

CampusFlow aims to centralize these workflows into a single, intuitive MERN-stack platform, starting with a laser focus on empowering students to track their academic health.

## 2. Target User & Personas
While the system serves Administrators and Faculty, the **primary target user for this MVP is the Student**, prioritizing their portal and tracking experience.

### Persona 1: Sarah, The Proactive Student
*   **Profile:** 2nd-year Computer Science student taking 6 courses.
*   **Needs:** Wants to know exactly where she stands. Needs to ensure her attendance stays above the 75% mandate and wants to track her internal marks to predict her final grades.
*   **Pain Point:** Currently has to ask individual professors for her attendance and track her own marks in a spreadsheet.

### Persona 2: Professor John, The Overworked Lecturer
*   **Profile:** Teaches 3 different classes of 60 students each.
*   **Needs:** Needs a frictionless way to take attendance daily on his laptop in under 2 minutes. Needs a simple interface to bulk-upload assignment marks.
*   **Pain Point:** Despises the current clunky legacy portal that crashes frequently and requires 15 clicks just to enter attendance for one session.

## 3. Goals and Non-Goals

### Goals
*   **Deliver a functional MVP** demonstrating core ERP capabilities (Auth, Attendance, Marks, Timetable, Notices) suitable for a MERN stack student project.
*   **Provide an exceptional Student UX**, highlighted by the "Academic Risk Detector," a feature that provides immediate, actionable feedback on academic standing based on rule-based logic.
*   **Ensure high code quality and a polished UI**, optimizing for local development, local testing, and demonstration purposes.

### Non-Goals (For MVP)
*   Deploying to production infrastructure or cloud hosting.
*   Complex, multi-factor machine learning models for the Risk Detector.
*   Financial transactions or Fee Management modules.
*   Complex Examination scheduling, grading curves, or official transcript generation.
*   Integration with external LMS (Canvas, Blackboard) or SSO providers.

## 4. User Stories

**Student**
*   *As a student, I want to* view my current attendance percentage per subject *so that* I know if I am at risk of being debarred.
*   *As a student, I want to* see my "Academic Risk Status" (Green/Yellow/Red) on my dashboard *so that* I can quickly assess my overall standing.
*   *As a student, I want to* view notices posted by my faculty or admin *so that* I don't miss important deadlines or changes.

**Faculty**
*   *As a faculty member, I want to* select a class and date to quickly mark students as present/absent *so that* attendance tracking is fast and accurate.
*   *As a faculty member, I want to* upload internal marks for a specific assessment *so that* students can view their performance immediately.
*   *As a faculty member, I want to* post notices to my assigned classes *so that* I can communicate schedule changes or reminders.

**Admin**
*   *As an admin, I want to* create student and faculty accounts *so that* the system is populated and ready to use.
*   *As an admin, I want to* assign faculty to specific subjects and classes *so that* access control is properly maintained.

## 5. Feature List (Scope)

### MVP (Must-Have)
*   **Authentication & Roles:** JWT-based login (Admin, Faculty, Student), Role-Based Access Control.
*   **Admin Dashboard:** Manage Users (Students/Faculty), Manage Courses/Subjects, Assign Faculty to Subjects.
*   **Faculty Portal:** View assigned classes, Mark Attendance, Upload Marks (Internal/Assignments), Post Class Notices.
*   **Student Portal:** View Timetable, View Subject-wise Attendance, View Marks.
*   **Academic Risk Detector:** Rule-based standing indicator on the student dashboard.
*   **Global Notices:** Admin broadcast notices to all users.

### v2 (Fast Follows)
*   Examination Module (Exam schedules, final results calculation).
*   Fee Module (Fee structure, dummy payment gateways, pending status).
*   Library Management (Book inventory, issue/return tracking).
*   Messaging System (Direct Student-Faculty comms).

### Later (Nice-to-Have)
*   Placement/Internship portals.
*   Hostel management.
*   Alumni network.
*   Predictive AI for student drop-out risk.

## 6. Functional Requirements (MVP)

### 6.1 Authentication (JWT)
*   **FR1:** System must support three distinct roles: `admin`, `faculty`, `student`.
*   **FR2:** Login requires ID/Email and Password.
*   **FR3:** Unauthenticated users trying to access protected routes must be redirected to the login page.

### 6.2 Admin Module
*   **FR4:** Admin can CRUD Students and Faculty (Name, Email, ID, Department, Semester).
*   **FR5:** Admin can create Subjects and link them to Departments/Semesters.
*   **FR6:** Admin can assign a Faculty member to a specific Subject.

### 6.3 Faculty Module
*   **FR7:** Faculty dashboard only shows Subjects/Classes assigned to them.
*   **FR8 (Attendance):** Faculty selects a Subject and Date. System presents a list of enrolled students. Faculty toggles Present/Absent.
*   **FR9 (Marks):** Faculty selects a Subject and creates an "Assessment" (e.g., Midterm 1). Faculty inputs marks for each enrolled student.
*   **FR10 (Notices):** Faculty can publish text-based notices visible only to students enrolled in their assigned subjects.

### 6.4 Student Module & Risk Detector
*   **FR11:** Student dashboard aggregates data across all their enrolled subjects for the current semester.
*   **FR12:** Dashboard must display total aggregate attendance and a subject-wise breakdown.
*   **FR13:** Dashboard must display all marks received so far.
*   **FR14 (Risk Detector):** The system calculates a risk score on every dashboard load based on predefined rules:
    *   **🔴 Red (At Risk):** Aggregate attendance < 60% OR aggregate marks < 40%.
    *   **🟡 Yellow (Needs Improvement):** Aggregate attendance < 75% OR aggregate marks < 60%.
    *   **🟢 Green (Good Standing):** Aggregate attendance >= 75% AND aggregate marks >= 60%.
*   **FR15:** Students can view a chronological feed of Notices.

## 7. Data Model Sketch (MongoDB Collections)

**1. `User`**
*   `_id` (ObjectId)
*   `userId` (String, e.g., STU-001) - *Indexed, Unique*
*   `name` (String)
*   `email` (String) - *Unique*
*   `password` (String, Hashed)
*   `role` (Enum: 'admin', 'faculty', 'student')
*   `department` (ObjectId -> ref Department)
*   `semester` (Number) - *Null for Admin/Faculty*

**2. `Subject`**
*   `_id` (ObjectId)
*   `subjectCode` (String) - *Unique*
*   `name` (String)
*   `department` (ObjectId -> ref Department)
*   `semester` (Number)
*   `assignedFaculty` (ObjectId -> ref User)

**3. `Attendance`**
*   `_id` (ObjectId)
*   `subject` (ObjectId -> ref Subject)
*   `date` (Date)
*   `records` (Array of Objects): `[{ student: ObjectId, status: Enum('Present', 'Absent') }]`

**4. `Assessment` (Marks)**
*   `_id` (ObjectId)
*   `subject` (ObjectId -> ref Subject)
*   `title` (String)
*   `maxMarks` (Number)
*   `records` (Array of Objects): `[{ student: ObjectId, marksObtained: Number }]`

**5. `Notice`**
*   `_id` (ObjectId)
*   `title` (String)
*   `content` (String)
*   `author` (ObjectId -> ref User)
*   `audience` (Enum: 'global', 'class')
*   `targetSubject` (ObjectId) - *Null if global*
*   `createdAt` (Date)

## 8. Edge Cases & Failure States

*   **Late Enrollment:** If a student is added to a class late, how is their attendance calculated? (Must calculate based on sessions held *since enrollment*, not absolute total sessions, or provide a manual override).
*   **Missing Marks:** If no marks are uploaded yet, the Academic Risk Detector must gracefully ignore marks and calculate risk based *only* on attendance, rather than defaulting to zero and showing "At Risk".
*   **Faculty Reassignment:** If a faculty member is removed from a subject, historical attendance/marks records must remain intact and tied to the subject.
*   **Unassigned Students:** A student without an assigned semester or department shouldn't break the dashboard; they should see a friendly "Awaiting course assignment" state.

## 9. Success Metrics
Since this is a local student project, standard SaaS metrics don't apply. Success means:
1.  **Feature Completeness:** All MVP features implemented and functional without critical blocking bugs.
2.  **Demo Flow:** A seamless 5-minute local demo showcasing the journey: Admin setup -> Faculty grading -> Student Risk Detector updating in real-time.
3.  **Code Quality:** Clean MERN architecture, proper RESTful API design, modular React components, and secure JWT handling.

## 10. Open Questions
1.  **Seed Data:** Should we build a database seeding script (faker.js) to automatically populate dummy students, faculty, and subjects? *(Highly recommended for development speed).*
2.  **Timetable UI:** Timetables are complex to model dynamically. Should we settle for a simple static image upload for the MVP, or build a basic JSON-driven daily schedule view?
3.  **Risk Logic Edge Cases:** What happens if a student has 90% attendance but 38% marks? The current logic flags them as Red (At Risk). Is this the desired strictness?
