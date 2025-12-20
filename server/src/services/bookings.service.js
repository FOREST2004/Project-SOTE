import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const bookingsService = {
  async createBooking(userId, showtimeId, seats) {
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
      throw new Error('Showtime not found');
    }

    // Check if seats are available
    const bookedSeats = showtime.bookings.flatMap(b => JSON.parse(b.seats));
    const hasConflict = seats.some(seat => bookedSeats.includes(seat));

    if (hasConflict) {
      throw new Error('Some seats are already booked');
    }

    // Create booking
    const totalPrice = showtime.price * seats.length;
    const booking = await prisma.booking.create({
      data: {
        userId,
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

    return booking;
  },

  async getUserBookings(userId) {
    return await prisma.booking.findMany({
      where: { userId },
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
  },

  async cancelBooking(bookingId, userId) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    return { message: 'Booking cancelled successfully' };
  },
};
