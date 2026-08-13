import api from '../config/api.js';
import { API_ENDPOINTS } from '../config/constants.js';

export const getAttendance = (params = {}) =>
  api.get(API_ENDPOINTS.ATTENDANCE, { params }).then((r) => r.data);

export const getSubjectAttendance = (subjectId, params = {}) =>
  api.get(API_ENDPOINTS.ATTENDANCE_SUBJECT(subjectId), { params }).then((r) => r.data);

export const getStudentAttendance = (studentId, params = {}) =>
  api.get(API_ENDPOINTS.ATTENDANCE_STUDENT(studentId), { params }).then((r) => r.data);

/**
 * Submit attendance for a subject on a specific date.
 * @param {string} subjectId
 * @param {string} date - ISO date string
 * @param {Array<{studentId: string, status: 'Present'|'Absent'}>} records
 */
export const submitAttendance = ({ subjectId, date, records }) =>
  api.post(API_ENDPOINTS.ATTENDANCE, { subjectId, date, records }).then((r) => r.data);
