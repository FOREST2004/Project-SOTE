import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Create or update review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;

    const review = await prisma.review.upsert({
      where: {
        userId_movieId: {
          userId: req.user.id,
          movieId,
        },
      },
      update: { rating, comment },
      create: {
        userId: req.user.id,
        movieId,
        rating,
        comment,
      },
      include: {
        user: {
          select: { fullName: true },
        },
      },
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { movieId: req.params.movieId },
      include: {
        user: {
          select: { fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

export default router;
