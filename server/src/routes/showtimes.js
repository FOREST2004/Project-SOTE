import express from 'express';
import { showtimesController } from '../controllers/showtimes.controller.js';

const router = express.Router();

// Get showtime details with booked seats
router.get('/:id', showtimesController.getShowtimeById);

export default router;
