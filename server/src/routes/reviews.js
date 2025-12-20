import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { reviewsController } from '../controllers/reviews.controller.js';

const router = express.Router();

// Create or update review
router.post('/', authMiddleware, reviewsController.createOrUpdateReview);

// Get reviews for a movie
router.get('/movie/:movieId', reviewsController.getReviewsByMovie);

export default router;
