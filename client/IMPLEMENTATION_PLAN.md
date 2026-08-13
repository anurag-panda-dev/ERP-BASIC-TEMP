# CampusFlow Frontend Implementation Plan

**Stack:** React 18 + Vite + Tailwind CSS + TanStack Query + React Router + Axios

**Development Environment:** Node.js 18+, npm/yarn

---

## 1. Project Initialization

### Setup Commands
```bash
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom
npm install @tanstack/react-query
npm install axios
npm install lucide-react
npm install recharts
npm install zod
npm install date-fns
npm install clsx tailwind-merge
```

### Environment Files
```
.env.local          # Local dev environment (DO NOT commit)
.env.example        # Template for .env.local
.env.production     # Production environment (if needed)
```

**Sample .env.local:**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CampusFlow
```

---

## 2. Folder Structure

```
client/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── images/
│       ├── empty-state.svg
│       ├── error-state.svg
│       └── icons/
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Main app wrapper
│   ├── index.css             # Global styles
│   │
│   ├── config/
│   │   ├── api.js            # Axios instance with interceptors
│   │   ├── constants.js      # App-wide constants (roles, colors, etc.)
│   │   └── environment.js    # Environment variable validation
│   │
│   ├── context/
│   │   ├── AuthContext.jsx   # Auth state (user, token, role)
│   │   └── ThemeContext.jsx  # Theme state (light/dark mode)
│   │
│   ├── hooks/
│   │   ├── useAuth.js        # Hook to access auth context
│   │   ├── useApi.js         # Hook for common API patterns
│   │   └── useLocalStorage.js # Hook for local storage persistence
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── UnauthorizedPage.jsx
│   │   │
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx     # Main student view (Risk Detector hero)
│   │   │   ├── StudentAttendanceDetail.jsx
│   │   │   ├── StudentMarksDetail.jsx
│   │   │   ├── StudentTimetable.jsx
│   │   │   ├── StudentNotices.jsx
│   │   │   └── StudentAssignments.jsx
│   │   │
│   │   ├── faculty/
│   │   │   ├── FacultyDashboard.jsx
│   │   │   ├── FacultyTakeAttendance.jsx
│   │   │   ├── FacultyEnterMarks.jsx
│   │   │   ├── FacultyAssignments.jsx
│   │   │   ├── FacultyNotices.jsx
│   │   │   └── FacultyMyClasses.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminUserManagement.jsx
│   │       ├── AdminCourseManagement.jsx
│   │       ├── AdminSubjectManagement.jsx
│   │       ├── AdminFacultyAssignment.jsx
│   │       ├── AdminReports.jsx
│   │       └── AdminNoticeManagement.jsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── RootLayout.jsx          # Main layout wrapper
│   │   │   ├── Navbar.jsx              # Top navigation bar
│   │   │   ├── Sidebar.jsx             # Left sidebar navigation
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx      # Route protection component
│   │   │
│   │   ├── student/
│   │   │   ├── RiskDetectorCard.jsx    # Hero card with status badge
│   │   │   ├── RiskDetectorDetail.jsx  # Expanded risk breakdown
│   │   │   ├── AttendanceChart.jsx     # Visual attendance overview
│   │   │   ├── MarksChart.jsx          # Visual marks overview
│   │   │   ├── TodaysTimetable.jsx     # Mini timetable widget
│   │   │   ├── RecentNotices.jsx       # Notice feed widget
│   │   │   ├── SubjectAttendanceRow.jsx
│   │   │   └── SubjectMarksRow.jsx
│   │   │
│   │   ├── faculty/
│   │   │   ├── AttendanceRoster.jsx    # Student list for attendance
│   │   │   ├── AttendanceToggle.jsx    # Present/Absent toggle component
│   │   │   ├── MarksGrid.jsx           # Spreadsheet-like marks entry
│   │   │   ├── ClassSelector.jsx       # Dropdown to select class/date
│   │   │   ├── TodaysSchedule.jsx      # Schedule widget
│   │   │   └── QuickActionCard.jsx     # Action card for "Take Attendance" etc
│   │   │
│   │   ├── admin/
│   │   │   ├── UserTable.jsx           # Reusable user data table
│   │   │   ├── CourseForm.jsx          # Form to add/edit courses
│   │   │   ├── SubjectForm.jsx         # Form to add/edit subjects
│   │   │   ├── FacultyAssignmentForm.jsx
│   │   │   ├── SystemStatsCard.jsx
│   │   │   └── ReportGenerator.jsx
│   │   │
│   │   ├── common/
│   │   │   ├── Badge.jsx               # Status badge (Green/Yellow/Red)
│   │   │   ├── Button.jsx              # Reusable button component
│   │   │   ├── Input.jsx               # Reusable input field
│   │   │   ├── Modal.jsx               # Reusable modal dialog
│   │   │   ├── Dropdown.jsx            # Reusable dropdown/select
│   │   │   ├── DataTable.jsx           # Reusable data table with pagination
│   │   │   ├── Card.jsx                # Reusable card component
│   │   │   ├── Toast.jsx               # Notification toast
│   │   │   ├── Spinner.jsx             # Loading spinner
│   │   │   ├── Skeleton.jsx            # Skeleton loader
│   │   │   ├── EmptyState.jsx          # Empty state message
│   │   │   ├── ErrorBoundary.jsx       # Error boundary wrapper
│   │   │   └── ConfirmDialog.jsx       # Confirmation modal
│   │   │
│   │   └── icons/
│   │       ├── RiskIndicatorIcon.jsx   # Green/Yellow/Red status icon
│   │       ├── CheckCircleIcon.jsx
│   │       ├── AlertIcon.jsx
│   │       └── LoadingIcon.jsx
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── authService.js          # Auth API calls
│   │   │   ├── userService.js          # User management API
│   │   │   ├── subjectService.js       # Subject management API
│   │   │   ├── attendanceService.js    # Attendance API
│   │   │   ├── marksService.js         # Marks/Assessment API
│   │   │   ├── noticeService.js        # Notice API
│   │   │   ├── dashboardService.js     # Dashboard aggregation API
│   │   │   └── timetableService.js     # Timetable API
│   │   │
│   │   └── logic/
│   │       ├── riskCalculator.js       # Risk status calculation logic
│   │       ├── attendanceFormatter.js  # Format attendance data
│   │       └── marksFormatter.js       # Format marks data
│   │
│   ├── utils/
│   │   ├── validators.js               # Form validation helpers
│   │   ├── formatters.js               # Date, number formatting
│   │   ├── helpers.js                  # Common utility functions
│   │   ├── errorHandler.js             # Error message extraction
│   │   ├── storageUtils.js             # LocalStorage wrapper
│   │   └── constants.js                # Client-side constants
│   │
│   ├── styles/
│   │   ├── tailwind.config.js          # Tailwind configuration
│   │   ├── globals.css                 # Global CSS overrides
│   │   └── components.css              # Component-specific styles
│   │
│   ├── queries/
│   │   ├── useAuthQuery.js             # TanStack Query hooks for auth
│   │   ├── useStudentQuery.js          # TanStack Query hooks for student data
│   │   ├── useFacultyQuery.js          # TanStack Query hooks for faculty data
│   │   ├── useAdminQuery.js            # TanStack Query hooks for admin data
│   │   └── useNoticeQuery.js           # TanStack Query hooks for notices
│   │
│   └── router/
│       └── index.jsx                   # React Router configuration
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── IMPLEMENTATION_PLAN.md              # This file
```

---

## 3. File Details & Responsibilities

### 3.1 Core Application Files

**`src/main.jsx`**
- Bootstrap React app with QueryClientProvider and Router
- Initialize global theme/auth context

**`src/App.jsx`**
- Main app wrapper
- Setup context providers
- Route definitions

**`src/index.css`**
- Global Tailwind imports
- CSS variables for design tokens
- Global utility classes

### 3.2 Config Files

**`src/config/api.js`**
```javascript
// Axios instance with:
// - Base URL from env
// - Interceptor to inject JWT in Authorization header
// - Response interceptor to handle 401 redirects
// - Error formatting
```

**`src/config/constants.js`**
```javascript
// App constants:
// - User roles (ADMIN, FACULTY, STUDENT)
// - Risk status colors (RED, YELLOW, GREEN)
// - API endpoints
// - Risk thresholds
// - Table pagination limits
```

### 3.3 Context & State

**`src/context/AuthContext.jsx`**
- Provider wrapper
- State: user, token, isLoading, error
- Methods: login(), logout(), refreshToken()

**`src/context/ThemeContext.jsx`**
- Provider wrapper
- State: isDarkMode
- Methods: toggleTheme()

### 3.4 Custom Hooks

**`src/hooks/useAuth.js`**
```javascript
// Returns { user, token, isAuthenticated, login, logout, role }
```

**`src/hooks/useApi.js`**
```javascript
// Wrapper around axios for common API patterns
// Handles loading, error, retry logic
```

**`src/hooks/useLocalStorage.js`**
```javascript
// Persist state to localStorage with JSON serialization
```

### 3.5 Page Components

**Student Pages:**
- **StudentDashboard.jsx:** Main hub. Fetches aggregated data from backend dashboard endpoint. Renders RiskDetectorCard, AttendanceChart, MarksChart, TodaysTimetable, RecentNotices.
- **StudentAttendanceDetail.jsx:** Subject-wise attendance breakdown in table/card format.
- **StudentMarksDetail.jsx:** Transcript-style view of all assessments and marks.
- **StudentTimetable.jsx:** Full weekly timetable view.
- **StudentNotices.jsx:** Paginated notice feed.
- **StudentAssignments.jsx:** Assignments tracker.

**Faculty Pages:**
- **FacultyDashboard.jsx:** Overview of today's schedule, quick links to "Take Attendance" and "Enter Marks".
- **FacultyTakeAttendance.jsx:** Roster with Present/Absent toggles. Saves to backend on button click.
- **FacultyEnterMarks.jsx:** Grid-like interface for bulk mark entry.
- **FacultyAssignments.jsx:** Create/manage assignments.
- **FacultyNotices.jsx:** Post notices to assigned classes.
- **FacultyMyClasses.jsx:** List of assigned classes/subjects.

**Admin Pages:**
- **AdminDashboard.jsx:** High-level stats (total students, faculty, subjects).
- **AdminUserManagement.jsx:** CRUD for students and faculty.
- **AdminCourseManagement.jsx:** Manage departments/courses.
- **AdminSubjectManagement.jsx:** Manage subjects and link to departments.
- **AdminFacultyAssignment.jsx:** Assign faculty to subjects.
- **AdminReports.jsx:** Generate attendance/marks reports.
- **AdminNoticeManagement.jsx:** Manage global notices.

### 3.6 Components

**Layout Components:**
- **RootLayout.jsx:** Wrapper with Navbar, Sidebar, and outlet for pages.
- **Navbar.jsx:** Top bar with user name, logout, theme toggle.
- **Sidebar.jsx:** Navigation links based on user role.
- **ProtectedRoute.jsx:** Wrapper to check auth before rendering page.

**Common/UI Components:**
- **Badge.jsx:** Displays status with color (e.g., "At Risk" in red).
- **Button.jsx:** Primary, secondary, danger variants. Accessible focus states.
- **Input.jsx:** Form input with label, error message, validation state.
- **Modal.jsx:** Reusable modal dialog using Radix UI or custom.
- **DataTable.jsx:** Reusable table with sticky header, pagination, sorting.
- **Card.jsx:** Container with subtle shadow and border.
- **Toast.jsx:** Notification UI (success, error, warning).
- **Spinner.jsx:** Loading indicator.
- **Skeleton.jsx:** Pulsing loader matching content shape.
- **EmptyState.jsx:** SVG + message when no data.

**Student Components:**
- **RiskDetectorCard.jsx:** Hero card with large status badge (Green/Yellow/Red), aggregated attendance % and marks %.
- **RiskDetectorDetail.jsx:** Expanded view showing per-subject breakdown and risk factors.
- **AttendanceChart.jsx:** Pie/progress chart of attendance by subject.
- **MarksChart.jsx:** Line chart of marks over time.
- **TodaysTimetable.jsx:** Mini widget showing today's classes.
- **RecentNotices.jsx:** Scrollable notice feed.

**Faculty Components:**
- **AttendanceRoster.jsx:** Table of students with Present/Absent toggles.
- **AttendanceToggle.jsx:** Single toggle button (Present <-> Absent).
- **MarksGrid.jsx:** Spreadsheet-like grid for mark entry.
- **ClassSelector.jsx:** Dropdown to pick subject and date.
- **TodaysSchedule.jsx:** Widget showing today's scheduled classes.
- **QuickActionCard.jsx:** Card with "Take Attendance" button linking to FacultyTakeAttendance page.

**Admin Components:**
- **UserTable.jsx:** Reusable table for users with action buttons (Edit, Delete).
- **CourseForm.jsx:** Form to add/edit courses/departments.
- **SubjectForm.jsx:** Form to add/edit subjects.
- **FacultyAssignmentForm.jsx:** Dropdown to assign faculty to subjects.

### 3.7 Services (API Layer)

**`src/services/api/authService.js`**
```javascript
// login(email, password) -> { token, user }
// logout()
// validateToken()
```

**`src/services/api/userService.js`**
```javascript
// getUsers(filters, page, limit)
// createUser(userData)
// updateUser(userId, updates)
// deleteUser(userId)
```

**`src/services/api/attendanceService.js`**
```javascript
// getAttendance(subjectId, date)
// submitAttendance(subjectId, date, records)
// getStudentAttendance(studentId)
```

**`src/services/api/marksService.js`**
```javascript
// getAssessments(subjectId)
// createAssessment(data)
// submitMarks(assessmentId, records)
// getStudentMarks(studentId)
```

**`src/services/api/dashboardService.js`**
```javascript
// getStudentDashboard(studentId) -> { attendance%, marks%, riskStatus, recentNotices }
// getFacultyDashboard(facultyId) -> { todaySchedule, pendingAttendance, stats }
// getAdminDashboard() -> { totalStudents, totalFaculty, pendingApprovals }
```

**`src/services/logic/riskCalculator.js`**
```javascript
// calculateRiskStatus(attendance%, marks%) -> { status: 'RED'|'YELLOW'|'GREEN', message: string }
```

### 3.8 Queries (TanStack Query Hooks)

**`src/queries/useStudentQuery.js`**
```javascript
// useStudentDashboard(studentId) - Fetches aggregated dashboard data
// useStudentAttendance(studentId) - Fetches subject-wise attendance
// useStudentMarks(studentId) - Fetches all marks
// useNotices() - Fetches applicable notices
```

**`src/queries/useFacultyQuery.js`**
```javascript
// useFacultyDashboard(facultyId)
// useAttendanceRoster(subjectId, date)
// useAssessments(subjectId)
```

**`src/queries/useAdminQuery.js`**
```javascript
// useUsers(filters, page)
// useSubjects()
// useDashboardStats()
```

### 3.9 Router Configuration

**`src/router/index.jsx`**
```javascript
// Routes structure:
// / (login page)
// /student/* (protected, role='student')
//   ├ /dashboard
//   ├ /attendance
//   ├ /marks
//   ├ /timetable
//   ├ /notices
//   └ /assignments
// /faculty/* (protected, role='faculty')
//   ├ /dashboard
//   ├ /take-attendance
//   ├ /enter-marks
//   ├ /assignments
//   ├ /notices
//   └ /my-classes
// /admin/* (protected, role='admin')
//   ├ /dashboard
//   ├ /users
//   ├ /courses
//   ├ /subjects
//   ├ /faculty-assignment
//   ├ /reports
//   └ /notices
```

---

## 4. Tailwind CSS & Design Tokens

### `tailwind.config.js`
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo-600
        surface: '#F8FAFC', // Slate-50
        'text-primary': '#0F172A', // Slate-900
        'text-secondary': '#64748B', // Slate-500
        'success': '#10B981', // Emerald-500
        'warning': '#F59E0B', // Amber-500
        'danger': '#EF4444', // Red-500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### `globals.css`
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  body {
    @apply bg-surface text-text-primary;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary transition;
  }
  .btn-secondary {
    @apply px-4 py-2 border border-slate-200 text-text-primary rounded-md hover:bg-slate-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary transition;
  }
}
```

---

## 5. Build & Development Scripts

### `package.json` (Important Scripts)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .jsx",
    "format": "prettier --write \"src/**/*.{jsx,js,css}\"",
    "type-check": "tsc --noEmit"
  }
}
```

**Run locally:**
```bash
npm run dev  # Starts at http://localhost:5173
```

---

## 6. Key Implementation Decisions

1. **State Management:** Context API + TanStack Query. No Redux for simplicity.
2. **Form Handling:** Plain React useState with Zod validation. No React Hook Form complexity unless needed.
3. **HTTP Client:** Axios with custom interceptors for JWT injection and error handling.
4. **Styling:** Tailwind CSS utilities + component classes. No CSS-in-JS.
5. **Icons:** lucide-react for lightweight SVG icons.
6. **Charts:** Recharts for simple attendance/marks visualizations.
7. **Code Splitting:** Lazy load role-specific pages using React.lazy() and Suspense.

---

## 7. Component Development Checklist

### Phase 1: Foundation (Week 1)
- [ ] Setup Vite project and install dependencies
- [ ] Configure Tailwind CSS
- [ ] Setup Auth context and login flow
- [ ] Create common/UI components (Button, Input, Card, Modal, DataTable)
- [ ] Create layout components (Navbar, Sidebar, ProtectedRoute)

### Phase 2: Student Portal (Week 2)
- [ ] Create student pages structure
- [ ] Build RiskDetectorCard and detail views
- [ ] Build attendance and marks detail pages
- [ ] Integrate TanStack Query for data fetching
- [ ] Implement StudentDashboard

### Phase 3: Faculty Portal (Week 2)
- [ ] Create faculty pages structure
- [ ] Build attendance roster and mark entry
- [ ] Implement quick action cards
- [ ] Integrate faculty dashboard

### Phase 4: Admin Portal (Week 3)
- [ ] Create admin pages structure
- [ ] Build user management table
- [ ] Build course/subject management forms
- [ ] Implement admin dashboard and reports

### Phase 5: Polish & QA (Week 3)
- [ ] Add error boundaries
- [ ] Implement toast notifications
- [ ] Add skeleton loaders
- [ ] Test all role workflows
- [ ] Accessibility review

---

## 8. Performance Optimization Tips

1. **Code Splitting:** Use React.lazy() for role-specific page bundles.
2. **Image Optimization:** Compress SVGs and PNGs; use next-gen formats.
3. **Query Caching:** TanStack Query automatically caches and deduplicates requests.
4. **Memoization:** Use React.memo for heavy components passed as children.
5. **Debouncing:** Debounce search inputs to reduce API calls.

---

## 9. Testing Strategy

- **Unit Tests:** Jest + React Testing Library for components and utilities.
- **Integration Tests:** Test user flows (Login → Dashboard → Attendance).
- **E2E Tests:** Playwright or Cypress for critical paths.

**Test File Structure:**
```
src/__tests__/
├── components/
│   ├── RiskDetectorCard.test.jsx
│   └── Button.test.jsx
├── services/
│   └── riskCalculator.test.js
└── pages/
    └── StudentDashboard.test.jsx
```

---

## 10. Deployment Checklist

- [ ] Build passes with `npm run build`
- [ ] Environment variables validated
- [ ] API base URL points to backend
- [ ] Error pages (404, 500) implemented
- [ ] Performance audited (Lighthouse)
- [ ] Accessibility checked (WCAG AA)
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verified

---

**Next Step:** Proceed with Backend Implementation Plan.
