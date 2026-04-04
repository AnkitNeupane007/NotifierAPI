import { prisma } from "../../config/db.js";

const getAdminAnnouncements = async (req, res) => {
  // Get pagination values from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const skip = (page - 1) * limit;

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

  // map to make the response cleaner
  const formatted = announcements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    type: a.type,
    priority: a.priority,
    createdAt: a.createdAt,
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

export default getAdminAnnouncements;
