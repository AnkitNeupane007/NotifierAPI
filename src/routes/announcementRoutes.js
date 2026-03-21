import express from "express";

// Controller imports
import asyncHandler from "../middleware/asyncHandler.js";
import {
  getAnnouncements,
  postAnnouncements,
  getAnnouncementsById,
  deleteAnnouncementsById,
  markAsRead,
  getUnread,
  getAdminAnnouncements,
} from "../controller/announcementController.js";

//Auth Middleware imports
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

// Validation middleware
import { validateRequest } from "../middleware/validateRequest.js";
import { announcementSchema } from "../validators/announcementValidators.js";

// Validation schemas import
import { registry } from "../config/swagger.js";
import { z } from "zod";

const router = express.Router();

router.use(authMiddleware);

registry.registerPath({
  method: "get",
  path: "/announcements/unread",
  tags: ["Announcements"],
  summary: "Get unread announcements for the user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Unread announcements" },
  },
});
router.get("/unread", asyncHandler(getUnread));

registry.registerPath({
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
    200: { description: "List of announcements" },
  },
});
router.get("/admin", authorize("ADMIN"), asyncHandler(getAdminAnnouncements)); //can give query param page, limit for pagination

registry.registerPath({
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
    200: { description: "List of announcements" },
  },
});
router.get("/", asyncHandler(getAnnouncements)); //can give query param page, limit for pagination

registry.registerPath({
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
    200: { description: "Announcement details" },
  },
});
router.get("/:id", asyncHandler(getAnnouncementsById));

registry.registerPath({
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
    200: { description: "Deleted announcement" },
  },
});
router.delete(
  "/:id",
  authorize("ADMIN"),
  asyncHandler(deleteAnnouncementsById),
);

registry.registerPath({
  method: "post",
  path: "/announcements",
  tags: ["Announcements"],
  summary: "Create new announcement (Admin)",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: announcementSchema,
        },
      },
    },
  },
  responses: {
    201: { description: "Announcement created" },
  },
});
router.post(
  "/",
  authorize("ADMIN"),
  validateRequest(announcementSchema),
  asyncHandler(postAnnouncements),
);

registry.registerPath({
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
    200: { description: "Marked as read" },
  },
});
router.post("/read/:announcementId/", asyncHandler(markAsRead));

export default router;
