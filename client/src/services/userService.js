import api from '../config/api.js';
import { API_ENDPOINTS } from '../config/constants.js';

export const getUsers = (params = {}) =>
  api.get(API_ENDPOINTS.USERS, { params }).then((r) => r.data);

export const getUserById = (id) =>
  api.get(API_ENDPOINTS.USER_BY_ID(id)).then((r) => r.data?.data ?? r.data);

export const getUsersByRole = (role) =>
  api.get(API_ENDPOINTS.USERS_BY_ROLE(role)).then((r) => r.data);

export const createUser = (data) =>
  api.post(API_ENDPOINTS.USERS, data).then((r) => r.data?.data ?? r.data);

export const updateUser = (id, data) =>
  api.put(API_ENDPOINTS.USER_BY_ID(id), data).then((r) => r.data?.data ?? r.data);

export const deleteUser = (id) =>
  api.delete(API_ENDPOINTS.USER_BY_ID(id)).then((r) => r.data);
