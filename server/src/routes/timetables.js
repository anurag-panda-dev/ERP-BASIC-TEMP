import { Router } from 'express';
import * as timetableController from '../controllers/timetableController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', timetableController.getTimetable);
router.get('/:timetableId', timetableController.getTimetableById);
router.get('/subject/:subjectId', timetableController.getTimetableBySubject);
router.get('/today/:subjectId', timetableController.getTodaysTimetable);
router.get('/today', timetableController.getTodaysTimetable);

// Admin routes
router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  timetableController.createTimetable
);
router.put(
  '/:timetableId',
  requireAuth,
  requireRole(['admin']),
  timetableController.updateTimetable
);
router.delete(
  '/:timetableId',
  requireAuth,
  requireRole(['admin']),
  timetableController.deleteTimetable
);

export default router;
