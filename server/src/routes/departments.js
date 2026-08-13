import { Router } from 'express';
import * as departmentController from '../controllers/departmentController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from '../schemas/userSchemas.js';

const router = Router();

// Public routes
router.get('/', departmentController.getDepartments);
router.get('/:departmentId', departmentController.getDepartmentById);

// Admin routes (require authentication and admin role)
router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  validateBody(createDepartmentSchema),
  departmentController.createDepartment
);
router.put(
  '/:departmentId',
  requireAuth,
  requireRole(['admin']),
  validateBody(updateDepartmentSchema),
  departmentController.updateDepartment
);
router.delete(
  '/:departmentId',
  requireAuth,
  requireRole(['admin']),
  departmentController.deleteDepartment
);

export default router;
