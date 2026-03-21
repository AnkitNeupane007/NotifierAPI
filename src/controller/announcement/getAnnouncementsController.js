import { prisma } from "../../config/db.js";

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

export default getAnnouncements;
