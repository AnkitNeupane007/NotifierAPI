// src/utils/supabaseStorage.js
import { supabase } from "../config/supabase.js";
import AppError from "./AppError.js";

/**
 * Uploads a file buffer to a Supabase storage bucket.
 *
 * @param {Object} file - The file object from multer (req.file)
 * @param {string} bucketName - The Supabase bucket name (e.g., 'profile-pictures', 'attachments')
 * @param {string} folderPath - Optional folder path inside the bucket (e.g., 'users/123')
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
const uploadToSupabase = async (file, bucketName, folderPath = "") => {
  if (!file) throw new AppError("No file provided for upload", 400);

  const { data: existingFiles } = await supabase.storage
    .from(bucketName)
    .list(folderPath);

  // Delete any existing file (handles different extensions)
  if (existingFiles && existingFiles.length > 0) {
    const filesToDelete = existingFiles.map((f) => `${folderPath}/${f.name}`);
    await supabase.storage.from(bucketName).remove(filesToDelete);
  }
  const nameWithoutExt = file.originalname.split(".").slice(0, -1).join(".");
  const extension = file.originalname.split(".").pop();
  let safeName = nameWithoutExt.replace(/\s+/g, "-");
  const fileName = `${safeName}.${extension}`;

  // Construct the full path within the bucket
  const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

  //Upload the file buffer to Supabase
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    throw new AppError(`Supabase upload failed: ${error.message}`, 500);
  }

  return filePath;
};

const getPublicUrl = (bucketName, filePath) => {
  const { data: publicUrl, error } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (error) {
    throw new AppError(`Failed to get public URL: ${error.message}`, 500);
  }

  return publicUrl.publicUrl;
};

const getSignedUrl = async (bucketName, filePath, expiresIn = 30) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    throw new AppError(`Failed to create signed URL: ${error.message}`, 500);
  }

  return data.signedUrl;
};

export { uploadToSupabase, getPublicUrl, getSignedUrl };
