import { reviewsService } from '../services/reviews.service.js';

export const reviewsController = {
  async createOrUpdateReview(req, res) {
    try {
      const { movieId, rating, comment } = req.body;

      if (!movieId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid review data' });
      }

      const review = await reviewsService.createOrUpdateReview(
        req.user.id,
        movieId,
        rating,
        comment
      );
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit review' });
    }
  },

  async getReviewsByMovie(req, res) {
    try {
      const reviews = await reviewsService.getReviewsByMovie(req.params.movieId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  },
};
