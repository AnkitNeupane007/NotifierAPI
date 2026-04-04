import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const announcementBaseSchema = z.object({
  id: z.string().openapi({ example: "cm0z..." }),
  title: z.string().openapi({ example: "System Maintenance" }),
  content: z.string().openapi({ example: "Downtime at midnight" }),
  priority: z.string().openapi({ example: "HIGH" }),
  type: z.string().optional().openapi({ example: "READ_ONLY" }),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .openapi({ example: "2026-03-31T23:59:59Z" }),
  maxScore: z.number().nullable().optional().openapi({ example: 100 }),
  userId: z.string().openapi({ example: "cm0z..." }),
  createdAt: z.string().openapi({ example: "2026-03-21T10:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2026-03-21T10:00:00.000Z" }),
  isRead: z.boolean().optional().openapi({ example: false }),
});

export const adminAnnouncementBaseSchema = announcementBaseSchema
  .omit({
    isRead: true,
    content: true,
    userId: true,
    updatedAt: true,
    dueDate: true,
    maxScore: true,
  })
  .extend({
    totalReads: z.number().openapi({ example: 42 }),
    readers: z.array(
      z.object({
        userId: z.string().openapi({ example: "cm0z..." }),
        name: z.string().openapi({ example: "John Doe" }),
        email: z.string().email().openapi({ example: "user@example.com" }),
        readAt: z.string().openapi({ example: "2026-03-22T10:00:00.000Z" }),
      }),
    ),
  });

export const paginationSchema = z.object({
  total: z.number().openapi({ example: 10 }),
  page: z.number().openapi({ example: 1 }),
  limit: z.number().openapi({ example: 5 }),
  totalPages: z.number().openapi({ example: 2 }),
  hasNext: z.boolean().openapi({ example: true }),
});

export const getAnnouncementsResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    data: z.object({
      announcements: z.array(
        announcementBaseSchema.omit({ userId: true, updatedAt: true }),
      ),
      pagination: paginationSchema.optional(),
    }),
  })
  .openapi("GetAnnouncementsResponse");

export const getAdminAnnouncementsResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    data: z.object({
      announcements: z.array(adminAnnouncementBaseSchema),
      pagination: paginationSchema.optional(),
    }),
  })
  .openapi("GetAdminAnnouncementsResponse");

export const getAnnouncementByIdResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    data: z.object({
      announcement: announcementBaseSchema
        .omit({ isRead: true, userId: true, updatedAt: true })
        .extend({
          isRead: z.boolean().optional(),
          readAt: z.string().optional(),
          attachments: z.array(z.any()).optional(),
          submission: z.any().optional(),
        }),
    }),
  })
  .openapi("GetAnnouncementByIdResponse");

export const createAnnouncementResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    data: announcementBaseSchema.omit({ isRead: true }),
  })
  .openapi("CreateAnnouncementResponse");

export const getUnreadResponseSchema = z
  .object({
    status: z.string().openapi({ example: "success" }),
    data: z.object({
      unread: z.array(
        announcementBaseSchema.omit({
          isRead: true,
          userId: true,
          updatedAt: true,
        }),
      ),
    }),
    pagination: paginationSchema.optional(),
  })
  .openapi("GetUnreadAnnouncementsResponse");
