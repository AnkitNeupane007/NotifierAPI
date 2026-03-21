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

const router = express.Router();

router.use(authMiddleware);

router.get("/unread", asyncHandler(getUnread));

router.get("/admin", authorize("ADMIN"), asyncHandler(getAdminAnnouncements)); //can give query param page, limit for pagination

router.get("/", asyncHandler(getAnnouncements)); //can give query param page, limit for pagination

router.get("/:id", asyncHandler(getAnnouncementsById));

router.delete(
  "/:id",
  authorize("ADMIN"),
  asyncHandler(deleteAnnouncementsById),
);

router.post(
  "/",
  authorize("ADMIN"),
  validateRequest(announcementSchema),
  asyncHandler(postAnnouncements),
);

router.post("/read/:announcementId/", asyncHandler(markAsRead));

export default router;
