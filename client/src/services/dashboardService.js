import api from '../config/api.js';
import { API_ENDPOINTS } from '../config/constants.js';

export const getStudentDashboard = (studentId) =>
  api.get(API_ENDPOINTS.DASHBOARD_STUDENT(studentId)).then((r) => r.data?.data ?? r.data);

export const getStudentRiskStatus = (studentId) =>
  api.get(API_ENDPOINTS.DASHBOARD_RISK(studentId)).then((r) => r.data?.data ?? r.data);

export const getFacultyDashboard = () =>
  api.get(API_ENDPOINTS.DASHBOARD_FACULTY).then((r) => r.data?.data ?? r.data);

export const getAdminDashboard = () =>
  api.get(API_ENDPOINTS.DASHBOARD_ADMIN).then((r) => r.data?.data ?? r.data);
