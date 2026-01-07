import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { authController } from '../controllers/auth.controller.js';

const router = express.Router();

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user
router.get('/me', authMiddleware, authController.getMe);

// Update profile
router.put('/profile', authMiddleware, authController.updateProfile);

export default router;
