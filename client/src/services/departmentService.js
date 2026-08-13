import api from '../config/api.js';
import { API_ENDPOINTS } from '../config/constants.js';

export const getDepartments = (params = {}) =>
  api.get(API_ENDPOINTS.DEPARTMENTS, { params }).then((r) => r.data);

export const getDepartmentById = (id) =>
  api.get(API_ENDPOINTS.DEPARTMENT_BY_ID(id)).then((r) => r.data?.data ?? r.data);

export const createDepartment = (data) =>
  api.post(API_ENDPOINTS.DEPARTMENTS, data).then((r) => r.data?.data ?? r.data);

export const updateDepartment = (id, data) =>
  api.put(API_ENDPOINTS.DEPARTMENT_BY_ID(id), data).then((r) => r.data?.data ?? r.data);

export const deleteDepartment = (id) =>
  api.delete(API_ENDPOINTS.DEPARTMENT_BY_ID(id)).then((r) => r.data);
