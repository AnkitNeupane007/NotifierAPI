import { prisma } from "../config/db.js";
import AppError from "../utils/AppError.js";

const getAnnouncements = async (req, res) => {
  const userId = req.user.id;

  // Get pagination values from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  // Get announcements with pagination
  const announcements = await prisma.announcement.findMany({
    skip,
    take: limit,
    include: {
      readStatus: {
        where: { userId: userId },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Attach isRead field
  const formatted = announcements.map((a) => ({
    ...a,
    isRead: a.readStatus.length > 0 ? a.readStatus[0].isRead : false,
  }));

  // Get total count
  const total = await prisma.announcement.count();

  return res.status(200).json({
    status: "success",
    data: {
      announcements: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        next: limit * page < total,
      },
    },
  });
};

const getAnnouncementsById = async (req, res) => {
  const announcement = await prisma.announcement.findUnique({
    where: { id: req.params.id },
    include: {
      readStatus: {
        where: {
          userId: req.user.id,
          isRead: true,
        },
      },
    },
  });

  if (!announcement) {
    throw new AppError("Announcement does not exist.", 404);
  }

  return res.status(200).json({
    status: "success",
    data: {
      announcement,
    },
  });
};

const postAnnouncements = async (req, res) => {
  const { title, content, priority } = req.body;

  const userId = req.user.id;

  const announcement = await prisma.announcement.create({
    data: {
      title: title,
      content: content,
      priority: priority,
      userId: userId,
    },
  });

  res.status(201).json({
    status: "success",
    data: announcement,
  });
};

const deleteAnnouncementsById = async (req, res) => {
  const deleted = await prisma.announcement.delete({
    where: { id: req.params.id },
  });

  res.json({
    status: "success",
    message: `Deleted announcement: ${deleted.title}`,
  });
};

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

const getUnread = async (req, res) => {
  const userId = req.user.id;

  const unread = await prisma.announcement.findMany({
    where: {
      // No readStatus exists for this user or isRead = false
      readStatus: {
        none: {
          userId,
        },
      },
    },
    orderBy: [{ priority: "desc" }],
  });

  return res.status(200).json({
    status: "success",
    data: {
      unread,
    },
  });
};

const getAdminAnnouncements = async (req, res) => {
  // Get pagination values from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  // Get announcements with pagination and ALL readers
  const announcements = await prisma.announcement.findMany({
    skip,
    take: limit,
    include: {
      readStatus: {
        where: { isRead: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          readAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Optional: map to make the response cleaner
  const formatted = announcements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    priority: a.priority,
    userId: a.userId,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    totalReads: a.readStatus.length,
    readers: a.readStatus.map((rs) => ({
      userId: rs.user.id,
      name: rs.user.name,
      email: rs.user.email,
      readAt: rs.readAt,
    })),
  }));

  // Get total count
  const total = await prisma.announcement.count();

  return res.status(200).json({
    status: "success",
    data: {
      announcements: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        next: limit * page < total,
      },
    },
  });
};

export {
  getAnnouncements,
  getAnnouncementsById,
  postAnnouncements,
  deleteAnnouncementsById,
  markAsRead,
  getUnread,
  getAdminAnnouncements,
};
