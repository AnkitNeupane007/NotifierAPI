import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";

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

export default getAnnouncementsById;
