import { z } from "zod";
import { announcementSchema } from "../../validators/announcementValidators.js";
import { successMessageResponseSchema } from "../../validators/responses/commonResponses.js";
import {
  getAnnouncementsResponseSchema,
  getAdminAnnouncementsResponseSchema,
  getAnnouncementByIdResponseSchema,
  createAnnouncementResponseSchema,
  getUnreadResponseSchema,
} from "../../validators/responses/announcementResponses.js";

export const announcementSwaggerDocs = {
  getUnread: {
    method: "get",
    path: "/announcements/unread",
    tags: ["Announcements"],
    summary: "Get unread announcements for the user",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Unread announcements",
        content: { "application/json": { schema: getUnreadResponseSchema } },
      },
    },
  },

  getAdminAnnouncements: {
    method: "get",
    path: "/announcements/admin",
    tags: ["Announcements"],
    summary: "Get all announcements (Admin)",
    security: [{ bearerAuth: [] }],
    request: {
      query: z.object({
        page: z.string().optional().openapi({ description: "Page number" }),
        limit: z.string().optional().openapi({ description: "Limit" }),
      }),
    },
    responses: {
      200: {
        description: "List of announcements",
        content: {
          "application/json": { schema: getAdminAnnouncementsResponseSchema },
        },
      },
    },
  },

  getAnnouncements: {
    method: "get",
    path: "/announcements",
    tags: ["Announcements"],
    summary: "Get all announcements",
    security: [{ bearerAuth: [] }],
    request: {
      query: z.object({
        page: z.string().optional().openapi({ description: "Page number" }),
        limit: z.string().optional().openapi({ description: "Limit" }),
      }),
    },
    responses: {
      200: {
        description: "List of announcements",
        content: {
          "application/json": { schema: getAnnouncementsResponseSchema },
        },
      },
    },
  },

  getAnnouncementById: {
    method: "get",
    path: "/announcements/{id}",
    tags: ["Announcements"],
    summary: "Get announcement by ID",
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: "Announcement ID" }),
      }),
    },
    responses: {
      200: {
        description: "Announcement details",
        content: {
          "application/json": { schema: getAnnouncementByIdResponseSchema },
        },
      },
    },
  },

  deleteAnnouncement: {
    method: "delete",
    path: "/announcements/{id}",
    tags: ["Announcements"],
    summary: "Delete announcement by ID (Admin)",
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: "Announcement ID" }),
      }),
    },
    responses: {
      200: {
        description: "Deleted announcement",
        content: {
          "application/json": { schema: successMessageResponseSchema },
        },
      },
    },
  },

  createAnnouncement: {
    method: "post",
    path: "/announcements",
    tags: ["Announcements"],
    summary: "Create new announcement (Admin)",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": { schema: announcementSchema },
        },
      },
    },
    responses: {
      201: {
        description: "Announcement created",
        content: {
          "application/json": { schema: createAnnouncementResponseSchema },
        },
      },
    },
  },

  markAsRead: {
    method: "post",
    path: "/announcements/read/{announcementId}",
    tags: ["Announcements"],
    summary: "Mark announcement as read",
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        announcementId: z.string().openapi({ description: "Announcement ID" }),
      }),
    },
    responses: {
      200: {
        description: "Marked as read",
        content: {
          "application/json": { schema: successMessageResponseSchema },
        },
      },
    },
  },
};
