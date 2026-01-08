import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../utils/errors.js";

const prisma = new PrismaClient();

export const adminService = {
  async getRevenue() {
    const bookings = await prisma.booking.findMany({
      where: { status: "CONFIRMED" },
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

    const revenueByMovie = {};
    bookings.forEach((booking) => {
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

    return {
      totalRevenue,
      totalBookings,
      byMovie: Object.values(revenueByMovie),
    };
  },

  async getAllMovies() {
    return await prisma.movie.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async createMovie(movieData) {
    if (!movieData.title || movieData.title.trim() === "") {
      throw new BadRequestError("Title is required");
    }

    if (!movieData.description || movieData.description.trim() === "") {
      throw new BadRequestError("Description is required");
    }

    if (!movieData.genre || movieData.genre.trim() === "") {
      throw new BadRequestError("Genre is required");
    }

    const movieDataWithDate = {
      ...movieData,
      releaseDate: new Date(movieData.releaseDate),
    };

    return await prisma.movie.create({
      data: movieDataWithDate,
    });
  },

  async updateMovie(movieId, movieData) {
    return await prisma.movie.update({
      where: { id: movieId },
      data: movieData,
    });
  },

  async deleteMovie(movieId) {
    await prisma.movie.delete({
      where: { id: movieId },
    });
    return { message: "Movie deleted" };
  },

  async getAllRooms() {
    return await prisma.room.findMany();
  },

  async createRoom(roomData) {
    return await prisma.room.create({
      data: roomData,
    });
  },

  async updateRoom(roomId, roomData) {
    return await prisma.room.update({
      where: { id: roomId },
      data: roomData,
    });
  },

  async getAllShowtimes() {
    return await prisma.showtime.findMany({
      include: {
        movie: true,
        room: true,
      },
      orderBy: { startTime: "desc" },
    });
  },

  async createShowtime(showtimeData) {
    return await prisma.showtime.create({
      data: showtimeData,
      include: {
        movie: true,
        room: true,
      },
    });
  },

  async deleteShowtime(showtimeId) {
    await prisma.showtime.delete({
      where: { id: showtimeId },
    });
    return { message: "Showtime deleted" };
  },
};
