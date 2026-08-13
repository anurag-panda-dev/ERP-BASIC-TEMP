import { Router } from 'express';
import * as subjectController from '../controllers/subjectController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import {
  createSubjectSchema,
  updateSubjectSchema,
  enrollStudentSchema,
  assignFacultySchema,
} from '../schemas/subjectSchemas.js';

const router = Router();

// Public routes
router.get('/', subjectController.getSubjects);
router.get('/:subjectId', subjectController.getSubjectById);

// Admin routes
router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  validateBody(createSubjectSchema),
  subjectController.createSubject
);
router.put(
  '/:subjectId',
  requireAuth,
  requireRole(['admin']),
  validateBody(updateSubjectSchema),
  subjectController.updateSubject
);
router.delete(
  '/:subjectId',
  requireAuth,
  requireRole(['admin']),
  subjectController.deleteSubject
);

// Enrollment routes
router.post(
  '/:subjectId/enroll',
  requireAuth,
  requireRole(['admin']),
  validateBody(enrollStudentSchema),
  subjectController.enrollStudents
);
router.delete(
  '/:subjectId/student/:studentId',
  requireAuth,
  requireRole(['admin']),
  subjectController.removeStudent
);

// Faculty assignment
router.post(
  '/:subjectId/assign-faculty',
  requireAuth,
  requireRole(['admin']),
  validateBody(assignFacultySchema),
  subjectController.assignFaculty
);

export default router;
