import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/envValidator.js";
import AppError from "../utils/AppError.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    if (userExists.isDeleted) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const restoredUser = await prisma.user.update({
        where: { email },
        data: {
          name,
          isDeleted: false,
          password: hashedPassword,
        },
      });

      await generateToken(restoredUser, res);

      return res.status(200).json({
        status: "success",
        data: {
          user: {
            id: restoredUser.id,
            name,
            email,
          },
        },
      });
    }

    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  await generateToken(user, res);

  return res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name,
        email,
      },
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.isDeleted) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  await generateToken(user, res);

  return res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
    },
  });
};

const logout = async (req, res) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { refreshToken: null },
  });

  res.clearCookie("access_token");
  res.clearCookie("refresh_token", { path: "/auth/refresh" });

  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

const refresh = async (req, res) => {
  const refresh_token = req.cookies?.refresh_token;

  // If no refresh token exists, then nuke everything
  if (!refresh_token) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token", { path: "/auth/refresh" });

    throw new AppError("No refresh token found. Please login again.", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(refresh_token, env.REFRESH_SECRET);
  } catch (err) {
    // If Invalid or expired token, clear both
    res.clearCookie("access_token");
    res.clearCookie("refresh_token", { path: "/auth/refresh" });

    throw new AppError("Invalid or expired refresh token. Logged out.", 403);
  }

  const hashed_refresh_token = crypto
    .createHash("sha256")
    .update(refresh_token)
    .digest("hex");

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || user.refreshToken !== hashed_refresh_token) {
    if (user) {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { refreshToken: null },
      });
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token", { path: "/auth/refresh" });

    throw new AppError("Refresh token reuse detected. Logged out.", 403);
  }

  // Generate new tokens
  await generateToken(user, res);

  return res.status(200).json({
    status: "success",
    message: "Token refreshed",
  });
};

export { register, logout, login, refresh };
