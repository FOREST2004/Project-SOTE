import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from "../utils/errors.js";

const prisma = new PrismaClient();

export const authService = {
  async register(email, password, fullName) {
    if (!email || email.trim() === "") {
      throw new BadRequestError("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new BadRequestError("Invalid email format");
    }

    if (!password || password === "" || password.trim() === "") {
      throw new BadRequestError("Password is required");
    }

    if (!fullName || fullName.trim() === "" || fullName.length > 100) {
      throw new BadRequestError("Full name is required");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        fullName: fullName.trim(),
        role: "MEMBER",
      },
      select: { id: true, email: true, fullName: true, role: true },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return { user, token };
  },

  async login(email, password) {
    if (!email || email.trim() === "") {
      throw new BadRequestError("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new BadRequestError("Invalid email format");
    }

    if (!password || password.trim() === "") {
      throw new BadRequestError("Password is required");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, role: true },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  },

  async updateProfile(userId, fullName, password) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError("User");
    }

    if (fullName !== undefined && fullName.trim() === "") {
      throw new BadRequestError("Full name cannot be empty");
    }

    if (fullName.length > 100) {
      throw new BadRequestError("Full name too long");
    }

    const updateData = {};

    if (fullName !== undefined) {
      updateData.fullName = fullName.trim();
    }

    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, email: true, fullName: true, role: true },
    });

    return updatedUser;
  },
};
