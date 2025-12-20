import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { bookingsController } from '../controllers/bookings.controller.js';

const router = express.Router();

// Create booking
router.post('/', authMiddleware, bookingsController.createBooking);

// Get user bookings
router.get('/', authMiddleware, bookingsController.getUserBookings);

// Cancel booking
router.delete('/:id', authMiddleware, bookingsController.cancelBooking);

export default router;
