import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const showtimesService = {
  async getShowtimeById(showtimeId) {
    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
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
      throw new Error('Showtime not found');
    }

    // Get all booked seats
    const bookedSeats = showtime.bookings.flatMap(booking =>
      JSON.parse(booking.seats)
    );

    const { bookings, ...showtimeData } = showtime;
    return {
      ...showtimeData,
      bookedSeats,
    };
  },
};
