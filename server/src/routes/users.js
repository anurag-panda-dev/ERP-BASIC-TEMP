import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import {
  createUserSchema,
  updateUserSchema,
} from '../schemas/userSchemas.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Admin routes
router.get('/', requireRole(['admin']), userController.getAllUsers);
router.post('/', requireRole(['admin']), validateBody(createUserSchema), userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', validateBody(updateUserSchema), userController.updateUser);
router.delete('/:id', requireRole(['admin']), userController.deleteUser);

// Role-specific routes
router.get('/role/:role', userController.getUsersByRole);
router.post('/:studentId/enroll', requireRole(['admin']), userController.enrollStudentInDepartment);
router.post('/:facultyId/assign-faculty', requireRole(['admin']), userController.assignFacultyRole);

export default router;
