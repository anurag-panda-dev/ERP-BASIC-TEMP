import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', authController.registerUser);
router.get('/health', authController.healthCheck);

// Protected routes
router.get('/me', requireAuth, authController.getCurrentUser);
router.put('/profile', requireAuth, authController.updateProfile);

export default router;
