import { moviesService } from "../services/movies.service.js";

export const moviesController = {
  async getAllMovies(req, res) {
    try {
      const { search, genre, sortBy } = req.query;
      const movies = await moviesService.getAllMovies(search, genre, sortBy);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  },

  async getMovieById(req, res) {
    try {
      const movie = await moviesService.getMovieById(req.params.id);
      res.json(movie);
    } catch (error) {
      if (error.message === "Movie not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to fetch movie" });
    }
  },

  async getTrendingMovies(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const movies = await moviesService.getTrendingMovies(limit);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending movies" });
    }
  },
};
