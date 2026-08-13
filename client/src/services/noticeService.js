import api from '../config/api.js';
import { API_ENDPOINTS } from '../config/constants.js';

export const getNotices = (params = {}) =>
  api.get(API_ENDPOINTS.NOTICES, { params }).then((r) => r.data);

export const getNoticeById = (id) =>
  api.get(API_ENDPOINTS.NOTICE_BY_ID(id)).then((r) => r.data?.data ?? r.data);

export const createNotice = (data) =>
  api.post(API_ENDPOINTS.NOTICES, data).then((r) => r.data?.data ?? r.data);

export const updateNotice = (id, data) =>
  api.put(API_ENDPOINTS.NOTICE_BY_ID(id), data).then((r) => r.data?.data ?? r.data);

export const deleteNotice = (id) =>
  api.delete(API_ENDPOINTS.NOTICE_BY_ID(id)).then((r) => r.data);
