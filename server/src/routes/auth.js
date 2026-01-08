import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { authController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", authMiddleware, authController.getMe);

router.put("/profile", authMiddleware, authController.updateProfile);

export default router;
