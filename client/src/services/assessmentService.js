import api from '../config/api.js';
import { API_ENDPOINTS } from '../config/constants.js';

export const getAssessments = (params = {}) =>
  api.get(API_ENDPOINTS.ASSESSMENTS, { params }).then((r) => r.data);

export const getAssessmentById = (id) =>
  api.get(API_ENDPOINTS.ASSESSMENT_BY_ID(id)).then((r) => r.data?.data ?? r.data);

export const getStudentMarks = (studentId) =>
  api.get(API_ENDPOINTS.STUDENT_MARKS(studentId)).then((r) => r.data);

export const createAssessment = (data) =>
  api.post(API_ENDPOINTS.ASSESSMENTS, data).then((r) => r.data?.data ?? r.data);

export const updateAssessment = (id, data) =>
  api.put(API_ENDPOINTS.ASSESSMENT_BY_ID(id), data).then((r) => r.data?.data ?? r.data);

export const deleteAssessment = (id) =>
  api.delete(API_ENDPOINTS.ASSESSMENT_BY_ID(id)).then((r) => r.data);

/**
 * Submit marks for an assessment.
 * @param {string} assessmentId
 * @param {Array<{studentId: string, marksObtained: number}>} records
 */
export const submitMarks = (assessmentId, records) =>
  api.post(API_ENDPOINTS.ASSESSMENT_MARKS(assessmentId), { records }).then((r) => r.data);

export const publishAssessment = (id) =>
  api.patch(API_ENDPOINTS.ASSESSMENT_PUBLISH(id)).then((r) => r.data?.data ?? r.data);
