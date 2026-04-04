import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";

const markAsRead = async (req, res) => {
  const userId = req.user.id;
  const { announcementId } = req.params;

  // Check if announcement exists
  const announcement = await prisma.announcement.findUnique({
    where: { id: announcementId },
  });

  if (!announcement) {
    throw new AppError("Announcement not found.", 404);
  }

  // Create or update read status
  await prisma.readStatus.upsert({
    where: {
      userId_announcementId: {
        userId,
        announcementId,
      },
    },
    update: {
      isRead: true,
      readAt: new Date(),
    },
    create: {
      userId,
      announcementId,
      isRead: true,
      readAt: new Date(),
    },
  });

  return res.status(200).json({
    status: "success",
    message: "Marked as read",
  });
};

export default markAsRead;
