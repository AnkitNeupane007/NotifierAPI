import { prisma } from "../../config/db.js";

const getAnnouncements = async (req, res) => {
  const userId = req.user.id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        priority: true,
        type: true,
        dueDate: true,
        maxScore: true,

        readStatus: {
          where: {
            userId,
          },
          select: {
            isRead: true,
          },
        },
      },
    }),

    prisma.announcement.count(),
  ]);

  const formatted = announcements.map((a) => {
    const isRead = a.readStatus.length > 0 ? a.readStatus[0].isRead : false;

    // remove relation completely
    delete a.readStatus;

    return {
      ...a,
      isRead,
    };
  });

  return res.status(200).json({
    status: "success",
    data: {
      announcements: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
      },
    },
  });
};

export default getAnnouncements;
