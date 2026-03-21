import { prisma } from "../config/db.js";
import AppError from "../utils/AppError.js";

const getUsers = async (req, res) => {
  const userList = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isDeleted: true,
      isEmailVerified: true,
    },
  });

  return res.status(200).json({
    status: "success",
    data: {
      users: {
        userList,
      },
    },
  });
};

const getMyself = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  return res.status(200).json({
    status: "success",
    data: {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};

const deleteUser = async (req, res) => {
  // Find the user first
  const userId = req.params.id;

  // Do not delete yourself
  if (req.user.id === userId) {
    throw new AppError("You cannot delete yourself.", 400);
  }

  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
  });

  // Check also if already deleted
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  await prisma.$transaction([
    prisma.readStatus.deleteMany({
      where: { userId },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    }),
  ]);

  return res
    .status(204)
    .json({ status: "success", message: "User deleted successfully." });
};

const getUserAnnouncementStatus = async (req, res) => {
  const userId = req.params.id;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Get read announcements
  const read = await prisma.readStatus.findMany({
    where: {
      userId,
      isRead: true,
    },
    include: {
      announcement: true,
    },
  });

  const unread = await prisma.announcement.findMany({
    where: {
      readStatus: {
        none: {
          userId,
          isRead: true,
        },
      },
    },
  });

  const userStatus = req.query.status;

  if (userStatus === "read") {
    return res.status(200).json({
      status: "success",
      data: {
        read: read.map((r) => r.announcement),
      },
    });
  } else if (userStatus === "unread") {
    return res.status(200).json({
      status: "success",
      data: {
        unread,
      },
    });
  }
  return res.status(200).json({
    status: "success",
    data: {
      read: read.map((r) => r.announcement),
      unread,
    },
  });
};

export { deleteUser, getMyself, getUserAnnouncementStatus, getUsers };
