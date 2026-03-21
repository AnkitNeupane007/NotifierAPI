import express from "express";

// Controller imports
import { refresh } from "../controller/auth/refreshController.js";
import { logout } from "../controller/auth/logoutController.js";
import { login } from "../controller/auth/loginController.js";
import { register } from "../controller/auth/registerController.js";
import { verifyEmail } from "../controller/auth/verifyEmailController.js";
import { resendVerificationEmail } from "../controller/auth/resendVerificationEmailController.js";
import asyncHandler from "../middleware/asyncHandler.js";

//Validation Middleware import
import { validateRequest } from "../middleware/validateRequest.js";

// Validation schemas import
import {
  registerSchema,
  loginSchema,
  resendVerificationEmailSchema,
} from "../validators/authValidators.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(register),
);

router.get("/verify-email", asyncHandler(verifyEmail)); // query "token" is required

router.post(
  "/resend-verification",
  validateRequest(resendVerificationEmailSchema),
  resendVerificationEmail,
);

router.post("/logout", authMiddleware, asyncHandler(logout));

router.post("/login", validateRequest(loginSchema), asyncHandler(login));

router.post("/refresh", asyncHandler(refresh));

export default router;

