import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

const prisma = new PrismaClient();

export const reviewsService = {
  async createOrUpdateReview(userId, movieId, rating, comment) {
    if (typeof rating !== "number" || isNaN(rating)) {
      throw new BadRequestError("Rating must be a number");
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundError("Movie");
    }

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
      orderBy: { createdAt: "desc" },
    });
  },
};
