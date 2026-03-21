import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name must not be empty."),
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(8, "Password length must be at least 8 characters.")
    .regex(/[A-Z]/, "Must include uppercase")
    .regex(/[0-9]/, "Must include number."),
});

const loginSchema = z.object({
  email: z.string().email().min(1, "Email cannot be empty."),
  password: z.string().min(1, "Password cant be empty"),
});

const resendVerificationEmailSchema = z.object({
  email: z.string().email().min(1, "Email cannot be empty."),
});

export { registerSchema, loginSchema, resendVerificationEmailSchema };
