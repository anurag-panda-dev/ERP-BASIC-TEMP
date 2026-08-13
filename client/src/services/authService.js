import api from '../config/api.js';
import { API_ENDPOINTS } from '../config/constants.js';

export const registerUser = (data) =>
  api.post(API_ENDPOINTS.AUTH_REGISTER, data).then((r) => r.data);

export const getCurrentUser = () =>
  api.get(API_ENDPOINTS.AUTH_ME).then((r) => r.data?.data ?? r.data);

export const updateProfile = (data) =>
  api.put(API_ENDPOINTS.AUTH_PROFILE, data).then((r) => r.data?.data ?? r.data);
