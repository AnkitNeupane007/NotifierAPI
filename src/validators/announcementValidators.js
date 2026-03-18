import { z } from "zod";

const announcementSchema = z.object({
  title: z.string().min(1, "Title must not be empty."),
  content: z.string().min(1, "Content cannot be empty."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    error: () => {
      return "Status must be one of LOW, MEDIUM and HIGH";
    },
  }),
});

export { announcementSchema };
