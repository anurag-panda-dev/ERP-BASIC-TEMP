import api from '../config/api.js';
import { API_ENDPOINTS } from '../config/constants.js';

export const getSubjects = (params = {}) =>
  api.get(API_ENDPOINTS.SUBJECTS, { params }).then((r) => r.data);

export const getSubjectById = (id) =>
  api.get(API_ENDPOINTS.SUBJECT_BY_ID(id)).then((r) => r.data?.data ?? r.data);

export const createSubject = (data) =>
  api.post(API_ENDPOINTS.SUBJECTS, data).then((r) => r.data?.data ?? r.data);

export const updateSubject = (id, data) =>
  api.put(API_ENDPOINTS.SUBJECT_BY_ID(id), data).then((r) => r.data?.data ?? r.data);

export const deleteSubject = (id) =>
  api.delete(API_ENDPOINTS.SUBJECT_BY_ID(id)).then((r) => r.data);

export const enrollStudents = (subjectId, studentIds) =>
  api.post(API_ENDPOINTS.SUBJECT_ENROLL(subjectId), { studentIds }).then((r) => r.data?.data ?? r.data);

export const assignFaculty = (subjectId, facultyId) =>
  api.post(API_ENDPOINTS.SUBJECT_ASSIGN(subjectId), { facultyId }).then((r) => r.data?.data ?? r.data);
