import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { bookingsController } from "../controllers/bookings.controller.js";

const router = express.Router();

router.post("/", authMiddleware, bookingsController.createBooking);

router.get("/", authMiddleware, bookingsController.getUserBookings);

router.delete("/:id", authMiddleware, bookingsController.cancelBooking);

export default router;
