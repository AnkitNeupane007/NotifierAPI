import express from "express";

// Controller imports
import asyncHandler from "../middlewares/asyncHandler.js";
import getAnnouncements from "../controllers/announcements/getAll.js";
import postAnnouncements from "../controllers/announcements/create.js";
import getAnnouncementsById from "../controllers/announcements/getById.js";
import deleteAnnouncementsById from "../controllers/announcements/deleteById.js";
import markAsRead from "../controllers/announcements/markAsRead.js";
import getUnread from "../controllers/announcements/getUnread.js";
import getAdminAnnouncements from "../controllers/announcements/getAdmin.js";
import uploadFiletoAnnouncements from "../controllers/announcements/uploadFile.js";

import { uploadImageAndDocs } from "../middlewares/upload.js";

//Auth Middleware imports
import { authMiddleware } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

// Validation middleware
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  announcementSchema,
} from "../validators/announcements.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/unread",
  asyncHandler(getUnread),
);

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

router.post(
  "/upload/:id/",
  authorize("ADMIN"),
  uploadImageAndDocs.fields([
    { name: "images", maxCount: 5 }, // Max 5 images
    { name: "documents", maxCount: 5 }, // Max 5 documents
  ]),
  asyncHandler(uploadFiletoAnnouncements),
);
router.post("/read/:announcementId/", asyncHandler(markAsRead));

export default router;
