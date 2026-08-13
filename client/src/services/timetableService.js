import api from '../config/api.js';
import { API_ENDPOINTS } from '../config/constants.js';

export const getTimetables = (params = {}) =>
  api.get(API_ENDPOINTS.TIMETABLES, { params }).then((r) => r.data);

export const getTodaysTimetable = () =>
  api.get(API_ENDPOINTS.TIMETABLE_TODAY).then((r) => r.data);

export const getSubjectTimetable = (subjectId) =>
  api.get(API_ENDPOINTS.TIMETABLE_SUBJECT(subjectId)).then((r) => r.data);

export const createTimetable = (data) =>
  api.post(API_ENDPOINTS.TIMETABLES, data).then((r) => r.data?.data ?? r.data);

export const updateTimetable = (id, data) =>
  api.put(`/api/timetables/${id}`, data).then((r) => r.data?.data ?? r.data);

export const deleteTimetable = (id) =>
  api.delete(`/api/timetables/${id}`).then((r) => r.data);
