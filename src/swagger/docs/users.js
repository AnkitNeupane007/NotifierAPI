import {
  getMyselfResponseSchema,
  getUsersResponseSchema,
  userAnnouncementStatusResponseSchema,
} from "../../validators/responses/userResponses.js";
import { z } from "zod";

export const userSwaggerDocs = {
  getMe: {
    method: "get",
    path: "/user/me",
    tags: ["Users"],
    summary: "Get current user profile",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Current user profile",
        content: { "application/json": { schema: getMyselfResponseSchema } },
      },
    },
  },

  uploadProfilePicture: {
    method: "post",
    path: "/user/me/profile-picture",
    tags: ["Users"],
    summary: "Upload profile picture",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: z.object({
              profilePicture: z.string().openapi({
                format: "binary",
                description: "Profile picture image file",
              }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Profile picture uploaded successfully",
        content: { "application/json": { schema: getMyselfResponseSchema } },
      },
    },
  },

  getUsers: {
    method: "get",
    path: "/user",
    tags: ["Users"],
    summary: "Get all users (Admin)",
    security: [{ bearerAuth: [] }],
    request: {
      query: z.object({
        page: z.string().optional().openapi({ description: "Page number" }),
        limit: z.string().optional().openapi({ description: "Limit" }),
      }),
    },
    responses: {
      200: {
        description: "List of users",
        content: { "application/json": { schema: getUsersResponseSchema } },
      },
    },
  },

  getUser: {
    method: "get",
    path: "/user/{id}",
    tags: ["Users"],
    summary: "Get a user by ID (Admin)",
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: "User ID" }),
      }),
    },
    responses: {
      200: {
        description: "User details",
        content: { "application/json": { schema: getMyselfResponseSchema } },
      },
    },
  },

  deleteUser: {
    method: "delete",
    path: "/user/{id}",
    tags: ["Users"],
    summary: "Delete a user (Admin)",
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: "User ID" }),
      }),
    },
    responses: {
      204: { description: "User deleted" },
    },
  },

  getUserAnnouncements: {
    method: "get",
    path: "/user/{id}/announcements",
    tags: ["Users"],
    summary: "Get a user's announcement status (Admin)",
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: "User ID" }),
      }),
      query: z.object({
        status: z
          .enum(["read", "unread"])
          .openapi({ description: "Announcement status (required)" }),
        page: z.string().optional().openapi({ description: "Page number" }),
        limit: z.string().optional().openapi({ description: "Limit" }),
      }),
    },
    responses: {
      200: {
        description: "Announcement status for the user",
        content: {
          "application/json": { schema: userAnnouncementStatusResponseSchema },
        },
      },
    },
  },
};
