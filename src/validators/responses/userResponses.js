import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  announcementBaseSchema,
  paginationSchema,
} from "./announcementResponses.js";

extendZodWithOpenApi(z);

export const userProfileSchema = z.object({
  id: z.string().openapi({ example: "cm0z..." }),
  name: z.string().openapi({ example: "John Doe" }),
  email: z.string().email().openapi({ example: "user@example.com" }),
  isEmailVerified: z.boolean().openapi({ example: false }),
  profilePictureUrl: z.string().nullable().openapi({
    example: "https://...",
    description: "Profile picture URL with cache-busting timestamp appended",
  }),
  updatedAt: z
    .string()
    .datetime()
    .openapi({ example: "2026-04-10T10:00:00.000Z" }),
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
      users: z.array(
        z.object({
          id: z.string().openapi({ example: "cm0z..." }),
          name: z.string().openapi({ example: "John Doe" }),
          email: z.string().email().openapi({ example: "user@example.com" }),
          isDeleted: z.boolean().openapi({ example: false }),
          isEmailVerified: z.boolean().openapi({ example: true }),
        }),
      ),
    }),
    pagination: paginationSchema.optional(),
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
    pagination: paginationSchema.optional(),
  })
  .openapi("UserAnnouncementStatusResponse");
