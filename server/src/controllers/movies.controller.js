import { moviesService } from '../services/movies.service.js';

export const moviesController = {
  async getAllMovies(req, res) {
    try {
      const { search, genre } = req.query;
      const movies = await moviesService.getAllMovies(search, genre);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  },

  async getMovieById(req, res) {
    try {
      const movie = await moviesService.getMovieById(req.params.id);
      res.json(movie);
    } catch (error) {
      if (error.message === 'Movie not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to fetch movie' });
    }
  },
};
