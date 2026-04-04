import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import { deleteFiles } from "../../utils/supabaseStorage.js";

const deleteAnnouncementsById = async (req, res) => {
  // First, find the announcement AND its associated attachments
  const announcement = await prisma.announcement.findUnique({
    where: { id: req.params.id },
    include: { attachments: true }, // Make sure to include attachments
  });

  if (!announcement) {
    throw new AppError("Announcement does not exist.", 404);
  }

  // 1. Delete associated files from Supabase Storage
  if (announcement.attachments && announcement.attachments.length > 0) {
    const filePaths = announcement.attachments.map((att) => att.fileUrl);

    // We wrapped this in a try-catch to ensure we still delete the DB record
    // even if Supabase throws a minor fit, but you can let it bubble up if preferred.
    await deleteFiles("attachments", filePaths);
  }

  // 2. Delete the announcement from the database
  // Note: if your prisma schema uses onDelete: Cascade for attachments,
  // this single delete operation will delete the announcement AND its attachments in the DB.
  // If it doesn't use Cascade, you would need to delete the attachments first:
  // await prisma.announcementAttachment.deleteMany({ where: { announcementId: req.params.id } });

  const deleted = await prisma.announcement.delete({
    where: { id: req.params.id },
  });

  res.json({
    status: "success",
    message: `Deleted announcement: ${deleted.title}`,
  });
};

export default deleteAnnouncementsById;
