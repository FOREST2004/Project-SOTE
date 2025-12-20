import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get showtime details with booked seats
router.get('/:id', async (req, res) => {
  try {
    const showtime = await prisma.showtime.findUnique({
      where: { id: req.params.id },
      include: {
        movie: true,
        room: true,
        bookings: {
          where: {
            status: 'CONFIRMED',
          },
          select: {
            seats: true,
          },
        },
      },
    });

    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    // Get all booked seats
    const bookedSeats = showtime.bookings.flatMap(booking =>
      JSON.parse(booking.seats)
    );

    res.json({
      ...showtime,
      bookedSeats,
      bookings: undefined,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch showtime' });
  }
});

export default router;
