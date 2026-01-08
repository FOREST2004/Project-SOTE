import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { reviewsController } from "../controllers/reviews.controller.js";

const router = express.Router();

router.post("/", authMiddleware, reviewsController.createOrUpdateReview);

router.get("/movie/:movieId", reviewsController.getReviewsByMovie);

export default router;
