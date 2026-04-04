import express from "express";

// Controller imports
import asyncHandler from "../middleware/asyncHandler.js";
import getAnnouncements from "../controller/announcement/getAnnouncementsController.js";
import postAnnouncements from "../controller/announcement/postAnnouncementsController.js";
import getAnnouncementsById from "../controller/announcement/getAnnouncementsByIdController.js";
import deleteAnnouncementsById from "../controller/announcement/deleteAnnouncementsByIdController.js";
import markAsRead from "../controller/announcement/markAsReadController.js";
import getUnread from "../controller/announcement/getUnreadController.js";
import getAdminAnnouncements from "../controller/announcement/getAdminAnnouncementsController.js";
import uploadFiletoAnnouncements from "../controller/announcement/uploadFiletoAnnouncementsController.js";

import { uploadImageAndDocs } from "../middleware/uploadMiddleware.js";

//Auth Middleware imports
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

// Validation middleware
import { validateRequest } from "../middleware/validateRequest.js";
import { announcementSchema } from "../validators/announcementValidators.js";

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
