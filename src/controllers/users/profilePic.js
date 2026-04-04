import { uploadToSupabase, getPublicUrl } from "../../utils/supabaseStorage.js";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/AppError.js";
import { formatUserResponse } from "../../utils/formatUserResponse.js";

const prisma = new PrismaClient();

const uploadProfilePicture = async (req, res) => {
  const userId = req.user.id;
  const file = req.file;
  const bucketName = "profile-pictures";

  if (!file) {
    throw new AppError("Please upload a file", 400);
  }

  if (!file.mimetype.startsWith("profilePicture/")) {
    throw new AppError("Profile picture must be an image", 400);
  }

  file.originalname = `${userId}.${file.originalname.split(".").pop()}`;

  // Upload to Supabase
  const filePath = await uploadToSupabase(file, bucketName, `user-${userId}`);

  const publicUrl = getPublicUrl(bucketName, filePath);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { profilePictureUrl: publicUrl },
    select: { profilePictureUrl: true, updatedAt: true },
  });

  res.status(200).json({
    status: "success",
    data: formatUserResponse(updatedUser),
  });
};

export { uploadProfilePicture };
