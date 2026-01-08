import express from "express";
import { moviesController } from "../controllers/movies.controller.js";

const router = express.Router();

router.get("/", moviesController.getAllMovies);

router.get("/trending", moviesController.getTrendingMovies);

router.get("/:id", moviesController.getMovieById);

export default router;
