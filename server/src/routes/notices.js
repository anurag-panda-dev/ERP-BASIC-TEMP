import { Router } from 'express';
import * as noticeController from '../controllers/noticeController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import {
  createNoticeSchema,
  updateNoticeSchema,
} from '../schemas/noticeSchemas.js';

const router = Router();

// Public routes
router.get('/', noticeController.getNotices);
router.get('/:noticeId', noticeController.getNoticeById);

// Protected routes
router.use(requireAuth);

// Create notice - Admin and Faculty
router.post(
  '/',
  requireRole(['admin', 'faculty']),
  validateBody(createNoticeSchema),
  noticeController.createNotice
);

// Update notice - Admin and Notice author
router.put(
  '/:noticeId',
  requireRole(['admin', 'faculty']),
  validateBody(updateNoticeSchema),
  noticeController.updateNotice
);

// Delete notice - Admin and Notice author
router.delete(
  '/:noticeId',
  requireRole(['admin', 'faculty']),
  noticeController.deleteNotice
);

export default router;
