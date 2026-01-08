import { authService } from "../services/auth.service.js";
import { AppError } from "../utils/errors.js";

export const authController = {
  async register(req, res) {
    try {
      const { email, password, fullName } = req.body;

      const result = await authService.register(email, password, fullName);

      return res.status(201).json({
        success: true,
        data: result,
        message: "Registration successful",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      }
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        error: "Registration failed",
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return res.status(200).json({
        success: true,
        data: result,
        message: "Login successful",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      }
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        error: "Login failed",
      });
    }
  },

  async getMe(req, res) {
    try {
      return res.status(200).json({
        success: true,
        data: { user: req.user },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch profile",
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const { fullName, password } = req.body;

      const user = await authService.updateProfile(
        req.user.id,
        fullName,
        password
      );

      return res.status(200).json({
        success: true,
        data: { user },
        message: "Profile updated successfully",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      }
      console.error("Update profile error:", error);
      return res.status(500).json({
        success: false,
        error: "Profile update failed",
      });
    }
  },
};
