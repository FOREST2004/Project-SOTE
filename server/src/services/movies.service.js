import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const moviesService = {
  async getAllMovies(search, genre) {
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
    return movies.map(movie => {
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
      throw new Error('Movie not found');
    }

    return movie;
  },
};
