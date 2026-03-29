import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";

const getAnnouncementsById = async (req, res) => {
  const announcement = await prisma.announcement.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      priority: true,
      type: true,
      dueDate: true,
      maxScore: true,

      attachments: {
        select: {
          filename: true,
          fileUrl: true,
          fileType: true,
        },
      },

      readStatus: {
        where: {
          userId: req.user.id,
        },
        select: {
          isRead: true,
          readAt: true,
        },
      },

      submissions: {
        where: {
          userId: req.user.id,
        },
        select: {
          status: true,
          grade: true,
          submittedAt: true,
        },
      },
    },
  });

  if (!announcement) {
    throw new AppError("Announcement does not exist.", 404);
  }

  // Flatten read status
  const isRead = announcement.readStatus[0]?.isRead ?? false;
  const readAt = announcement.readStatus[0]?.readAt ?? null;

  // Only include submission if it's an assignment
  const submission =
    announcement.type === "ASSIGNMENT"
      ? (announcement.submissions[0] ?? null)
      : null;

  // Remove raw relation arrays
  delete announcement.readStatus;
  delete announcement.submissions;

  // Final clean response object
  const formattedAnnouncement = {
    ...announcement,
    isRead,
    readAt,
    submission,
  };

  return res.status(200).json({
    status: "success",
    data: {
      announcement: formattedAnnouncement,
    },
  });
};

export default getAnnouncementsById;
