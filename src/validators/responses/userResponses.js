import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { announcementBaseSchema } from "./announcementResponses.js";

extendZodWithOpenApi(z);

export const userProfileSchema = z.object({
  id: z.string().openapi({ example: "cm0z..." }),
  name: z.string().openapi({ example: "John Doe" }),
  email: z.string().email().openapi({ example: "user@example.com" }),
  role: z.string().openapi({ example: "USER" }),
});

export const getMyselfResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    data: z.object({
      user: userProfileSchema,
    }),
  })
  .openapi("GetMyselfResponse");

export const getUsersResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    data: z.object({
      users: z.object({
        userList: z.array(
          z.object({
            id: z.string().openapi({ example: "cm0z..." }),
            name: z.string().openapi({ example: "John Doe" }),
            email: z.string().email().openapi({ example: "user@example.com" }),
            isDeleted: z.boolean().openapi({ example: false }),
            isEmailVerified: z.boolean().openapi({ example: true }),
          }),
        ),
      }),
    }),
  })
  .openapi("GetUsersResponse");

export const userAnnouncementStatusResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    data: z.object({
      read: z
        .array(
          announcementBaseSchema.omit({
            isRead: true,
            userId: true,
            updatedAt: true,
          }),
        )
        .optional()
        .openapi({ description: "Array of read announcements" }),
      unread: z
        .array(
          announcementBaseSchema.omit({
            isRead: true,
            userId: true,
            updatedAt: true,
          }),
        )
        .optional()
        .openapi({ description: "Array of unread announcements" }),
    }),
  })
  .openapi("UserAnnouncementStatusResponse");
