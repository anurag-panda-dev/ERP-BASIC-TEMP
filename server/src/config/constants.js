export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

export const RISK_THRESHOLDS = {
  RED: {
    attendance: 0.6,
    marks: 0.4,
  },
  YELLOW: {
    attendance: 0.75,
    marks: 0.6,
  },
  GREEN: {
    attendance: 1.0,
    marks: 1.0,
  },
};

export const ATTENDANCE_THRESHOLD = 0.75;

export const ASSESSMENT_TYPES = {
  INTERNAL: 'internal',
  ASSIGNMENT: 'assignment',
  EXAM: 'exam',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
};

export const NOTICE_AUDIENCE = {
  GLOBAL: 'global',
  CLASS: 'class',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  INVALID_INPUT: 'Invalid input provided',
  DUPLICATE_ENTRY: 'Entry already exists',
  DATABASE_ERROR: 'Database error occurred',
  VALIDATION_ERROR: 'Validation failed',
};

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
