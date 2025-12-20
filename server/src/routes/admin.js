import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get revenue reports
router.get('/revenue', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { status: 'CONFIRMED' },
      include: {
        showtime: {
          include: {
            movie: true,
          },
        },
      },
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalBookings = bookings.length;

    // Group by movie
    const revenueByMovie = {};
    bookings.forEach(booking => {
      const movieTitle = booking.showtime.movie.title;
      if (!revenueByMovie[movieTitle]) {
        revenueByMovie[movieTitle] = {
          title: movieTitle,
          revenue: 0,
          bookings: 0,
        };
      }
      revenueByMovie[movieTitle].revenue += booking.totalPrice;
      revenueByMovie[movieTitle].bookings += 1;
    });

    res.json({
      totalRevenue,
      totalBookings,
      byMovie: Object.values(revenueByMovie),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

// Manage Movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

router.post('/movies', async (req, res) => {
  try {
    const movie = await prisma.movie.create({
      data: req.body,
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create movie' });
  }
});

router.put('/movies/:id', async (req, res) => {
  try {
    const movie = await prisma.movie.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

router.delete('/movies/:id', async (req, res) => {
  try {
    await prisma.movie.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

// Manage Rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

router.post('/rooms', async (req, res) => {
  try {
    const room = await prisma.room.create({
      data: req.body,
    });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.put('/rooms/:id', async (req, res) => {
  try {
    const room = await prisma.room.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// Manage Showtimes
router.get('/showtimes', async (req, res) => {
  try {
    const showtimes = await prisma.showtime.findMany({
      include: {
        movie: true,
        room: true,
      },
      orderBy: { startTime: 'desc' },
    });
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch showtimes' });
  }
});

router.post('/showtimes', async (req, res) => {
  try {
    const showtime = await prisma.showtime.create({
      data: req.body,
      include: {
        movie: true,
        room: true,
      },
    });
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create showtime' });
  }
});

router.delete('/showtimes/:id', async (req, res) => {
  try {
    await prisma.showtime.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Showtime deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete showtime' });
  }
});

export default router;
