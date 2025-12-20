import express from 'express';
import { moviesController } from '../controllers/movies.controller.js';

const router = express.Router();

// Get all movies
router.get('/', moviesController.getAllMovies);

// Get movie by ID
router.get('/:id', moviesController.getMovieById);

export default router;
