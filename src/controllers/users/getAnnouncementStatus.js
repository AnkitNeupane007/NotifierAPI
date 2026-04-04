import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";

const getUserAnnouncementStatus = async (req, res) => {
  const userId = req.params.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const { status: userStatus } = req.query; // Validated and parsed by Zod middleware
  const skip = (page - 1) * limit;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Only run the necessary query based on the requested status
  if (userStatus === "read") {
    const where = {
      userId,
      isRead: true,
    };

    const [readStatuses, total] = await Promise.all([
      prisma.readStatus.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy: { readAt: "desc" },
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
      }),
      prisma.readStatus.count({ where }),
    ]);

    return res.status(200).json({
      status: "success",
      data: {
        read: readStatuses.map((r) => r.announcement),
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
      },
    });
  }

  if (userStatus === "unread") {
    const where = {
      readStatus: {
        none: {
          userId,
          isRead: true,
        },
      },
    };

    const [unread, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.announcement.count({ where }),
    ]);

    return res.status(200).json({
      status: "success",
      data: {
        unread,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
      },
    });
  }
};

export default getUserAnnouncementStatus;
