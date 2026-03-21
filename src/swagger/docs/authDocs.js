import {
  registerSchema,
  loginSchema,
  resendVerificationEmailSchema,
} from "../../validators/authValidators.js";
import {
  loginResponseSchema,
  registerResponseSchema,
  authMessageResponseSchema,
} from "../../validators/responses/authResponses.js";
import { z } from "zod";

export const authSwaggerDocs = {
  register: {
    method: "post",
    path: "/auth/register",
    tags: ["Auth"],
    summary: "Register a new user",
    request: {
      body: {
        content: { "application/json": { schema: registerSchema } },
      },
    },
    responses: {
      201: {
        description: "Registered successfully",
        content: { "application/json": { schema: registerResponseSchema } },
      },
    },
  },

  verifyEmail: {
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
        content: { "application/json": { schema: authMessageResponseSchema } },
      },
    },
  },

  resendVerification: {
    method: "post",
    path: "/auth/resend-verification",
    tags: ["Auth"],
    summary: "Resend verification email",
    request: {
      body: {
        content: {
          "application/json": { schema: resendVerificationEmailSchema },
        },
      },
    },
    responses: {
      200: {
        description: "Verification email sent",
        content: { "application/json": { schema: authMessageResponseSchema } },
      },
    },
  },

  logout: {
    method: "post",
    path: "/auth/logout",
    tags: ["Auth"],
    summary: "Logout user",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Logged out successfully",
        content: { "application/json": { schema: authMessageResponseSchema } },
      },
    },
  },

  login: {
    method: "post",
    path: "/auth/login",
    tags: ["Auth"],
    summary: "Login user",
    request: {
      body: {
        content: { "application/json": { schema: loginSchema } },
      },
    },
    responses: {
      200: {
        description: "Logged in successfully",
        content: { "application/json": { schema: loginResponseSchema } },
      },
    },
  },

  refresh: {
    method: "post",
    path: "/auth/refresh",
    tags: ["Auth"],
    summary: "Refresh access token",
    responses: {
      200: {
        description: "Token refreshed",
        content: { "application/json": { schema: authMessageResponseSchema } },
      },
    },
  },
};
