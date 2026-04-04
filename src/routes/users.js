import express from "express";

// Controller imports
import getUsers from "../controllers/users/getAll.js";
import getMyself from "../controllers/users/getMyself.js";
import deleteUser from "../controllers/users/delete.js";
import getUserAnnouncementStatus from "../controllers/users/getAnnouncementStatus.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { uploadProfilePicture } from "../controllers/users/profilePic.js";

//Auth Middleware imports
import { authMiddleware } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { uploadImage } from "../middlewares/upload.js";

// Validation middleware
import { validateRequest } from "../middlewares/validateRequest.js";
import { statusQuerySchema } from "../validators/announcements.js";

import { userLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.use(authMiddleware);

router.use(userLimiter);

router.get("/me", asyncHandler(getMyself));

router.post(
  "/me/profile-picture",
  uploadImage.single("profilePicture"), // Multer middleware to handle single file upload with field name "image"
  asyncHandler(uploadProfilePicture),
);

router.get("/", authorize("ADMIN"), asyncHandler(getUsers));

router.delete("/:id", authorize("ADMIN"), asyncHandler(deleteUser));

router.get(
  "/:id/announcements",
  authorize("ADMIN"),
  validateRequest(statusQuerySchema, "query"),
  asyncHandler(getUserAnnouncementStatus),
); // Query params for key "status" should be either "read" or "unread"

export default router;
