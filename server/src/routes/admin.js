import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { adminController } from "../controllers/admin.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/revenue", adminController.getRevenue);

router.get("/movies", adminController.getAllMovies);
router.post("/movies", adminController.createMovie);
router.put("/movies/:id", adminController.updateMovie);
router.delete("/movies/:id", adminController.deleteMovie);

router.get("/rooms", adminController.getAllRooms);
router.post("/rooms", adminController.createRoom);
router.put("/rooms/:id", adminController.updateRoom);

router.get("/showtimes", adminController.getAllShowtimes);
router.post("/showtimes", adminController.createShowtime);
router.delete("/showtimes/:id", adminController.deleteShowtime);

export default router;
