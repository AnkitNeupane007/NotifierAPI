import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import { deleteFiles } from "../../utils/supabaseStorage.js";

const deleteAnnouncementsById = async (req, res) => {
  const announcement = await prisma.announcement.findUnique({
    where: { id: req.params.id },
    include: { attachments: true },
  });

  if (!announcement) {
    throw new AppError("Announcement does not exist.", 404);
  }

  // Delete associated files from Supabase Storage
  if (announcement.attachments && announcement.attachments.length > 0) {
    const filePaths = announcement.attachments.map((att) => att.fileUrl);

    await deleteFiles("attachments", filePaths);
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
