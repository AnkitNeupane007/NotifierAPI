import { prisma } from "../../config/db.js";

const getUnread = async (req, res) => {
  const userId = req.user.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const where = {
    // No readStatus exists for this user or isRead = false
    readStatus: {
      none: {
        userId,
      },
    },
  };

  const [unread, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        priority: true,
        type: true,
        dueDate: true,
        maxScore: true,
      },
      orderBy: { priority: "desc" },
      take: limit,
      skip,
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
};

export default getUnread;
