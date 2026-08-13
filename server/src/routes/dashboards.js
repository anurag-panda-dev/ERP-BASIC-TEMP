import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Student dashboard
router.get('/student/:studentId', dashboardController.getStudentDashboard);
router.get('/student/:studentId/risk', dashboardController.getRiskStatus);

// Faculty dashboard
router.get('/faculty', requireRole(['faculty']), dashboardController.getFacultyDashboard);

// Admin dashboard
router.get('/admin', requireRole(['admin']), dashboardController.getAdminDashboard);

export default router;
