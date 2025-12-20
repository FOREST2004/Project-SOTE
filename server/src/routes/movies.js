import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all movies
router.get('/', async (req, res) => {
  try {
    const { search, genre } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (genre) {
      where.genre = genre;
    }

    const movies = await prisma.movie.findMany({
      where,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        showtimes: {
          where: {
            startTime: {
              gte: new Date(),
            },
          },
          select: {
            id: true,
            startTime: true,
            price: true,
          },
        },
      },
      orderBy: { releaseDate: 'desc' },
    });

    // Calculate average rating
    const moviesWithRating = movies.map(movie => {
      const avgRating = movie.reviews.length > 0
        ? movie.reviews.reduce((sum, r) => sum + r.rating, 0) / movie.reviews.length
        : 0;

      const { reviews, ...movieData } = movie;
      return {
        ...movieData,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length,
      };
    });

    res.json(moviesWithRating);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: req.params.id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        showtimes: {
          where: {
            startTime: {
              gte: new Date(),
            },
          },
          include: {
            room: true,
          },
          orderBy: { startTime: 'asc' },
        },
      },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

export default router;
