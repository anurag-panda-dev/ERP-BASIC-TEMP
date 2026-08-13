# CampusFlow Backend Implementation Plan

**Stack:** Node.js + Express.js + MongoDB + Mongoose + JWT + Bcrypt

**Development Environment:** Node.js 18+, npm/yarn, MongoDB 5.0+

---

## 1. Project Initialization

### Setup Commands
```bash
npm init -y
npm install express mongoose jsonwebtoken bcryptjs zod dotenv cors morgan axios
npm install -D nodemon eslint prettier
```

### Environment Files
```
.env.local              # Local dev (DO NOT commit)
.env.production         # Production config
.env.example            # Template
```

**Sample .env.local:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campusflow
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRY=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
```

---

## 2. Folder Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection setup
│   │   ├── environment.js       # Environment variable validation
│   │   └── constants.js         # App-wide constants
│   │
│   ├── middleware/
│   │   ├── errorHandler.js      # Global error handling middleware
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── roleMiddleware.js    # Role-based access control
│   │   ├── validationMiddleware.js # Zod schema validation
│   │   └── corsMiddleware.js    # CORS configuration
│   │
│   ├── models/
│   │   ├── User.js              # User schema (Student, Faculty, Admin)
│   │   ├── Department.js        # Department/Course schema
│   │   ├── Subject.js           # Subject schema
│   │   ├── Attendance.js        # Attendance records
│   │   ├── Assessment.js        # Marks/Assessment schema
│   │   ├── Notice.js            # Notice schema
│   │   ├── Timetable.js         # Timetable schema
│   │   └── index.js             # Export all models
│   │
│   ├── schemas/
│   │   ├── userSchemas.js       # Zod validation schemas for users
│   │   ├── subjectSchemas.js
│   │   ├── attendanceSchemas.js
│   │   ├── assessmentSchemas.js
│   │   └── noticeSchemas.js
│   │
│   ├── controllers/
│   │   ├── authController.js    # Login, logout, refresh token
│   │   │
│   │   ├── userController.js    # CRUD for users
│   │   ├── departmentController.js
│   │   ├── subjectController.js
│   │   │
│   │   ├── attendanceController.js
│   │   ├── assessmentController.js
│   │   │
│   │   ├── dashboardController.js  # Dashboard aggregations
│   │   ├── noticeController.js
│   │   ├── timetableController.js
│   │   └── reportController.js  # Report generation
│   │
│   ├── services/
│   │   ├── authService.js       # Auth logic (password hashing, token generation)
│   │   ├── userService.js       # User CRUD logic
│   │   ├── subjectService.js
│   │   ├── attendanceService.js # Calculate attendance %, validation
│   │   ├── assessmentService.js
│   │   ├── dashboardService.js  # Risk detector, aggregations
│   │   ├── noticeService.js
│   │   ├── timetableService.js
│   │   └── reportService.js
│   │
│   ├── routes/
│   │   ├── index.js             # Main route aggregator
│   │   ├── auth.js              # POST /api/auth/login, /api/auth/me
│   │   ├── users.js             # CRUD /api/users
│   │   ├── departments.js       # CRUD /api/departments
│   │   ├── subjects.js          # CRUD /api/subjects
│   │   ├── attendance.js        # /api/attendance
│   │   ├── assessments.js       # /api/assessments
│   │   ├── dashboards.js        # /api/dashboard/*
│   │   ├── notices.js           # /api/notices
│   │   ├── timetables.js        # /api/timetables
│   │   └── reports.js           # /api/reports
│   │
│   ├── utils/
│   │   ├── logger.js            # Logging utility
│   │   ├── errorHandler.js      # Error class and handling
│   │   ├── validators.js        # Validation helper functions
│   │   ├── responseFormatter.js # Standard response formatting
│   │   ├── dateUtils.js         # Date/semester logic
│   │   └── seedDatabase.js      # Dev/test data seeding
│   │
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
│
├── .env.example
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
├── nodemon.json
└── IMPLEMENTATION_PLAN.md        # This file
```

---

## 3. Detailed File Responsibilities

### 3.1 Core Application Files

**`src/server.js`**
```javascript
// Entry point
// 1. Load environment variables from .env
// 2. Connect to MongoDB
// 3. Start Express server on process.env.PORT
// 4. Graceful shutdown on SIGTERM
```

**`src/app.js`**
```javascript
// Express app configuration
// 1. Middleware setup (CORS, Morgan, body parser)
// 2. Route registration
// 3. Error handling middleware
// Does NOT start the server
```

### 3.2 Configuration Files

**`src/config/database.js`**
```javascript
// MongoDB connection using Mongoose
// Handles connection errors and retries
// Exports connect() function
```

**`src/config/environment.js`**
```javascript
// Validate and export environment variables
// Throw error if required vars are missing
// Returns config object with all vars
```

**`src/config/constants.js`**
```javascript
// App constants:
const ROLES = { ADMIN: 'admin', FACULTY: 'faculty', STUDENT: 'student' };
const RISK_THRESHOLDS = {
  RED: { attendance: 0.60, marks: 0.40 },
  YELLOW: { attendance: 0.75, marks: 0.60 },
};
const ATTENDANCE_THRESHOLD = 0.75; // 75% min for students
const HTTP_STATUS = { OK: 200, CREATED: 201, BAD_REQUEST: 400, ... };
```

### 3.3 Middleware

**`src/middleware/authMiddleware.js`**
```javascript
// Verify JWT token
// Extract user ID and role from token
// Attach to req.user
// Redirect to 401 if invalid/missing
```

**`src/middleware/roleMiddleware.js`**
```javascript
// Factory function: requireRole(['admin', 'faculty'])
// Check if req.user.role is in allowed roles
// Return 403 if unauthorized
```

**`src/middleware/validationMiddleware.js`**
```javascript
// Factory function: validateBody(zodSchema)
// Parse and validate req.body against schema
// Return 400 with error messages if validation fails
```

**`src/middleware/errorHandler.js`**
```javascript
// Catch-all error handler middleware
// Formats error response: { error: string, status: number, details?: object }
// Logs error to console/logger
// Never sends stack traces to client
```

### 3.4 Mongoose Models

**`src/models/User.js`**
```javascript
const userSchema = new Schema({
  userId: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true }, // Hashed
  role: { type: String, enum: ['admin', 'faculty', 'student'], required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: false },
  semester: { type: Number, required: false }, // For students only
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook: Hash password if modified
// Post-toJSON hook: Remove password from responses
```

**`src/models/Department.js`**
```javascript
const departmentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  hod: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
});
```

**`src/models/Subject.js`**
```javascript
const subjectSchema = new Schema({
  subjectCode: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  semester: { type: Number, required: true },
  assignedFaculty: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  credits: { type: Number, required: true },
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

// Index: (department, semester) for fast queries
```

**`src/models/Attendance.js`**
```javascript
const attendanceSchema = new Schema({
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  date: { type: Date, required: true, index: true },
  records: [
    {
      student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      status: { type: String, enum: ['Present', 'Absent'], required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound index: (subject, date)
```

**`src/models/Assessment.js`**
```javascript
const assessmentSchema = new Schema({
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  title: { type: String, required: true }, // e.g., "Midterm 1"
  maxMarks: { type: Number, required: true },
  assessmentType: { type: String, enum: ['internal', 'assignment', 'exam'] },
  records: [
    {
      student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      marksObtained: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

**`src/models/Notice.js`**
```javascript
const noticeSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  audience: { type: String, enum: ['global', 'class'], default: 'global' },
  targetSubject: { type: Schema.Types.ObjectId, ref: 'Subject', required: false },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
});
```

**`src/models/Timetable.js`**
```javascript
const timetableSchema = new Schema({
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  dayOfWeek: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], required: true },
  startTime: { type: String, required: true }, // HH:mm format
  endTime: { type: String, required: true },
  classroom: { type: String, required: true },
  semester: { type: Number, required: true },
  academicYear: { type: String, required: true },
});
```

### 3.5 Zod Validation Schemas

**`src/schemas/userSchemas.js`**
```javascript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const createUserSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'faculty', 'student']),
  department: z.string().optional(),
  semester: z.number().optional(),
});

// ... export all schemas
```

### 3.6 Controllers (Request Handlers)

**`src/controllers/authController.js`**
```javascript
export const login = async (req, res, next) => {
  // 1. Validate request body (email, password)
  // 2. Find user by email
  // 3. Compare password with hash
  // 4. Generate JWT token
  // 5. Return token + user info (without password)
  // 6. Catch errors and pass to next(error)
};

export const validateToken = async (req, res, next) => {
  // 1. Extract JWT from Authorization header
  // 2. Verify JWT
  // 3. Return user info from token
};
```

**`src/controllers/userController.js`**
```javascript
export const getUsers = async (req, res, next) => {
  // 1. Check authorization (admin only)
  // 2. Parse query params: role, department, page, limit
  // 3. Fetch users from DB with pagination
  // 4. Return formatted response with total count
};

export const createUser = async (req, res, next) => {
  // 1. Validate body against createUserSchema
  // 2. Check if email/userId already exists
  // 3. Hash password using bcrypt
  // 4. Save to DB
  // 5. Return created user (without password)
};

export const updateUser = async (req, res, next) => {
  // 1. Validate user exists
  // 2. Check authorization (admin or self)
  // 3. Update fields (name, email, role, etc.)
  // 4. Handle password update separately (hash)
  // 5. Return updated user
};

export const deleteUser = async (req, res, next) => {
  // 1. Check authorization (admin only)
  // 2. Perform soft delete: set isActive = false
  // 3. Return success response
};
```

**`src/controllers/attendanceController.js`**
```javascript
export const getAttendance = async (req, res, next) => {
  // Query params: subjectId, date, studentId
  // Fetch Attendance records matching criteria
  // Return formatted attendance list
};

export const submitAttendance = async (req, res, next) => {
  // 1. Check authorization (faculty assigned to subject)
  // 2. Validate body: subjectId, date, records (student[], status[])
  // 3. Check if attendance already exists for date (update or create)
  // 4. Save to DB
  // 5. Return success response
};

export const getStudentAttendance = async (req, res, next) => {
  // studentId from req.params
  // Aggregate all attendance records for student across all subjects
  // Calculate per-subject percentage
  // Return formatted data
};
```

**`src/controllers/assessmentController.js`**
```javascript
export const getAssessments = async (req, res, next) => {
  // subjectId from query
  // Fetch all assessments for subject
  // Return with marks for current user (if student)
};

export const createAssessment = async (req, res, next) => {
  // 1. Check authorization (faculty assigned to subject)
  // 2. Validate body: title, maxMarks, assessmentType, records
  // 3. Save to DB
  // 4. Return created assessment
};

export const submitMarks = async (req, res, next) => {
  // 1. Check authorization (faculty assigned to subject)
  // 2. Validate assessmentId exists
  // 3. Validate marks <= maxMarks
  // 4. Update assessment.records with marks
  // 5. Return success
};
```

**`src/controllers/dashboardController.js`**
```javascript
export const getStudentDashboard = async (req, res, next) => {
  // Current student from req.user
  // Aggregate:
  //   - Attendance%: Call attendanceService.calculateAttendancePercentage()
  //   - Marks%: Call assessmentService.calculateMarksPercentage()
  //   - Risk Status: Call riskCalculator (RED/YELLOW/GREEN)
  //   - Recent notices for enrolled subjects
  //   - Today's timetable
  // Return all in single response to minimize frontend requests
};

export const getFacultyDashboard = async (req, res, next) => {
  // Current faculty from req.user
  // Aggregate:
  //   - Today's schedule (from Timetable)
  //   - Pending attendance (classes without attendance record today)
  //   - Student count per subject
  // Return formatted data
};

export const getAdminDashboard = async (req, res, next) => {
  // Admin-only
  // Aggregate:
  //   - Total students, faculty, subjects
  //   - Students at risk count
  //   - Monthly attendance average
  // Return high-level stats
};
```

**`src/controllers/noticeController.js`**
```javascript
export const getNotices = async (req, res, next) => {
  // Query params: page, limit, audience
  // Current user determines filters (admin/faculty sees their notices)
  // Student sees global + class notices they're enrolled in
  // Return paginated, sorted by createdAt DESC
};

export const createNotice = async (req, res, next) => {
  // 1. Check authorization (admin or faculty)
  // 2. Validate: title, content, audience, targetSubject
  // 3. For faculty: audience must be 'class' and targetSubject must be assigned
  // 4. Save to DB
  // 5. Return created notice
};
```

### 3.7 Services (Business Logic)

**`src/services/authService.js`**
```javascript
export const hashPassword = (plaintext) => {
  // bcrypt.hash with BCRYPT_ROUNDS
};

export const comparePassword = (plaintext, hash) => {
  // bcrypt.compare
};

export const generateToken = (userId, role) => {
  // jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
};

export const verifyToken = (token) => {
  // jwt.verify, returns decoded payload
};
```

**`src/services/attendanceService.js`**
```javascript
export const calculateAttendancePercentage = async (studentId, subjectId) => {
  // Fetch all Attendance records for (student, subject)
  // Count total sessions, present sessions
  // Return percentage
};

export const calculateAggregateAttendance = async (studentId) => {
  // Fetch all Attendance records for student across all subjects
  // For each subject: calculate present%
  // Calculate overall average attendance%
  // Return { overallPercentage, subjectBreakdown: [{subject, percentage}] }
};

export const validateAttendanceSubmission = (subjectId, records) => {
  // Check all students in records are enrolled in subject
  // Check status values are valid
  // Return true or throw error
};
```

**`src/services/assessmentService.js`**
```javascript
export const calculateMarksPercentage = async (studentId, subjectId) => {
  // Fetch all Assessment records for (student, subject)
  // Calculate average marks percentage
  // Return { percentage, breakdown: [{assessment, marksObtained, maxMarks}] }
};

export const calculateAggregateMarks = async (studentId) => {
  // Fetch all Assessment records for student across all subjects
  // For each subject: calculate marks%
  // Calculate overall average marks%
  // Return { overallPercentage, subjectBreakdown: [{subject, percentage}] }
};
```

**`src/services/dashboardService.js`**
```javascript
export const calculateRiskStatus = (attendancePercentage, marksPercentage) => {
  // Logic:
  //   RED: attendance < 60% OR marks < 40%
  //   YELLOW: attendance < 75% OR marks < 60%
  //   GREEN: attendance >= 75% AND marks >= 60%
  // Return { status: 'RED'|'YELLOW'|'GREEN', message: string }
};

export const getStudentAcademicData = async (studentId) => {
  // Aggregate:
  //   - attendanceData = attendanceService.calculateAggregateAttendance()
  //   - marksData = assessmentService.calculateAggregateMarks()
  //   - riskStatus = calculateRiskStatus()
  //   - recentNotices = noticeService.getApplicableNotices(studentId)
  //   - timetable = timetableService.getTodaysTimetable()
  // Return combined object for dashboard
};
```

**`src/services/noticeService.js`**
```javascript
export const getApplicableNotices = async (userId, role, page = 1, limit = 10) => {
  // If role = 'admin': return all notices
  // If role = 'faculty': return global + authored notices
  // If role = 'student': return global + class notices (subjects enrolled in)
  // Pagination: (page - 1) * limit
  // Return { notices: [], totalCount, page, hasMore }
};
```

**`src/services/reportService.js`**
```javascript
export const generateAttendanceReport = async (filters) => {
  // filters: { department, semester, startDate, endDate }
  // Aggregate attendance data
  // Return { byStudent, bySubject, averages, atRiskStudents }
};

export const generateMarksReport = async (filters) => {
  // filters: { department, semester, subject }
  // Aggregate marks data by assessments
  // Calculate GPA/CGPA
  // Return formatted report
};
```

### 3.8 Routes

**`src/routes/index.js`** (Main Aggregator)
```javascript
import authRoutes from './auth.js';
import userRoutes from './users.js';
import subjectRoutes from './subjects.js';
import attendanceRoutes from './attendance.js';
import assessmentRoutes from './assessments.js';
import dashboardRoutes from './dashboards.js';
import noticeRoutes from './notices.js';

export default (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/subjects', subjectRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/assessments', assessmentRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/notices', noticeRoutes);
};
```

**`src/routes/auth.js`**
```javascript
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.validateToken);
```

**`src/routes/users.js`**
```javascript
router.get('/', authMiddleware, requireRole(['admin']), userController.getUsers);
router.post('/', authMiddleware, requireRole(['admin']), validateBody(createUserSchema), userController.createUser);
router.put('/:userId', authMiddleware, validateBody(updateUserSchema), userController.updateUser);
router.delete('/:userId', authMiddleware, requireRole(['admin']), userController.deleteUser);
```

**`src/routes/attendance.js`**
```javascript
router.get('/', authMiddleware, attendanceController.getAttendance);
router.post('/', authMiddleware, requireRole(['faculty']), validateBody(submitAttendanceSchema), attendanceController.submitAttendance);
router.get('/student/:studentId', authMiddleware, attendanceController.getStudentAttendance);
```

**`src/routes/dashboards.js`**
```javascript
router.get('/student/:studentId', authMiddleware, dashboardController.getStudentDashboard);
router.get('/faculty', authMiddleware, requireRole(['faculty']), dashboardController.getFacultyDashboard);
router.get('/admin', authMiddleware, requireRole(['admin']), dashboardController.getAdminDashboard);
```

### 3.9 Utilities

**`src/utils/responseFormatter.js`**
```javascript
export const successResponse = (data, message = 'Success', statusCode = 200) => ({
  success: true,
  message,
  statusCode,
  data,
});

export const errorResponse = (message, statusCode = 400, errors = null) => ({
  success: false,
  message,
  statusCode,
  errors,
});
```

**`src/utils/errorHandler.js`**
```javascript
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**`src/utils/seedDatabase.js`**
```javascript
// Faker.js based seed script
// Generates:
//   - Admin user (admin@campusflow.com)
//   - 5 departments with 3 faculty each
//   - 5 subjects per department
//   - 50 students per department
//   - Random attendance records (last 30 days)
//   - Random marks for assessments
//   - Global notices
// Run with: node src/utils/seedDatabase.js
```

---

## 4. API Endpoint Summary

### Authentication
```
POST   /api/auth/login          { email, password }
GET    /api/auth/me             (Protected)
```

### Users (Admin Only)
```
GET    /api/users               (Query: role, department, page, limit)
POST   /api/users               { userId, name, email, password, role, department, semester }
PUT    /api/users/:userId       { name, email, role, ... }
DELETE /api/users/:userId       (Soft delete)
```

### Subjects (Admin/Faculty)
```
GET    /api/subjects            (Query: department, semester, faculty)
POST   /api/subjects            { subjectCode, name, department, semester, credits }
PUT    /api/subjects/:subjectId { name, assignedFaculty, ... }
GET    /api/subjects/:subjectId (Details with enrolled students)
```

### Attendance
```
GET    /api/attendance          (Query: subjectId, date, studentId, page, limit)
POST   /api/attendance          { subjectId, date, records: [{student, status}] }
GET    /api/attendance/student/:studentId  (Aggregate by subject)
```

### Assessments
```
GET    /api/assessments         (Query: subjectId, page, limit)
POST   /api/assessments         { subjectId, title, maxMarks, assessmentType, records }
PUT    /api/assessments/:assessmentId  (Update marks)
```

### Dashboards
```
GET    /api/dashboard/student/:studentId  (Risk status, attendance%, marks%, notices, timetable)
GET    /api/dashboard/faculty            (Today's schedule, pending attendance)
GET    /api/dashboard/admin              (System stats)
```

### Notices
```
GET    /api/notices             (Query: page, limit, audience)
POST   /api/notices             { title, content, audience, targetSubject }
```

---

## 5. Database Indexing Strategy

```javascript
// User
db.users.createIndex({ userId: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ department: 1 });

// Subject
db.subjects.createIndex({ subjectCode: 1 }, { unique: true });
db.subjects.createIndex({ department: 1, semester: 1 });

// Attendance
db.attendances.createIndex({ subject: 1, date: 1 });

// Assessment
db.assessments.createIndex({ subject: 1 });

// Notice
db.notices.createIndex({ createdAt: -1 });
db.notices.createIndex({ audience: 1, targetSubject: 1 });
```

---

## 6. Build & Development Scripts

### `package.json` (Important Scripts)
```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "seed": "node src/utils/seedDatabase.js",
    "lint": "eslint src --ext .js",
    "format": "prettier --write \"src/**/*.js\"",
    "test": "jest --coverage"
  }
}
```

### `nodemon.json`
```json
{
  "watch": ["src"],
  "ext": "js",
  "ignore": ["node_modules", ".git"],
  "exec": "node src/server.js"
}
```

**Run locally:**
```bash
npm run dev        # Starts at http://localhost:5000
npm run seed       # Populate test data
```

---

## 7. Key Implementation Decisions

1. **Error Handling:** Centralized middleware catches all errors and formats as JSON.
2. **Validation:** Zod at route level before business logic.
3. **Authentication:** Stateless JWT. No sessions.
4. **Authorization:** Role-based middleware applied per route.
5. **Database:** MongoDB with Mongoose ODM for schema enforcement and query helpers.
6. **Password Security:** bcryptjs with salt rounds = 10.
7. **Pagination:** Always implement for list endpoints (Users, Notices, Attendance).
8. **Soft Deletes:** Use isActive flag instead of hard deletes to preserve audit trail.
9. **Logging:** Morgan for HTTP logs, custom logger for business logic.

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Setup Node.js project, dependencies, .env
- [ ] MongoDB connection and schema setup
- [ ] Middleware: auth, role-based access, error handler
- [ ] Auth controller & routes (login, validateToken)
- [ ] User CRUD controller & routes

### Phase 2: Academic Core (Week 2)
- [ ] Subject CRUD
- [ ] Attendance controller & routes
- [ ] Assessment/Marks controller & routes
- [ ] Dashboard controller (aggregations)
- [ ] Risk detector logic in service layer

### Phase 3: Notices & Dashboards (Week 2)
- [ ] Notice controller & routes
- [ ] Timetable model & routes
- [ ] Dashboard endpoints for all roles
- [ ] Report generation service

### Phase 4: Data Seeding & Testing (Week 3)
- [ ] Faker.js seeding script
- [ ] Unit tests for services
- [ ] Integration tests for critical API flows
- [ ] API documentation (Postman/Swagger)

### Phase 5: QA & Optimization (Week 3)
- [ ] Performance: Query optimization, indexing
- [ ] Security: JWT refresh tokens, rate limiting
- [ ] Error handling: Comprehensive error cases
- [ ] Cross-origin: CORS configuration
- [ ] Documentation: API docs, deployment guide

---

## 9. Security Best Practices

1. **Environment Variables:** Never hardcode secrets. Use .env.
2. **Password Hashing:** bcryptjs with 10+ rounds. Never log plaintext passwords.
3. **JWT Security:** Short expiry (7d), refresh token pattern (optional for MVP).
4. **Rate Limiting:** Implement on login and sensitive endpoints.
5. **Input Validation:** Zod schema validation on every input.
6. **CORS:** Whitelist frontend origin in production.
7. **HTTPS:** Enforce in production (not needed for local dev).
8. **Audit Logging:** Log all sensitive operations (user creation, mark submission).

---

## 10. Testing Strategy

**Unit Tests:** Services, utilities (Jest + Mongoose mock)
```
src/__tests__/services/
├── attendanceService.test.js
├── assessmentService.test.js
├── dashboardService.test.js
└── authService.test.js
```

**Integration Tests:** Route + Controller + Service (Jest + MongoDB Memory Server)
```
src/__tests__/routes/
├── auth.test.js
├── users.test.js
├── attendance.test.js
└── dashboards.test.js
```

**E2E Tests:** Critical user journeys (Supertest + MongoDB)
```
src/__tests__/e2e/
├── studentJourney.test.js
├── facultyJourney.test.js
└── adminJourney.test.js
```

---

## 11. Deployment Checklist

- [ ] All environment variables configured (.env.production)
- [ ] MongoDB connection string points to production database
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting enabled on sensitive endpoints
- [ ] CORS whitelist updated
- [ ] JWT secret is strong and unique
- [ ] Database backups configured
- [ ] Monitoring & alerting setup (logs, errors)
- [ ] API documentation complete
- [ ] Load testing completed
- [ ] Security audit passed

---

## 12. Local Development Setup

### Prerequisites
```bash
# Check Node.js version (18+ required)
node --version

# Check MongoDB running locally or set MONGODB_URI in .env
mongosh --version
```

### First-time Setup
```bash
npm install
cp .env.example .env.local
# Edit .env.local with local MongoDB URI
npm run seed              # Populate test data
npm run dev              # Start server on port 5000
```

### Test User Credentials (After Seeding)
```
Admin:   admin@campusflow.com / password123
Faculty: faculty1@campus.com / password123
Student: student1@campus.com / password123
```

---

**Next Step:** Proceed with Frontend Implementation.
