import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name must not be empty.")
      .openapi({ example: "John Doe" }),
    email: z
      .string()
      .email()
      .transform((val) => val.toLowerCase())
      .openapi({ example: "user@example.com" }),
    password: z
      .string()
      .min(8, "Password length must be at least 8 characters.")
      .regex(/[A-Z]/, "Must include uppercase")
      .regex(/[0-9]/, "Must include number.")
      .openapi({ example: "Password123!" }),
  })
  .openapi("RegisterRequest");

const loginSchema = z
  .object({
    email: z
      .string()
      .email()
      .min(1, "Email cannot be empty.")
      .openapi({ example: "user@example.com" }),
    password: z
      .string()
      .min(1, "Password cant be empty")
      .openapi({ example: "Password123!" }),
  })
  .openapi("LoginRequest");

const resendVerificationEmailSchema = z
  .object({
    email: z
      .string()
      .email()
      .min(1, "Email cannot be empty.")
      .openapi({ example: "user@example.com" }),
  })
  .openapi("ResendVerificationRequest");

export { registerSchema, loginSchema, resendVerificationEmailSchema };
