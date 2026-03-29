import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";

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
    select: {
      announcement: {
        select: {
          id: true,
          title: true,
          content: true,
          priority: true,
          type: true,
          createdAt: true,
          dueDate: true,
          maxScore: true,
        },
      },
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

    select: {
      id: true,
      title: true,
      content: true,
      priority: true,
      type: true,
      createdAt: true,
      dueDate: true,
      maxScore: true,
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

export default getUserAnnouncementStatus;
