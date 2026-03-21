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

import { registry } from "../config/swagger.js";
import { z } from "zod";

const router = express.Router();

registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  summary: "Register a new user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Registered successfully",
    },
  },
});
router.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(register),
);

registry.registerPath({
  method: "get",
  path: "/auth/verify-email",
  tags: ["Auth"],
  summary: "Verify email address",
  request: {
    query: z.object({
      token: z.string().openapi({ description: "Email verification token" }),
    }),
  },
  responses: {
    200: {
      description: "Email verified successfully",
    },
  },
});
router.get("/verify-email", asyncHandler(verifyEmail)); // query "token" is required

registry.registerPath({
  method: "post",
  path: "/auth/resend-verification",
  tags: ["Auth"],
  summary: "Resend verification email",
  request: {
    body: {
      content: {
        "application/json": {
          schema: resendVerificationEmailSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Verification email sent",
    },
  },
});
router.post(
  "/resend-verification",
  validateRequest(resendVerificationEmailSchema),
  resendVerificationEmail,
);

registry.registerPath({
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],
  summary: "Logout user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Logged out successfully",
    },
  },
});
router.post("/logout", authMiddleware, asyncHandler(logout));

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Login user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Logged in successfully",
    },
  },
});
router.post("/login", validateRequest(loginSchema), asyncHandler(login));

registry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  summary: "Refresh access token",
  responses: {
    200: {
      description: "Token refreshed",
    },
  },
});
router.post("/refresh", asyncHandler(refresh));

export default router;
