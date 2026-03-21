import express from "express";

// Controller imports
import getUsers from "../controller/user/getUsersController.js";
import getMyself from "../controller/user/getMyselfController.js";
import deleteUser from "../controller/user/deleteUserController.js";
import getUserAnnouncementStatus from "../controller/user/getUserAnnouncementStatusController.js";
import asyncHandler from "../middleware/asyncHandler.js";

//Auth Middleware imports
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

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
