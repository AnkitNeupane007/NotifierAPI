import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { successMessageResponseSchema } from "./commonResponses.js";

extendZodWithOpenApi(z);

export const loginResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    data: z.object({
      user: z.object({
        id: z.string().openapi({ example: "cm0z..." }),
        email: z.string().email().openapi({ example: "user@example.com" }),
      }),
    }),
  })
  .openapi("LoginResponse");

export const registerResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    message: z
      .string()
      .openapi({
        example: "Registration successful. Verification email sent.",
      }),
    data: z.object({
      user: z.object({
        id: z.string().openapi({ example: "cm0z..." }),
        name: z.string().openapi({ example: "John Doe" }),
        email: z.string().email().openapi({ example: "user@example.com" }),
        isEmailVerified: z.boolean().openapi({ example: false }),
      }),
    }),
  })
  .openapi("RegisterResponse");

export const authMessageResponseSchema = successMessageResponseSchema.openapi(
  "AuthMessageResponse",
);
