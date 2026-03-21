import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const announcementSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title must not be empty.")
      .openapi({ example: "Important Update" }),
    content: z
      .string()
      .min(1, "Content cannot be empty.")
      .openapi({
        example: "There is a planned maintenance window at midnight.",
      }),
    priority: z
      .enum(["LOW", "MEDIUM", "HIGH"], {
        error: () => {
          return "Status must be one of LOW, MEDIUM and HIGH";
        },
      })
      .openapi({ example: "HIGH" }),
  })
  .openapi("AnnouncementRequest");

export { announcementSchema };
