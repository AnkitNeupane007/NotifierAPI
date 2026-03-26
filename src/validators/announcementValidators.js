import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const announcementSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title must not be empty.")
      .openapi({ example: "Important Update" }),
    content: z.string().min(1, "Content cannot be empty.").openapi({
      example: "There is a planned maintenance window at midnight.",
    }),
    priority: z
      .enum(["LOW", "MEDIUM", "HIGH"], {
        error: () => {
          return "Status must be one of LOW, MEDIUM and HIGH";
        },
      })
      .openapi({ example: "HIGH" }),
    type: z
      .enum(["READ_ONLY", "ASSIGNMENT"])
      .optional()
      .openapi({ example: "READ_ONLY" }),
    dueDate: z
      .string()
      .datetime()
      .optional()
      .openapi({ example: "2026-03-31T23:59:59Z" }),
    maxScore: z
      .number()
      .int()
      .nonnegative()
      .optional()
      .openapi({ example: 100 }),
  })
  .openapi("AnnouncementRequest");

export { announcementSchema };
