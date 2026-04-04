import express from "express";

// Controller imports
import { refresh } from "../controllers/auth/refresh.js";
import { logout } from "../controllers/auth/logout.js";
import { login } from "../controllers/auth/login.js";
import { register } from "../controllers/auth/register.js";
import { verifyEmail } from "../controllers/auth/verifyEmail.js";
import { resendVerificationEmail } from "../controllers/auth/resendVerificationEmail.js";
import asyncHandler from "../middlewares/asyncHandler.js";

import {
  loginLimiter,
  refreshLimiter,
  spamLimiter,
  verificationLimiter,
} from "../middlewares/rateLimiter.js";

//Validation Middleware import
import { validateRequest } from "../middlewares/validateRequest.js";

// Validation schemas import
import {
  registerSchema,
  loginSchema,
  resendVerificationEmailSchema,
} from "../validators/auth.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/register",
  spamLimiter,
  validateRequest(registerSchema),
  asyncHandler(register),
);

router.get("/verify-email", verificationLimiter, asyncHandler(verifyEmail)); // query "token" is required

router.post(
  "/resend-verification",
  verificationLimiter,
  validateRequest(resendVerificationEmailSchema),
  asyncHandler(resendVerificationEmail),
);

router.post("/logout", authMiddleware, asyncHandler(logout));

router.post(
  "/login",
  loginLimiter,
  validateRequest(loginSchema),
  asyncHandler(login),
);

router.post("/refresh", refreshLimiter, asyncHandler(refresh));

export default router;
