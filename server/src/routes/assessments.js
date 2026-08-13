import { Router } from 'express';
import * as assessmentController from '../controllers/assessmentController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import {
  createAssessmentSchema,
  updateAssessmentSchema,
  submitMarksSchema,
} from '../schemas/assessmentSchemas.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get assessments
router.get('/', assessmentController.getAssessments);
router.get('/:assessmentId', assessmentController.getAssessmentById);

// Get student marks
router.get('/student/:studentId/marks', assessmentController.getStudentMarks);

// Faculty routes - create and manage assessments
router.post(
  '/',
  requireRole(['faculty']),
  validateBody(createAssessmentSchema),
  assessmentController.createAssessment
);
router.put(
  '/:assessmentId',
  requireRole(['faculty']),
  validateBody(updateAssessmentSchema),
  assessmentController.updateAssessment
);
router.delete(
  '/:assessmentId',
  requireRole(['faculty']),
  assessmentController.deleteAssessment
);

// Submit marks
router.post(
  '/:assessmentId/marks',
  requireRole(['faculty']),
  validateBody(submitMarksSchema),
  assessmentController.submitMarks
);

// Publish assessment
router.patch(
  '/:assessmentId/publish',
  requireRole(['faculty']),
  assessmentController.publishAssessment
);

export default router;
