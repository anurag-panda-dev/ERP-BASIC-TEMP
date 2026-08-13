// ── Role Constants ───────────────────────────────────────────
export const ROLES = {
  ADMIN:   'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

// ── Risk Status ──────────────────────────────────────────────
export const RISK_STATUS = {
  GREEN:  'GREEN',
  YELLOW: 'YELLOW',
  RED:    'RED',
};

export const RISK_THRESHOLDS = {
  GREEN_ATTENDANCE:  75,
  GREEN_MARKS:       60,
  YELLOW_ATTENDANCE: 60,
  YELLOW_MARKS:      40,
};

// ── Risk Display Config ──────────────────────────────────────
export const RISK_CONFIG = {
  GREEN: {
    label:      'Good Standing',
    color:      '#10B981',
    bg:         '#ECFDF5',
    border:     '#6EE7B7',
    textClass:  'text-emerald-700',
    bgClass:    'bg-emerald-50',
    borderClass:'border-emerald-200',
    badgeClass: 'badge-green',
  },
  YELLOW: {
    label:      'Needs Improvement',
    color:      '#F59E0B',
    bg:         '#FFFBEB',
    border:     '#FCD34D',
    textClass:  'text-amber-700',
    bgClass:    'bg-amber-50',
    borderClass:'border-amber-200',
    badgeClass: 'badge-yellow',
  },
  RED: {
    label:      'At Risk',
    color:      '#EF4444',
    bg:         '#FEF2F2',
    border:     '#FCA5A5',
    textClass:  'text-red-700',
    bgClass:    'bg-red-50',
    borderClass:'border-red-200',
    badgeClass: 'badge-red',
  },
};

// ── API Endpoints ────────────────────────────────────────────
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER:   '/api/auth/register',
  AUTH_ME:         '/api/auth/me',
  AUTH_PROFILE:    '/api/auth/profile',
  AUTH_HEALTH:     '/api/auth/health',

  // Users
  USERS:           '/api/users',
  USER_BY_ID:      (id) => `/api/users/${id}`,
  USERS_BY_ROLE:   (role) => `/api/users/role/${role}`,

  // Departments
  DEPARTMENTS:     '/api/departments',
  DEPARTMENT_BY_ID:(id) => `/api/departments/${id}`,

  // Subjects
  SUBJECTS:        '/api/subjects',
  SUBJECT_BY_ID:   (id) => `/api/subjects/${id}`,
  SUBJECT_ENROLL:  (id) => `/api/subjects/${id}/enroll`,
  SUBJECT_ASSIGN:  (id) => `/api/subjects/${id}/assign-faculty`,

  // Attendance
  ATTENDANCE:      '/api/attendance',
  ATTENDANCE_SUBJECT: (id) => `/api/attendance/subject/${id}`,
  ATTENDANCE_STUDENT: (id) => `/api/attendance/student/${id}`,

  // Assessments
  ASSESSMENTS:     '/api/assessments',
  ASSESSMENT_BY_ID:(id) => `/api/assessments/${id}`,
  ASSESSMENT_MARKS:(id) => `/api/assessments/${id}/marks`,
  ASSESSMENT_PUBLISH:(id) => `/api/assessments/${id}/publish`,
  STUDENT_MARKS:   (id) => `/api/assessments/student/${id}/marks`,

  // Dashboard
  DASHBOARD_STUDENT:(id) => `/api/dashboard/student/${id}`,
  DASHBOARD_RISK:   (id) => `/api/dashboard/student/${id}/risk`,
  DASHBOARD_FACULTY:'/api/dashboard/faculty',
  DASHBOARD_ADMIN:  '/api/dashboard/admin',

  // Notices
  NOTICES:         '/api/notices',
  NOTICE_BY_ID:    (id) => `/api/notices/${id}`,

  // Timetables
  TIMETABLES:      '/api/timetables',
  TIMETABLE_TODAY: '/api/timetables/today',
  TIMETABLE_SUBJECT:(id) => `/api/timetables/subject/${id}`,
};

// ── Pagination ────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
};

// ── Assessment Types ──────────────────────────────────────────
export const ASSESSMENT_TYPES = [
  { value: 'internal',   label: 'Internal Exam' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'quiz',       label: 'Quiz' },
  { value: 'midterm',    label: 'Midterm' },
  { value: 'project',    label: 'Project' },
];

// ── Days of Week ──────────────────────────────────────────────
export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];
