import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const moviesService = {
  async getAllMovies(search, genre, sortBy) {
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (genre) {
      where.genre = genre;
    }

    let orderBy = { releaseDate: "desc" };

    if (sortBy === "title-asc") {
      orderBy = { title: "asc" };
    } else if (sortBy === "title-desc") {
      orderBy = { title: "desc" };
    } else if (sortBy === "release-newest") {
      orderBy = { releaseDate: "desc" };
    } else if (sortBy === "release-oldest") {
      orderBy = { releaseDate: "asc" };
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
      orderBy,
    });

    let processedMovies = movies.map((movie) => {
      const avgRating =
        movie.reviews.length > 0
          ? movie.reviews.reduce((sum, r) => sum + r.rating, 0) /
            movie.reviews.length
          : 0;

      const { reviews, ...movieData } = movie;
      return {
        ...movieData,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length,
      };
    });

    if (sortBy === "rating-highest") {
      processedMovies.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "rating-lowest") {
      processedMovies.sort((a, b) => a.rating - b.rating);
    }

    return processedMovies;
  },

  async getMovieById(movieId) {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        showtimes: {
          where: {
            startTime: {
              gte: new Date(),
            },
          },
          include: {
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
          orderBy: { startTime: "asc" },
        },
      },
    });

    if (!movie) {
      throw new Error("Movie not found");
    }

    const showtimesWithAvailability = movie.showtimes.map((showtime) => {
      const bookedSeats = showtime.bookings.flatMap((booking) =>
        JSON.parse(booking.seats)
      );
      const totalSeats = showtime.room.rows * showtime.room.seatsPerRow;
      const bookedSeatsCount = bookedSeats.length;
      const availableSeats = totalSeats - bookedSeatsCount;

      const { bookings, ...showtimeData } = showtime;
      return {
        ...showtimeData,
        totalSeats,
        bookedSeatsCount,
        availableSeats,
      };
    });

    return {
      ...movie,
      showtimes: showtimesWithAvailability,
    };
  },

  async getTrendingMovies(limit = 10) {
    const movies = await prisma.movie.findMany({
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
          include: {
            bookings: {
              where: {
                status: "CONFIRMED",
              },
            },
          },
        },
      },
    });

    const moviesWithStats = movies.map((movie) => {
      const bookingCount = movie.showtimes.reduce(
        (total, showtime) => total + showtime.bookings.length,
        0
      );

      const avgRating =
        movie.reviews.length > 0
          ? movie.reviews.reduce((sum, r) => sum + r.rating, 0) /
            movie.reviews.length
          : 0;

      const { reviews, showtimes, ...movieData } = movie;
      return {
        ...movieData,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length,
        bookingCount,
        showtimes: showtimes.map((st) => {
          const { bookings, ...stData } = st;
          return stData;
        }),
      };
    });

    return moviesWithStats
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, limit);
  },
};
