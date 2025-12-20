import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Create booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;

    // Get showtime and check availability
    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        bookings: {
          where: { status: 'CONFIRMED' },
          select: { seats: true },
        },
      },
    });

    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    // Check if seats are available
    const bookedSeats = showtime.bookings.flatMap(b => JSON.parse(b.seats));
    const hasConflict = seats.some(seat => bookedSeats.includes(seat));

    if (hasConflict) {
      return res.status(400).json({ error: 'Some seats are already booked' });
    }

    // Create booking
    const totalPrice = showtime.price * seats.length;
    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        showtimeId,
        seats: JSON.stringify(seats),
        totalPrice,
        status: 'CONFIRMED',
      },
      include: {
        showtime: {
          include: {
            movie: true,
            room: true,
          },
        },
      },
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Booking failed' });
  }
});

// Get user bookings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        showtime: {
          include: {
            movie: true,
            room: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Cancel booking
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
