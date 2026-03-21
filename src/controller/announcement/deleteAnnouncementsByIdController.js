import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";

const deleteAnnouncementsById = async (req, res) => {
  const announcement = await prisma.announcement.findFirst({
    where: { id: req.params.id },
  });

  if (!announcement) {
    throw new AppError("Announcement does not exist.", 404);
  }

  const deleted = await prisma.announcement.delete({
    where: { id: req.params.id },
  });

  res.json({
    status: "success",
    message: `Deleted announcement: ${deleted.title}`,
  });
};

export default deleteAnnouncementsById;
