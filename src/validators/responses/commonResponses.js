import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const successMessageResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    message: z
      .string()
      .openapi({ example: "Operation completed successfully." }),
  })
  .openapi("SuccessMessageResponse");

export const errorResponseSchema = z
  .object({
    status: z.string().openapi({ example: "error" }),
    message: z.string().openapi({ example: "An error occurred." }),
  })
  .openapi("ErrorResponse");
