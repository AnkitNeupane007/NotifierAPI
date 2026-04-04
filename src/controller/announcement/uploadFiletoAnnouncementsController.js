import { prisma } from "../../config/db.js";
import { uploadFile } from "../../utils/supabaseStorage.js";
import AppError from "../../utils/AppError.js";

export const uploadFiletoAnnouncements = async (req, res) => {
  const { id } = req.params;

  // Error handling: Check if any body payload was sent
  if (req.body && Object.keys(req.body).length > 0) {
    throw new AppError(
      "This endpoint is strictly for file uploads. Please do not send request body data.",
      400,
    );
  }

  // Error handling: Check if files actually exist in the request
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new AppError(
      "No files uploaded. Please attach files to the request.",
      400,
    );
  }

  // Check if announcement exists
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });

  if (!announcement) {
    throw new AppError("Announcement not found", 404);
  }

  const attachmentRecords = [];

  // Helper function to process uploads
  const processUploads = async (files) => {
    if (!files || files.length === 0) return;

    for (const file of files) {
      // Upload file to Supabase
      const filePath = await uploadFile(
        file,
        "attachments", // bucketName
        `announcements/${announcement.id}`, // folderPath
        file.originalname, // fileId
      );

      // Push the data to our array to save in Prisma later
      attachmentRecords.push({
        filename: file.originalname,
        fileUrl: filePath, // The returned path from Supabase
        fileType: file.mimetype,
        announcementId: announcement.id,
      });
    }
  };

  // Check if there are files attached in the request
  if (req.files) {
    await processUploads(req.files["images"]);
    await processUploads(req.files["documents"]);
  }

  // Bulk create the attachments in the database
  if (attachmentRecords.length > 0) {
    await prisma.announcementAttachment.createMany({
      data: attachmentRecords,
    });
  }

  // Fetch the updated announcement with its attachments
  const updatedAnnouncement = await prisma.announcement.findUnique({
    where: { id: announcement.id },
    include: { attachments: true },
  });

  res.status(200).json({
    status: "success",
    data: updatedAnnouncement,
  });
};

export default uploadFiletoAnnouncements;
