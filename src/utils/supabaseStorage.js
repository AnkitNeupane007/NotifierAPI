// src/utils/supabaseStorage.js
import { supabase } from "../config/supabase.js";
import AppError from "./AppError.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads a profile picture to the Supabase storage bucket.
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

/**
 * Generic multi-file upload. Does NOT delete existing files.
 * Returns the stored filePath (not a URL) — resolve URLs at request time.
 *
 * @param {Object} file        - multer file object
 * @param {string} bucketName  - Supabase bucket name
 * @param {string} folderPath  - Full folder path inside the bucket
 * @param {string} fileId      - Unique ID prefix for the filename (e.g. attachmentId)
 * @returns {Promise<string>}  - filePath to store in DB
 */
const uploadFile = async (file, bucketName, folderPath, fileId) => {
  if (!file) throw new AppError("No file provided for upload", 400);

  const extension = file.originalname.split(".").pop();
  const nameWithoutExt = file.originalname
    .split(".")
    .slice(0, -1)
    .join(".")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const uuid = uuidv4();

  const fileName = `${nameWithoutExt}-${uuid}.${extension}`;
  const filePath = `${folderPath}/${fileName}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw new AppError(`Upload failed: ${error.message}`, 500);

  return filePath;
};

/**
 * Generic multi-file delete.
 *
 * @param {string}   bucketName
 * @param {string[]} filePaths  - array of fileUrl values from DB records
 */
const deleteFiles = async (bucketName, filePaths) => {
  if (!filePaths?.length) return;

  const { error } = await supabase.storage.from(bucketName).remove(filePaths);

  if (error) throw new AppError(`Delete failed: ${error.message}`, 500);
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

// Multiple files signed url is generated
const getSignedUrls = async (bucketName, filePaths, expiresIn = 30) => {
  if (!filePaths?.length) return [];

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrls(filePaths, expiresIn);

  if (error)
    throw new AppError(`Failed to create signed URLs: ${error.message}`, 500);

  // Supabase returns [{path, signedUrl, error}]
  const failed = data.filter((item) => item.error);
  if (failed.length) {
    throw new AppError(
      `Failed to sign ${failed.length} file(s): ${failed.map((f) => f.path).join(", ")}`,
      500,
    );
  }

  return data.map((item) => ({
    path: item.path,
    signedUrl: item.signedUrl,
  }));
};

export {
  uploadToSupabase,
  getPublicUrl,
  getSignedUrls,
  uploadFile,
  deleteFiles,
};
