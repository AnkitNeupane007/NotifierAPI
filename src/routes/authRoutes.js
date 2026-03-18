import express from "express";

// Controller imports
import {
  logout,
  register,
  login,
  refresh,
} from "../controller/authController.js";
import asyncHandler from "../middleware/asyncHandler.js";

//Validation Middleware import
import { validateRequest } from "../middleware/validateRequest.js";

// Validation schemas import
import { registerSchema, loginSchema } from "../validators/authValidators.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(register),
);

router.post("/logout", authMiddleware, asyncHandler(logout));

router.post("/login", validateRequest(loginSchema), asyncHandler(login));

router.post("/refresh", asyncHandler(refresh));

export default router;
