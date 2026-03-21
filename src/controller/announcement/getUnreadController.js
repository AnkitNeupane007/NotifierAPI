import { prisma } from "../../config/db.js";

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

export default getUnread;
