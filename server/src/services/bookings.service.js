import { PrismaClient } from "@prisma/client";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  ConflictError,
} from "../utils/errors.js";

const prisma = new PrismaClient();

export const bookingsService = {
  async createBooking(userId, showtimeId, seats) {
    if (!seats || seats.length === 0) {
      throw new BadRequestError("At least one seat is required");
    }

    const seatRegex = /^[A-Z]\d+$/;
    const invalidFormatSeats = seats.filter((seat) => !seatRegex.test(seat));
    if (invalidFormatSeats.length > 0) {
      throw new BadRequestError(
        `Invalid seat format: ${invalidFormatSeats.join(", ")}`
      );
    }

    const uniqueSeats = new Set(seats);
    if (uniqueSeats.size !== seats.length) {
      throw new BadRequestError("Duplicate seats in request");
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        room: true,
        bookings: {
          where: { status: "CONFIRMED" },
          select: { seats: true },
        },
      },
    });

    if (!showtime) {
      throw new NotFoundError("Showtime");
    }

    if (new Date(showtime.startTime) < new Date()) {
      throw new BadRequestError("Cannot book seats for past showtimes");
    }

    const bookedSeats = showtime.bookings.flatMap((b) => JSON.parse(b.seats));

    const conflictSeats = seats.filter((seat) => bookedSeats.includes(seat));
    if (conflictSeats.length > 0) {
      throw new ConflictError(
        `Seats already booked: ${conflictSeats.join(", ")}`
      );
    }

    const totalSeats = showtime.room.rows * showtime.room.seatsPerRow;
    const invalidSeats = seats.filter((seat) => {
      const row = seat.charAt(0);
      const seatNum = parseInt(seat.substring(1));
      const rowIndex = row.charCodeAt(0) - 65;
      return (
        rowIndex >= showtime.room.rows ||
        seatNum > showtime.room.seatsPerRow ||
        seatNum < 1
      );
    });

    if (invalidSeats.length > 0) {
      throw new BadRequestError(
        `Invalid seats for this room: ${invalidSeats.join(", ")}`
      );
    }

    const totalPrice = showtime.price * seats.length;

    const booking = await prisma.booking.create({
      data: {
        userId,
        showtimeId,
        seats: JSON.stringify(seats),
        totalPrice,
        status: "CONFIRMED",
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
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        showtime: {
          include: {
            movie: true,
            room: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return bookings;
  },

  async cancelBooking(bookingId, userId) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        showtime: true,
      },
    });

    if (!booking) {
      throw new NotFoundError("Booking");
    }

    if (booking.status === "CANCELLED") {
      throw new BadRequestError("Booking is already cancelled");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError("You can only cancel your own bookings");
    }

    if (new Date(booking.showtime.startTime) < new Date()) {
      throw new BadRequestError("Cannot cancel bookings for past showtimes");
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    return { message: "Booking cancelled successfully" };
  },
};
