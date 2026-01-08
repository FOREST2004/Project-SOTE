import express from "express";
import { showtimesController } from "../controllers/showtimes.controller.js";

const router = express.Router();

router.get("/:id", showtimesController.getShowtimeById);

export default router;
