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

const router = express.Router();

router.use(authMiddleware);

router.get("/me", asyncHandler(getMyself));

router.get("/", authorize("ADMIN"), asyncHandler(getUsers));

router.delete("/:id", authorize("ADMIN"), asyncHandler(deleteUser));

router.get(
  "/:id/announcements",
  authorize("ADMIN"),
  asyncHandler(getUserAnnouncementStatus),
); // Query params for key "status" should be either "read" or "unread"

export default router;
