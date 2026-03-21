import express from "express";

// Controller imports
import {
  getUsers,
  getMyself,
  deleteUser,
  getUserAnnouncementStatus,
} from "../controller/userController.js";
import asyncHandler from "../middleware/asyncHandler.js";

//Auth Middleware imports
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

// Validation schemas import
import { registry } from "../config/swagger.js";
import { z } from "zod";

const router = express.Router();

router.use(authMiddleware);

registry.registerPath({
  method: "get",
  path: "/user/me",
  tags: ["Users"],
  summary: "Get current user profile",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Current user profile" },
  },
});
router.get("/me", asyncHandler(getMyself));

registry.registerPath({
  method: "get",
  path: "/user",
  tags: ["Users"],
  summary: "Get all users (Admin)",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "List of users" },
  },
});
router.get("/", authorize("ADMIN"), asyncHandler(getUsers));

registry.registerPath({
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
    200: { description: "User deleted" },
  },
});
router.delete("/:id", authorize("ADMIN"), asyncHandler(deleteUser));

registry.registerPath({
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
        .optional()
        .openapi({ description: "Announcement status" }),
    }),
  },
  responses: {
    200: { description: "Announcement status for the user" },
  },
});
router.get(
  "/:id/announcements",
  authorize("ADMIN"),
  asyncHandler(getUserAnnouncementStatus),
); // Query params for key "status" should be either "read" or "unread"

export default router;
