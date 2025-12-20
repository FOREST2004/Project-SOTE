import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const reviewsService = {
  async createOrUpdateReview(userId, movieId, rating, comment) {
    return await prisma.review.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
      update: { rating, comment },
      create: {
        userId,
        movieId,
        rating,
        comment,
      },
      include: {
        user: {
          select: { fullName: true },
        },
      },
    });
  },

  async getReviewsByMovie(movieId) {
    return await prisma.review.findMany({
      where: { movieId },
      include: {
        user: {
          select: { fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
