import { Router } from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { submitAttendanceSchema } from '../schemas/attendanceSchemas.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get attendance records
router.get('/', attendanceController.getAttendance);
router.get('/subject/:subjectId', attendanceController.getSubjectAttendance);

// Get student attendance
router.get('/student/:studentId', attendanceController.getStudentAttendance);
router.get('/student/:studentId/range', attendanceController.getAttendanceByDateRange);

// Faculty routes - submit attendance
router.post(
  '/',
  requireRole(['faculty']),
  validateBody(submitAttendanceSchema),
  attendanceController.submitAttendance
);

export default router;
