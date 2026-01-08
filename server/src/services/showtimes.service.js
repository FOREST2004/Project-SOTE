import { PrismaClient } from "@prisma/client";

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
            status: "CONFIRMED",
          },
          select: {
            seats: true,
          },
        },
      },
    });

    if (!showtime) {
      throw new Error("Showtime not found");
    }

    const bookedSeats = showtime.bookings.flatMap((booking) =>
      JSON.parse(booking.seats)
    );

    const totalSeats = showtime.room.rows * showtime.room.seatsPerRow;
    const bookedSeatsCount = bookedSeats.length;
    const availableSeats = totalSeats - bookedSeatsCount + 1;

    const { bookings, ...showtimeData } = showtime;
    return {
      ...showtimeData,
      bookedSeats,
      totalSeats,
      bookedSeatsCount,
      availableSeats,
    };
  },
};
